'use client';
import { startTransition, useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Footer from '@/components/Footer';

function LoginForm() {
    const searchParams = useSearchParams();
    const next = searchParams.get('next');
    const [email, setEmail] = useState('');
    const [codeSent, setCodeSent] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const sendMagicLink = async () => {
        if (!email) return;
        setLoading(true);
        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'login', email })
            });
            const data = await res.json();
            if (data.success) {
                setCodeSent(true);
                setMessage('¡Código enviado! Revisa tu correo electrónico.');
            } else {
                setMessage(data.error || 'Error al enviar el código. Verifica que estés registrado.');
            }
        } catch (err) {
            setMessage('Error de conexión.');
        }
        setLoading(false);
    };

    const verifyOtp = async () => {
        const code = otp.join('');
        if (code.length < 6) return;
        setLoading(true);
        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'verify-otp', email, token: code })
            });
            const data = await res.json();
            if (data.success) {
                if (next) {
                    window.location.href = next;
                } else if (data.isAdmin) {
                    window.location.href = '/admin';
                } else {
                    window.location.href = '/';
                }
            } else {
                setMessage('Código inválido o expirado. Intenta de nuevo.');
            }
        } catch (err) {
            setMessage('Error de conexión.');
        }
        setLoading(false);
    };

    const handleOtpChange = (index, value) => {
        if (value.length > 1) value = value.charAt(0);
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus();
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-light)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div className="card animate-scale-in" style={{ maxWidth: 400, width: '100%', margin: '0 24px', padding: 40, textAlign: 'center' }}>
                {/* Logo */}
                <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 16 }}>
                    <span style={{
                        background: 'var(--primary)', color: '#fff', width: 36, height: 36,
                        borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: 18
                    }}>A</span>
                    <span style={{ fontWeight: 800, fontSize: 28, color: 'var(--primary)' }}>ssitour</span>
                </Link>

                <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 32 }}>
                    Tu agenda personalizada para descubrir Medellín.
                </p>

                {!codeSent ? (
                    <>
                        <div className="form-group" style={{ textAlign: 'left' }}>
                            <label className="form-label">Correo electrónico</label>
                            <div style={{ position: 'relative' }}>
                                <span className="material-icons-round" style={{
                                    position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                                    color: 'var(--text-light)', fontSize: 20
                                }}>mail</span>
                                <input type="email" className="form-input" placeholder="tu@correo.com"
                                    style={{ paddingLeft: 44 }}
                                    value={email} onChange={e => setEmail(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && sendMagicLink()} />
                            </div>
                        </div>
                        <button className="btn btn-primary btn-block btn-lg" onClick={sendMagicLink}
                            disabled={!email || loading} style={{ marginTop: 8, opacity: email && !loading ? 1 : 0.5 }}>
                            {loading ? 'Enviando...' : 'Continuar con Magic Link'}
                            {!loading && <span className="material-icons-round">auto_awesome</span>}
                        </button>
                    </>
                ) : (
                    <>
                        <div style={{ borderTop: '1px solid var(--border)', margin: '24px 0', position: 'relative' }}>
                            <span style={{
                                position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)',
                                background: '#fff', padding: '0 16px', fontSize: 13, color: 'var(--text-muted)'
                            }}>Ingresa el código</span>
                        </div>
                        <div className="otp-container" style={{ marginBottom: 20 }}>
                            {otp.map((digit, i) => (
                                <input key={i} id={`otp-${i}`} type="text" maxLength={1}
                                    className="otp-input" value={digit}
                                    onChange={e => handleOtpChange(i, e.target.value)}
                                    onKeyDown={e => handleOtpKeyDown(i, e)}
                                    inputMode="numeric" />
                            ))}
                        </div>
                        <button className="btn btn-primary btn-block" onClick={verifyOtp}
                            disabled={otp.join('').length < 6 || loading}>
                            {loading ? 'Verificando...' : 'Verificar código'}
                        </button>
                        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 16 }}>
                            ¿No recibiste el código?{' '}
                            <button onClick={sendMagicLink} style={{
                                background: 'none', border: 'none', color: 'var(--primary)',
                                fontWeight: 600, cursor: 'pointer', fontSize: 13
                            }}>Reenviar</button>
                        </p>
                    </>
                )}

                {message && (
                    <div className={`alert ${message.includes('Error') || message.includes('inválido') ? 'alert-warning' : 'alert-success'}`}
                        style={{ marginTop: 16, fontSize: 13 }}>
                        {message}
                    </div>
                )}
            </div>

            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 20, textAlign: 'center' }}>
                ¿No tienes cuenta?{' '}
                <Link href="/registro" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Regístrate aquí</Link>
            </p>

            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 24, textAlign: 'center', padding: '0 24px' }}>
                Al continuar, aceptas nuestra{' '}
                <Link href="/politica-datos" style={{ color: 'var(--text-dark)', fontWeight: 600, textDecoration: 'none' }}>Política de Privacidad</Link>
                {' '}y{' '}
                <Link href="/politica-datos" style={{ color: 'var(--text-dark)', fontWeight: 600, textDecoration: 'none' }}>Tratamiento de Datos</Link>.
            </p>

            <p style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 32 }}>
                © {new Date().getFullYear()} Assitour. Todos los derechos reservados.
            </p>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
            <LoginForm />
        </Suspense>
    );
}
