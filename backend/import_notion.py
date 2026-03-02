#!/usr/bin/env python3
"""
Import Notion markdown exports into notes/.

Handles:
  - Zip files or extracted folders
  - UUID suffixes in filenames  (e.g. "Backend notes 311e403b...f6f.md")
  - URL-encoded image paths     (e.g. "Backend%20notes/Screenshot.png")
  - Adds YAML frontmatter with title extracted from the first # heading
  - Copies images to notes/images/

Usage:
    python backend/import_notion.py export.zip
    python backend/import_notion.py path/to/extracted-folder/
    python backend/import_notion.py path/to/single-file.md
"""

import re
import sys
import shutil
import zipfile
import tempfile
from pathlib import Path
from urllib.parse import unquote

ROOT     = Path(__file__).parent.parent
NOTES    = ROOT / "notes"
IMAGES   = NOTES / "images"


# ── helpers ──────────────────────────────────────────────────────────────────

def slugify(name: str) -> str:
    """'Backend notes 311e403b7020801682efd68541672f6f' → 'backend-notes'"""
    name = re.sub(r'\s+[0-9a-f]{32}$', '', name.strip())   # strip Notion UUID
    name = name.lower()
    name = re.sub(r'[^a-z0-9]+', '-', name)
    return name.strip('-')


def extract_title(content: str, fallback: str) -> tuple[str, str]:
    """
    Pull the title from the first # heading and return (title, remaining_content).
    If no heading found, use fallback (slugified filename turned back to words).
    """
    lines = content.splitlines()
    for i, line in enumerate(lines):
        m = re.match(r'^#\s+(.+)$', line)
        if m:
            title = m.group(1).strip()
            # Remove Notion UUID from title too if present
            title = re.sub(r'\s+[0-9a-f]{32}$', '', title).strip()
            remaining = '\n'.join(lines[i + 1:]).lstrip('\n')
            return title, remaining
    return fallback.replace('-', ' ').title(), content


def fix_image_paths(content: str) -> str:
    """Rewrite any relative image path to ./images/filename."""
    def replace(m):
        alt  = m.group(1)
        path = unquote(m.group(2))   # decode %20 etc.
        # skip already-absolute or external URLs
        if path.startswith(('http://', 'https://', '/', 'data:')):
            return m.group(0)
        filename = Path(path).name
        return f'![{alt}](./images/{filename})'

    return re.sub(r'!\[([^\]]*)\]\(([^)]+)\)', replace, content)


def build_frontmatter(title: str) -> str:
    # Escape double-quotes inside the title
    safe = title.replace('"', '\\"')
    return f'---\ntitle: "{safe}"\ntype: note\n---\n\n'


# ── core import ───────────────────────────────────────────────────────────────

def import_md(md_path: Path) -> None:
    NOTES.mkdir(exist_ok=True)
    IMAGES.mkdir(exist_ok=True)

    raw     = md_path.read_text(encoding='utf-8')
    slug    = slugify(md_path.stem)
    title, body = extract_title(raw, slug)

    # Fix image paths in body
    body = fix_image_paths(body)

    # Copy images from the sibling Notion image folder.
    # Notion names the folder WITHOUT the UUID, but the .md file has it.
    # e.g. "Backend notes 311e403b.md" → folder is "Backend notes/"
    stem_no_uuid = re.sub(r'\s+[0-9a-f]{32}$', '', md_path.stem).strip()
    img_folder = md_path.parent / stem_no_uuid
    if img_folder.exists() and img_folder.is_dir():
        for img in img_folder.iterdir():
            if img.is_file() and not img.name.startswith('.'):
                dest = IMAGES / img.name
                shutil.copy2(img, dest)
                print(f"    image: {img.name}")

    # Write final .md with frontmatter
    out = NOTES / f"{slug}.md"
    out.write_text(build_frontmatter(title) + body, encoding='utf-8')
    print(f"  → notes/{slug}.md  (title: \"{title}\")")


def import_from_dir(folder: Path) -> None:
    md_files = sorted(folder.rglob('*.md'))
    if not md_files:
        print("No .md files found.")
        return
    print(f"Found {len(md_files)} file(s):\n")
    for md in md_files:
        import_md(md)


# ── entry point ───────────────────────────────────────────────────────────────

def main() -> None:
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    source = Path(sys.argv[1])
    if not source.exists():
        print(f"Error: {source} does not exist")
        sys.exit(1)

    if source.suffix == '.zip':
        print(f"Extracting {source.name}…")
        with tempfile.TemporaryDirectory() as tmp:
            with zipfile.ZipFile(source, 'r') as z:
                z.extractall(tmp)
            import_from_dir(Path(tmp))
    elif source.is_dir():
        import_from_dir(source)
    elif source.suffix == '.md':
        import_md(source)
    else:
        print(f"Error: expected a .zip, a folder, or a .md file — got {source}")
        sys.exit(1)

    print("\nDone. Review notes/ then push to trigger the pipeline.")


if __name__ == '__main__':
    main()
