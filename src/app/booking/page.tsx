import { Suspense } from 'react';
import ClientBooking from '@/components/ClientBooking';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ClientBooking />
    </Suspense>
  );
}

