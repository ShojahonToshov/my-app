const fs = require('fs');

// Fix ElaraLogo
let logo = fs.readFileSync('src/components/ElaraLogo.jsx', 'utf8');
logo = logo.replace('import { Link } from "react-router";', 'import Link from "next/link";');
logo = logo.replace('to: "/",', 'href: "/",');
fs.writeFileSync('src/components/ElaraLogo.jsx', logo);

// Fix AdminLayout
let admin = fs.readFileSync('src/features/business-pages/AdminLayout.jsx', 'utf8');
// Fix the broken Link
admin = admin.replace(/<NavLink/g, '<Link');
admin = admin.replace(/<\/NavLink>/g, '</Link>');
admin = admin.replace(/to="/g, 'href="');
// Now replace all className={({ isActive }) => `...`} with a static string for now, we can add logic later if needed
admin = admin.replace(/className=\{\(\{ isActive \}\) => `([^`]+)`\}/g, (match, classes) => {
    // we just use the false path or true path? just extract the false path
    let staticClasses = classes.replace(/\$\{isActive \? '[^']+' : '([^']+)'\}/g, '$1');
    return `className="${staticClasses}"`;
});
fs.writeFileSync('src/features/business-pages/AdminLayout.jsx', admin);
