import Customers from '@/components/dashboard-pages/Customers';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { CustomerService } from "@/services/CustomerService";
import { createClient } from '@/utils/supabase/server';
import { queryKeys } from '@/lib/queryKeys';


export default async function Page() {
  const queryClient = new QueryClient();
  const supabase = await createClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.customers.all,
    queryFn: async () => {
      const customerService = new CustomerService(supabase);
      const res = await customerService.getCustomers();
      return res || [];
    }
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Customers />
    </HydrationBoundary>
  );
}
