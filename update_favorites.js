const fs = require('fs');
const path = require('path');

const accountClientPath = path.join('src', 'app', 'account', 'components', 'AccountClient.tsx');
let accountClientStr = fs.readFileSync(accountClientPath, 'utf8');

const favoritesListCode = `
export function FavoritesList({ initialVenues, currentUserId }: { initialVenues: any[], currentUserId: string }) {
  const [savedIds, setSavedIds] = React.useState<Set<string>>(new Set());
  
  React.useEffect(() => {
    const SAVED_KEY = \`elara_saved_\${currentUserId}\`;
    const raw = localStorage.getItem(SAVED_KEY);
    setSavedIds(new Set(raw ? (JSON.parse(raw) as string[]) : []));
  }, [currentUserId]);

  const favoriteVenues = initialVenues.filter(v => savedIds.has(v.id));

  return (
    <AnimatedList className="space-y-4">
      {favoriteVenues.length > 0 ? favoriteVenues.map((venue) => (
        <AnimatedListItem key={venue.id}>
          <Link href="/booking" className="w-full text-left bg-white rounded-[2rem] p-5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.08)] transition-all duration-300 flex items-center gap-5 active:scale-[0.98] group block outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
            <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
              <img src={venue.imageUrl || venue.image} alt={venue.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[#121415] text-lg tracking-tight truncate group-hover:text-[#8A2532] transition-colors">{venue.name}</h3>
              <div className="flex items-center gap-2 text-sm text-[#4A4E51] font-medium mt-1 mb-2">
                <Star className="w-3.5 h-3.5 fill-[#8A2532] text-[#8A2532] shrink-0" />
                <span className="font-semibold text-[#121415] shrink-0">{venue.rating}</span>
                <span className="shrink-0">•</span>
                <span className="truncate">{venue.category}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-[#4A4E51]">
                <MapPin className="w-3.5 h-3.5 text-[#8A2532] shrink-0" />
                <span className="truncate">{venue.address}</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#F5F5F4] flex items-center justify-center shrink-0 group-hover:bg-[#121415] transition-colors hidden sm:flex">
              <ArrowRight className="w-4 h-4 text-[#4A4E51] group-hover:text-white transition-colors" />
            </div>
          </Link>
        </AnimatedListItem>
      )) : (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.04)]">
          <div className="w-16 h-16 bg-[#F5F5F4] rounded-2xl flex items-center justify-center mb-6 border border-[#DCDCDA] shrink-0">
            <Heart className="w-8 h-8 text-[#4A4E51]" />
          </div>
          <h3 className="text-xl font-semibold text-[#121415] mb-2 tracking-tight">No favorites yet</h3>
          <p className="text-[#4A4E51] font-medium mb-8 max-w-sm leading-relaxed">
            When you interact with venues or book services, they will appear right here.
          </p>
          <div className="mt-2 w-full flex justify-center">
            <Link href="/search" className="h-12 px-8 bg-[#121415] text-white rounded-full font-medium text-sm shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:bg-[#1E2123] transition-all active:scale-95 inline-flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">Explore directory</Link>
          </div>
        </div>
      )}
    </AnimatedList>
  );
}
`;

if (!accountClientStr.includes('FavoritesList')) {
  accountClientStr = accountClientStr.replace(
    /import {\n  Loader2, Star, MessageSquare, Bell, CalendarDays, RefreshCw, X, CheckCircle2, ChevronRight\n} from "lucide-react";/,
    `import {\n  Loader2, Star, MessageSquare, Bell, CalendarDays, RefreshCw, X, CheckCircle2, ChevronRight, Heart, MapPin, ArrowRight\n} from "lucide-react";`
  );
  accountClientStr = accountClientStr.replace(
    /import \{ createClient \} from "@\/utils\/supabase\/client";/,
    `import { createClient } from "@/utils/supabase/client";\nimport Link from "next/link";`
  );
  accountClientStr += '\n' + favoritesListCode + '\n';
  fs.writeFileSync(accountClientPath, accountClientStr);
  console.log('AccountClient.tsx updated.');
} else {
  console.log('AccountClient.tsx already has FavoritesList.');
}

const accountPagePath = path.join('src', 'app', 'account', 'page.tsx');
let accountPageStr = fs.readFileSync(accountPagePath, 'utf8');

accountPageStr = accountPageStr.replace(
  /import \{ AuthService \} from "@\/services\/AuthService";/,
  `import { AuthService } from "@/services/AuthService";\nimport { VenueService } from "@/services/VenueService";`
);

accountPageStr = accountPageStr.replace(
  /AnimatedListItem\n\} from "\.\/components\/AccountClient";/,
  `AnimatedListItem,\n  FavoritesList\n} from "./components/AccountClient";`
);

accountPageStr = accountPageStr.replace(
  /const authService = new AuthService\(supabase\);\n  const authUser = await authService\.getCurrentUser\(\);/,
  `const authService = new AuthService(supabase);\n  const venueService = new VenueService(supabase);\n  const authUser = await authService.getCurrentUser();\n  const venues = await venueService.getVenues();\n  const allVenues = venues.map((b: any) => ({\n    id: b.id,\n    name: b.name,\n    category: b.category ?? "General",\n    rating: b.rating ?? 5,\n    address: b.address ?? "",\n    image: b.image_url ?? "",\n  }));`
);

accountPageStr = accountPageStr.replace(
  /  const favoriteVenues = \[\s*\{\s*id: "1".*\}\s*\];\n/g,
  ''
);

const regex = /\{activeTab === "favorites" && \([\s\S]*?<\/AnimatedList>\s*\n\s*\)\}/;
if (regex.test(accountPageStr)) {
  accountPageStr = accountPageStr.replace(
    regex,
    `{activeTab === "favorites" && (\n            <FavoritesList initialVenues={allVenues} currentUserId={authUser?.id ?? "guest"} />\n          )}`
  );
  fs.writeFileSync(accountPagePath, accountPageStr);
  console.log('page.tsx updated.');
} else {
  console.log('Could not match JSX in page.tsx');
}
