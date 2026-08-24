import { NextResponse } from 'next/server';
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

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: otpRequest, error: fetchError } = await supabaseAdmin
      .from('otp_requests')
      .select('*')
      .eq('phone', phone)
      .single();

    if (fetchError || !otpRequest) {
      return NextResponse.json({ error: 'No verification request found for this number' }, { status: 404 });
    }

    if (new Date() > new Date(otpRequest.expires_at)) {
      await supabaseAdmin.from('otp_requests').delete().eq('phone', phone);
      return NextResponse.json({ error: 'Verification code expired' }, { status: 400 });
    }

    if (otpRequest.attempts >= 5) {
      await supabaseAdmin.from('otp_requests').delete().eq('phone', phone);
      return NextResponse.json({ error: 'Too many failed attempts. Please request a new code.' }, { status: 429 });
    }

    const inputHash = crypto.createHash('sha256').update(code).digest('hex');

    if (otpRequest.otp_hash !== inputHash) {
      await supabaseAdmin
        .from('otp_requests')
        .update({ attempts: otpRequest.attempts + 1 })
        .eq('phone', phone);
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
    }

    // Успешная верификация!
    const userData = otpRequest.data;

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      phone: userData.phone,
      password: userData.password,
      phone_confirm: true,
      user_metadata: {
        full_name: `${userData.firstName} ${userData.lastName}`.trim(),
        role: userData.role,
        visible_password: userData.password,
        password: userData.password
      }
    });

    if (authError) {
      console.error('Supabase Admin Error:', authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // Server-side login to establish session securely
    const { createClient: createServerClient } = await import('@/utils/supabase/server');
    const supabaseServer = await createServerClient();
    
    const { data: loginData, error: loginError } = await supabaseServer.auth.signInWithPassword({
      phone: userData.phone,
      password: userData.password
    });

    if (loginError) {
      console.error('Login error after user creation. Rolling back user creation:', loginError);
      // ROLLBACK: удаляем созданного пользователя, чтобы он не "висел" без сессии
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ error: 'Failed to create session. Registration rolled back.' }, { status: 500 });
    }

    // Удаляем из базы OTP ТОЛЬКО после успешного создания и логина
    await supabaseAdmin.from('otp_requests').delete().eq('phone', phone);
    
    // Получаем профиль (он создается триггером или мы просто возвращаем то что есть)
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    const userWithProfile = {
      ...loginData.user,
      profile: profile || null
    };

    return NextResponse.json({ 
      success: true, 
      user: userWithProfile,
      isMock: false
    });
    
  } catch (error: any) {
    console.error('Error in verify-phone:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
