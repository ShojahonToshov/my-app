const fs = require('fs');
let c = fs.readFileSync('src/features/market-pages/ClientAccount.jsx', 'utf8');

if (!c.includes('useRouter')) {
  c = c.replace(/import { useSearchParams } from "next\/navigation";/, 'import { useSearchParams, useRouter, usePathname } from "next/navigation";');
}

c = c.replace(/const \[searchParams, setSearchParams\] = useSearchParams\(\);/, `const searchParams = useSearchParams();\n  const router = useRouter();\n  const pathname = usePathname();`);

const oldHandleTabChange = `const handleTabChange = (tabId) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (tabId === DEFAULT_TAB) {
          next.delete("tab");
        } else {
          next.set("tab", tabId);
        }
        return next;
      },
      { replace: true }
    );
  };`;

const newHandleTabChange = `const handleTabChange = (tabId) => {
    const next = new URLSearchParams(searchParams);
    if (tabId === DEFAULT_TAB) {
      next.delete("tab");
    } else {
      next.set("tab", tabId);
    }
    router.replace(\`\${pathname}?\${next.toString()}\`, { scroll: false });
  };`;

c = c.replace(oldHandleTabChange, newHandleTabChange);

fs.writeFileSync('src/features/market-pages/ClientAccount.jsx', c);
