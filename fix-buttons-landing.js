const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/components/Landing.tsx');
let content = fs.readFileSync(file, 'utf8');

// Navbar Links
content = content.replace(
  /hover:bg-\[#1E2123\] rounded-xl transition-all/g,
  'hover:bg-[#1E2123] rounded-full transition-all'
);
content = content.replace(
  /bg-white hover:bg-\[#F5F5F4\] rounded-xl transition-all/g,
  'bg-white hover:bg-[#F5F5F4] rounded-full transition-all'
);

// Modify Time / Cancel badges (lines 763, 766)
content = content.replace(
  /px-6 py-3 rounded-xl bg-white\/10/g,
  'px-6 py-3 rounded-full bg-white/10'
);
content = content.replace(
  /px-6 py-3 rounded-xl bg-white\/5/g,
  'px-6 py-3 rounded-full bg-white/5'
);

// Button tags
content = content.replace(
  /<Button\s+onClick=\{\(\) => setSignupModalOpen\(true\)\}\s+variant="secondary"\s+size="sm"/g,
  '<Button \n                    onClick={() => setSignupModalOpen(true)}\n                    variant="secondary" \n                    size="sm" \n                    shape="pill"'
);

content = content.replace(
  /variant="primary"\s+shape="rounded"/g,
  'variant="primary"\n                  shape="pill"'
);

content = content.replace(
  /variant="outline"\s+shape="rounded"/g,
  'variant="outline"\n                  shape="pill"'
);

content = content.replace(
  /<Button variant="outline" className="w-full">/g,
  '<Button variant="outline" shape="pill" className="w-full">'
);

content = content.replace(
  /<Button variant="secondary" shape="square" className="w-full text-xs">/g,
  '<Button variant="secondary" shape="pill" className="w-full text-xs">'
);

fs.writeFileSync(file, content);
console.log('Done replacing Landing.tsx');
