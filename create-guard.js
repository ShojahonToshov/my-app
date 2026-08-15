const fs = require('fs');

const roleGuardCode = `"use client";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useAuthStore from '@/features/market-pages/stores/authStore';

export default function RoleGuard({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode;
  allowedRoles: ('customer' | 'business')[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!isAuthenticated || !user) {
      router.replace('/login');
      return;
    }

    const userRole = user.profile?.role || 'customer';

    if (!allowedRoles.includes(userRole)) {
      // Redirect to appropriate home based on role
      if (userRole === 'business') {
        router.replace('/admin');
      } else {
        router.replace('/search');
      }
    } else {
      setIsAuthorized(true);
    }
  }, [mounted, isAuthenticated, user, router, allowedRoles, pathname]);

  if (!mounted || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#ECECEA]">
        <div className="w-8 h-8 border-4 border-[#8A2532] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}
`;

fs.writeFileSync('src/components/RoleGuard.tsx', roleGuardCode);
