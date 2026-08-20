
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://hhlbquuxnesiuwknscyq.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhobGJxdXV4bmVzaXV3a25zY3lxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3Mjg0MDcsImV4cCI6MjEwMjMwNDQwN30.QDBuJQV1qvVXKkGUhBe_YBGorDfQg_3UPVJtAv5rr-s';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminClient = createClient(supabaseUrl, serviceRoleKey);
const client = createClient(supabaseUrl, anonKey);

async function run() {
  // 1. Create a user
  const email = 'test_' + Date.now() + '@example.com';
  const { data: authData } = await client.auth.signUp({ email, password: 'password123' });
  const testUserId = authData.user.id;
  
  // 2. Insert booking via admin (bypassing RLS)
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
  const { data: inserted, error: adminErr } = await adminClient.from('bookings').insert([bookingData]).select();
  if (adminErr) return console.log('Admin insert failed:', adminErr);
  const bookingId = inserted[0].id;
  console.log('Admin inserted booking:', bookingId);
  
  // 3. Try to update via authenticated client
  const { data: updated, error: updateErr } = await client.from('bookings').update({ status: 'confirmed' }).eq('id', bookingId).select();
  console.log('Update result (data, err):', updated, updateErr);
}
run().catch(console.error);
