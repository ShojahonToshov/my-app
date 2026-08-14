const fs = require('fs');
let c = fs.readFileSync('src/features/market-pages/Signup.jsx', 'utf8');
c = c.replace(/!isLoading/g, '!isSubmitting');
fs.writeFileSync('src/features/market-pages/Signup.jsx', c);
