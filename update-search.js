const fs = require('fs');
let c = fs.readFileSync('src/features/market-pages/Search.jsx', 'utf8');

if (!c.includes('useAuthStore')) {
  c = c.replace(/import BookingService from ".\/api\/services\/BookingService";/, 'import BookingService from "./api/services/BookingService";\nimport useAuthStore from "./stores/authStore";');
}

c = c.replace(/export default function Search\(\) {/, 'export default function Search() {\n  const { isAuthenticated, user } = useAuthStore();\n  const accountLink = user?.profile?.role === "business" ? "/admin" : "/account";\n');

const desktopSearchAuthBlock = `
            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-4 shrink-0">
              {isAuthenticated ? (
                <Link
                  href={accountLink}
                  className="px-5 py-2 h-10 text-sm font-medium text-white bg-[#121415] hover:bg-[#1E2123] rounded-full transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#121415] shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 flex items-center justify-center whitespace-nowrap"
                >
                  My Account
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-5 py-2 h-10 text-sm font-medium text-[#121415] border border-[#DCDCDA] bg-white hover:bg-[#F5F5F4] rounded-full transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#121415] shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 flex items-center justify-center whitespace-nowrap"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="px-5 py-2 h-10 text-sm font-medium text-[#F5F5F4] bg-[#8A2532] hover:bg-[#7A1F29] rounded-full transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#8A2532] focus-visible:ring-offset-2 focus-visible:ring-offset-[#ECECEA] shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 flex items-center justify-center whitespace-nowrap"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
`;

c = c.replace(/\{\/\* Desktop Auth \*\/\}[\s\S]*?<\/div>/, desktopSearchAuthBlock);

const mobileSearchAuthBlock = `
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
                      <Link
                        href="/signup"
                        className="text-lg font-medium text-[#121415] outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign up
                      </Link>
                    </>
                  )}
                </div>
`;

c = c.replace(/<div className="flex flex-col gap-4">\s*<Link\s*href="\/login"[\s\S]*?<\/Link>\s*<\/div>/, mobileSearchAuthBlock);

fs.writeFileSync('src/features/market-pages/Search.jsx', c);
