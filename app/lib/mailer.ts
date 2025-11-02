import { Resend } from "resend";

const BRAND = {
  name: "Aniverse",
  logoUrl: "https://aniverses.netlify.app/img/aiko.webp",
  primary: "#7c3aed",      
  bg: "#0d0d1a",
  card: "#151527",
  text: "#e5e7eb",
  mutext: "#9ca3af",
};

export async function sendVerificationEmailResend({
  to,
  nickname,
  verifyUrl,
}: {
  to: string;
  nickname: string;
  verifyUrl: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("Missing RESEND_API_KEY");

  const resend = new Resend(apiKey);

  const html = `
  <div style="background:${BRAND.bg};padding:32px 16px;color:${BRAND.text};font-family:Inter,Arial,sans-serif">
    <div style="max-width:560px;margin:0 auto;background:${BRAND.card};border-radius:16px;padding:24px;border:1px solid #23252b">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
        <img src="${BRAND.logoUrl}" width="36" height="36" style="border-radius:8px" alt="${BRAND.name}" />
        <div style="font-size:18px;font-weight:700">${BRAND.name}</div>
      </div>
      <h1 style="font-size:20px;margin:0 0 8px 0">Welcome, ${escapeHtml(nickname)}!</h1>
      <p style="margin:0 0 16px 0;color:${BRAND.mutext}">
        Confirm your email to activate your account.
      </p>
      <a href="${verifyUrl}" target="_blank"
        style="display:inline-block;background:${BRAND.primary};color:white;text-decoration:none;
               padding:12px 18px;border-radius:999px;font-weight:600">
        Verify my email
      </a>
      <p style="margin-top:16px;font-size:12px;color:${BRAND.mutext}">
        If the button doesn't work, copy and paste this link into your browser:
        <br/>
        <span style="word-break:break-all;color:#cbd5e1">${verifyUrl}</span>
      </p>
    </div>
    <p style="max-width:560px;margin:12px auto 0;text-align:center;font-size:12px;color:${BRAND.mutext}">
      This link expires in 1 hour.
    </p>
  </div>`;

  const { error } = await resend.emails.send({
    from: `${BRAND.name} <noreply@resend.dev>`,
    to,
    subject: "Verify your Aniverse account",
    html,
  });

  if (error) throw error;
}

function escapeHtml(s: string) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}
