const fs = require('fs');
let code = fs.readFileSync('src/app/account/components/AccountClient.tsx', 'utf8');
code = code.replace(/const KarmaBadge = \(\{ karma \}: \{ karma: number \}\) => \{/g, 'const KarmaBadge = ({ karma }: { karma: number }) => { const { t } = useI18n();');
fs.writeFileSync('src/app/account/components/AccountClient.tsx', code);
