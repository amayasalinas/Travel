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
            <div className="min-h-screen bg-[var(--bg-light)] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-light)] text-[var(--text-dark)] flex flex-col font-sans">
            <Header variant="light" />

            {trips.length === 0 ? (
                <main className="flex-grow container py-20 flex flex-col items-center justify-center text-center">
                    <div className="bg-white p-12 rounded-3xl shadow-sm max-w-lg w-full">
                        <span className="material-icons-round text-6xl text-gray-200 mb-6">flight_takeoff</span>
                        <h2 className="text-2xl font-bold text-[var(--secondary)] mb-2">Aún no tienes viajes</h2>
                        <p className="text-gray-500 mb-8">¡Es hora de planear tu próxima aventura en Medellín!</p>
                        <button
                            onClick={() => router.push('/planifica')}
                            className="btn btn-primary px-8 py-3 rounded-xl font-bold w-full shadow-lg shadow-orange-200"
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
                    className="fixed bottom-6 right-6 w-14 h-14 bg-[var(--primary)] text-white rounded-full shadow-lg shadow-orange-400/40 hover:bg-[var(--primary-dark)] transition-all active:scale-90 z-30 flex items-center justify-center"
                    title="Planear nuevo viaje"
                >
                    <span className="material-icons-round text-2xl">add</span>
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
        <main className="flex-grow container max-w-2xl mx-auto px-4 py-8 pb-24">
            {/* Header / Trip Selector */}
            <div className="flex justify-between items-center mb-8 sticky top-20 z-20 bg-[var(--bg-light)]/95 backdrop-blur-sm py-2">
                <div className="relative w-full mr-3">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center justify-between w-full bg-white px-5 py-3 rounded-full shadow-sm border border-gray-100 hover:border-gray-200 transition-all text-left"
                    >
                        <div className="flex items-center gap-3 truncate">
                            <span className="material-icons-round text-[var(--primary)] text-xl">history</span>
                            <span className="font-bold text-[var(--secondary)] truncate text-sm sm:text-base">
                                {getTripLabel(selectedTrip)}
                            </span>
                        </div>
                        <span className={`material-icons-round text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>expand_more</span>
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-30 animate-fade-in-up">
                            {trips.map(trip => (
                                <button
                                    key={trip.id}
                                    onClick={() => {
                                        setSelectedTripId(trip.id);
                                        setIsDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${selectedTrip.id === trip.id ? 'bg-orange-50' : ''
                                        }`}
                                >
                                    <div>
                                        <p className={`font-bold text-sm ${selectedTrip.id === trip.id ? 'text-[var(--primary)]' : 'text-gray-700'}`}>
                                            {getTripLabel(trip)}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">{trip.dates}</p>
                                    </div>
                                    {selectedTrip.id === trip.id && (
                                        <span className="material-icons-round text-[var(--primary)]">check</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <button className="p-3 bg-white rounded-full shadow-sm border border-gray-100 text-gray-400 hover:text-[var(--primary)] transition-colors flex-shrink-0">
                    <span className="material-icons-round">filter_list</span>
                </button>
            </div>

            {/* Info Box */}
            <div className="mb-8 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl shadow-sm animate-fade-in">
                <div className="flex items-start gap-3">
                    <span className="material-icons-round text-blue-500 text-lg mt-0.5">info</span>
                    <p className="text-sm text-blue-800 font-medium">
                        Para algunas actividades es necesario reservar con anticipación.
                    </p>
                </div>
            </div>

            {/* Timeline */}
            <div>
                {Object.entries(selectedTrip.plan).map(([date, activities], dateIndex) => (
                    <div key={date} className="mb-8 animate-fade-in" style={{ animationDelay: `${dateIndex * 100}ms` }}>
                        {/* Date Header */}
                        <div className="flex items-center gap-3 mb-6 sticky top-36 z-10 bg-[var(--bg-light)]/95 backdrop-blur-sm py-2">
                            <div className="h-8 w-1.5 bg-[var(--primary)] rounded-full"></div>
                            <h2 className="text-lg font-bold text-[var(--secondary)]">
                                {new Date(date + 'T12:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </h2>
                        </div>

                        <div className="space-y-6 relative pl-2">
                            {/* Vertical Line */}
                            <div className="absolute left-[19px] top-6 bottom-[-24px] w-0.5 bg-gray-200 z-0"></div>

                            {activities.map((act, idx) => (
                                <div key={idx} className="relative pl-10 group">
                                    {/* Dot */}
                                    <div className="absolute left-3 top-3 w-4 h-4 rounded-full border-4 border-white bg-[var(--secondary)] shadow-sm z-10 ring-1 ring-gray-100"></div>

                                    {/* Card */}
                                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group-hover:border-orange-100">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider mb-1">
                                                    {act.horaInicio ? `${act.horaInicio.substring(0, 5)}` : 'Horario Flexible'}
                                                </span>
                                                <h3 className="font-bold text-[var(--secondary)] text-lg leading-tight">{act.actividad}</h3>
                                            </div>
                                            <span className="material-icons-round text-gray-300 group-hover:text-orange-200 transition-colors">
                                                {act.reserva ? 'confirmation_number' : 'place'}
                                            </span>
                                        </div>

                                        <p className="text-sm text-gray-500 mb-4 line-clamp-3 leading-relaxed">
                                            {act.descripcion}
                                        </p>

                                        <div className="flex flex-col gap-3 pt-3 border-t border-gray-50">
                                            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                                <span className="material-icons-round text-sm">payments</span>
                                                <span className={!act.precio ? 'text-green-600' : ''}>
                                                    {!act.precio ? 'Gratis' : `$${act.precio.toLocaleString()} COP`}
                                                </span>
                                            </div>

                                            {/* Action Button */}
                                            <div className="flex justify-end mt-1">
                                                {act.reserva ? (
                                                    <a
                                                        href={act.reserva}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-all active:scale-95 flex items-center gap-2"
                                                    >
                                                        <span>Reservar</span>
                                                        <span className="material-icons-round text-sm">calendar_month</span>
                                                    </a>
                                                ) : act.link ? (
                                                    <a
                                                        href={act.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-[var(--primary)] hover:bg-orange-50 text-sm font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1"
                                                    >
                                                        Ver detalles
                                                        <span className="material-icons-round text-sm">arrow_forward</span>
                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic px-3 py-2">
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
