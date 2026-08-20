import { NextResponse } from 'next/server';
import { getOtpCache } from '@/utils/otpCache';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, code } = body;

    if (!phone || !code) {
      return NextResponse.json({ error: 'Phone and code are required' }, { status: 400 });
    }

    const cacheMap = getOtpCache();
    const cache = cacheMap[phone];

    if (!cache) {
      return NextResponse.json({ error: 'No verification request found for this number' }, { status: 404 });
    }

    if (Date.now() > cache.expiresAt) {
      delete cacheMap[phone];
      return NextResponse.json({ error: 'Verification code expired' }, { status: 400 });
    }

    if (cache.attempts >= 5) {
      delete cacheMap[phone];
      return NextResponse.json({ error: 'Too many failed attempts. Please request a new code.' }, { status: 429 });
    }

    if (cache.code !== code) {
      cache.attempts += 1;
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
    }

    // Успешная верификация!
    const userData = cache.data;
    
    // Проверка ключа
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ 
        error: 'ОШИБКА: SUPABASE_SERVICE_ROLE_KEY не найден в .env.local! Чтобы регистрация была реальной, добавь этот ключ из настроек Supabase и обязательно ПЕРЕЗАПУСТИ сервер (npm run dev).' 
      }, { status: 500 });
    }

    // Создаем пользователя через Supabase Admin API
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const proxyEmail = `phone${userData.phone.replace(/\D/g, '')}@elara-app.com`;

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      phone: userData.phone,
      email: proxyEmail, // Устанавливаем скрытый email для обхода блокировки логина
      password: userData.password,
      phone_confirm: true,
      email_confirm: true,
      user_metadata: {
        full_name: `${userData.firstName} ${userData.lastName}`.trim(),
        role: userData.role
      }
    });

    if (authError) {
      console.error('Supabase Admin Error:', authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // Удаляем из кэша, так как код использован
    delete cacheMap[phone];

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
