import re

with open('src/components/Landing.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("CheckCircle2,\n  Navigation,", "CheckCircle2,\n  Navigation,\n  Info,\n  PhoneCall,\n  MoreHorizontal,\n  Scissors,")

with open('src/components/Landing.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Imports fixed")
