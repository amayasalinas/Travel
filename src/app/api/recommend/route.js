import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import { generateRecommendations } from '@/lib/recommender';
import { generateItineraryEmail } from '@/lib/emailTemplate';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
    try {
        const body = await request.json();
        const { nombre, apellido, fechaNacimiento, email, fechaInicio, fechaFin, compania, transporte, intereses, aceptaPolitica } = body;

        // Validate required fields
        if (!nombre || !email || !fechaInicio || !fechaFin || !intereses?.length) {
            return NextResponse.json({ success: false, error: 'Faltan campos requeridos' }, { status: 400 });
        }

        const supabase = createServiceClient();

        // 1. Save the request to the database
        const { error: insertError } = await supabase.from('solicitudes').insert({
            nombre,
            apellido,
            fecha_nacimiento: fechaNacimiento || null,
            email,
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin,
            compania: compania || [],
            transporte: transporte || [],
            intereses: intereses || [],
            acepta_politica: aceptaPolitica
        });

        if (insertError) {
            console.error('Error saving request:', insertError);
            // Continue even if saving fails - still send recommendation
        }

        // 2. Load activities from the database
        const { data: activities, error: fetchError } = await supabase.from('actividades').select('*');

        if (fetchError || !activities?.length) {
            console.error('Error fetching activities:', fetchError);
            return NextResponse.json({ success: false, error: 'No hay actividades disponibles en este momento.' });
        }

        // 3. Generate recommendations
        const itinerary = generateRecommendations(activities, {
            fechaInicio,
            fechaFin,
            intereses,
            compania,
            transporte
        });

        // 4. Generate email HTML
        const emailHtml = generateItineraryEmail({
            nombre: `${nombre} ${apellido || ''}`.trim(),
            fechaInicio,
            fechaFin,
            activitiesByDay: itinerary
        });

        // 5. Send email via Resend
        try {
            const { data: emailData, error: emailError } = await resend.emails.send({
                from: 'Assitour <onboarding@resend.dev>',
                to: email,
                subject: `✈️ Tu itinerario para Medellín – ${new Date(fechaInicio).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })} al ${new Date(fechaFin).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}`,
                html: emailHtml
            });

            if (emailError) {
                console.error('Error sending email:', emailError);
            }
        } catch (emailErr) {
            console.error('Email send error:', emailErr);
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Recommendation error:', error);
        return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
    }
}
