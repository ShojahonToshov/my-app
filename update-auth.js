const fs = require('fs');
let c = fs.readFileSync('src/features/market-pages/hooks/useAuth.ts', 'utf8');

c = c.replace(/router\.push\(redirectPath\);/g, `const route = (user as any)?.profile?.role === 'business' ? '/admin' : redirectPath;\n      router.push(route);`);

fs.writeFileSync('src/features/market-pages/hooks/useAuth.ts', c);
