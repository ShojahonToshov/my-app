import re

file_path = r'C:\Users\user\Desktop\Elara\my-app\src\app\(website)\designsearch\components\DesignSearchClient.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace main opening tag
content = content.replace(
    '<main className="flex-1 pt-[100px] lg:pt-[120px] max-w-[1352px] mx-auto w-full px-4 sm:px-6 relative z-10 flex flex-col pb-20">',
    '<div className="w-full flex justify-center px-4 md:px-6"><main className="flex-1 pt-[100px] lg:pt-[120px] max-w-[1352px] w-full relative z-10 flex flex-col pb-20">'
)

# Replace main closing tag
content = content.replace(
    '</main>\n\n      {/* Intercept Booking Modal */}',
    '</main>\n      </div>\n\n      {/* Intercept Booking Modal */}'
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Layout fixed")
