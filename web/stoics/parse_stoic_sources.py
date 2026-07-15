#!/usr/bin/env python3
import argparse
import html
import json
import re
from dataclasses import dataclass
from html.parser import HTMLParser
from pathlib import Path
from urllib.request import Request, urlopen

TAG_RE = re.compile(r"<[^>]+>")
WS_RE = re.compile(r"\s+")


def clean_text(value: str) -> str:
    value = TAG_RE.sub(" ", value)
    value = html.unescape(value)
    return WS_RE.sub(" ", value.replace("\xa0", " ")).strip()


class HeadingParagraphParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self._stack = []
        self._chunks = []
        self.items = []

    def handle_starttag(self, tag, attrs):
        self._stack.append(tag.lower())

    def handle_endtag(self, tag):
        tag = tag.lower()
        if self._stack:
            self._stack.pop()
        if tag in {"h1", "h2", "h3", "h4", "p"}:
            text = clean_text("".join(self._chunks))
            self._chunks = []
            if text:
                kind = "heading" if tag.startswith("h") else "paragraph"
                self.items.append((kind, text))

    def handle_data(self, data):
        if not self._stack:
            return
        content_tags = {"h1", "h2", "h3", "h4", "p"}
        if any(tag in content_tags for tag in self._stack):
            self._chunks.append(data)


class BilingualEnglishParser(HTMLParser):
    """Parser for Gutenberg dual-language (Latin/English) pages.

    Extracts content from two sources:
    - ``<h2>``/``<h3>`` headings that appear at the top level between section pairs
      (e.g. "BOOK I — MORAL GOODNESS") as section separators.
    - Paragraph text only from ``<div class="english">`` blocks, skipping
      the paired ``<div class="latin" lang="la">`` blocks.
    - ``<div class="sidenote">`` labels inside English sections are used as
      sub-section headings to give a finer-grained structure (e.g.
      "The importance of duty", "Types of moral goodness").
    """

    def __init__(self):
        super().__init__()
        self._stack = []
        self._chunks = []
        self.items = []
        self._in_english = 0     # nesting depth of <div class="english">
        self._in_latin = 0       # nesting depth of <div class="latin">
        self._in_sidenote = 0    # nesting depth of <div class="sidenote">
        self._sidenote_chunks = []

    def _div_class(self, attrs):
        return set(dict(attrs).get("class", "").split())

    def handle_starttag(self, tag, attrs):
        tag = tag.lower()
        if tag == "div":
            classes = self._div_class(attrs)
            if "english" in classes:
                self._in_english += 1
            elif "latin" in classes:
                self._in_latin += 1
            elif "sidenote" in classes and self._in_english > 0:
                self._in_sidenote += 1
        # Void elements never have a matching end tag; skip them in the stack
        # so stale tags (especially <h2>/<h3>) don't confuse handle_data.
        _VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input",
                 "link", "meta", "param", "source", "track", "wbr"}
        if tag not in _VOID:
            self._stack.append(tag)

    def handle_endtag(self, tag):
        tag = tag.lower()
        if self._stack:
            self._stack.pop()
        # Flush headings (when not inside a latin block)
        if tag in {"h2", "h3", "h4"} and self._in_latin == 0:
            text = clean_text("".join(self._chunks))
            self._chunks = []
            if text:
                self.items.append(("heading", text))
            return
        # Flush paragraphs inside english blocks (not inside sidenotes)
        if tag == "p" and self._in_english > 0 and self._in_sidenote == 0:
            text = clean_text("".join(self._chunks))
            self._chunks = []
            if text:
                self.items.append(("paragraph", text))
            return
        # Flush sidenote text as a sub-heading
        if tag == "div" and self._in_sidenote > 0:
            self._in_sidenote -= 1
            text = clean_text("".join(self._sidenote_chunks))
            self._sidenote_chunks = []
            if text:
                self.items.append(("heading", text))
            return
        if tag == "div":
            if self._in_english > 0:
                self._in_english -= 1
            elif self._in_latin > 0:
                self._in_latin -= 1

    def handle_data(self, data):
        content_tags = {"h2", "h3", "h4", "p"}
        in_heading = any(t in {"h2", "h3", "h4"} for t in self._stack)
        # Collect heading data outside latin blocks
        if in_heading and self._in_latin == 0:
            self._chunks.append(data)
            return
        # Collect sidenote data (becomes sub-headings)
        if self._in_sidenote > 0:
            self._sidenote_chunks.append(data)
            return
        # Collect paragraph data inside english blocks
        if self._in_english > 0 and "p" in self._stack:
            self._chunks.append(data)


@dataclass
class ParsedWork:
    title: str
    sections: list


class SourceProfile:
    name = "base"

    def parse(self, html_doc: str) -> ParsedWork:
        raise NotImplementedError


class GutenbergProfile(SourceProfile):
    name = "gutenberg"

    def parse(self, html_doc: str) -> ParsedWork:
        parser = HeadingParagraphParser()
        parser.feed(html_doc)
        sections = split_into_sections(parser.items)
        title = sections[0]["title"] if sections else "Untitled"
        return ParsedWork(title=title, sections=sections)


