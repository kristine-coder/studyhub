/**
 * Push Week 1 post content + single-post template (title band) to WordPress.
 * $env:WP_USER="kmegrelishvili"
 * $env:WP_APP_PASS="...."
 * node push-week1.mjs
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
  console.error('Set WP_USER and WP_APP_PASS');
  process.exit(1);
}

async function api(method, route, body) {
  const res = await fetch(`${SITE}/wp-json${route}`, {
    method,
    headers: { Authorization: `Basic ${AUTH}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${route}: ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : null;
}

function read(p) {
  return fs.readFileSync(path.join(__dirname, p), 'utf8');
}

async function ensureWeek1Category() {
  let cats = await api('GET', '/wp/v2/categories?search=Week%201');
  let cat = cats.find((c) => c.name === 'Week 1');
  if (!cat) {
    cat = await api('POST', '/wp/v2/categories', { name: 'Week 1', slug: 'week-1' });
  }
  return cat.id;
}

async function main() {
  const band = read('infield/title-band.html').trim();
  let single = read('infield/single-template.html').replace('TITLE_BAND_PLACEHOLDER', band);
  await api('POST', '/wp/v2/templates/pub/infield//single', { content: single });
  console.log('template single updated');

  const html = fs.readFileSync(path.join(__dirname, '../../docs/blog/week-01-wordpress.html'), 'utf8');
  const week1Cat = await ensureWeek1Category();

  const WEEK1_POST_ID = Number(process.env.WP_POST_ID || 273);
  let post = null;
  try {
    post = await api('GET', `/wp/v2/posts/${WEEK1_POST_ID}?context=edit`);
    if (post.status === 'trash') post = null;
  } catch {
    post = null;
  }
  if (!post) {
    const posts = await api('GET', '/wp/v2/posts?per_page=20&status=any&search=Introducing+StudyHub');
    post = posts.find(
      (p) => p.status !== 'trash' && (p.title?.rendered || '').includes('Introducing StudyHub')
    );
  }
  const data = {
    title: 'Week 1: Introducing StudyHub — project vision',
    content: html,
    status: post?.status === 'publish' ? 'publish' : 'draft',
    categories: [week1Cat],
  };
  post = post
    ? await api('POST', `/wp/v2/posts/${post.id}`, data)
    : await api('POST', '/wp/v2/posts', { ...data, status: 'draft' });

  console.log('post', post.id, post.status);
  console.log(post.link);
  if (post.status !== 'publish') {
    console.log('preview', `${SITE}/?p=${post.id}&preview=true`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
