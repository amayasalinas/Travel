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

        try {
            const res = await fetch('/api/admin/recover', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();

            if (data.success) {
                setMessage('✅ Código enviado. Revisa tu correo (Bandeja de entrada o Spam).');
                setStep(2);
            } else {
                setMessage('❌ ' + data.error);
            }
        } catch (err) {
            setMessage('❌ Error de conexión.');
        }
        setLoading(false);
    };

    const handleVerifyAndSet = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            // 1. Verify OTP & Set Password on Server
            const res = await fetch('/api/admin/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, password })
            });
            const data = await res.json();

            if (data.success) {
                setMessage('✅ Contraseña guardada. Iniciando sesión...');

                // 2. Auto-login client-side with new password
                const { error: loginError } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });

                if (loginError) {
                    setMessage('⚠️ Contraseña cambiada, pero error al entrar: ' + loginError.message);
                    setTimeout(() => router.push('/admin/login'), 2000);
                } else {
                    setTimeout(() => router.push('/admin'), 1000);
                }
            } else {
                setMessage('❌ ' + data.error);
            }
        } catch (err) {
            setMessage('❌ Error de conexión.');
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
