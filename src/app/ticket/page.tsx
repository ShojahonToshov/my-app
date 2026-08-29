import { useI18nStore } from "@/stores/i18nStore";
import { Suspense } from 'react';
import LiveTicket from '@/components/LiveTicket';

export default function Page() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">{useI18nStore.getState().t("extra.t331")}</div>}>
      <LiveTicket />
    </Suspense>
  );
}
