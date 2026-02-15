'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getMyTrips } from './actions';

export default function MyTrips() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [trips, setTrips] = useState([]);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login?next=/mis-viajes');
                return;
            }
            setUser(session.user);
            fetchTrips(session.user.email);
        };

        checkUser();
    }, [router]);

    const fetchTrips = async (email) => {
        try {
            const res = await getMyTrips(email);
            if (res.success) {
                // Sort by date descending (newest first)
                const sortedTrips = res.trips.sort((a, b) => new Date(b.rawDates.start) - new Date(a.rawDates.start));
                setTrips(sortedTrips);
            } else {
                console.error(res.error);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-light)', color: 'var(--text-dark)', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-sans)', position: 'relative' }}>
            <Header variant="light" />

            <style jsx global>{`
                .timeline-card {
                    border: 1px solid var(--border);
                    position: relative;
                }
                .timeline-btn-primary {
                    background-color: var(--primary);
                    color: white;
                    padding: 8px 20px;
                    border-radius: 12px;
                    font-weight: 700;
                    font-size: 14px;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    box-shadow: 0 4px 10px rgba(242, 127, 13, 0.3);
                    transition: all 0.2s;
                    text-decoration: none;
                    border: none;
                    cursor: pointer;
                }
                .timeline-btn-primary:hover {
                    background-color: var(--primary-dark);
                    transform: translateY(-1px);
                    box-shadow: 0 6px 14px rgba(242, 127, 13, 0.4);
                }
                .timeline-link {
                     color: var(--primary);
                     font-weight: 700;
                     font-size: 13px;
                     display: inline-flex;
                     align-items: center;
                     gap: 6px;
                     padding: 6px 16px;
                     border-radius: 999px;
                     background-color: transparent;
                     border: 1px solid var(--primary);
                     text-decoration: none;
                     transition: all 0.2s;
                     cursor: pointer;
                }
                .timeline-link:hover {
                    background-color: rgba(242, 127, 13, 0.08);
                    transform: translateY(-1px);
                }
                .dropdown-item {
                    width: 100%;
                    text-align: left;
                    padding: 16px 20px;
                    border: none;
                    background: none;
                    border-bottom: 1px solid var(--border);
                    cursor: pointer;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    transition: background 0.2s;
                }
                .dropdown-item:hover {
                    background-color: var(--bg-light);
                }
                .dropdown-item:last-child {
                    border-bottom: none;
                }
                /* Modal Styles */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(4px);
                    z-index: 100;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 24px;
                }
                .modal-content {
                    background-color: #fff;
                    border-radius: 24px;
                    width: 100%;
                    max-width: 500px;
                    max-height: 85vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.2);
                    animation: fadeInUp 0.3s ease-out;
                    position: relative;
                }
                .badge-recommended {
                    background-color: #22c55e;
                    color: white;
                    font-size: 10px;
                    font-weight: 800;
                    padding: 4px 8px;
                    border-radius: 6px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    display: inline-block;
                    margin-bottom: 6px;
                }
            `}</style>

            {trips.length === 0 ? (
                <main className="container" style={{ flexGrow: 1, padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '40px' }}>
                        <span className="material-icons-round" style={{ fontSize: '64px', color: '#e2e8f0', marginBottom: '20px' }}>flight_takeoff</span>
                        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--secondary)', marginBottom: '8px' }}>Aún no tienes viajes</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>¡Es hora de planear tu próxima aventura en Medellín!</p>
                        <button
                            onClick={() => router.push('/planifica')}
                            className="btn btn-primary btn-block"
                        >
                            Crear mi primer itinerario
                        </button>
                    </div>
                </main>
            ) : (
                <TimelineView trips={trips} />
            )}

            {/* Float Button for New Trip */}
            {trips.length > 0 && (
                <button
                    onClick={() => router.push('/planifica')}
                    className="btn-primary"
                    style={{
                        position: 'fixed',
                        bottom: '24px',
                        right: '24px',
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 30,
                        padding: 0,
                        boxShadow: '0 4px 12px rgba(242, 127, 13, 0.4)'
                    }}
                    title="Planear nuevo viaje"
                >
                    <span className="material-icons-round" style={{ fontSize: '28px' }}>add</span>
                </button>
            )}
        </div>
    );
}

