import {writeFile} from 'node:fs/promises';

export const escape = (s = '') => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function safeUrl(value) {
  try { const u = new URL(value); return ['https:', 'http:', 'mailto:'].includes(u.protocol) ? u.href : '#'; }
  catch { return '#'; }
}
export const plain = (items = []) => items.map(x => x.plain_text ?? x.text?.content ?? x.equation?.expression ?? '').join('');
export function rich(items = []) {
  return items.map(x => {
    let text = escape(plain([x]));
    const a = x.annotations ?? {};
    if (a.code || x.type === 'equation') text = `<code>${text}</code>`;
    if (a.bold) text = `<strong>${text}</strong>`;
    if (a.italic) text = `<em>${text}</em>`;
    if (a.strikethrough) text = `<s>${text}</s>`;
    if (a.underline) text = `<u>${text}</u>`;
    if (x.href || x.text?.link?.url) text = `<a href="${escape(safeUrl(x.href ?? x.text.link.url))}">${text}</a>`;
    return text;
  }).join('');
}
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
export async function request(path, body) {
  for (let attempt = 0; attempt < 5; attempt++) {
    await pause(350);
    const response = await fetch(`https://api.notion.com/v1/${path}`, {
      method: body ? 'POST' : 'GET', signal: AbortSignal.timeout(30000),
      headers: {'Authorization': `Bearer ${process.env.NOTION_TOKEN}`, 'Notion-Version':'2025-09-03', 'Content-Type':'application/json'},
      ...(body ? {body:JSON.stringify(body)} : {})
    });
    if (response.status === 429 || response.status >= 500) {
      await pause(Math.min(60000, Number(response.headers.get('retry-after') || 2 ** attempt) * 1000));
      continue;
    }
    if (!response.ok) throw new Error(`Notion request failed (${response.status}). Check connection access, IDs and database properties.`);
    return response.json();
  }
  throw new Error('Notion did not respond successfully after retries. Deployment stopped.');
}
export async function paginate(path, body) {
  let cursor; const results = [];
  do {
    const page = await request(body ? path : `${path}${path.includes('?') ? '&' : '?'}page_size=100${cursor ? `&start_cursor=${encodeURIComponent(cursor)}` : ''}`,
      body ? {...body, page_size:100, ...(cursor ? {start_cursor:cursor} : {})} : undefined);
    results.push(...page.results);
    cursor = page.has_more ? page.next_cursor : null;
    if (page.has_more && !cursor) throw new Error('Notion pagination returned no cursor.');
  } while(cursor);
  return results;
}
async function image(block, output) {
  const data = block.image; const url = data[data.type]?.url;
  if (!url || !url.startsWith('https://')) throw new Error('Image needs an HTTPS source.');
  const response = await fetch(url, {signal:AbortSignal.timeout(30000)});
  if (!response.ok) throw new Error('Could not download a published image.');
  const type = response.headers.get('content-type')?.split(';')[0];
  const extension = {'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/gif':'gif','image/avif':'avif'}[type];
  if (!extension) throw new Error('Use PNG, JPEG, WebP, GIF or AVIF images.');
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length > 20 * 1024 * 1024) throw new Error('Image exceeds 20 MB.');
  const filename = `${block.id.replace(/[^a-zA-Z0-9-]/g, '')}.${extension}`;
  await writeFile(`${output}/assets/${filename}`, bytes);
  return `<figure><img loading="lazy" src="/assets/${filename}" alt="${escape(plain(data.caption))}"><figcaption>${rich(data.caption)}</figcaption></figure>`;
}
export async function renderBlocks(blocks, output) {
  let html = '', list = '';
  for (const block of blocks) {
    const t = block.type, data = block[t] ?? {};
    const group = t === 'bulleted_list_item' ? 'ul' : t === 'numbered_list_item' ? 'ol' : '';
    if (list !== group) { if(list) html += `</${list}>`; if(group) html += `<${group}>`; list = group; }
    const children = block.has_children ? await renderBlocks(await paginate(`blocks/${block.id}/children`), output) : '';
    const text = rich(data.rich_text);
    if (group) html += `<li>${text}${children}</li>`;
    else if (t === 'paragraph') html += `<p>${text}</p>${children}`;
    else if (/^heading_[123]$/.test(t)) { const level = Number(t.slice(-1)) + 1; html += `<h${level}>${text}</h${level}>${children}`; }
    else if (t === 'quote') html += `<blockquote>${text}${children}</blockquote>`;
    else if (t === 'callout') html += `<aside class="callout">${text}${children}</aside>`;
    else if (t === 'code') html += `<pre><code>${escape(plain(data.rich_text))}</code></pre>`;
    else if (t === 'equation') html += `<pre class="equation">${escape(data.expression)}</pre>`;
    else if (t === 'divider') html += '<hr>';
    else if (t === 'image') html += await image(block, output);
    else if (t === 'toggle') html += `<details><summary>${text}</summary>${children}</details>`;
    else if (t === 'to_do') html += `<p>${data.checked ? '☑' : '☐'} ${text}</p>${children}`;
    else if (t === 'table') html += `<div class="table-scroll"><table>${children}</table></div>`;
    else if (t === 'table_row') html += `<tr>${data.cells.map(c => `<td>${rich(c)}</td>`).join('')}</tr>`;
    else if (['column_list','column','synced_block'].includes(t) && children) html += children;
    else if (['bookmark','link_preview','embed'].includes(t)) html += `<p><a href="${escape(safeUrl(data.url))}">${escape(data.url)}</a></p>`;
    else throw new Error(`Unsupported published Notion block: ${t}. Convert it to text/image or add renderer support before publishing.`);
  }
  return html + (list ? `</${list}>` : '');
}
export function postMetadata(page) {
  const p = page.properties;
  const title = plain(p.Name?.title);
  const slug = plain(p.Slug?.rich_text) || page.id.replaceAll('-', '');
  if (!title.trim()) throw new Error('Each published post needs a Name.');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('Slug must use lowercase English letters, numbers and single hyphens.');
  return {id:page.id, title, slug, description:plain(p.Summary?.rich_text), date:p.Date?.date?.start?.slice(0,10) ?? page.created_time.slice(0,10)};
}
export async function loadPosts(output) {
  const {NOTION_TOKEN:token, NOTION_DATABASE_ID:database, NOTION_DATA_SOURCE_ID:source} = process.env;
  if (!token && !database && !source) { console.log('Notion is not configured; building portfolio only.'); return []; }
  if (!token || (!database && !source)) throw new Error('Set NOTION_TOKEN and NOTION_DATABASE_ID (or NOTION_DATA_SOURCE_ID) together.');
  let id = source;
  if (!id) {
    const db = await request(`databases/${encodeURIComponent(database)}`);
    if (db.data_sources?.length !== 1) throw new Error('Set NOTION_DATA_SOURCE_ID to select one data source.');
    id = db.data_sources[0].id;
  }
  const schema = await request(`data_sources/${encodeURIComponent(id)}`);
  if (schema.properties?.Published?.type !== 'checkbox' || schema.properties?.Name?.type !== 'title') throw new Error('Notion needs Name (Title) and Published (Checkbox) properties.');
  const pages = await paginate(`data_sources/${encodeURIComponent(id)}/query`, {filter:{property:'Published',checkbox:{equals:true}}});
  const posts = [], seen = new Set();
  for (const page of pages) {
    if (page.archived || page.in_trash || page.properties.Published?.checkbox !== true) continue;
    const post = postMetadata(page);
    if (seen.has(post.slug)) throw new Error('Duplicate published slug. Give every post a unique Slug.');
    seen.add(post.slug);
    post.html = await renderBlocks(await paginate(`blocks/${page.id}/children`), output);
    posts.push(post);
  }
  return posts.sort((a,b) => b.date.localeCompare(a.date));
}