class LacusCurtiusProfile(SourceProfile):
    name = "lacuscurtius-loeb"

    def parse(self, html_doc: str) -> ParsedWork:
        parser = HeadingParagraphParser()
        parser.feed(html_doc)
        sections = split_into_sections(parser.items, min_section_size=2)
        title = sections[0]["title"] if sections else "Untitled"
        return ParsedWork(title=title, sections=sections)


class GutenbergBilingualProfile(SourceProfile):
    """Profile for Gutenberg parallel-text (Latin/English) editions.

    Extracts only the English translation side, identified by
    ``<div class="english">`` blocks, and ignores sidenote annotations.
    """

    name = "gutenberg-bilingual"

    def parse(self, html_doc: str) -> ParsedWork:
        parser = BilingualEnglishParser()
        parser.feed(html_doc)
        sections = split_into_sections(parser.items)
        title = sections[0]["title"] if sections else "Untitled"
        return ParsedWork(title=title, sections=sections)


def split_into_sections(items, min_section_size=1):
    sections = []
    current = None

    for kind, text in items:
        if kind == "heading":
            current = {"title": text, "paragraphs": []}
            sections.append(current)
            continue
        if current is None:
            current = {"title": "Preface", "paragraphs": []}
            sections.append(current)
        current["paragraphs"].append(text)

    return [s for s in sections if len(s["paragraphs"]) >= min_section_size]


def partition_html(elements, max_chars=22000):
    partitions, indexes = [], []
    current, current_len, current_start = [], 0, None

    for element_id, element_html in elements:
        if current_start is None:
            current_start = element_id
        element_len = len(element_html)
        if current and current_len + element_len > max_chars:
            partitions.append("".join(current))
            indexes.append(current_start)
            current = [element_html]
            current_len = element_len
            current_start = element_id
        else:
            current.append(element_html)
            current_len += element_len

    if current:
        partitions.append("".join(current))
        indexes.append(current_start)

    return [indexes, partitions]


def to_reader_json(parsed: ParsedWork):
    elements = []
    quotes = []
    for sec_idx, section in enumerate(parsed.sections, start=1):
        sec_id = str(sec_idx)
        elements.append((sec_id, f'<h3 id="{sec_id}">{html.escape(section["title"])}</h3>'))
        for para_idx, para in enumerate(section["paragraphs"], start=1):
            para_id = f"{sec_idx}.{para_idx}"
            elements.append((para_id, f'<p id="{para_id}">{html.escape(para)}</p>'))
        first = section["paragraphs"][0].strip()
        if first:
            preview = first[:277].rstrip() + "..." if len(first) > 280 else first
            quotes.append({"location": f"{sec_idx}.1", "quote": preview})

    return partition_html(elements), quotes


def fetch_html(url: str) -> str:
    request = Request(url, headers={"User-Agent": "MarcusStoicParser/1.0"})
    with urlopen(request, timeout=30) as response:
        return response.read().decode("utf-8", errors="ignore")


def load_input(url: str, input_file: Path) -> str:
    if input_file:
        return input_file.read_text(encoding="utf-8")
    if not url:
        raise ValueError("Either --url or --input-file is required")
    return fetch_html(url)


def get_profile(name: str) -> SourceProfile:
    profiles = {
        "gutenberg": GutenbergProfile(),
        "gutenberg-bilingual": GutenbergBilingualProfile(),
        "lacuscurtius-loeb": LacusCurtiusProfile(),
    }
    if name not in profiles:
        raise ValueError(f"Unsupported profile: {name}")
    return profiles[name]


def main():
    parser = argparse.ArgumentParser(description="Parse Stoic HTML sources into Marcus work JSON format")
    parser.add_argument("--profile", required=True, choices=["gutenberg", "gutenberg-bilingual", "lacuscurtius-loeb"])
    parser.add_argument("--url", help="Source URL to parse")
    parser.add_argument("--input-file", type=Path, help="Local HTML file to parse")
    parser.add_argument("--output", type=Path, required=True, help="Output path for work JSON")
    parser.add_argument("--quotes-output", type=Path, help="Optional output path for generated quotes list")
    parser.add_argument("--work-id", help="Optional workId to stamp onto quote objects")
    args = parser.parse_args()

    html_doc = load_input(args.url, args.input_file)
    profile = get_profile(args.profile)
    parsed = profile.parse(html_doc)
    work_data, quotes = to_reader_json(parsed)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(work_data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    if args.quotes_output:
        args.quotes_output.parent.mkdir(parents=True, exist_ok=True)
        payload = [{"workId": args.work_id, **q} if args.work_id else q for q in quotes]
        args.quotes_output.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print(f"Profile: {profile.name}")
    print(f"Title: {parsed.title}")
    print(f"Sections: {len(parsed.sections)}")
    print(f"Quotes: {len(quotes)}")
    print(f"Wrote: {args.output}")


if __name__ == "__main__":
    main()
