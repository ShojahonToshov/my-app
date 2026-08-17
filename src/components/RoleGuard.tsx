"use client";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useAuthStore from '@/features/market-pages/stores/authStore';

type Role = 'customer' | 'business' | 'guest';

interface RoleGuardProps {
  children: React.ReactNode;
  /** Список ролей, которым разрешён доступ к этой странице */
  allowedRoles: Role[];
  /**
   * true  — страница требует авторизации (гостей на /login)
   * false — страница публичная, но авторизованных редиректим на их "дом"
   */
  requireAuth?: boolean;
}

/** Домашняя страница каждой роли после авторизации */
const HOME_ROUTES: Record<string, string> = {
  customer: '/search',
  business: '/admin',
};

export default function RoleGuard({
  children,
  allowedRoles,
  requireAuth = true,
}: RoleGuardProps) {
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
      if (allowedRoles.includes('guest')) {
        setIsAuthorized(true);
      } else {
        setTimeout(() => router.replace('/login'), 0);
      }
      return;
    }

    const rawRole = user.profile?.role as string;
    const userRole: Role = (rawRole === 'business' || rawRole === 'customer') ? rawRole : 'customer';
    const onboardingStep = (user.profile?.onboarding_step as number) || 0;
    const isUnonboardedBusiness = userRole === 'business' && onboardingStep < 3;
    
    let homeRoute = HOME_ROUTES[userRole] || '/search';
    if (isUnonboardedBusiness) {
      homeRoute = '/onboarding';
    }

    // Force redirect un-onboarded businesses to /onboarding
    if (isUnonboardedBusiness && !pathname.startsWith('/onboarding')) {
      setTimeout(() => router.replace('/onboarding'), 0);
      return;
    }

    // If allowedRoles includes their role, authorize them
    if (allowedRoles.includes(userRole)) {
      setIsAuthorized(true);
      return;
    }

    // Special case: if they are authenticated, but the page is guest-only (like /login), redirect to home
    if (allowedRoles.includes('guest')) {
      setTimeout(() => router.replace(homeRoute), 0);
      return;
    }

    // Default unauthorized redirect
    setTimeout(() => router.replace(homeRoute), 0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, isAuthenticated, user?.profile?.role, router]); // Omit allowedRoles to prevent array-reference infinite loops

  if (!mounted || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#ECECEA]">
        <div className="w-8 h-8 border-4 border-[#8A2532] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
