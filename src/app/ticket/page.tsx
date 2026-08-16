import RoleGuard from '@/components/RoleGuard';
import LiveTicket from '@/features/market-pages/LiveTicket';

export default function Page() {
  return (
    <RoleGuard allowedRoles={['customer', 'guest']} requireAuth={false}>
      <LiveTicket />
    </RoleGuard>
  );
}
