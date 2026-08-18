import Signup from '@/components/Signup';
import { Suspense } from 'react';

export default function Page() {
  return (
          <Suspense fallback={<div>Loading...</div>}>
        <Signup />
      </Suspense>

  );
}
