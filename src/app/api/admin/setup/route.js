import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

// Whitelist of allowed admin emails
const ALLOWED_ADMINS = ['amaya_salinas@hotmail.com', 'admin@assitour.com'];

export async function POST(request) {
    try {
        const { email } = await request.json();

        if (!email || !ALLOWED_ADMINS.includes(email.toLowerCase())) {
            return NextResponse.json({ success: false, error: 'Este correo no está autorizado como administrador.' }, { status: 403 });
        }

        const supabase = createServiceClient();

        // Check if user exists
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        let result;
        const redirectUrl = process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/admin/update-password` : 'http://localhost:3000/admin/update-password';

        if (user) {
            // User exists, send password reset
            const { error } = await supabase.auth.admin.generateLink({
                type: 'recovery',
                email: email,
                options: {
                    redirectTo: redirectUrl
                }
            });
            // Note: Since we are using our own SMTP in production usually, 
            // but generateLink returns the link. 
            // Ideally we would use supabase.auth.resetPasswordForEmail if SMTP is set up in Supabase.
            // If SMTP is NOT set up in Supabase, we need to send the link manually via our nodemailer.

            // Let's try sending standard recovery email first (assuming Supabase handles it or we use the link)
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: redirectUrl,
            });

            if (resetError) throw resetError;
            result = 'reset';
        } else {
            // User doesn't exist, invite them
            const { error } = await supabase.auth.admin.inviteUserByEmail(email, {
                redirectTo: redirectUrl
            });

            if (error) throw error;
            result = 'invite';
        }

        return NextResponse.json({ success: true, type: result });

    } catch (error) {
        console.error('Admin setup error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Error interno del servidor' }, { status: 500 });
    }
}
