import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Award,
  CalendarDays,
  FileSpreadsheet,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  Check,
  X,
  Globe
} from 'lucide-react';
import { UserRole, ThemeMode } from '../types';
import { ThemeSwitcher } from './ThemeSwitcher';

export type TabType =
  | 'dashboard'
  | 'enrolment'
  | 'fees'
  | 'grading'
  | 'timetable'
  | 'reports'
  | 'website-cms';

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  userRole: UserRole;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  theme?: ThemeMode;
  resolvedTheme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  onThemeChange?: (mode: ThemeMode) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  userRole,
  isCollapsed = false,
  onToggleCollapse,
  theme = 'system',
  resolvedTheme = 'light',
  onToggleTheme,
  onThemeChange
}) => {
  const [topDropdownOpen, setTopDropdownOpen] = useState(false);

  const sections = [
    {
      title: 'MAIN MENU',
      items: [
        {
          id: 'dashboard' as TabType,
          label: 'Admin Dashboard',
          shortLabel: 'Dashboard',
          subLabel: 'Operations Overview',
          icon: LayoutDashboard,
          roles: ['admin', 'teacher'] as UserRole[]
        },
        {
          id: 'enrolment' as TabType,
          label: 'Student Directory',
          shortLabel: 'Students',
          subLabel: 'Learner records',
          icon: Users,
          roles: ['admin', 'teacher'] as UserRole[]
        }
      ]
    },

    {
      title: 'FINANCE & OPERATIONS',
      items: [
        {
          id: 'fees' as TabType,
          label: 'Learner Fees & Arrears',
          shortLabel: 'Fees',
          subLabel: 'Receipts & Collection Ledgers',
          icon: CreditCard,
          roles: ['admin'] as UserRole[]
        }
      ]
    },
    {
      title: 'ADMINISTRATION',
      items: [
        {
          id: 'website-cms' as TabType,
          label: 'Website CMS',
          shortLabel: 'Web CMS',
          subLabel: 'Landing Page & Content',
          icon: Globe,
          roles: ['admin'] as UserRole[]
        },
      ]
    }
  ];

  // All items accessible to the active user role
  const allAccessibleItems = sections
    .flatMap((sec) => sec.items)
    .filter((item) => item.roles.includes(userRole));

  // Core primary tabs displayed directly on the middle navbar
  const primaryTabIds: TabType[] = ['dashboard', 'enrolment', 'grading'];

  // 1. Items rendered directly as pills on the middle navbar
  const navbarItems = allAccessibleItems.filter((item) =>
    primaryTabIds.includes(item.id)
  );

  // 2. Simplified secondary items rendered in "More" (strictly NOT repeating what is on the middle navbar)
  const dropdownItems = allAccessibleItems.filter(
    (item) => !primaryTabIds.includes(item.id)
  );

  // Check if current tab is one of the dropdown items
  const activeDropdownItem = dropdownItems.find((item) => item.id === currentTab);
  const handleTabClick = (tabId: TabType) => {
    onSelectTab(tabId);
    setTopDropdownOpen(false);
  };

  // Simplified dropdown menu content without repeating middle navbar items and without blur
  const renderDropdownContent = () => (
    <div className="p-1 space-y-1">
      <div className="px-3 py-1.5 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span>More Modules</span>
        <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
          {userRole === 'admin' ? 'Administrator' : 'Class Teacher'}
        </span>
      </div>

      <div className="py-1 space-y-0.5">
        {dropdownItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={`dropdown-item-${item.id}`}
              id={`dropdown-module-${item.id}`}
              type="button"
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                isActive
                  ? 'bg-orange-500 text-white font-semibold shadow-xs'
                  : 'text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                  }`}
                />
                <span className="text-xs font-semibold truncate">{item.label}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-2">
                {isActive && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Theme Switcher Quick Toggle in Mobile Drawer */}
      <div className="pt-2 mt-1 border-t border-slate-100 dark:border-slate-800 px-2 flex items-center justify-between">
        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
          Theme Mode
        </span>
        <ThemeSwitcher
          theme={theme}
          resolvedTheme={resolvedTheme}
          onThemeChange={onThemeChange || (() => {})}
          onToggleTheme={onToggleTheme}
          variant="compact"
          showLabel={true}
        />
      </div>
    </div>
  );

  return (
    <nav
      id="floating-bottom-nav"
      aria-label="School navigation"
      className="fixed bottom-3 left-1/2 z-50 -translate-x-1/2 w-[calc(100%-1rem)] max-w-4xl px-1"
    >
      <div className="flex items-center justify-center rounded-full border border-slate-200/80 bg-white/90 dark:border-slate-700 dark:bg-slate-950/90 p-1.5 shadow-[0_18px_45px_rgba(15,23,42,0.18)] backdrop-blur-xl">
        <div className="flex max-w-full items-center gap-1 overflow-x-auto no-scrollbar px-1 py-0.5">
          {allAccessibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                id={`floating-nav-${item.id}`}
                type="button"
                onClick={() => handleTabClick(item.id)}
                className={`group relative flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-2 text-[10px] font-bold transition-all duration-200 sm:px-3 sm:text-[11px] ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                }`}
                aria-current={isActive ? 'page' : undefined}
                title={item.label}
              >
                <Icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isActive ? 'text-white' : 'text-current'}`} />
                <span className="hidden sm:inline">{item.shortLabel}</span>

              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
