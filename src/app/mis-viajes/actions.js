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

        // 2. Fetch all activities
        const { data: activities, error: activitiesError } = await supabase
            .from('actividades')
            .select('*');

        if (activitiesError) throw new Error(activitiesError.message);

        // 3. Regenerate itinerary for each request
        const trips = solicitudes.map(sol => {
            // Map DB snake_case to recommender camelCase
            const prefs = {
                fechaInicio: sol.fecha_inicio,
                fechaFin: sol.fecha_fin,
                intereses: sol.intereses || [],
                compania: sol.compania || [],
                transporte: sol.transporte || []
            };

            const dailyPlan = generateRecommendations(activities.map(act => ({
                ...act,
                // Loosen check: 1, "1", true
                reserva: (act.reserva === 1 || act.reserva === '1' || act.reserva === true), // Keep as boolean
                link: act.link || act.Link || '' // Normalize link (handle lowercase or Capitalized)
            })), prefs);

            return {
                id: sol.id,
                destination: 'Medellín, Colombia',
                dates: `${new Date(sol.fecha_inicio).toLocaleDateString('es-CO')} - ${new Date(sol.fecha_fin).toLocaleDateString('es-CO')}`,
                rawDates: { start: sol.fecha_inicio, end: sol.fecha_fin },
                plan: dailyPlan
            };
        });

        return { success: true, trips };

    } catch (error) {
        console.error('Error fetching trips:', error);
        return { success: false, error: 'Error al cargar los viajes' };
    }
}
