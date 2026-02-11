'use client';
import Link from 'next/link';

export default function ConfirmacionPage() {
    return (
        <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column' }}>
            <header style={{ padding: '16px 24px', textAlign: 'center' }}>
                <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span style={{
                        background: 'var(--primary)', color: '#fff', width: 32, height: 32,
                        borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: 16
                    }}>A</span>
                    <span style={{ fontWeight: 700, fontSize: 22, color: 'var(--text-muted)' }}>ssitour</span>
                </Link>
            </header>

            <main className="container" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingBottom: 60 }}>
                {/* Illustration */}
                <div style={{ position: 'relative', marginBottom: 24 }}>
                    <div style={{
                        width: 280, height: 200, borderRadius: 20, overflow: 'hidden',
                        boxShadow: 'var(--shadow-lg)'
                    }}>
                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuc2uylh_kGPjJgtX-0wRjYGPvYS17QPD3jURCedxo4w2KUn1EftFSBT7nqC3EabHWiXJ60e6V8KnUBkjGpOYi2Z-lO6ohnrzNOysnnlfAsea418RwMfw9CxKysVHOxGRVxEKRKx1tvtr3hF60yBk895qPweifUEqSy1fkxcdecR67uhAA6tIOW2r3hleFgtp8MEJAjtLHt0jvC8VtflwOLEmEmV1U6oX8E13Jft1DXPy_5LqXoNPBPOFGRcKoOAIRX3iDhwP4BE56"
                            alt="Medellín" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div className="animate-scale-in" style={{
                        position: 'absolute', bottom: -16, right: -16,
                        width: 56, height: 56, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #16a34a, #22c55e)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(22,163,74,0.4)'
                    }}>
                        <span className="material-icons-round" style={{ color: '#fff', fontSize: 28 }}>check</span>
                    </div>
                </div>

                <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-dark)', marginBottom: 12, lineHeight: 1.2 }}>
                    ¡Hemos recibido<br />tu solicitud!
                </h1>
                <p style={{ fontSize: 16, color: 'var(--text-muted)', maxWidth: 320, lineHeight: 1.6 }}>
                    Tu itinerario personalizado para Medellín se está cocinando.
                </p>

                {/* Email notice */}
                <div className="card" style={{ marginTop: 32, display: 'flex', alignItems: 'flex-start', gap: 16, textAlign: 'left', width: '100%' }}>
                    <div style={{
                        width: 48, height: 48, borderRadius: 12,
                        background: '#e0f2fe', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', flexShrink: 0
                    }}>
                        <span className="material-icons-round" style={{ color: '#0284c7', fontSize: 24 }}>mail</span>
                    </div>
                    <div>
                        <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Revisa tu correo</h3>
                        <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                            Recibirás tu plan de viaje detallado en aproximadamente <strong style={{ color: 'var(--primary)' }}>5 minutos</strong>.
                        </p>
                    </div>
                </div>

                {/* Register CTA */}
                <Link href="/registro" style={{ textDecoration: 'none', width: '100%', marginTop: 32 }}>
                    <button className="btn btn-primary btn-block btn-lg">
                        Crear una cuenta gratis
                        <span className="material-icons-round">arrow_forward</span>
                    </button>
                </Link>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 12, maxWidth: 280 }}>
                    Desbloquea planes ilimitados y guarda tus lugares favoritos de la ciudad de la eterna primavera.
                </p>

                <Link href="/" style={{
                    marginTop: 24, fontSize: 15, fontWeight: 600,
                    color: 'var(--text-muted)', textDecoration: 'none'
                }}>
                    Volver al inicio
                </Link>
            </main>
        </div>
    );
}
