'use client';

import { useState } from 'react';
import { Download, FileText, ShieldCheck, History, Bug, Star, Shield, BookOpen, Code, MessageSquare, Headphones, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DownloadsPage() {
  const [selectedVersion, setSelectedVersion] = useState('');

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-10">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* Left Column: Main Downloads */}
          <div className="flex flex-col gap-8">
            {/* Page Header */}
            <div className="flex flex-col gap-2">
              <h1 className="text-slate-900 text-4xl font-black leading-tight tracking-tight">
                Plugin Downloads
              </h1>
              <p className="text-slate-500 text-base font-normal leading-normal max-w-2xl">
                Download the latest stable version of the WP AI Review plugin. Access powerful features to
                automate your WordPress reviews.
              </p>
            </div>

            {/* Latest Release Card */}
            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md group">
              {/* Decorative bg accent */}
              <div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-indigo-600/5 blur-3xl"></div>

              <div className="relative flex flex-col md:flex-row p-6 gap-6">
                {/* Thumbnail */}
                <div className="w-full md:w-64 h-48 md:h-auto shrink-0 bg-gray-100 rounded-lg overflow-hidden relative border border-gray-200">
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/10 to-transparent"></div>
                  <div
                    className="w-full h-full bg-center bg-no-repeat bg-cover"
                    style={{
                      backgroundImage:
                        'url("https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop")',
                    }}
                  ></div>
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded text-indigo-600">
                    STABLE
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 justify-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center rounded-full bg-indigo-600/10 px-2.5 py-0.5 text-xs font-medium text-indigo-600">
                        Latest Release
                      </span>
                      <span className="text-xs text-gray-500">Released Oct 24, 2023</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      WordPress AI Review Plugin v2.4.1
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">SHA-256: 8f4b...3a1c • Size: 2.4 MB</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <Button className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-lg shadow-indigo-600/20">
                      <Download className="w-5 h-5" />
                      Download .zip File
                    </Button>
                    <button className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-slate-900 font-medium py-2.5 px-4 rounded-lg transition-all">
                      <FileText className="w-5 h-5" />
                      View Documentation
                    </button>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Virus Scanned &amp; Verified
                  </div>
                </div>
              </div>
            </div>

            {/* Changelog Section */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <History className="w-5 h-5 text-indigo-600" />
                  Changelog
                </h2>
                <a className="text-sm font-medium text-indigo-600 hover:text-indigo-700" href="#">
                  View all updates
                </a>
              </div>

              <div className="relative pl-2">
                {/* Vertical Line */}
                <div className="absolute top-3 bottom-0 left-[21px] w-[2px] bg-slate-200"></div>

                {/* Item 1 */}
                <div className="relative grid grid-cols-[40px_1fr] gap-x-4 mb-8 group">
                  <div className="flex flex-col items-center">
                    <div className="z-10 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600/10 text-indigo-600 ring-4 ring-white">
                      <Bug className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="pt-1.5">
                    <div className="flex flex-wrap justify-between items-baseline gap-2 mb-1">
                      <h3 className="text-lg font-bold text-slate-900">v2.4.1 - Bug Fixes</h3>
                      <time className="text-sm font-medium text-gray-500">Oct 24, 2023</time>
                    </div>
                    <p className="text-slate-500 text-sm mb-3">
                      Addressed critical timeout issues on slower hosting environments.
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-1">
                      <li>Fixed API timeout issue on slow servers.</li>
                      <li>Resolved conflict with Elementor Pro popups.</li>
                      <li>Improved error handling for failed AI requests.</li>
                    </ul>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="relative grid grid-cols-[40px_1fr] gap-x-4 mb-8 group">
                  <div className="flex flex-col items-center">
                    <div className="z-10 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 ring-4 ring-white">
                      <Star className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="pt-1.5">
                    <div className="flex flex-wrap justify-between items-baseline gap-2 mb-1">
                      <h3 className="text-lg font-bold text-slate-900">v2.4.0 - Feature Release</h3>
                      <time className="text-sm font-medium text-gray-500">Sep 15, 2023</time>
                    </div>
                    <p className="text-slate-500 text-sm mb-3">
                      Major update introducing the new sentiment analysis engine.
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-1">
                      <li>
                        <strong>New:</strong> Sentiment analysis module for user comments.
                      </li>
                      <li>Added bulk action support for review approval.</li>
                      <li>Updated admin dashboard UI for better accessibility.</li>
                    </ul>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="relative grid grid-cols-[40px_1fr] gap-x-4 group">
                  <div className="flex flex-col items-center">
                    <div className="z-10 flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 ring-4 ring-white">
                      <Shield className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="pt-1.5">
                    <div className="flex flex-wrap justify-between items-baseline gap-2 mb-1">
                      <h3 className="text-lg font-bold text-slate-900">v2.3.5 - Security Patch</h3>
                      <time className="text-sm font-medium text-gray-500">Aug 30, 2023</time>
                    </div>
                    <p className="text-slate-500 text-sm mb-3">
                      Critical security update recommended for all users.
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-1">
                      <li>Patched XSS vulnerability in the review submission form.</li>
                      <li>Hardened API endpoint authentication.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <aside className="flex flex-col gap-6">
            {/* Legacy Versions */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-base font-bold text-slate-900 mb-1">Legacy Versions</h3>
              <p className="text-xs text-gray-500 mb-4">Need an older version for compatibility?</p>
              <div className="relative">
                <select
                  className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 focus:border-indigo-600"
                  value={selectedVersion}
                  onChange={(e) => setSelectedVersion(e.target.value)}
                >
                  <option value="">Select a version...</option>
                  <option value="2.3.4">v2.3.4 (July 2023)</option>
                  <option value="2.3.0">v2.3.0 (June 2023)</option>
                  <option value="2.2.0">v2.2.0 (May 2023)</option>
                  <option value="2.0.0">v2.0.0 (Jan 2023)</option>
                  <option value="1.5.0">v1.5.0 (Nov 2022)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <ChevronDown className="w-5 h-5" />
                </div>
              </div>
              <button
                className="mt-3 w-full text-center text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedVersion}
              >
                Download Selected
              </button>
            </div>

            {/* Helpful Resources */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-base font-bold text-slate-900 mb-4">Resources</h3>
              <ul className="flex flex-col gap-3">
                <li>
                  <a className="flex items-center gap-3 group" href="#">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 group-hover:bg-indigo-600/10 transition-colors text-gray-500 group-hover:text-indigo-600">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-600 group-hover:text-indigo-600 transition-colors">
                      Installation Guide
                    </span>
                  </a>
                </li>
                <li>
                  <a className="flex items-center gap-3 group" href="#">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 group-hover:bg-indigo-600/10 transition-colors text-gray-500 group-hover:text-indigo-600">
                      <Code className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-600 group-hover:text-indigo-600 transition-colors">
                      API Documentation
                    </span>
                  </a>
                </li>
                <li>
                  <a className="flex items-center gap-3 group" href="#">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 group-hover:bg-indigo-600/10 transition-colors text-gray-500 group-hover:text-indigo-600">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-600 group-hover:text-indigo-600 transition-colors">
                      Community Forums
                    </span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Support Card */}
            <div className="rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white shadow-sm">
              <div className="mb-3 w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                <Headphones className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold mb-1">Need help installing?</h3>
              <p className="text-xs text-gray-300 mb-4">
                Our support team is available 24/7 to help you get started.
              </p>
              <button className="w-full rounded-lg bg-indigo-600 py-2 text-sm font-bold text-white hover:bg-indigo-700 transition-colors">
                Contact Support
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
