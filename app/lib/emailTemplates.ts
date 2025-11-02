export function renderVerificationEmail({
  nickname,
  verifyUrl,
}: {
  nickname: string;
  verifyUrl: string;
}) {
  // inlined, responsive-friendly email (no external CSS)
  return /* html */ `
  <!doctype html>
  <html lang="en">
  <head>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Verify your Aniverse account</title>
  </head>
  <body style="margin:0;background:#0d0d1a;color:#fff;font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0d0d1a;padding:32px 0">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="width:560px;max-width:92%;background:#15162a;border-radius:16px;border:1px solid #2a2c4a">
            <tr>
              <td style="padding:28px 28px 0" align="center">
                <img src="https://aniverses.netlify.app/img/logo-email.png" alt="Aniverse" width="64" height="64" style="display:block;border:0;outline:0;border-radius:12px" />
                <h1 style="margin:16px 0 0;font-size:22px;line-height:1.3;color:#ffffff;">Verify your account</h1>
                <p style="margin:8px 0 0;color:#b8b9d4;font-size:14px;">Hey ${escapeHtml(
                  nickname || "there"
                )}, welcome to <strong style="color:#a78bfa">Aniverse</strong>!</p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 28px 0" align="center">
                <p style="margin:0 0 16px;color:#b8b9d4;font-size:14px;">
                  Please confirm your email to finish creating your account.
                </p>
                <a href="${verifyUrl}" style="display:inline-block;background:#7c3aed;color:#fff;text-decoration:none;padding:12px 18px;border-radius:999px;font-weight:600;font-size:14px;">
                  Verify Email
                </a>
                <p style="margin:16px 0 0;color:#8e90ad;font-size:12px;">
                  This link expires in 1 hour.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 28px 28px;color:#6e7193;font-size:12px;">
                <hr style="border:none;border-top:1px solid #2a2c4a;margin:16px 0" />
                Having trouble? Paste this link into your browser:<br/>
                <span style="word-break:break-all;color:#9aa0ff">${verifyUrl}</span>
              </td>
            </tr>
          </table>
          <p style="color:#6e7193;font-size:12px;margin:16px 0 0;">© ${new Date().getFullYear()} Aniverse</p>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}