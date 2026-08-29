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
  let regex = /import\s+\{\s*useI18n\s*\}\s+from\s+['"]@\/hooks\/useI18n['"];?(\r?\n)?/g;
  let matches = [...content.matchAll(regex)];
  if (matches.length > 1) {
    let first = matches[0];
    let newContent = content.substring(0, first.index + first[0].length);
    let rest = content.substring(first.index + first[0].length);
    newContent += rest.replace(regex, '');
    fs.writeFileSync(f, newContent);
    console.log('Fixed imports in', f);
  }
});
