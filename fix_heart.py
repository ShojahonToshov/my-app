import re

file_path = r'C:\Users\user\Desktop\Elara\my-app\src\app\(website)\designsearch\components\DesignSearchClient.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Heart color
content = content.replace(
    '''? "fill-[#0B0C0D] text-[#0B0C0D]"
                                      : "text-[#8D9195] hover:text-[#0B0C0D]"''',
    '''? "fill-[#8A2532] text-[#8A2532]"
                                      : "text-[#8D9195] hover:text-[#8A2532]"'''
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Heart fixed")
