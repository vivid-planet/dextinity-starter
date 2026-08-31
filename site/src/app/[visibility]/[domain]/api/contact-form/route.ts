import { sendMail } from "@src/util/sendMail";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const contactFormSchema = z.object({
    name: z.string().min(1),
    company: z.string().optional(),
    email: z.email(),
    phone: z.string().optional(),
    subject: z.string().min(1),
    message: z.string().min(1),
    privacyConsent: z.literal(true),
});

// The [visibility] and [domain] segments are added by the domain rewrite middleware, so a form submits to /api/contact-form.
export async function POST(request: NextRequest) {
    let body: unknown;

    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ message: "Request body must be valid JSON" }, { status: 400 });
    }

    const validationResult = contactFormSchema.safeParse(body);

    if (!validationResult.success) {
        return NextResponse.json({ message: "Validation failed", errors: z.flattenError(validationResult.error).fieldErrors }, { status: 400 });
    }

    const { name, company, email, phone, subject, message } = validationResult.data;

    const recipient = process.env.CONTACT_FORM_TO_EMAIL;

    if (!recipient) {
        throw new Error("process.env.CONTACT_FORM_TO_EMAIL must be set.");
    }

    try {
        await sendMail({
            to: recipient,
            replyTo: { name, address: email },
            subject,
            text: [`Name: ${name}`, `Company: ${company ?? "-"}`, `Email: ${email}`, `Phone: ${phone ?? "-"}`, "", message].join("\n"),
        });
    } catch (error) {
        console.error("Sending the contact form mail failed", error);
        return NextResponse.json({ message: "Sending the contact form mail failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
