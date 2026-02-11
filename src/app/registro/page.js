'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function RegistroPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [message, setMessage] = useState('');

    const handleRegister = async () => {
        if (!email) return;
        setLoading(true);
        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'register', email })
            });
            const data = await res.json();
            if (data.success) {
                setSent(true);
            } else {
                setMessage(data.error || 'Error al registrar. Intenta de nuevo.');
            }
        } catch (err) {
            setMessage('Error de conexión.');
        }
        setLoading(false);
    };

    if (sent) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--bg-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="card animate-scale-in" style={{ maxWidth: 400, width: '100%', margin: '0 24px', padding: 40, textAlign: 'center' }}>
                    <div style={{
                        width: 64, height: 64, borderRadius: '50%', background: '#dcfce7',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'
                    }}>
                        <span className="material-icons-round" style={{ color: 'var(--success)', fontSize: 32 }}>check_circle</span>
                    </div>
                    <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>¡Cuenta creada!</h2>
                    <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        Tu cuenta con <strong>{email}</strong> ha sido creada exitosamente.
                        Ya puedes iniciar sesión.
                    </p>
                    <Link href="/login" style={{ textDecoration: 'none' }}>
                        <button className="btn btn-primary btn-block" style={{ marginTop: 24 }}>
                            Ir a iniciar sesión
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="card animate-scale-in" style={{ maxWidth: 400, width: '100%', margin: '0 24px', padding: 40, textAlign: 'center' }}>
                <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 16 }}>
                    <span style={{
                        background: 'var(--primary)', color: '#fff', width: 36, height: 36,
                        borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: 18
                    }}>A</span>
                    <span style={{ fontWeight: 800, fontSize: 28, color: 'var(--primary)' }}>ssitour</span>
                </Link>

                <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Crea tu cuenta</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 32 }}>
                    Desbloquea planes ilimitados y guarda tus favoritos.
                </p>

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
                            onKeyDown={e => e.key === 'Enter' && handleRegister()} />
                    </div>
                </div>

                <button className="btn btn-primary btn-block btn-lg" onClick={handleRegister}
                    disabled={!email || loading} style={{ opacity: email && !loading ? 1 : 0.5 }}>
                    {loading ? 'Registrando...' : 'Registrarse'}
                </button>

                {message && <div className="alert alert-warning" style={{ marginTop: 16, fontSize: 13 }}>{message}</div>}

                <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 24 }}>
                    ¿Ya tienes cuenta?{' '}
                    <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Inicia sesión</Link>
                </p>
            </div>
        </div>
    );
}
