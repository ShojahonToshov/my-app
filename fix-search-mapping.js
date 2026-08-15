const fs = require('fs');
let c = fs.readFileSync('src/features/market-pages/Search.jsx', 'utf8');

c = c.replace(/imageUrl: b\.image_url,/g, 'image: b.image_url,\n        price: "$10 - $50",\n        time: "10:00 - 20:00",');

fs.writeFileSync('src/features/market-pages/Search.jsx', c);
