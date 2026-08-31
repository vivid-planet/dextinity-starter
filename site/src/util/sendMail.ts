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
            auth: user ? { user, pass: process.env.MAIL_PASSWORD } : undefined,
        });
    }

    return transport;
}

export async function sendMail(options: SendMailOptions) {
    const from = options.from ?? process.env.MAIL_FROM;

    if (!from) {
        throw new Error("process.env.MAIL_FROM must be set.");
    }

    return getTransport().sendMail({ ...options, from });
}
