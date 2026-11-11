/**
 * Deploy StudyHub journal shell + Week 1 draft (same as SH.run('journalPilot') bundle).
 * Usage:
 *   $env:WP_USER="your_wp_username"
 *   $env:WP_APP_PASS="xxxx xxxx xxxx xxxx xxxx xxxx"
 *   node deploy-journal.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE = 'https://studyhub185.wordpress.com';
const AUTH = Buffer.from(
  `${process.env.WP_USER || ''}:${(process.env.WP_APP_PASS || '').replace(/\s/g, '')}`
).toString('base64');

if (!process.env.WP_USER || !process.env.WP_APP_PASS) {
  console.error('Set WP_USER and WP_APP_PASS (WordPress application password).');
  process.exit(1);
}

async function api(method, route, body) {
  const res = await fetch(`${SITE}/wp-json${route}`, {
    method,
    headers: {
      Authorization: `Basic ${AUTH}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${route}: ${text.slice(0, 500)}`);
  return text ? JSON.parse(text) : null;
}

function read(p) {
  return fs.readFileSync(path.join(__dirname, p), 'utf8');
}

const enc = (o) => JSON.stringify(o);

function withLayout(html) {
  return html.replace(/<!-- wp:group (?:(\{.*?\}) )?-->/g, (m, json) => {
    const a = json ? JSON.parse(json) : {};
    if (a.layout) return m;
    a.layout = { type: 'constrained' };
    return `<!-- wp:group ${enc(a)} -->`;
  });
}

/** WordPress may strip unknown blocks; pass through raw HTML for REST deploy. */
function contentForApi(html) {
  return withLayout(html);
}

async function main() {
  const bundle = {
    header: read('infield/header.html'),
    footer: read('infield/footer.html'),
    sidebar: read('infield/sidebar.html'),
    titleBand: read('infield/title-band.html'),
    index: read('infield/index-template.html'),
    single: read('infield/single-template.html'),
    page: read('infield/page-template.html'),
    week1: fs.readFileSync(path.join(__dirname, '../../docs/blog/week-01-wordpress.html'), 'utf8'),
  };

  for (const [part, key] of [
    ['header', 'header'],
    ['footer', 'footer'],
    ['footer-alternative', 'footer'],
    ['sidebar', 'sidebar'],
  ]) {
    await api('POST', `/wp/v2/template-parts/pub/infield//${part}`, {
      content: contentForApi(bundle[key]),
    });
    console.log('part', part);
  }

  const single = bundle.single.replace('TITLE_BAND_PLACEHOLDER', bundle.titleBand.trim());
  await api('POST', '/wp/v2/templates/pub/infield//index', { content: contentForApi(bundle.index) });
  await api('POST', '/wp/v2/templates/pub/infield//home', { content: contentForApi(bundle.index) });
  await api('POST', '/wp/v2/templates/pub/infield//single', { content: contentForApi(single) });
  await api('POST', '/wp/v2/templates/pub/infield//page', { content: contentForApi(bundle.page) });
  console.log('templates home, index, single, page');

  await api('POST', '/wp/v2/settings', { site_logo: 106 });

  let raw = bundle.week1;
  const media = await api('GET', '/wp/v2/media/243').catch(() => null);
  if (media?.source_url && raw.includes('subsystems.png')) {
    raw = raw.replace(/https:\/\/raw\.githubusercontent\.com\/[^"]*subsystems\.png/g, media.source_url);
    raw = raw.replace('<!-- wp:image {', '<!-- wp:image {"id":243,');
  }

  const cats = await api('GET', '/wp/v2/categories?search=Week%201');
  const week1Cat = cats.find((c) => c.name === 'Week 1');
  const drafts = await api('GET', '/wp/v2/posts?status=draft&per_page=50');
  for (const p of drafts) {
    const t = p.title?.rendered || '';
    if (t.includes('eval(') || t.includes('localhost:8765') || t.includes('SH.run')) {
      await api('POST', `/wp/v2/posts/${p.id}`, { status: 'trash' });
      console.log('trashed junk draft', p.id);
    }
  }

  const data = {
    title: 'Week 1: Introducing StudyHub',
    content: contentForApi(raw),
    status: 'draft',
    categories: week1Cat ? [week1Cat.id] : undefined,
  };

  let existing = drafts.find((p) => (p.title?.rendered || '').includes('Introducing StudyHub'));
  if (!existing) {
    const hits = await api('GET', '/wp/v2/posts?search=Introducing+StudyHub&status=any&per_page=20');
    existing = hits.find((p) => p.status !== 'trash' && (p.title?.rendered || '').includes('Introducing StudyHub'));
  }

  const post = existing
    ? await api('POST', `/wp/v2/posts/${existing.id}`, data)
    : await api('POST', '/wp/v2/posts', data);

  console.log('draft', post.id);
  console.log('preview', `${SITE}/?p=${post.id}&preview=true`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
