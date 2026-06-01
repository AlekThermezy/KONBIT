#!/usr/bin/env python3
"""
KONBIT Daily Background Image Sync
Queries Wikimedia Commons for Haitian cultural imagery,
downloads to /var/www/KONBIT/public/images/backgrounds/,
rotates daily, and stores current image path in manifest.
"""

import os
import sys
import json
import time
import hashlib
import logging
from datetime import datetime
from pathlib import Path

import requests

# ── Config ────────────────────────────────────────────────────────────────────
VPS_DIR    = "/var/www/KONBIT"
BG_DIR     = os.path.join(VPS_DIR, "public/images/backgrounds")
MANIFEST   = os.path.join(BG_DIR, "manifest.json")
CURRENT    = os.path.join(BG_DIR, "current.txt")
LOG_FILE   = "/var/log/konbit-bg-sync.log"
MAX_IMAGES = 60   # keep up to N images in rotation
DAILY_NEW  = 5    # download N fresh images per sync

SEARCH_TERMS = [
    "Haiti landscape",
    "Cap-Haïtien Haiti",
    "Citadelle Laferrière",
    "Sans-Souci Palace Haiti",
    "Haitian art market",
    "Vodou Haiti",
    "Haitian music carnival",
    "Haitian architecture",
    "Port-au-Prince",
    "Ile de la Tortue Haiti",
    "Gonâve Island Haiti",
    "Haitian marketplace",
    "Haitian independence",
    "Haitian flag ceremony",
    "Haitian agriculture farm",
    "Haitian diaspora",
    "Jacmel Haiti art",
    "Haitian textiles",
    "Haitian rum distillery",
    "Haitian coastal village",
]

WIKIPEDIA_SEARCH_URL = "https://en.wikipedia.org/w/api.php"

HEADERS = {
    "User-Agent": "KONBIT-ImageSync/1.0 (Haitian diaspora platform; educational use)"
}

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler(LOG_FILE),
        logging.StreamHandler(sys.stdout),
    ],
)
log = logging.getLogger("konbit-bg-sync")


def ensure_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)
    log.info("Directory ready: %s", path)


def load_manifest() -> dict:
    if not os.path.exists(MANIFEST):
        return {"version": 1, "images": [], "current": None, "last_sync": None}
    with open(MANIFEST, "r") as f:
        return json.load(f)


def save_manifest(m: dict) -> None:
    with open(MANIFEST, "w") as f:
        json.dump(m, f, indent=2)
    log.info("Manifest saved: %d images tracked", len(m["images"]))


def rotate_daily(images: list) -> str:
    """Pick an image deterministically based on today's date."""
    if not images:
        return ""
    today = datetime.utcnow().strftime("%Y-%m-%d")
    seed  = int(hashlib.md5(today.encode()).hexdigest(), 16)
    idx   = seed % len(images)
    chosen = images[idx]["filename"]
    log.info("Daily rotation [%s]: %s (index %d of %d)", today, chosen, idx, len(images))
    return chosen


def search_wikipedia_images(term: str) -> list:
    """Search Wikimedia Commons for free images matching a term."""
    params = {
        "action": "query",
        "format": "json",
        "generator": "search",
        "gsrsearch": term,
        "gsrlimit": 5,
        "prop": "pageimages",
        "piprop": "thumbnail",
        "pithumbsize": 1200,
        "pilimit": 10,
    }
    try:
        resp = requests.get(WIKIPEDIA_SEARCH_URL, params=params, headers=HEADERS, timeout=15)
        resp.raise_for_status()
        data = resp.json()
    except Exception as e:
        log.warning("Search failed for '%s': %s", term, e)
        return []

    pages = data.get("query", {}).get("pages", {})
    results = []
    for page_id, page in pages.items():
        thumb = page.get("thumbnail", {})
        if thumb:
            results.append({
                "title":    page["title"],
                "filename": page.get("title", "").replace("File:", "").replace(" ", "_"),
                "thumb_url": thumb.get("source", ""),
                "page_url":  f"https://en.wikipedia.org/wiki/{page['title'].replace(' ', '_')}",
            })
    return results


def download_image(url: str, dest_path: Path) -> bool:
    """Download image, return True on success."""
    try:
        resp = requests.get(url, headers=HEADERS, timeout=30, stream=True)
        resp.raise_for_status()
        total = int(resp.headers.get("Content-Length", 0))
        if total > 15_000_000:  # skip files > 15MB
            log.warning("  Skipping %s: too large (%d bytes)", url, total)
            return False
        with open(dest_path, "wb") as f:
            for chunk in resp.iter_content(chunk_size=65536):
                f.write(chunk)
        size = dest_path.stat().st_size
        log.info("  Downloaded %.1f MB -> %s", size / 1_000_000, dest_path.name)
        return True
    except Exception as e:
        log.warning("  Download failed for %s: %s", url, e)
        return False


def sync_images() -> None:
    """Main sync: search, download fresh images, rotate, save."""
    ensure_dir(Path(BG_DIR))

    manifest = load_manifest()
    existing = {img["filename"]: img for img in manifest["images"]}
    new_count = 0

    log.info("Starting sync -- searching %d terms for up to %d new images...", len(SEARCH_TERMS), DAILY_NEW)

    for term in SEARCH_TERMS:
        if new_count >= DAILY_NEW:
            break
        results = search_wikipedia_images(term)
        for result in results:
            if new_count >= DAILY_NEW:
                break
            fname = result["filename"]
            if fname in existing:
                continue
            dest = Path(BG_DIR) / fname
            ok = download_image(result["thumb_url"], dest)
            if ok:
                img_entry = {
                    "filename":  fname,
                    "title":     result["title"],
                    "source_url": result["page_url"],
                    "thumb_url": result["thumb_url"],
                    "added_at":  datetime.utcnow().isoformat(),
                    "search_term": term,
                }
                existing[fname] = img_entry
                new_count += 1
        time.sleep(0.3)

    # Prune oldest if over limit
    images_list = list(existing.values())
    images_list.sort(key=lambda x: x.get("added_at", ""))
    if len(images_list) > MAX_IMAGES:
        prune = images_list[:-MAX_IMAGES]
        images_list = images_list[-MAX_IMAGES:]
        for img in prune:
            p = Path(BG_DIR) / img["filename"]
            if p.exists():
                p.unlink()
                log.info("Pruned old image: %s", img["filename"])

    # Rotate to today's image
    current_file = rotate_daily(images_list)

    manifest["version"]   = 1
    manifest["images"]    = images_list
    manifest["current"]   = current_file
    manifest["last_sync"] = datetime.utcnow().isoformat()
    save_manifest(manifest)

    with open(CURRENT, "w") as f:
        f.write(current_file)

    log.info("Sync complete: %d images in rotation, current='%s'", len(images_list), current_file)


if __name__ == "__main__":
    sync_images()
