import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import BookingService from "@/services/BookingService";
import { MOCK_DATA } from "@/constants/analytics";


export default function useAnalytics() {
  const [period, setPeriod] = useState("Today");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['analytics', period],
    queryFn: async () => {
      // Simulate network request to bookings for realistic delay
      await BookingService.getBookings().catch(() => {});
      await new Promise(resolve => setTimeout(resolve, 800));
      return MOCK_DATA[period as keyof typeof MOCK_DATA];
    }
  });

  const handlePeriodChange = (newPeriod: string) => {
    if (newPeriod === period) return;
    setPeriod(newPeriod);
  };

  return {
    isLoading,
    isError,
    handleRefetch: refetch,
    period,
    data,
    handlePeriodChange
  };
}
