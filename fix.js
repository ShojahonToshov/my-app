const fs = require('fs');
let c = fs.readFileSync('src/components/CustomerBooking.tsx', 'utf8');

c = c.replace(
`    if (venueId) {
      async function fetchActualData() {
        try {
          const supabase = createClient();
          const { data: business } = await supabase.from('businesses').select('*').eq('id', venueId).single();`,
`    async function fetchActualData() {
      try {
        const supabase = createClient();
        let targetVenueId = venueId;
        if (!targetVenueId) {
          const { data: businesses } = await supabase.from('businesses').select('*').limit(1);
          if (businesses && businesses.length > 0) targetVenueId = businesses[0].id;
          else return;
        }
        const { data: business } = await supabase.from('businesses').select('*').eq('id', targetVenueId).single();`
);

c = c.replace(
`          const { data: dbServices } = await supabase.from('services').select('*').eq('business_id', venueId);`,
`          const { data: dbServices } = await supabase.from('services').select('*').eq('business_id', targetVenueId);`
);

c = c.replace(
`      }
      fetchActualData();
    }
  }, [venueId]);`,
`      }
      fetchActualData();
  }, [venueId]);`
);

c = c.replace(
`business_id: venueId || "11111111-1111-1111-1111-111111111111",`,
`business_id: venueData.id || venueId || "11111111-1111-1111-1111-111111111111",`
);

fs.writeFileSync('src/components/CustomerBooking.tsx', c);
console.log('Fixed');
