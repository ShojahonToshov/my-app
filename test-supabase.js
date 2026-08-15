require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const run = async () => {
  const { data, error } = await supabase.from("businesses").select("*");
  if (error) console.log("Error:", error);
  else console.log("Data:", data);
};
run();
