/**
 * Recommendation engine - matches user preferences with activities database
 */

const TAG_MAP = {
    'Tours': ['tour', 'tours', 'city tour', 'recorrido'],
    'Vida nocturna': ['nocturno', 'nocturna', 'bar', 'discoteca', 'fiesta', 'vida nocturna'],
    'Actividades al aire libre': ['aire libre', 'naturaleza', 'senderismo', 'parque', 'mirador', 'cascada'],
    'Ir de compras': ['compras', 'shopping', 'mercado', 'centro comercial'],
    'Conocer arte y cultura': ['arte', 'cultura', 'museo', 'galería', 'teatro', 'graffiti'],
    'Degustar comida': ['gastronomía', 'comida', 'restaurante', 'café', 'foodie', 'culinario'],
    'Actividades deportivas': ['deporte', 'deportivo', 'fútbol', 'ciclismo', 'gimnasio'],
    'Actividades de temporada': ['temporada', 'festival', 'feria', 'evento', 'navidad', 'semana santa'],
    'Actividades extremas': ['extremo', 'extrema', 'parapente', 'canopy', 'rafting', 'aventura'],
    'Lugares típicos': ['típico', 'tradicional', 'pueblito', 'barrio'],
    'Historia': ['historia', 'histórico', 'patrimonio', 'colonial'],
    'Religioso': ['religioso', 'iglesia', 'catedral', 'templo', 'capilla']
};

function matchScore(activity, interests) {
    const actTags = (activity.tags || '').toLowerCase();
    const actName = (activity.actividad || '').toLowerCase();
    const actDesc = (activity.descripcion || '').toLowerCase();
    const combined = `${actTags} ${actName} ${actDesc}`;
    let score = 0;

    for (const interest of interests) {
        const keywords = TAG_MAP[interest] || [interest.toLowerCase()];
        for (const kw of keywords) {
            if (combined.includes(kw)) {
                score += 2;
            }
        }
    }

    // Bonus for higher rating
    if (activity.calificacion) {
        score += activity.calificacion * 0.5;
    }

    return score;
}

function isAvailable(activity, date) {
    const d = new Date(date + 'T12:00:00');
    const dayOfWeek = d.getDay(); // 0=Sun, 6=Sat
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Check date range
    if (activity.fecha_inicio && new Date(activity.fecha_inicio) > d) return false;
    if (activity.fecha_fin && new Date(activity.fecha_fin) < d) return false;

    // Check days availability
    if (activity.dias) {
        const diasMap = { 'lunes': 1, 'martes': 2, 'miércoles': 3, 'miercoles': 3, 'jueves': 4, 'viernes': 5, 'sábado': 6, 'sabado': 6, 'domingo': 0 };
        const availDays = activity.dias.toLowerCase().split(',').map(d => d.trim());
        const dayNames = Object.keys(diasMap);
        const availNums = availDays.map(name => diasMap[name]).filter(n => n !== undefined);
        if (availNums.length > 0 && !availNums.includes(dayOfWeek)) return false;
    }

    // Check no_festivos (simplified - would need a holiday API for full implementation)
    if (activity.no_festivos && dayOfWeek === 0) return false;

    // Check cierre_primer_dia_habil (Monday closure)
    if (activity.cierre_primer_dia_habil && dayOfWeek === 1) return false;

    return true;
}

function getTimeSlot(activity, isWeekend) {
    let open, close;
    if (isWeekend) {
        open = activity.horario_apertura_fds || activity.horario_apertura_semana || '08:00';
        close = activity.horario_cierre_fds || activity.horario_cierre_semana || '18:00';
    } else {
        open = activity.horario_apertura_semana || '08:00';
        close = activity.horario_cierre_semana || '18:00';
    }

    // If there are departure times, use the first one
    const startTime = activity.horario_salida_1 || open;
    const durationMin = activity.duracion_min || 60;

    // Calculate end time
    const [h, m] = (startTime || '08:00').split(':').map(Number);
    const endMinutes = h * 60 + (m || 0) + durationMin;
    const endH = Math.floor(endMinutes / 60);
    const endM = endMinutes % 60;
    const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

    return { start: startTime, end: endTime, durationMin };
}

function timeToMinutes(time) {
    if (!time) return 0;
    const [h, m] = time.split(':').map(Number);
    return h * 60 + (m || 0);
}

function hasTimeConflict(existing, newSlot) {
    const newStart = timeToMinutes(newSlot.start);
    const newEnd = timeToMinutes(newSlot.end);

    for (const slot of existing) {
        const existStart = timeToMinutes(slot.start);
        const existEnd = timeToMinutes(slot.end);
        if (newStart < existEnd && newEnd > existStart) return true;
    }
    return false;
}

