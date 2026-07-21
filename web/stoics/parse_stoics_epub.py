#!/usr/bin/env python3
import argparse
import html
import json
import re
import zipfile
from pathlib import Path

P_TAG_RE = re.compile(r"<p\b[^>]*>(.*?)</p>", re.IGNORECASE | re.DOTALL)
TAG_RE = re.compile(r"<[^>]+>")
SPLIT_FILE_RE = re.compile(r"index_split_(\d+)\.html$")


WORKS = [
    {
        "name": "gold",
        "start_file": 16,
        "end_file": 205,
        "heading": "roman",
        "output": "web/stoics/epictetus/gold.json",
        "work_id": "4",
        "locationSyntax": ["Section", "Verse"],
    },
    {
        "name": "fragments",
        "start_file": 206,
        "end_file": 230,
        "heading": "roman",
        "output": "web/stoics/epictetus/fragments.json",
        "work_id": "10",
        "locationSyntax": ["Fragment", "Verse"],
    },
    {
        "name": "discourses",
        "start_file": 231,
        "end_file": 300,
        "heading": "all_caps",
        "output": "web/stoics/epictetus/discourses.json",
        "work_id": "3",
        "locationSyntax": ["Chapter", "Verse"],
    },
    {
        "name": "letters",
        "start_file": 301,
        "end_file": 425,
        "heading": "letters",
        "output": "web/stoics/seneca/letters.json",
        "work_id": "2",
        "locationSyntax": ["Letter", "Verse"],
    },
    {
        "name": "enchiridion",
        "start_file": 437,
        "end_file": 490,
        "heading": "numeric",
        "output": "web/stoics/epictetus/enchiridion.json",
        "work_id": "5",
        "locationSyntax": ["Section", "Verse"],
    },
]


def strip_tags(value: str) -> str:
    value = TAG_RE.sub(" ", value)
    value = html.unescape(value)
    value = value.replace("\xa0", " ")
    return " ".join(value.split())


def extract_file_map(epub_path: Path):
    with zipfile.ZipFile(epub_path, "r") as zf:
        mapping = {}
        for name in zf.namelist():
            m = SPLIT_FILE_RE.search(name)
            if not m:
                continue
            idx = int(m.group(1))
            mapping[idx] = zf.read(name).decode("utf-8", errors="ignore")
        return mapping


def iter_paragraphs(file_html: str):
    for inner in P_TAG_RE.findall(file_html):
        text = strip_tags(inner)
        if not text:
            continue
        yield {
            "text": text,
            "is_bold": 'class="bold"' in inner,
        }


def is_heading(text: str, mode: str) -> bool:
    if mode == "roman":
        return bool(re.fullmatch(r"[IVXLCDM]+", text))
    if mode == "numeric":
        return bool(re.fullmatch(r"\d+", text))
    if mode == "letters":
        return text.lower().startswith("letter ")
    if mode == "all_caps":
        return text.upper() == text and len(text) > 8
    return False


def partition_html(elements, max_chars=22000):
    partitions = []
    index_list = []
    current = []
    current_len = 0
    current_start = None

    for element_id, element_html in elements:
        if current_start is None:
            current_start = element_id
        element_len = len(element_html)
        if current and current_len + element_len > max_chars:
            partitions.append("".join(current))
            index_list.append(current_start)
            current = [element_html]
            current_len = element_len
            current_start = element_id
        else:
            current.append(element_html)
            current_len += element_len

    if current:
        partitions.append("".join(current))
        index_list.append(current_start)

    return [index_list, partitions, build_semantic_timeline(elements)]


def build_semantic_timeline(elements):
    ids = []
    word_offsets = []
    total_words = 0

    for element_id, element_html in elements:
        ids.append(element_id)
        word_offsets.append(total_words)
        total_words += len(strip_tags(element_html).split())

    return {
        "ids": ids,
        "wordOffsets": word_offsets,
        "totalWords": total_words,
    }


