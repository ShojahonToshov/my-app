const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/app/search/components/SearchClient.tsx',
  'src/components/dashboard-pages/Customers.tsx',
  'src/components/dashboard-pages/Settings.tsx'
];

filesToFix.forEach(f => {
  const fullPath = path.join(__dirname, f);
  if (!fs.existsSync(fullPath)) return;
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  if (content.includes('import { useI18nStore } from "@/stores/i18nStore";') && !content.includes('const { t } = useI18nStore();')) {
    // Find the first { after export default function
    const exportIdx = content.indexOf('export default function');
    if (exportIdx !== -1) {
      const braceIdx = content.indexOf('{', exportIdx + 20);
      if (braceIdx !== -1) {
        // We have to be careful with component args like ({ x }: { x: any[] })
        // Let's just find the FIRST block `{` that follows the function signature
        let funcStart = content.substring(exportIdx);
        // Find first `{` followed by `\n` or `const` or `return`?
        // Actually it's easier to replace `export default function SearchClient({ initialVenues }: { initialVenues: any[] }) {`
        if (f.includes('SearchClient')) {
          content = content.replace('export default function SearchClient({ initialVenues }: { initialVenues: any[] }) {', 'export default function SearchClient({ initialVenues }: { initialVenues: any[] }) {\n  const { t } = useI18nStore();');
        } else if (f.includes('Customers')) {
          content = content.replace('export default function Customers() {', 'export default function Customers() {\n  const { t } = useI18nStore();');
        } else if (f.includes('Settings')) {
          content = content.replace('export default function Settings() {', 'export default function Settings() {\n  const { t } = useI18nStore();');
        }
      }
    }
  }

  // Also wait, Customers and Settings might not have `export default function` if they are defined as const or function components differently?
  // Let's print out how they are exported
  if (!content.includes('const { t } = useI18nStore();')) {
     console.log("Still missing in " + f);
     const lines = content.split('\n');
     for(let i=0; i<lines.length; i++) {
        if(lines[i].includes('export default')) {
           console.log("Found export at line " + i + ": " + lines[i]);
        }
     }
  }

  fs.writeFileSync(fullPath, content, 'utf8');
});

console.log("Fixed missing t");
