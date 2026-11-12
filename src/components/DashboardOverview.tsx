import React, { useMemo } from 'react';
import {
  Users,
  CheckCircle,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Phone,
  UserPlus,
  FileSpreadsheet,
  BookOpen,
  Activity,
  HardDrive,
  ShieldCheck,
  RefreshCw,
  FileText,
  CheckCircle2,
  ChevronRight,
  Target
} from 'lucide-react';
import { Student, UserRole, FeePayment, SchoolEvent, SchoolEventCategory } from '../types';
import { TabType } from './Sidebar';
import { QuickActionsFloatingMenu } from './QuickActionsFloatingMenu';
import { CalendarDays, Clock, MapPin } from 'lucide-react';

const EVENT_DOT_COLORS: Record<SchoolEventCategory, string> = {
  Academic: 'bg-brand-500',
  Holiday: 'bg-rose-500',
  Exam: 'bg-amber-500',
  Meeting: 'bg-indigo-500',
  Sports: 'bg-emerald-500',
  Spiritual: 'bg-purple-500',
  General: 'bg-slate-400',
};

interface DashboardOverviewProps {
  students: Student[];
  payments?: FeePayment[];
  events?: SchoolEvent[];
  feeSummary: { totalBilled: number; totalCollected: number; totalOutstanding: number; collectionRate: number };
  userRole: UserRole;
  currentUserName?: string;
  onNavigateTab: (tab: TabType) => void;
  onOpenNewStudentModal: () => void;
  onAddStudent?: (student: Partial<Student>) => Promise<void>;
  onRecordPayment?: (data: {
    studentId: string;
    amount: number;
    paymentMethod: string;
    notes?: string;
    recordedBy: string;
  }) => Promise<void>;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  students,
  payments = [],
  events = [],
  feeSummary,
  userRole,
  currentUserName = 'Arthur Pendelton',
  onNavigateTab,
  onOpenNewStudentModal,
  onAddStudent,
  onRecordPayment
}) => {
  const upcomingEvents = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return [...events]
      .filter(e => e.endDate >= todayStr)
      .sort((a, b) => a.startDate.localeCompare(b.startDate) || (a.startTime || '').localeCompare(b.startTime || ''))
      .slice(0, 5);
  }, [events]);

  const avgPerformance = useMemo(() => {
    const active = students.filter((s) => s.status === 'active');
    if (active.length === 0) return '0.0';
    return (active.reduce((acc, s) => acc + s.performanceIndex, 0) / active.length).toFixed(1);
  }, [students]);

  // Derive Urgent Alerts
  const urgentAlerts = useMemo(() => {
    const alerts = [];
    if (userRole === 'admin') {
      if (students.filter(s => s.feeBalance > 0).length > 5) {
        alerts.push({ id: 1, text: 'High number of fee arrears', tab: 'fees' as TabType });
      }
      if (students.filter(s => s.status === 'active' && !s.grade).length > 0) {
        alerts.push({ id: 2, text: 'Learners pending grade assignment', tab: 'enrolment' as TabType });
      }
    } else {
      // Teacher specific alerts
      alerts.push({ id: 3, text: 'Term 1 Mid-term marks due in 3 days', tab: 'grading' as TabType });
      alerts.push({ id: 4, text: '2 learners flagged for absenteeism', tab: 'grading' as TabType });
    }
    return alerts;
  }, [students, userRole]);

  return (
    <div className="space-y-4 sm:space-y-5 min-w-0">
      {/* Top Header & Breadcrumb Bar matching Screenshot */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4 pb-1">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight break-words">
            School Operations Dashboard
          </h1>
          <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 min-w-0">
            <span className="hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer truncate" onClick={() => onNavigateTab('dashboard')}>
              Dashboard
            </span>
            <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 flex-shrink-0" />
            <span className="text-brand-600 dark:text-brand-400 font-semibold truncate">Operations & Performance</span>
          </div>
        </div>

        {/* Quick Action Top Bar */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {userRole === 'admin' ? (
            <>
              <button
                onClick={onOpenNewStudentModal}
                className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg bg-accent-500 hover:bg-accent-400 text-brand-900 font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Admit Learner</span>
                <span className="xs:hidden">Admit</span>
              </button>
              <button
                onClick={() => onNavigateTab('fees')}
                className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-200/90 dark:border-slate-700 shadow-2xs transition-colors cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-500" />
                <span className="hidden sm:inline">Record Fee</span>
                <span className="sm:hidden">Fee</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => onNavigateTab('grading')}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-200/90 dark:border-slate-700 shadow-2xs transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-500" />
              <span className="hidden sm:inline">Input Marks</span>
              <span className="sm:hidden">Marks</span>
            </button>
          )}

        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Card 1: Academic Status */}
        <div
          onClick={() => onNavigateTab('grading')}
          className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 hover:border-brand-200 transition-all cursor-pointer group min-w-0 rounded-tr-[2rem] shadow-[0_10px_40px_-24px_rgba(13,40,64,0.35)] dark:bg-brand-950 dark:border-brand-900"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500">Academic Grading</span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition-colors">
              <Activity className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-end justify-between gap-2">
            <div className="min-w-0">
              <span className="text-xl sm:text-2xl font-black text-slate-900">Healthy</span>
              <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">All streams active</p>
            </div>
          </div>
        </div>

        {/* Card 2: Performance Average */}
        <div
          className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 hover:border-brand-200 transition-all group min-w-0 rounded-tr-[2rem] shadow-[0_10px_40px_-24px_rgba(13,40,64,0.35)] dark:bg-brand-950 dark:border-brand-900"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500">Avg Performance</span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition-colors">
              <Target className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-black text-slate-900">
              {avgPerformance}
            </span>
            <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">Across active learners</p>
          </div>
        </div>

        {/* Card 3: Student Directory */}
        <div
          onClick={() => onNavigateTab('enrolment')}
          className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 hover:border-brand-200 transition-all cursor-pointer group min-w-0 rounded-tr-[2rem] shadow-[0_10px_40px_-24px_rgba(13,40,64,0.35)] dark:bg-brand-950 dark:border-brand-900"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500">Student Directory</span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition-colors">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-end justify-between gap-2">
            <div className="min-w-0">
              <span className="text-xl sm:text-2xl font-black text-slate-900">{students.filter((s) => s.status === 'active').length}</span>
              <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">Active learners</p>
            </div>
          </div>
        </div>

        {/* Card 4: Fee Arrears Alert */}
        <div
          onClick={() => onNavigateTab('fees')}
          className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 hover:border-brand-200 transition-all cursor-pointer group min-w-0 rounded-tr-[2rem] shadow-[0_10px_40px_-24px_rgba(13,40,64,0.35)] dark:bg-brand-950 dark:border-brand-900"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500">Fee Arrears</span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition-colors">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-black text-rose-600">
              {students.filter(s => s.feeBalance > 0).length}
            </span>
            <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">Learners with balance</p>
          </div>
        </div>

        {/* Card 5: Fee Collection Rate */}
        <div
          onClick={() => onNavigateTab('fees')}
          className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 hover:border-brand-200 transition-all cursor-pointer group min-w-0 rounded-tr-[2rem] shadow-[0_10px_40px_-24px_rgba(13,40,64,0.35)] dark:bg-brand-950 dark:border-brand-900"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500">Collection Rate</span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition-colors">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-end justify-between gap-2">
            <div className="min-w-0">
              <span className="text-xl sm:text-2xl font-black text-slate-900">{feeSummary.collectionRate}%</span>
              <div className="flex items-center gap-1 mt-0.5">
                 <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                 <p className="text-[10px] sm:text-[11px] text-slate-400">
                    +2.4% vs last week
                 </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Operations overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 min-w-0">
          {/* Quick School Actions */}
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 transition-colors rounded-tr-[2rem] shadow-[0_10px_40px_-24px_rgba(13,40,64,0.35)] lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-brand-500"></span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Quick School Actions
              </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onNavigateTab('fees')}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 hover:bg-brand-50/50 border border-slate-200/70 text-center transition-all group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-brand-800 text-white flex items-center justify-center group-hover:bg-brand-500 transition-colors shadow-xs">
                  <CreditCard className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-slate-800 mt-2">Record Payment</span>
                <span className="text-[10px] text-slate-400">Generate receipt</span>
              </button>

              <button
                onClick={() => onNavigateTab('grading')}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 hover:bg-brand-50/50 border border-slate-200/70 text-center transition-all group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-brand-800 text-white flex items-center justify-center group-hover:bg-brand-500 transition-colors shadow-xs">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-slate-800 mt-2">Input Marks</span>
                <span className="text-[10px] text-slate-400">Grade assessments</span>
              </button>
            </div>
          </div>

          {/* Urgent Alerts (Admin Only) */}
          {userRole === 'admin' && (
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 rounded-tr-[2rem] shadow-[0_10px_40px_-24px_rgba(13,40,64,0.35)] dark:bg-brand-950 dark:border-brand-900">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Urgent Alerts
              </h3>
              <div className="space-y-3">
                {urgentAlerts.length > 0 ? urgentAlerts.map(alert => (
                  <div key={alert.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
                    <span className="text-xs font-medium text-amber-900">{alert.text}</span>
                    <button onClick={() => onNavigateTab(alert.tab)} className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded">View</button>
                  </div>
                )) : <p className="text-xs text-slate-500">No urgent tasks.</p>}
              </div>
            </div>
          )}

          {/* Performance Spotlight */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 rounded-tr-[2rem] shadow-[0_10px_40px_-24px_rgba(13,40,64,0.35)] dark:bg-brand-950 dark:border-brand-900">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-4">Performance Spotlight</h3>
            <div className="space-y-3">
              {[...students].sort((a, b) => a.performanceIndex - b.performanceIndex).slice(0, 3).map(s => (
                <div key={s.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50">
                  <span className="text-slate-600 font-medium">{s.firstName} {s.lastName}</span>
                  <span className="font-bold text-rose-600">{s.performanceIndex.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>
      </div>

      {/* Outstanding Balances Table */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 rounded-tr-[2rem] shadow-[0_10px_40px_-24px_rgba(13,40,64,0.35)] dark:bg-brand-950 dark:border-brand-900">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-4 flex items-center justify-between">
          <span>Learners with Outstanding Balances</span>
          <span className="text-[10px] text-slate-400 font-normal">Showing top 5</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-brand-900 uppercase tracking-tighter text-[10px] font-bold">
              <tr>
                <th className="py-2 px-1">Learner</th>
                <th className="py-2 px-1">Grade</th>
                <th className="py-2 px-1 text-right">Outstanding Arrears</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-brand-900/50">
              {students.filter(s => s.feeBalance > 0).sort((a, b) => b.feeBalance - a.feeBalance).slice(0, 5).map(s => (
                <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-brand-900/20 transition-colors">
                  <td className="py-2.5 px-1 font-bold text-slate-900 dark:text-slate-100">{s.firstName} {s.lastName}</td>
                  <td className="py-2.5 px-1 text-slate-600 dark:text-slate-400 font-medium">{s.grade}</td>
                  <td className="py-2.5 px-1 text-right font-black text-rose-700 dark:text-rose-500">KES {s.feeBalance.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-brand-900 flex justify-end">
           <button onClick={() => onNavigateTab('fees')} className="text-[10px] font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-1 transition-colors cursor-pointer">
              View All Financial Ledgers <ArrowUpRight className="w-3 h-3" />
           </button>
        </div>
      </div>

      {/* Upcoming Events Preview */}
      {upcomingEvents.length > 0 && (
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 rounded-tr-[2rem] shadow-[0_10px_40px_-24px_rgba(13,40,64,0.35)] dark:bg-brand-950 dark:border-brand-900">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-brand-500" />
              Upcoming School Events
            </span>
            <button
              onClick={() => onNavigateTab('calendar')}
              className="text-[10px] font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              View Full Calendar <ArrowUpRight className="w-3 h-3" />
            </button>
          </h3>
          <div className="space-y-2">
            {upcomingEvents.map(ev => (
              <div
                key={ev.id}
                onClick={() => onNavigateTab('calendar')}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-brand-900/40 hover:bg-slate-100 dark:hover:bg-brand-900/70 border border-slate-200/70 dark:border-brand-900 transition-colors cursor-pointer group"
              >
                {/* Date tile */}
                <div className="shrink-0 w-12 h-12 rounded-xl bg-brand-800 dark:bg-brand-700 text-white flex flex-col items-center justify-center leading-none">
                  <span className="text-[10px] font-bold uppercase">
                    {new Date(`${ev.startDate}T00:00:00`).toLocaleDateString('en-GB', { month: 'short' })}
                  </span>
                  <span className="text-lg font-black">
                    {new Date(`${ev.startDate}T00:00:00`).getDate()}
                  </span>
                </div>

                {/* Event info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${EVENT_DOT_COLORS[ev.category]}`}></span>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{ev.title}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    {!ev.allDay && ev.startTime && (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {ev.startTime}{ev.endTime ? ` – ${ev.endTime}` : ''}
                      </span>
                    )}
                    {ev.allDay && (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        All day
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{ev.location}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating Action Speed Dial for Common School Tasks */}
      <QuickActionsFloatingMenu
        students={students}
        payments={payments}
        currentUserName={currentUserName}
        userRole={userRole}
        onNavigateTab={onNavigateTab}
        onAddStudent={onAddStudent || (async () => { onOpenNewStudentModal(); })}
        onRecordPayment={onRecordPayment || (async () => { onNavigateTab('fees'); })}
      />
    </div>
  );
};
