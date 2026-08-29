const fs = require('fs');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  const regex = /import\s+\{\s*useI18n\s*\}\s+from\s+['"]@\/hooks\/useI18n['"];?/g;
  let matches = [...content.matchAll(regex)];
  if (matches.length > 1) {
    // Keep first, remove others
    const toRemove = matches.slice(1);
    let newContent = '';
    let lastIndex = 0;
    toRemove.forEach(m => {
      newContent += content.substring(lastIndex, m.index);
      lastIndex = m.index + m[0].length;
      if (content[lastIndex] === '\n') lastIndex++;
      else if (content.substring(lastIndex, lastIndex+2) === '\r\n') lastIndex += 2;
    });
    newContent += content.substring(lastIndex);
    fs.writeFileSync(f, newContent);
    console.log('Fixed imports in', f);
  }
});
