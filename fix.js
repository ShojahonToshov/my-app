const fs=require('fs');
let content = fs.readFileSync('src/components/Landing.tsx', 'utf8');
const lines = content.split('\n');
const before = lines.slice(0, 114).join('\n');
const after = lines.slice(115).join('\n');
const toInsert = `  return (
    <div className="min-h-screen flex flex-col bg-[#ECECEA] font-sans selection:bg-[#8A2532] selection:text-white overflow-x-hidden text-[#121415]">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#ECECEA]/80 backdrop-blur-xl border-b border-[#DCDCDA] px-6">
        <div className="max-w-7xl mx-auto h-20 flex items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-3">
            <ElaraLogo />
          </div>

          <div className="hidden md:flex items-center gap-8 font-medium text-sm text-[#4A4E51]">
            <Link
              href="/pricing"
              className="hover:text-[#121415] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded"
            >
              Pricing
            </Link>
            <Link
              href="#features"
              onClick={(e) => scrollToSection(e, "features")}
              className="hover:text-[#121415] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              onClick={(e) => scrollToSection(e, "how-it-works")}
              className="hover:text-[#121415] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded"
            >
              How it works
            </Link>
            <Link
              href="#faq"
              onClick={(e) => scrollToSection(e, "faq")}
              className="hover:text-[#121415] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded"`;
fs.writeFileSync('src/components/Landing.tsx', before + '\n' + toInsert + '\n' + after);
