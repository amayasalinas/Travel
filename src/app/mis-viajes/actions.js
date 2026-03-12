'use server';

import { createServiceClient } from '@/lib/supabase';
import { generateRecommendations } from '@/lib/recommender';

export async function getMyTrips(email) {
    if (!email) return { success: false, error: 'Email requerido' };

    const supabase = createServiceClient();

    try {
        // 1. Fetch user's requests
        const { data: solicitudes, error: solicitudesError } = await supabase
            .from('solicitudes')
            .select('*')
            .eq('email', email)
            .order('created_at', { ascending: false });

        if (solicitudesError) throw new Error(solicitudesError.message);
        if (!solicitudes || solicitudes.length === 0) return { success: true, trips: [] };

        // 2. Fetch all activities (needed as fallback for old requests without saved itinerary)
        let activities = null;

        // 3. Build trips using saved itinerary or regenerating as fallback
        const trips = solicitudes.map(sol => {
            let dailyPlan;

            if (sol.itinerario && Object.keys(sol.itinerario).length > 0) {
                // Use the saved itinerary (consistent across visits)
                dailyPlan = sol.itinerario;
            } else {
                // Fallback: regenerate for old requests that don't have saved itinerary
                if (!activities) {
                    // Lazy load activities only if needed
                    // Note: since this is sync in .map, we preload below
                }
                dailyPlan = {};
            }

            // Calculate total price
            let totalPrice = 0;
            Object.values(dailyPlan).forEach(dayActs => {
                dayActs.forEach(act => {
                    if (act.precio) totalPrice += act.precio;
                });
            });

            return {
                id: sol.id,
                destination: 'Medellín, Colombia',
                dates: `${new Date(sol.fecha_inicio).toLocaleDateString('es-CO')} - ${new Date(sol.fecha_fin).toLocaleDateString('es-CO')}`,
                rawDates: { start: sol.fecha_inicio, end: sol.fecha_fin },
                plan: dailyPlan,
                totalPrice,
                _needsRegeneration: !sol.itinerario
            };
        });

        // Handle fallback regeneration for old requests
        const needsRegen = trips.filter(t => t._needsRegeneration);
        if (needsRegen.length > 0) {
            const { data: acts, error: activitiesError } = await supabase
                .from('actividades')
                .select('*');

            if (!activitiesError && acts) {
                const normalizedActs = acts.map(act => ({
                    ...act,
                    reserva: (act.reserva === 1 || act.reserva === '1' || act.reserva === true),
                    link: act.link || act.Link || ''
                }));

                for (const trip of needsRegen) {
                    const sol = solicitudes.find(s => s.id === trip.id);
                    const prefs = {
                        fechaInicio: sol.fecha_inicio,
                        fechaFin: sol.fecha_fin,
                        intereses: sol.intereses || [],
                        compania: sol.compania || [],
                        transporte: sol.transporte || []
                    };
                    trip.plan = generateRecommendations(normalizedActs, prefs);

                    let totalPrice = 0;
                    Object.values(trip.plan).forEach(dayActs => {
                        dayActs.forEach(act => {
                            if (act.precio) totalPrice += act.precio;
                        });
                    });
                    trip.totalPrice = totalPrice;
                }
            }
        }

        // Clean internal flag before returning
        const cleanTrips = trips.map(({ _needsRegeneration, ...rest }) => rest);

        return { success: true, trips: cleanTrips };

    } catch (error) {
        console.error('Error fetching trips:', error);
        return { success: false, error: 'Error al cargar los viajes' };
    }
}
