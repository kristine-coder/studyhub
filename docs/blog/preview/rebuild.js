const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const preview = __dirname;
const blog = path.join(preview, '..');
const repo = path.join(blog, '..', '..');
const ghBlob = 'https://github.com/kristine-coder/studyhub/blob/main/';
const ghRaw = 'https://raw.githubusercontent.com/kristine-coder/studyhub/main/';

const weeks = [
  ['week-1', 'week-01-introduction.md', 'The idea, and who it is for.'],
  ['week-2', 'week-02-team-technology-setup.md', 'Roles, and how the app will be built.'],
  ['week-3', 'week-03-requirements-and-use-cases.md', 'What StudyHub must do.'],
  ['week-4', 'week-04-use-case-specification.md', 'Two use cases, written out in full.'],
  ['week-5', 'week-05-testing-with-cucumber.md', 'The same use cases, as tests we can run.'],
  ['week-6', 'week-06-in-progress.md', 'Not written yet. The page is ready for next week.'],
];

const questions = {
  'week-01-introduction.md': [
    'What is the most chaotic part of group work for you?',
    'Which part of StudyHub would you actually use first?',
    'Is something missing? What would make you switch from your group chat?',
  ],
  'week-02-team-technology-setup.md': [
    'Does our architecture make sense for a one-semester project?',
    'Which tool do you use to plan and track your team work?',
  ],
  'week-03-requirements-and-use-cases.md': [
    'Do our priorities (High, Medium, Low) look right to you?',
    'Are our quality goals, like 2 seconds per page, realistic?',
    'Is anything in the use case diagram unclear?',
  ],
  'week-04-use-case-specification.md': [
    'Could you build Create a task or Schedule meeting from our specification alone?',
    'Which alternative flow did we miss?',
  ],
  'week-05-testing-with-cucumber.md': [
    'Are our scenarios easy to read if you do not write code?',
    'Which scenario would you add to one of our feature files?',
  ],
  'week-06-in-progress.md': [
    'What should we show from this week: a screen, a diagram, or a decision?',
  ],
};

