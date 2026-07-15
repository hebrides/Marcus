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
        "lacuscurtius-loeb": LacusCurtiusProfile(),
    }
    if name not in profiles:
        raise ValueError(f"Unsupported profile: {name}")
    return profiles[name]


def main():
    parser = argparse.ArgumentParser(description="Parse Stoic HTML sources into Marcus work JSON format")
    parser.add_argument("--profile", required=True, choices=["gutenberg", "lacuscurtius-loeb"])
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
