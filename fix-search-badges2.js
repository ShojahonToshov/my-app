const fs = require('fs');
let c = fs.readFileSync('src/features/market-pages/Search.jsx', 'utf8');

c = c.replace(/priceRange: "\$",/, 'priceRange: "$",\n        badges: [],\n        isNew: true,');

fs.writeFileSync('src/features/market-pages/Search.jsx', c);
