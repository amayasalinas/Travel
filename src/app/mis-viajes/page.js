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
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-light)', color: 'var(--text-dark)', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-sans)' }}>
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
                }
                .timeline-btn-primary:hover {
                    background-color: var(--primary-dark);
                    transform: translateY(-1px);
                    box-shadow: 0 6px 14px rgba(242, 127, 13, 0.4);
                }
                .timeline-link {
                     color: var(--primary);
                     font-weight: 700;
                     font-size: 14px;
                     display: inline-flex;
                     align-items: center;
                     gap: 4px;
                     padding: 8px 16px;
                     border-radius: 12px;
                     background-color: rgba(242, 127, 13, 0.08);
                     text-decoration: none;
                     transition: all 0.2s;
                }
                .timeline-link:hover {
                    background-color: rgba(242, 127, 13, 0.15);
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

    // Safety check if selectedTripId doesn't exist anymore
    const selectedTrip = trips.find(t => t.id === selectedTripId) || trips[0];

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

                            {activities.map((act, idx) => (
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

                                    {/* Card using global class */}
                                    <div className="card timeline-card">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                                                    {act.horaInicio ? `${act.horaInicio.substring(0, 5)}` : 'Horario Flexible'}
                                                </span>
                                                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--secondary)', lineHeight: 1.3, margin: 0 }}>{act.actividad}</h3>
                                            </div>
                                            <span className="material-icons-round" style={{ color: '#cbd5e1' }}>
                                                {act.reserva ? 'confirmation_number' : 'place'}
                                            </span>
                                        </div>

                                        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {act.descripcion}
                                        </p>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)' }}>
                                                <span className="material-icons-round" style={{ fontSize: '18px' }}>payments</span>
                                                <span style={{ color: !act.precio ? 'var(--success)' : 'inherit', fontWeight: !act.precio ? 'bold' : 'normal' }}>
                                                    {!act.precio ? 'Gratis' : `$${act.precio.toLocaleString()} COP`}
                                                </span>
                                            </div>

                                            {/* Action Button */}
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                                                {act.reserva ? (
                                                    <a
                                                        href={act.reserva}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="timeline-btn-primary"
                                                    >
                                                        <span>Reservar</span>
                                                        <span className="material-icons-round" style={{ fontSize: '18px' }}>calendar_month</span>
                                                    </a>
                                                ) : act.link ? (
                                                    <a
                                                        href={act.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="timeline-link"
                                                    >
                                                        Ver detalles
                                                        <span className="material-icons-round" style={{ fontSize: '18px' }}>arrow_forward</span>
                                                    </a>
                                                ) : (
                                                    <span style={{ fontSize: '12px', color: '#cbd5e1', fontStyle: 'italic', padding: '8px 12px' }}>
                                                        Entrada libre / Sin reserva
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
