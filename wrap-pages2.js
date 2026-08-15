const fs = require('fs');

function forceWrap(filepath, roles, requireAuth) {
  let c = fs.readFileSync(filepath, 'utf8');
  if (c.includes('<RoleGuard')) return; // already wrapped
  
  // if it's a simple return <Component />;
  if (c.match(/return\s+<([A-Za-z0-9_]+)\s*\/>;/)) {
    c = c.replace(/return\s+<([A-Za-z0-9_]+)\s*\/>;/, `return (\n    <RoleGuard allowedRoles={[${roles.map(r=>`'${r}'`).join(', ')}]} requireAuth={${requireAuth}}>\n      <$1 />\n    </RoleGuard>\n  );`);
    fs.writeFileSync(filepath, c);
  } else if (c.includes('return (')) {
    // If it has return (
    // Just find the return ( and the final ); }
    c = c.replace(/return \(/, `return (\n    <RoleGuard allowedRoles={[${roles.map(r=>`'${r}'`).join(', ')}]} requireAuth={${requireAuth}}>`);
    c = c.replace(/\);\s*}$/, '\n    </RoleGuard>\n  );\n}');
    fs.writeFileSync(filepath, c);
  }
}

forceWrap('src/app/search/page.tsx', ['customer', 'guest'], false);
forceWrap('src/app/account/page.tsx', ['customer'], true);
forceWrap('src/app/booking/page.tsx', ['customer'], true);
forceWrap('src/app/page.tsx', ['customer', 'guest'], false);
