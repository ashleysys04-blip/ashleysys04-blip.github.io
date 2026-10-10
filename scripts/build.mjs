import {readFile, writeFile, mkdir, rm, cp} from 'node:fs/promises';
import {escape as e, safeUrl, loadPosts} from './content.mjs';

const profile = JSON.parse(await readFile('content/profile.json', 'utf8'));
const origin = 'https://ashleysys04-blip.github.io';
await rm('dist', {recursive:true, force:true});
await mkdir('dist/assets', {recursive:true});
await cp('public', 'dist', {recursive:true});
const posts = await loadPosts();
const nav = `<header><a class="wordmark" href="/">${e(profile.name)}<span>${e(profile.koreanName)}</span></a><nav aria-label="Main navigation"><a href="/#about">About</a><a href="/#research">Research</a>${posts.length ? '<a href="/writing/">Writing</a>' : ''}<a href="/#contact">Contact</a></nav></header>`;
function document(title, description, path, body) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(title)} | ${e(profile.name)}</title><meta name="description" content="${e(description)}"><link rel="canonical" href="${origin}${path}"><meta property="og:title" content="${e(title)}"><meta property="og:description" content="${e(description)}"><meta property="og:type" content="website"><meta property="og:url" content="${origin}${path}"><link rel="stylesheet" href="/style.css"><link rel="icon" href="/favicon.svg" type="image/svg+xml"></head><body><a class="skip" href="#main">Skip to content</a><div class="shell">${nav}<main id="main">${body}</main><footer><span>© ${new Date().getUTCFullYear()} ${e(profile.name)}</span><span>Devices · Neural systems · Computation</span><a href="#main">Back to top ↑</a></footer></div></body></html>`;
}
function listing(items) {
  return items.length ? `<div class="posts">${items.map(p => `<article class="post-link"><time datetime="${e(p.date)}">${e(p.date)}</time><div><h3><a href="/writing/${p.slug}/">${e(p.title)} <span aria-hidden="true">↗</span></a></h3>${p.description ? `<p>${e(p.description)}</p>`:''}</div></article>`).join('')}</div>` : '<p class="empty">Research notes and project reflections will appear here.</p>';
}
const cv = profile.cv && /^\/[^/]/.test(profile.cv) ? `<a class="button secondary" href="${e(profile.cv)}">Curriculum vitae ↗</a>` : '';
const home = `<section class="hero" id="about"><p class="eyebrow">${e(profile.affiliation)}</p><h1>${e(profile.name)}<span class="hero-korean">${e(profile.koreanName)}</span></h1><p class="research-tagline">${e(profile.headline)}</p><div class="intro"><p>${e(profile.bio)}</p><div class="actions"><a class="button" href="#research">Explore my research <span>↘</span></a>${cv}</div></div><div class="discipline"><span>01 / Device physics</span><span>02 / Neural encoding</span><span>03 / Brain-inspired computing</span></div></section><section class="research" id="research"><div class="section-heading"><p class="eyebrow">Selected research</p><h2>Connecting physical dynamics<br>with computation.</h2><p>${e(profile.researchStatement)}</p></div><div class="projects">${profile.projects.map(p => `<article class="project"><div class="project-index">${e(p.number)}<span>${e(p.category)}</span></div><h3>${e(p.title)}</h3><p>${e(p.description)}</p><small>${e(p.context)}</small></article>`).join('')}</div></section>${posts.length ? `<section id="writing"><div class="row"><div><p class="eyebrow">Notebook</p><h2>Writing & research notes</h2></div><a href="/writing/">All writing ↗</a></div>${listing(posts.slice(0,3))}</section>` : ''}<section class="contact" id="contact"><p class="eyebrow">Get in touch</p><h2>Let's connect.</h2><p>I welcome conversations about neuromorphic computing, neural systems, and intelligent hardware.</p><div class="actions">${profile.email ? `<a class="button" href="mailto:${e(profile.email)}">Email me ↗</a>` : ''}<a class="button secondary" href="${e(safeUrl(profile.github))}">GitHub ↗</a>${cv}</div></section>`;
await writeFile('dist/index.html', document('Research portfolio', profile.bio, '/', home));
await mkdir('dist/writing', {recursive:true});
await writeFile('dist/writing/index.html', document('Writing', 'Research notes and reflections by Yeseul Seo.', '/writing/', `<section class="writing-index"><p class="eyebrow">Notebook</p><h1>Writing &<br>research notes.</h1>${listing(posts)}</section>`));
for (const p of posts) {
  await mkdir(`dist/writing/${p.slug}`, {recursive:true});
  await writeFile(`dist/writing/${p.slug}/index.html`, document(p.title, p.description || p.title, `/writing/${p.slug}/`, `<article class="prose"><a href="/writing/">← All writing</a><p class="eyebrow"><time datetime="${e(p.date)}">${e(p.date)}</time></p><h1>${e(p.title)}</h1>${p.description ? `<p class="lede">${e(p.description)}</p>` : ''}<div class="article-body">${p.html}</div></article>`));
}
await writeFile('dist/404.html', document('Page not found', 'Page not found.', '/404.html', '<section class="hero"><p class="eyebrow">404</p><h1>Page not found.</h1><a class="button" href="/">Return home →</a></section>'));
await writeFile('dist/.nojekyll', '');
await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['/','/writing/',...posts.map(p => `/writing/${p.slug}/`)].map(path => `<url><loc>${origin}${path}</loc></url>`).join('')}</urlset>`);
console.log(`Built portfolio and ${posts.length} published posts.`);
