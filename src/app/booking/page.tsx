import RoleGuard from '@/components/RoleGuard';
import ClientBooking from '@/features/market-pages/ClientBooking';

export default function Page() {
  return (
    <RoleGuard allowedRoles={['customer']} requireAuth={true}>
      <ClientBooking />
    </RoleGuard>
  );
}

