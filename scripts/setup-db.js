/**
 * Setup Supabase database tables for Assitour
 * Run: node scripts/setup-db.js
 */

const SUPABASE_URL = 'https://iebbbbwrftvgsrkwpvox.supabase.co';
const SERVICE_ROLE_KEY = 'sb_publishable_lxHUWAke6Rjrmrl964amaw_9oorlCUt';

const SQL = `
-- Create actividades table
CREATE TABLE IF NOT EXISTS actividades (
  id BIGINT PRIMARY KEY,
  actividad TEXT,
  calificacion NUMERIC,
  duracion_min INTEGER,
  ubicacion TEXT,
  idioma TEXT,
  temporada TEXT,
  precio NUMERIC,
  tags TEXT,
  descripcion TEXT,
  pagina TEXT,
  link TEXT,
  reserva TEXT,
  horario_salida_1 TEXT,
  horario_salida_2 TEXT,
  horario_salida_3 TEXT,
  horario_apertura_semana TEXT,
  horario_cierre_semana TEXT,
  horario_apertura_fds TEXT,
  horario_cierre_fds TEXT,
  dias TEXT,
  no_festivos BOOLEAN DEFAULT FALSE,
  cierre_primer_dia_habil BOOLEAN DEFAULT FALSE,
  fecha_inicio DATE,
  fecha_fin DATE,
  no_cruzar_con TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create solicitudes table
CREATE TABLE IF NOT EXISTS solicitudes (
  id BIGSERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  apellido TEXT,
  fecha_nacimiento DATE,
  email TEXT NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  compania TEXT[],
  transporte TEXT[],
  intereses TEXT[],
  acepta_politica BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE actividades ENABLE ROW LEVEL SECURITY;
ALTER TABLE solicitudes ENABLE ROW LEVEL SECURITY;

-- Policies for actividades
DROP POLICY IF EXISTS "Allow public read on actividades" ON actividades;
CREATE POLICY "Allow public read on actividades" ON actividades FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow service role full access on actividades" ON actividades;
CREATE POLICY "Allow service role full access on actividades" ON actividades FOR ALL USING (true);

-- Policies for solicitudes
DROP POLICY IF EXISTS "Allow public insert on solicitudes" ON solicitudes;
CREATE POLICY "Allow public insert on solicitudes" ON solicitudes FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service role read on solicitudes" ON solicitudes;
CREATE POLICY "Allow service role read on solicitudes" ON solicitudes FOR SELECT USING (true);
`;

async function setupDB() {
    console.log('Setting up Supabase database tables...');

    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc`, {
            method: 'POST',
            headers: {
                'apikey': SERVICE_ROLE_KEY,
                'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: SQL })
        });

        if (!res.ok) {
            const text = await res.text();
            console.error('API response:', text);
            console.log('\n⚠️ The REST API cannot execute raw SQL.');
            console.log('Please run the SQL manually in the Supabase Dashboard:');
            console.log(`${SUPABASE_URL.replace('.co', '.co').replace('iebbbbwrftvgsrkwpvox.supabase.co', 'supabase.com/dashboard/project/iebbbbwrftvgsrkwpvox/sql/new')}`);
            console.log('\nSQL to run:\n');
            console.log(SQL);
        } else {
            console.log('✅ Tables created successfully!');
        }
    } catch (err) {
        console.error('Error:', err.message);
        console.log('\nPlease run the SQL manually in the Supabase SQL Editor.');
        console.log('\nSQL:\n', SQL);
    }
}

setupDB();
