import { type NextRequest, NextResponse } from "next/server";
import { createTransport } from "nodemailer";
import { z } from "zod";

const queryValidationSchema = z.object({
    email: z.email(),
    message: z.string(),
});

// The [visibility] and [domain] segments are added by the domain rewrite middleware, so a form submits to /api/contact-form.
export async function POST(request: NextRequest) {
    const body = await request.json();
    const validationResult = queryValidationSchema.safeParse(body);

    if (!validationResult.success) {
        return NextResponse.json(
            {
                cause: validationResult.error,
                message: "Validation failed",
            },
            {
                status: 400,
            },
        );
    }

    const { email, message } = validationResult.data;

    try {
        const port = parseInt(process.env.MAIL_PORT || "587", 10);
        const user = process.env.MAIL_USER;

        const transport = createTransport({
            host: process.env.MAIL_HOST,
            port,
            secure: port === 465, // all other ports use STARTTLS
            auth: user ? { user, pass: process.env.MAIL_PASSWORD } : undefined,
        });

        await transport.sendMail({
            from: process.env.MAIL_FROM,
            to: process.env.CONTACT_FORM_TO_EMAIL,
            replyTo: email,
            subject: "Contact form",
            text: message,
        });

        return NextResponse.json(
            { success: true },
            {
                status: 200,
            },
        );
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Something went wrong processing the contact form" }, { status: 500 });
    }
}
