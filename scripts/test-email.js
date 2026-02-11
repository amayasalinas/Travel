
const fs = require('fs');
const path = require('path');
const { Resend } = require('resend');

const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        env[key.trim()] = value.trim();
    }
});

const resend = new Resend(env.RESEND_API_KEY);
const adminEmail = env.ADMIN_EMAIL;

async function sendTestEmail() {
    console.log(`Sending test email to: ${adminEmail}`);

    try {
        const { data, error } = await resend.emails.send({
            from: 'Assitour <onboarding@resend.dev>',
            to: [adminEmail],
            subject: 'Test Email from Assitour Debugger',
            html: '<h1>It works!</h1><p>Resend API is configured correctly.</p>'
        });

        if (error) {
            console.error('❌ Error sending email:', error);
        } else {
            console.log('✅ Email sent successfully!');
            console.log(data);
        }
    } catch (err) {
        console.error('❌ Exception:', err);
    }
}

sendTestEmail();
