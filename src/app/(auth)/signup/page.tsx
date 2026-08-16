import RoleGuard from '@/components/RoleGuard';
import Signup from '@/features/market-pages/Signup';
import { Suspense } from 'react';

export default function Page() {
  return (
    <RoleGuard allowedRoles={['guest']} requireAuth={false}>
      <Suspense fallback={<div>Loading...</div>}>
        <Signup />
      </Suspense>
    </RoleGuard>
  );
}
