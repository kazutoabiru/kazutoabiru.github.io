import config from './config.mjs';

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

export function renderLayout({ title, description, bodyHtml }) {
  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="icon" href="/favicon.svg" />
  <link rel="stylesheet" href="/styles.css" />
</head>
<body>
  <header class="site-header"><a href="/">${escapeHtml(config.siteTitle)}</a></header>
  <main>${bodyHtml}</main>
  <footer class="site-footer"><p>&copy; ${new Date().getFullYear()} ${escapeHtml(config.siteTitle)}</p></footer>
</body>
</html>`;
}

export function renderHomePage(posts) {
  const rows = posts.map((p) => `
    <tr>
      <td><a href="/posts/${p.slug}/">${escapeHtml(p.title)}</a></td>
      <td><time datetime="${p.pubDate.toISOString()}">${formatDate(p.pubDate)}</time></td>
      <td>${p.updatedDate ? `<time datetime="${p.updatedDate.toISOString()}">${formatDate(p.updatedDate)}</time>` : '—'}</td>
    </tr>`).join('');

  const bodyHtml = `
    <h1>Posts</h1>
    <div class="table-wrapper">
      <table class="post-table">
        <thead><tr><th>Title</th><th>Published</th><th>Updated</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;

  return renderLayout({ title: config.siteTitle, description: config.siteDescription, bodyHtml });
}

export function renderPostPage(post) {
  const bodyHtml = `
    <article>
      <h1>${escapeHtml(post.title)}</h1>
      <p class="post-meta">
        Published: <time datetime="${post.pubDate.toISOString()}">${formatDate(post.pubDate)}</time>
        ${post.updatedDate ? ` · Updated: <time datetime="${post.updatedDate.toISOString()}">${formatDate(post.updatedDate)}</time>` : ''}
      </p>
      <div class="post-content">${post.html}</div>
    </article>`;

  return renderLayout({ title: `${post.title} — ${config.siteTitle}`, description: post.description, bodyHtml });
}
