import { Suspense } from 'react';
import LiveTicket from '@/components/LiveTicket';

export default function Page() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <LiveTicket />
    </Suspense>
  );
}
