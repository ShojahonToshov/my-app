import Customers from '@/features/business-pages/admin-pages/Customers';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import CustomerService from '@/features/business-pages/api/services/CustomerService';
import { createClient } from '@/utils/supabase/server';
import { queryKeys } from '@/features/business-pages/lib/queryKeys';
import { INITIAL_CLIENTS } from '@/features/business-pages/constants/clients';

export default async function Page() {
  const queryClient = new QueryClient();
  const supabase = await createClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.clients.all,
    queryFn: async () => {
      const res = await CustomerService.getCustomers(supabase);
      return res && res.length > 0 ? res : INITIAL_CLIENTS;
    }
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Customers />
    </HydrationBoundary>
  );
}
