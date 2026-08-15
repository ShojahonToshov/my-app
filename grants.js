const { Client } = require('pg');
const run = async () => {
  const connectionString = 'postgresql://postgres.hhlbquuxnesiuwknscyq:QQdLzR5Ldv0z6kL0@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres';
  const client = new Client({ connectionString });
  try {
    await client.connect();
    
    const sql = `
      GRANT USAGE ON SCHEMA public TO anon, authenticated;
      GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
      GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
      GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated;
    `;
    await client.query(sql);
    console.log("Grants executed!");

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
};
run();
