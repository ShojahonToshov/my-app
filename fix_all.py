import re

file_path = r'C:\Users\user\Desktop\Elara\my-app\src\app\(website)\designsearch\components\DesignSearchClient.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix Star
content = re.sub(
    r'className="w-4 h-4 fill-\[#0B0C0D\] text-\[#0B0C0D\] shrink-0"',
    r'className="w-4 h-4 fill-[#F5A623] text-[#F5A623] shrink-0"',
    content
)

# 2. Fix Closed badge
content = re.sub(
    r'<span className="bg-\[#0B0C0D\] text-white backdrop-blur-md px-3 py-1\.5 rounded-full text-\[12px\] font-bold shadow-sm flex items-center gap-1\.5 cursor-pointer">(\s*)<Lock className="w-3\.5 h-3\.5 text-white" /> \{t\("app\.t12"\)\}',
    r'<span className="bg-[#8A2532] text-white backdrop-blur-md px-3 py-1.5 rounded-full text-[12px] font-bold shadow-sm flex items-center gap-1.5 cursor-pointer">\1<Lock className="w-3.5 h-3.5 text-white" /> {t("app.t12")}',
    content
)

# 3. Fix Open badge
content = re.sub(
    r'<span className="bg-\[#0B0C0D\] text-white backdrop-blur-md px-3 py-1\.5 rounded-full text-\[12px\] font-bold shadow-sm flex items-center gap-1\.5 cursor-pointer">(\s*)<Unlock className="w-3\.5 h-3\.5 text-white" /> \{t\("app\.t13"\)\}',
    r'<span className="bg-[#059669] text-white backdrop-blur-md px-3 py-1.5 rounded-full text-[12px] font-bold shadow-sm flex items-center gap-1.5 cursor-pointer">\1<Unlock className="w-3.5 h-3.5 text-white" /> {t("app.t13")}',
    content
)

# 4. Fix Next.js legacyBehavior Link (Login)
content = re.sub(
    r'<Link href="/designlogin" passHref legacyBehavior>\s*<motion\.a\s*whileHover=\{\{ scale: 1\.04 \}\}\s*whileTap=\{\{ scale: 0\.92 \}\}\s*transition=\{\{ type: "spring", stiffness: 400, damping: 25 \}\}\s*className="([^"]+)"\s*>\s*\{t\("app\.t4"\)\}\s*</motion\.a>\s*</Link>',
    r'''<motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.92 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                  <Link href="/designlogin" className="\1 block">{t("app.t4")}</Link>
                </motion.div>''',
    content
)

# 5. Fix Next.js legacyBehavior Link (Signup)
content = re.sub(
    r'<Link href="/designsignup" passHref legacyBehavior>\s*<motion\.a\s*whileHover=\{\{ scale: 1\.04 \}\}\s*whileTap=\{\{ scale: 0\.92 \}\}\s*transition=\{\{ type: "spring", stiffness: 400, damping: 25 \}\}\s*className="([^"]+)"\s*>\s*\{t\("app\.t5"\)\}\s*</motion\.a>\s*</Link>',
    r'''<motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.92 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                  <Link href="/designsignup" className="\1 block">{t("app.t5")}</Link>
                </motion.div>''',
    content
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updates applied")
