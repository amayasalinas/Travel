import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const ALLOWED_ADMINS = ['amaya_salinas@hotmail.com', 'admin@assitour.com'];

export async function POST(request) {
    try {
        const { email } = await request.json();

        if (!email || !ALLOWED_ADMINS.includes(email.toLowerCase())) {
            return NextResponse.json({ success: false, error: 'Correo no autorizado.' }, { status: 403 });
        }

        const supabase = createServiceClient();

        // 1. Get user by email
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
        if (listError) throw listError;

        let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        // Use inviteUserByEmail if user doesn't exist? 
        // If user doesn't exist, we can't set metadata easily without creating them.
        // For this flow, let's assume valid admins are invited/created. 
        // Or we create them with a dummy password and then send OTP to set real one.

        if (!user) {
            // Create user implicitly if whitelist allows
            const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
                email: email,
                email_confirm: true, // Auto confirm
                password: crypto.randomBytes(16).toString('hex') // Random temp password
            });
            if (createError) throw createError;
            user = newUser.user;
        }

        // 2. Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
        const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

        // 3. Store in app_metadata (secure)
        const { error: updateError } = await supabase.auth.admin.updateUserById(
            user.id,
            { app_metadata: { ...user.app_metadata, otp_hash: otpHash, otp_expires: expiresAt } }
        );

        if (updateError) throw updateError;

        // 4. Send Email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: `"Assitour Admin" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: `🔑 Tu Código de Acceso: ${otp}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; color: #333;">
                    <h2>Código de Verificación</h2>
                    <p>Usa el siguiente código para establecer tu contraseña de administrador:</p>
                    <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold; margin: 20px 0;">
                        ${otp}
                    </div>
                    <p>Este código expira en 10 minutos.</p>
                </div>
            `,
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Recover error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
