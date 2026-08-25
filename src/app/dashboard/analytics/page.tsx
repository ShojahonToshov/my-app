import Analytics from '@/components/dashboard-pages/Analytics';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { BookingService } from "@/services/BookingService";
import { createClient } from '@/utils/supabase/server';

export default async function Page() {
  const queryClient = new QueryClient();
  const supabase = await createClient();

  await queryClient.prefetchQuery({
    queryKey: ['analyticsData'],
    queryFn: async () => {
      const bookingService = new BookingService(supabase);
      const bookings = await bookingService.getBookings().catch(() => []);
      const { data: servicesData } = await supabase.from('services').select('id, name, price');
      return { bookings, services: servicesData || [] };
    }
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Analytics />
    </HydrationBoundary>
  );
}
