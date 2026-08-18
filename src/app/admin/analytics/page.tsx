import Analytics from '@/features/business-pages/admin-pages/Analytics';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import BookingService from '@/features/business-pages/api/services/BookingService';
import { createClient } from '@/utils/supabase/server';
import { MOCK_DATA } from '@/features/business-pages/constants/analytics';

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
