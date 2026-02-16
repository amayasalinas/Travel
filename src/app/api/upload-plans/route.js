import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import * as XLSX from 'xlsx';

// Column mapping from Excel to database
const COLUMN_MAP = {
    'ID': 'id',
    'Actividad': 'actividad',
    'Calificación': 'calificacion',
    'Duración (min)': 'duracion_min',
    'Ubicación': 'ubicacion',
    'Idioma': 'idioma',
    'Temporada': 'temporada',
    'Precio': 'precio',
    'Tags': 'tags',
    'Descripción': 'descripcion',
    'Página que lo ofrece': 'pagina',
    'Link': 'link',
    'Reserva': 'reserva',
    'Horario salida 1': 'horario_salida_1',
    'Horario salida 2': 'horario_salida_2',
    'Horario salida 3': 'horario_salida_3',
    'Horario Apertura semana': 'horario_apertura_semana',
    'Horario cierre semana': 'horario_cierre_semana',
    'Horario Apertura fds': 'horario_apertura_fds',
    'Horario cierre fds': 'horario_cierre_fds',
    'Días': 'dias',
    'No festivos': 'no_festivos',
    'Cierre primer día hábil': 'cierre_primer_dia_habil',
    'Fecha inicio': 'fecha_inicio',
    'Fecha fin': 'fecha_fin',
    'No cruzar con': 'no_cruzar_con',
};

function parseExcelDate(value) {
    if (!value) return null;
    if (typeof value === 'number') {
        // Excel serial date
        const date = XLSX.SSF.parse_date_code(value);
        if (date) {
            return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
        }
    }
    if (typeof value === 'string') {
        const d = new Date(value);
        if (!isNaN(d.getTime())) {
            return d.toISOString().split('T')[0];
        }
    }
    return null;
}

function parseTimeValue(value) {
    if (!value) return null;
    if (typeof value === 'number') {
        // Excel time as fraction of day
        const totalMinutes = Math.round(value * 24 * 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }
    if (typeof value === 'string') {
        // Try to parse HH:MM format
        const match = value.match(/(\d{1,2}):(\d{2})/);
        if (match) return `${match[1].padStart(2, '0')}:${match[2]}`;
        // Time with AM/PM
        const ampm = value.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
        if (ampm) {
            let h = parseInt(ampm[1]);
            if (ampm[3].toUpperCase() === 'PM' && h < 12) h += 12;
            if (ampm[3].toUpperCase() === 'AM' && h === 12) h = 0;
            return `${String(h).padStart(2, '0')}:${ampm[2]}`;
        }
    }
    return String(value);
}

function parseBooleanish(value) {
    if (value === true || value === 1 || value === 'Sí' || value === 'Si' || value === 'si' || value === 'sí' || value === 'yes' || value === 'TRUE') return true;
    return false;
}

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ success: false, error: 'No se recibió archivo' }, { status: 400 });
        }

        // Read file
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array', cellDates: false });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rawData = XLSX.utils.sheet_to_json(sheet, { defval: null });

        if (!rawData.length) {
            return NextResponse.json({ success: false, error: 'El archivo está vacío' });
        }

        // Create a normalized map for headers (lowercase -> standard key)
        const headerMap = {};
        const range = XLSX.utils.decode_range(sheet['!ref']);
        const firstRow = [];
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cell = sheet[XLSX.utils.encode_cell({ r: range.s.r, c: C })];
            if (cell && cell.v) firstRow.push(String(cell.v));
        }

        // Map clean headers to original headers
        // actually sheet_to_json uses original headers. 
        // We need to map our COLUMN_MAP keys to the actual keys in the row.

        // Better approach: When iterating rows, try to find the match dynamically
        const records = rawData.map((row, idx) => {
            const record = {};
            // Get all keys from the row to support case-insensitive matching
            const rowKeys = Object.keys(row);

            for (const [excelCol, dbCol] of Object.entries(COLUMN_MAP)) {
                // Find matching key in row (case insensitive, trimmed)
                const actualKey = rowKeys.find(k => k.trim().toLowerCase() === excelCol.trim().toLowerCase());
                let value = actualKey ? row[actualKey] : undefined;

                // Special handling for specific columns
                if (dbCol === 'id') {
                    record[dbCol] = value || (idx + 1);
                } else if (dbCol === 'calificacion' || dbCol === 'duracion_min' || dbCol === 'precio') {
                    record[dbCol] = value ? Number(value) : null;
                } else if (dbCol === 'fecha_inicio' || dbCol === 'fecha_fin') {
                    record[dbCol] = parseExcelDate(value);
                } else if (dbCol.startsWith('horario_')) {
                    record[dbCol] = parseTimeValue(value);
                } else if (dbCol === 'no_festivos' || dbCol === 'cierre_primer_dia_habil') {
                    record[dbCol] = parseBooleanish(value);
                } else {
                    record[dbCol] = value != null ? String(value) : null;
                }
            }
            return record;
        });

        const supabase = createServiceClient();

        // Delete all existing records
        const { error: deleteError } = await supabase.from('actividades').delete().neq('id', 0);
        if (deleteError) {
            // Try alternative delete approach
            await supabase.from('actividades').delete().gte('id', 0);
        }

        // Insert new records in batches of 50
        const batchSize = 50;
        for (let i = 0; i < records.length; i += batchSize) {
            const batch = records.slice(i, i + batchSize);
            const { error: insertError } = await supabase.from('actividades').insert(batch);
            if (insertError) {
                console.error('Batch insert error:', insertError);
                return NextResponse.json({ success: false, error: `Error al insertar registros: ${insertError.message}` });
            }
        }

        return NextResponse.json({ success: true, count: records.length });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ success: false, error: `Error al procesar: ${error.message}` }, { status: 500 });
    }
}
