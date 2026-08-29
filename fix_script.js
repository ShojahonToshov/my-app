const fs = require('fs');
let code = fs.readFileSync('auto_i18n_fix.mjs', 'utf8');
code = code.replace("if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) continue;", "if (!filePath.endsWith('.tsx')) continue;");
fs.writeFileSync('auto_i18n_fix.mjs', code);
