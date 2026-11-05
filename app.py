"""THE 鍼灸 育毛鍼灸LP — Flaskアプリ。

    pip install -r requirements.txt
    python app.py          # http://localhost:5000 で確認
    python build.py        # 画像・CSS・JSを埋め込んだ単体の index.html を書き出し

画像は static/images/ に置くだけ。ファイルが無いスロットは、
ページ上に「どのファイル名で置けばよいか」を示す枠が表示されます。
"""

import os
import pathlib

from flask import Flask, render_template, url_for

ROOT = pathlib.Path(__file__).parent
IMG_DIR = ROOT / "static" / "images"
EXTS = ("jpg", "jpeg", "png", "webp", "svg")

app = Flask(__name__)

# TODO: LINE公式アカウントの友だち追加URLに差し替える（現在はダミー値）
LINE_URL = os.environ.get("LINE_URL", "https://line.me/R/ti/p/@REPLACE_ME")


def find_image(name):
    """static/images/<name>.(jpg|png|webp|svg) があればURLを返す。無ければ None。"""
    for ext in EXTS:
        if (IMG_DIR / f"{name}.{ext}").exists():
            return url_for("static", filename=f"images/{name}.{ext}")
    return None


@app.context_processor
def inject():
    return {"find_image": find_image}


@app.route("/")
def index():
    return render_template("index.html", line_url=LINE_URL)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
