const { Client } = require('pg');

const run = async () => {
  const connectionString = 'postgresql://postgres.hhlbquuxnesiuwknscyq:QQdLzR5Ldv0z6kL0@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres';
  
  const client = new Client({ connectionString });

  try {
    await client.connect();

    const result = await client.query(`
      SELECT tgname, tgenabled
      FROM pg_trigger
      WHERE tgrelid = 'public.profiles'::regclass;
    `);
    
    console.log("Profiles triggers:", result.rows);

  } catch (err) {
    console.error("Connection failed:", err.message);
  } finally {
    await client.end();
  }
};

run();
