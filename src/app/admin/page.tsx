import Dashboard from '@/features/business-pages/admin-pages/Dashboard';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import BookingService from '@/features/business-pages/api/services/BookingService';
import { createClient } from '@/utils/supabase/server';
import { queryKeys } from '@/features/business-pages/lib/queryKeys';
import { ApiBookingDTO, TicketDTO } from '@/features/business-pages/types';

export default async function Page() {
  const queryClient = new QueryClient();
  const supabase = await createClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.bookings.all,
    queryFn: async () => {
      const res = await BookingService.getBookings(supabase);
      if (!res || res.length === 0) return [];
      
      const mapped = res.map((item: ApiBookingDTO, index: number): TicketDTO => ({
        id: item.id,
        time: item.time || "10:00",
        service: item.serviceName || "Service",
        name: item.clientName || "Guest",
        status: item.status === "upcoming" ? "waiting" : item.status === "in_progress" ? "in_progress" : "completed",
        master: item.masterName || ("Master " + (index % 5 + 1)),
        isDelayed: item.status === "upcoming" && index % 3 === 0 
      }));
      
      return mapped.sort((a: TicketDTO, b: TicketDTO) => a.time.localeCompare(b.time));
    }
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Dashboard />
    </HydrationBoundary>
  );
}
