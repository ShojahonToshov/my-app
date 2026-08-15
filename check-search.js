const fs = require('fs');
let c = fs.readFileSync('src/features/market-pages/Search.jsx', 'utf8');
console.log(c.substring(0, 100));
