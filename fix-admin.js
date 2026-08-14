const fs = require('fs');
let c = fs.readFileSync('src/features/business-pages/AdminLayout.jsx', 'utf8');

c = '"use client";\n' + c;
c = c.replace(/import \{ NavLink, Outlet \} from "react-router";/, 'import Link from "next/link";\nimport { usePathname } from "next/navigation";');
c = c.replace(/export default function AdminLayout\(\) \{/, 'export default function AdminLayout({ children }) {\n  const pathname = usePathname();');
c = c.replace(/<Outlet \/>/, '{children}');
c = c.replace(/<NavLink\s+to="([^"]+)"(?:\s+end)?\s+className=\{[^}]+=>\s*`([^`]+)`\s*\}/g, (match, path, classTpl) => {
    let newClass = classTpl.replace(/\$\{isActive\s*\?\s*'([^']+)'\s*:\s*'([^']+)'\}/, `\${pathname === '${path}' ? '$1' : '$2'}`);
    return `<Link href="${path}" className={\`${newClass}\`}`;
});
c = c.replace(/<\/NavLink>/g, '</Link>');
c = c.replace(/\.\.\/components/g, '@/components');

fs.writeFileSync('src/features/business-pages/AdminLayout.jsx', c);
