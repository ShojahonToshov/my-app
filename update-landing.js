const fs = require('fs');
let c = fs.readFileSync('src/features/market-pages/Landing.jsx', 'utf8');

if (!c.includes('useAuthStore')) {
  c = c.replace(/import \{ Button \} from "@\/components\/ui\/Button";/, 'import { Button } from "@/components/ui/Button";\nimport useAuthStore from "./stores/authStore";');
}

// Add isAuthenticated destructuring
c = c.replace(/export default function Landing\(\) {/, 'export default function Landing() {\n  const { isAuthenticated, user } = useAuthStore();\n  const accountLink = user?.profile?.role === "business" ? "/admin" : "/account";\n');

// Replace Desktop Log in & Sign up
const desktopAuthBlock = `
            <div className="hidden md:flex items-center gap-4 shrink-0">
              {isAuthenticated ? (
                <Link
                  href={accountLink}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-[#121415] hover:bg-[#1E2123] rounded-full transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#121415] shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 flex items-center justify-center"
                >
                  My Account
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-5 py-2.5 text-sm font-medium text-[#121415] border border-[#DCDCDA] bg-white hover:bg-[#F5F5F4] rounded-full transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#121415] shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 flex items-center justify-center"
                  >
                    Log in
                  </Link>
                  <Button 
                    onClick={() => setSignupModalOpen(true)}
                    variant="secondary" 
                    size="sm" 
                    className="px-5 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                  >
                    Sign up
                  </Button>
                </>
              )}
            </div>
`;

// Replace the original desktop block with regex
c = c.replace(/<div className="hidden md:flex items-center gap-4 shrink-0">[\s\S]*?<\/Button>\s*<\/div>/, desktopAuthBlock);

// Replace Mobile Menu Auth Block
const mobileAuthBlock = `
                <div className="flex flex-col gap-4">
                  {isAuthenticated ? (
                    <Link
                      href={accountLink}
                      className="text-lg font-medium text-[#121415] outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Account
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="text-lg font-medium text-[#121415] outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Log in
                      </Link>
                      <button
                        onClick={() => {
                          setSignupModalOpen(true);
                          setMobileMenuOpen(false);
                        }}
                        className="text-lg font-medium text-left text-[#121415] outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded"
                      >
                        Sign up
                      </button>
                    </>
                  )}
                </div>
`;

c = c.replace(/<div className="flex flex-col gap-4">\s*<Link\s*href="\/login"[\s\S]*?<\/button>\s*<\/div>/, mobileAuthBlock);

fs.writeFileSync('src/features/market-pages/Landing.jsx', c);
