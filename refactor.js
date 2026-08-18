const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const businessDir = path.join(srcDir, 'features', 'business-pages');
const marketDir = path.join(srcDir, 'features', 'market-pages');

// Mappings of old absolute paths to new absolute paths (relative to src)
const moveMap = new Map();

function walk(dir, callback) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      walk(p, callback);
    } else {
      callback(p);
    }
  }
}

function getDestPath(file) {
  const rel = path.relative(srcDir, file).replace(/\\/g, '/');
  let dest = null;

  const match = rel.match(/^features\/(business-pages|market-pages)\/(.*)$/);
  if (!match) return null;

  const feature = match[1];
  const sub = match[2];

  if (sub.startsWith('hooks/')) dest = sub;
  else if (sub.startsWith('stores/')) dest = sub;
  else if (sub.startsWith('lib/')) dest = sub;
  else if (sub.startsWith('constants/')) dest = sub;
  else if (sub.startsWith('types/')) dest = sub;
  else if (sub.startsWith('utils/')) dest = sub;
  else if (sub.startsWith('api/services/')) dest = sub.replace('api/services/', 'services/');
  else if (sub.startsWith('api/')) dest = sub.replace('api/', 'services/'); // fallback
  else {
    dest = 'components/' + sub;
  }

  return dest;
}

[businessDir, marketDir].forEach(dir => {
  walk(dir, file => {
    const dest = getDestPath(file);
    if (dest) {
      moveMap.set(file, path.join(srcDir, dest));
    }
  });
});

// Update imports in a file's content
function rewriteContent(content, currentFileAbs) {
  const importRegex = /(from\s+|import\()(['"])(.+?)\2/g;
  return content.replace(importRegex, (match, prefix, quote, importPath) => {
    if (importPath.startsWith('.')) {
      // It's a relative import. Resolve it based on the old file location.
      const resolved = path.resolve(path.dirname(currentFileAbs), importPath);
      const relToSrc = path.relative(srcDir, resolved).replace(/\\/g, '/');
      
      const m = relToSrc.match(/^features\/(business-pages|market-pages)\/(.*)$/);
      if (m) {
        const sub = m[2];
        let newSub = sub;
        if (sub.startsWith('hooks/')) newSub = sub;
        else if (sub.startsWith('stores/')) newSub = sub;
        else if (sub.startsWith('lib/')) newSub = sub;
        else if (sub.startsWith('constants/')) newSub = sub;
        else if (sub.startsWith('types/')) newSub = sub;
        else if (sub.startsWith('utils/')) newSub = sub;
        else if (sub.startsWith('api/services/')) newSub = sub.replace('api/services/', 'services/');
        else if (sub.startsWith('api/')) newSub = sub.replace('api/', 'services/');
        else newSub = 'components/' + sub;

        return `${prefix}${quote}@/${newSub}${quote}`;
      } else {
        // Even if it doesn't match features/..., we are moving the file!
        // So the relative import needs to become relative to the NEW location, or just use @/
        if (relToSrc && !relToSrc.startsWith('..')) {
           return `${prefix}${quote}@/${relToSrc}${quote}`;
        }
      }
    } else if (importPath.startsWith('@/features/business-pages/') || importPath.startsWith('@/features/market-pages/')) {
       const relToSrc = importPath.substring(2);
       const m = relToSrc.match(/^features\/(business-pages|market-pages)\/(.*)$/);
       if (m) {
         const sub = m[2];
         let newSub = sub;
         if (sub.startsWith('hooks/')) newSub = sub;
         else if (sub.startsWith('stores/')) newSub = sub;
         else if (sub.startsWith('lib/')) newSub = sub;
         else if (sub.startsWith('constants/')) newSub = sub;
         else if (sub.startsWith('types/')) newSub = sub;
         else if (sub.startsWith('utils/')) newSub = sub;
         else if (sub.startsWith('api/services/')) newSub = sub.replace('api/services/', 'services/');
         else if (sub.startsWith('api/')) newSub = sub.replace('api/', 'services/');
         else newSub = 'components/' + sub;
 
         return `${prefix}${quote}@/${newSub}${quote}`;
       }
    }
    return match;
  });
}

// 1. Rewrite and copy files
for (const [srcFile, destFile] of moveMap.entries()) {
  const content = fs.readFileSync(srcFile, 'utf8');
  const newContent = rewriteContent(content, srcFile);
  
  if (!fs.existsSync(destFile)) {
    fs.mkdirSync(path.dirname(destFile), { recursive: true });
    fs.writeFileSync(destFile, newContent);
    console.log('Moved', srcFile, '->', destFile);
  } else {
    console.log('Collision (skipping move)', srcFile, '->', destFile);
  }
}

// 2. Rewrite remaining files in src (not in features/business-pages or market-pages)
walk(srcDir, file => {
  const rel = path.relative(srcDir, file).replace(/\\/g, '/');
  if (rel.startsWith('features/business-pages/') || rel.startsWith('features/market-pages/')) {
    return;
  }
  const content = fs.readFileSync(file, 'utf8');
  const newContent = rewriteContent(content, file);
  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    console.log('Updated imports in', file);
  }
});
