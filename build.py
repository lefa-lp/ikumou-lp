"""GitHub Pages公開用に静的HTMLを書き出すビルドスクリプト。

Flaskテンプレートをレンダリングし、リポジトリ直下に index.html を生成する。
GitHub Pagesはサブパス（/ikumou-lp/）で配信されるため、静的ファイルの参照を
絶対パス（/static/...）から相対パス（static/...）に書き換える。

    python build.py

生成物: index.html, .nojekyll
静的ファイルは static/ をそのまま参照するのでコピーは不要。
"""

import pathlib
import re

from app import app

ROOT = pathlib.Path(__file__).parent


def build():
    with app.test_client() as client:
        res = client.get("/")
    if res.status_code != 200:
        raise SystemExit(f"レンダリング失敗: HTTP {res.status_code}")

    html = res.get_data(as_text=True)

    # サブパス配信に対応するため、静的ファイルの参照を相対パスにする
    html, n = re.subn(r'(src|href|content)="/static/', r'\1="static/', html)
    if n == 0:
        raise SystemExit("静的ファイルの参照が見つかりませんでした")

    html = html.replace(
        "<head>",
        "<head>\n<!-- このファイルは build.py の自動生成物です。"
        "編集は templates/index.html 側で行ってください。 -->",
        1,
    )

    (ROOT / "index.html").write_text(html, encoding="utf-8")
    (ROOT / ".nojekyll").touch()  # Jekyllの処理を無効化
    print(f"index.html を生成しました（静的参照 {n} 件を相対パスに変換）")


if __name__ == "__main__":
    build()
