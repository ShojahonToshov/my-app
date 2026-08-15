const fs = require('fs');
let c = fs.readFileSync('src/app/admin/layout.tsx', 'utf8');

if (!c.includes('RoleGuard')) {
  c = c.replace(/import AdminLayout from '@\/features\/business-pages\/AdminLayout';/, 'import AdminLayout from \'@/features/business-pages/AdminLayout\';\nimport RoleGuard from \'@/components/RoleGuard\';');
  
  c = c.replace(/return \(/, 'return (\n    <RoleGuard allowedRoles={[\'business\']}>');
  c = c.replace(/<\/AdminLayout>\n\s*\);/, '</AdminLayout>\n    </RoleGuard>\n  );');
  
  fs.writeFileSync('src/app/admin/layout.tsx', c);
}
