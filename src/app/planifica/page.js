'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const COMPANIONS = [
    { id: 'solo', label: 'Solo', icon: 'person' },
    { id: 'pareja', label: 'Pareja', icon: 'favorite' },
    { id: 'amigos', label: 'Amigos', icon: 'group' },
    { id: 'familia', label: 'Familia', icon: 'family_restroom' },
];

const TRANSPORT = [
    { id: 'carro', label: 'Carro', icon: 'directions_car' },
    { id: 'bici', label: 'Bici', icon: 'directions_bike' },
    { id: 'metro', label: 'Metro', icon: 'directions_transit' },
    { id: 'taxi', label: 'Taxi', icon: 'local_taxi' },
    { id: 'caminar', label: 'Caminar', icon: 'directions_walk' },
];

const INTERESTS = [
    { id: 'Tours', label: 'Tours', icon: 'tour' },
    { id: 'Vida nocturna', label: 'Vida Nocturna', icon: 'nightlife' },
    { id: 'Actividades al aire libre', label: 'Naturaleza', icon: 'park' },
    { id: 'Ir de compras', label: 'Compras', icon: 'shopping_bag' },
    { id: 'Conocer arte y cultura', label: 'Arte y Cultura', icon: 'museum' },
    { id: 'Degustar comida', label: 'Gastronomía', icon: 'restaurant' },
    { id: 'Actividades deportivas', label: 'Deportes', icon: 'sports_soccer' },
    { id: 'Actividades de temporada', label: 'Temporada', icon: 'event' },
    { id: 'Actividades extremas', label: 'Extremas', icon: 'paragliding' },
    { id: 'Lugares típicos', label: 'Lugares Típicos', icon: 'location_city' },
    { id: 'Historia', label: 'Historia', icon: 'account_balance' },
    { id: 'Religioso', label: 'Religioso', icon: 'church' },
];

