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
                setTrips(res.trips);
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
            <div className="min-h-screen bg-[var(--bg-dark)] text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-light)] text-[var(--text-dark)] flex flex-col">
            <Header variant="light" />

            <main className="flex-grow container py-10">
                <h1 className="text-3xl font-bold mb-2">Mis Viajes</h1>
                <p className="text-[var(--text-muted)] mb-8">Aquí están tus itinerarios personalizados.</p>

                {trips.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                        <span className="material-icons-round text-6xl text-gray-300 mb-4">flight_off</span>
                        <p className="text-xl font-medium text-gray-500">No tienes viajes planeados aún.</p>
                        <button
                            onClick={() => router.push('/planifica')}
                            className="mt-6 btn btn-primary px-8 py-3 rounded-xl font-bold"
                        >
                            Planear mi primer viaje
                        </button>
                    </div>
                ) : (
                    <SingleTripView trips={trips} />
                )}
            </main>

            <Footer />
        </div>
    );
}

function SingleTripView({ trips }) {
    const [selectedTripId, setSelectedTripId] = useState(trips[0].id);
    const selectedTrip = trips.find(t => t.id === selectedTripId) || trips[0];

    return (
        <div className="animate-fade-in">
            {/* Trip Selector (only if > 1) */}
            {trips.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-4 mb-6 scrollbar-hide">
                    {trips.map(trip => (
                        <button
                            key={trip.id}
                            onClick={() => setSelectedTripId(trip.id)}
                            className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold transition-all ${selectedTripId === trip.id
                                ? 'bg-[var(--primary)] text-white shadow-lg scale-105'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {trip.dates}
                        </button>
                    ))}
                </div>
            )}

            {/* Trip Details */}
            <div className="bg-white rounded-3xl shadow-[var(--shadow-lg)] overflow-hidden border border-gray-100">
                {/* Header Image/Gradient */}
                <div className="bg-gradient-to-r from-[var(--secondary)] to-[#2d4a6f] text-white p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <span className="material-icons-round text-9xl transform rotate-12">flight</span>
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-extrabold mb-2">{selectedTrip.destination}</h2>
                        <div className="flex items-center gap-2 opacity-90 text-sm font-medium">
                            <span className="material-icons-round text-base">calendar_today</span>
                            {selectedTrip.dates}
                        </div>
                    </div>
                </div>

                <div className="p-6 md:p-8">
                    {Object.entries(selectedTrip.plan).map(([date, activities]) => (
                        <div key={date} className="mb-10 last:mb-0 relative pl-6 border-l-2 border-dashed border-gray-200">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[var(--primary)] ring-4 ring-orange-50"></div>
                            <h3 className="text-[var(--secondary)] font-bold text-xl mb-6 flex items-center gap-2">
                                {new Date(date + 'T12:00:00').toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </h3>

                            <div className="space-y-6">
                                {activities.map((act, idx) => (
                                    <div key={idx} className="group flex flex-col md:flex-row gap-5 p-5 rounded-2xl bg-[#f8f9fa] hover:bg-white hover:shadow-[var(--shadow-md)] transition-all border border-transparent hover:border-gray-100">
                                        {/* Time & Price Badge */}
                                        <div className="md:w-48 flex-shrink-0 flex flex-row md:flex-col justify-between md:justify-start gap-2">
                                            <div className="text-sm font-bold text-[var(--secondary)] flex items-center gap-1">
                                                <span className="material-icons-round text-lg text-[var(--primary)]">schedule</span>
                                                {act.horaInicio ? `${act.horaInicio.substring(0, 5)}` : 'Flexible'}
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold w-fit ${!act.precio ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                                                {!act.precio ? 'Gratis' : `$${act.precio.toLocaleString()}`}
                                            </span>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-grow">
                                            <h4 className="font-bold text-[var(--secondary)] text-lg mb-2">{act.actividad}</h4>
                                            <p className="text-sm text-gray-500 leading-relaxed mb-4">{act.descripcion}</p>

                                            {/* Actions */}
                                            <div className="flex flex-wrap gap-3 mt-auto">
                                                {act.reserva ? (
                                                    <a href={act.reserva} target="_blank" rel="noopener noreferrer"
                                                        className="flex-1 md:flex-none text-center bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2">
                                                        <span>Reservar ahora</span>
                                                        <span className="material-icons-round text-sm">arrow_forward</span>
                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-gray-400 flex items-center gap-1 bg-gray-100 px-3 py-2 rounded-lg pointer-events-none">
                                                        <span className="material-icons-round text-sm">info</span>
                                                        Presencial / Sin reserva online
                                                    </span>
                                                )}

                                                {act.link && (
                                                    <a href={act.link} target="_blank" rel="noopener noreferrer"
                                                        className="flex-1 md:flex-none text-center text-[var(--secondary)] bg-white border border-gray-200 hover:bg-gray-50 px-5 py-2.5 rounded-xl text-sm font-bold transition-all">
                                                        Más info
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Footer CTA */}
                    <div className="mt-12 p-6 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                        <p className="text-blue-900 font-medium mb-3">¿Necesitas ayuda con tus reservas?</p>
                        <button className="text-blue-700 font-bold hover:underline flex items-center justify-center gap-2">
                            <span className="material-icons-round">support_agent</span>
                            Contactar soporte de Assitour
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
