/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ArrowLeft,
  ShieldCheck,
  Users,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { User, UserRole } from '../types';

const TEAL = '#0D3B36';
const AMBER = '#FFAE00';

interface LoginPageProps {
  users: User[];
  /** Optional role preselected from the landing page CTA */
  preselectedRole?: UserRole;
  onLogin: (user: User) => void;
  onBackToLanding: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  users,
  preselectedRole,
  onLogin,
  onBackToLanding,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roleTab, setRoleTab] = useState<UserRole>(preselectedRole ?? 'admin');

  const demoUsersForRole = users.filter((u) => u.role === roleTab);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setError('Please enter your staff email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsSubmitting(true);

    // Simulate authentication latency
    await new Promise((resolve) => setTimeout(resolve, 650));

    const matchedUser = users.find(
      (u) => u.email.toLowerCase() === trimmedEmail
    );

    if (!matchedUser) {
      setIsSubmitting(false);
      setError('No staff account found with that email address.');
      return;
    }

    setIsSubmitting(false);
    onLogin(matchedUser);
  };

  const handleQuickFill = (user: User) => {
    setEmail(user.email);
    setPassword('demo1234');
    setError(null);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col lg:flex-row font-sans antialiased"
      style={{ backgroundColor: TEAL }}
    >
      {/* ---- Left branding panel (desktop) ---- */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between overflow-hidden p-12 text-white">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -left-32 top-24 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-[420px] w-[420px] rounded-full bg-teal-300/10 blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FFAE00]/60 to-transparent" />
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={onBackToLanding}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-emerald-100 transition-colors hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Website
          </button>
        </div>

        <div className="relative max-w-md space-y-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-300/30 to-teal-500/20 ring-1 ring-white/20">
            <GraduationCap className="h-9 w-9" style={{ color: AMBER }} aria-hidden="true" />
          </div>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight">
            PCEA St Andrews
            <span className="block text-emerald-300">Kindergarten Portal</span>
          </h1>
          <p className="text-base leading-relaxed text-emerald-100/80">
            Staff access to enrolment, CBC grading, fee management, timetables,
            report cards, and the school calendar — all in one secure system.
          </p>
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Authorised staff only · Encrypted session
          </div>
        </div>

        <p className="relative text-xs text-emerald-100/50">
          © {new Date().getFullYear()} PCEA St Andrews Kindergarten · kindergarten.pceastandrews.org
        </p>
      </div>

      {/* ---- Right form panel ---- */}
      <div className="flex flex-1 items-center justify-center bg-slate-50 p-4 sm:p-8 lg:rounded-l-[3rem]">
        <div className="w-full max-w-md">
          {/* Mobile back link + logo */}
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <button
              type="button"
              onClick={onBackToLanding}
              className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Back
            </button>
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: TEAL }}
            >
              <GraduationCap className="h-6 w-6" style={{ color: AMBER }} aria-hidden="true" />
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Staff Sign In
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Sign in to access the school management system.
            </p>
          </div>

          {/* Role tabs */}
          <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1.5" role="tablist">
            {(['admin', 'teacher'] as UserRole[]).map((role) => (
              <button
                key={role}
                type="button"
                role="tab"
                aria-selected={roleTab === role}
                onClick={() => setRoleTab(role)}
                className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
                  roleTab === role
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {role === 'admin' ? (
                  <ShieldCheck className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                ) : (
                  <Users className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                )}
                {role === 'admin' ? 'Administrator' : 'Teacher'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
                Staff Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null); }}
                  placeholder="you@pceastandrews.org"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none ring-emerald-500/30 transition focus:border-emerald-500 focus:ring-4"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="login-password" className="block text-xs font-bold uppercase tracking-wide text-slate-600">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setError('Please contact the system administrator to reset your password.')}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-11 text-sm text-slate-900 placeholder-slate-400 outline-none ring-emerald-500/30 transition focus:border-emerald-500 focus:ring-4"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition-colors hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                </button>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              style={{ backgroundColor: TEAL }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Signing in…
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" aria-hidden="true" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Demo accounts */}
          {demoUsersForRole.length > 0 && (
            <div className="mt-8">
              <div className="mb-3 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Demo accounts
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>
              <div className="space-y-2">
                {demoUsersForRole.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleQuickFill(user)}
                    className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left transition-all hover:border-emerald-300 hover:bg-emerald-50/50"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-xs font-bold text-white">
                      {user.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-800">{user.name}</p>
                      <p className="truncate text-xs text-slate-500">{user.title} · {user.email}</p>
                    </div>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-center text-[11px] text-slate-400">
                Click a demo account to pre-fill credentials, then press Sign In.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
