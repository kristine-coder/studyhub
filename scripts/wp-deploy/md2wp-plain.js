const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const REPO = 'c:/Users/USER/studyHUB';
const GH = 'https://github.com/kristine-coder/studyhub';
const BLOB = GH + '/blob/main/';
const TREE = GH + '/tree/main/';
const RAW = 'https://raw.githubusercontent.com/kristine-coder/studyhub/main/';

const C = {
  ink: '#142033',
  royal: '#1e4d8c',
  slate: '#5c6b7a',
  rule: '#d5deea',
  mist: '#f7fafc',
  codeBg: '#0B1F3A',
};

const FONT_TEXT = 'Literata, Georgia, "Iowan Old Style", Palatino, serif';
const FONT_TITLE = 'Source Sans 3, "Segoe UI", sans-serif';

const QUESTIONS = {
  'week-01-introduction': [
    'What is the most chaotic part of group work for you?',
    'Which part of StudyHub would you actually use first?',
    'Is something missing? What would make you switch from your group chat?',
  ],
  'week-02-team-technology-setup': [
    'Does our architecture make sense for a one-semester project?',
    'Which tool do you use to plan and track your team work?',
  ],
  'week-03-requirements-and-use-cases': [
    'Do our priorities (High, Medium, Low) look right to you?',
    'Are our quality goals, like 2 seconds per page, realistic?',
    'Is anything in the use case diagram unclear?',
  ],
  'week-04-use-case-specification': [
    'Could you build Create a task or Schedule meeting from our specification alone?',
    'Which alternative flow did we miss?',
  ],
  'week-05-testing-with-cucumber': [
    'Are our scenarios easy to read if you do not write code?',
    'Which scenario would you add to one of our feature files?',
  ],
  'week-06-in-progress': [
    'Do you also use YouTrack, or did you stay on Jira / GitHub Projects?',
    'How did you make the board readable for people outside the team?',
    'Did the IDE → YouTrack → GitHub chain work on the first try?',
  ],
};

const GITHUB_ASIDE = {
  'week-01-introduction': [
    ['Code repository', GH],
    ['Subsystems diagram', BLOB + 'docs/diagrams/subsystems.mmd'],
  ],
};

const MERMAID = { 'week-02-team-technology-setup': ['docs/diagrams/architecture.png'] };

const file = process.argv[2];
const key = path.basename(file, '.md');
const fromDir = path.dirname(path.resolve(file));
/** All journal weeks: numbered sections, single column (post body only; title band is in the template). */
const useEditorial = /^week-\d{2}-/.test(key);
const week01Simple = useEditorial;

