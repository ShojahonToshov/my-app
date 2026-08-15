const fs = require('fs');
let c = fs.readFileSync('src/features/market-pages/ClientAccount.jsx', 'utf8');

c = c.replace(/const handleTabChange = \(tabId\) => \{[\s\S]*?setSearchParams\([\s\S]*?\};/m, `const handleTabChange = (tabId) => {
    const next = new URLSearchParams(searchParams);
    if (tabId === DEFAULT_TAB) {
      next.delete("tab");
    } else {
      next.set("tab", tabId);
    }
    router.replace(\`\${pathname}?\${next.toString()}\`, { scroll: false });
  };`);

fs.writeFileSync('src/features/market-pages/ClientAccount.jsx', c);
