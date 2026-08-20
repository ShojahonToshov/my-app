
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://hhlbquuxnesiuwknscyq.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // using service role temporarily just to fetch a valid venue and user
const adminSupabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  // 1. Get a venue ID
  const { data: businesses } = await adminSupabase.from('businesses').select('id').limit(1);
  const venueId = businesses[0].id;
  
  // 2. Get a user ID
  const { data: { users } } = await adminSupabase.auth.admin.listUsers();
  const user = users[0];
  
  // 3. Create a client authenticated as this user using their token (wait, we need their token. Or we can just create a new user).
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || require('dotenv').config({path: '.env.local'}).parsed.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const client = createClient(supabaseUrl, anonKey);
  
  // Create a new user for testing
  const email = 'test_' + Date.now() + '@example.com';
  const { data: authData, error: authError } = await client.auth.signUp({ email, password: 'password123' });
  if (authError) return console.error('Auth error:', authError);
  
  const testUserId = authData.user.id;
  
  const bookingData = {
    client_id: testUserId,
    business_id: venueId,
    service_id: '11111111-1111-1111-1111-111111111111', // we might need a real service id
    date: '2026-08-20',
    time: '12:00',
    guest_name: 'Test',
    guest_phone: '123456',
    is_guest: false,
    status: 'pending'
  };
  
  // Need a real service id
  const { data: services } = await adminSupabase.from('services').select('id').limit(1);
  if(services.length > 0) bookingData.service_id = services[0].id;
  
  console.log('Inserting with client_id', testUserId, 'and token', authData.session.access_token.substring(0, 10));
  
  const { data, error } = await client.from('bookings').insert([bookingData]);
  console.log('Result:', error || data);
}
run();
