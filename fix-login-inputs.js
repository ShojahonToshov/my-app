const fs = require('fs');
let c = fs.readFileSync('src/features/market-pages/Login.jsx', 'utf8');

c = c.replace(/placeholder=".*?"\s*disabled=\{isSubmitting\}/g, 'placeholder="••••••••"\n            disabled={isSubmitting}\n            value={password}\n            onChange={(e) => setPassword(e.target.value)}\n            error={errors?.password}');

c = c.replace(/placeholder="name@example.com"\n\s*disabled=\{isSubmitting\}/g, 'placeholder="name@example.com"\n            disabled={isSubmitting}\n            value={login}\n            onChange={(e) => setLogin(e.target.value)}\n            error={errors?.login}');

fs.writeFileSync('src/features/market-pages/Login.jsx', c);
