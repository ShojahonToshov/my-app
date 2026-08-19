import Customers from '@/components/admin-pages/Customers';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { CustomerService } from "@/services/CustomerService";
import { createClient } from '@/utils/supabase/server';
import { queryKeys } from '@/lib/queryKeys';
import { INITIAL_CLIENTS } from '@/constants/clients';

export default async function Page() {
  const queryClient = new QueryClient();
  const supabase = await createClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.clients.all,
    queryFn: async () => {
      const customerService = new CustomerService(supabase);
      const res = await customerService.getCustomers();
      return res && res.length > 0 ? res : INITIAL_CLIENTS;
    }
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Customers />
    </HydrationBoundary>
  );
}