function rewrite(href, isImage) {
  if (/^(https?:|mailto:|#)/.test(href)) return href;
  const [p, hash] = href.split('#');
  const abs = path.resolve(fromDir, p);
  const rel = path.relative(REPO, abs).split(path.sep).join('/');
  if (isImage) return RAW + rel;
  const isDir = fs.existsSync(abs) && fs.statSync(abs).isDirectory();
  return (isDir ? TREE : BLOB) + rel + (hash ? '#' + hash : '');
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const renderer = new marked.Renderer();
renderer.link = function (token) {
  const href = token.href || '';
  const text = this.parser.parseInline(token.tokens);
  const title = token.title ? ` title="${esc(token.title)}"` : '';
  return `<a href="${rewrite(href, false)}"${title}>${text}</a>`;
};
marked.use({ renderer });
const inline = (tokens) => marked.Parser.parseInline(tokens);

const slug = (s) =>
  s
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const para = (html, style) => {
  const attrs = style ? ` ${JSON.stringify({ style })}` : '';
  return `<!-- wp:paragraph${attrs} -->\n<p>${html}</p>\n<!-- /wp:paragraph -->`;
};

const headingSans = (html, level, extra = {}) => {
  const attrs = {
    level,
    style: {
      typography: {
        fontFamily: FONT_TITLE,
        fontSize: level === 2 ? '1.7rem' : '1.25rem',
        fontWeight: '600',
        lineHeight: '1.25',
      },
      color: { text: C.ink },
      spacing: { margin: { top: level === 2 ? '2.4rem' : '1.6rem', bottom: '0.65rem' } },
    },
    ...extra,
  };
  return `<!-- wp:heading ${JSON.stringify(attrs)} -->\n<h${level} class="wp-block-heading">${html}</h${level}>\n<!-- /wp:heading -->`;
};

function sectionRule() {
  return `<!-- wp:separator {"style":{"color":{"background":"${C.rule}"},"spacing":{"margin":{"top":"2rem","bottom":"2rem"}}}} -->
<hr class="wp-block-separator has-text-color has-alpha-channel-opacity has-background"/>
<!-- /wp:separator -->`;
}

function articleH2(text, anchor) {
  const attrs = {
    level: 2,
    anchor,
    style: {
      typography: {
        fontFamily: FONT_TITLE,
        fontSize: '1.7rem',
        fontWeight: '600',
        lineHeight: '1.22',
        letterSpacing: '-0.015em',
      },
      color: { text: C.ink },
      spacing: { margin: { top: '2.6rem', bottom: '0.75rem' } },
    },
  };
  return `<!-- wp:heading ${JSON.stringify(attrs)} -->
<h2 class="wp-block-heading" id="${anchor}">${text}</h2>
<!-- /wp:heading -->`;
}

function listItems(items) {
  return `<!-- wp:list -->
<ul class="wp-block-list">${items.map((i) => `<!-- wp:list-item -->\n<li>${i}</li>\n<!-- /wp:list-item -->`).join('\n')}</ul>
<!-- /wp:list -->`;
}

function note(inner, todo) {
  const attrs = {
    style: {
      color: { text: C.ink },
      spacing: { padding: { left: '16px' }, margin: { top: '1.25rem', bottom: '1.25rem' } },
      border: { left: { color: todo ? '#1e4d8c' : C.rule, width: '3px' } },
    },
    layout: { type: 'constrained' },
  };
  return `<!-- wp:group ${JSON.stringify(attrs)} -->
<div class="wp-block-group">${inner}</div>
<!-- /wp:group -->`;
}

function figure(src, alt, caption, width) {
  const imgAttrs = { ...(width ? { width } : {}), sizeSlug: 'large', align: 'center' };
  const style = width ? ` style="width:${width}"` : '';
  const cap = caption
    ? `<!-- wp:paragraph {"align":"center","style":{"typography":{"fontFamily":${JSON.stringify(FONT_TEXT)},"fontSize":"0.92rem","fontStyle":"italic","lineHeight":"1.45"},"color":{"text":"${C.slate}"},"spacing":{"margin":{"top":"8px","bottom":"0"}}}} -->
<p class="has-text-align-center">${caption}</p>
<!-- /wp:paragraph -->`
    : '';
  const inner = `<!-- wp:image ${JSON.stringify(imgAttrs)} -->
<figure class="wp-block-image aligncenter size-large${width ? ' is-resized' : ''}"><img src="${src}" alt="${esc(alt)}"${style}/></figure>
<!-- /wp:image -->${cap ? `\n\n${cap}` : ''}`;
  const wrap = {
    style: {
      color: { background: '#f7fafc' },
      border: { width: '1px', color: C.rule, radius: '8px' },
      spacing: { padding: { top: '12px', right: '12px', bottom: '8px', left: '12px' }, margin: { top: '1.5rem', bottom: '1.5rem' }, blockGap: '8px' },
    },
    layout: { type: 'constrained' },
  };
  return `<!-- wp:group ${JSON.stringify(wrap)} -->
<div class="wp-block-group">${inner}</div>
<!-- /wp:group -->`;
}

const UPLOADS = 'https://studyhub185.wordpress.com/wp-content/uploads/2026/10/';
const TEAM = {
  'Antonio Kanani': [20, UPLOADS + 'studyhub185-6ac6d04b1f3d2.png'],
  'Ergens Hyso': [69, UPLOADS + '4f65e1cd-55fe-4e1a-b719-790d141d41d3-2.jpg'],
  'Kristine Megrelishvili': [45, UPLOADS + 'img_2368-1-1.jpg'],
};

function teamColumns(items) {
  const cols = items.map((it) => {
    const [name, ...rest] = it.tokens[0].tokens;
    const [id, src] = TEAM[name.text];
    const attrs = {
      id,
      width: '152px',
      aspectRatio: '1',
      scale: 'cover',
      sizeSlug: 'large',
      align: 'center',
      style: { border: { radius: '8px' } },
    };
    const img = `<!-- wp:image ${JSON.stringify(attrs)} -->
<figure class="wp-block-image aligncenter size-large is-resized has-custom-border"><img src="${src}" alt="${name.text}" class="wp-image-${id}" style="border-radius:8px;aspect-ratio:1;object-fit:cover;width:152px"/></figure>
<!-- /wp:image -->`;
    const text = `<!-- wp:paragraph {"align":"center","style":{"typography":{"fontSize":"15px","lineHeight":"1.5"}}} -->
<p class="has-text-align-center"><strong>${name.text}</strong><br>${inline(rest).trim().replace(/\s*<em>/, '<br><em>')}</p>
<!-- /wp:paragraph -->`;
    return `<!-- wp:column -->
<div class="wp-block-column">${img}

${text}</div>
<!-- /wp:column -->`;
  });
  const wrap = {
    style: { spacing: { margin: { top: '8px', bottom: '8px' } } },
    layout: { type: 'constrained' },
  };
  return `<!-- wp:group ${JSON.stringify(wrap)} -->
<div class="wp-block-group"><!-- wp:columns -->
<div class="wp-block-columns">${cols.join('\n\n')}</div>
<!-- /wp:columns --></div>
<!-- /wp:group -->`;
}

function questionsPanel(title, items, footer) {
  return [
    articleH2(title, slug(title)),
    listItems(items),
    para(footer, { typography: { fontSize: '1.05rem' }, color: { text: C.slate } }),
  ].join('\n\n');
}

function tocAside(h2s) {
  const items = h2s
    .map((h, i) => {
      const num = String(i + 1).padStart(2, '0');
      return `<!-- wp:list-item -->
<li><a href="#${h.slug}"><span style="color:${C.royal}">${num}</span> ${esc(h.text)}</a></li>
<!-- /wp:list-item -->`;
    })
    .join('\n');
  const list = `<!-- wp:list {"style":{"typography":{"fontSize":"14px","lineHeight":"1.65"},"spacing":{"padding":{"left":"0"}}}} -->
<ul class="wp-block-list">${items}</ul>
<!-- /wp:list -->`;
  const label = `<!-- wp:paragraph {"style":{"typography":{"fontSize":"11px","fontWeight":"600","letterSpacing":"0.14em","textTransform":"uppercase"},"color":{"text":"${C.slate}"}}} -->
<p>In this article</p>
<!-- /wp:paragraph -->`;
  const attrs = {
    style: {
      color: { background: C.mist },
      spacing: { padding: { top: '22px', right: '22px', bottom: '22px', left: '22px' }, blockGap: '12px' },
      border: { width: '1px', color: C.rule },
    },
    layout: { type: 'constrained' },
  };
  return `<!-- wp:group ${JSON.stringify(attrs)} -->
<div class="wp-block-group">${label}

${list}</div>
<!-- /wp:group -->`;
}

function githubAside(links) {
  if (!links?.length) return '';
  const items = links
    .map(([label, href]) => `<!-- wp:list-item -->
<li><a href="${href}">${label}</a></li>
<!-- /wp:list-item -->`)
    .join('\n');
  return `${articleH2('On GitHub', 'on-github')}

<!-- wp:list -->
<ul class="wp-block-list">${items}</ul>
<!-- /wp:list -->`;
}

const isTeamList = (t) =>
  t.items.every((it) => it.tokens[0].tokens && it.tokens[0].tokens[0].type === 'strong' && TEAM[it.tokens[0].tokens[0].text]);

const isCaption = (t) => t && t.type === 'paragraph' && t.tokens.length === 1 && t.tokens[0].type === 'em';
let mermaidIndex = 0;

function block(t, next) {
  switch (t.type) {
    case 'heading':
      if (t.depth === 2 && useEditorial) return articleH2(inline(t.tokens), slug(t.text));
      if (t.depth >= 2) return headingSans(inline(t.tokens), t.depth);
      return headingSans(inline(t.tokens), t.depth);
    case 'paragraph': {
      if (t.tokens.length === 1 && t.tokens[0].type === 'image') {
        const img = t.tokens[0];
        const caption = isCaption(next) ? inline(next.tokens[0].tokens) : '';
        const width = /activity-/.test(img.href) ? '420px' : undefined;
        return { html: figure(rewrite(img.href, true), img.text, caption, width), skipNext: Boolean(caption) };
      }
      return para(inline(t.tokens));
    }
    case 'list': {
      if (isTeamList(t)) return teamColumns(t.items);
      const tag = t.ordered ? 'ol' : 'ul';
      const items = t.items
        .map((it) => `<!-- wp:list-item -->\n<li>${it.tokens.map((x) => inline(x.tokens || [x])).join('')}</li>\n<!-- /wp:list-item -->`)
        .join('\n');
      return `<!-- wp:list${t.ordered ? ' {"ordered":true}' : ''} -->
<${tag} class="wp-block-list">${items}</${tag}>
<!-- /wp:list -->`;
    }
    case 'table': {
      const cell = (c, tag) => `<${tag}>${inline(c.tokens)}</${tag}>`;
      const head = `<thead><tr>${t.header.map((c) => cell(c, 'th')).join('')}</tr></thead>`;
      const body = `<tbody>${t.rows.map((r) => `<tr>${r.map((c) => cell(c, 'td')).join('')}</tr>`).join('')}</tbody>`;
      const table = `<!-- wp:table {"style":{"typography":{"fontSize":"15px"}}} -->
<figure class="wp-block-table"><table class="has-fixed-layout">${head}${body}</table></figure>
<!-- /wp:table -->`;
      const wrap = {
        style: {
          spacing: { margin: { top: '1.5rem', bottom: '1.5rem' } },
          typography: { fontFamily: FONT_TEXT, fontSize: '0.98rem' },
        },
        layout: { type: 'constrained' },
      };
      return `<!-- wp:group ${JSON.stringify(wrap)} -->
<div class="wp-block-group">${table}</div>
<!-- /wp:group -->`;
    }
    case 'code':
      if (t.lang === 'mermaid') return figure(RAW + MERMAID[key][mermaidIndex++], 'Diagram', '', undefined);
      return `<!-- wp:code {"style":{"color":{"background":"${C.codeBg}","text":"#e8eef6"},"spacing":{"padding":{"top":"16px","bottom":"16px","left":"18px","right":"18px"},"margin":{"top":"1.25rem","bottom":"1.25rem"}},"typography":{"fontSize":"0.9rem","lineHeight":"1.55","fontFamily":"ui-monospace, \\"Cascadia Code\\", \\"Source Code Pro\\", Consolas, monospace"}}} -->
<pre class="wp-block-code"><code>${esc(t.text)}</code></pre>
<!-- /wp:code -->`;
    case 'blockquote': {
      const inner = t.tokens
        .filter((x) => x.type !== 'space')
        .map((x) => block(x))
        .join('\n');
      return note(inner, /To do \(team\)/.test(t.raw));
    }
    case 'hr':
      return sectionRule();
    case 'space':
      return null;
    default:
      throw new Error('Unhandled token: ' + t.type);
  }
}

const all = marked.lexer(fs.readFileSync(file, 'utf8')).filter((t) => t.type !== 'space');
const title = all.shift().text;
const byline = all.shift();

const h2s = all.filter((t) => t.type === 'heading' && t.depth === 2).map((t) => ({ text: t.text, slug: slug(t.text) }));

const bylineHtml = `<!-- wp:paragraph {"style":{"typography":{"fontFamily":${JSON.stringify(FONT_TEXT)},"fontSize":"1rem","fontStyle":"italic","lineHeight":"1.5"},"color":{"text":"${C.slate}"},"spacing":{"margin":{"top":"0","bottom":"1.75rem"}}}} -->
<p>${inline(byline.tokens)}</p>
<!-- /wp:paragraph -->`;

const out = [];
for (let i = 0; i < all.length; i++) {
  const r = block(all[i], all[i + 1]);
  if (!r) continue;
  if (typeof r === 'object') {
    out.push(r.html);
    if (r.skipNext) i++;
  } else {
    out.push(r);
  }
}

const reflection = out.findIndex((b) => b.includes('Reflection on AI use'));
if (reflection !== -1 && QUESTIONS[key]) {
  out.splice(
    reflection,
    0,
    questionsPanel('Questions for you', QUESTIONS[key], 'Leave us a comment, we read every one of them.')
  );
}

const mainBody = out.join('\n\n');

let articleInner;
if (useEditorial) {
  const mainCol = {
    style: {
      typography: { fontFamily: FONT_TEXT, fontSize: '1.1875rem', lineHeight: '1.7' },
      color: { text: C.ink },
      elements: { link: { color: { text: C.royal } } },
    },
    layout: { type: 'constrained' },
  };
  const mainWrapped = `<!-- wp:group ${JSON.stringify(mainCol)} -->
<div class="wp-block-group">${mainBody}</div>
<!-- /wp:group -->`;
  if (week01Simple) {
    articleInner = `${bylineHtml}

${mainWrapped}

${githubAside(GITHUB_ASIDE[key]) || ''}`;
  } else {
    const aside = [tocAside(h2s), githubAside(GITHUB_ASIDE[key])].filter(Boolean).join('\n\n');
    articleInner = `${bylineHtml}

<!-- wp:columns {"align":"wide","style":{"spacing":{"blockGap":{"left":"40px"}}}} -->
<div class="wp-block-columns alignwide"><!-- wp:column {"width":"72%"} -->
<div class="wp-block-column" style="flex-basis:72%">${mainWrapped}</div>
<!-- /wp:column -->

<!-- wp:column {"width":"28%"} -->
<div class="wp-block-column" style="flex-basis:28%">${aside}</div>
<!-- /wp:column --></div>
<!-- /wp:columns -->`;
  }
} else {
  const page = {
    style: { typography: { fontFamily: FONT_TEXT, fontSize: '1.1875rem', lineHeight: '1.7' }, color: { text: C.ink } },
    layout: { type: 'constrained' },
  };
  articleInner = `${bylineHtml}

<!-- wp:group ${JSON.stringify(page)} -->
<div class="wp-block-group">${mainBody}</div>
<!-- /wp:group -->`;
}

fs.writeFileSync(process.argv[3], articleInner);
console.log(title);