def parse_work(file_map, start_file, end_file, heading_mode):
    sections = []
    current = None

    for idx in range(start_file, end_file + 1):
        content = file_map.get(idx, "")
        for para in iter_paragraphs(content):
            text = para["text"]
            if para["is_bold"] and is_heading(text, heading_mode):
                current = {"title": text, "paragraphs": []}
                sections.append(current)
                continue
            if current is None:
                continue
            current["paragraphs"].append(text)

    # Remove empty sections caused by decorative headings
    return [s for s in sections if s["paragraphs"]]


def to_work_json(sections):
    elements = []
    quotes = []

    for sec_idx, section in enumerate(sections, start=1):
        sec_id = str(sec_idx)
        heading_html = f'<h3 id="{sec_id}">{html.escape(section["title"])}</h3>'
        elements.append((sec_id, heading_html))

        for para_idx, para in enumerate(section["paragraphs"], start=1):
            para_id = f"{sec_idx}.{para_idx}"
            para_html = f'<p id="{para_id}">{html.escape(para)}</p>'
            elements.append((para_id, para_html))

        first_para = section["paragraphs"][0].strip()
        if first_para:
            quote = first_para
            if len(quote) > 280:
                quote = quote[:277].rstrip() + "..."
            quotes.append({"location": f"{sec_idx}.1", "quote": quote})

    return partition_html(elements), quotes


def update_meta(meta_path: Path):
    meta = json.loads(meta_path.read_text(encoding="utf-8"))
    target = {"2", "3", "4", "5", "10"}

    work_updates = {
        "2": {"title": "Letters from a Stoic", "dataUri": "stoics/seneca/letters.json", "locationSyntax": ["Letter", "Verse"]},
        "3": {"title": "The Discourses", "dataUri": "stoics/epictetus/discourses.json", "locationSyntax": ["Chapter", "Verse"]},
        "4": {"title": "The Golden Sayings", "dataUri": "stoics/epictetus/gold.json", "locationSyntax": ["Section", "Verse"]},
        "5": {"title": "The Enchiridion", "dataUri": "stoics/epictetus/enchiridion.json", "locationSyntax": ["Section", "Verse"]},
        "10": {"title": "Fragments", "dataUri": "stoics/epictetus/fragments.json", "locationSyntax": ["Fragment", "Verse"]},
    }

    works = [w for w in meta["works"] if w["id"] not in target]
    for work_id in ["5", "3", "4", "10", "2"]:
        data = work_updates[work_id]
        works.append({
            "id": work_id,
            "authorId": "2" if work_id in {"3", "4", "5", "10"} else "3",
            "title": data["title"],
            "locationSyntax": data["locationSyntax"],
            "dataUri": data["dataUri"],
            "data": None,
            "version": "1.1.0",
        })

    meta["works"] = works
    meta["version"] = "1.1.0"
    meta["quotes"]["version"] = "1.1.0"
    meta_path.write_text(json.dumps(meta, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def merge_quotes(quotes_path: Path, generated_quotes):
    existing = json.loads(quotes_path.read_text(encoding="utf-8"))
    replaced_ids = {"2", "3", "4", "5", "10"}
    kept = [q for q in existing if str(q.get("workId")) not in replaced_ids]

    merged = kept + generated_quotes
    quotes_path.write_text(json.dumps(merged, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def main():
    parser = argparse.ArgumentParser(description="Parse Stoics EPUB into Marcus app JSON files")
    parser.add_argument("epub", type=Path, help="Path to stoics.epub")
    parser.add_argument("--repo-root", type=Path, default=Path(__file__).resolve().parents[2])
    args = parser.parse_args()

    file_map = extract_file_map(args.epub)
    generated_quotes = []

    for work in WORKS:
        sections = parse_work(file_map, work["start_file"], work["end_file"], work["heading"])
        work_data, quotes = to_work_json(sections)
        output_path = args.repo_root / work["output"]
        output_path.write_text(json.dumps(work_data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        for quote in quotes:
            generated_quotes.append({"workId": work["work_id"], "location": quote["location"], "quote": quote["quote"]})
        print(f"Generated {work['name']}: {len(sections)} sections, {len(quotes)} quotes")

    merge_quotes(args.repo_root / "web/data-all-quotes.json", generated_quotes)
    update_meta(args.repo_root / "web/data-meta.json")


if __name__ == "__main__":
    main()
