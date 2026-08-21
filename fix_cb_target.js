const fs = require('fs');
let code = fs.readFileSync('src/components/CustomerBooking.tsx', 'utf8');

const regex = /let targetVenueId = venueId;[\s\S]*?const \{ data: business \} = await supabase/;
const replacement = `let targetVenueId = venueId;
        if (!targetVenueId) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: myBusiness } = await supabase.from('businesses').select('*').eq('owner_id', user.id).single();
            if (myBusiness) targetVenueId = myBusiness.id;
          }
          if (!targetVenueId) {
            const { data: businesses } = await supabase.from('businesses').select('*').limit(1);
            if (businesses && businesses.length > 0) targetVenueId = businesses[0].id;
            else return;
          }
        }
        const { data: business } = await supabase`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/components/CustomerBooking.tsx', code);
console.log('done');
