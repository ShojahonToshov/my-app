import { NextResponse } from 'next/server';
import { getOtpCache } from '@/utils/otpCache';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, phone, password, role } = body;

    if (!phone || !password || !firstName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // TODO: Здесь в идеале нужно сделать запрос к Supabase (через Admin API)
    // чтобы проверить, не занят ли уже этот номер телефона.
    // Пример: const { data } = await supabaseAdmin.auth.admin.listUsers();
    // (Упрощено для текущей реализации Mock SMS)

    // Генерируем 6-значный код
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Сохраняем в кэш на 5 минут
    const cacheMap = getOtpCache();
    cacheMap[phone] = {
      code,
      data: { firstName, lastName, phone, password, role },
      expiresAt: Date.now() + 5 * 60 * 1000,
      attempts: 0
    };

    // MOCK SMS PROVIDER - Вывод в консоль сервера!
    console.log('\n=============================================');
    console.log(`[MOCK SMS PROVIDER]`);
    console.log(`Recipient: ${phone}`);
    console.log(`Code: ${code}`);
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
