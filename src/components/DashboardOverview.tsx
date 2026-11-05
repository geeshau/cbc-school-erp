import React, { useMemo } from 'react';
import {
  Users,
  CheckCircle,
  CreditCard,
  Printer,
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
import { Student, UserRole, FeePayment } from '../types';
import { TabType } from './Sidebar';
import { QuickActionsFloatingMenu } from './QuickActionsFloatingMenu';

interface DashboardOverviewProps {
  students: Student[];
  payments?: FeePayment[];
  feeSummary: { totalBilled: number; totalCollected: number; totalOutstanding: number; collectionRate: number };
  pendingExamsCount: number;
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
  feeSummary,
  pendingExamsCount,
  userRole,
  currentUserName = 'Arthur Pendelton',
  onNavigateTab,
  onOpenNewStudentModal,
  onAddStudent,
  onRecordPayment
}) => {
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
            <span className="text-orange-600 dark:text-orange-400 font-semibold truncate">Operations & Performance</span>
          </div>
        </div>

        {/* Quick Action Top Bar */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {userRole === 'admin' ? (
            <>
              <button
                onClick={onOpenNewStudentModal}
                className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Admit Learner</span>
                <span className="xs:hidden">Admit</span>
              </button>
              <button
                onClick={() => onNavigateTab('fees')}
                className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-200/90 dark:border-slate-700 shadow-2xs transition-colors cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500" />
                <span className="hidden sm:inline">Record Fee</span>
                <span className="sm:hidden">Fee</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => onNavigateTab('exams')}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-200/90 dark:border-slate-700 shadow-2xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500" />
              <span className="hidden sm:inline">Upload Exam Paper</span>
              <span className="sm:hidden">Upload</span>
            </button>
          )}

        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Academic Status */}
        <div
          onClick={() => onNavigateTab('grading')}
          className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-orange-200 transition-all cursor-pointer group min-w-0"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500">Academic Grading</span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
              <Activity className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-end justify-between gap-2">
            <div className="min-w-0">
              <span className="text-xl sm:text-2xl font-black text-slate-900">Healthy</span>
              <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">All streams active</p>
            </div>
            {/* Vertical Bars Graphic */}
            <div className="w-14 sm:w-16 h-8 flex items-end gap-1 shrink-0">
              {[60, 45, 90, 75, 85].map((h, i) => (
                <div
                  key={i}
                  style={{ height: `${h}%` }}
                  className="flex-1 bg-slate-800 rounded-t"
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 3: Exam Print Queue */}
        <div
          onClick={() => onNavigateTab('exams')}
          className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-orange-200 transition-all cursor-pointer group min-w-0"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500">Exam Print Requisitions</span>
            <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
              <Printer className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-end justify-between gap-2">
            <div className="min-w-0">
              <span className="text-xl sm:text-2xl font-black text-slate-900">{pendingExamsCount}</span>
              <p className="text-[10px] sm:text-[11px] text-orange-600 font-semibold mt-0.5">Queue active</p>
            </div>
            {/* Alert Level Status Bars (matching screenshot open IT tickets) */}
            <div className="w-14 sm:w-16 h-8 flex items-end gap-1 shrink-0">
              {[35, 75, 50, 95, 60].map((h, i) => (
                <div
                  key={i}
                  style={{ height: `${h}%` }}
                  className="flex-1 bg-orange-500 rounded-t"
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 4: Fee Collection Rate */}
        <div
          onClick={() => onNavigateTab('fees')}
          className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-orange-200 transition-all cursor-pointer group min-w-0"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500">Fee Collection Rate</span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-end justify-between gap-2">
            <div className="min-w-0">
              <span className="text-xl sm:text-2xl font-black text-slate-900">{feeSummary.collectionRate}%</span>
              <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">
                KES {(feeSummary.totalCollected / 1000).toFixed(0)}k banked
              </p>
            </div>
            {/* Progress Segment Graphic */}
            <div className="w-14 sm:w-16 h-8 flex items-end gap-1 shrink-0">
              {[50, 70, 85, 90, 76].map((h, i) => (
                <div
                  key={i}
                  style={{ height: `${h}%` }}
                  className="flex-1 bg-orange-500 rounded-t"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Operations overview cards */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.9fr)] gap-4 sm:gap-5">
        <div className="space-y-4 sm:space-y-5 min-w-0">
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  School Operations Snapshot
                </span>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Admissions, fees, grading, and exam activity at a glance.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50/80 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/80">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Active Learners</span>
                  <span className="text-xs font-black font-mono text-orange-600 dark:text-orange-400">{students.filter((s) => s.status === 'active').length}</span>
                </div>
                <div className="mt-3 h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                  <div className="h-full w-[82%] rounded-full bg-orange-500"></div>
                </div>
              </div>

              <div className="p-3 bg-slate-50/80 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/80">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Fee Collection</span>
                  <span className="text-xs font-black font-mono text-emerald-600 dark:text-emerald-400">{feeSummary.collectionRate}%</span>
                </div>
                <div className="mt-3 h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                  <div className="h-full w-[76%] rounded-full bg-emerald-500"></div>
                </div>
              </div>

              <div className="p-3 bg-slate-50/80 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/80">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Pending Exams</span>
                  <span className="text-xs font-black font-mono text-sky-600 dark:text-sky-400">{pendingExamsCount}</span>
                </div>
                <div className="mt-3 h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                  <div className="h-full w-[58%] rounded-full bg-sky-500"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Quick School Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4 sm:gap-5 min-w-0">
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Quick School Actions
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onNavigateTab('fees')}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 hover:bg-orange-50/50 border border-slate-200/70 text-center transition-all group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:bg-orange-500 transition-colors shadow-xs">
                  <CreditCard className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-slate-800 mt-2">Record Payment</span>
                <span className="text-[10px] text-slate-400">Generate receipt</span>
              </button>

              <button
                onClick={() => onNavigateTab('grading')}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 hover:bg-orange-50/50 border border-slate-200/70 text-center transition-all group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:bg-orange-500 transition-colors shadow-xs">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-slate-800 mt-2">Input Marks</span>
                <span className="text-[10px] text-slate-400">Grade assessments</span>
              </button>

              <button
                onClick={() => onNavigateTab('exams')}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 hover:bg-orange-50/50 border border-slate-200/70 text-center transition-all group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:bg-orange-500 transition-colors shadow-xs">
                  <Printer className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-slate-800 mt-2">Exam Print Room</span>
                <span className="text-[10px] text-slate-400">Manage queue</span>
              </button>

              <button
                onClick={() => onNavigateTab('enrolment')}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 hover:bg-orange-50/50 border border-slate-200/70 text-center transition-all group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:bg-orange-500 transition-colors shadow-xs">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-slate-800 mt-2">Student Records</span>
                <span className="text-[10px] text-slate-400">Manage roster</span>
              </button>
            </div>
          </div>

          {/* User Roles Distribution */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Community Distribution
              </h3>
              <span className="text-[11px] text-slate-400 font-semibold">382 Total</span>
            </div>

            <div className="h-3 w-full rounded-full overflow-hidden flex gap-0.5">
              <div style={{ width: '75%' }} className="bg-orange-500" title="340 Learners"></div>
              <div style={{ width: '15%' }} className="bg-slate-900" title="28 Teachers"></div>
              <div style={{ width: '6%' }} className="bg-teal-700" title="8 Support Staff"></div>
              <div style={{ width: '4%' }} className="bg-amber-400" title="6 Admin"></div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 mt-3 pt-2 border-t border-slate-100 font-medium">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                <span className="truncate">Learners (340)</span>
              </div>
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-900"></span>
                <span className="truncate">Teachers (28)</span>
              </div>
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-700"></span>
                <span className="truncate">Staff (8)</span>
              </div>
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span className="truncate">Admin (6)</span>
              </div>
            </div>
          </div>

        </div>
      </div>

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
