import {readFile} from 'node:fs/promises';

export const escape = (s = '') => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function safeUrl(value) {
  try { const u = new URL(value); return ['https:', 'http:', 'mailto:'].includes(u.protocol) ? u.href : '#'; }
  catch { return '#'; }
}

export async function loadPosts() {
  const items = JSON.parse(await readFile('content/posts.json', 'utf8'));
  const seen = new Set();
  return items.filter(p => p.published === true).map(p => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug) || seen.has(p.slug)) throw new Error('Each published post needs a unique lowercase slug.');
    if (!p.title || !/^\d{4}-\d{2}-\d{2}$/.test(p.date) || !Array.isArray(p.body)) throw new Error('Post requires title, date (YYYY-MM-DD), and body.');
    seen.add(p.slug);
    const html = p.body.map(b => {
      if (b.type === 'paragraph') return `<p>${escape(b.text)}</p>`;
      if (b.type === 'heading') return `<h2>${escape(b.text)}</h2>`;
      if (b.type === 'code') return `<pre><code>${escape(b.text)}</code></pre>`;
      if (b.type === 'list') return `<ul>${b.items.map(i => `<li>${escape(i)}</li>`).join('')}</ul>`;
      if (b.type === 'link') return `<p><a href="${escape(safeUrl(b.url))}">${escape(b.text)}</a></p>`;
      throw new Error(`Unsupported post block: ${b.type}`);
    }).join('');
    return {...p, html};
  }).sort((a,b) => b.date.localeCompare(a.date));
}
