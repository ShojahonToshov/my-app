const fs = require('fs');
let c = fs.readFileSync('src/components/CustomerBooking.tsx', 'utf8');

const regex1 = /    if \(venueId\) \{\r?\n      async function fetchActualData\(\) \{\r?\n        try \{\r?\n          const supabase = createClient\(\);\r?\n          const \{ data: business \} = await supabase.from\('businesses'\).select\('\*'\).eq\('id', venueId\).single\(\);/;

const replacement1 = `    async function fetchActualData() {
      try {
        const supabase = createClient();
        let targetVenueId = venueId;
        if (!targetVenueId) {
          const { data: businesses } = await supabase.from('businesses').select('*').limit(1);
          if (businesses && businesses.length > 0) targetVenueId = businesses[0].id;
          else return;
        }
        const { data: business } = await supabase.from('businesses').select('*').eq('id', targetVenueId).single();`;

c = c.replace(regex1, replacement1);

const regex2 = /          const \{ data: dbServices \} = await supabase.from\('services'\).select\('\*'\).eq\('business_id', venueId\);/g;
const replacement2 = `          const { data: dbServices } = await supabase.from('services').select('*').eq('business_id', targetVenueId);`;
c = c.replace(regex2, replacement2);

const regex3 = /      \}\r?\n      fetchActualData\(\);\r?\n    \}\r?\n  \}, \[venueId\]\);/;
const replacement3 = `      }
      fetchActualData();
  }, [venueId]);`;
c = c.replace(regex3, replacement3);

const regex4 = /business_id: venueId \|\| "11111111-1111-1111-1111-111111111111",/;
const replacement4 = `business_id: venueData.id || venueId || "11111111-1111-1111-1111-111111111111",`;
c = c.replace(regex4, replacement4);

fs.writeFileSync('src/components/CustomerBooking.tsx', c);
console.log('Fixed');
