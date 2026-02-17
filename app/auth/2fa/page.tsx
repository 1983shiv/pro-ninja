'use client';

import { useState, useRef, useEffect } from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AuthLayoutSplit } from '@/components/auth/auth-layout-split';

export default function TwoFactorAuthPage() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0];
    }

    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = [...code];
    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }
    setCode(newCode);

    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.some(digit => !digit)) return;

    setIsVerifying(true);
    // Handle 2FA verification logic
    setTimeout(() => {
      setIsVerifying(false);
      // Redirect to dashboard or show error
    }, 1500);
  };

  const handleResendCode = () => {
    // Handle resend logic
    setCode(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  return (
    <AuthLayoutSplit>
      <Link
        href="/auth/signin"
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to sign in
      </Link>

      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
          <Shield className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Two-Factor Authentication</h2>
        <p className="text-slate-600">
          Enter the 6-digit code from your authenticator app
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 6-Digit Code Input */}
        <div>
          <div className="flex gap-2 justify-center">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={el => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(index, e.target.value)}
                onKeyDown={e => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-slate-200 rounded-lg focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none transition-colors"
                required
              />
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <Button
            type="submit"
            disabled={isVerifying || code.some(digit => !digit)}
            className="w-full h-12 ai-gradient-bg text-white hover:opacity-90 transition-all duration-200 disabled:opacity-50"
          >
            {isVerifying ? 'Verifying...' : 'Verify Code'}
          </Button>
        </div>

        {/* Resend Code */}
        <div className="text-center">
          <p className="text-sm text-slate-600 mb-2">
            Didn't receive a code?
          </p>
          <button
            type="button"
            onClick={handleResendCode}
            className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Resend Code
          </button>
        </div>
      </form>

      {/* Help Text */}
      <div className="mt-8 bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-600">
        <p className="font-medium text-slate-900 mb-2">Having trouble?</p>
        <ul className="space-y-1.5">
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-1.5"></div>
            <span>Make sure your device time is synced correctly</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-1.5"></div>
            <span>Use backup codes if you lost access to your authenticator</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-1.5"></div>
            <span>
              <Link href="/support" className="text-indigo-600 hover:text-indigo-500">
                Contact support
              </Link>
              {' '}for additional help
            </span>
          </li>
        </ul>
      </div>
    </AuthLayoutSplit>
  );
}
