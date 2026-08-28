import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
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
        error: 'ERROR: SUPABASE_SERVICE_ROLE_KEY not found in .env.local!' 
      }, { status: 500 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash the code
    const otpHash = crypto.createHash('sha256').update(code).digest('hex');
    
    // Expiration: 5 minutes from now
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    const { error: upsertError } = await supabaseAdmin
      .from('otp_requests')
      .upsert({
        phone,
        otp_hash: otpHash,
        data: { firstName, lastName, phone, password, role },
        expires_at: expiresAt,
        attempts: 0
      }, { onConflict: 'phone' });

    if (upsertError) {
      console.error('Error saving OTP request:', upsertError);
      return NextResponse.json({ error: 'Failed to save verification request' }, { status: 500 });
    }

    // DEMO AUTH - Output to server console!
    console.log('\n=============================================');
    console.log(`[DEMO AUTH]`);
    console.log(`Phone: ${phone}`);
    console.log(`OTP: ${code}`);
    console.log(`Expires: 5 minutes`);
    console.log('=============================================\n');

    return NextResponse.json({ 
      success: true, 
      message: 'Verification code generated',
      code
    });
    
  } catch (error: unknown) {
    console.error('Error in register-request:', error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
