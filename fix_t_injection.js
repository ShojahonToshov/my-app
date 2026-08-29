const fs = require('fs');
const glob = require('fs').readdirSync;

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx')) results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  if (content.includes('t("extra.') || content.includes('t("app.')) {
    if (f.includes('LanguageSwitcher')) return;
    
    if (!content.includes('const { t } = useI18n();')) {
      let regex = /export default function (\w+)\s*\([^)]*\)\s*\{/;
      let match = content.match(regex);
      if (match) {
        let insertPos = match.index + match[0].length;
        content = content.substring(0, insertPos) + '\n  const { t } = useI18n();\n' + content.substring(insertPos);
        if (!content.includes('import { useI18n }')) {
            content = content.replace(/"use client";/, '"use client";\nimport { useI18n } from "@/hooks/useI18n";');
            if (!content.includes('import { useI18n }')) {
                content = content.replace(/'use client';/, "'use client';\nimport { useI18n } from \"@/hooks/useI18n\";");
                if (!content.includes('import { useI18n }')) {
                     content = 'import { useI18n } from "@/hooks/useI18n";\n' + content;
                }
            }
        }
        fs.writeFileSync(f, content);
        console.log('Fixed', f);
      } else {
        let regex2 = /export default (\w+)\s*=>\s*\{/;
        let match2 = content.match(regex2);
        if (match2) {
            let insertPos = match2.index + match2[0].length;
            content = content.substring(0, insertPos) + '\n  const { t } = useI18n();\n' + content.substring(insertPos);
            if (!content.includes('import { useI18n }')) {
                content = content.replace(/"use client";/, '"use client";\nimport { useI18n } from "@/hooks/useI18n";');
                if (!content.includes('import { useI18n }')) {
                    content = content.replace(/'use client';/, "'use client';\nimport { useI18n } from \"@/hooks/useI18n\";");
                    if (!content.includes('import { useI18n }')) {
                         content = 'import { useI18n } from "@/hooks/useI18n";\n' + content;
                    }
                }
            }
            fs.writeFileSync(f, content);
            console.log('Fixed', f);
        } else {
            let regex3 = /function (\w+)\s*\([^)]*\)\s*\{/;
            let match3 = content.match(regex3);
            if (match3) {
                 let insertPos = match3.index + match3[0].length;
                 content = content.substring(0, insertPos) + '\n  const { t } = useI18n();\n' + content.substring(insertPos);
                 if (!content.includes('import { useI18n }')) {
                    content = content.replace(/"use client";/, '"use client";\nimport { useI18n } from "@/hooks/useI18n";');
                    if (!content.includes('import { useI18n }')) {
                        content = content.replace(/'use client';/, "'use client';\nimport { useI18n } from \"@/hooks/useI18n\";");
                        if (!content.includes('import { useI18n }')) {
                             content = 'import { useI18n } from "@/hooks/useI18n";\n' + content;
                        }
                    }
                 }
                 fs.writeFileSync(f, content);
                 console.log('Fixed', f);
            }
        }
      }
    }
  }
});
