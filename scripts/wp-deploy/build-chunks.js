const fs = require('fs');
const path = require('path');
const src = fs.readFileSync(path.join(__dirname, 'sh-bundle.js'), 'utf8');
const b64 = Buffer.from(src).toString('base64');
const chunkSize = 12000;
const chunks = [];
for (let i = 0; i < b64.length; i += chunkSize) {
  chunks.push(b64.slice(i, i + chunkSize));
}
const outDir = path.join(__dirname, 'chunks');
fs.mkdirSync(outDir, { recursive: true });
const lines = [];
chunks.forEach((c, i) => {
  const name = `chunk-${i}.js`;
  const body = `localStorage.setItem('shb${i}', ${JSON.stringify(c)}); console.log('stored chunk ${i}/${chunks.length - 1}');`;
  fs.writeFileSync(path.join(outDir, name), body);
  lines.push(body);
});
const tail =
  "const b=Array.from({length:" +
  chunks.length +
  "},(_,i)=>localStorage.getItem('shb'+i)).join('');eval(atob(b));console.log('SH ready',typeof SH);SH.run('journalPilot').then(r=>console.log('OK',r)).catch(console.error)";
fs.writeFileSync(path.join(outDir, 'chunk-run.js'), tail);
fs.writeFileSync(
  path.join(outDir, 'README.txt'),
  `Paste into Firefox console on wp-admin (post editor), one chunk at a time in order:\n` +
    chunks.map((_, i) => `chunk-${i}.js`).join('\n') +
    '\nchunk-run.js\n'
);
console.log(chunks.length, 'chunks', outDir);
