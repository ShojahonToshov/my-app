"use client";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useAuthStore from '@/features/market-pages/stores/authStore';

export default function RoleGuard({ 
  children, 
  allowedRoles,
  requireAuth = true
}: { 
  children: React.ReactNode;
  allowedRoles: ('customer' | 'business' | 'guest')[];
  requireAuth?: boolean;
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
      if (requireAuth) {
        router.replace('/login');
      } else {
        // Guests are allowed if requireAuth is false and 'guest' is in allowedRoles
        if (allowedRoles.includes('guest')) {
          setIsAuthorized(true);
        } else {
          router.replace('/login');
        }
      }
      return;
    }

    const userRole = (user.profile?.role as 'customer' | 'business') || 'customer';

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
  }, [mounted, isAuthenticated, user, router, allowedRoles, requireAuth, pathname]);

  if (!mounted || !isAuthorized) {
    // Show nothing or a loader while deciding
    if (requireAuth) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#ECECEA]">
          <div className="w-8 h-8 border-4 border-[#8A2532] border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }
    return null;
  }

  return <>{children}</>;
}
