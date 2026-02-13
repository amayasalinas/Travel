import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import crypto from 'crypto';

export async function POST(request) {
    try {
        const { email, otp, password } = await request.json();

        if (!email || !otp || !password) {
            return NextResponse.json({ success: false, error: 'Faltan datos.' }, { status: 400 });
        }

        const supabase = createServiceClient();

        // 1. Get user
        const { data: { users } } = await supabase.auth.admin.listUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
            return NextResponse.json({ success: false, error: 'Usuario no encontrado.' }, { status: 404 });
        }

        // 2. Verify OTP
        const { otp_hash, otp_expires } = user.app_metadata || {};

        if (!otp_hash || !otp_expires) {
            return NextResponse.json({ success: false, error: 'No hay código pendiente o ha expirado.' }, { status: 400 });
        }

        if (Date.now() > otp_expires) {
            return NextResponse.json({ success: false, error: 'El código ha expirado.' }, { status: 400 });
        }

        const currentHash = crypto.createHash('sha256').update(otp).digest('hex');
        if (currentHash !== otp_hash) {
            return NextResponse.json({ success: false, error: 'Código incorrecto.' }, { status: 400 });
        }

        // 3. Update Password & Clear OTP
        const { error: updateError } = await supabase.auth.admin.updateUserById(
            user.id,
            {
                password: password,
                app_metadata: { ...user.app_metadata, otp_hash: null, otp_expires: null }
            }
        );

        if (updateError) throw updateError;

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Verify error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
