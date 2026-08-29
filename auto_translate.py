import json
import os
import re
from deep_translator import GoogleTranslator
import time

def clean_string(s):
    return s.strip()

with open('untranslated.json', 'r', encoding='utf-8') as f:
    untranslated_data = json.load(f)

unique_strings = set()
for file_path, items in untranslated_data.items():
    for item in items:
        text = clean_string(item['text'])
        if 'className=' in text or 'set' in text or 'openServiceModal' in text or '})' in text or text == 'setIsDropdownOpen(false)}>':
            continue
        unique_strings.add(text)

unique_strings = list(unique_strings)
print(f"Found {len(unique_strings)} unique strings to translate.", flush=True)

translator_ru = GoogleTranslator(source='en', target='ru')
translator_uz = GoogleTranslator(source='en', target='uz')

print("Translating...", flush=True)
translations = []
for i, text in enumerate(unique_strings):
    for attempt in range(3):
        try:
            ru_val = translator_ru.translate(text)
            uz_val = translator_uz.translate(text)
            break
        except Exception as e:
            if attempt == 2:
                ru_val = text
                uz_val = text
            time.sleep(2)
            
    print(f"[{i+1}/{len(unique_strings)}] Translated: {text[:20]}", flush=True)
    translations.append({
        'original': text,
        'en': text,
        'ru': ru_val,
        'uz': uz_val,
        'key': f't{i + 100}'
    })
    time.sleep(0.5) # Avoid rate limit

print("Updating json files...", flush=True)

def load_json(p):
    with open(p, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(p, data):
    with open(p, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

en_path = os.path.join('public', 'localization', 'en', 'en.json')
ru_path = os.path.join('public', 'localization', 'ru', 'ru.json')
uz_path = os.path.join('public', 'localization', 'uz', 'uz.json')

en_data = load_json(en_path)
ru_data = load_json(ru_path)
uz_data = load_json(uz_path)

if 'extra' not in en_data: en_data['extra'] = {}
if 'extra' not in ru_data: ru_data['extra'] = {}
if 'extra' not in uz_data: uz_data['extra'] = {}

for item in translations:
    en_data['extra'][item['key']] = item['en']
    ru_data['extra'][item['key']] = item['ru']
    uz_data['extra'][item['key']] = item['uz']

save_json(en_path, en_data)
save_json(ru_path, ru_data)
save_json(uz_path, uz_data)

print("Updating component files...", flush=True)
for file_path, items in untranslated_data.items():
    if not os.path.exists(file_path):
        continue
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    for item in translations:
        orig = item['original']
        key_str = f'extra.{item["key"]}'
        
        pattern1 = r'>\s*' + re.escape(orig) + r'\s*<'
        if re.search(pattern1, content):
            content = re.sub(pattern1, f'>{{useI18nStore.getState().t("{key_str}")}}<', content)
            
        pattern2 = r'placeholder="' + re.escape(orig) + r'"'
        if re.search(pattern2, content):
            content = re.sub(pattern2, f'placeholder={{useI18nStore.getState().t("{key_str}")}}', content)
            
        pattern3 = r'label="' + re.escape(orig) + r'"'
        if re.search(pattern3, content):
            content = re.sub(pattern3, f'label={{useI18nStore.getState().t("{key_str}")}}', content)
            
        pattern4 = r'title="' + re.escape(orig) + r'"'
        if re.search(pattern4, content):
            content = re.sub(pattern4, f'title={{useI18nStore.getState().t("{key_str}")}}', content)
            
    if content != original_content:
        if 'useI18nStore' not in content:
            content = 'import { useI18nStore } from "@/stores/i18nStore";\n' + content
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
            
print("Done!", flush=True)
