import AdminLayout from '@/features/business-pages/AdminLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
          <AdminLayout>{children}</AdminLayout>

  );
}
