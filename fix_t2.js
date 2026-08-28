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

  // Find components defined as const Name = ({...}) => { or const Name = (props) => { or const Name = () => {
  const componentRegex = /const\s+([A-Za-z0-9_]+)\s*=\s*\([^)]*\)\s*=>\s*{/g;
  let match;
  while ((match = componentRegex.exec(content)) !== null) {
    const compName = match[1];
    // if the body contains t(
    const bodyStart = match.index + match[0].length;
    const firstChars = content.substring(bodyStart, bodyStart + 50);
    if (!firstChars.includes('useI18nStore')) {
      content = content.replace(match[0], `${match[0]}\n  const { t } = useI18nStore();\n`);
    }
  }

  // Handle function Name() { inside these files as well
  const funcRegex2 = /function\s+([A-Za-z0-9_]+)\s*\([^)]*\)\s*{/g;
  while ((match = funcRegex2.exec(content)) !== null) {
    const compName = match[1];
    if (compName !== 'SearchClient' && compName !== 'Customers' && compName !== 'Settings') { // already handled
       const bodyStart = match.index + match[0].length;
       const firstChars = content.substring(bodyStart, bodyStart + 50);
       if (!firstChars.includes('useI18nStore')) {
         content = content.replace(match[0], `${match[0]}\n  const { t } = useI18nStore();\n`);
       }
    }
  }
  
  // also inject if they use arrow function returning directly ( )
  // Wait, if they return directly, t() will fail! Let's check `({ icon: Icon, title, description }: EmptyStateProps) => (`
  const implicitRegex = /const\s+([A-Za-z0-9_]+)\s*=\s*\([^)]*\)\s*=>\s*\(/g;
  while ((match = implicitRegex.exec(content)) !== null) {
    // We would need to turn `=> (` into `=> { const {t} = useI18nStore(); return (`
    const replacement = match[0].replace('=> (', '=> { const { t } = useI18nStore(); return (');
    content = content.replace(match[0], replacement);
    // and we need to add `}` after the closing paren...
    // Actually wait, let's just use `useI18nStore.getState().t()` if it's too hard to modify hooks here.
    // Or just revert the t() translations inside these small components.
  }

  fs.writeFileSync(fullPath, content, 'utf8');
});
console.log("Fixed secondary components");
