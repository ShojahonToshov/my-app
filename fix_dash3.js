const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard-pages/Dashboard.tsx', 'utf8');

const regex = /const guest: Guest = \{[\s\S]*?delay: existing\?\.delay \|\| null\s*\};/;
const replacementGuestMapping = `
    let guestNameRaw = b.guest_name || b.customerName || "Guest";
    let actualStaffId = "";
    if (typeof guestNameRaw === 'string' && guestNameRaw.includes("|||")) {
      const parts = guestNameRaw.split("|||");
      guestNameRaw = parts[0];
      actualStaffId = parts[1];
    }
    
    let actualStaffName = "Ali Ahmedov";
    if (actualStaffId) {
      const staff = teamData.find((t: any) => String(t.id) === String(actualStaffId));
      if (staff) actualStaffName = staff.name;
    } else if (b.staff_name || b.staffName) {
      actualStaffName = b.staff_name || b.staffName;
    }

    let actualServiceName = "Service";
    if (b.service_id) {
       const srv = servicesData.find((s: any) => String(s.id) === String(b.service_id));
       if (srv) actualServiceName = srv.name;
    } else if (b.service_name || b.serviceName) {
       actualServiceName = b.service_name || b.serviceName;
    }

    const guest: Guest = {
      id: b.id,
      name: guestNameRaw,
      service: actualServiceName,
      time: b.time || b.startTime || "12:00",
      oldTime: existing?.oldTime || null,
      staff: actualStaffName,
      delay: existing?.delay || null
    };`;

code = code.replace(regex, replacementGuestMapping);
fs.writeFileSync('src/components/dashboard-pages/Dashboard.tsx', code);
console.log('done');
