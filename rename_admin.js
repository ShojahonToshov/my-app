const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

// 1. Rename files/folders
const renames = [
  { old: path.join(srcDir, 'app', 'admin'), new: path.join(srcDir, 'app', 'dashboard') },
  { old: path.join(srcDir, 'components', 'AdminLayout.tsx'), new: path.join(srcDir, 'components', 'DashboardLayout.tsx') },
  { old: path.join(srcDir, 'components', 'admin-pages'), new: path.join(srcDir, 'components', 'dashboard-pages') },
  { old: path.join(srcDir, 'components', 'dashboard-pages', 'AdminSettings.tsx'), new: path.join(srcDir, 'components', 'dashboard-pages', 'DashboardSettings.tsx') }, // note: it will be in dashboard-pages after previous step
];

renames.forEach(({ old: oldPath, new: newPath }) => {
  if (fs.existsSync(oldPath)) {
    // If it's a file inside a renamed folder, we need to handle it. 
    // Actually, to make it easier, let's just do them sequentially.
    // Ensure parent dir exists
    fs.renameSync(oldPath, newPath);
    console.log(`Renamed ${oldPath} to ${newPath}`);
  }
});

// 2. Replace content in all ts/tsx files
function walk(dir, callback) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      walk(p, callback);
    } else if (p.endsWith('.ts') || p.endsWith('.tsx')) {
      callback(p);
    }
  }
}

walk(srcDir, (file) => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  // Replace imports & paths
  newContent = newContent.replace(/\/admin/g, '/dashboard');
  newContent = newContent.replace(/admin-pages/g, 'dashboard-pages');
  newContent = newContent.replace(/AdminLayout/g, 'DashboardLayout');
  newContent = newContent.replace(/AdminSettings/g, 'DashboardSettings');
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log(`Updated content in ${file}`);
  }
});
