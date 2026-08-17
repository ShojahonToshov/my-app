import RoleGuard from '@/components/RoleGuard';
import OnboardingWizard from '@/features/business-pages/Onboarding/OnboardingWizard';
import { Suspense } from 'react';

export default function OnboardingPage() {
  return (
    <RoleGuard allowedRoles={['business']} requireAuth={true}>
      <Suspense fallback={<div>Loading...</div>}>
        <OnboardingWizard />
      </Suspense>
    </RoleGuard>
  );
}
