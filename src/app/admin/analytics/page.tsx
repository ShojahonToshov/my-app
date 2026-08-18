import Analytics from '@/components/admin-pages/Analytics';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import BookingService from '@/services/BookingService';
import { createClient } from '@/utils/supabase/server';
import { MOCK_DATA } from '@/constants/analytics';

export default async function Page() {
  const queryClient = new QueryClient();
  const supabase = await createClient();

  await queryClient.prefetchQuery({
    queryKey: ['analytics', 'Today'],
    queryFn: async () => {
      await BookingService.getBookings(supabase).catch(() => {});
      return MOCK_DATA['Today'];
    }
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Analytics />
    </HydrationBoundary>
  );
}
