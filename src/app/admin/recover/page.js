'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminRecover() {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP + Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleSendCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        // Whitelist check (client-side for UX, server enforces it too via RLS or logic)
        const allowed = ['amaya_salinas@hotmail.com', 'admin@assitour.com'];
        if (!allowed.includes(email.toLowerCase())) {
            setMessage('❌ Este correo no está autorizado.');
            setLoading(false);
            return;
        }

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                shouldCreateUser: false, // User must exist (invited via API or manual)
            }
        });

        if (error) {
            // If user doesn't exist, we might need to invite them first via API
            if (error.message.includes('Signups not allowed') || error.message.includes('User not found')) {
                // Try to trigger the invite API
                try {
                    const res = await fetch('/api/admin/setup', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email })
                    });
                    const data = await res.json();
                    if (data.success) {
                        setMessage('✅ Te hemos enviado un enlace/código al correo.');
                        // Because inviteUser sends a link, not OTP usually, providing OTP flow here is tricky 
                        // unless we use the numeric OTP option in Supabase settings.
                        // IMPORTANT: Default Supabase Email Provider sends a LINK (Magic Link).
                        // To use OTP, we need to extract it or use the link.

                        // If the user wants to enter a code, we rely on Supabase sending a code.
                        setStep(2);
                    } else {
                        setMessage('❌ ' + data.error);
                    }
                } catch (err) {
                    setMessage('❌ Error intentando registrar.');
                }
            } else {
                setMessage('❌ Error: ' + error.message);
            }
        } else {
            setMessage('✅ Código enviado. Revisa tu correo.');
            setStep(2);
        }
        setLoading(false);
    };

    const handleVerifyAndSet = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        // 1. Verify OTP (Login)
        const { data: { session }, error: verifyError } = await supabase.auth.verifyOtp({
            email,
            token: otp,
            type: 'email',
        });

        if (verifyError) {
            setMessage('❌ Código inválido o expirado.');
            setLoading(false);
            return;
        }

        if (!session) {
            setMessage('❌ No se pudo iniciar sesión.');
            setLoading(false);
            return;
        }

        // 2. Update Password
        const { error: updateError } = await supabase.auth.updateUser({
            password: password
        });

        if (updateError) {
            setMessage('❌ Error guardando contraseña: ' + updateError.message);
        } else {
            setMessage('✅ Contraseña establecida. Entrando...');
            setTimeout(() => {
                router.push('/admin');
            }, 1500);
        }
        setLoading(false);
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-light)' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <span className="material-icons-round" style={{ fontSize: '48px', color: 'var(--primary)' }}>vpn_key</span>
                    <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--secondary)' }}>
                        {step === 1 ? 'Recuperar Acceso' : 'Establecer Contraseña'}
                    </h1>
                </div>

                {step === 1 ? (
                    <form onSubmit={handleSendCode} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label className="form-label">Correo Electrónico</label>
                            <input
                                type="email"
                                className="form-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@email.com"
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                            {loading ? 'Enviando...' : 'Enviar Código'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyAndSet} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div className="alert alert-success" style={{ fontSize: 13 }}>
                            Código enviado a <strong>{email}</strong>
                        </div>
                        <div>
                            <label className="form-label">Código de Verificación (OTP)</label>
                            <input
                                type="text"
                                className="form-input"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Ej: 123456"
                                required
                            />
                        </div>
                        <div>
                            <label className="form-label">Nueva Contraseña</label>
                            <input
                                type="password"
                                className="form-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                            {loading ? 'Guardando...' : 'Guardar y Entrar'}
                        </button>
                        <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            onClick={() => setStep(1)}
                            style={{ marginTop: 8 }}
                        >
                            Volver
                        </button>
                    </form>
                )}

                {message && (
                    <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-warning'}`} style={{ marginTop: '16px', fontSize: '13px' }}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}
