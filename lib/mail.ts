import { Resend } from "resend";
import { VerificationEmail } from "@/components/email/verification-email";
import { PasswordResetEmail } from "@/components/email/password-reset-email";
import { TwoFactorEmail } from "@/components/email/two-factor-email";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;


export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  const html = TwoFactorEmail({ token });
  const { data, error } = await resend.emails.send({
    from: "sales@optionkart.com",
    to: email,
    subject: "Your AI ReviewSense 2FA Code",
    html,
  });
  if (error) throw error;
  return data;
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/new-password?token=${token}`;
  const html = PasswordResetEmail({ email, resetLink });
  const { data, error } = await resend.emails.send({
    from: "sales@optionkart.com",
    to: email,
    subject: "Reset your AI ReviewSense password",
    html,
  });
  if (error) throw error;
  return data;
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/new-verification?token=${token}`;
  const html = VerificationEmail({ confirmLink });
  const { data, error } = await resend.emails.send({
    from: "sales@optionkart.com",
    to: email,
    subject: "Verify your AI ReviewSense account",
    html,
  });
  if (error) throw error;
  return data;
};


