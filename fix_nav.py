import sys

file_path = r'C:\Users\user\Desktop\Elara\my-app\src\app\(website)\designsearch\components\DesignSearchClient.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target = '''              <>
                <Link
                  href="/designlogin"
                  className="px-5 py-2.5 text-[14px] font-bold text-[#0B0C0D] border border-[#8D9195]/20 bg-white hover:bg-[#F3F4F4] rounded-full transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#0B0C0D] shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center"
                >{t("app.t4")}</Link>
                <Link href="/designsignup" className="outline-none focus-visible:ring-2 focus-visible:ring-[#0B0C0D] rounded-full flex items-center justify-center">
                  <button className="px-6 py-2.5 bg-[#151719] text-white text-[14px] font-bold rounded-full shrink-0 shadow-sm active:scale-95 transition-all">{t("app.t5")}</button>
                </Link>
              </>'''

replacement = '''              <div className="flex items-center gap-3">
                <Link href="/designlogin" passHref legacyBehavior>
                  <motion.a 
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.92 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="px-6 py-3 text-[14px] font-bold tracking-wide text-[#0B0C0D] bg-white border border-[#8D9195]/20 text-center rounded-full shadow-sm cursor-pointer"
                  >{t("app.t4")}</motion.a>
                </Link>
                <Link href="/designsignup" passHref legacyBehavior>
                  <motion.a 
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.92 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="px-8 py-3 bg-[#151719] text-white text-[14px] font-bold tracking-wide rounded-full shadow-lg shadow-[#151719]/10 block cursor-pointer"
                  >{t("app.t5")}</motion.a>
                </Link>
              </div>'''

if target in content:
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content.replace(target, replacement))
    print('Replaced')
else:
    print('Target not found')
