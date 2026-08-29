const fs = require('fs');
let content = fs.readFileSync('src/app/layout.tsx', 'utf8');
content = content.split('t("extra.t337")').join('"Elara"');
fs.writeFileSync('src/app/layout.tsx', content);
