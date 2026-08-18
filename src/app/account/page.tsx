import ClientAccount from '@/features/market-pages/ClientAccount';
import { Suspense } from 'react';

export default function Page() {
  return (
        <Suspense fallback={<div>Loading...</div>}>
      <ClientAccount />
    </Suspense>

  );
}