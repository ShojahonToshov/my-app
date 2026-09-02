import sys

file_path = r'C:\Users\user\Desktop\Elara\my-app\src\components\WebsiteHeader.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target = '''export function WebsiteHeader() {
  const { t } = useI18n();'''

replacement = '''import { usePathname } from "next/navigation";

export function WebsiteHeader() {
  const pathname = usePathname();
  const { t } = useI18n();

  if (pathname === "/designsearch") return null;
'''

if target in content:
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content.replace(target, replacement))
    print('Replaced')
else:
    print('Target not found')
