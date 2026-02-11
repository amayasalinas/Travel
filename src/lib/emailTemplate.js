export function generateItineraryEmail({ nombre, fechaInicio, fechaFin, activitiesByDay }) {
  const formatTime = (time) => time ? time.substring(0, 5) : '';
  const formatPrice = (price) => {
    if (!price || price === 0) return 'Gratis';
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(price);
  };
  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  let daysHtml = '';
  for (const [date, activities] of Object.entries(activitiesByDay)) {
    let activitiesHtml = '';
    for (const act of activities) {
      const timeRange = act.horaInicio && act.horaFin ? `${formatTime(act.horaInicio)} - ${formatTime(act.horaFin)}` : '';
      const priceLabel = formatPrice(act.precio);
      const reserveBtn = act.reserva ? `
        <a href="https://travel-five-iota.vercel.app/mis-viajes" style="display:inline-block;background:#f27f0d;color:#fff;padding:10px 24px;border-radius:10px;text-decoration:none;font-weight:600;margin-top:10px;font-size:14px;">
          📅 Ver detalles y reservar
        </a>` : '';
      const linkBtn = act.link ? `<a href="${act.link}" style="color:#f27f0d;font-weight:600;text-decoration:none;font-size:13px;">Ver más información →</a>` : '';

      activitiesHtml += `
        <div style="background:#fff;border-radius:14px;padding:20px;margin-bottom:16px;border-left:4px solid ${act.reserva ? '#f27f0d' : '#e2e8f0'};">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <span style="color:#f27f0d;font-weight:700;font-size:14px;">🕐 ${timeRange}</span>
            <span style="background:${priceLabel === 'Gratis' ? '#16a34a' : '#1B2D45'};color:#fff;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600;">${priceLabel}</span>
          </div>
          <h3 style="font-size:18px;font-weight:700;color:#1B2D45;margin:0 0 6px 0;">${act.actividad}</h3>
          <p style="font-size:13px;color:#64748b;margin:0 0 10px 0;line-height:1.5;">${act.descripcion ? act.descripcion.substring(0, 150) + '...' : ''}</p>
          ${reserveBtn}
          ${linkBtn ? `<div style="margin-top:8px;">${linkBtn}</div>` : ''}
        </div>`;
    }

    daysHtml += `
      <div style="margin-bottom:32px;">
        <h2 style="color:#f27f0d;font-size:18px;font-weight:700;border-bottom:2px solid #f27f0d;padding-bottom:8px;margin-bottom:16px;">
          📅 ${formatDate(date)}
        </h2>
        ${activitiesHtml}
      </div>`;
  }

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
      <div style="max-width:600px;margin:0 auto;background:#f8fafc;">
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#1B2D45 0%,#2d4a6f 100%);padding:32px;text-align:center;">
          <h1 style="color:#f27f0d;font-size:32px;font-weight:800;margin:0;letter-spacing:-0.5px;">✈ Assitour</h1>
        </div>
        
        <!-- Content -->
        <div style="padding:32px 24px;">
          <h1 style="font-size:28px;font-weight:800;color:#1B2D45;margin:0 0 16px 0;">Agenda sugerida</h1>
          <p style="font-size:15px;color:#475569;margin:0 0 8px 0;">Hola <strong>${nombre}</strong>,</p>
          <p style="font-size:15px;color:#475569;margin:0 0 24px 0;">Gracias por confiar en Assitour. Te compartimos un listado de actividades a realizar en tu próximo viaje a Medellín entre <strong>${formatDate(fechaInicio)}</strong> y <strong>${formatDate(fechaFin)}</strong>.</p>
          
          <div style="background:#fef3c7;border-left:4px solid #f27f0d;padding:14px 18px;border-radius:8px;margin-bottom:28px;">
            <p style="margin:0;font-size:13px;color:#92400e;font-weight:500;">ℹ️ Para algunas actividades es necesario reservar con antelación.</p>
          </div>

          ${daysHtml}
        </div>

        <!-- Footer -->
        <div style="background:#1B2D45;padding:24px;text-align:center;">
          <p style="color:#94a3b8;font-size:11px;margin:0 0 8px 0;">Recibiste este mensaje porque autorizaste la recepción de emails de Assitour de conformidad con la Política de Tratamiento de Datos.</p>
          <p style="color:#64748b;font-size:11px;margin:0;">Copyright © ${new Date().getFullYear()} Assitour. Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
    </html>`;
}
