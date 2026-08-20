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

  // Replacements
  newContent = newContent.replace(/useClients/g, 'useCustomers');
  newContent = newContent.replace(/ClientBooking/g, 'CustomerBooking');
  newContent = newContent.replace(/constants\/clients/g, 'constants/customers');
  newContent = newContent.replace(/INITIAL_CLIENTS/g, 'INITIAL_CUSTOMERS');
  newContent = newContent.replace(/clientName/g, 'customerName');
  newContent = newContent.replace(/clientPhone/g, 'customerPhone');
  newContent = newContent.replace(/ClientData/g, 'CustomerData');
  newContent = newContent.replace(/interface Client \{/g, 'interface Customer {');
  newContent = newContent.replace(/\<Client\>/g, '<Customer>');
  newContent = newContent.replace(/Client\[\]/g, 'Customer[]');
  newContent = newContent.replace(/as Client;/g, 'as Customer;');
  newContent = newContent.replace(/as unknown as Client/g, 'as unknown as Customer');
  newContent = newContent.replace(/handleAddClient/g, 'handleAddCustomer');
  newContent = newContent.replace(/newClient/g, 'newCustomer');
  newContent = newContent.replace(/Client added/g, 'Customer added');
  newContent = newContent.replace(/import \{ Client \}/g, 'import { Customer }');
  newContent = newContent.replace(/import \{ Client,/g, 'import { Customer,');
  newContent = newContent.replace(/, Client \}/g, ', Customer }');
  newContent = newContent.replace(/, Client,/g, ', Customer,');
  newContent = newContent.replace(/type: "Client"/g, 'type: "Customer"'); // if any
  
  // also fix services/client/CustomerService.ts?
  newContent = newContent.replace(/services\/client\//g, 'services/customer/');

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log(`Updated Client vars in ${file}`);
  }
});
