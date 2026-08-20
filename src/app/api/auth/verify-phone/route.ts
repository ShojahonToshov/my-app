import { NextResponse } from 'next/server';
import { getOtpCache, saveOtpCache } from '@/utils/otpCache';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, code } = body;

    if (!phone || !code) {
      return NextResponse.json({ error: 'Phone and code are required' }, { status: 400 });
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ 
        error: 'ОШИБКА: SUPABASE_SERVICE_ROLE_KEY не найден в .env.local! Чтобы регистрация была реальной, добавь этот ключ из настроек Supabase и обязательно ПЕРЕЗАПУСТИ сервер (npm run dev).' 
      }, { status: 500 });
    }

    const cache = getOtpCache();
    const otpRequest = cache[phone];

    if (!otpRequest) {
      return NextResponse.json({ error: 'No verification request found for this number' }, { status: 404 });
    }

    if (new Date() > new Date(otpRequest.expiresAt)) {
      delete cache[phone];
      saveOtpCache(cache);
      return NextResponse.json({ error: 'Verification code expired' }, { status: 400 });
    }

    if (otpRequest.attempts >= 5) {
      delete cache[phone];
      saveOtpCache(cache);
      return NextResponse.json({ error: 'Too many failed attempts. Please request a new code.' }, { status: 429 });
    }

    const inputHash = crypto.createHash('sha256').update(code).digest('hex');

    if (otpRequest.otpHash !== inputHash) {
      otpRequest.attempts += 1;
      saveOtpCache(cache);
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
    }

    // Успешная верификация!
    const userData = otpRequest.data;

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      phone: userData.phone,
      password: userData.password,
      phone_confirm: true,
      user_metadata: {
        full_name: `${userData.firstName} ${userData.lastName}`.trim(),
        role: userData.role
      }
    });

    if (authError) {
      console.error('Supabase Admin Error:', authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // Удаляем из базы, так как код использован
    delete cache[phone];
    saveOtpCache(cache);

    return NextResponse.json({ 
      success: true, 
      user: authData.user,
      isMock: false
    });
    
  } catch (error: any) {
    console.error('Error in verify-phone:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
