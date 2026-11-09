import React from 'react';
import {
  GraduationCap,
  ShieldCheck,
  UserCheck,
  FileText,
  Calendar,
  ChevronDown,
  Search,
  Users,
  Globe
} from 'lucide-react';
import { User, ThemeMode } from '../types';
import { TabType } from './Sidebar';
import { ThemeSwitcher } from './ThemeSwitcher';

interface NavbarProps {
  currentUser: User;
  users: User[];
  onSwitchUser: (user: User) => void;
  dbStatus: { provider: string; connected: boolean };
  activeStudentsCount?: number;
  onNavigateTab?: (tab: TabType) => void;
  theme?: ThemeMode;
  resolvedTheme?: 'light' | 'dark';
  onThemeChange?: (theme: ThemeMode) => void;
  onToggleTheme?: () => void;
  onReturnToLanding?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  users,
  onSwitchUser,
  activeStudentsCount = 340,
  onNavigateTab,
  theme = 'system',
  resolvedTheme = 'light',
  onThemeChange = () => {},
  onToggleTheme = () => {},
  onReturnToLanding
}) => {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onNavigateTab) {
      onNavigateTab('enrolment');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-brand-800 dark:bg-brand-950 border-b border-white/5 shadow-[0_10px_30px_-15px_rgba(6,29,27,0.6)] w-full transition-colors duration-200">
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:22px_22px]" aria-hidden="true" />
      <div className="relative w-full px-2 sm:px-3 md:px-4 lg:px-5 xl:px-6 h-14 sm:h-16 flex items-center justify-between gap-1 sm:gap-2 md:gap-3 lg:gap-4 max-w-full">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3 shrink-0 min-w-0 flex-1 md:flex-initial">
          <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl rounded-tr-2xl sm:rounded-tr-2xl bg-accent-400 flex items-center justify-center text-brand-800 shadow-lg shadow-black/20 shrink-0">
            <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>

          <div className="min-w-0 flex-1 md:flex-initial">
            <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
              <span className="font-extrabold text-xs sm:text-sm md:text-base lg:text-lg text-white tracking-tight font-sans truncate">
                PCEA St Andrews <span className="text-accent-400 font-black">Kindergarten</span>
              </span>
              <span className="hidden xs:inline-flex sm:inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-white/10 text-accent-300 border border-white/15 shrink-0">
                SMS
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-white/55 font-medium hidden lg:block truncate">
              PCEA St Andrews Campus • Term 1, 2026 AY
            </p>
          </div>
        </div>

        {/* Center: Search in SMS Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex items-center flex-1 max-w-xs lg:max-w-sm mx-2 sm:mx-3 min-w-0"
        >
          <div className="w-full relative">
            <Search className="w-4 h-4 text-white/50 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search learners, grades, fees..."
              className="w-full pl-9 pr-14 py-1.5 sm:py-2 bg-white/10 hover:bg-white/15 focus:bg-white/15 border border-white/15 rounded-full text-xs text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent-400/40 focus:border-accent-400 transition-all"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1 pointer-events-none">
              <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-white/60 bg-white/10 border border-white/15 rounded-full">
                Enter ↵
              </kbd>
            </div>
          </div>
        </form>

        {/* Right Status Badges, Theme Toggle & User Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Public Landing Page Return Button */}
          {onReturnToLanding && (
            <button
              type="button"
              onClick={onReturnToLanding}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold text-brand-900 bg-accent-500 hover:bg-accent-400 shadow-lg shadow-black/20 transition-colors cursor-pointer shrink-0"
              title="Return to Public Landing Page"
            >
              <Globe className="w-3.5 h-3.5 shrink-0" />
              <span>Public Site</span>
            </button>
          )}

          {/* Theme Switcher Toggle (Light / Dark / Low-Light Night Mode) */}
          <ThemeSwitcher
            theme={theme}
            resolvedTheme={resolvedTheme}
            onThemeChange={onThemeChange}
            onToggleTheme={onToggleTheme}
            variant="compact"
            showLabel={false}
          />

          {/* Role Switcher Menu */}
          <div className="relative shrink-0">
            <button
              id="navbar-user-profile-btn"
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-1.5 sm:px-2 py-1.5 rounded-xl rounded-tr-2xl border border-white/15 bg-white/10 hover:bg-white/15 transition-colors text-left cursor-pointer shrink-0"
              aria-haspopup="true"
              aria-expanded={showDropdown}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shadow-2xs shrink-0 ${
                  currentUser.role === 'admin' ? 'bg-accent-400 text-brand-800' : 'bg-white text-brand-800'
                }`}
              >
                {currentUser.role === 'admin' ? (
                  <ShieldCheck className="w-4 h-4" />
                ) : (
                  <UserCheck className="w-4 h-4" />
                )}
              </div>
              <div className="hidden md:block max-w-[130px] lg:max-w-[160px] truncate">
                <div className="text-xs font-bold text-white leading-tight truncate">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-accent-300 font-semibold capitalize truncate">
                  {currentUser.role === 'admin' ? 'Administrator' : 'Class Teacher'}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-white/60 shrink-0" />
            </button>

            {/* Click-away backdrop */}
            {showDropdown && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowDropdown(false)}
                aria-hidden="true"
              />
            )}

            {/* User Switcher Dropdown */}
            {showDropdown && (
              <div
                id="navbar-user-dropdown"
                className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
              >
                <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                  <p className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Switch Active User & Role
                  </p>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {users.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        onSwitchUser(u);
                        setShowDropdown(false);
                      }}
                      className={`w-full px-3.5 py-2.5 text-left flex items-start gap-3 hover:bg-brand-50/50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer ${
                        u.id === currentUser.id ? 'bg-brand-50/70 dark:bg-slate-800/80 border-l-3 border-brand-500 font-medium' : ''
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5 ${
                          u.role === 'admin' ? 'bg-brand-500' : 'bg-brand-800 dark:bg-slate-700'
                        }`}
                      >
                        {u.role === 'admin' ? <ShieldCheck className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </div>
                      <div className="overflow-hidden min-w-0">
                        <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{u.name}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{u.title}</div>
                        <span
                          className={`inline-block mt-0.5 text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase ${
                            u.role === 'admin'
                              ? 'bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {u.role}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
