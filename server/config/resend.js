import { Resend } from 'resend';
import generateWelcomeEmail from '../email/generateWelcomeEmail.js';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function welcomeEmail(to, name, loginUrl) {
    try {
        const result = await resend.emails.send({
            from: 'Auth Template MERN <noreply@yashh1524.com>',
            to,
            subject: "Welcome to Auth Template",
            html: generateWelcomeEmail(name, loginUrl),
        });

        return result;
    } catch (err) {
        console.error('Reminder Email error:', err);
        throw err;
    }
}

export async function verificationEmail(to, name, verifyLink) {
    try {
        const result = await resend.emails.send({
            from: 'Auth Template MERN <noreply@yashh1524.com>',
            to,
            subject: "Welcome to Auth Template",
            html: `
                <h1>Hi ${name},</h1>
                <p>Please verify your email by clicking the button below:</p>
                <a href="${verifyLink}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
            `,
        });

        return result;
    } catch (err) {
        console.error('Reminder Email error:', err);
        throw err;
    }
}