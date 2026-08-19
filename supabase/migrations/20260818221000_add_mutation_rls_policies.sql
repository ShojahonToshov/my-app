-- Businesses policies
create policy "Owners can insert their businesses" on public.businesses for insert with check (auth.uid() = owner_id);
create policy "Owners can update their businesses" on public.businesses for update using (auth.uid() = owner_id);
create policy "Owners can delete their businesses" on public.businesses for delete using (auth.uid() = owner_id);

-- Services policies
create policy "Owners can insert services for their businesses" on public.services for insert with check (
  business_id in (select id from public.businesses where owner_id = auth.uid())
);
create policy "Owners can update services for their businesses" on public.services for update using (
  business_id in (select id from public.businesses where owner_id = auth.uid())
);
create policy "Owners can delete services for their businesses" on public.services for delete using (
  business_id in (select id from public.businesses where owner_id = auth.uid())
);

-- Bookings policies
-- Ensure owners can also view bookings for their business
create policy "Owners can view bookings for their businesses" on public.bookings for select using (
  business_id in (select id from public.businesses where owner_id = auth.uid())
);

create policy "Clients can insert their own bookings" on public.bookings for insert with check (auth.uid() = client_id);
create policy "Clients can update their own bookings" on public.bookings for update using (auth.uid() = client_id);
create policy "Clients can delete their own bookings" on public.bookings for delete using (auth.uid() = client_id);

-- Allow owners to update bookings for their businesses (e.g., change status)
create policy "Owners can update bookings for their businesses" on public.bookings for update using (
  business_id in (select id from public.businesses where owner_id = auth.uid())
);
