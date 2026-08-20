const fs = require('fs');
let code = fs.readFileSync('src/components/CustomerBooking.tsx', 'utf8');

// Fix 1: fetchActualData logic
code = code.replace(
  /if \(venueId\) \{\s*async function fetchActualData\(\) \{\s*try \{\s*const supabase = createClient\(\);\s*const \{ data: business \} = await supabase\.from\('businesses'\)\.select\('\*'\)\.eq\('id', venueId\)\.single\(\);/,
  `async function fetchActualData() {
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

code = code.replace(
  /const \{ data: dbServices \} = await supabase\.from\('services'\)\.select\('\*'\)\.eq\('business_id', venueId\);/,
  `const { data: dbServices } = await supabase.from('services').select('*').eq('business_id', targetVenueId);`
);

code = code.replace(
  /return \{\s*\.\.\.prev,\s*name: business\.name/,
  `return {
                ...prev,
                id: targetVenueId,
                name: business.name`
);

code = code.replace(
  /      fetchActualData\(\);\s*\}\s*\}, \[venueId\]\);/,
  `      fetchActualData();
  }, [venueId]);`
);

// Fix 2: bookingData logic
const oldBookingData = `      const bookingData = {
        client_id: currentUser?.id || null, // Use null instead of undefined so it's not omitted by JSON.stringify
        business_id: venueId || "11111111-1111-1111-1111-111111111111", // Fallback to seed UUID if venueId missing
        service_id: selectedService || undefined,
        date: selectedDate,
        time: selectedTime || undefined,
        guest_name: currentUser ? (currentUser.user_metadata?.full_name || currentUser.email || customerName || "") : customerName,
        guest_phone: currentUser ? (currentUser.phone || customerPhone || "") : customerPhone,
        is_guest: !currentUser,
        status: "pending" as const
      };`;

const newBookingData = `      const serviceObj = venueData.services.find((s: any) => s.id === selectedService);
      const staffObj = venueData.staff.find((s: any) => s.id === selectedMaster);

      const bookingData = {
        client_id: currentUser?.id || null,
        business_id: (venueData as any).id || venueId || "11111111-1111-1111-1111-111111111111",
        service_id: selectedService || undefined,
        service_name: serviceObj?.name || undefined,
        staff_id: selectedMaster || undefined,
        staff_name: staffObj?.name || undefined,
        date: selectedDate,
        time: selectedTime || undefined,
        guest_name: currentUser ? (currentUser.user_metadata?.full_name || currentUser.email || customerName || "") : customerName,
        guest_phone: currentUser ? (currentUser.phone || customerPhone || "") : customerPhone,
        is_guest: !currentUser,
        status: "pending" as const
      };`;

code = code.replace(oldBookingData, newBookingData);
fs.writeFileSync('src/components/CustomerBooking.tsx', code);
console.log('done');
