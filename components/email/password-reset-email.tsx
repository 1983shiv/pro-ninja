import { emailLayout, ctaButton, fallbackLink, expiryNote } from "./email-layout";

interface PasswordResetEmailProps {
  email: string;
  resetLink: string;
}

export function PasswordResetEmail({ email, resetLink }: PasswordResetEmailProps): string {
  return emailLayout(`
    <h1 style="margin:0 0 8px;color:#1E293B;font-size:24px;font-weight:700;letter-spacing:-0.5px;">Reset your password</h1>
    <p style="margin:0 0 24px;color:#475569;font-size:16px;line-height:1.7;">We received a request to reset the password for <strong style="color:#1E293B;">${email}</strong>. Click the button below to choose a new password.</p>
    ${ctaButton(resetLink, "Reset Password")}
    ${fallbackLink(resetLink)}
    ${expiryNote({ minutes: 10, message: "If you didn&#39;t request a password reset, you can safely ignore this email." })}
  `);
}
