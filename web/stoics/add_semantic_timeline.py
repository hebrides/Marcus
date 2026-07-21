#!/usr/bin/env python3
"""Add text-weighted semantic timelines to legacy Marcus work JSON files."""

import argparse
import html
import json
import re
from pathlib import Path


ID_TAG_RE = re.compile(r'<[^>]*\bid=(["\'])(?P<id>.*?)\1[^>]*>', re.IGNORECASE | re.DOTALL)
TAG_RE = re.compile(r"<[^>]+>")
WORD_RE = re.compile(r"\b[\w'-]+\b", re.UNICODE)


def text_word_count(value):
    plain_text = html.unescape(TAG_RE.sub(" ", value)).replace("\xa0", " ")
    return len(WORD_RE.findall(plain_text))


def build_timeline(partitions):
    ids = []
    word_offsets = []
    total_words = 0

    for partition in partitions:
        previous_end = 0
        for id_tag in ID_TAG_RE.finditer(partition):
            total_words += text_word_count(partition[previous_end:id_tag.start()])
            ids.append(id_tag.group("id"))
            word_offsets.append(total_words)
            previous_end = id_tag.end()
        total_words += text_word_count(partition[previous_end:])

    if not ids or total_words == 0:
        raise ValueError("No semantic reading elements were found.")

    return {"ids": ids, "wordOffsets": word_offsets, "totalWords": total_words}


def add_timeline(path):
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, list) or len(data) < 2 or not all(isinstance(item, list) for item in data[:2]):
        raise ValueError(f"{path}: unsupported work JSON format")

    timeline = build_timeline(data[1])
    if len(data) == 2:
        data.append(timeline)
    else:
        data[2] = timeline
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"{path}: {len(timeline['ids'])} anchors, {timeline['totalWords']} words")


def main():
    parser = argparse.ArgumentParser(description="Add semantic timelines to Marcus work JSON files.")
    parser.add_argument("work_files", nargs="+", type=Path)
    args = parser.parse_args()

    for path in args.work_files:
        add_timeline(path)


if __name__ == "__main__":
    main()
