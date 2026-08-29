const fs = require('fs');
const path = require('path');

function walk(dir) {
  let res = [];
  const list = fs.readdirSync(dir);
  for (let file of list) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      res = res.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      res.push(file);
    }
  }
  return res;
}

const files = walk(path.join(__dirname, 'src'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Replace useI18nStore() with useI18n()
  if (content.includes('useI18nStore()')) {
    content = content.replace(/useI18nStore\(\)/g, 'useI18n()');
    changed = true;
  }

  // If we replaced, we must ensure import is correct
  if (changed) {
    if (content.includes('import { useI18nStore } from "@/stores/i18nStore";')) {
      if (content.includes('useI18nStore.getState')) {
        // needs both
        content = content.replace(
          'import { useI18nStore } from "@/stores/i18nStore";',
          'import { useI18nStore } from "@/stores/i18nStore";\nimport { useI18n } from "@/hooks/useI18n";'
        );
      } else {
        // only needs useI18n
        content = content.replace(
          'import { useI18nStore } from "@/stores/i18nStore";',
          'import { useI18n } from "@/hooks/useI18n";'
        );
      }
    } else if (content.includes('import { useI18nStore, Language } from "@/stores/i18nStore";')) {
      if (content.includes('useI18nStore.getState')) {
        content = content.replace(
          'import { useI18nStore, Language } from "@/stores/i18nStore";',
          'import { useI18nStore, Language } from "@/stores/i18nStore";\nimport { useI18n } from "@/hooks/useI18n";'
        );
      } else {
        content = content.replace(
          'import { useI18nStore, Language } from "@/stores/i18nStore";',
          'import { Language } from "@/stores/i18nStore";\nimport { useI18n } from "@/hooks/useI18n";'
        );
      }
    } else {
      // maybe no import or different format
      // just append it after "use client"; or at top
      if (!content.includes('import { useI18n }')) {
        if (content.startsWith('"use client";') || content.startsWith("'use client';")) {
          const lines = content.split('\n');
          lines.splice(1, 0, 'import { useI18n } from "@/hooks/useI18n";');
          content = lines.join('\n');
        } else {
          content = 'import { useI18n } from "@/hooks/useI18n";\n' + content;
        }
      }
    }
    
    console.log('Fixed', file);
    fs.writeFileSync(file, content, 'utf8');
  }
}
