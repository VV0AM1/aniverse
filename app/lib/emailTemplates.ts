export function renderVerificationEmail({
  nickname,
  verifyUrl,
}: { nickname: string; verifyUrl: string }) {
  return `
  <!doctype html>
  <html>
  <body style="margin:0;background:#0d0d1a;color:#fff;font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,sans-serif">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:32px 0;background:#0d0d1a">
      <tr><td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" width="560" style="max-width:92%;background:#15162a;border-radius:16px;border:1px solid #2a2c4a">
          <tr><td align="center" style="padding:28px 28px 0">
            <img src="https://aniverses.netlify.app/img/aiko.webp" width="64" height="64" style="display:block;border-radius:12px" alt="Aniverse" />
            <h1 style="margin:16px 0 0;font-size:22px">Verify your account</h1>
            <p style="margin:8px 0 0;color:#b8b9d4;font-size:14px">Hey ${escapeHtml(nickname || "there")}, welcome to <strong style="color:#a78bfa">Aniverse</strong>!</p>
          </td></tr>
          <tr><td align="center" style="padding:20px 28px 0">
            <p style="margin:0 0 16px;color:#b8b9d4;font-size:14px">Please confirm your email to finish creating your account.</p>
            <a href="${verifyUrl}" style="display:inline-block;background:#7c3aed;color:#fff;text-decoration:none;padding:12px 18px;border-radius:999px;font-weight:600;font-size:14px">Verify Email</a>
            <p style="margin:16px 0 0;color:#8e90ad;font-size:12px">This link expires in 1 hour.</p>
          </td></tr>
          <tr><td style="padding:20px 28px 28px;color:#6e7193;font-size:12px">
            <hr style="border:none;border-top:1px solid #2a2c4a;margin:16px 0"/>
            If the button doesn’t work, paste this link:<br/>
            <span style="word-break:break-all;color:#9aa0ff">${verifyUrl}</span>
          </td></tr>
        </table>
        <p style="color:#6e7193;font-size:12px;margin:16px 0 0">© ${new Date().getFullYear()} Aniverse</p>
      </td></tr>
    </table>
  </body>
  </html>`;
}

export function renderOtpEmail({ otp }: { otp: string }) {
  return  `
  <!doctype html>
  <html><body style="margin:0;background:#0d0d1a;color:#fff;font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,sans-serif">
    <div style="max-width:560px;margin:32px auto;padding:24px;background:#15162a;border:1px solid #2a2c4a;border-radius:16px">
      <h2 style="margin:0 0 8px">Your OTP code</h2>
      <p style="margin:0 0 16px;color:#b8b9d4">Use the code below to continue. It expires in 5 minutes.</p>
      <div style="font-size:28px;font-weight:700;letter-spacing:4px;background:#0d0d1a;border:1px dashed #2a2c4a;border-radius:12px;padding:12px 16px;text-align:center">${otp}</div>
    </div>
  </body></html>`;
}

function escapeHtml(s: string) {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}