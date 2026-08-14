const fs = require('fs');
let c = fs.readFileSync('src/features/market-pages/Landing.jsx', 'utf8');

c = c.replace(
`<button
              onClick={() => setSignupModalOpen(true)}
              className="outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded-full flex items-center justify-center"
            >
              <Button variant="secondary" size="sm" className="px-6 py-2.5 rounded-full active:scale-95 pointer-events-none">
                Sign up
              </Button>
            </button>`,
`<Button
              onClick={() => setSignupModalOpen(true)}
              variant="secondary"
              size="sm"
              className="px-6 py-2.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-95"
            >
              Sign up
            </Button>`
);

fs.writeFileSync('src/features/market-pages/Landing.jsx', c);
