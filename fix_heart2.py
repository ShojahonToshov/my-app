import re

file_path = r'C:\Users\user\Desktop\Elara\my-app\src\app\(website)\designsearch\components\DesignSearchClient.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Heart color
content = re.sub(
    r'\? "fill-\[#0B0C0D\] text-\[#0B0C0D\]"',
    r'? "fill-[#8A2532] text-[#8A2532]"',
    content
)
content = re.sub(
    r': "text-\[#8D9195\] hover:text-\[#0B0C0D\]"',
    r': "text-[#8D9195] hover:text-[#8A2532]"',
    content
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Heart fixed")
