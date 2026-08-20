
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://hhlbquuxnesiuwknscyq.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhobGJxdXV4bmVzaXV3a25zY3lxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3Mjg0MDcsImV4cCI6MjEwMjMwNDQwN30.QDBuJQV1qvVXKkGUhBe_YBGorDfQg_3UPVJtAv5rr-s';
const client = createClient(supabaseUrl, anonKey);

async function run() {
  const email = 'test_' + Date.now() + '@example.com';
  const { data: authData } = await client.auth.signUp({ email, password: 'password123' });
  const testUserId = authData.user.id;
  
  const bookingData = {
    client_id: testUserId,
    business_id: '91393948-b02a-4df8-ac03-b1f03a50f22b', 
    service_id: '285a7c4b-d9fd-4d22-886f-a7e24e819815', 
    date: '2026-08-20',
    time: '12:00',
    guest_name: 'Test',
    guest_phone: '123456',
    is_guest: false,
    status: 'pending'
  };
  
  console.log('Inserting...');
  const { data, error } = await client.from('bookings').insert([bookingData]);
  console.log('Insert Error:', error);
}
run().catch(console.error);
