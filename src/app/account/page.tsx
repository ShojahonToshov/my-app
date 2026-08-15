import ClientAccount from '@/features/market-pages/ClientAccount';
import { Suspense } from 'react';
import RoleGuard from '@/components/RoleGuard';

export default function Page() {
  return (
    <RoleGuard allowedRoles={['customer']} requireAuth={true}>
    <Suspense fallback={<div>Loading...</div>}>
      <ClientAccount />
    </Suspense>
  
    </RoleGuard>
  );
}