"""Loopback-only review server; aliases existing app icons at a simulated HA endpoint.
No images are generated and no real Home Assistant/token is used.
Run from the repo: python scripts/serve_banner_preview.py
"""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse
import re

ROOT = Path(__file__).resolve().parent.parent.parent

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        match = re.fullmatch(r'/api/brands/integration/(tipsa|ukrposhta|bpost|fedex)/icon\.png', urlparse(self.path).path)
        if match:
            domain = match.group(1)
            self.path = f'/ha-parcel-card/images/{domain}/{domain}-logo.png'
        super().do_GET()

if __name__ == '__main__':
    print('Banner review: http://127.0.0.1:8124/ha-parcel-card/banner-v2-demo.html', flush=True)
    ThreadingHTTPServer(('127.0.0.1', 8124), Handler).serve_forever()
