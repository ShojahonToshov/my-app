const fs = require('fs');
let code = fs.readFileSync('src/app/account/page.tsx', 'utf8');
code = code.replace(/const EmptyState = \(\{ icon: Icon, title, message, action \}: \{ icon: any, title: string, message: string, action\?: React.ReactNode \}\) => \(/g, 'const EmptyState = ({ icon: Icon, title, message, action }: { icon: any, title: string, message: string, action?: React.ReactNode }) => { const { t } = useI18n(); return (');
code = code.replace(/<\/div>\r?\n\);/g, '</div>\n);}');
fs.writeFileSync('src/app/account/page.tsx', code);
