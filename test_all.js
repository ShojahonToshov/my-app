const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://hhlbquuxnesiuwknscyq.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  const { data: bookings, error } = await supabase.from('bookings').select('*');
  console.log('Error:', error);
  console.log('Bookings count:', bookings ? bookings.length : 0);
  if (bookings && bookings.length > 0) {
    console.log('Sample booking:', bookings[bookings.length - 1]);
  }
}
run();
