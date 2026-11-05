"""画像・CSS・JSをすべて埋め込んだ、単体で動く index.html を書き出す（GitHub Pages用）。

    python build.py

生成物: index.html（リポジトリ直下に置いてそのまま公開できる）
編集は templates/index.html・static/css/style.css・static/js/main.js 側で行うこと。
"""

import base64
import mimetypes
import pathlib
import re

from app import app

ROOT = pathlib.Path(__file__).parent


def data_uri(path: pathlib.Path) -> str:
    mime = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    return f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode()


def build():
    with app.test_client() as client:
        res = client.get("/")
    if res.status_code != 200:
        raise SystemExit(f"レンダリング失敗: HTTP {res.status_code}")
    html = res.get_data(as_text=True)

    # CSS を埋め込み
    css = (ROOT / "static/css/style.css").read_text(encoding="utf-8")
    html = html.replace(
        '<link rel="stylesheet" href="/static/css/style.css">', f"<style>\n{css}\n</style>"
    )
    # JS を埋め込み
    js = (ROOT / "static/js/main.js").read_text(encoding="utf-8")
    html = re.sub(
        r'<script src="/static/js/main.js"></script>',
        lambda m: f"<script>\n{js}\n</script>",
        html,
    )

    # 画像を base64 に
    def repl(m):
        p = ROOT / m.group(0).lstrip("/")
        return data_uri(p) if p.exists() else m.group(0)

    html = re.sub(r"/static/images/[A-Za-z0-9_\-]+\.(?:jpg|jpeg|png|webp|svg)", repl, html)

    (ROOT / "index.html").write_text(html, encoding="utf-8")
    (ROOT / ".nojekyll").touch()
    print(f"index.html を生成しました（{len(html) // 1024} KB）")


if __name__ == "__main__":
    build()
