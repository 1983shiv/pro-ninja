const YEAR = new Date().getFullYear();

export function emailLayout(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AI ReviewSense</title>
</head>
<body style="margin:0;padding:0;background-color:#F8FAFC;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F8FAFC;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr>
          <td style="background:linear-gradient(135deg,#4F46E5 0%,#7C3AED 100%);border-radius:12px 12px 0 0;padding:32px 40px;">
            <table cellpadding="0" cellspacing="0"><tr>
              <td style="background:rgba(255,255,255,0.2);border:1px solid rgba(255,255,255,0.3);border-radius:8px;width:40px;height:40px;text-align:center;vertical-align:middle;">
                <span style="font-size:22px;line-height:40px;">&#129504;</span>
              </td>
              <td style="padding-left:12px;">
                <span style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.3px;">AI ReviewSense</span>
              </td>
            </tr></table>
          </td>
        </tr>
        <tr>
          <td style="background:#ffffff;padding:40px;border-left:1px solid #E2E8F0;border-right:1px solid #E2E8F0;">
            ${content}
          </td>
        </tr>
        <tr>
          <td style="background:#F1F5F9;border:1px solid #E2E8F0;border-radius:0 0 12px 12px;padding:24px 40px;text-align:center;">
            <p style="margin:0 0 4px;color:#64748B;font-size:13px;">&copy; ${YEAR} AI ReviewSense. All rights reserved.</p>
            <p style="margin:0;color:#94A3B8;font-size:12px;">If you didn&#39;t request this email, you can safely ignore it.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function ctaButton(href: string, label: string): string {
  return `
  <table cellpadding="0" cellspacing="0" style="margin:28px 0;">
    <tr>
      <td style="background:linear-gradient(135deg,#4F46E5 0%,#7C3AED 100%);border-radius:8px;">
        <a href="${href}" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;letter-spacing:0.2px;">${label}</a>
      </td>
    </tr>
  </table>`;
}

export function fallbackLink(href: string): string {
  return `
  <p style="margin:0 0 12px;color:#64748B;font-size:14px;line-height:1.6;">Or copy and paste this link into your browser:</p>
  <p style="margin:0 0 24px;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:6px;padding:12px;color:#4F46E5;font-size:13px;word-break:break-all;">${href}</p>`;
}

export function expiryNote(opts: { minutes?: number; hours?: number; message?: string }): string {
  const { minutes, hours, message } = opts;
  const duration = minutes ? `${minutes} minutes` : hours ? `${hours} hour${hours > 1 ? "s" : ""}` : null;
  const expiry = duration ? `This link expires in <strong>${duration}</strong>. ` : "";
  return `
  <div style="border-top:1px solid #E2E8F0;padding-top:20px;margin-top:8px;">
    <p style="margin:0;color:#94A3B8;font-size:13px;line-height:1.6;">&#9200; ${expiry}${message ?? "If you didn&#39;t request this, no action is needed."}</p>
  </div>`;
}
