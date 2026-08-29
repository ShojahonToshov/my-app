const fs = require('fs');
const path = require('path');

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('useI18nStore') && !content.includes('import { useI18nStore }') && !content.includes('import {useI18nStore}') && !fullPath.includes('i18nStore.ts')) {
        console.log(`Fixing ${fullPath}`);
        let newContent = content;
        const importStatement = `import { useI18nStore } from "@/stores/i18nStore";\n`;
        if (newContent.startsWith('"use client";') || newContent.startsWith("'use client';")) {
          const lines = newContent.split('\n');
          lines.splice(1, 0, importStatement);
          newContent = lines.join('\n');
        } else {
          newContent = importStatement + newContent;
        }
        fs.writeFileSync(fullPath, newContent, 'utf8');
      }
    }
  }
}

processDirectory(path.join(__dirname, 'src'));
