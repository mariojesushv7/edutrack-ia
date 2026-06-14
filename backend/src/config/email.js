const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

const enviarEmail = async (destinatario, asunto, mensaje) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'EduTrack IA <onboarding@resend.dev>',
            to: destinatario,
            subject: asunto,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background-color: #001a5c; padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0;">EduTrack IA</h1>
                        <p style="color: #FFD700; margin: 4px 0 0 0;">U.E. Adventista Salomón</p>
                    </div>
                    <div style="padding: 24px; background-color: #f8fafc;">
                        <p style="color: #1e293b; font-size: 16px;">${mensaje}</p>
                    </div>
                    <div style="padding: 16px; background-color: #e2e8f0; text-align: center;">
                        <p style="color: #64748b; font-size: 12px; margin: 0;">Este es un mensaje automático de EduTrack IA</p>
                    </div>
                </div>
            `
        });

        if (error) {
            console.error('Error enviando email:', error);
            return false;
        }

        console.log(`Email enviado a ${destinatario}`);
        return true;
    } catch (error) {
        console.error('Error enviando email:', error);
        return false;
    }
};

module.exports = { enviarEmail };