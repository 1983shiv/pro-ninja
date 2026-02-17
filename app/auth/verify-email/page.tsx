'use client';

import { useState, useEffect } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AuthLayoutSplit } from '@/components/auth/auth-layout-split';

export default function VerifyEmailPage() {
  const [isVerified, setIsVerified] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    // Check URL for verification token and verify
    // This is a placeholder for actual verification logic
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      // Simulate verification
      setTimeout(() => setIsVerified(true), 1500);
    }
  }, []);

  const handleResendEmail = async () => {
    setIsResending(true);
    // Handle resend logic
    setTimeout(() => setIsResending(false), 2000);
  };

  return (
    <AuthLayoutSplit>
      {!isVerified ? (
        <>
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Verify Your Email</h2>
            <p className="text-slate-600">
              We sent a verification email to
            </p>
            <p className="text-slate-900 font-medium mt-1">your@email.com</p>
          </div>

          <div className="space-y-5">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-600 space-y-3">
              <p>Please check your inbox and click the verification link to activate your account.</p>
              <div className="flex items-center gap-2 text-slate-500">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                <span>Check your spam folder if you don't see it</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                <span>The link will expire in 24 hours</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-slate-600 mb-3">
                Didn't receive the email?
              </p>
              <Button
                onClick={handleResendEmail}
                disabled={isResending}
                variant="outline"
                className="w-full h-12"
              >
                {isResending ? 'Sending...' : 'Resend Verification Email'}
              </Button>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <Link
                href="/auth/signin"
                className="text-sm text-indigo-600 hover:text-indigo-500 font-medium block text-center"
              >
                Back to sign in
              </Link>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Email Verified!</h2>
            <p className="text-slate-600">
              Your email has been successfully verified. You can now access your account.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              asChild
              className="w-full h-12 ai-gradient-bg text-white"
            >
              <Link href="/dashboard">
                Go to Dashboard
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="w-full h-12"
            >
              <Link href="/auth/signin">
                Sign In
              </Link>
            </Button>
          </div>
        </>
      )}
    </AuthLayoutSplit>
  );
}
