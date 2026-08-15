import AdminLayout from '@/features/business-pages/AdminLayout';
import RoleGuard from '@/components/RoleGuard';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}

