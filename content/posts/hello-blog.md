---
title: "ブログを始めました"
description: "Astro製の雛形サイトを卒業し、フレームワークなしの自作ビルドスクリプトでブログを作り直しました。"
---

はじめまして。このブログでは、技術的に学んだことや試したことを記録していきます。

これまでは `create-astro` のブログ雛形をそのまま使っていましたが、今回からは Node.js の小さなビルドスクリプトだけで完結する、フレームワークに依存しない構成に作り直しました。

## 使っている技術

- Markdown のパースには [markdown-it](https://github.com/markdown-it/markdown-it)
- フロントマターの解析には [gray-matter](https://github.com/jonschlinkert/gray-matter)
- HTML の組み立てはテンプレートエンジンを使わず、JavaScript のテンプレートリテラル関数だけで行っています

## コードブロックの例

```js
function hello(name) {
  console.log(`Hello, ${name}!`);
}
```

今後もこの場で記録を続けていく予定です。
