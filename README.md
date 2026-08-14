# ikumou-lp — 育毛鍼灸LP（鍼灸整体院 Re-Ane）

目黒駅の育毛鍼灸をテーマにしたランディングページ。Flask + 素のHTML/CSS/JavaScript（外部JSライブラリなし）で構成した1ページ構成のLPです。

**公開URL: https://lefa-lp.github.io/ikumou-lp/**（GitHub Pages / `main` ブランチのルート）

## 構成

```
ikumou-lp/
├── app.py              # Flaskアプリ（"/" で index.html をレンダリング）
├── build.py            # GitHub Pages公開用に index.html を書き出す
├── index.html          # ← build.py の自動生成物。直接編集しない
├── requirements.txt
├── templates/
│   └── index.html      # LP本体（全セクション）。編集はこちら
└── static/
    ├── css/style.css   # LPのスタイル一式
    ├── js/main.js      # スクロール連動・FAQ開閉・CTA計測フック等
    └── images/         # ヒーロー、症例、施術の流れ、院内写真など18点
```

セクション: hero / worries / cases / cause / compare / approach / reasons / voices / flow / practitioner / price / cta-mid / faq / assurance / cta-final / shop

## ローカル実行

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
# http://127.0.0.1:5000/
```

LINE URLは環境変数でも差し替えられます。

```bash
LINE_URL="https://lin.ee/xxxxxxx" python app.py
```

macOSで `Address already in use` になる場合、5000番はAirPlay Receiverが使っています。`flask --app app run --port 5001 --debug` で回避してください。

## GitHub Pagesへの公開

`templates/index.html` や `static/` を編集したら、ビルドしてからpushします。

```bash
python build.py   # index.html を再生成
git add -A && git commit -m "..." && git push
```

`build.py` はFlaskテンプレートをレンダリングし、サブパス配信（`/ikumou-lp/`）に合わせて静的ファイルの参照を相対パスに変換します。`index.html` を直接編集しても次回ビルドで上書きされます。

## TODO（未確定情報 / 現在ダミー値）

**このLPは未確定情報がすべてダミー値のままです。公開前に以下を差し替えてください。**

| 項目 | 現在の値 | 差し替え箇所 |
|---|---|---|
| LINE公式アカウントURL | `https://line.me/XXXXXXXX` | `app.py` の `LINE_URL`（1箇所直せばCTA全10箇所と`window.SITE_CONFIG`に反映） |
| 住所 | `東京都目黒区〇〇 0-0-0 〇〇ビル1F` | `templates/index.html` 592行 |
| 電話番号 | `000-0000-0000`（`tel:`リンクも同値） | `templates/index.html` 596行 |
| 施術担当者名 | `施術担当者名（TODO）` | `templates/index.html` 390行 |
| Google Map埋め込み | プレースホルダ枠（iframe未設定） | `templates/index.html` 601行 |
| canonical URL / og:url | `https://example.com/ikumou` | `templates/index.html` 8, 16行 |
| 構造化データ（JSON-LD） | `telephone` / `streetAddress` / `addressLocality` / `postalCode` / `openingHours` / `priceRange` が `"TODO"`、`image`と`url`が`example.com` | `templates/index.html` 35-47行 |
| favicon | `static/images/favicon.png` を参照しているがファイル未配置（404） | `static/images/` に追加 |

確定済みの情報: 院名（鍼灸整体院 Re-Ane）/ 最寄駅（目黒駅）/ 営業時間（10:00〜19:00、最終受付18:00）/ 定休日（不定休）

canonical / og:url が `example.com` のままなので、LINEやSNSでURLを共有したときのプレビュー（タイトル・サムネイル）は正しく表示されません。公開URLを確定させる際に併せて修正してください。

### 画像について

`static/images/` の画像はレイアウト確認用のプレースホルダです。本番用の写真（施術風景・症例のBefore/After・院内写真・施術者写真）に差し替えてください。症例写真を使う場合は、掲載可否の同意取得と景品表示法・医療広告ガイドラインの表現確認を忘れずに。

### 計測タグ

`static/js/main.js` のCTAクリックハンドラに `gtag()` / `fbq()` 呼び出しのコメントアウト箇所があります。GA4・Meta Pixelを導入する際はそこを有効化してください。
