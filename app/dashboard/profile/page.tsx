'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Clock, Edit, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Profile form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  
  // Initialize form with session data
  useEffect(() => {
    if (session?.user) {
      const nameParts = session.user.name?.split(' ') || [];
      setFirstName(nameParts[0] || '');
      setLastName(nameParts.slice(1).join(' ') || '');
      setEmail(session.user.email || '');
    }
  }, [session]);
  
  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const handleProfileSave = async () => {
    setLoading(true);
    try {
      // TODO: Implement API call to update profile
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`,
          email,
        }),
      });
      
      if (!response.ok) throw new Error('Failed to update profile');
      
      // Show success message
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordChange = async () => {
    setPasswordError('');
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }
    
    setLoading(true);
    try {
      // TODO: Implement API call to change password
      const response = await fetch('/api/user/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to change password');
      }
      
      // Clear form and show success
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      alert('Password changed successfully!');
    } catch (error: any) {
      setPasswordError(error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Account Settings
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Manage your profile, security preferences, and notification settings.
          </p>
        </div>

        {/* Main Form Content */}
        <div className="space-y-8">
          {/* Profile Section */}
          <div className="bg-white dark:bg-[#1e162e] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
                Profile Details
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Update your photo and personal details here.
              </p>
            </div>
            
            <div className="p-6 sm:p-8 space-y-8">
              {/* Avatar Upload */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 border-4 border-white dark:border-slate-700 shadow-md overflow-hidden flex items-center justify-center text-white text-3xl font-bold">
                    {session?.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user?.name || 'User'}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{session?.user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                    )}
                  </div>
                  <button
                    className="absolute bottom-0 right-0 p-1.5 bg-[#5b13ec] text-white rounded-full shadow-lg hover:bg-[#5b13ec]/90 transition-colors border-2 border-white dark:border-slate-800"
                    title="Upload new photo"
                  >
                    <Edit className="w-[18px] h-[18px]" />
                  </button>
                </div>
                <div className="flex flex-col items-center sm:items-start pt-2">
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      Change Avatar
                    </Button>
                    <Button
                      variant="outline"
                      className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      Remove
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    JPG, GIF or PNG. Max size of 800K
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="w-5 h-5 text-slate-400" />
                    </div>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="pl-10 h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="w-5 h-5 text-slate-400" />
                    </div>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="pl-10 h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-slate-400" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11"
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    This email will be used for account notifications and login.
                  </p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label
                    htmlFor="timezone"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Timezone
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                      <Clock className="w-5 h-5 text-slate-400" />
                    </div>
                    <select
                      id="timezone"
                      className="pl-10 block w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm focus:border-[#5b13ec] focus:ring-[#5b13ec] text-sm h-11"
                    >
                      <option>Pacific Standard Time (PST) - UTC-08:00</option>
                      <option>Eastern Standard Time (EST) - UTC-05:00</option>
                      <option>Greenwich Mean Time (GMT) - UTC+00:00</option>
                      <option>Central European Time (CET) - UTC+01:00</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 dark:bg-[#151021]/50 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  const nameParts = session?.user?.name?.split(' ') || [];
                  setFirstName(nameParts[0] || '');
                  setLastName(nameParts.slice(1).join(' ') || '');
                  setEmail(session?.user?.email || '');
                }}
                className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleProfileSave}
                disabled={loading}
                className="px-6 py-2 bg-[#5b13ec] hover:bg-[#5b13ec]/90 text-white rounded-lg text-sm font-bold shadow-sm"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-white dark:bg-[#1e162e] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
                Security
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Manage your password and 2-step verification methods.
              </p>
            </div>
            
            <div className="p-6 sm:p-8 space-y-8">
              {/* Password Change */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Password
                </h4>
                {passwordError && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                    {passwordError}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Current Password
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      New Password
                    </label>
                    <Input 
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Confirm Password
                    </label>
                    <Input 
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-11"
                    />
                  </div>
                </div>
                <Button
                  onClick={handlePasswordChange}
                  disabled={loading || !currentPassword || !newPassword || !confirmPassword}
                  className="bg-[#5b13ec] hover:bg-[#5b13ec]/90 text-white"
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </Button>
              </div>

              <hr className="border-slate-200 dark:border-slate-800" />

              {/* 2FA Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  <div className="p-2 bg-[#5b13ec]/10 rounded-lg h-fit">
                    <Smartphone className="w-5 h-5 text-[#5b13ec]" />
                  </div>
                  <div>
                    <h4 className="text-base font-medium text-slate-900 dark:text-white">
                      Two-Factor Authentication
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md">
                      Add an extra layer of security to your account. We'll send a code to your mobile device.
                    </p>
                  </div>
                </div>
                {/* Toggle Switch */}
                <button
                  onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#5b13ec] focus:ring-offset-2 ${
                    twoFactorEnabled ? 'bg-[#5b13ec]' : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                  role="switch"
                  aria-checked={twoFactorEnabled}
                >
                  <span
                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Email Preferences */}
          <div className="bg-white dark:bg-[#1e162e] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
                Email Preferences
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Control which emails you receive from us.
              </p>
            </div>
            
            <div className="p-6 sm:p-8 space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 rounded text-[#5b13ec] focus:ring-[#5b13ec] border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                />
                <div>
                  <span className="block text-sm font-medium text-slate-900 dark:text-white">
                    Security Alerts
                  </span>
                  <span className="block text-xs text-slate-500">
                    Get notified about login attempts and password changes.
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 rounded text-[#5b13ec] focus:ring-[#5b13ec] border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                />
                <div>
                  <span className="block text-sm font-medium text-slate-900 dark:text-white">
                    Product Updates
                  </span>
                  <span className="block text-xs text-slate-500">
                    Stay up to date with the latest features and improvements.
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded text-[#5b13ec] focus:ring-[#5b13ec] border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                />
                <div>
                  <span className="block text-sm font-medium text-slate-900 dark:text-white">
                    Marketing & Tips
                  </span>
                  <span className="block text-xs text-slate-500">
                    Receive tips on how to get the most out of AI ReviewSense.
                  </span>
                </div>
              </label>
            </div>

            <div className="px-6 py-4 bg-slate-50 dark:bg-[#151021]/50 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <Button className="px-6 py-2 bg-[#5b13ec] hover:bg-[#5b13ec]/90 text-white rounded-lg text-sm font-bold shadow-sm">
                Save Preferences
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
