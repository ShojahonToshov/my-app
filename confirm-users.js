const { Client } = require('pg');

const run = async () => {
  const connectionString = 'postgresql://postgres.hhlbquuxnesiuwknscyq:QQdLzR5Ldv0z6kL0@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres';
  const client = new Client({ connectionString });

  try {
    await client.connect();

    // Mark all existing users as confirmed
    const sql = `
      UPDATE auth.users 
      SET email_confirmed_at = now() 
      WHERE email_confirmed_at IS NULL;
    `;
    const res = await client.query(sql);
    console.log(`Confirmed ${res.rowCount} users!`);

  } catch (err) {
    console.error("Failed to update users:", err.message);
  } finally {
    await client.end();
  }
};

run();
