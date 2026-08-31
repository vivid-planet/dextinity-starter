import { createTransport, type SendMailOptions, type Transporter } from "nodemailer";

let transport: Transporter | undefined;

function getTransport() {
    if (!transport) {
        const host = process.env.MAIL_HOST;

        if (!host) {
            throw new Error("process.env.MAIL_HOST must be set.");
        }

        const port = parseInt(process.env.MAIL_PORT || "587", 10);
        const user = process.env.MAIL_USER;

        transport = createTransport({
            host,
            port,
            secure: port === 465, // all other ports use STARTTLS
            // The local mail catcher (see docker-compose.yml) doesn't require authentication
            auth: user ? { user, pass: process.env.MAIL_PASSWORD } : undefined,
        });
    }

    return transport;
}

/**
 * Sends a mail via SMTP. Must only be used in server-side code, e.g., in a route handler.
 *
 * In local development, mails aren't delivered to the recipient but caught by Mailpit (see docker-compose.yml).
 * They can be viewed in its web interface at http://localhost:8025.
 */
export async function sendMail(options: SendMailOptions) {
    const from = options.from ?? process.env.MAIL_FROM;

    if (!from) {
        throw new Error("process.env.MAIL_FROM must be set.");
    }

    return getTransport().sendMail({ ...options, from });
}
