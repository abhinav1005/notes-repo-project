#!/usr/bin/env python3
"""
Notes processing pipeline.

Reads .md files from notes/, calls Claude API for tags/summary if missing,
and upserts into knowledge-hub/src/Data/entries.json.

Usage:
    python backend/process_notes.py                      # process all notes
    CHANGED_FILES="notes/foo.md" python backend/process_notes.py
"""

import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

import anthropic
import frontmatter
from dotenv import load_dotenv

# Load API keys from root .env (ignored in GitHub Actions where secrets are injected directly)
load_dotenv(Path(__file__).parent.parent / ".env")

ROOT = Path(__file__).parent.parent
NOTES_DIR = ROOT / "notes"
ENTRIES_PATH = ROOT / "knowledge-hub" / "src" / "Data" / "entries.json"

client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])


def slugify(name: str) -> str:
    name = name.lower()
    name = re.sub(r"[^a-z0-9]+", "-", name)
    return name.strip("-")


def get_all_note_files() -> list[str]:
    if not NOTES_DIR.exists():
        return []
    return [f"notes/{f.name}" for f in sorted(NOTES_DIR.glob("*.md"))]


def generate_metadata(title: str, type_: str, body: str) -> dict:
    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=512,
        messages=[
            {
                "role": "user",
                "content": f"""You are indexing a personal knowledge base note. Generate metadata for it.

Title: {title}
Type: {type_}

Content:
{body[:3000]}

Return a JSON object with exactly two fields:
- "tags": array of 3-6 lowercase kebab-case strings (e.g. "distributed-systems", "caching")
- "summary": a 2-3 sentence summary of the key ideas

Return only the raw JSON object, no markdown fences, no extra text.""",
            }
        ],
    )
    return json.loads(response.content[0].text.strip())


def main():
    changed_env = os.environ.get("CHANGED_FILES", "").strip()
    if changed_env:
        changed_files = [f for f in changed_env.split() if f.endswith(".md")]
    else:
        changed_files = get_all_note_files()

    if not changed_files:
        print("No markdown files to process.")
        return

    print(f"Processing {len(changed_files)} file(s): {', '.join(changed_files)}")

    try:
        entries: list[dict] = json.loads(ENTRIES_PATH.read_text())
    except (FileNotFoundError, json.JSONDecodeError):
        entries = []

    now = datetime.now(timezone.utc).isoformat()
    processed = 0

    for rel_path in changed_files:
        full_path = ROOT / rel_path

        if not full_path.exists():
            print(f"  Skipping (not found): {rel_path}")
            continue

        post = frontmatter.load(str(full_path))
        body: str = post.content
        fm: dict = post.metadata

        if not fm.get("title"):
            print(f"  Skipping (no title in frontmatter): {rel_path}")
            continue

        entry_id = slugify(full_path.stem)
        type_ = fm.get("type", "note")
        existing = next((e for e in entries if e["entryId"] == entry_id), None)

        tags = fm.get("tags") or None
        summary = (fm.get("summary") or "").strip() or None

        if not tags or not summary:
            print(f'  Calling Claude for metadata on "{fm["title"]}"...', end=" ", flush=True)
            try:
                meta = generate_metadata(fm["title"], type_, body)
                tags = tags or meta["tags"]
                summary = summary or meta["summary"]
                print("done")
            except Exception as e:
                print(f"failed: {e}")
                continue
        else:
            print(f'  Using existing metadata for "{fm["title"]}"')

        entry = {
            "entryId": entry_id,
            "type": type_,
            "title": fm["title"],
            "tags": tags,
            "summary": summary,
            "content": body.strip(),
            "sourceUrl": fm.get("sourceUrl", ""),
            "sourceFile": rel_path,
            "createdAt": existing["createdAt"] if existing else now,
            "updatedAt": now,
        }

        idx = next((i for i, e in enumerate(entries) if e["entryId"] == entry_id), -1)
        if idx >= 0:
            entries[idx] = entry
        else:
            entries.append(entry)

        processed += 1

    # Sort newest first
    entries.sort(key=lambda e: e["updatedAt"], reverse=True)

    ENTRIES_PATH.write_text(json.dumps(entries, indent=2) + "\n")
    print(f"\nProcessed {processed} note(s). {len(entries)} total entries in {ENTRIES_PATH}")


if __name__ == "__main__":
    main()
