import { getRequiredEnv } from "@src/util/getRequiredEnv";
import { sendMail } from "@src/util/sendMail";
import { getSiteConfigForDomain } from "@src/util/siteConfig";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/**
 * Example for a BFF (backend for frontend) route.
 *
 * It receives the values of a contact form, validates them and sends them as a mail. The mail is sent in the BFF and not in the API,
 * because the inquiries are of no interest to the CMS. This also keeps the API free of the site's business logic.
 *
 * The corresponding form isn't part of the starter. A client component would submit to this route as follows:
 *
 * ```tsx
 * const response = await fetch("/api/contact-form", {
 *     method: "POST",
 *     headers: { "content-type": "application/json" },
 *     body: JSON.stringify(values),
 * });
 * ```
 *
 * The domain is added to the path by the domain rewrite middleware (see src/middleware/domainRewrite.ts).
 */

const contactFormSchema = z.object({
    name: z.string().min(1),
    company: z.string().optional(),
    email: z.email(),
    phone: z.string().optional(),
    subject: z.string().min(1),
    message: z.string().min(1),
    privacyConsent: z.literal(true),
});

export async function POST(request: NextRequest, context: RouteContext<"/[visibility]/[domain]/api/contact-form">) {
    const { domain } = await context.params;
    const siteConfig = getSiteConfigForDomain(domain);

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

    try {
        await sendMail({
            to: getRequiredEnv("CONTACT_FORM_TO_EMAIL"),
            replyTo: { name, address: email },
            subject: `${siteConfig.name}: ${subject}`,
            text: [
                `Name: ${name}`,
                `Company: ${company ?? "-"}`,
                `Email: ${email}`,
                `Phone: ${phone ?? "-"}`,
                `Subject: ${subject}`,
                "",
                message,
            ].join("\n"),
        });
    } catch (error) {
        console.error("Sending the contact form mail failed", error);
        return NextResponse.json({ message: "Sending the contact form mail failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
