#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import config from './config.mjs';
import { renderHomePage, renderPostPage } from './templates.mjs';

const md = new MarkdownIt({ html: false, linkify: true });

async function loadPosts() {
  const files = (await fs.readdir(config.postsDir)).filter((f) => f.endsWith('.md'));
  const posts = await Promise.all(
    files.map(async (file) => {
      const raw = await fs.readFile(path.join(config.postsDir, file), 'utf-8');
      const { data, content } = matter(raw);
      if (!data.title || !data.pubDate || !data.description) {
        throw new Error(`${file}: missing required frontmatter (title/pubDate/description)`);
      }
      return {
        slug: file.replace(/\.md$/, ''),
        title: data.title,
        description: data.description,
        pubDate: new Date(data.pubDate),
        updatedDate: data.updatedDate ? new Date(data.updatedDate) : undefined,
        html: md.render(content),
      };
    })
  );
  posts.sort((a, b) => b.pubDate - a.pubDate);
  return posts;
}

async function build() {
  await fs.rm(config.outDir, { recursive: true, force: true });
  await fs.mkdir(config.outDir, { recursive: true });
  await fs.cp(config.publicDir, config.outDir, { recursive: true });

  const posts = await loadPosts();

  await fs.writeFile(path.join(config.outDir, 'index.html'), renderHomePage(posts));

  for (const post of posts) {
    const dir = path.join(config.outDir, 'posts', post.slug);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, 'index.html'), renderPostPage(post));
  }

  console.log(`Built ${posts.length} post(s) → ${config.outDir}/`);
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