export function generateRecommendations(activities, formData) {
    const { fechaInicio, fechaFin, intereses } = formData;

    // Generate list of dates
    const dates = [];
    const start = new Date(fechaInicio + 'T12:00:00');
    const end = new Date(fechaFin + 'T12:00:00');

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dates.push(d.toISOString().split('T')[0]);
    }

    // Score all activities
    const scored = activities.map(act => ({
        ...act,
        score: matchScore(act, intereses || [])
    })).filter(a => a.score > 0).sort((a, b) => b.score - a.score);

    // Build daily itinerary
    const itinerary = {};
    const usedIds = new Set();
    const noCrossMap = {};

    // Parse no_cruzar_con
    for (const act of scored) {
        if (act.no_cruzar_con) {
            const ids = act.no_cruzar_con.split(',').map(id => id.trim());
            noCrossMap[act.id] = ids;
        }
    }

    // Helper to check text similarity (simple inclusion/overlap)
    function isSimilar(act1, act2) {
        if (!act1 || !act2) return false;
        // Check if names are very similar (e.g. "Tour Comuna 13" vs "Graffiti Tour Comuna 13")
        const name1 = act1.actividad.toLowerCase();
        const name2 = act2.actividad.toLowerCase();

        // prohibited words overlap
        const words1 = name1.split(' ').filter(w => w.length > 4);
        const words2 = name2.split(' ').filter(w => w.length > 4);

        const intersection = words1.filter(w => words2.includes(w));
        if (intersection.length >= 2) return true; // 2+ significant words match

        // Check if they share the exact same primary tag if available (assuming tags is string)
        if (act1.tags && act2.tags) {
            const tags1 = act1.tags.toLowerCase().split(',').map(t => t.trim());
            const tags2 = act2.tags.toLowerCase().split(',').map(t => t.trim());
            // If they share a very specific tag like "café" or "graffiti"
            const specificTags = ['café', 'cafe', 'graffiti', 'comuna 13', 'finca', 'caballo'];
            const shared = tags1.filter(t => tags2.includes(t) && specificTags.some(st => t.includes(st)));
            if (shared.length > 0) return true;
        }

        return false;
    }

    // Track detailed global used activities to avoid similarity across the whole trip
    const globalActivities = [];

    for (const date of dates) {
        const dayOfWeek = new Date(date + 'T12:00:00').getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const daySlots = [];
        const dayActivities = [];
        const maxPerDay = 3; // Reduced to 3 to ensure quality over quantity and less rushing

        // Sort scored activities again to ensure we pick best available each day
        // But also penalize those similar to what we already have in globalActivities
        const dailyCandidates = scored.filter(act => !usedIds.has(act.id) && isAvailable(act, date));

        for (const act of dailyCandidates) {
            if (dayActivities.length >= maxPerDay) break;

            // Check similarity with ANY activity already scheduled for this trip
            const isTooSimilar = globalActivities.some(existing => isSimilar(existing, act));
            if (isTooSimilar) continue; // Skip this activity, try next best

            // Check no_cruzar_con
            const noCross = noCrossMap[act.id] || [];
            const hasConflictingActivity = noCross.some(id =>
                dayActivities.some(da => String(da.id) === String(id))
            );
            if (hasConflictingActivity) continue;

            const slot = getTimeSlot(act, isWeekend);

            if (!hasTimeConflict(daySlots, slot)) {
                daySlots.push(slot);
                const fullAct = {
                    ...act,
                    horaInicio: slot.start,
                    horaFin: slot.end
                };
                dayActivities.push(fullAct);
                globalActivities.push(fullAct);
                usedIds.add(act.id);
            }
        }

        // Sort by start time
        dayActivities.sort((a, b) => timeToMinutes(a.horaInicio) - timeToMinutes(b.horaInicio));

        if (dayActivities.length > 0) {
            itinerary[date] = dayActivities;
        }
    }

    // Fill gaps logic (simplified retention) - removed to avoid forcing bad matches
    // If days are empty, we might leave them empty or suggest "Dia Libre" logic in UI, 
    // but code below forced remaining activities. Let's keep it but apply similarity check there too.
    for (const date of dates) {
        if (!itinerary[date] || itinerary[date].length === 0) {
            // ... (existing fill logic but with similarity check) ...
            // For now, let's trust the main loop did its best.
            // If a day is empty, it's better to be empty than have conflicting/bad plans.
        }
    }

    // Calculate limit budget if needed, but returning just itinerary
    return itinerary;
}
