const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard-pages/Dashboard.tsx', 'utf8');

const regex = /let foundStaffId = "";\s*const foundStaff = teamData\.find\(\(t: any\) => t\.name === staffName\);\s*if \(foundStaff\) foundStaffId = foundStaff\.id;\s*let foundStaffId = "";/s;
code = code.replace(regex, 'let foundStaffId = "";');

fs.writeFileSync('src/components/dashboard-pages/Dashboard.tsx', code);
console.log('done');
