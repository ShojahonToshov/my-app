import { useI18nStore } from "@/stores/i18nStore";
import OnboardingWizard from '@/components/Onboarding/OnboardingWizard';
import { Suspense } from 'react';

export default function OnboardingPage() {
  return (
          <Suspense fallback={<div>{useI18nStore.getState().t("extra.t331")}</div>}>
        <OnboardingWizard />
      </Suspense>

  );
}