function TimelineView({ trips }) {
    const [selectedTripId, setSelectedTripId] = useState(trips[0].id);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);

    // Safety check if selectedTripId doesn't exist anymore
    const selectedTrip = trips.find(t => t.id === selectedTripId) || trips[0];

    // Disable body scroll when modal is open
    useEffect(() => {
        if (selectedActivity) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';

        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [selectedActivity]);

    const getTripLabel = (trip) => {
        const date = new Date(trip.rawDates.start);
        const month = date.toLocaleDateString('es-CO', { month: 'long' });
        const year = date.getFullYear();
        // Capitalize month
        const monthCap = month.charAt(0).toUpperCase() + month.slice(1);
        return `Viaje a Medellín - ${monthCap} ${year}`;
    };

    return (
        <main className="container" style={{ padding: '32px 20px 100px 20px', maxWidth: '600px', margin: '0 auto' }}>
            {/* Header / Trip Selector */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', position: 'sticky', top: '80px', zIndex: 20 }}>
                <div style={{ position: 'relative', width: '100%', marginRight: '12px' }}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                            backgroundColor: '#fff',
                            padding: '12px 20px',
                            borderRadius: '999px',
                            boxShadow: 'var(--shadow-sm)',
                            border: '1px solid var(--border)',
                            cursor: 'pointer',
                            textAlign: 'left'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                            <span className="material-icons-round" style={{ color: 'var(--primary)', fontSize: '24px' }}>history</span>
                            <span style={{ fontWeight: 'bold', color: 'var(--secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '15px' }}>
                                {getTripLabel(selectedTrip)}
                            </span>
                        </div>
                        <span className="material-icons-round" style={{ color: '#94a3b8', transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>expand_more</span>
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            width: '100%',
                            marginTop: '8px',
                            backgroundColor: '#fff',
                            borderRadius: '16px',
                            boxShadow: 'var(--shadow-lg)',
                            border: '1px solid var(--border)',
                            overflow: 'hidden',
                            zIndex: 30,
                            animation: 'fadeInUp 0.2s ease-out'
                        }}>
                            {trips.map(trip => (
                                <button
                                    key={trip.id}
                                    onClick={() => {
                                        setSelectedTripId(trip.id);
                                        setIsDropdownOpen(false);
                                    }}
                                    className="dropdown-item"
                                    style={{
                                        backgroundColor: selectedTrip.id === trip.id ? 'var(--primary-light)' : 'transparent',
                                        color: selectedTrip.id === trip.id ? 'var(--primary)' : 'var(--text-dark)',
                                    }}
                                >
                                    <div>
                                        <p style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>
                                            {getTripLabel(trip)}
                                        </p>
                                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{trip.dates}</p>
                                    </div>
                                    {selectedTrip.id === trip.id && (
                                        <span className="material-icons-round" style={{ color: 'var(--primary)' }}>check</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <button style={{
                    padding: '12px',
                    borderRadius: '50%',
                    backgroundColor: '#fff',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-sm)',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                }}>
                    <span className="material-icons-round">filter_list</span>
                </button>
            </div>

            {/* Info Box */}
            <div style={{ marginBottom: '32px', backgroundColor: '#eff6ff', borderLeft: '4px solid #3b82f6', padding: '16px', borderRadius: '0 12px 12px 0', display: 'flex', alignItems: 'start', gap: '12px' }}>
                <span className="material-icons-round" style={{ color: '#3b82f6', fontSize: '20px', marginTop: '2px' }}>info</span>
                <p style={{ fontSize: '14px', color: '#1e40af', fontWeight: 500, margin: 0 }}>
                    Para algunas actividades es necesario reservar con anticipación.
                </p>
            </div>

            {/* Timeline */}
            <div>
                {Object.entries(selectedTrip.plan).map(([date, activities], dateIndex) => (
                    <div key={date} style={{ marginBottom: '32px', animation: `fadeInUp 0.5s ease-out ${dateIndex * 0.1}s backwards` }}>
                        {/* Date Header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <div style={{ height: '32px', width: '6px', backgroundColor: 'var(--primary)', borderRadius: '4px' }}></div>
                            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--primary)' }}>
                                {new Date(date + 'T12:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </h2>
                        </div>

                        <div style={{ position: 'relative', paddingLeft: '24px' }}>
                            {/* Vertical Line */}
                            <div style={{ position: 'absolute', left: '8px', top: '24px', bottom: '-24px', width: '2px', backgroundColor: '#e2e8f0', zIndex: 0 }}></div>

                            {activities.map((act, idx) => {
                                // Default "Recommended" logic: high rating or has reservation
                                const isRecommended = act.calificacion >= 4.5 || act.reserva;

                                return (
                                    <div key={idx} style={{ position: 'relative', marginBottom: '24px', paddingLeft: '24px' }}>
                                        {/* Dot */}
                                        <div style={{
                                            position: 'absolute',
                                            left: '-4px',
                                            top: '24px',
                                            width: '16px',
                                            height: '16px',
                                            borderRadius: '50%',
                                            backgroundColor: 'var(--secondary)',
                                            border: '4px solid #fff',
                                            boxShadow: '0 0 0 1px #e2e8f0',
                                            zIndex: 10
                                        }}></div>

                                        {/* Card */}
                                        <div className="card timeline-card">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>

                                                    {/* Recommended Badge */}
                                                    {isRecommended && (
                                                        <span className="badge-recommended">Recomendado</span>
                                                    )}

                                                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                                                        {act.horaInicio ? `${act.horaInicio.substring(0, 5)}` : 'Horario Flexible'}
                                                    </span>
                                                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--secondary)', lineHeight: 1.3, margin: 0 }}>{act.actividad}</h3>
                                                </div>
                                                <span className="material-icons-round" style={{ color: '#cbd5e1' }}>favorite_border</span>
                                            </div>

                                            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {act.descripcion}
                                            </p>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)' }}>
                                                        <span className="material-icons-round" style={{ fontSize: '18px' }}>payments</span>
                                                        <span style={{ color: !act.precio ? 'var(--success)' : 'inherit', fontWeight: !act.precio ? 'bold' : 'normal' }}>
                                                            {!act.precio ? 'Gratis' : `$${act.precio.toLocaleString()} COP`}
                                                        </span>
                                                    </div>

                                                    {/* Logic for actions:
                                                    If reserva (1): Show "Agendar" button which links to external URL.
                                                    Always show "Ver detalles" link which opens modal.
                                                */}
                                                </div>

                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '4px', alignItems: 'center' }}>
                                                    <button
                                                        onClick={() => setSelectedActivity(act)}
                                                        className="timeline-link"
                                                        style={{ background: 'transparent', padding: '0', fontSize: '13px' }}
                                                    >
                                                        Ver detalles
                                                        <span className="material-icons-round" style={{ fontSize: '16px' }}>chevron_right</span>
                                                    </button>

                                                    {/* Condition: Reserva flag is true OR link exists */}
                                                    {(act.reserva || act.link) ? (
                                                        <a
                                                            href={act.link || '#'} // Use the link. If missing but reserved... well, it's a dead link for now.
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="timeline-btn-primary"
                                                        >
                                                            <span>Agendar</span>
                                                            <span className="material-icons-round" style={{ fontSize: '18px' }}>calendar_month</span>
                                                        </a>
                                                    ) : (
                                                        <span style={{ fontSize: '12px', color: '#cbd5e1', fontStyle: 'italic', padding: '8px 12px' }}>
                                                            Entrada libre
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Activity Detail Modal */}
            {selectedActivity && (
                <div className="modal-overlay" onClick={() => setSelectedActivity(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        {/* Header Image Placeholder (Gradient) */}
                        <div style={{
                            height: '160px',
                            background: 'linear-gradient(135deg, var(--primary), #ef4444)',
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'flex-end',
                            padding: '24px'
                        }}>
                            <button
                                onClick={() => setSelectedActivity(null)}
                                style={{
                                    position: 'absolute',
                                    top: '16px',
                                    right: '16px',
                                    background: 'rgba(255,255,255,0.2)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '32px',
                                    height: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: '#fff'
                                }}
                            >
                                <span className="material-icons-round">close</span>
                            </button>
                            <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                {selectedActivity.actividad}
                            </h2>
                        </div>

                        <div style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                                <div style={{ flex: 1, backgroundColor: 'var(--bg-light)', padding: '12px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                    <span className="material-icons-round text-muted" style={{ fontSize: '20px' }}>schedule</span>
                                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--secondary)' }}>
                                        {selectedActivity.duracion_min ? `${selectedActivity.duracion_min} min` : 'Flexible'}
                                    </span>
                                </div>
                                <div style={{ flex: 1, backgroundColor: 'var(--bg-light)', padding: '12px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                    <span className="material-icons-round text-muted" style={{ fontSize: '20px' }}>payments</span>
                                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--secondary)' }}>
                                        {!selectedActivity.precio ? 'Gratis' : `$${selectedActivity.precio.toLocaleString()}`}
                                    </span>
                                </div>
                                <div style={{ flex: 1, backgroundColor: 'var(--bg-light)', padding: '12px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                    <span className="material-icons-round text-muted" style={{ fontSize: '20px' }}>star</span>
                                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--secondary)' }}>
                                        {selectedActivity.calificacion || '4.8'}
                                    </span>
                                </div>
                            </div>

                            <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Descripción</h4>
                            <p style={{ fontSize: '15px', color: 'var(--text-dark)', lineHeight: 1.6, marginBottom: '24px' }}>
                                {selectedActivity.descripcion}
                            </p>

                            <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Ubicación</h4>
                            <p style={{ fontSize: '15px', color: 'var(--text-dark)', lineHeight: 1.6, marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span className="material-icons-round" style={{ color: 'var(--primary)' }}>place</span>
                                {selectedActivity.ubicacion || 'Medellín, Antioquia'}
                            </p>

                            {(selectedActivity.reserva || selectedActivity.link) && (
                                <a
                                    href={selectedActivity.link || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary btn-block"
                                    style={{ textDecoration: 'none' }}
                                >
                                    Reservar Actividad
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
