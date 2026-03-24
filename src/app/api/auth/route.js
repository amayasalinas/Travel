import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import nodemailer from 'nodemailer';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

function getMailTransporter() {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });
}

function otpEmailHtml(code) {
    return `
    <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:480px;margin:0 auto;background:#f8fafc;border-radius:16px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#1B2D45 0%,#2d4a6f 100%);padding:28px;text-align:center;">
        <h1 style="color:#f27f0d;font-size:28px;font-weight:800;margin:0;">✈ Assitour</h1>
      </div>
      <div style="padding:32px 28px;text-align:center;">
        <h2 style="font-size:22px;color:#1B2D45;margin:0 0 12px;">Tu código de acceso</h2>
        <p style="font-size:14px;color:#64748b;margin:0 0 24px;">Ingresa este código en la página de inicio de sesión:</p>
        <div style="background:#fff7ed;border:2px solid #f27f0d;border-radius:12px;padding:20px;display:inline-block;margin-bottom:24px;">
          <span style="font-size:36px;font-weight:800;letter-spacing:8px;color:#1B2D45;">${code}</span>
        </div>
        <p style="font-size:12px;color:#94a3b8;margin:0;">Este código expira en 10 minutos. Si no solicitaste este código, ignora este mensaje.</p>
      </div>
      <div style="background:#1B2D45;padding:16px;text-align:center;">
        <p style="color:#64748b;font-size:11px;margin:0;">© ${new Date().getFullYear()} Assitour. Todos los derechos reservados.</p>
      </div>
    </div>`;
}

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
            // Generate magic link to extract OTP, then send via Gmail
            try {
                const { data, error } = await supabase.auth.admin.generateLink({
                    type: 'magiclink',
                    email,
                });

                if (error) {
                    console.error('generateLink error:', error);
                    return NextResponse.json({ success: false, error: 'No se encontró una cuenta con este correo. ¿Ya te registraste?' });
                }

                const otp = data?.properties?.email_otp;
                if (!otp) {
                    console.error('No OTP in generateLink response:', data);
                    return NextResponse.json({ success: false, error: 'Error generando el código. Intenta de nuevo.' });
                }

                // Send OTP via our Gmail SMTP
                const transporter = getMailTransporter();
                await transporter.sendMail({
                    from: `"Assitour" <${process.env.GMAIL_USER}>`,
                    to: email,
                    subject: `🔐 Tu código Assitour: ${otp}`,
                    html: otpEmailHtml(otp),
                });

                return NextResponse.json({ success: true });
            } catch (err) {
                console.error('Login OTP error:', err);
                return NextResponse.json({ success: false, error: 'Error al enviar el código. Intenta de nuevo.' });
            }
        }

        case 'verify-otp': {
            // Verify OTP token
            const { data, error } = await supabase.auth.verifyOtp({
                email,
                token,
                type: 'magiclink',
            });
            if (error) {
                return NextResponse.json({ success: false, error: 'Código inválido o expirado.' });
            }
            const isAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
            return NextResponse.json({ success: true, isAdmin, session: data.session });
        }

        case 'check-admin': {
            // Verify the requesting user is an admin
            const adminEmail = body.email;
            if (!adminEmail || adminEmail.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
                return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 403 });
            }
            const { count } = await supabase.from('actividades').select('*', { count: 'exact', head: true });
            return NextResponse.json({
                isAdmin: true,
                recordCount: count || 0
            });
        }

        default:
            return NextResponse.json({ success: false, error: 'Acción no válida' }, { status: 400 });
    }
}
