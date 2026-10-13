#!/usr/bin/env python3
"""Версии структуры глав: v1 (проза), v2 (7 блоков), v3 (развёрнутые блоки)."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CHAPTERS_DIR = ROOT / 'chapters'
STRUCT_KEYS = ('image', 'quote', 'mission', 'task', 'hypothesis', 'risks', 'description')


def chapter_body_from_raw(raw: str) -> str:
    body = re.sub(r'^## \d+\.[^\n]*\n', '', raw, count=1)
    body = re.sub(r'\n---\s*$', '', body.strip())
    return body.strip()


def normalize_plain(t: str) -> str:
    t = re.sub(r'`([^`]+)`', r'\1', t)
    t = re.sub(r'\*\*([^*]+)\*\*', r'\1', t)
    t = re.sub(r'(?<!\*)\*([^*]+)\*(?!\*)', r'\1', t)
    t = re.sub(r'!\[[^\]]*\]\([^)]+\)', ' ', t)
    t = re.sub(r'^#+\s*', '', t, flags=re.M)
    t = re.sub(r'^>\s?', '', t, flags=re.M)
    t = re.sub(r'\s+', ' ', t).strip()
    return t


def prose_paragraphs(raw_body: str) -> list[str]:
    out = []
    for block in re.split(r'\n\n+', raw_body):
        block = block.strip()
        if not block:
            continue
        if block.startswith('!['):
            continue
        if block.startswith('*Иллюстрация'):
            continue
        if block.startswith('---'):
            continue
        out.append(block)
    return out


def find_extra_paragraph(v2_text: str, paras: list[str], used: set, min_score: int = 2):
    base = normalize_plain(v2_text)
    words = set(re.findall(r'[\wёЁ]{4,}', base.lower(), flags=re.I))
    best = None
    best_score = 0
    for p in paras:
        plain = normalize_plain(p)
        if plain in used or plain in base or len(plain) < 60:
            continue
        pw = set(re.findall(r'[\wёЁ]{4,}', plain.lower(), flags=re.I))
        score = len(words & pw)
        if score >= min_score and score > best_score:
            best_score = score
            best = p
    return best


def find_fallback_paragraph(paras: list[str], used: set, base_plain: str):
    """Доп. абзац из главы без пересечения с уже использованным (без выдумок)."""
    best = None
    best_len = 0
    for p in paras:
        plain = normalize_plain(p)
        if plain in used or plain in base_plain or len(plain) < 80:
            continue
        if len(plain) > best_len:
            best_len = len(plain)
            best = p
    return best


def expand_v3(v2: dict, raw_chapter: str) -> dict:
    v3 = dict(v2)
    paras = prose_paragraphs(chapter_body_from_raw(raw_chapter))
    used: set[str] = set()
    for key in ('quote', 'mission', 'task', 'hypothesis', 'risks', 'description'):
        text = (v3.get(key) or '').strip()
        if not text:
            continue
        extra = find_extra_paragraph(text, paras, used)
        if not extra:
            extra = find_extra_paragraph(text, paras, used, min_score=1)
        if not extra and key in ('description', 'mission', 'hypothesis'):
            extra = find_fallback_paragraph(paras, used, normalize_plain(text))
        if extra:
            used.add(normalize_plain(extra))
            v3[key] = text + '\n\n' + extra
    return v3


def ensure_chapter_versions(chapter_md_raw: dict, blocks_data: dict) -> None:
    CHAPTERS_DIR.mkdir(exist_ok=True)
    manifest = {'version_ids': ['v1', 'v2', 'v3'], 'notes': {
        'v1': 'Исходный текст главы (markdown из ARTICLE.md, снимок при первом создании файла).',
        'v2': 'Семь структурных блоков.',
        'v3': 'Развёрнутые блоки на основе v2 и текста главы.',
    }}
    (CHAPTERS_DIR / 'manifest.json').write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8'
    )
    for n in range(1, 15):
        ch_dir = CHAPTERS_DIR / f'{n:02d}'
        ch_dir.mkdir(parents=True, exist_ok=True)
        raw = chapter_md_raw.get(n, '')
        v1_path = ch_dir / 'v1.md'
        if not v1_path.exists() and raw:
            v1_path.write_text(chapter_body_from_raw(raw) + '\n', encoding='utf-8')
        v2_path = ch_dir / 'v2.json'
        if not v2_path.exists():
            block = blocks_data.get(str(n), {})
            v2_path.write_text(json.dumps(block, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        v3_path = ch_dir / 'v3.json'
        if not v3_path.exists() and raw:
            v2 = json.loads(v2_path.read_text(encoding='utf-8'))
            v3 = expand_v3(v2, raw)
            v3_path.write_text(json.dumps(v3, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def load_version_blocks(ch_num: int, version: int, blocks_data: dict, fig: dict | None) -> dict:
    ch_dir = CHAPTERS_DIR / f'{ch_num:02d}'
    if version == 2:
        v2_path = ch_dir / 'v2.json'
        if v2_path.exists():
            return json.loads(v2_path.read_text(encoding='utf-8'))
        return blocks_data.get(str(ch_num), {})
    if version == 3:
        v3_path = ch_dir / 'v3.json'
        if v3_path.exists():
            return json.loads(v3_path.read_text(encoding='utf-8'))
        v2 = load_version_blocks(ch_num, 2, blocks_data, fig)
        raw = ''  # caller may pass — handled in build
        return v2
    return blocks_data.get(str(ch_num), {})


def load_v1_markdown(ch_num: int, chapter_md_raw: dict) -> str:
    v1_path = CHAPTERS_DIR / f'{ch_num:02d}' / 'v1.md'
    if v1_path.exists():
        return v1_path.read_text(encoding='utf-8')
    raw = chapter_md_raw.get(ch_num, '')
    return chapter_body_from_raw(raw) if raw else ''


def version_inventory() -> list[dict]:
    rows = []
    for n in range(1, 15):
        ch_dir = CHAPTERS_DIR / f'{n:02d}'
        present = []
        for vid, name in (('v1', 'v1.md'), ('v2', 'v2.json'), ('v3', 'v3.json')):
            if (ch_dir / name).exists():
                present.append(vid)
        rows.append({'chapter': n, 'versions': present})
    return rows
