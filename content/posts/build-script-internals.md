---
title: "自作ビルドスクリプトの仕組み"
pubDate: 2026-07-04
updatedDate: 2026-07-04
description: "このブログを生成しているNode.jsビルドスクリプトの中身を紹介します。"
---

前回に続いて、このブログを生成している仕組みについてもう少し詳しく書いておきます。

## ビルドの流れ

1. `dist/` を削除して作り直す
2. `public/` の静的ファイル(CSS・favicon)を `dist/` にコピーする
3. `content/posts/*.md` を全て読み込み、フロントマターと本文をパースする
4. 公開日(`pubDate`)の降順に並び替える
5. トップページ(`dist/index.html`)と各記事ページ(`dist/posts/<slug>/index.html`)を書き出す

## フロントマターの例

```yaml
---
title: "記事タイトル"
pubDate: 2026-07-04
updatedDate: 2026-07-05
description: "概要文"
---
```

`updatedDate` は省略可能で、省略した場合はトップページの一覧で「—」と表示されます。

> テンプレートエンジンやCSSフレームワークには頼らず、素のJavaScriptとCSSだけで組み立てているのがポイントです。
