const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://hhlbquuxnesiuwknscyq.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhobGJxdXV4bmVzaXV3a25zY3lxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3Mjg0MDcsImV4cCI6MjEwMjMwNDQwN30.QDBuJQV1qvVXKkGUhBe_YBGorDfQg_3UPVJtAv5rr-s');
async function run() {
  const { data: authData } = await supabase.auth.signInWithPassword({ email: 'owner1@example.com', password: 'dummy_password' });
  const { data: businesses } = await supabase.from('businesses').select('*');
  console.log('Businesses:', businesses);
  const { data: bookings } = await supabase.from('bookings').select('*');
  console.log('Bookings:', bookings);
}
run();
