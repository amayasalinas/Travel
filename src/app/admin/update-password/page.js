'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function UpdatePassword() {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        // Check if we have a hash fragment (implicit flow) or just simple session check
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                setMessage('⚠️ No se detectó una sesión activa. Asegúrate de haber hecho clic en el enlace del correo.');
            }
        });
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const { error } = await supabase.auth.updateUser({
            password: password
        });

        if (error) {
            setMessage('❌ Error: ' + error.message);
        } else {
            setMessage('✅ Contraseña actualizada. Redirigiendo...');
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
                    <span className="material-icons-round" style={{ fontSize: '48px', color: 'var(--primary)' }}>lock_reset</span>
                    <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--secondary)' }}>Establecer Contraseña</h1>
                </div>

                <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label className="form-label">Nueva Contraseña</label>
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mínimo 6 caracteres"
                            required
                            minLength={6}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar Contraseña'}
                    </button>
                </form>

                {message && (
                    <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-warning'}`} style={{ marginTop: '16px', fontSize: '13px' }}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}
