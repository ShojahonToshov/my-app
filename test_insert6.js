
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://hhlbquuxnesiuwknscyq.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhobGJxdXV4bmVzaXV3a25zY3lxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3Mjg0MDcsImV4cCI6MjEwMjMwNDQwN30.QDBuJQV1qvVXKkGUhBe_YBGorDfQg_3UPVJtAv5rr-s';
const client = createClient(supabaseUrl, anonKey);

async function run() {
  const email = 'test_' + Date.now() + '@example.com';
  const { data: authData } = await client.auth.signUp({ email, password: 'password123' });
  const testUserId = authData.user.id;
  
  // Create business
  const { data: bizData, error: bizErr } = await client.from('businesses').insert([{ owner_id: testUserId, name: 'Test Biz' }]).select();
  if (bizErr) return console.log('Biz Error:', bizErr);
  const bizId = bizData[0].id;
  
  // Create service
  const { data: srvData, error: srvErr } = await client.from('services').insert([{ business_id: bizId, name: 'Test Srv', price: 10, duration_minutes: 30 }]).select();
  if (srvErr) return console.log('Srv Error:', srvErr);
  const srvId = srvData[0].id;
  
  const bookingData = {
    client_id: testUserId,
    business_id: bizId, 
    service_id: srvId, 
    date: '2026-08-20',
    time: '12:00',
    guest_name: 'Test',
    guest_phone: '123456',
    is_guest: false,
    status: 'pending'
  };
  
  console.log('Inserting booking...');
  const { data, error } = await client.from('bookings').insert([bookingData]);
  console.log('Insert Error:', error);
}
run().catch(console.error);
