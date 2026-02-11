import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'amaya_salinas@hotmail.com';

export async function POST(request) {
    const body = await request.json();
    const { action, email, token } = body;
    const supabase = createServiceClient();

    switch (action) {
        case 'register': {
            // Sign up with Supabase Auth (auto-confirm, OTP at login verifies email)
            const { data, error } = await supabase.auth.admin.createUser({
                email,
                email_confirm: true,
            });
            if (error) {
                if (error.message?.includes('already')) {
                    return NextResponse.json({ success: false, error: 'Este correo ya está registrado. Intenta iniciar sesión.' });
                }
                return NextResponse.json({ success: false, error: error.message });
            }
            return NextResponse.json({ success: true });
        }

        case 'login': {
            // Send OTP to email
            const { data, error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    shouldCreateUser: false,
                }
            });
            if (error) {
                return NextResponse.json({ success: false, error: 'No se encontró una cuenta con este correo. ¿Ya te registraste?' });
            }
            return NextResponse.json({ success: true });
        }

        case 'verify-otp': {
            // Verify OTP token
            const { data, error } = await supabase.auth.verifyOtp({
                email,
                token,
                type: 'email',
            });
            if (error) {
                return NextResponse.json({ success: false, error: 'Código inválido o expirado.' });
            }
            const isAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
            return NextResponse.json({ success: true, isAdmin, session: data.session });
        }

        case 'check-admin': {
            // For admin panel access check
            // In a production app, this would verify a session token
            // For now, we check if the admin has activities loaded
            const { count } = await supabase.from('actividades').select('*', { count: 'exact', head: true });
            return NextResponse.json({
                isAdmin: true, // Will be properly secured with session management
                recordCount: count || 0
            });
        }

        default:
            return NextResponse.json({ success: false, error: 'Acción no válida' }, { status: 400 });
    }
}
