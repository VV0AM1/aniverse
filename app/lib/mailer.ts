import nodemailer from "nodemailer";
import { Resend } from "resend";

const MAIL_PROVIDER = (process.env.MAIL_PROVIDER || "smtp").toLowerCase(); 
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const RESEND_FROM = process.env.RESEND_FROM || "";

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

/**
 * Sends an HTML email using either Resend (when configured) or Gmail SMTP.
 * Set MAIL_PROVIDER=resend ONLY after verifying a domain in Resend and
 * setting RESEND_FROM to an address on that domain.
 */
export async function sendHtmlEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (MAIL_PROVIDER === "resend" && resend && RESEND_FROM) {
    try {
      const { error, data } = await resend.emails.send({
        from: RESEND_FROM, 
        to,
        subject,
        html,
      });
      if (error) throw error;
      console.log("📧 mail via Resend:", data?.id || "(no id)");
      return { ok: true, via: "resend", id: data?.id };
    } catch (err) {
      console.warn("Resend failed, falling back to SMTP:", err);
    }
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
    pool: true,          
    maxConnections: 3,
    maxMessages: 50,
  });

  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER, 
    to,
    subject,
    html,
  });

  console.log("📧 mail via SMTP:", info.messageId);
  return { ok: true, via: "smtp", id: info.messageId };
}

export const sendVerificationEmail = sendHtmlEmail;
export const sendOtpEmail = sendHtmlEmail;