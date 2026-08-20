import Dashboard from '@/components/dashboard-pages/Dashboard';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { BookingService } from "@/services/BookingService";
import { createClient } from '@/utils/supabase/server';
import { queryKeys } from '@/lib/queryKeys';
import { ApiBookingDTO, TicketDTO } from '@/types';

export default async function Page() {
  const queryClient = new QueryClient();
  const supabase = await createClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.bookings.all,
    queryFn: async () => {
      const bookingService = new BookingService(supabase);
      const res = await bookingService.getBookings();
      if (!res || res.length === 0) return [];
      
      const mapped = res.map((item: any, index: number): TicketDTO => ({
        id: item.id,
        time: item.time || "10:00",
        service: item.service_name || item.serviceName || item.service_id || "Service",
        name: item.guest_name || item.customerName || "Guest",
        status: item.status === "upcoming" ? "waiting" : item.status === "in_progress" ? "in_progress" : "completed",
        staff: item.staffName || ("Staff " + (index % 5 + 1)),
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
