const { Client } = require('pg');

const run = async () => {
  const connectionString = 'postgresql://postgres.hhlbquuxnesiuwknscyq:QQdLzR5Ldv0z6kL0@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres';
  const client = new Client({ connectionString });

  try {
    await client.connect();

    // First, let's create a dummy owner profile/user
    // In auth.users, inserting directly can be tricky due to RLS and constraints, but we can just use an existing user id if we know it.
    // Or we can just bypass the foreign key for testing by fetching any user.
    const res = await client.query('SELECT id FROM auth.users LIMIT 1');
    if (res.rows.length === 0) {
      console.log("No users found. Cannot seed businesses without an owner.");
      return;
    }
    const ownerId = res.rows[0].id;

    // Seed Businesses
    const insertBusiness = `
      INSERT INTO public.businesses (id, owner_id, name, category, address, rating, image_url)
      VALUES 
      (gen_random_uuid(), $1, 'Chop-Chop Barbershop', 'Barbershop', 'Amir Temur St, 42', 4.9, 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&q=80'),
      (gen_random_uuid(), $1, 'Glow Beauty Studio', 'Salon', 'Tashkent City', 4.8, 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&q=80')
      RETURNING id, name;
    `;
    const bRes = await client.query(insertBusiness, [ownerId]);
    console.log("Seeded businesses:", bRes.rows);

    const chopId = bRes.rows.find(b => b.name === 'Chop-Chop Barbershop').id;
    const glowId = bRes.rows.find(b => b.name === 'Glow Beauty Studio').id;

    // Seed Services
    const insertServices = `
      INSERT INTO public.services (business_id, name, price, duration_minutes)
      VALUES 
      ($1, 'Haircut & Styling', 15.00, 45),
      ($1, 'Beard Trim', 10.00, 30),
      ($2, 'Manicure', 20.00, 60),
      ($2, 'Hair Coloring', 50.00, 120)
    `;
    await client.query(insertServices, [chopId, glowId]);
    console.log("Seeded services!");

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
};
run();
