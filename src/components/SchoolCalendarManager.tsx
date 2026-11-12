import React, { useMemo, useState } from 'react';
import {
  CalendarDays,
  Plus,
  Trash2,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  X,
  CalendarPlus,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Link2
} from 'lucide-react';
import { SchoolEvent, SchoolEventCategory, UserRole } from '../types';

interface SchoolCalendarManagerProps {
  events: SchoolEvent[];
  userRole: UserRole;
  currentUserName: string;
  onAddEvent: (event: Partial<SchoolEvent>) => Promise<void>;
  onDeleteEvent: (id: string) => Promise<void>;
  onUpdateEvent: (id: string, updates: Partial<SchoolEvent>) => Promise<void>;
}

const CATEGORIES: SchoolEventCategory[] = ['Academic', 'Holiday', 'Exam', 'Meeting', 'Sports', 'Spiritual', 'General'];

const CATEGORY_STYLES: Record<SchoolEventCategory, { badge: string; dot: string; tile: string }> = {
  Academic: { badge: 'bg-brand-100 text-brand-800 border-brand-200', dot: 'bg-brand-500', tile: 'bg-brand-500' },
  Holiday: { badge: 'bg-rose-100 text-rose-800 border-rose-200', dot: 'bg-rose-500', tile: 'bg-rose-500' },
  Exam: { badge: 'bg-amber-100 text-amber-800 border-amber-200', dot: 'bg-amber-500', tile: 'bg-amber-500' },
  Meeting: { badge: 'bg-indigo-100 text-indigo-800 border-indigo-200', dot: 'bg-indigo-500', tile: 'bg-indigo-500' },
  Sports: { badge: 'bg-emerald-100 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500', tile: 'bg-emerald-500' },
  Spiritual: { badge: 'bg-purple-100 text-purple-800 border-purple-200', dot: 'bg-purple-500', tile: 'bg-purple-500' },
  General: { badge: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-400', tile: 'bg-slate-500' }
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const toYMD = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

/** Build a Google Calendar "Add event" URL (no API keys / OAuth required). */
const buildGoogleCalendarUrl = (event: SchoolEvent): string => {
  const base = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  const fmtDate = (ymd: string) => ymd.replace(/-/g, '');
  const fmtDateTime = (ymd: string, time: string) => `${ymd.replace(/-/g, '')}T${time.replace(':', '')}00`;

  let dates: string;
  if (event.allDay || !event.startTime) {
    // All-day events in Google use an exclusive end date (next day)
    const endExclusive = new Date(`${event.endDate}T00:00:00`);
    endExclusive.setDate(endExclusive.getDate() + 1);
    dates = `${fmtDate(event.startDate)}/${fmtDate(toYMD(endExclusive))}`;
  } else {
    const endTime = event.endTime || event.startTime;
    dates = `${fmtDateTime(event.startDate, event.startTime)}/${fmtDateTime(event.endDate, endTime)}`;
  }

  const params = new URLSearchParams({
    text: event.title,
    dates,
    details: `${event.description}\n\n— PCEA St Andrews Kindergarten School Calendar`,
    location: event.location,
    ctz: 'Africa/Nairobi'
  });

  return `${base}&${params.toString()}`;
};

export const SchoolCalendarManager: React.FC<SchoolCalendarManagerProps> = ({
  events,
  userRole,
  currentUserName,
  onAddEvent,
  onDeleteEvent,
  onUpdateEvent
}) => {
  const isAdmin = userRole === 'admin';
  const today = new Date('2026-11-09');

  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [categoryFilter, setCategoryFilter] = useState<'all' | SchoolEventCategory>('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<SchoolEvent | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultForm = {
    title: '',
    description: '',
    category: 'Academic' as SchoolEventCategory,
    startDate: toYMD(today),
    endDate: toYMD(today),
    startTime: '08:00',
    endTime: '09:00',
    location: 'School Compound',
    allDay: false
  };
  const [formData, setFormData] = useState(defaultForm);

  const filteredEvents = useMemo(() => {
    const list = categoryFilter === 'all' ? events : events.filter(e => e.category === categoryFilter);
    return [...list].sort((a, b) => a.startDate.localeCompare(b.startDate) || (a.startTime || '').localeCompare(b.startTime || ''));
  }, [events, categoryFilter]);

  const upcomingEvents = useMemo(
    () => filteredEvents.filter(e => e.endDate >= toYMD(today)),
    [filteredEvents]
  );

  // Calendar grid for current viewDate month
  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startWeekday = (firstDay.getDay() + 6) % 7; // Monday-first
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: { date: Date; inMonth: boolean }[] = [];
    for (let i = 0; i < startWeekday; i++) {
      cells.push({ date: new Date(year, month, i - startWeekday + 1), inMonth: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ date: new Date(year, month, d), inMonth: true });
    }
    while (cells.length % 7 !== 0) {
      const last = cells[cells.length - 1].date;
      cells.push({ date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1), inMonth: false });
    }
    return cells;
  }, [viewDate]);

  const eventsOnDate = (ymd: string) =>
    filteredEvents.filter(e => ymd >= e.startDate && ymd <= e.endDate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!formData.title.trim()) {
      setFormError('Please provide an event title.');
      return;
    }
    if (!formData.allDay && formData.endTime < formData.startTime && formData.startDate === formData.endDate) {
      setFormError('End time cannot be before start time on the same day.');
      return;
    }
    if (formData.endDate < formData.startDate) {
      setFormError('End date cannot be before the start date.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onAddEvent({ ...formData, createdBy: currentUserName });
      setShowModal(false);
      setFormData(defaultForm);
    } catch (err: any) {
      setFormError(err.message || 'Failed to add event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSync = async (event: SchoolEvent) => {
    // Open Google Calendar "add event" in a new tab
    window.open(buildGoogleCalendarUrl(event), '_blank', 'noopener,noreferrer');
    // Mark as linked locally so the UI reflects the connection
    if (!event.googleCalendarId) {
      setSyncingId(event.id);
      try {
        await onUpdateEvent(event.id, { googleCalendarId: `gcal-${event.id}` });
        // Keep the open modal in sync so it reflects the linked state immediately
        setSelectedEvent(prev => (prev && prev.id === event.id ? { ...prev, googleCalendarId: `gcal-${event.id}` } : prev));
      } finally {
        setSyncingId(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200 dark:border-brand-900">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-brand-500" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-serif">School Calendar & Events</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage term dates, examinations, meetings and school activities. Link events to Google Calendar.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => { setFormData(defaultForm); setFormError(''); setShowModal(true); }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent-500 hover:bg-accent-400 text-brand-900 font-bold text-xs shadow-md shadow-accent-500/30 transition-all cursor-pointer self-start"
          >
            <Plus className="w-4 h-4" />
            <span>Add School Event</span>
          </button>
        )}
      </div>

      {/* Category filter pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setCategoryFilter('all')}
          className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer shrink-0 ${
            categoryFilter === 'all' ? 'bg-brand-800 text-white' : 'bg-slate-100 dark:bg-brand-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          All Events
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer shrink-0 border ${
              categoryFilter === cat ? `${CATEGORY_STYLES[cat].badge} border-current` : 'bg-white dark:bg-brand-950 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-brand-900 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar grid */}
        <div className="lg:col-span-8 bg-white dark:bg-brand-950 rounded-2xl border border-slate-200/80 dark:border-brand-900 rounded-tr-[2rem] shadow-[0_10px_40px_-24px_rgba(13,40,64,0.35)] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-brand-900">
            <h2 className="text-base font-black text-slate-900 dark:text-slate-100 font-serif">
              {MONTH_NAMES[viewDate.getMonth()]} {viewDate.getFullYear()}
            </h2>
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-brand-900 p-1 rounded-xl">
              <button
                onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
                className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-brand-800 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
                title="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewDate(new Date(today.getFullYear(), today.getMonth(), 1))}
                className="px-2.5 py-1 text-xs font-bold rounded-lg hover:bg-white dark:hover:bg-brand-800 text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
              >
                Today
              </button>
              <button
                onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
                className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-brand-800 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
                title="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 bg-brand-800 text-white text-center font-bold text-[11px] py-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
              <div key={d} className={i >= 5 ? 'text-white/50 font-medium' : ''}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-brand-900 flex-1">
            {calendarDays.map((cell, idx) => {
              const ymd = toYMD(cell.date);
              const dayEvents = eventsOnDate(ymd);
              const isToday = ymd === toYMD(today);
              const isWeekend = cell.date.getDay() === 0 || cell.date.getDay() === 6;
              return (
                <div
                  key={idx}
                  className={`min-h-[84px] sm:min-h-[96px] p-1.5 flex flex-col gap-1 ${
                    !cell.inMonth
                      ? 'bg-slate-50/60 dark:bg-brand-950/60 text-slate-300 dark:text-slate-600'
                      : isWeekend
                      ? 'bg-slate-50/70 dark:bg-brand-950/70'
                      : 'bg-white dark:bg-brand-950'
                  }`}
                >
                  <span
                    className={`text-[11px] font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                      isToday ? 'bg-accent-400 text-brand-900' : cell.inMonth ? 'text-slate-600 dark:text-slate-300' : 'text-slate-300 dark:text-slate-600'
                    }`}
                  >
                    {cell.date.getDate()}
                  </span>
                  <div className="flex flex-col gap-0.5 overflow-hidden">
                    {dayEvents.slice(0, 2).map(ev => (
                      <button
                        key={ev.id}
                        onClick={() => setSelectedEvent(ev)}
                        className={`text-left truncate rounded px-1 py-0.5 text-[9px] font-semibold text-white ${CATEGORY_STYLES[ev.category].tile} hover:opacity-90 transition-opacity cursor-pointer`}
                        title={ev.title}
                      >
                        {ev.title}
                      </button>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[9px] text-slate-400 font-semibold px-1">+{dayEvents.length - 2} more</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming events list */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-brand-950 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-brand-900 rounded-tr-[2rem] shadow-[0_10px_40px_-24px_rgba(13,40,64,0.35)]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-500" />
              Upcoming Events
            </h3>
            {upcomingEvents.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">No upcoming events for this filter.</p>
            ) : (
              <div className="space-y-2.5 max-h-[520px] overflow-y-auto no-scrollbar">
                {upcomingEvents.map(ev => (
                  <button
                    key={ev.id}
                    onClick={() => setSelectedEvent(ev)}
                    className="w-full text-left p-3 rounded-xl bg-slate-50 dark:bg-brand-900/40 hover:bg-slate-100 dark:hover:bg-brand-900/70 border border-slate-200/70 dark:border-brand-900 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">{ev.title}</span>
                      <span className={`shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${CATEGORY_STYLES[ev.category].badge}`}>
                        {ev.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      <CalendarDays className="w-3 h-3" />
                      <span>
                        {new Date(`${ev.startDate}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        {ev.endDate !== ev.startDate && ` – ${new Date(`${ev.endDate}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`}
                      </span>
                      {!ev.allDay && ev.startTime && (
                        <>
                          <Clock className="w-3 h-3 ml-1" />
                          <span>{ev.startTime}</span>
                        </>
                      )}
                      {ev.googleCalendarId && (
                        <span className="ml-auto inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400" title="Linked to Google Calendar">
                          <Link2 className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Event detail modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-brand-950 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-brand-900 my-auto rounded-tr-[2rem]">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-brand-900">
              <div className="min-w-0">
                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border mb-2 ${CATEGORY_STYLES[selectedEvent.category].badge}`}>
                  {selectedEvent.category}
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 font-serif leading-tight break-words">
                  {selectedEvent.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-brand-900 text-slate-500 shrink-0 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-sm">
              {selectedEvent.description && (
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">{selectedEvent.description}</p>
              )}
              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                <CalendarDays className="w-4 h-4 text-brand-500 shrink-0" />
                <span className="font-semibold">
                  {new Date(`${selectedEvent.startDate}T00:00:00`).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  {selectedEvent.endDate !== selectedEvent.startDate &&
                    ` – ${new Date(`${selectedEvent.endDate}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}`}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                <Clock className="w-4 h-4 text-brand-500 shrink-0" />
                <span className="font-semibold">
                  {selectedEvent.allDay || !selectedEvent.startTime ? 'All day' : `${selectedEvent.startTime} – ${selectedEvent.endTime || selectedEvent.startTime}`}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                <MapPin className="w-4 h-4 text-brand-500 shrink-0" />
                <span className="font-semibold">{selectedEvent.location}</span>
              </div>
              {selectedEvent.googleCalendarId && (
                <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg px-3 py-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="font-semibold">Linked to Google Calendar</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100 dark:border-brand-900">
              <button
                onClick={() => handleGoogleSync(selectedEvent)}
                disabled={syncingId === selectedEvent.id}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-800 hover:bg-brand-700 text-white font-bold text-xs transition-colors cursor-pointer disabled:opacity-60"
              >
                <CalendarPlus className="w-4 h-4" />
                <span>{selectedEvent.googleCalendarId ? 'Open in Google Calendar' : 'Add to Google Calendar'}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
              {isAdmin && (
                <button
                  onClick={async () => {
                    await onDeleteEvent(selectedEvent.id);
                    setSelectedEvent(null);
                  }}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors cursor-pointer ml-auto"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add event modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-brand-950 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-brand-900 my-auto rounded-tr-[2rem]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-brand-900">
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100 font-serif flex items-center gap-2">
                <CalendarPlus className="w-5 h-5 text-brand-500" />
                New School Event
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-brand-900 text-slate-500 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
              {formError && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-[11px]">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Event Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Term 2 Opening Day"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-brand-800 dark:bg-brand-900 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  placeholder="Short details about the event"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-brand-800 dark:bg-brand-900 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/30 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as SchoolEventCategory })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-brand-800 dark:bg-brand-900 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-brand-800 dark:bg-brand-900 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Start Date *</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={e => setFormData({ ...formData, startDate: e.target.value, endDate: e.target.value > formData.endDate ? e.target.value : formData.endDate })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-brand-800 dark:bg-brand-900 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    min={formData.startDate}
                    onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-brand-800 dark:bg-brand-900 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.allDay}
                  onChange={e => setFormData({ ...formData, allDay: e.target.checked })}
                  className="w-4 h-4 rounded accent-brand-600"
                />
                <span className="text-slate-700 dark:text-slate-300 font-semibold">All-day event</span>
              </label>

              {!formData.allDay && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Start Time</label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-brand-800 dark:bg-brand-900 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">End Time</label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-brand-800 dark:bg-brand-900 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-brand-900 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-500 hover:bg-accent-400 text-brand-900 font-bold shadow-md shadow-accent-500/30 transition-all cursor-pointer disabled:opacity-60"
                >
                  <Plus className="w-4 h-4" />
                  {isSubmitting ? 'Saving…' : 'Save Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
