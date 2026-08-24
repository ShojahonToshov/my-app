
import { createClient } from '@supabase/supabase-js';
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
async function run() { 
  const { data, error } = await supabaseAdmin.from('bookings').select('id, date').limit(5); 
  console.log('Bookings:', data); 
} 
run();
