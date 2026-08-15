import RoleGuard from '@/components/RoleGuard';
import Landing from '@/features/market-pages/Landing';

export default function Page() {
  return (
    <RoleGuard allowedRoles={['customer', 'guest']} requireAuth={false}>
      <Landing />
    </RoleGuard>
  );
}

