# kazutoabiru.github.io

フレームワークに依存しない、Node.js自作ビルドスクリプトによる技術ブログです。GitHub Pages (https://kazutoabiru.github.io/) で公開しています。

## 構成

```text
├── content/posts/       # 記事のMarkdownファイル
├── scripts/
│   ├── config.mjs       # サイト設定
│   ├── templates.mjs    # HTMLテンプレート関数
│   ├── build.mjs        # ビルドスクリプト本体
│   └── serve.mjs        # ローカルプレビュー用の静的サーバー
├── public/               # そのままdist/にコピーされる静的ファイル(CSS・favicon)
└── dist/                 # ビルド出力(gitignore対象)
```

## コマンド

| コマンド            | 内容                                         |
| :------------------- | :------------------------------------------- |
| `npm install`         | 依存パッケージのインストール                 |
| `npm run build`       | `content/posts/` から `dist/` を生成         |
| `npm run serve`       | `dist/` を `http://localhost:8080` で配信    |
| `npm run preview`     | build と serve をまとめて実行                |

## 記事の追加方法

`content/posts/<slug>.md` を作成し、以下のフロントマターを先頭に書きます。

```yaml
---
title: "記事タイトル"
description: "一覧やmeta descriptionに使われる概要文"
---
```

`title` / `description` は必須です。ファイル名がそのままURLのスラッグ(`/posts/<slug>/`)になります。

公開日・更新日はフロントマターに書きません。そのファイルのgitコミット履歴から自動で取得します(最初のコミット日時=公開日、最新のコミット日時=更新日。同じ日にしかコミットされていなければ更新日は表示しません)。まだcommitしていない新規ファイルをビルドした場合は、暫定的に実行時点の日時が公開日として使われます。

`npm run build` を実行すると、トップページに記事一覧の表(公開日・更新日つき)と各記事ページが `dist/` に生成されます。`main` ブランチへのpushで GitHub Actions が自動的にビルド・デプロイします(`.github/workflows/deploy.yml`)。CIでは全コミット履歴が必要なため、checkoutは `fetch-depth: 0` で行っています。
