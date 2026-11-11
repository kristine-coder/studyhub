const fs = require('fs');
const path = require('path');

const root = __dirname;
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

const parts = {
  header: read('infield/header.html'),
  footer: read('infield/footer.html'),
  sidebar: read('infield/sidebar.html'),
  titleBand: read('infield/title-band.html'),
  index: read('infield/index-template.html'),
  single: read('infield/single-template.html'),
  week1: read('plain/week-01-introduction.html'),
};

const sh = read('sh.js');

const bundleFn = `
  const BUNDLE = ${JSON.stringify(parts)};
  async function journalGlobalBundled() {
    const out = {};
    for (const [part, key] of [
      ['header', 'header'],
      ['footer', 'footer'],
      ['footer-alternative', 'footer'],
      ['sidebar', 'sidebar'],
    ]) {
      await api({
        path: '/wp/v2/template-parts/pub/infield//' + part,
        method: 'POST',
        data: { content: withLayout(clean(BUNDLE[key])) },
      });
      out[part] = 'updated';
    }
    const single = BUNDLE.single.replace('TITLE_BAND_PLACEHOLDER', BUNDLE.titleBand.trim());
    await api({ path: '/wp/v2/templates/pub/infield//index', method: 'POST', data: { content: withLayout(clean(BUNDLE.index)) } });
    await api({ path: '/wp/v2/templates/pub/infield//single', method: 'POST', data: { content: withLayout(clean(single)) } });
    out.index = 'journal front';
    out.single = 'article layout';
    await api({ path: '/wp/v2/settings', method: 'POST', data: { site_logo: 106 } });
    return out;
  }
  async function week1Bundled() {
    const drafts = await api({ path: '/wp/v2/posts?status=draft&per_page=50' });
    for (const p of drafts) {
      const t = p.title?.raw || p.title?.rendered || '';
      if (t.includes('eval(') || t.includes('localhost:8765') || t.includes('SH.run')) {
        await api({ path: '/wp/v2/posts/' + p.id, method: 'POST', data: { status: 'trash' } });
      }
    }
    const ids = JSON.parse(localStorage.getItem('sh_media') || '{}');
    let raw = BUNDLE.week1;
    if (ids.subsystems?.url) {
      raw = raw.replace(/https:\\/\\/raw\\.githubusercontent\\.com\\/[^"]*subsystems\\.png/g, ids.subsystems.url);
      raw = raw.replace('<!-- wp:image {', '<!-- wp:image {"id":' + ids.subsystems.id + ',');
    } else if (raw.includes('subsystems.png')) {
      const m = await api({ path: '/wp/v2/media/243' }).catch(() => null);
      if (m?.source_url) {
        raw = raw.replace(/https:\\/\\/raw\\.githubusercontent\\.com\\/[^"]*subsystems\\.png/g, m.source_url);
        raw = raw.replace('<!-- wp:image {', '<!-- wp:image {"id":243,');
      }
    }
    const cats = await api({ path: '/wp/v2/categories?search=Week%201' });
    const data = { content: clean(raw), title: 'Week 1: Introducing StudyHub', status: 'draft' };
    const cat = cats.find((c) => c.name === 'Week 1');
    if (cat) data.categories = [cat.id];
    let existing = localStorage.getItem('sh_week1');
    const verify = async (id) => {
      const p = await api({ path: '/wp/v2/posts/' + id }).catch(() => null);
      return p && p.status !== 'trash' ? String(p.id) : null;
    };
    if (existing) existing = await verify(existing);
    if (!existing) {
      const hit = drafts.find((p) => (p.title?.raw || p.title?.rendered || '').includes('Introducing StudyHub'));
      if (hit) existing = String(hit.id);
    }
    if (!existing) {
      const hits = await api({ path: '/wp/v2/posts?search=Introducing+StudyHub&status=any&per_page=20' });
      const hit = hits.find((p) => p.status !== 'trash' && (p.title?.raw || p.title?.rendered || '').includes('Introducing StudyHub'));
      if (hit) existing = String(hit.id);
    }
    const p = existing
      ? await api({ path: '/wp/v2/posts/' + existing, method: 'POST', data })
      : await api({ path: '/wp/v2/posts', method: 'POST', data });
    localStorage.setItem('sh_week1', p.id);
    return {
      id: p.id,
      preview: 'https://studyhub185.wordpress.com/?p=' + p.id + '&preview=true',
      status: p.status,
    };
  }
  async function journalPilotBundled() {
    return { ...(await journalGlobalBundled()), week1: await week1Bundled() };
  }
`;

const marker = '  async function journalPilot() {';
const idx = sh.indexOf(marker);
if (idx < 0) throw new Error('journalPilot not found');
const before = sh.slice(0, idx);
const after = sh.slice(idx).replace(
  /async function journalPilot\(\) \{[\s\S]*?return \{ \.\.\.global, week1: post \};\s*\}/,
  "async function journalPilot() { return journalPilotBundled(); }"
);

fs.writeFileSync(path.join(root, 'sh-bundle.js'), before + bundleFn + '\n' + after);
console.log('sh-bundle.js', ((before + bundleFn + after).length / 1024).toFixed(1), 'KB');
