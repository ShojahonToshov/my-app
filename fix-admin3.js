const fs = require('fs');
let admin = fs.readFileSync('src/features/business-pages/AdminLayout.jsx', 'utf8');
admin = admin.replace(/\.\.\/components/g, '@/components');
fs.writeFileSync('src/features/business-pages/AdminLayout.jsx', admin);
