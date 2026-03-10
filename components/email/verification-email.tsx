import { emailLayout, ctaButton, fallbackLink, expiryNote } from "./email-layout";

interface VerificationEmailProps {
  confirmLink: string;
}

export function VerificationEmail({ confirmLink }: VerificationEmailProps): string {
  return emailLayout(`
    <h1 style="margin:0 0 8px;color:#1E293B;font-size:24px;font-weight:700;letter-spacing:-0.5px;">Verify your email address</h1>
    <p style="margin:0 0 24px;color:#475569;font-size:16px;line-height:1.7;">Welcome to AI ReviewSense! Please confirm your email address to activate your account and start managing your reviews.</p>
    ${ctaButton(confirmLink, "Verify Email Address")}
    ${fallbackLink(confirmLink)}
    ${expiryNote({ hours: 24, message: "If you didn&#39;t create an account, no action is needed." })}
  `);
}
