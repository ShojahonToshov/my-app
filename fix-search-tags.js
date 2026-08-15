const fs = require('fs');
let c = fs.readFileSync('src/features/market-pages/Search.jsx', 'utf8');

c = c.replace(/tags: \[b\.category\],/, 'tags: [b.category || "General"],');

fs.writeFileSync('src/features/market-pages/Search.jsx', c);
