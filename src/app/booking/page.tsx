import { Suspense } from 'react';
import CustomerBooking from '@/components/CustomerBooking';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function Page(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const searchParams = await props.searchParams;
    const id = searchParams?.id as string | undefined;
    const redirectUrl = id ? `/booking?id=${id}` : '/booking';
    redirect(`/signup?redirect=${encodeURIComponent(redirectUrl)}`);
  }

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CustomerBooking />
    </Suspense>
  );
}

