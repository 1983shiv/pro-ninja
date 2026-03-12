import { emailLayout, ctaButton } from "./email-layout";

interface WelcomeEmailProps {
  name: string;
  licenseKey: string;
  dashboardUrl: string;
}

export function WelcomeEmail({ name, licenseKey, dashboardUrl }: WelcomeEmailProps): string {
  return emailLayout(`
    <h1 style="margin:0 0 8px;color:#1E293B;font-size:24px;font-weight:700;letter-spacing:-0.5px;">Welcome to AI ReviewSense! 🎉</h1>
    <p style="margin:0 0 24px;color:#475569;font-size:16px;line-height:1.7;">Hi ${name}, your account is verified and your free license is ready. Start analyzing your WooCommerce reviews in minutes.</p>

    <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:10px;padding:24px;margin-bottom:28px;">
      <p style="margin:0 0 8px;color:#64748B;font-size:13px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;">Your License Key</p>
      <p style="margin:0 0 12px;font-family:monospace;font-size:20px;font-weight:700;color:#4F46E5;letter-spacing:2px;">${licenseKey}</p>
      <p style="margin:0;color:#94A3B8;font-size:13px;line-height:1.6;">Copy this key and paste it into your WordPress plugin under <strong>AI ReviewSense → License</strong>.</p>
    </div>

    <div style="margin-bottom:28px;">
      <p style="margin:0 0 12px;color:#1E293B;font-size:15px;font-weight:600;">Free Plan Includes:</p>
      <table cellpadding="0" cellspacing="0" style="width:100%;">
        <tr><td style="padding:6px 0;color:#475569;font-size:14px;">✅ &nbsp;25 reviews analyzed per month</td></tr>
        <tr><td style="padding:6px 0;color:#475569;font-size:14px;">✅ &nbsp;AI sentiment analysis</td></tr>
        <tr><td style="padding:6px 0;color:#475569;font-size:14px;">✅ &nbsp;Basic review insights dashboard</td></tr>
        <tr><td style="padding:6px 0;color:#94A3B8;font-size:14px;">🔒 &nbsp;Auto-reply (upgrade to unlock)</td></tr>
        <tr><td style="padding:6px 0;color:#94A3B8;font-size:14px;">🔒 &nbsp;Advanced AI models (upgrade to unlock)</td></tr>
      </table>
    </div>

    ${ctaButton(dashboardUrl, "Go to Your Dashboard")}

    <div style="border-top:1px solid #E2E8F0;padding-top:20px;margin-top:8px;">
      <p style="margin:0;color:#94A3B8;font-size:13px;line-height:1.6;">Need help? Reply to this email or visit your dashboard. Keep your license key safe — you'll need it to activate the plugin.</p>
    </div>
  `);
}
