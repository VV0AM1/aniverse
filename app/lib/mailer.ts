import nodemailer from "nodemailer";
import { Resend } from "resend";

const resendKey = process.env.RESEND_API_KEY;
const MAIL_PROVIDER = (process.env.MAIL_PROVIDER || "").toLowerCase();

const resend = resendKey ? new Resend(resendKey) : null;

export async function sendVerificationEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  // Prefer Resend when configured for a verified domain
  if (MAIL_PROVIDER === "resend" && resend) {
    try {
      const from = process.env.RESEND_FROM || "Aniverse <no-reply@YOUR_DOMAIN.com>"; // must be verified
      const { error } = await resend.emails.send({ from, to, subject, html });
      if (error) throw error;
      return { ok: true, via: "resend" };
    } catch (err) {
      console.warn("Resend failed, falling back to SMTP:", err);
      // fall through to SMTP
    }
  }

  // SMTP (Gmail) fallback
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  });

  return { ok: true, via: "smtp" };
}