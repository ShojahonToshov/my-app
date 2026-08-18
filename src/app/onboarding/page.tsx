import OnboardingWizard from '@/features/business-pages/Onboarding/OnboardingWizard';
import { Suspense } from 'react';

export default function OnboardingPage() {
  return (
          <Suspense fallback={<div>Loading...</div>}>
        <OnboardingWizard />
      </Suspense>

  );
}
