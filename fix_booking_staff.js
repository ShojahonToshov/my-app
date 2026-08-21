const fs = require('fs');
let code = fs.readFileSync('src/components/CustomerBooking.tsx', 'utf8');

const regex = /guest_name: currentUser \? \(currentUser\.user_metadata\?\.full_name \|\| currentUser\.email \|\| customerName \|\| ""\) : customerName,/;
const replacement = `guest_name: (currentUser ? (currentUser.user_metadata?.full_name || currentUser.email || customerName || "") : customerName) + "|||" + (selectedMaster || ""),`;

if (regex.test(code)) {
  code = code.replace(regex, replacement);
  fs.writeFileSync('src/components/CustomerBooking.tsx', code);
  console.log('Modified CustomerBooking.tsx');
} else {
  console.log('Regex did not match');
}
