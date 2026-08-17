const { Client } = require('pg');

const run = async () => {
  const connectionString = 'postgresql://postgres.hhlbquuxnesiuwknscyq:QQdLzR5Ldv0z6kL0@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres';
  
  const client = new Client({ connectionString });

  try {
    await client.connect();

    const result = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'profiles';
    `);
    
    console.log("Profiles schema:", result.rows);

    const pols = await client.query(`
      SELECT polname, polcmd, polqual, polwithcheck 
      FROM pg_policy 
      WHERE polrelid = 'public.profiles'::regclass;
    `);
    
    console.log("Profiles policies:", pols.rows);

  } catch (err) {
    console.error("Connection failed:", err.message);
  } finally {
    await client.end();
  }
};

run();
