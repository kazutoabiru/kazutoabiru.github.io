#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import config from './config.mjs';
import { renderHomePage, renderPostPage } from './templates.mjs';

const md = new MarkdownIt({ html: false, linkify: true });

function dateOnly(date) {
  return date.toISOString().slice(0, 10);
}

// Derives (pubDate, updatedDate) from git history so authors never hand-maintain dates:
// oldest commit touching the file is the creation date, newest is the last edit.
// Falls back to "now" for files that haven't been committed yet (e.g. drafts in progress).
function getDatesFromGit(filePath) {
  let output;
  try {
    output = execFileSync('git', ['log', '--follow', '--format=%aI', '--', filePath], {
      encoding: 'utf-8',
    }).trim();
  } catch {
    output = '';
  }

  const dates = output ? output.split('\n').map((d) => new Date(d)) : [];
  if (dates.length === 0) {
    return { pubDate: new Date(), updatedDate: undefined };
  }

  const updatedDate = dates[0];
  const pubDate = dates[dates.length - 1];
  return {
    pubDate,
    updatedDate: dateOnly(updatedDate) === dateOnly(pubDate) ? undefined : updatedDate,
  };
}

async function loadPosts() {
  const files = (await fs.readdir(config.postsDir)).filter((f) => f.endsWith('.md'));
  const posts = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(config.postsDir, file);
      const raw = await fs.readFile(filePath, 'utf-8');
      const { data, content } = matter(raw);
      if (!data.title || !data.description) {
        throw new Error(`${file}: missing required frontmatter (title/description)`);
      }
      return {
        slug: file.replace(/\.md$/, ''),
        title: data.title,
        description: data.description,
        ...getDatesFromGit(filePath),
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
