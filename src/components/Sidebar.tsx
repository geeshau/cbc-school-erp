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
  Globe,
  CalendarHeart
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
  | 'calendar'
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
  const [openGroupId, setOpenGroupId] = useState<string | null>(null);

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
      title: 'ACADEMICS',
      items: [
        {
          id: 'grading' as TabType,
          label: 'Marks & Grading',
          shortLabel: 'Grading',
          subLabel: 'Scores & Assessment',
          icon: Award,
          roles: ['admin', 'teacher'] as UserRole[]
        },
        {
          id: 'timetable' as TabType,
          label: 'Class Timetable',
          shortLabel: 'Timetable',
          subLabel: 'Lesson Scheduling',
          icon: CalendarDays,
          roles: ['admin', 'teacher'] as UserRole[]
        },
        {
          id: 'reports' as TabType,
          label: 'Report Cards',
          shortLabel: 'Reports',
          subLabel: 'Terminal Reports',
          icon: FileSpreadsheet,
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
          id: 'calendar' as TabType,
          label: 'School Calendar',
          shortLabel: 'Calendar',
          subLabel: 'Events & Google Sync',
          icon: CalendarHeart,
          roles: ['admin', 'teacher'] as UserRole[]
        },
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
                  ? 'bg-brand-500 text-white font-semibold shadow-xs'
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

  // Grouped nav structure for the floating bar
  // Groups: Academics (Grading + Reports), Schedule (Timetable + Calendar)
  type NavEntry =
    | { type: 'single'; item: typeof allAccessibleItems[number] }
    | { type: 'group'; id: string; label: string; shortLabel: string; icon: typeof Award; children: typeof allAccessibleItems };

  const academicsChildren = allAccessibleItems.filter((i) => i.id === 'grading' || i.id === 'reports');
  const scheduleChildren = allAccessibleItems.filter((i) => i.id === 'timetable' || i.id === 'calendar');
  const groupedIds = new Set(['grading', 'reports', 'timetable', 'calendar']);

  const navEntries: NavEntry[] = [];
  const singles = allAccessibleItems.filter((i) => !groupedIds.has(i.id));

  // Insert singles in order, inject groups at proper position
  let academicsInserted = false;
  let scheduleInserted = false;

  for (const item of allAccessibleItems) {
    if (item.id === 'grading' || item.id === 'reports') {
      if (!academicsInserted && academicsChildren.length > 0) {
        navEntries.push({ type: 'group', id: 'academics', label: 'Academics', shortLabel: 'Academics', icon: Award, children: academicsChildren });
        academicsInserted = true;
      }
    } else if (item.id === 'timetable' || item.id === 'calendar') {
      if (!scheduleInserted && scheduleChildren.length > 0) {
        navEntries.push({ type: 'group', id: 'schedule', label: 'Schedule', shortLabel: 'Schedule', icon: CalendarDays, children: scheduleChildren });
        scheduleInserted = true;
      }
    } else {
      navEntries.push({ type: 'single', item });
    }
  }

  const toggleGroup = (groupId: string) => {
    setOpenGroupId((prev) => (prev === groupId ? null : groupId));
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    if (!openGroupId) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(`[data-nav-group="${openGroupId}"]`)) {
        setOpenGroupId(null);
      }
    };
    document.addEventListener('click', handler, true);
    return () => document.removeEventListener('click', handler, true);
  }, [openGroupId]);

  return (
    <nav
      id="floating-bottom-nav"
      aria-label="School navigation"
      className="fixed bottom-3 left-1/2 z-50 -translate-x-1/2 w-[calc(100%-1rem)] max-w-5xl px-1 sm:w-auto sm:max-w-[calc(100%-4rem)]"
    >
      <div className="flex w-full items-center justify-center rounded-full border border-white/10 bg-brand-800/95 dark:bg-brand-950/95 p-1 sm:p-1.5 shadow-[0_20px_50px_-12px_rgba(6,29,27,0.65)] backdrop-blur-xl">
        <div className="flex w-full items-center justify-between gap-0.5 sm:gap-1 px-0.5 sm:px-1 py-0.5">
          {navEntries.map((entry) => {
            if (entry.type === 'single') {
              const item = entry.item;
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`floating-nav-${item.id}`}
                  type="button"
                  onClick={() => handleTabClick(item.id)}
                  className={`group relative flex flex-1 sm:flex-initial shrink-0 items-center justify-center sm:justify-start gap-1 sm:gap-1.5 rounded-full px-2 py-2 sm:px-3 sm:py-2 text-[10px] font-bold transition-all duration-200 sm:text-[11px] ${
                    isActive
                      ? 'bg-accent-400 text-brand-900 shadow-md shadow-black/25'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                  title={item.label}
                >
                  <Icon className="h-4 w-4 text-current shrink-0" />
                  <span className={`text-[9px] sm:text-[11px] ${isActive ? '' : 'hidden sm:inline'}`}>{item.shortLabel}</span>
                </button>
              );
            }

            // Grouped entry with dropdown
            const { id: groupId, shortLabel, icon: GroupIcon, children } = entry;
            const isGroupActive = children.some((c) => c.id === currentTab);
            const isOpen = openGroupId === groupId;
            const activeChild = children.find((c) => c.id === currentTab);

            return (
              <div key={groupId} className="relative flex-1 sm:flex-initial" data-nav-group={groupId}>
                <button
                  type="button"
                  onClick={() => toggleGroup(groupId)}
                  className={`group relative flex w-full shrink-0 items-center justify-center sm:justify-start gap-1 sm:gap-1.5 rounded-full px-2 py-2 sm:px-3 sm:py-2 text-[10px] font-bold transition-all duration-200 sm:text-[11px] ${
                    isGroupActive
                      ? 'bg-accent-400 text-brand-900 shadow-md shadow-black/25'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                  aria-expanded={isOpen}
                  title={shortLabel}
                >
                  <GroupIcon className="h-4 w-4 text-current shrink-0" />
                  <span className={`text-[9px] sm:text-[11px] ${isGroupActive ? '' : 'hidden sm:inline'}`}>
                    {activeChild ? activeChild.shortLabel : shortLabel}
                  </span>
                  <ChevronDown className={`h-3 w-3 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} hidden sm:block`} />
                </button>

                {/* Dropdown popover */}
                {isOpen && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl overflow-hidden"
                    style={{ animation: 'fadeSlideUp 0.15s ease-out' }}
                  >
                    {children.map((child) => {
                      const ChildIcon = child.icon;
                      const isChildActive = currentTab === child.id;
                      return (
                        <button
                          key={child.id}
                          type="button"
                          onClick={() => { handleTabClick(child.id); setOpenGroupId(null); }}
                          className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-xs font-semibold transition-colors ${
                            isChildActive
                              ? 'bg-brand-500 text-white'
                              : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <ChildIcon className={`h-4 w-4 shrink-0 ${isChildActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                          <div className="min-w-0">
                            <span className="block truncate">{child.label}</span>
                            <span className={`block text-[10px] font-medium ${isChildActive ? 'text-white/70' : 'text-slate-400 dark:text-slate-500'}`}>{child.subLabel}</span>
                          </div>
                          {isChildActive && <Check className="h-3.5 w-3.5 ml-auto text-white shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
