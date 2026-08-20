import { NextResponse } from 'next/server';
import { getOtpCache, saveOtpCache } from '@/utils/otpCache';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, phone, password, role } = body;

    if (!phone || !password || !firstName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ 
        error: 'ОШИБКА: SUPABASE_SERVICE_ROLE_KEY не найден в .env.local!' 
      }, { status: 500 });
    }

    // Генерируем 6-значный код
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash the code
    const otpHash = crypto.createHash('sha256').update(code).digest('hex');
    
    // Expiration: 5 minutes from now
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    const cache = getOtpCache();
    cache[phone] = {
      otpHash,
      data: { firstName, lastName, phone, password, role },
      expiresAt,
      attempts: 0
    };
    saveOtpCache(cache);

    // DEMO AUTH - Вывод в консоль сервера!
    console.log('\n=============================================');
    console.log(`[DEMO AUTH]`);
    console.log(`Phone: ${phone}`);
    console.log(`OTP: ${code}`);
    console.log(`Expires: 5 minutes`);
    console.log('=============================================\n');

    return NextResponse.json({ 
      success: true, 
      message: 'Verification code generated' 
    });
    
  } catch (error: any) {
    console.error('Error in register-request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
