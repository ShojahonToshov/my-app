const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard-pages/Dashboard.tsx', 'utf8');

// Replace the guest mapping logic
const regexGuestMapping = /const guest: Guest = \{\s*id: b\.id,\s*name: b\.guest_name \|\| b\.customerName \|\| "Guest",\s*service: b\.service_name \|\| b\.serviceName \|\| b\.service_id \|\| "Service",\s*time: b\.time \|\| b\.startTime \|\| "12:00",\s*oldTime: existing\?\.oldTime \|\| null,\s*staff: \(b\.staff_name \|\| b\.staffName\) \|\| "Ali Ahmedov",\s*delay: existing\?\.delay \|\| null\s*\};/;

const replacementGuestMapping = `
    let guestNameRaw = b.guest_name || b.customerName || "Guest";
    let actualStaffId = "";
    if (guestNameRaw.includes("|||")) {
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
    };
`;

if (regexGuestMapping.test(code)) {
  code = code.replace(regexGuestMapping, replacementGuestMapping);
  console.log("Replaced guest mapping");
} else {
  console.log("Could not find guest mapping regex");
}

// Replace the mastersSet logic
const regexMastersSet = /venueBookings\.forEach\(\(b: any\) => \{\s*if \(\(b\.staff_name \|\| b\.staffName\)\) mastersSet\.add\(\(b\.staff_name \|\| b\.staffName\)\);\s*\}\);/;

const replacementMastersSet = `
  venueBookings.forEach((b: any) => {
    let sName = b.staff_name || b.staffName;
    if (b.guest_name && typeof b.guest_name === 'string' && b.guest_name.includes("|||")) {
       const staffId = b.guest_name.split("|||")[1];
       const staff = teamData.find((t: any) => String(t.id) === String(staffId));
       if (staff) sName = staff.name;
    }
    if (sName) mastersSet.add(sName);
  });
`;

if (regexMastersSet.test(code)) {
  code = code.replace(regexMastersSet, replacementMastersSet);
  console.log("Replaced mastersSet logic");
} else {
  console.log("Could not find mastersSet regex");
}

fs.writeFileSync('src/components/dashboard-pages/Dashboard.tsx', code);
