'use client';

import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { AuthLayoutSplit } from '@/components/auth/auth-layout-split';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Registration failed');
                setLoading(false);
                return;
            }

            // Redirect to sign in page
            router.push('/signin?registered=true');
        } catch (error) {
            setError('An error occurred. Please try again.');
            setLoading(false);
        }
    };

    const handleOAuthSignIn = async (provider: 'google' | 'github') => {
        setLoading(true);
        await signIn(provider, { callbackUrl: '/dashboard' });
    };

    return (
        <AuthLayoutSplit>
            <div className="text-center mb-5">
                <h2 className="text-2xl font-bold text-slate-900 mb-1">
                    Create Account
                </h2>
                <p className="text-sm text-slate-600">
                    Get started with your 14-day free trial
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
                {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded">
                    {error}
                </div>
                )}
                {/* Full Name Field */}
                <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-slate-700 mb-1"
                    >
                        Full name
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="w-5 h-5 text-slate-400" />
                        </div>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            placeholder="John Doe"
                            className="pl-10 h-10"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                </div>

                {/* Email Field */}
                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-slate-700 mb-1"
                    >
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
                            placeholder="you@example.com"
                            className="pl-10 h-10"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                {/* Password Field */}
                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-slate-700 mb-1"
                    >
                        Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="w-5 h-5 text-slate-400" />
                        </div>
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            placeholder="Create a strong password"
                            className="pl-10 pr-10 h-10"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5 text-slate-400 hover:text-slate-600" />
                            ) : (
                                <Eye className="w-5 h-5 text-slate-400 hover:text-slate-600" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                    <label
                        htmlFor="confirm-password"
                        className="block text-sm font-medium text-slate-700 mb-1"
                    >
                        Confirm password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="w-5 h-5 text-slate-400" />
                        </div>
                        <Input
                            id="confirm-password"
                            name="confirm-password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            placeholder="Confirm your password"
                            className="pl-10 pr-10 h-10"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="w-5 h-5 text-slate-400 hover:text-slate-600" />
                            ) : (
                                <Eye className="w-5 h-5 text-slate-400 hover:text-slate-600" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Terms Agreement */}
                <div className="flex items-start">
                    <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        required
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded cursor-pointer mt-1"
                    />
                    <label
                        htmlFor="terms"
                        className="ml-2 block text-sm text-slate-600"
                    >
                        I agree to the{' '}
                        <Link
                            href="/terms"
                            className="text-indigo-600 hover:text-indigo-500"
                        >
                            Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link
                            href="/privacy"
                            className="text-indigo-600 hover:text-indigo-500"
                        >
                            Privacy Policy
                        </Link>
                    </label>
                </div>

                {/* Submit Button */}
                <div>
                    <Button
                        type="submit"
                        className="w-full h-10 ai-gradient-bg text-white hover:opacity-90 transition-all duration-200 transform hover:scale-[1.01]"
                    >
                        Create Account
                    </Button>
                </div>
            </form>

            {/* Divider */}
            <div className="mt-5 relative">
                <div
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center"
                >
                    <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-slate-500 uppercase tracking-wider text-xs">
                        Or sign up with
                    </span>
                </div>
            </div>

            {/* Social Login Buttons */}
            <div className="mt-5 grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center px-4 py-2.5 border border-slate-200 rounded-lg shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors" onClick={() => handleOAuthSignIn('google')}
                    disabled={loading} >
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Google
                </button>

                <button className="flex items-center justify-center px-4 py-2.5 border border-slate-800 rounded-lg shadow-sm bg-slate-900 text-sm font-medium text-white hover:bg-slate-800 transition-colors" onClick={() => handleOAuthSignIn('google')}
                    disabled={loading}>
                    <svg
                        className="h-5 w-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fillRule="evenodd"
                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                            clipRule="evenodd"
                        />
                    </svg>
                    GitHub
                </button>
            </div>

            {/* Sign In Link */}
            <p className="mt-5 text-center text-sm text-slate-600">
                Already have an account?{' '}
                <Link
                    href="/signin"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                    Sign in
                </Link>
            </p>
        </AuthLayoutSplit>
    );
}
