const fs = require('fs');
const path = require('path');

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(fullPath));
    } else if (file.endsWith('.tsx')) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = walkDir(path.join(__dirname, 'src'));

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  if (content.includes('"use client";') && content.includes('import { useI18nStore } from "@/stores/i18nStore";')) {
    const useClientIdx = content.indexOf('"use client";');
    const importIdx = content.indexOf('import { useI18nStore } from "@/stores/i18nStore";');
    
    if (importIdx < useClientIdx) {
      // It's above use client! Fix it
      console.log('Fixing: ' + f);
      // Remove the import from its current position
      content = content.replace('import { useI18nStore } from "@/stores/i18nStore";\n', '');
      content = content.replace('import { useI18nStore } from "@/stores/i18nStore";', '');
      
      // Insert it after "use client";
      content = content.replace('"use client";', '"use client";\nimport { useI18nStore } from "@/stores/i18nStore";');
      fs.writeFileSync(f, content, 'utf8');
    }
  }
});
