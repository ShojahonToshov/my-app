import ClientAccount from '@/components/ClientAccount';
import { Suspense } from 'react';

export default function Page() {
  return (
        <Suspense fallback={<div>Loading...</div>}>
      <ClientAccount />
    </Suspense>

  );
}