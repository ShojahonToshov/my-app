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

  // Mask "use client" so it's not replaced
  newContent = newContent.replace(/"use client"/g, 'USE_CLIENT_MARKER');
  newContent = newContent.replace(/'use client'/g, 'USE_CLIENT_MARKER_SQ');
  
  // also SearchClient component shouldn't be renamed to SearchCustomer
  newContent = newContent.replace(/SearchClient/g, 'SEARCH_CLIENT_MARKER');

  newContent = newContent.replace(/\bClient\b/g, 'Customer');
  newContent = newContent.replace(/\bclient\b/g, 'customer');
  newContent = newContent.replace(/\bClients\b/g, 'Customers');
  newContent = newContent.replace(/\bclients\b/g, 'customers');

  // Unmask
  newContent = newContent.replace(/USE_CLIENT_MARKER_SQ/g, "'use client'");
  newContent = newContent.replace(/USE_CLIENT_MARKER/g, '"use client"');
  newContent = newContent.replace(/SEARCH_CLIENT_MARKER/g, 'SearchClient');
  
  // Also wait, supabase createClient shouldn't be createCustomer
  newContent = newContent.replace(/createCustomer/g, 'createClient');
  newContent = newContent.replace(/supabase\/customer/g, 'supabase/client');

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log(`Updated client->customer in ${file}`);
  }
});
