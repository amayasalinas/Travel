require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkActivity() {
    const { data, error } = await supabase
        .from('actividades')
        .select('id, actividad, reserva, link')
        .eq('actividad', 'Tour de medio día a la finca de café colombiano');

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Activity Data:', JSON.stringify(data, null, 2));
    }
}

checkActivity();
