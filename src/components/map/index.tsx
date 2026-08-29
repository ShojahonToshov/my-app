import { useI18nStore } from "@/stores/i18nStore";
import dynamic from 'next/dynamic';

export const DynamicMap = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#F5F5F4] animate-pulse rounded-2xl border border-[#DCDCDA] flex items-center justify-center text-gray-400">{useI18nStore.getState().t("extra.t204")}</div>
});
