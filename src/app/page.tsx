import Landing from '@/components/Landing';
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Landing />
    </Suspense>
  );
}
