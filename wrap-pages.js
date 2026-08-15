const fs = require('fs');

function wrapPage(filepath, roles, requireAuth) {
  let c = fs.readFileSync(filepath, 'utf8');
  if (!c.includes('RoleGuard')) {
    c = c.replace(/import { Suspense } from 'react';/, 'import { Suspense } from \'react\';\nimport RoleGuard from \'@/components/RoleGuard\';');
    // If Suspense is not there (like in page.tsx)
    if (!c.includes('import RoleGuard')) {
      c = 'import RoleGuard from \'@/components/RoleGuard\';\n' + c;
    }
    
    // Find the return statement
    c = c.replace(/return \(/, `return (\n    <RoleGuard allowedRoles={[${roles.map(r=>`'${r}'`).join(', ')}]} requireAuth={${requireAuth}}>`);
    
    // Find the last closing tag before the end of function
    const lastClosingMatch = c.match(/<\/[A-Za-z0-9_]+>\s*\);\s*}\s*$/);
    if (lastClosingMatch) {
      c = c.replace(/<\/[A-Za-z0-9_]+>\s*\);\s*}\s*$/, `$&`);
      c = c.replace(/\);\s*}\s*$/, '\n    </RoleGuard>\n  );\n}');
    } else {
      // simpler fallback
      c = c.replace(/;\n}$/, '\n    </RoleGuard>\n  );\n}');
    }
    fs.writeFileSync(filepath, c);
  }
}

// search page
wrapPage('src/app/search/page.tsx', ['customer', 'guest'], false);

// account page
wrapPage('src/app/account/page.tsx', ['customer'], true);

// booking page
wrapPage('src/app/booking/page.tsx', ['customer'], true);

// landing page (app/page.tsx)
wrapPage('src/app/page.tsx', ['customer', 'guest'], false);

