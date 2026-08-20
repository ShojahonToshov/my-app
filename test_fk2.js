const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://hhlbquuxnesiuwknscyq.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhobGJxdXV4bmVzaXV3a25zY3lxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3Mjg0MDcsImV4cCI6MjEwMjMwNDQwN30.QDBuJQV1qvVXKkGUhBe_YBGorDfQg_3UPVJtAv5rr-s');
async function run() {
  const { data: authData } = await supabase.auth.signInWithPassword({ email: 'owner1@example.com', password: 'dummy_password' });
  const { error } = await supabase.from('bookings').insert([{ business_id: '11111111-1111-1111-1111-111111111111', client_id: authData.user.id, date: 'test', time: 'test' }]);
  console.log('Error:', error);
}
run();
