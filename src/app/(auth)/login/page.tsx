import RoleGuard from '@/components/RoleGuard';
import Login from '@/features/market-pages/Login';

export default function Page() {
  return (
    <RoleGuard allowedRoles={['guest']} requireAuth={false}>
      <Login />
    </RoleGuard>
  );
}
