import sys

file_path = r'C:\Users\user\Desktop\Elara\my-app\src\app\(website)\designsearch\components\DesignSearchClient.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Star
target_star = 'className="w-4 h-4 fill-[#0B0C0D] text-[#0B0C0D] shrink-0"'
rep_star = 'className="w-4 h-4 fill-[#F5A623] text-[#F5A623] shrink-0"'
content = content.replace(target_star, rep_star)

# 2. Closed
target_closed = '''<span className="bg-[#0B0C0D] text-white backdrop-blur-md px-3 py-1.5 rounded-full text-[12px] font-bold shadow-sm flex items-center gap-1.5 cursor-pointer">
                                      <Lock className="w-3.5 h-3.5 text-white" /> {t("app.t12")}
                                    </span>'''
rep_closed = '''<span className="bg-[#8A2532] text-white backdrop-blur-md px-3 py-1.5 rounded-full text-[12px] font-bold shadow-sm flex items-center gap-1.5 cursor-pointer">
                                      <Lock className="w-3.5 h-3.5 text-white" /> {t("app.t12")}
                                    </span>'''
content = content.replace(target_closed, rep_closed)

# 3. Open
target_open = '''<span className="bg-[#0B0C0D] text-white backdrop-blur-md px-3 py-1.5 rounded-full text-[12px] font-bold shadow-sm flex items-center gap-1.5 cursor-pointer">
                                      <Unlock className="w-3.5 h-3.5 text-white" /> {t("app.t13")}
                                    </span>'''
rep_open = '''<span className="bg-[#059669] text-white backdrop-blur-md px-3 py-1.5 rounded-full text-[12px] font-bold shadow-sm flex items-center gap-1.5 cursor-pointer">
                                      <Unlock className="w-3.5 h-3.5 text-white" /> {t("app.t13")}
                                    </span>'''
content = content.replace(target_open, rep_open)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Colors updated successfully")
