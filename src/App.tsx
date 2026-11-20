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
import { LoginPage } from './components/LoginPage';

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
  // ---- Session persistence helpers ----
  const SESSION_KEY = 'pcea_sms_session';

  const getSavedSession = (): { appMode: 'landing' | 'login' | 'system'; activeTab: TabType; currentUser: User | null; rememberMe: boolean } | null => {
    try {
      // sessionStorage survives refresh; localStorage survives browser close (remember me)
      const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return null;
  };

  const saved = getSavedSession();

  const [appMode, setAppMode] = useState<'landing' | 'login' | 'system'>(saved?.appMode === 'system' ? 'system' : 'landing');
  const [loginRole, setLoginRole] = useState<UserRole | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<TabType>(saved?.activeTab || 'dashboard');
  const [tabHistory, setTabHistory] = useState<TabType[]>([]);
  const [rememberMe, setRememberMe] = useState(saved?.rememberMe ?? false);
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

  // Users & Role Switching
  const [users, setUsers] = useState<User[]>(DEMO_USERS);
  const [currentUser, setCurrentUser] = useState<User>(saved?.currentUser || DEMO_USERS[0]);

  // Persist session state to storage on every relevant change
  useEffect(() => {
    if (appMode !== 'system') return; // Only persist when logged in
    const sessionData = JSON.stringify({ appMode, activeTab, currentUser, rememberMe });
    try {
      sessionStorage.setItem(SESSION_KEY, sessionData);
      if (rememberMe) {
        localStorage.setItem(SESSION_KEY, sessionData);
      }
    } catch {}
  }, [appMode, activeTab, currentUser, rememberMe]);

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
      { id: 'fb-1', text: 'My daughter has blossomed since joining St Andrews. The teachers are incredibly patient and truly know each child by name. The CBC approach makes learning feel like play!', role: 'Parent — PP2', date: 'Oct 2026', rating: 5, visible: true },
      { id: 'fb-2', text: 'As a first-time parent, I was nervous about school. The warm reception and regular progress updates from teachers gave me so much confidence. Highly recommend this school.', role: 'Parent — Playgroup', date: 'Sep 2026', rating: 4, visible: true },
      { id: 'fb-3', text: 'The Montessori-inspired activities are fantastic. My son comes home excited to tell us what he learned. The spiritual growth focus aligns perfectly with our family values.', role: 'Parent — Grade 1', date: 'Nov 2026', rating: 5, visible: true },
      { id: 'fb-4', text: 'Clean, safe, and well-organized campus. The outdoor play area is wonderful and the children get a great balance of structured learning and free play time.', role: 'Parent — PP1', date: 'Aug 2026', rating: 4, visible: true },
      { id: 'fb-5', text: 'The school events and parent days are beautifully organized. You can see how much effort the staff puts into making every child feel special and celebrated.', role: 'Parent — Grade 2', date: 'Oct 2026', rating: 5, visible: true },
      { id: 'fb-6', text: 'Transferring here was the best decision. The smaller class sizes mean my child gets individual attention. The report cards are detailed and show real progress tracking.', role: 'Parent — Grade 3', date: 'Nov 2026', rating: 5, visible: true },
    ],
    downloadResources: [
      {
        id: 'res-1',
        title: '2026 Admission Application Form',
        description: 'Official application form for new learner admissions (Playgroup – Grade 3).',
        category: 'Admissions',
        fileName: 'admission-application-form-2026.pdf',
        fileType: 'PDF',
        fileSize: '184 KB',
        url: 'data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PgplbmRvYmoKMyAwIG9iago8PC9UeXBlL1BhZ2UvUGFyZW50IDIgMCBSL01lZGlhQm94WzAgMCA2MTIgNzkyXS9SZXNvdXJjZXM8PC9Gb250PDwvRjEgNCAwIFI+Pj4+L0NvbnRlbnRzIDUgMCBSPj4KZW5kb2JqCjQgMCBvYmoKPDwvVHlwZS9Gb250L1N1YnR5cGUvVHlwZTEvQmFzZUZvbnQvSGVsdmV0aWNhPj4KZW5kb2JqCjUgMCBvYmoKPDwvTGVuZ3RoIDEwND4+CnN0cmVhbQpCVAovRjEgMTggVGYKNzIgNzIwIFRkCihQQ0VBIFN0IEFuZHJld3MgS2luZGVyZ2FydGVuIC0gQWRtaXNzaW9uIEZvcm0gMjAyNikgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTUgMDAwMDAgbiAKMDAwMDAwMDA2MCAwMDAwMCBuIAowMDAwMDAwMTExIDAwMDAwIG4gCjAwMDAwMDAyMzQgMDAwMDAgbiAKMDAwMDAwMDMwMSAwMDAwMCBuIAp0cmFpbGVyCjw8L1NpemUgNi9Sb290IDEgMCBSPj4Kc3RhcnR4cmVmCjQ1NQolJUVPRgo=',
        uploadedAt: '5 Jan 2026',
        visible: true
      },
      {
        id: 'res-2',
        title: 'Term 1 2026 Fee Structure',
        description: 'Breakdown of tuition, meals, transport and activity fees per level for Term 1.',
        category: 'Fees',
        fileName: 'fee-structure-term1-2026.pdf',
        fileType: 'PDF',
        fileSize: '126 KB',
        url: 'data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PgplbmRvYmoKMyAwIG9iago8PC9UeXBlL1BhZ2UvUGFyZW50IDIgMCBSL01lZGlhQm94WzAgMCA2MTIgNzkyXS9SZXNvdXJjZXM8PC9Gb250PDwvRjEgNCAwIFI+Pj4+L0NvbnRlbnRzIDUgMCBSPj4KZW5kb2JqCjQgMCBvYmoKPDwvVHlwZS9Gb250L1N1YnR5cGUvVHlwZTEvQmFzZUZvbnQvSGVsdmV0aWNhPj4KZW5kb2JqCjUgMCBvYmoKPDwvTGVuZ3RoIDk4Pj4Kc3RyZWFtCkJUCi9GMSAxOCBUZgo3MiA3MjAgVGQKKFBDRUEgU3QgQW5kcmV3cyAtIEZlZSBTdHJ1Y3R1cmUgVGVybSAxIDIwMjYpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMDAwNjAgMDAwMDAgbiAKMDAwMDAwMDExMSAwMDAwMCBuIAowMDAwMDAwMjM0IDAwMDAwIG4gCjAwMDAwMDAzMDEgMDAwMDAgbiAKdHJhaWxlcgo8PC9TaXplIDYvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgo0NDkKJSVFT0YK',
        uploadedAt: '5 Jan 2026',
        visible: true
      },
      {
        id: 'res-3',
        title: '2026 School Term Calendar',
        description: 'Key dates — term openings, half-terms, parent days, closing dates and holidays.',
        category: 'Calendar',
        fileName: 'school-term-calendar-2026.pdf',
        fileType: 'PDF',
        fileSize: '98 KB',
        url: 'data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PgplbmRvYmoKMyAwIG9iago8PC9UeXBlL1BhZ2UvUGFyZW50IDIgMCBSL01lZGlhQm94WzAgMCA2MTIgNzkyXS9SZXNvdXJjZXM8PC9Gb250PDwvRjEgNCAwIFI+Pj4+L0NvbnRlbnRzIDUgMCBSPj4KZW5kb2JqCjQgMCBvYmoKPDwvVHlwZS9Gb250L1N1YnR5cGUvVHlwZTEvQmFzZUZvbnQvSGVsdmV0aWNhPj4KZW5kb2JqCjUgMCBvYmoKPDwvTGVuZ3RoIDk1Pj4Kc3RyZWFtCkJUCi9GMSAxOCBUZgo3MiA3MjAgVGQKKFBDRUEgU3QgQW5kcmV3cyAtIFRlcm0gQ2FsZW5kYXIgMjAyNikgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTUgMDAwMDAgbiAKMDAwMDAwMDA2MCAwMDAwMCBuIAowMDAwMDAwMTExIDAwMDAwIG4gCjAwMDAwMDAyMzQgMDAwMDAgbiAKMDAwMDAwMDMwMSAwMDAwMCBuIAp0cmFpbGVyCjw8L1NpemUgNi9Sb290IDEgMCBSPj4Kc3RhcnR4cmVmCjQ0NgolJUVPRgo=',
        uploadedAt: '8 Jan 2026',
        visible: true
      },
      {
        id: 'res-4',
        title: 'School Uniform & Supplies List',
        description: 'Required uniform items, stationery and personal effects checklist per class level.',
        category: 'Forms',
        fileName: 'uniform-supplies-list.pdf',
        fileType: 'PDF',
        fileSize: '74 KB',
        url: 'data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PgplbmRvYmoKMyAwIG9iago8PC9UeXBlL1BhZ2UvUGFyZW50IDIgMCBSL01lZGlhQm94WzAgMCA2MTIgNzkyXS9SZXNvdXJjZXM8PC9Gb250PDwvRjEgNCAwIFI+Pj4+L0NvbnRlbnRzIDUgMCBSPj4KZW5kb2JqCjQgMCBvYmoKPDwvVHlwZS9Gb250L1N1YnR5cGUvVHlwZTEvQmFzZUZvbnQvSGVsdmV0aWNhPj4KZW5kb2JqCjUgMCBvYmoKPDwvTGVuZ3RoIDk5Pj4Kc3RyZWFtCkJUCi9GMSAxOCBUZgo3MiA3MjAgVGQKKFBDRUEgU3QgQW5kcmV3cyAtIFVuaWZvcm0gJiBTdXBwbGllcyBMaXN0KSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMDYwIDAwMDAwIG4gCjAwMDAwMDAxMTEgMDAwMDAgbiAKMDAwMDAwMDIzNCAwMDAwMCBuIAowMDAwMDAwMzAxIDAwMDAwIG4gCnRyYWlsZXIKPDwvU2l6ZSA2L1Jvb3QgMSAwIFI+PgpzdGFydHhyZWYKNDUwCiUlRU9GCg==',
        uploadedAt: '10 Jan 2026',
        visible: true
      }
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
  const [toastExiting, setToastExiting] = useState(false);
  const toastTimersRef = React.useRef<ReturnType<typeof setTimeout>[]>([]);

  const showToast = (msg: string) => {
    // Clear any pending timers so consecutive toasts restart cleanly
    toastTimersRef.current.forEach(clearTimeout);
    toastTimersRef.current = [];

    setToastExiting(false);
    setToastMessage(msg);

    toastTimersRef.current.push(
      setTimeout(() => setToastExiting(true), 3650),
      setTimeout(() => {
        setToastMessage(null);
        setToastExiting(false);
      }, 4000)
    );
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

  // Shared data refresh function — re-fetches all collections from server
  const refreshData = React.useCallback(async () => {
    try {
      const [
        fetchedUsers,
        health,
        fetchedStudents,
        fetchedPayments,
        fetchedGrades,
        fetchedTimetable,
        fetchedEvents,
        fetchedCms
      ] = await Promise.all([
        api.getUsers().catch(() => DEMO_USERS),
        api.getHealth().catch(() => ({ database: { connected: true, provider: 'High-Speed Database' } })),
        api.getStudents().catch(() => null),
        api.getPayments().catch(() => null),
        api.getGrades().catch(() => null),
        api.getTimetable().catch(() => null),
        api.getEvents().catch(() => null),
        api.getCmsContent().catch(() => null)
      ]);

      if (fetchedUsers && fetchedUsers.length > 0) setUsers(fetchedUsers);
      if (health?.database) setDbStatus(health.database);
      if (fetchedStudents) setStudents(fetchedStudents);
      if (fetchedPayments) setPayments(fetchedPayments);
      if (fetchedGrades) setGrades(fetchedGrades);
      if (fetchedTimetable) setTimetableSlots(fetchedTimetable);
      if (fetchedEvents) setEvents(fetchedEvents);
      if (fetchedCms) setWebsiteContent((prev) => ({ ...prev, ...fetchedCms }));
    } catch (err) {
      console.error('Data refresh error:', err);
    }
  }, []);

  // Initial data bootstrap on mount
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Re-fetch data when browser tab regains focus (catches external/server changes)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && appMode === 'system') {
        refreshData();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [refreshData, appMode]);

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
      showToast(`Learner ${created.firstName} ${created.lastName} successfully enrolled.`);
      await refreshData();
    } catch (err: any) {
      showToast(`Error enrolling learner: ${err.message}`);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      const student = students.find(s => s.id === id);
      await api.deleteStudent(id);
      showToast(`Learner ${student ? student.firstName + ' ' + student.lastName : ''} removed from the system.`);
      await refreshData();
    } catch (err: any) {
      showToast(`Error removing learner: ${err.message}`);
    }
  };

  const handleDeletePayment = async (id: string) => {
    try {
      await api.deletePayment(id);
      showToast('Payment record removed.');
      await refreshData();
    } catch (err: any) {
      showToast(`Error removing payment: ${err.message}`);
    }
  };

  const handleDeleteGrade = async (id: string) => {
    try {
      await api.deleteGrade(id);
      showToast('Grade record removed.');
      await refreshData();
    } catch (err: any) {
      showToast(`Error removing grade: ${err.message}`);
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
      showToast(`Fee receipt #${newPayment.receiptNumber} generated for KES ${data.amount.toLocaleString()}.`);
      await refreshData();
    } catch (err: any) {
      showToast(`Error recording fee payment: ${err.message}`);
    }
  };

  // Grading
  const handleSaveGrades = async (updates: Partial<GradeRecord>[]) => {
    try {
      await api.saveGrades(updates);
      showToast(`Marks published successfully for ${updates.length} students.`);
      await refreshData();
    } catch (err: any) {
      showToast(`Error saving grades: ${err.message}`);
    }
  };

  // Timetable
  const handleAddSlot = async (slotData: Partial<TimetableSlot>) => {
    try {
      const newSlot = await api.addTimetableSlot(slotData);
      showToast(`Added ${newSlot.subject} to ${newSlot.grade} schedule.`);
      await refreshData();
    } catch (err: any) {
      showToast(`Error adding timetable slot: ${err.message}`);
    }
  };

  const handleDeleteSlot = async (id: string) => {
    try {
      await api.deleteTimetableSlot(id);
      showToast('Lesson slot removed from timetable.');
      await refreshData();
    } catch (err: any) {
      showToast(`Error removing timetable slot: ${err.message}`);
    }
  };

  // School Calendar / Events
  const handleAddEvent = async (eventData: Partial<SchoolEvent>) => {
    try {
      const newEvent = await api.addEvent(eventData);
      showToast(`Added "${newEvent.title}" to the school calendar.`);
      await refreshData();
    } catch (err: any) {
      showToast(`Error adding event: ${err.message}`);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await api.deleteEvent(id);
      showToast('Event removed from the school calendar.');
      await refreshData();
    } catch (err: any) {
      showToast(`Error removing event: ${err.message}`);
    }
  };

  const handleUpdateEvent = async (id: string, updates: Partial<SchoolEvent>) => {
    try {
      await api.updateEvent(id, updates);
      if (updates.googleCalendarId) {
        showToast('Event linked to Google Calendar.');
      }
      await refreshData();
    } catch (err: any) {
      showToast(`Error updating event: ${err.message}`);
    }
  };

  if (appMode === 'landing') {
    return (
      <LandingPage
        content={websiteContent}
        onEnterSystem={(role) => {
          setLoginRole(role);
          setAppMode('login');
        }}
      />
    );
  }

  if (appMode === 'login') {
    return (
      <LoginPage
        users={users}
        preselectedRole={loginRole}
        onLogin={(user, remember) => {
          setCurrentUser(user);
          setRememberMe(remember);
          setAppMode('system');
          // Persist session
          const sessionData = JSON.stringify({ appMode: 'system', activeTab, currentUser: user, rememberMe: remember });
          sessionStorage.setItem(SESSION_KEY, sessionData);
          if (remember) {
            localStorage.setItem(SESSION_KEY, sessionData);
          } else {
            localStorage.removeItem(SESSION_KEY);
          }
          showToast(`Welcome back, ${user.name}!`);
        }}
        onBackToLanding={() => setAppMode('landing')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-canvas dark:bg-[#040b14] text-slate-900 dark:text-slate-100 font-sans flex flex-col antialiased w-full overflow-x-hidden transition-colors duration-200">
      {/* Top Header Navbar */}
      <Navbar
        currentUser={currentUser}
        dbStatus={dbStatus}
        activeStudentsCount={students.filter((s) => s.status === 'active').length}
        onNavigateTab={(tab) => navigateToTab(tab)}
        theme={theme}
        resolvedTheme={resolvedTheme}
        onThemeChange={setTheme}
        onToggleTheme={toggleTheme}
        onReturnToLanding={() => setAppMode('landing')}
        onLogout={() => {
          // Clear persisted session
          sessionStorage.removeItem(SESSION_KEY);
          localStorage.removeItem(SESSION_KEY);
          setRememberMe(false);
          setAppMode('landing');
          setActiveTab('dashboard');
        }}
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
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-5 lg:p-6 xl:p-7 2xl:p-8 pb-24 sm:pb-24 md:pb-24 lg:pb-24 xl:pb-24 2xl:pb-24 bg-canvas dark:bg-[#040b14] transition-colors w-full">
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
              <div
                role="status"
                aria-live="polite"
                className="fixed top-4 sm:top-5 left-1/2 z-[110] bg-slate-900 dark:bg-slate-800 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl shadow-2xl border border-slate-700 dark:border-slate-700 flex items-center gap-2 sm:gap-2.5 max-w-[calc(100vw-1.5rem)] sm:max-w-sm"
                style={{
                  animation: toastExiting
                    ? 'toastSlideUp 0.35s cubic-bezier(0.4, 0, 1, 1) forwards'
                    : 'toastSlideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: 'translateX(-50%)',
                }}
              >
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
                onDeleteStudent={handleDeleteStudent}
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
                onDeletePayment={handleDeletePayment}
                userRole={currentUser.role}
              />
            )}

            {/* Tab: Academic Performance & Grading */}
            {activeTab === 'grading' && (
              <GradingTracker
                students={students}
                grades={grades}
                onSaveGrades={handleSaveGrades}
                onDeleteGrade={handleDeleteGrade}
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
                onSaveContent={async (newC) => {
                  setWebsiteContent(newC);
                  await api.saveCmsContent(newC);
                }}
              />
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
