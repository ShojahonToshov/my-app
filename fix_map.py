import os
import re

base = "c:/Users/user/Desktop/Elara/my-app/src"

# 1. search/page.tsx
search_page = os.path.join(base, "app", "search", "page.tsx")
with open(search_page, "r", encoding="utf-8") as f:
    content = f.read()
content = content.replace(
    'coordinates: b.coordinates ?? { x: 0, y: 0 },',
    'coordinates: (b.lat != null && b.lng != null) ? [b.lat, b.lng] : { x: 0, y: 0 },'
)
with open(search_page, "w", encoding="utf-8") as f:
    f.write(content)

# 2. designsearch/page.tsx
design_page = os.path.join(base, "app", "(website)", "designsearch", "page.tsx")
with open(design_page, "r", encoding="utf-8") as f:
    content = f.read()
content = content.replace(
    'coordinates: b.coordinates ?? { x: 0, y: 0 },',
    'coordinates: (b.lat != null && b.lng != null) ? [b.lat, b.lng] : { x: 0, y: 0 },'
)
with open(design_page, "w", encoding="utf-8") as f:
    f.write(content)

# 3. OnboardingWizard.tsx
onboarding = os.path.join(base, "components", "Onboarding", "OnboardingWizard.tsx")
with open(onboarding, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    'import { Input } from "@/components/ui/Input";',
    'import AddressAutocompleteInput from "./AddressAutocompleteInput";\nimport { Input } from "@/components/ui/Input";'
)

content = content.replace(
    'const [address, setAddress] = useState("");',
    'const [address, setAddress] = useState("");\n  const [lat, setLat] = useState<number | null>(null);\n  const [lng, setLng] = useState<number | null>(null);'
)

content = content.replace(
    'setAddress(data.address || "");',
    'setAddress(data.address || "");\n          setLat(data.lat || null);\n          setLng(data.lng || null);'
)

content = content.replace(
    'await supabase.from("businesses").update({ address }).eq("id", businessId);',
    'if (lat === null || lng === null) throw new Error("Please select a valid address from the dropdown suggestions");\n        await supabase.from("businesses").update({ address, lat, lng }).eq("id", businessId);'
)

# Address block in OnboardingWizard
content = re.sub(
    r'<Input\s*id="address"\s*label=\{t\("extra\.t183"\)\}\s*icon=\{MapPin\}\s*placeholder=\{t\("extra\.t58"\)\}\s*value=\{address\}\s*onChange=\{\(e\) => setAddress\(e\.target\.value\)\}\s*/>',
    '<AddressAutocompleteInput\n            value={address}\n            onChange={(val, newLat, newLng) => {\n              setAddress(val);\n              setLat(newLat);\n              setLng(newLng);\n            }}\n            placeholder={t("extra.t58")}\n            icon={MapPin}\n          />',
    content
)
with open(onboarding, "w", encoding="utf-8") as f:
    f.write(content)


# 4. Settings.tsx
settings = os.path.join(base, "components", "dashboard-pages", "Settings.tsx")
with open(settings, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    'import { createClient } from "@/utils/supabase/client";',
    'import { createClient } from "@/utils/supabase/client";\nimport AddressAutocompleteInput from "@/components/Onboarding/AddressAutocompleteInput";'
)

content = content.replace(
    'const [venueProfile, setVenueProfile] = useState<{name: string; phone: string; address: string; description: string; socialLinks: {platform: string; value: string}[]}>({ name: \'\', phone: \'\', address: \'\', description: \'\', socialLinks: [] });',
    'const [venueProfile, setVenueProfile] = useState<{name: string; phone: string; address: string; lat: number | null; lng: number | null; description: string; socialLinks: {platform: string; value: string}[]}>({ name: \'\', phone: \'\', address: \'\', lat: null, lng: null, description: \'\', socialLinks: [] });'
)

content = content.replace(
    '''setVenueProfile({
          name: business.name || '',
          phone: businessPhone,
          address: business.address || '',
          description: business.description || '',
          socialLinks: initialSocialLinks
        });''',
    '''setVenueProfile({
          name: business.name || '',
          phone: businessPhone,
          address: business.address || '',
          lat: business.lat || null,
          lng: business.lng || null,
          description: business.description || '',
          socialLinks: initialSocialLinks
        });'''
)

content = content.replace(
    '''const { error } = await supabase.from('businesses').update({
        name: venueProfile.name,
        phone: venueProfile.phone,
        address: venueProfile.address,
        description: venueProfile.description,
        social_links: venueProfile.socialLinks
      }).eq('id', businessId);''',
    '''const { error } = await supabase.from('businesses').update({
        name: venueProfile.name,
        phone: venueProfile.phone,
        address: venueProfile.address,
        lat: venueProfile.lat,
        lng: venueProfile.lng,
        description: venueProfile.description,
        social_links: venueProfile.socialLinks
      }).eq('id', businessId);'''
)

content = re.sub(
    r'<div className="relative">\s*<MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-\[#8B9194\]" />\s*<input id="venue-address" name="venue-address" type="text" value=\{venueProfile\.address\} onChange=\{\(e\) => setVenueProfile\(\{\.\.\.venueProfile, address: e\.target\.value\}\)\} className="w-full pl-12 pr-4 py-3 bg-\[#F5F5F4\] border border-\[#DCDCDA\] rounded-xl text-\[#121415\] font-medium focus:bg-white focus:border-\[#121415\] focus:ring-2 focus:ring-\[#121415\]/10 outline-none transition-all placeholder:text-\[#8B9194\]" placeholder=\{t\("extra\.t10"\)\} />\s*</div>',
    '<AddressAutocompleteInput\n                        value={venueProfile.address}\n                        onChange={(val, newLat, newLng) => setVenueProfile({\n                          ...venueProfile,\n                          address: val,\n                          lat: newLat,\n                          lng: newLng\n                        })}\n                        placeholder={t("extra.t10")}\n                        icon={MapPin}\n                      />',
    content
)

with open(settings, "w", encoding="utf-8") as f:
    f.write(content)

print("Done")
