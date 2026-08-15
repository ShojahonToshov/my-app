import RoleGuard from '@/components/RoleGuard';
import Search from '@/features/market-pages/Search';

export default function Page() {
  return (
    <RoleGuard allowedRoles={['customer', 'guest']} requireAuth={false}>
      <Search />
    </RoleGuard>
  );
}

