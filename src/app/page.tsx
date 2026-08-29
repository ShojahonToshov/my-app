import { useI18nStore } from "@/stores/i18nStore";
import Landing from '@/components/Landing';
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<div>{useI18nStore.getState().t("extra.t331")}</div>}>
      <Landing />
    </Suspense>
  );
}