function rewrite(href, isImage) {
  if (/^(https?:|mailto:|#)/.test(href)) return href;
  const [p, hash] = href.split('#');
  const abs = path.resolve(blog, p);
  if (isImage) {
    const local = path.relative(preview, abs).split(path.sep).join('/');
    if (fs.existsSync(abs)) return local;
    return ghRaw + path.relative(repo, abs).split(path.sep).join('/');
  }
  return ghBlob + path.relative(repo, abs).split(path.sep).join('/') + (hash ? '#' + hash : '');
}

const renderer = new marked.Renderer();
renderer.link = function (token) {
  return `<a href="${rewrite(token.href || '', false)}">${this.parser.parseInline(token.tokens)}</a>`;
};
renderer.image = function (token) {
  const src = rewrite(token.href || '', true);
  const alt = token.text || '';
  return `<figure><img src="${src}" alt="${alt}"><figcaption>${alt}</figcaption></figure>`;
};
renderer.code = function (token) {
  if (token.lang === 'mermaid') {
    return `<figure><img src="../../diagrams/architecture.png" alt="StudyHub architecture"><figcaption>StudyHub architecture: browser, back end, database and email.</figcaption></figure>`;
  }
  return `<pre><code>${token.text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')}</code></pre>`;
};
marked.use({ renderer });

function commentBox(n) {
  return `<section class="comments">
      <h2>Comments</h2>
      <form action="#" onsubmit="return false">
        <label class="sr-only" for="comment-${n}">Comment</label>
        <textarea id="comment-${n}" rows="5" placeholder="Write a comment…"></textarea>
        <button type="submit">Post comment</button>
      </form>
    </section>`;
}

const weekMains = weeks
  .map(([id, file], i) => {
    const raw = fs.readFileSync(path.join(blog, file), 'utf8');
    const title = raw.match(/^# (.+)$/m)[1];
    const body = raw.replace(/^# .+\r?\n+/, '');
    let html = marked.parse(body);
    const ask = `<h2>Questions for you</h2><ul>${questions[file].map((q) => `<li>${q}</li>`).join('')}</ul><p>Leave us a comment, we read every one of them.</p>`;
    html = html.replace(/<h2>Reflection on AI use<\/h2>/, `${ask}<h2>Reflection on AI use</h2>`);
    return `<main id="${id}" class="post" hidden>
  <div class="sheet">
    <h1>${title}</h1>
    ${html}
    ${commentBox(i + 1)}
  </div>
</main>`;
  })
  .join('\n\n');

const weekCards = weeks
  .map(([id, file, blurb]) => {
    const title = fs.readFileSync(path.join(blog, file), 'utf8').match(/^# Week \d+: (.+)$/m)[1];
    const num = id.replace('week-', 'Week ');
    return `      <a href="#${id}" data-go="${id}"><span>${num}</span><strong>${title}</strong><small>${blurb}</small></a>`;
  })
  .join('\n');

const catalog = weeks
  .map(([id, file]) => {
    const title = fs.readFileSync(path.join(blog, file), 'utf8').match(/^# (.+)$/m)[1];
    return `        <li><a href="#${id}" data-go="${id}">${title}</a></li>`;
  })
  .join('\n');

const aboutLinks = weeks
  .map(([id, file]) => {
    const title = fs.readFileSync(path.join(blog, file), 'utf8').match(/^# (.+)$/m)[1];
    return `      <li><a href="#${id}" data-go="${id}">${title}</a></li>`;
  })
  .join('\n');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>StudyHub journal — design preview</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,600;1,7..72,400&family=Source+Sans+3:wght@400;600;700&display=swap">
<style>
  :root {
    --navy: #0B1F3A;
    --page: #e7eef6;
    --card: #ffffff;
    --ink: #142033;
    --muted: #5c6b7a;
    --line: #d5deea;
    --link: #1e4d8c;
    --measure: 42rem;
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; background: var(--page); color: var(--ink); }
  body { font-family: Literata, Georgia, "Iowan Old Style", Palatino, serif; font-size: 1.125rem; line-height: 1.7; }
  a { color: var(--link); }
  button { font: inherit; }
  h1, h2, .brand strong, .foot-brand strong, .weeks strong, .foot h2 {
    font-family: "Source Sans 3", "Segoe UI", sans-serif;
    letter-spacing: -0.02em;
  }
  .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0; }

  .preview-bar {
    display: flex; gap: 8px; align-items: center; flex-wrap: wrap;
    padding: 8px 16px; background: #fff; color: var(--navy);
    border-bottom: 1px solid var(--line); font-family: "Source Sans 3", sans-serif; font-size: 14px;
  }
  .preview-bar span { margin-right: 8px; color: var(--muted); }
  .preview-bar button {
    background: #fff; color: var(--navy); border: 1px solid var(--line);
    border-radius: 999px; padding: 4px 12px; cursor: pointer;
  }
  .preview-bar button[aria-current="true"] { background: var(--navy); color: #fff; border-color: var(--navy); }

  .bar { min-height: 72px; display: flex; align-items: center; background: var(--navy); color: #fff; }
  .bar-inner, .foot-inner { width: min(1080px, calc(100% - 48px)); margin: 0 auto; }
  .bar-inner { display: flex; align-items: center; justify-content: space-between; gap: 24px; min-height: 72px; }
  .brand, .nav { display: flex; align-items: center; gap: 14px; }
  .brand { color: #fff; text-decoration: none; }
  .brand img, .foot-brand img { height: 40px; width: auto; display: block; background: #fff; border-radius: 6px; }
  .brand strong, .foot-brand strong { font-weight: 700; font-size: 22px; color: #fff; }
  .nav a { color: #fff; text-decoration: none; font-family: "Source Sans 3", sans-serif; font-size: 17px; }
  .nav a.github {
    display: inline-flex; align-items: center; gap: 10px;
    background: #fff; color: var(--navy); text-decoration: none;
    font-family: "Source Sans 3", sans-serif; font-weight: 700; font-size: 16px;
    padding: 8px 14px 8px 10px; border-radius: 8px;
  }
  .github svg { width: 30px; height: 30px; display: block; }

  main { background: var(--page); }
  .sheet { width: min(1080px, calc(100% - 48px)); margin: 0 auto; padding: 32px 0 56px; }
  main.post .sheet, #about .sheet {
    width: min(var(--measure), calc(100% - 48px));
    background: var(--card); margin-top: 28px; margin-bottom: 36px;
    padding: 36px 40px 48px; border-radius: 10px;
    box-shadow: 0 1px 0 rgba(11, 31, 58, 0.06);
  }
  h1 { font-size: clamp(2rem, 4vw, 2.6rem); font-weight: 700; line-height: 1.15; color: var(--navy); margin: 0 0 0.35em; }
  h2 { font-size: 1.55rem; font-weight: 700; line-height: 1.25; color: var(--navy); margin: 2.2rem 0 0.55rem; }
  .kicker { color: var(--muted); margin: 0 0 1.4rem; font-size: 1rem; }
  p { margin: 0 0 1em; }
  ul, ol { padding-left: 1.2em; }
  li { margin: 0.3em 0; }
  figure { margin: 1.6rem 0; background: #f7fafc; border: 1px solid var(--line); border-radius: 8px; padding: 12px; }
  figure img { width: 100%; height: auto; display: block; border-radius: 4px; }
  figcaption { color: var(--muted); font-size: 0.92rem; line-height: 1.45; text-align: center; margin-top: 8px; }
  pre {
    background: var(--navy); color: #e8eef6; border-radius: 8px;
    padding: 16px 18px; overflow: auto; font-size: 0.9rem; line-height: 1.55;
    font-family: ui-monospace, "Cascadia Code", "Source Code Pro", Consolas, monospace;
  }
  table { width: 100%; border-collapse: collapse; font-size: 0.98rem; margin: 1rem 0 1.4rem; }
  th, td { border-bottom: 1px solid var(--line); text-align: left; padding: 8px 10px; vertical-align: top; }
  blockquote { margin: 1.1rem 0; padding: 0 0 0 16px; border-left: 3px solid var(--link); }
  .comments { margin-top: 2.4rem; padding-top: 1.4rem; border-top: 1px solid var(--line); font-family: "Source Sans 3", sans-serif; }
  .comments h2 { margin-top: 0; margin-bottom: 12px; }
  .comments textarea { width: 100%; border: 1px solid var(--line); border-radius: 6px; padding: 12px 14px; font: inherit; background: #fff; resize: vertical; }
  .comments button { margin-top: 12px; background: var(--navy); color: #fff; border: 0; border-radius: 6px; padding: 10px 16px; font-weight: 700; cursor: pointer; }
  .weeks { display: flex; flex-direction: column; gap: 10px; margin-top: 18px; }
  .weeks a {
    display: grid; grid-template-columns: 92px 1fr; gap: 8px 16px; align-items: baseline;
    background: #fff; color: inherit; text-decoration: none;
    border-radius: 10px; padding: 16px 20px; border-left: 4px solid var(--navy);
  }
  .weeks a:hover { border-left-color: var(--link); }
  .weeks span { font-family: "Source Sans 3", sans-serif; font-weight: 700; font-size: 14px; color: var(--link); }
  .weeks strong { font-size: 1.25rem; font-weight: 700; color: var(--navy); line-height: 1.25; }
  .weeks small { grid-column: 2; color: var(--muted); font-size: 15px; }

  .team { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin: 0.5rem 0; }
  .team figure { margin: 0; background: transparent; border: 0; padding: 0; }
  .team img { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 8px; }
  .team figcaption { text-align: center; color: var(--ink); font-size: 0.95rem; }
  .team em { color: var(--muted); }

  .slot {
    border: 1px dashed #9eb0c6; background: #f7fafc; border-radius: 8px;
    padding: 28px 16px; text-align: center; color: var(--muted); font-size: 0.95rem; margin: 1.4rem 0;
  }

  .foot { background: var(--navy); color: #fff; padding: 32px 0 40px; }
  .foot-inner { display: grid; grid-template-columns: 240px 1fr; gap: 40px; align-items: start; }
  .foot-brand { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; color: #fff; text-decoration: none; }
  .foot p { color: #c5d4e6; font-family: "Source Sans 3", sans-serif; font-size: 15px; line-height: 1.45; margin: 0; }
  .foot h2 { font-size: 20px; margin: 0 0 12px; color: #fff; }
  .catalog { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 28px; font-family: "Source Sans 3", sans-serif; font-size: 16px; line-height: 1.35; }
  .catalog a { color: #d6e4f5; text-decoration: none; }
  .catalog a:hover { color: #fff; }

  .gh { background: #fff; color: #1f2328; min-height: 70vh; }
  .gh-top { background: #f6f8fa; border-bottom: 1px solid #d1d9e0; padding: 16px 0; font-family: -apple-system, Segoe UI, sans-serif; font-size: 14px; }
  .gh-top .bar-inner { min-height: 0; }
  .repo { font-weight: 600; }
  .gh .sheet { max-width: 48rem; font-family: -apple-system, Segoe UI, sans-serif; font-size: 16px; line-height: 1.6; }
  .gh h1 { font-family: -apple-system, Segoe UI, sans-serif; font-size: 2rem; font-weight: 600; letter-spacing: 0; }
  .gh h2 { font-family: -apple-system, Segoe UI, sans-serif; font-size: 1.5rem; font-weight: 600; border-bottom: 1px solid #d1d9e0; padding-bottom: 0.3em; letter-spacing: 0; }
  .gh a { color: #0969da; }
  .note { font-size: 14px; color: #59636e; }

  [hidden] { display: none !important; }
  @media (max-width: 720px) {
    .bar-inner, .foot-inner, .sheet { width: calc(100% - 32px); }
    .bar-inner { flex-wrap: wrap; padding: 12px 0; }
    .team, .catalog, .weeks a { grid-template-columns: 1fr; }
    .weeks small { grid-column: 1; }
    main.post .sheet, #about .sheet { padding: 24px 18px 32px; }
    .foot-inner { grid-template-columns: 1fr; gap: 24px; }
  }
</style>
</head>
<body>
<div class="preview-bar">
  <span>Preview</span>
  <button type="button" data-view="home" aria-current="true">Journal</button>
  <button type="button" data-view="about">About</button>
  <button type="button" data-view="github">GitHub</button>
</div>

<header class="bar" data-chrome="site">
  <div class="bar-inner">
    <a class="brand" href="#home" data-go="home">
      <img src="https://studyhub185.wordpress.com/wp-content/uploads/2026/10/studyhub-profile-text.png" alt="">
      <strong>StudyHub</strong>
    </a>
    <div class="nav">
      <a href="#about" data-go="about">About</a>
      <a class="github" href="https://github.com/kristine-coder/studyhub" target="_blank" rel="noopener">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
        GitHub
      </a>
    </div>
  </div>
</header>

<main id="home">
  <div class="sheet">
    <h1>StudyHub</h1>
    <p class="lede">A weekly log of a planner for student teams. Each week we write what we decided, and we link the same files that are on GitHub.</p>
    <div class="weeks">
${weekCards}
    </div>
  </div>
</main>

${weekMains}

<main id="about" hidden>
  <div class="sheet">
    <h1>About</h1>
    <p class="kicker">Ergens Hyso, Kristine Megrelishvili and Antonio Kanani</p>
    <p>StudyHub is a web app for student teams. It keeps courses, deadlines, tasks, meetings and notes in one place, so a group spends less time coordinating and more time on the work.</p>
    <p>We are three computer science exchange students at DHBW Karlsruhe. This blog is the weekly log of how we build StudyHub. The same documents and the code are in the <a href="https://github.com/kristine-coder/studyhub">GitHub repository</a>.</p>
    <h2>The team</h2>
    <div class="team">
      <figure>
        <img src="https://studyhub185.wordpress.com/wp-content/uploads/2026/10/studyhub185-6ac6d04b1f3d2.png" alt="Antonio Kanani">
        <figcaption><strong>Antonio Kanani</strong><br>Keeps the group organized.<br><em>University of Vlora, Albania</em></figcaption>
      </figure>
      <figure>
        <img src="https://studyhub185.wordpress.com/wp-content/uploads/2026/10/4f65e1cd-55fe-4e1a-b719-790d141d41d3-2.jpg" alt="Ergens Hyso">
        <figcaption><strong>Ergens Hyso</strong><br>Backend, in Python or Java.<br><em>University of Vlora, Albania</em></figcaption>
      </figure>
      <figure>
        <img src="https://studyhub185.wordpress.com/wp-content/uploads/2026/10/img_2368-1-1.jpg" alt="Kristine Megrelishvili">
        <figcaption><strong>Kristine Megrelishvili</strong><br>UI and whether people understand it.<br><em>Georgia</em></figcaption>
      </figure>
    </div>
    <div class="slot">A photo of the three of you together.<br>Take it tomorrow and put it under the portraits.</div>
    <h2>The weeks</h2>
    <ol>
${aboutLinks}
    </ol>
    <figure>
      <img src="../../diagrams/subsystems.png" alt="StudyHub subsystems and outside systems">
      <figcaption>The six subsystems inside StudyHub, the same diagram as in the repository.</figcaption>
    </figure>
  </div>
</main>

<main id="github" class="gh" hidden>
  <div class="gh-top">
    <div class="bar-inner"><span class="repo">kristine-coder / studyhub</span></div>
  </div>
  <div class="sheet">
    <h1>StudyHub</h1>
    <p>Group projects and study sessions can quickly become frustratingly chaotic. Between juggling different group chats, trying to align everyone's schedules, and losing important notes across multiple apps, students end up wasting half their energy just trying to stay organized.</p>
    <p>StudyHub helps students keep track of their courses, deadlines, and group work in one place.</p>
    <h2>Blog</h2>
    <p class="note">The same weeks, in the same order, as the blog footer and the About page.</p>
    <ul>
      <li><a href="#about" data-go="about">About</a></li>
${aboutLinks}
    </ul>
    <h2>Documentation</h2>
    <ul>
      <li><a href="https://github.com/kristine-coder/studyhub/blob/main/docs/SRS.md">Software Requirements Specification</a></li>
      <li>Use case specifications: Create a task, Schedule meeting</li>
    </ul>
  </div>
</main>

<footer class="foot" data-chrome="site">
  <div class="foot-inner">
    <a class="foot-brand" href="#home" data-go="home">
      <img src="https://studyhub185.wordpress.com/wp-content/uploads/2026/10/studyhub-profile-text.png" alt="">
      <strong>StudyHub</strong>
      <p>A weekly log of building StudyHub.</p>
    </a>
    <div>
      <h2>Catalog</h2>
      <ul class="catalog">
${catalog}
      </ul>
    </div>
  </div>
</footer>

<script>
  const views = ["home", "about", "github", "week-1", "week-2", "week-3", "week-4", "week-5", "week-6"];
  function show(id) {
    for (const v of views) {
      const el = document.getElementById(v);
      if (el) el.hidden = v !== id;
    }
    document.querySelectorAll("[data-chrome]").forEach((el) => { el.hidden = id === "github"; });
    const barId = id.startsWith("week-") ? "home" : id;
    document.querySelectorAll(".preview-bar button").forEach((b) => {
      if (b.dataset.view === barId) b.setAttribute("aria-current", "true");
      else b.removeAttribute("aria-current");
    });
    window.scrollTo(0, 0);
    history.replaceState(null, "", "#" + id);
  }
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-go], .preview-bar button");
    if (!t) return;
    if (t.classList.contains("github") && t.getAttribute("href") && t.getAttribute("href").startsWith("http")) return;
    if (t.dataset.go || t.dataset.view) {
      e.preventDefault();
      show(t.dataset.go || t.dataset.view);
    }
  });
  const start = (location.hash || "#home").slice(1);
  if (views.includes(start)) show(start);
</script>
</body>
</html>
`;

fs.writeFileSync(path.join(preview, 'index.html'), html);
console.log('rebuilt preview with', weeks.length, 'weeks');
