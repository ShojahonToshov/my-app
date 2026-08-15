const fs = require('fs');
let c = fs.readFileSync('src/features/market-pages/Search.jsx', 'utf8');

c = c.replace(/category: b\.category,/g, 'category: b.category || "General",');

fs.writeFileSync('src/features/market-pages/Search.jsx', c);
