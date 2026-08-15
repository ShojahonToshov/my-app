const fs = require('fs');

function addMountedCheck(filepath) {
  let c = fs.readFileSync(filepath, 'utf8');

  // Add useState, useEffect if missing
  if (!c.includes('const [mounted, setMounted] = useState(false);')) {
    c = c.replace(/export default function .*?\(\) {/, `$&
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
`);
  }

  // Change {isAuthenticated ? to {mounted && isAuthenticated ?
  c = c.replace(/\{isAuthenticated \?/g, '{mounted && isAuthenticated ?');

  fs.writeFileSync(filepath, c);
}

addMountedCheck('src/features/market-pages/Landing.jsx');
addMountedCheck('src/features/market-pages/Search.jsx');
