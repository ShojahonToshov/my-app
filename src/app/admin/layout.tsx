import RoleGuard from '@/components/RoleGuard';
import AdminLayout from '@/features/business-pages/AdminLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['business']} requireAuth={true}>
      <AdminLayout>{children}</AdminLayout>
    </RoleGuard>
  );
}
