const fs = require('fs');
let c = fs.readFileSync('src/features/market-pages/Login.jsx', 'utf8');

c = c.replace(/isLoading \? "text/g, 'isSubmitting ? "text');
fs.writeFileSync('src/features/market-pages/Login.jsx', c);
