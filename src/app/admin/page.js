'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

export default function AdminPage() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const [recordCount, setRecordCount] = useState(0);
    const [dragOver, setDragOver] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/admin/login');
            } else {
                setUser(session.user);
                // Optional: Check database perm or just rely on the fact they logged in via allowed email
                fetchStats();
            }
            setLoading(false);
        };
        checkSession();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'check-admin' })
            });
            const data = await res.json();
            if (data.recordCount) setRecordCount(data.recordCount);
        } catch (err) { }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/admin/login');
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        setMessage('');
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload-plans', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                setMessage(`✅ ${data.count} registros cargados exitosamente.`);
                setRecordCount(data.count);
                setFile(null);
            } else {
                setMessage(`❌ Error: ${data.error}`);
            }
        } catch (err) {
            setMessage('❌ Error de conexión.');
        }
        setUploading(false);
    };

    const handleDrop = useCallback(e => {
        e.preventDefault();
        setDragOver(false);
        const f = e.dataTransfer.files[0];
        if (f && (f.name.endsWith('.xlsx') || f.name.endsWith('.xls'))) {
            setFile(f);
        }
    }, []);

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="spinner" />
            </div>
        );
    }

    if (!user) return null; // Redirecting...

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-light)' }}>
            <header style={{
                background: '#fff', borderBottom: '1px solid var(--border)',
                padding: '16px 24px'
            }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 0 }}>
                    <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span className="material-icons-round" style={{ color: 'var(--primary)', fontSize: 22 }}>settings</span>
                        <span style={{ fontWeight: 800, fontSize: 22, color: 'var(--primary)' }}>Assitour</span>
                    </Link>
                    <Link href="/" style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14
                    }}>
                        <span className="material-icons-round" style={{ fontSize: 18 }}>logout</span>
                        Salir
                    </Link>
                </div>
            </header>

            <main className="container" style={{ paddingTop: 24, paddingBottom: 40 }}>
                {/* Admin badge */}
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', marginBottom: 24 }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: '50%', background: 'var(--primary-light)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, color: 'var(--primary)', fontSize: 14
                    }}>AS</div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: 1 }}>Administrador</div>
                        <div style={{ fontSize: 14, color: 'var(--text-dark)' }}>amaya_salinas@hotmail.com</div>
                    </div>
                </div>

                <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Gestión de Base de Datos</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>Actualiza el inventario de actividades y excursiones.</p>

                {/* Warning */}
                <div className="alert alert-warning" style={{ marginBottom: 24 }}>
                    <strong>⚠️ Atención</strong><br />
                    Subir un nuevo archivo <strong>eliminará permanentemente</strong> la base de datos anterior.
                    Asegúrate de tener una copia de seguridad si es necesario.
                </div>

                {/* Upload zone */}
                <div className={`upload-zone ${dragOver ? 'dragover' : ''}`}
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('file-input')?.click()}>
                    <input id="file-input" type="file" accept=".xlsx,.xls" style={{ display: 'none' }}
                        onChange={e => setFile(e.target.files?.[0] || null)} />

                    {file ? (
                        <>
                            <span className="material-icons-round" style={{ fontSize: 48, color: 'var(--success)' }}>check_circle</span>
                            <p className="upload-text">{file.name}</p>
                            <p className="upload-hint">{(file.size / 1024).toFixed(1)} KB</p>
                        </>
                    ) : (
                        <>
                            <span className="material-icons-round upload-icon">cloud_upload</span>
                            <p className="upload-text"><span style={{ color: 'var(--primary)' }}>Haz clic para subir</span> o arrastra</p>
                            <p className="upload-hint">Soporta archivos Excel (.xlsx, .xls)</p>
                        </>
                    )}
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                    <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setFile(null)} disabled={!file}>
                        Cancelar
                    </button>
                    <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleUpload} disabled={!file || uploading}>
                        {uploading ? 'Procesando...' : 'Procesar Archivo'}
                    </button>
                </div>

                {message && (
                    <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-warning'}`} style={{ marginTop: 16 }}>
                        {message}
                    </div>
                )}

                {/* Current stats */}
                {recordCount > 0 && (
                    <div className="card" style={{ marginTop: 32 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Base de Datos Actual</h3>
                            <span style={{
                                background: '#dcfce7', color: 'var(--success)',
                                padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600
                            }}>Activo</span>
                        </div>
                        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                            <strong>{recordCount}</strong> actividades cargadas
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
