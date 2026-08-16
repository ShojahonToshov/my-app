import RoleGuard from '@/components/RoleGuard';
import AccountSettings from '@/features/market-pages/AccountSettings';

export default function Page() {
  return (
    <RoleGuard allowedRoles={['customer']} requireAuth={true}>
      <AccountSettings />
    </RoleGuard>
  );
}
