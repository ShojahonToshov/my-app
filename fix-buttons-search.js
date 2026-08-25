const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/app/search/components/SearchClient.tsx');
let content = fs.readFileSync(file, 'utf8');

// Replace all shape="rounded" with shape="pill"
content = content.replace(/shape="rounded"/g, 'shape="pill"');

// Replace standard <Button> classNames without explicit shapes if they exist.
content = content.replace(
  /<Button variant="outline" className="flex-1"/g,
  '<Button variant="outline" shape="pill" className="flex-1"'
);

content = content.replace(
  /<Button variant="primary" className="w-full"/g,
  '<Button variant="primary" shape="pill" className="w-full"'
);

// Replace "Log in" link rounded-xl with rounded-full
content = content.replace(
  /bg-white hover:bg-\[#F5F5F4\] rounded-xl transition-all/g,
  'bg-white hover:bg-[#F5F5F4] rounded-full transition-all'
);

// Replace map controls rounded-xl with rounded-full
content = content.replace(
  /w-10 h-10 bg-white\/90 backdrop-blur-md rounded-xl/g,
  'w-10 h-10 bg-white/90 backdrop-blur-md rounded-full'
);

fs.writeFileSync(file, content);
console.log('Done replacing SearchClient.tsx');
