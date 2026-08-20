const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

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

  // Master -> Staff
  newContent = newContent.replace(/\bMaster\b/g, 'Staff');
  newContent = newContent.replace(/\bmaster\b/g, 'staff');
  newContent = newContent.replace(/\bMasters\b/g, 'Staffs'); // though Plural of Staff is Staff, maybe we just leave it or use StaffMembers. Let's do Staffs for now to keep it simple, or TeamMembers
  newContent = newContent.replace(/\bmasters\b/g, 'staff'); 
  newContent = newContent.replace(/\bmasterId\b/g, 'staffId');
  newContent = newContent.replace(/\bMasterId\b/g, 'StaffId');
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log(`Updated Staff in ${file}`);
  }
});
