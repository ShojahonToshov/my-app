const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres.hhlbquuxnesiuwknscyq:QQdLzR5Ldv0z6kL0@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres' });
client.connect()
  .then(() => client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"))
  .then(res => console.log(res.rows))
  .finally(() => client.end());
