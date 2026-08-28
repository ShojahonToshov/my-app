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
        error: 'ERROR: SUPABASE_SERVICE_ROLE_KEY not found in .env.local! For real registration, add this key from Supabase settings and RESTART the server (npm run dev).' 
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

    // Successful verification!
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
      // ROLLBACK: delete created user so they don't get stuck without a session
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ error: 'Failed to create session. Registration rolled back.' }, { status: 500 });
    }

    // Delete OTP from database ONLY after successful creation and login
    await supabaseAdmin.from('otp_requests').delete().eq('phone', phone);
    
    // Fetch profile (created by a trigger or we just return what exists)
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
