'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setMessage('❌ Error: ' + error.message);
            setLoading(false);
        } else {
            router.push('/admin');
        }
    };

    const handleFirstAccess = async () => {
        if (!email) {
            setMessage('⚠️ Por favor ingresa tu correo primero.');
            return;
        }
        setLoading(true);
        setMessage('');

        try {
            const res = await fetch('/api/admin/setup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();

            if (data.success) {
                setMessage('✅ Revisa tu correo para establecer tu contraseña.');
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
                    <span className="material-icons-round" style={{ fontSize: '48px', color: 'var(--primary)' }}>admin_panel_settings</span>
                    <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--secondary)' }}>Admin Login</h1>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                    <div>
                        <label className="form-label">Contraseña</label>
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? 'Cargando...' : 'Iniciar Sesión'}
                    </button>
                </form>

                <div style={{ marginTop: '24px', textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>¿Es tu primera vez aquí?</p>
                    <Link href="/admin/recover">
                        <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: '600' }}
                        >
                            Primer Ingreso / Olvidé mi contraseña
                        </button>
                    </Link>
                </div>

                {message && (
                    <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-warning'}`} style={{ marginTop: '16px', fontSize: '13px' }}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}
