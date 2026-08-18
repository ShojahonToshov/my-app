-- Dummy user lookup logic is not standard for seed.sql (since it executes purely in SQL)
-- For a seed script, it's better to create a deterministic user or just insert mock records.
-- Because this requires auth.users, we can just insert a mock user first.

INSERT INTO auth.users (id, instance_id, role, aud, authenticated_role, email, encrypted_password, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'authenticated', 'owner1@example.com', 'dummy_password', now(), now()),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'authenticated', 'owner2@example.com', 'dummy_password', now(), now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.businesses (id, owner_id, name, category, address, rating, image_url)
VALUES 
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'Chop-Chop Barbershop', 'Barbershop', 'Amir Temur St, 42', 4.9, 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&q=80'),
  ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000001', 'Glow Beauty Studio', 'Salon', 'Tashkent City', 4.8, 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&q=80')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.services (business_id, name, price, duration_minutes)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Haircut & Styling', 15.00, 45),
  ('11111111-1111-1111-1111-111111111111', 'Beard Trim', 10.00, 30),
  ('22222222-2222-2222-2222-222222222222', 'Manicure', 20.00, 60),
  ('22222222-2222-2222-2222-222222222222', 'Hair Coloring', 50.00, 120);
