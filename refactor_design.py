import re
import os

page_path = r"C:\Users\user\Desktop\Elara\my-app\src\app\(website)\design\page.tsx"
with open(page_path, "r", encoding="utf-8") as f:
    content = f.read()

# Remove AdaptedLogo
content = re.sub(r"// Increased logo size\nfunction AdaptedLogo\(\) \{.*?\n\}\n", "", content, flags=re.DOTALL)

# Remove FLOATING NAVBAR
content = re.sub(r"\s*\{/\* FLOATING NAVBAR \*/\}\n\s*<div className=\"fixed top-6.*?</nav>\n\s*</div>", "", content, flags=re.DOTALL)

# Remove Footer
content = re.sub(r"\s*<footer className=\"bg-\[#F3F4F4\].*?</footer>", "", content, flags=re.DOTALL)

# Remove mobileMenuOpen state
content = re.sub(r"\s*const \[mobileMenuOpen, setMobileMenuOpen\] = useState\(false\);\n", "\n", content)

# Remove activeSection state 
content = re.sub(r"\s*const \[activeSection, setActiveSection\] = useState\(\"platform\"\);\n", "\n", content)

with open(page_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Done")
