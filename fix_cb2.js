const fs = require('fs');
let code = fs.readFileSync('src/components/CustomerBooking.tsx', 'utf8');

const regex = /const bookingData = \{[\s\S]*?status: .pending. as const\s*\};/;
const newBookingData = `const serviceObj = venueData.services.find((s: any) => String(s.id) === String(selectedService));
      const staffObj = venueData.staff.find((s: any) => String(s.id) === String(selectedMaster));

      const bookingData = {
        client_id: currentUser?.id || null,
        business_id: venueData.id || venueId || "11111111-1111-1111-1111-111111111111",
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

code = code.replace(regex, newBookingData);
fs.writeFileSync('src/components/CustomerBooking.tsx', code);
console.log('done');
