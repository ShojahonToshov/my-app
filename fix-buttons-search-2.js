const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/app/search/components/SearchClient.tsx');
let content = fs.readFileSync(file, 'utf8');

// Fix multi-line button (Cancel)
content = content.replace(
  /variant="outline"\s+className="flex-1"/g,
  'variant="outline"\n                  shape="pill"\n                  className="flex-1"'
);

// Search query button in mobile menu
content = content.replace(
  /<Button\n\s+variant="primary"\n\s+className="w-full mt-1 active:scale-95"/g,
  '<Button\n                      variant="primary"\n                      shape="pill"\n                      className="w-full mt-1 active:scale-95"'
);


fs.writeFileSync(file, content);
console.log('Done fixing missed buttons in SearchClient.tsx');
