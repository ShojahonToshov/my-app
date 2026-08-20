const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://hhlbquuxnesiuwknscyq.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhobGJxdXV4bmVzaXV3a25zY3lxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3Mjg0MDcsImV4cCI6MjEwMjMwNDQwN30.QDBuJQV1qvVXKkGUhBe_YBGorDfQg_3UPVJtAv5rr-s');
async function run() {
  const { data: authData } = await supabase.auth.signInWithPassword({ email: 'owner1@example.com', password: 'dummy_password' });
  const newBooking = {
    client_id: authData.user.id,
    business_id: '91393948-b02a-4df8-ac03-b1f03a50f22b',
    service_id: '1',
    guest_name: 'Test',
    guest_phone: '123',
    is_guest: false,
    id: Date.now().toString(),
    userId: authData.user.id,
    venueId: '91393948-b02a-4df8-ac03-b1f03a50f22b',
    date: '2026-08-20',
    time: '12:00',
    status: 'upcoming'
  };
  const { data, error } = await supabase.from('bookings').insert([newBooking]);
  console.log('Data:', data);
  console.log('Error:', error);
}
run();
