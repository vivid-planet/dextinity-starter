import { getRequiredEnv } from "@src/util/getRequiredEnv";
import { createTransport, type SendMailOptions, type Transporter } from "nodemailer";

let transport: Transporter | undefined;

function getTransport() {
    if (!transport) {
        const port = Number(process.env.MAIL_PORT ?? 587);
        const user = process.env.MAIL_USER;

        transport = createTransport({
            host: getRequiredEnv("MAIL_HOST"),
            port,
            secure: port === 465, // all other ports use STARTTLS
            // The local mail catcher (see docker-compose.yml) doesn't require authentication
            auth: user ? { user, pass: getRequiredEnv("MAIL_PASSWORD") } : undefined,
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
export async function sendMail({ from = getRequiredEnv("MAIL_FROM"), ...options }: SendMailOptions) {
    return getTransport().sendMail({ from, ...options });
}
