const fs = require('fs');
const lines = fs.readFileSync('src/services/AuthService.ts', 'utf8').split('\n');
lines[38] = '    const isPhone = identifier.startsWith(\\'+\\') || /^\\\\d+$/.test(identifier.replace(/\\\\D/g, \\'\\'));';
fs.writeFileSync('src/services/AuthService.ts', lines.join('\n'));
