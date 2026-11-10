/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, TabType } from './components/Sidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { EnrolmentManager } from './components/EnrolmentManager';
import { FeeManager } from './components/FeeManager';
import { GradingTracker } from './components/GradingTracker';
import { TimetableManager } from './components/TimetableManager';
import { ReportCardsManager } from './components/ReportCardsManager';
import { WebsiteContentManager, WebsiteContent } from './components/WebsiteContentManager';
import { SchoolCalendarManager } from './components/SchoolCalendarManager';
import { LandingPage } from './components/LandingPage';

import {
  User,
  Student,
  FeePayment,
  GradeRecord,
  TimetableSlot,
  SchoolEvent,
  UserRole,
} from './types';
import { api } from './lib/api';
import {
  DEMO_USERS,
  INITIAL_STUDENTS,
  INITIAL_PAYMENTS,
  INITIAL_GRADES,
  INITIAL_TIMETABLE,
  INITIAL_EVENTS
} from './data/mockData';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import { useTheme } from './lib/theme';

export default function App() {
  const [appMode, setAppMode] = useState<'landing' | 'system'>('landing');
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [tabHistory, setTabHistory] = useState<TabType[]>([]);
  const { theme, resolvedTheme, setTheme, toggleTheme, isDark } = useTheme();

  // Wrapped tab setter that tracks history
  const navigateToTab = (tab: TabType) => {
    if (tab !== activeTab) {
      setTabHistory((prev) => [...prev, activeTab]);
      setActiveTab(tab);
    }
  };

  const goBack = () => {
    setTabHistory((prev) => {
      if (prev.length === 0) return prev;
      const newHistory = [...prev];
      const previousTab = newHistory.pop()!;
      setActiveTab(previousTab);
      return newHistory;
    });
  };

  // Users & Role Switching (Dr. Arthur Pendelton - Admin, Sarah Jenkins - Teacher, Marcus Vance - Teacher)
  const [users, setUsers] = useState<User[]>(DEMO_USERS);
  const [currentUser, setCurrentUser] = useState<User>(DEMO_USERS[0]);

  // Database Connection Status
  const [dbStatus, setDbStatus] = useState<{ provider: string; connected: boolean }>({
    provider: 'Embedded Mongo Engine',
    connected: true
  });

  // Core Data Collections
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [payments, setPayments] = useState<FeePayment[]>(INITIAL_PAYMENTS);
  const [grades, setGrades] = useState<GradeRecord[]>(INITIAL_GRADES);
  const [timetableSlots, setTimetableSlots] = useState<TimetableSlot[]>(INITIAL_TIMETABLE);
  const [events, setEvents] = useState<SchoolEvent[]>(INITIAL_EVENTS);

  // Website CMS State
  const [websiteContent, setWebsiteContent] = useState<WebsiteContent>({
    announcementText: 'PCEA St Andrews Kindergarten Portal (kindergarten.pceastandrews.org) — Admissions Open.',
    phone: '0786198873',
    email: 'kindergarten@pceastandrews.org',
    altEmail: 'pceastandrewskindergarten@gmail.com',
    heroTitle: 'A bright beginning for every child.',
    heroSubtitle: 'Located in the serene surroundings of St Andrews Compound, Church Road, Nairobi, PCEA St Andrews Kindergarten provides a holistic, loving, and stimulating environment where children discover their full potential through play-based learning, CBC curriculum foundations, and spiritual growth.',
    location: 'kindergarten.pceastandrews.org',
    admissionLabel: 'Admissions Open',
    heroPrimaryCtaLabel: 'Enquire About Admissions',
    heroSecondaryCtaLabel: 'Request Child Report',
    galleryImages: [
      { id: '1', title: 'Montessori Play & Learning', url: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80', category: 'Campus' },
      { id: '2', title: 'Creative Arts & Expression', url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80', category: 'Activities' },
      { id: '3', title: 'Outdoor Playground Fun', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80', category: 'Campus' },
      { id: '4', title: 'Spiritual Assembly & Song', url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80', category: 'Spiritual' },
      { id: '5', title: 'CBC Interactive Lessons', url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80', category: 'Facilities' },
      { id: '6', title: 'Kindergarten Computer Lab', url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80', category: 'Facilities' }
    ],
    feedbackComments: [
      { id: 'fb-1', text: 'My daughter has blossomed since joining St Andrews. The teachers are incredibly patient and truly know each child by name. The CBC approach makes learning feel like play!', role: 'Parent — PP2', date: 'Oct 2026', likes: 24, visible: true },
      { id: 'fb-2', text: 'As a first-time parent, I was nervous about school. The warm reception and regular progress updates from teachers gave me so much confidence. Highly recommend this school.', role: 'Parent — Playgroup', date: 'Sep 2026', likes: 18, visible: true },
      { id: 'fb-3', text: 'The Montessori-inspired activities are fantastic. My son comes home excited to tell us what he learned. The spiritual growth focus aligns perfectly with our family values.', role: 'Parent — Grade 1', date: 'Nov 2026', likes: 31, visible: true },
      { id: 'fb-4', text: 'Clean, safe, and well-organized campus. The outdoor play area is wonderful and the children get a great balance of structured learning and free play time.', role: 'Parent — PP1', date: 'Aug 2026', likes: 15, visible: true },
      { id: 'fb-5', text: 'The school events and parent days are beautifully organized. You can see how much effort the staff puts into making every child feel special and celebrated.', role: 'Parent — Grade 2', date: 'Oct 2026', likes: 22, visible: true },
      { id: 'fb-6', text: 'Transferring here was the best decision. The smaller class sizes mean my child gets individual attention. The report cards are detailed and show real progress tracking.', role: 'Parent — Grade 3', date: 'Nov 2026', likes: 27, visible: true },
    ]
  });

  // Collapsible Sidebar State with localStorage persistence
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('pcea_sms_sidebar_collapsed');
      if (saved === null) return true;
      return saved === 'true';
    } catch {
      return true;
    }
  });

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('pcea_sms_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Global Keyboard shortcuts:
  // - Ctrl + B / Cmd + B: Toggle sidebar
  // - Shift + D: Quick toggle theme mode (Daylight / Low-Light Night Mode for teachers)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      const isInput = tag === 'input' || tag === 'textarea' || tag === 'select' || (e.target as HTMLElement)?.isContentEditable;
      if (isInput) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        handleToggleSidebar();
      } else if (e.shiftKey && (e.key === 'D' || e.key === 'd') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        toggleTheme();
        showToast(
          isDark
            ? '☀️ Daylight Light Mode activated.'
            : '🌙 Low-Light Night Mode activated for after-hours work.'
        );
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleTheme, isDark]);

  // Switch Active User / Role
  const handleSwitchUser = (user: User) => {
    setCurrentUser(user);
    showToast(`Switched active profile to ${user.name} (${user.role.toUpperCase()}).`);
  };

  // Sync data with backend API
  useEffect(() => {
    const bootstrap = async () => {
      try {
        const [
          fetchedUsers,
          health,
          fetchedStudents,
          fetchedSummary,
          fetchedGrades,
          fetchedTimetable,
          fetchedEvents
        ] = await Promise.all([
          api.getUsers().catch(() => DEMO_USERS),
          api.getHealth().catch(() => ({ database: { connected: true, provider: 'High-Speed Database' } })),
          api.getStudents().catch(() => INITIAL_STUDENTS),
          api.getFeeSummary().catch(() => null),
          api.getGrades().catch(() => INITIAL_GRADES),
          api.getTimetable().catch(() => INITIAL_TIMETABLE),
          api.getEvents().catch(() => INITIAL_EVENTS)
        ]);

        if (fetchedUsers && fetchedUsers.length > 0) setUsers(fetchedUsers);
        if (health?.database) setDbStatus(health.database);
        if (fetchedStudents && fetchedStudents.length > 0) setStudents(fetchedStudents);
        if (fetchedSummary?.recentPayments) setPayments(fetchedSummary.recentPayments);
        if (fetchedGrades && fetchedGrades.length > 0) setGrades(fetchedGrades);
        if (fetchedTimetable && fetchedTimetable.length > 0) setTimetableSlots(fetchedTimetable);
        if (fetchedEvents && fetchedEvents.length > 0) setEvents(fetchedEvents);
      } catch (err) {
        console.error('Data bootstrap error:', err);
      }
    };

    bootstrap();
  }, []);

  // Compute fee summary metrics
  const totalBilled = students.reduce((acc, s) => acc + s.totalFeesBilled, 0);
  const totalCollected = students.reduce((acc, s) => acc + s.totalFeesPaid, 0);
  const totalOutstanding = Math.max(0, totalBilled - totalCollected);
  const collectionRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;
  const feeSummary = { totalBilled, totalCollected, totalOutstanding, collectionRate };

  // --- Handlers ---

  // Enrolment
  const handleAddStudent = async (newStudentData: Partial<Student>) => {
    try {
      const created = await api.createStudent(newStudentData);
      setStudents((prev) => [created, ...prev]);
      showToast(`Learner ${created.firstName} ${created.lastName} successfully enrolled.`);
    } catch (err: any) {
      showToast(`Error enrolling learner: ${err.message}`);
    }
  };

  // Fee Payment
  const handleRecordPayment = async (data: {
    studentId: string;
    amount: number;
    paymentMethod: string;
    notes?: string;
    recordedBy: string;
  }) => {
    try {
      const result = await api.recordFeePayment(data);
      const newPayment = result.payment;
      setPayments((prev) => [newPayment, ...prev]);

      setStudents((prev) =>
        prev.map((s) => {
          if (s.id === data.studentId) {
            const newPaid = s.totalFeesPaid + data.amount;
            const newBalance = Math.max(0, s.totalFeesBilled - newPaid);
            return {
              ...s,
              totalFeesPaid: newPaid,
              feeBalance: newBalance
            };
          }
          return s;
        })
      );
      showToast(`Fee receipt #${newPayment.receiptNumber} generated for KES ${data.amount.toLocaleString()}.`);
    } catch (err: any) {
      showToast(`Error recording fee payment: ${err.message}`);
    }
  };

  // Grading
  const handleSaveGrades = async (updates: Partial<GradeRecord>[]) => {
    try {
      await api.saveGrades(updates);
      setGrades((prev) => {
        const next = [...prev];
        updates.forEach((u) => {
          const idx = next.findIndex(
            (g) =>
              g.studentId === u.studentId &&
              g.subject.toLowerCase() === u.subject?.toLowerCase() &&
              g.assessmentType === u.assessmentType
          );
          if (idx >= 0) {
            next[idx] = { ...next[idx], ...u } as GradeRecord;
          } else if (u.studentId) {
            next.push({
              id: `gr_${Date.now()}_${Math.random()}`,
              studentId: u.studentId,
              studentName: u.studentName || '',
              admissionNumber: u.admissionNumber || '',
              grade: u.grade || 'Grade 10-A',
              subject: u.subject || 'Mathematics',
              term: u.term || 'Term 1',
              academicYear: '2026',
              assessmentType: u.assessmentType || 'End-Term',
              score: u.score || 0,
              maxScore: 100,
              percentage: u.percentage || u.score || 0,
              letterGrade: u.letterGrade || 'B',
              remarks: u.remarks || '',
              recordedBy: currentUser.name,
              updatedAt: new Date().toISOString().split('T')[0]
            });
          }
        });
        return next;
      });
      showToast(`Marks published successfully for ${updates.length} students.`);
    } catch (err: any) {
      showToast(`Error saving grades: ${err.message}`);
    }
  };

  // Timetable
  const handleAddSlot = async (slotData: Partial<TimetableSlot>) => {
    const newSlot = await api.addTimetableSlot(slotData);
    setTimetableSlots((prev) => [...prev, newSlot]);
    showToast(`Added ${newSlot.subject} to ${newSlot.grade} schedule.`);
  };

  const handleDeleteSlot = async (id: string) => {
    await api.deleteTimetableSlot(id);
    setTimetableSlots((prev) => prev.filter((s) => s.id !== id));
    showToast('Lesson slot removed from timetable.');
  };

  // School Calendar / Events
  const handleAddEvent = async (eventData: Partial<SchoolEvent>) => {
    const newEvent = await api.addEvent(eventData);
    setEvents((prev) => [...prev, newEvent].sort((a, b) => a.startDate.localeCompare(b.startDate)));
    showToast(`Added "${newEvent.title}" to the school calendar.`);
  };

  const handleDeleteEvent = async (id: string) => {
    await api.deleteEvent(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
    showToast('Event removed from the school calendar.');
  };

  const handleUpdateEvent = async (id: string, updates: Partial<SchoolEvent>) => {
    await api.updateEvent(id, updates);
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
    if (updates.googleCalendarId) {
      showToast('Event linked to Google Calendar.');
    }
  };

  if (appMode === 'landing') {
    return (
      <LandingPage
        content={websiteContent}
        onEnterSystem={(role) => {
          if (role === 'admin') {
            setCurrentUser(users.find((u) => u.role === 'admin') || users[0]);
          } else {
            setCurrentUser(users.find((u) => u.role === 'teacher') || users[1]);
          }
          setAppMode('system');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-canvas dark:bg-[#04110f] text-slate-900 dark:text-slate-100 font-sans flex flex-col antialiased w-full overflow-x-hidden transition-colors duration-200">
      {/* Top Header Navbar */}
      <Navbar
        currentUser={currentUser}
        users={users}
        onSwitchUser={handleSwitchUser}
        dbStatus={dbStatus}
        activeStudentsCount={students.filter((s) => s.status === 'active').length}
        onNavigateTab={(tab) => navigateToTab(tab)}
        theme={theme}
        resolvedTheme={resolvedTheme}
        onThemeChange={setTheme}
        onToggleTheme={toggleTheme}
        onReturnToLanding={() => setAppMode('landing')}
        onLogout={() => setAppMode('landing')}
      />

      {/* Main App Container */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden w-full">
        {/* Sidebar on desktop / Middle Navbar on mobile */}
        <Sidebar
          currentTab={activeTab}
          onSelectTab={(tab) => navigateToTab(tab)}
          userRole={currentUser.role}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
          theme={theme}
          resolvedTheme={resolvedTheme}
          onThemeChange={setTheme}
          onToggleTheme={toggleTheme}
        />

        {/* Dynamic Content Body */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-5 lg:p-6 xl:p-7 2xl:p-8 pb-24 sm:pb-24 md:pb-24 lg:pb-24 xl:pb-24 2xl:pb-24 bg-canvas dark:bg-[#04110f] transition-colors w-full">
          <div className="w-full max-w-full sm:max-w-[calc(100vw-2rem)] md:max-w-7xl xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto space-y-4 sm:space-y-5 lg:space-y-6">
            {/* Back Navigation Button */}
            {tabHistory.length > 0 && (
              <button
                type="button"
                onClick={goBack}
                className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </button>
            )}

            {/* Action Toast Feedback */}
            {toastMessage && (
              <div className="fixed bottom-20 sm:bottom-6 right-3 sm:right-7 z-50 bg-slate-900 dark:bg-slate-800 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl shadow-2xl border border-slate-700 dark:border-slate-700 flex items-center gap-2 sm:gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200 max-w-[calc(100vw-1.5rem)] sm:max-w-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="break-words">{toastMessage}</span>
              </div>
            )}

            {/* Tab: Analytics Pulse & Overview */}
            {activeTab === 'dashboard' && (
              <DashboardOverview
                students={students}
                payments={payments}
                events={events}
                feeSummary={feeSummary}
                userRole={currentUser.role}
                currentUserName={currentUser.name}
                onNavigateTab={(tab) => navigateToTab(tab)}
                onOpenNewStudentModal={() => navigateToTab('enrolment')}
                onAddStudent={handleAddStudent}
                onRecordPayment={handleRecordPayment}
              />
            )}

            {/* Tab: Learner Enrolment */}
            {activeTab === 'enrolment' && (
              <EnrolmentManager
                students={students}
                teachers={users.filter((user) => user.role === 'teacher')}
                onAddStudent={handleAddStudent}
                userRole={currentUser.role}
                onViewReportCard={() => navigateToTab('reports')}
              />
            )}

            {/* Tab: Learner Fees & Finance */}
            {activeTab === 'fees' && (
              <FeeManager
                students={students}
                payments={payments}
                onRecordPayment={handleRecordPayment}
                userRole={currentUser.role}
              />
            )}

            {/* Tab: Academic Performance & Grading */}
            {activeTab === 'grading' && (
              <GradingTracker
                students={students}
                grades={grades}
                onSaveGrades={handleSaveGrades}
                userRole={currentUser.role}
                currentUserName={currentUser.name}
              />
            )}

            {/* Tab: Master Timetable */}
            {activeTab === 'timetable' && (
              <TimetableManager
                slots={timetableSlots}
                onAddSlot={handleAddSlot}
                onDeleteSlot={handleDeleteSlot}
                userRole={currentUser.role}
              />
            )}

            {/* Tab: Terminal Report Cards */}
            {activeTab === 'reports' && (
              <ReportCardsManager
                students={students}
                grades={grades}
                userRole={currentUser.role}
              />
            )}

            {/* Tab: School Calendar & Events */}
            {activeTab === 'calendar' && (
              <SchoolCalendarManager
                events={events}
                userRole={currentUser.role}
                currentUserName={currentUser.name}
                onAddEvent={handleAddEvent}
                onDeleteEvent={handleDeleteEvent}
                onUpdateEvent={handleUpdateEvent}
              />
            )}

            {/* Tab: Website CMS */}
            {activeTab === 'website-cms' && (
              <WebsiteContentManager
                content={websiteContent}
                onSaveContent={(newC) => setWebsiteContent(newC)}
              />
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
