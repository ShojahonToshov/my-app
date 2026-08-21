const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard-pages/Dashboard.tsx', 'utf8');

const regexBData = /const bData = \{[\s\S]*?business_id: businessId\s*\};/;
const replacementBData = `
    let foundStaffId = "";
    const foundStaff = teamData.find((t: any) => t.name === staffName);
    if (foundStaff) foundStaffId = foundStaff.id;

    const bData = {
      guest_name: customerName + "|||" + foundStaffId,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      is_guest: true,
      service_id: service,
      business_id: businessId
    };`;

code = code.replace(regexBData, replacementBData);
fs.writeFileSync('src/components/dashboard-pages/Dashboard.tsx', code);
console.log('done');
