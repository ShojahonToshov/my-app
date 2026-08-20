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

  newContent = newContent.replace(/MasterSchema/g, 'StaffSchema');
  newContent = newContent.replace(/masterId/g, 'staffId');
  newContent = newContent.replace(/MasterId/g, 'StaffId');
  newContent = newContent.replace(/masterName/g, 'staffName');
  newContent = newContent.replace(/MasterName/g, 'StaffName');
  newContent = newContent.replace(/newMaster/g, 'newStaff');
  newContent = newContent.replace(/activeMaster/g, 'activeStaff');
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log(`Updated Staff variables in ${file}`);
  }
});
