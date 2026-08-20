const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const filesToRename = [
  { old: path.join(srcDir, 'hooks', 'useClients.ts'), new: path.join(srcDir, 'hooks', 'useCustomers.ts') },
  { old: path.join(srcDir, 'components', 'ClientBooking.tsx'), new: path.join(srcDir, 'components', 'CustomerBooking.tsx') },
  { old: path.join(srcDir, 'constants', 'clients.ts'), new: path.join(srcDir, 'constants', 'customers.ts') }
];

filesToRename.forEach(({old: o, new: n}) => {
  if (fs.existsSync(o)) {
    fs.renameSync(o, n);
    console.log(`Renamed ${o} to ${n}`);
  }
});
