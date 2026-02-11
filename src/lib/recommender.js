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

    for (const date of dates) {
        const dayOfWeek = new Date(date + 'T12:00:00').getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const daySlots = [];
        const dayActivities = [];
        const maxPerDay = 4; // reasonable number of activities per day

        for (const act of scored) {
            if (dayActivities.length >= maxPerDay) break;
            if (usedIds.has(act.id)) continue;
            if (!isAvailable(act, date)) continue;

            // Check no_cruzar_con
            const noCross = noCrossMap[act.id] || [];
            const hasConflictingActivity = noCross.some(id =>
                dayActivities.some(da => String(da.id) === String(id))
            );
            if (hasConflictingActivity) continue;

            const slot = getTimeSlot(act, isWeekend);

            if (!hasTimeConflict(daySlots, slot)) {
                daySlots.push(slot);
                dayActivities.push({
                    ...act,
                    horaInicio: slot.start,
                    horaFin: slot.end
                });
                usedIds.add(act.id);
            }
        }

        // Sort by start time
        dayActivities.sort((a, b) => timeToMinutes(a.horaInicio) - timeToMinutes(b.horaInicio));

        if (dayActivities.length > 0) {
            itinerary[date] = dayActivities;
        }
    }

    // If we have days with no activities, fill with remaining scored activities
    for (const date of dates) {
        if (!itinerary[date] || itinerary[date].length === 0) {
            const dayOfWeek = new Date(date + 'T12:00:00').getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            const remaining = scored.filter(a => !usedIds.has(a.id) && isAvailable(a, date));
            const dayActivities = [];

            for (const act of remaining.slice(0, 3)) {
                const slot = getTimeSlot(act, isWeekend);
                dayActivities.push({ ...act, horaInicio: slot.start, horaFin: slot.end });
                usedIds.add(act.id);
            }

            if (dayActivities.length > 0) {
                dayActivities.sort((a, b) => timeToMinutes(a.horaInicio) - timeToMinutes(b.horaInicio));
                itinerary[date] = dayActivities;
            }
        }
    }

    return itinerary;
}
