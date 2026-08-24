const fs = require('fs');

let schedule = fs.readFileSync('src/components/dashboard-pages/Schedule.tsx', 'utf8');
schedule = schedule.replace('${newCustomerName} added to the schedule', '${newCustomerName} added to schedule');
schedule = schedule.replace('"Appointment canceled successfully"', '"Appointment canceled"');
fs.writeFileSync('src/components/dashboard-pages/Schedule.tsx', schedule, 'utf8');

