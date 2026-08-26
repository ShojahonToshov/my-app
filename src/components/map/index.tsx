import dynamic from 'next/dynamic';

export const DynamicMap = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#F5F5F4] animate-pulse rounded-2xl border border-[#DCDCDA] flex items-center justify-center text-gray-400">Loading map...</div>
});
