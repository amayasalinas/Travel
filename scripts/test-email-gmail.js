
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        let cleanValue = value.trim();
        if (cleanValue.startsWith('"') && cleanValue.endsWith('"')) {
            cleanValue = cleanValue.slice(1, -1);
        }
        env[key.trim()] = cleanValue;
    }
});

async function sendTestEmail() {
    console.log(`Configuring Gmail Transport...`);
    console.log(`User: ${env.GMAIL_USER}`);
    console.log(`Pass length: ${env.GMAIL_APP_PASSWORD ? env.GMAIL_APP_PASSWORD.length : 0}`);

    if (env.GMAIL_USER.includes('ingresa_tu_gmail_aqui')) {
        console.error('❌ ERROR: Debes poner tu correo real en .env.local donde dice GMAIL_USER');
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: env.GMAIL_USER,
            pass: env.GMAIL_APP_PASSWORD,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: `"Test Assitour" <${env.GMAIL_USER}>`,
            to: env.ADMIN_EMAIL,
            subject: 'Prueba de Gmail SMTP 🚀',
            html: '<h1>¡Funciona!</h1><p>El sistema de correos ahora usa tu Gmail.</p>',
        });

        console.log('✅ Correo enviado exitosamente!');
        console.log('ID del mensaje:', info.messageId);
    } catch (error) {
        console.error('❌ Error enviando correo:', error);
    }
}

sendTestEmail();
