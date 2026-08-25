const fs = require('fs');
['src/components/Landing.tsx', 'src/app/search/components/SearchClient.tsx'].forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/className="md:hidden p-2 text-\[#121415\] (.+?) rounded-lg/g, 'className="md:hidden p-2 text-[#121415] $1 rounded-full');
  fs.writeFileSync(f, c);
});
console.log('Fixed hamburger buttons');
