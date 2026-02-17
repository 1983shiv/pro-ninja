'use client';

import { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { AuthLayoutSplit } from '@/components/auth/auth-layout-split';

export default function ForgotPasswordPage() {
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle forgot password logic
    setEmailSent(true);
  };

  return (
    <AuthLayoutSplit>
      {!emailSent ? (
        <>
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to sign in
          </Link>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Forgot Password?</h2>
            <p className="text-slate-600">
              No worries, we'll send you reset instructions.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-slate-400" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-10 h-12"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                className="w-full h-12 ai-gradient-bg text-white hover:opacity-90 transition-all duration-200 transform hover:scale-[1.01]"
              >
                Send Reset Link
              </Button>
            </div>
          </form>
        </>
      ) : (
        <>
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Check Your Email</h2>
            <p className="text-slate-600">
              We sent a password reset link to
            </p>
            <p className="text-slate-900 font-medium mt-1">{email}</p>
          </div>

          <div className="space-y-5">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-600">
              <p className="mb-2">Didn't receive the email? Check your spam folder or</p>
              <button
                onClick={() => setEmailSent(false)}
                className="text-indigo-600 hover:text-indigo-500 font-medium"
              >
                try another email address
              </button>
            </div>

            <Button
              asChild
              variant="outline"
              className="w-full h-12"
            >
              <Link href="/auth/signin">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to sign in
              </Link>
            </Button>
          </div>
        </>
      )}
    </AuthLayoutSplit>
  );
}
