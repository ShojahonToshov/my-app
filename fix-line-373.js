const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/app/search/components/SearchClient.tsx');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /<Button\r?\n\s+variant="primary"\r?\n\s+className="w-full mt-1 active:scale-95"/g,
  '<Button\n                    variant="primary"\n                    shape="pill"\n                    className="w-full mt-1 active:scale-95"'
);

fs.writeFileSync(file, content);
console.log('Done fixing line 373');
