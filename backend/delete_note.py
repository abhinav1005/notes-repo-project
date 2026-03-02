#!/usr/bin/env python3
"""
Delete a note and any images used exclusively by it.

Images referenced by other notes are left untouched.
Also removes the entry from entries.json so it disappears from the site.

Usage:
    python backend/delete_note.py backend-notes
    python backend/delete_note.py backend-notes.md
"""

import re
import sys
import json
from pathlib import Path

ROOT        = Path(__file__).parent.parent
NOTES       = ROOT / "notes"
NOTES_IMGS  = NOTES / "images"
PUBLIC_IMGS = ROOT / "knowledge-hub" / "public" / "images"
ENTRIES     = ROOT / "knowledge-hub" / "src" / "Data" / "entries.json"


def images_in(content: str) -> set[str]:
    """Return set of image filenames referenced in a markdown file."""
    return set(re.findall(r'!\[[^\]]*\]\(\.?/images/([^)]+)\)', content))


def main() -> None:
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    arg = sys.argv[1]
    slug = arg.removesuffix('.md')
    note_path = NOTES / f"{slug}.md"

    if not note_path.exists():
        # Try to find a close match
        candidates = list(NOTES.glob('*.md'))
        names = [p.stem for p in candidates]
        print(f"Error: notes/{slug}.md not found.")
        if names:
            print(f"Available notes: {', '.join(names)}")
        sys.exit(1)

    # Images referenced by this note
    content = note_path.read_text(encoding='utf-8')
    target_imgs = images_in(content)

    # Images referenced by every OTHER note
    other_imgs: set[str] = set()
    for other in NOTES.glob('*.md'):
        if other == note_path:
            continue
        other_imgs |= images_in(other.read_text(encoding='utf-8'))

    exclusive = target_imgs - other_imgs   # safe to delete
    shared    = target_imgs & other_imgs   # keep — used elsewhere

    # ── delete note ───────────────────────────────────────────────────────────
    note_path.unlink()
    print(f"Deleted  notes/{slug}.md")

    # ── delete exclusive images ───────────────────────────────────────────────
    for name in sorted(exclusive):
        for folder in (NOTES_IMGS, PUBLIC_IMGS):
            p = folder / name
            if p.exists():
                p.unlink()
                print(f"Deleted  {p.relative_to(ROOT)}")

    if shared:
        print(f"Kept     shared images: {', '.join(sorted(shared))}")

    # ── remove from entries.json ──────────────────────────────────────────────
    try:
        raw = json.loads(ENTRIES.read_text())
        cleaned = [e for e in raw if e.get('entryId') != slug]
        if len(cleaned) < len(raw):
            ENTRIES.write_text(json.dumps(cleaned, indent=2) + '\n')
            print(f"Removed  from entries.json")
        else:
            print(f"Note was not in entries.json (pipeline hadn't run yet)")
    except (FileNotFoundError, json.JSONDecodeError):
        pass

    print(f"\nDone. Push to update the live site.")


if __name__ == '__main__':
    main()
