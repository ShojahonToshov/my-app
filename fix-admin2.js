const fs = require('fs');

let admin = fs.readFileSync('src/features/business-pages/AdminLayout.jsx', 'utf8');
admin = '"use client";\n' + admin;
admin = admin.replace(/import \{ NavLink, Outlet \} from "react-router";/, 'import Link from "next/link";');
admin = admin.replace(/<Outlet \/>/, '{children}');
admin = admin.replace(/export default function AdminLayout\(\) \{/, 'export default function AdminLayout({ children }) {');
// Now replace all NavLink with Link
admin = admin.replace(/<NavLink/g, '<Link');
admin = admin.replace(/<\/NavLink>/g, '</Link>');
admin = admin.replace(/to="/g, 'href="');
// Now replace all className={({ isActive }) => `...`} with a static string
admin = admin.replace(/className=\{\(\{ isActive \}\) => `([^`]+)`\}/g, (match, classes) => {
    let staticClasses = classes.replace(/\$\{isActive \? '[^']+' : '([^']+)'\}/g, '$1');
    return `className="${staticClasses}"`;
});
// Also fix end prop on Link which is invalid in Next.js
admin = admin.replace(/href="\/admin"\s+end/g, 'href="/admin"');

fs.writeFileSync('src/features/business-pages/AdminLayout.jsx', admin);
