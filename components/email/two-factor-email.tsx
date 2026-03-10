import { emailLayout, expiryNote } from "./email-layout";

interface TwoFactorEmailProps {
  token: string;
}

export function TwoFactorEmail({ token }: TwoFactorEmailProps): string {
  return emailLayout(`
    <h1 style="margin:0 0 8px;color:#1E293B;font-size:24px;font-weight:700;letter-spacing:-0.5px;">Your two-factor authentication code</h1>
    <p style="margin:0 0 24px;color:#475569;font-size:16px;line-height:1.7;">Use the code below to complete your sign-in to AI ReviewSense.</p>
    <div style="background:linear-gradient(135deg,#EEF2FF 0%,#F5F3FF 100%);border:2px solid #C7D2FE;border-radius:12px;padding:24px 32px;margin:0 0 24px;text-align:center;">
      <p style="margin:0 0 4px;color:#6366F1;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Authentication Code</p>
      <p style="margin:0;color:#312E81;font-size:40px;font-weight:800;letter-spacing:8px;font-family:monospace;">${token}</p>
    </div>
    ${expiryNote({ minutes: 10, message: "Never share this code with anyone." })}
  `);
}
