import Dashboard from '@/components/dashboard-pages/Dashboard';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { BookingService } from "@/services/BookingService";
import { createClient } from '@/utils/supabase/server';
import { queryKeys } from '@/lib/queryKeys';

export default async function Page() {
  const queryClient = new QueryClient();
  const supabase = await createClient();

  let businessId: string | null = null;
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: business } = await supabase
      .from('businesses')
      .select('id')
      .eq('owner_id', user.id)
      .maybeSingle();

    if (business) {
      businessId = business.id;
      const bookingService = new BookingService(supabase);

      await queryClient.prefetchQuery({
        queryKey: queryKeys.bookings.admin(businessId),
        queryFn: () => bookingService.getBookings(businessId!),
      });
    }
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Dashboard />
    </HydrationBoundary>
  );
}