export default function PlanificaPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        fechaInicio: '',
        fechaFin: '',
        compania: [],
        transporte: [],
        intereses: [],
        nombre: '',
        apellido: '',
        fechaNacimiento: '',
        email: '',
        aceptaPolitica: false,
    });

    const totalSteps = 5;
    const progress = (step / totalSteps) * 100;

    const toggleMulti = (field, value) => {
        setForm(prev => ({
            ...prev,
            [field]: prev[field].includes(value)
                ? prev[field].filter(v => v !== value)
                : [...prev[field], value]
        }));
    };

    const canNext = () => {
        switch (step) {
            case 1: return form.fechaInicio && form.fechaFin && form.fechaFin >= form.fechaInicio;
            case 2: return form.compania.length > 0;
            case 3: return form.transporte.length > 0;
            case 4: return form.intereses.length > 0;
            case 5: return form.nombre && form.apellido && form.email && form.aceptaPolitica;
            default: return false;
        }
    };

    const handleSubmit = async () => {
        if (!canNext()) return;
        setLoading(true);
        try {
            const res = await fetch('/api/recommend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (data.success) {
                router.push('/confirmacion');
            } else {
                alert('Hubo un error al procesar tu solicitud. Intenta de nuevo.');
            }
        } catch (err) {
            alert('Error de conexión. Intenta de nuevo.');
        }
        setLoading(false);
    };

    return (
        <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <header style={{
                position: 'sticky', top: 0, zIndex: 50,
                background: '#fff', borderBottom: '1px solid var(--border)',
                padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 12
            }}>
                <button onClick={() => step > 1 ? setStep(step - 1) : router.back()}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                    <span className="material-icons-round" style={{ fontSize: 24, color: 'var(--text-dark)' }}>arrow_back</span>
                </button>
                <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="material-icons-round" style={{ color: 'var(--primary)', fontSize: 20 }}>near_me</span>
                    <span style={{ fontWeight: 800, fontSize: 20, color: 'var(--primary)' }}>Assitour</span>
                </Link>
            </header>

            <main className="container" style={{ flex: 1, paddingTop: 24, paddingBottom: 120 }}>
                {/* Progress */}
                <div className="progress-container">
                    <div className="progress-header">
                        <span>Paso {step} de {totalSteps}</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                </div>

                {/* Step 1: Dates */}
                {step === 1 && (
                    <div className="animate-fade-in-up">
                        <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-dark)', marginBottom: 8 }}>
                            Planifica tu viaje a Medellín
                        </h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: 15 }}>
                            Personalizamos tu experiencia en 5 pasos
                        </p>
                        <div className="card" style={{ marginBottom: 20 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                                <span className="material-icons-round" style={{ color: 'var(--primary)', fontSize: 22 }}>date_range</span>
                                <h3 style={{ fontSize: 18, fontWeight: 700 }}>Fechas del viaje</h3>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div className="form-group" style={{ margin: 0 }}>
                                    <label className="form-label">Llegada</label>
                                    <input type="date" className="form-input" value={form.fechaInicio}
                                        onChange={e => setForm({ ...form, fechaInicio: e.target.value })}
                                        min={new Date().toISOString().split('T')[0]} />
                                </div>
                                <div className="form-group" style={{ margin: 0 }}>
                                    <label className="form-label">Salida</label>
                                    <input type="date" className="form-input" value={form.fechaFin}
                                        onChange={e => setForm({ ...form, fechaFin: e.target.value })}
                                        min={form.fechaInicio || new Date().toISOString().split('T')[0]} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Companions */}
                {step === 2 && (
                    <div className="animate-fade-in-up">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <span className="material-icons-round" style={{ color: 'var(--primary)', fontSize: 22 }}>groups</span>
                            <h2 style={{ fontSize: 24, fontWeight: 800 }}>¿Con quién viajas?</h2>
                        </div>
                        <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: 14 }}>Selecciona una o más opciones</p>
                        <div className="selection-grid">
                            {COMPANIONS.map(c => (
                                <div key={c.id} className={`selection-card ${form.compania.includes(c.id) ? 'selected' : ''}`}
                                    onClick={() => toggleMulti('compania', c.id)}>
                                    <span className="material-icons-round icon">{c.icon}</span>
                                    <span className="label">{c.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3: Transport */}
                {step === 3 && (
                    <div className="animate-fade-in-up">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <span className="material-icons-round" style={{ color: 'var(--primary)', fontSize: 22 }}>commute</span>
                            <h2 style={{ fontSize: 24, fontWeight: 800 }}>Medio de transporte</h2>
                        </div>
                        <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: 14 }}>*Selecciona tu preferencia principal</p>
                        <div className="selection-grid selection-grid-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                            {TRANSPORT.map(t => (
                                <div key={t.id} className={`selection-card ${form.transporte.includes(t.id) ? 'selected' : ''}`}
                                    onClick={() => toggleMulti('transporte', t.id)}>
                                    <span className="material-icons-round icon">{t.icon}</span>
                                    <span className="label">{t.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 4: Interests */}
                {step === 4 && (
                    <div className="animate-fade-in-up">
                        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>¿Qué te interesa?</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: 14 }}>
                            Selecciona tus preferencias para que podamos armar el plan perfecto en Medellín.
                        </p>
                        <div className="selection-grid">
                            {INTERESTS.map(i => (
                                <div key={i.id} className={`selection-card ${form.intereses.includes(i.id) ? 'selected' : ''}`}
                                    onClick={() => toggleMulti('intereses', i.id)}>
                                    <span className="material-icons-round icon">{i.icon}</span>
                                    <span className="label">{i.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 5: Contact info */}
                {step === 5 && (
                    <div className="animate-fade-in-up">
                        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Tus datos de contacto</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: 14 }}>
                            Para enviarte tu itinerario personalizado
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <div className="form-group">
                                <label className="form-label">Nombre</label>
                                <input className="form-input" placeholder="Ej. Juan" value={form.nombre}
                                    onChange={e => setForm({ ...form, nombre: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Apellido</label>
                                <input className="form-input" placeholder="Ej. Pérez" value={form.apellido}
                                    onChange={e => setForm({ ...form, apellido: e.target.value })} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Fecha de nacimiento</label>
                            <input type="date" className="form-input" value={form.fechaNacimiento}
                                onChange={e => setForm({ ...form, fechaNacimiento: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Correo electrónico</label>
                            <input type="email" className="form-input" placeholder="nombre@ejemplo.com" value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })} />
                        </div>

                        <div style={{ marginTop: 20 }}>
                            <div className="checkbox-wrapper" onClick={() => setForm({ ...form, aceptaPolitica: !form.aceptaPolitica })}>
                                <div className={`checkbox-custom ${form.aceptaPolitica ? 'checked' : ''}`}>
                                    {form.aceptaPolitica && <span style={{ fontSize: 14 }}>✓</span>}
                                </div>
                                <span className="checkbox-text">
                                    Acepto la <Link href="/politica-datos" target="_blank" style={{ color: 'var(--primary)', fontWeight: 600 }}>Política de Tratamiento de Datos</Link> y los términos de servicio.
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Fixed bottom button */}
            <div style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                background: '#fff', borderTop: '1px solid var(--border)',
                padding: '16px 24px', paddingBottom: 'max(16px, env(safe-area-inset-bottom))'
            }}>
                <div className="container" style={{ padding: 0 }}>
                    {step < totalSteps ? (
                        <button className="btn btn-primary btn-block btn-lg" disabled={!canNext()}
                            onClick={() => setStep(step + 1)}
                            style={{ opacity: canNext() ? 1 : 0.5 }}>
                            Continuar
                            <span className="material-icons-round">arrow_forward</span>
                        </button>
                    ) : (
                        <button className="btn btn-primary btn-block btn-lg"
                            disabled={!canNext() || loading}
                            onClick={handleSubmit}
                            style={{ opacity: canNext() && !loading ? 1 : 0.5 }}>
                            {loading ? (
                                <>
                                    <div className="spinner" style={{ width: 24, height: 24, borderWidth: 2 }} />
                                    Generando tu plan...
                                </>
                            ) : (
                                <>
                                    Generar Mi Plan
                                    <span className="material-icons-round">auto_awesome</span>
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
