"""育毛鍼灸LP（鍼灸整体院 Re-Ane）のFlaskアプリケーション。

LPは1ページ構成。テンプレートに渡す未確定情報は下記の定数で管理する。
本番反映時は LINE_URL を確定値に差し替える（README.mdのTODO一覧を参照）。
"""

import os

from flask import Flask, render_template

app = Flask(__name__)

# TODO: LINE公式アカウントの友だち追加URLに差し替える（現在はダミー値）
LINE_URL = os.environ.get("LINE_URL", "https://line.me/XXXXXXXX")


@app.route("/")
def index():
    return render_template("index.html", line_url=LINE_URL)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
