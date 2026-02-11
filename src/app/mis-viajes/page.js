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
                    <div className="grid gap-8">
                        {trips.map((trip) => (
                            <div key={trip.id} className="bg-white rounded-2xl shadow-[var(--shadow-md)] overflow-hidden">
                                <div className="bg-[var(--secondary)] text-white p-6 flex justify-between items-center">
                                    <div>
                                        <h2 className="text-xl font-bold">{trip.destination}</h2>
                                        <p className="text-sm opacity-80">{trip.dates.dates || trip.dates}</p>
                                    </div>
                                    <span className="bg-[rgba(255,255,255,0.1)] px-3 py-1 rounded-full text-xs font-medium border border-[rgba(255,255,255,0.2)]">
                                        Generado automáticamente
                                    </span>
                                </div>

                                <div className="p-6">
                                    {Object.entries(trip.plan).map(([date, activities]) => (
                                        <div key={date} className="mb-8 last:mb-0">
                                            <h3 className="text-[var(--primary)] font-bold text-lg border-b-2 border-[var(--primary)] pb-2 mb-4">
                                                📅 {new Date(date + 'T12:00:00').toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })}
                                            </h3>

                                            <div className="space-y-4">
                                                {activities.map((act, idx) => (
                                                    <div key={idx} className="flex gap-4 p-4 rounded-xl bg-gray-50 hover:bg-white hover:shadow-md transition-all border border-gray-100">
                                                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                                                            {act.reserva ? (
                                                                <div className="w-full h-full bg-[var(--primary)] flex items-center justify-center text-white font-bold text-xs text-center p-1">
                                                                    Reservable
                                                                </div>
                                                            ) : (
                                                                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
                                                                    <span className="material-icons-round">local_activity</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="flex-grow">
                                                            <div className="flex justify-between items-start">
                                                                <h4 className="font-bold text-[var(--secondary)] text-lg">{act.actividad}</h4>
                                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${!act.precio ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                                    {!act.precio ? 'Gratis' : `$${act.precio.toLocaleString()}`}
                                                                </span>
                                                            </div>

                                                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{act.descripcion}</p>

                                                            <div className="mt-3 flex gap-3">
                                                                {act.reserva && (
                                                                    <a href={act.reserva} target="_blank" rel="noopener noreferrer"
                                                                        className="text-white bg-[var(--primary)] hover:bg-[var(--primary-dark)] px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1 transition-colors">
                                                                        <span className="material-icons-round text-sm">calendar_month</span> Reservar
                                                                    </a>
                                                                )}
                                                                {act.link && (
                                                                    <a href={act.link} target="_blank" rel="noopener noreferrer"
                                                                        className="text-[var(--primary)] hover:bg-orange-50 px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1 transition-colors">
                                                                        Ver info <span className="material-icons-round text-sm">open_in_new</span>
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
