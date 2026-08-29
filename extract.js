const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

const res = {};

walk('./src', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, i) => {
      const matches = line.match(/>\s*([a-zA-Z][^<{]+?)\s*</g);
      if (matches) {
        matches.forEach(m => {
          const text = m.match(/>\s*(.+?)\s*</)[1].trim();
          if (text && text.length > 1 && /[a-zA-Z]/.test(text) && !text.startsWith('t(') && !text.startsWith('app.')) {
            if (!res[filePath]) res[filePath] = [];
            res[filePath].push({ line: i+1, text });
          }
        });
      }
      
      const attrMatches = line.match(/(?:placeholder|label|title|alt|description|text)="([^"]+)"/g);
      if (attrMatches) {
        attrMatches.forEach(m => {
          const val = m.split('=')[1].slice(1, -1);
          if (val && /[a-zA-Z]/.test(val)) {
            if (!res[filePath]) res[filePath] = [];
            res[filePath].push({ line: i+1, text: val });
          }
        });
      }
    });
  }
});

fs.writeFileSync('untranslated.json', JSON.stringify(res, null, 2));
