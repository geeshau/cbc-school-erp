import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  ArrowUpRight,
  Star,
  Menu,
  X,
  Plus,
  Phone,
  Mail,
  MapPin,
  Send,
  FileText,
  CheckCircle2,
  Heart,
  Sparkles,
  Baby,
  Blocks,
  GraduationCap,
  Image as ImageIcon,
  Lock,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Quote,
  ThumbsUp,
} from 'lucide-react';
import { WebsiteContent, FeedbackComment } from './WebsiteContentManager';

interface LandingPageProps {
  content?: WebsiteContent;
  onEnterSystem: (role?: 'teacher' | 'admin') => void;
}

const TEAL = '#0D3B36';

const NAV_LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#programmes', label: 'Programmes' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#reports', label: 'Reports', modal: true },
];

const HERO_FACTS = [
  { value: 'PG – G3', label: 'Playgroup to Grade 3' },
  { value: 'CBC', label: 'Competency-based curriculum' },
  { value: 'Nairobi', label: 'Church Road, St Andrews' },
];

const REASONS = [
  {
    icon: Users,
    title: 'Caring Educators',
    text: 'Attentive early-years teachers who know every child by name and support them at their own pace.',
  },
  {
    icon: ShieldCheck,
    title: 'Safe Campus',
    text: 'Secure, child-friendly spaces within the serene St Andrews compound — peace of mind for every parent.',
  },
  {
    icon: BookOpen,
    title: 'CBC-Aligned Learning',
    text: 'Strong foundations in literacy, numeracy and creativity through play-based, Montessori-inspired learning.',
  },
];

const STEPS = [
  {
    title: 'Send an Admissions Enquiry',
    text: 'Use the office enquiry form or call us to ask about vacancies, fees, uniform and transport.',
    image: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Parent enquiring about school admissions at reception',
  },
  {
    title: 'Visit the School',
    text: 'Tour our classrooms and play areas, meet the teachers and see a typical learning day.',
    image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Teacher guiding children during a classroom activity',
  },
  {
    title: 'Complete Enrolment',
    text: 'Submit the admission documents and your child is ready to begin their bright journey.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Happy child with backpack ready for first day of school',
  },
];

const VALUES = [
  { value: 'Montessori', label: 'Inspired learning' },
  { value: 'CBC', label: 'Curriculum foundations' },
  { value: 'Christian', label: 'Values & devotion' },
  { value: 'Holistic', label: 'Care for every child' },
];

const PROGRAMMES = [
  {
    icon: Baby,
    title: 'Playgroup',
    age: 'Ages 2–3',
    text: 'A gentle first step into school — sensory play, songs, stories and social skills in a nurturing setting.',
  },
  {
    icon: Blocks,
    title: 'PP1 & PP2',
    age: 'Ages 4–5',
    text: 'Pre-primary CBC foundations in language, number work, environmental and creative activities.',
  },
  {
    icon: GraduationCap,
    title: 'Grade 1 – 3',
    age: 'CBC Primary',
    text: 'Lower primary learning that builds confident readers, problem-solvers and kind young leaders.',
  },
];

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-[#F8F9FA] px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 transition focus:border-[#0D3B36] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D3B36]/20';

const Stars: React.FC<{ size?: string }> = ({ size = 'h-4 w-4' }) => (
  <span className="flex items-center gap-0.5" aria-hidden="true">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`${size} fill-[#FFAE00] text-[#FFAE00]`} />
    ))}
  </span>
);

const SectionLabel: React.FC<{ children: React.ReactNode; light?: boolean }> = ({ children, light }) => (
  <span className={`text-sm font-bold uppercase tracking-[0.2em] ${light ? 'text-[#FFAE00]' : 'text-[#F7941D]'}`}>
    {children}
  </span>
);

export const LandingPage: React.FC<LandingPageProps> = ({ content, onEnterSystem }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const phone = content?.phone || '0786198873';
  const email = content?.email || 'kindergarten@pceastandrews.org';
  const altEmail = content?.altEmail || 'pceastandrewskindergarten@gmail.com';
  const location = content?.location || 'kindergarten.pceastandrews.org';
  const admissionLabel = content?.admissionLabel || 'Admissions Open';
  const galleryImages = content?.galleryImages?.length
    ? content.galleryImages
    : [
        { id: '1', title: 'Interactive Classroom Session', url: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80', category: 'Academics' },
        { id: '2', title: 'Safe Outdoor Play Ground', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80', category: 'Recreation' },
        { id: '3', title: 'Creative Arts & Crafts', url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80', category: 'Talents' },
      ];

  // Report request form
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [childName, setChildName] = useState('');
  const [parentName, setParentName] = useState('');
  const [adminNumber, setAdminNumber] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // Office enquiry form
  const [enquiryName, setEnquiryName] = useState('');
  const [enquiryEmail, setEnquiryEmail] = useState('');
  const [enquiryMessage, setEnquiryMessage] = useState('');
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);

  // Feedback from CMS (visible only)
  const visibleFeedback = (content?.feedbackComments || []).filter((fb) => fb.visible);

  // Horizontal slideshow — page-by-page with auto-advance
  const [slideIndex, setSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [cardsPerView, setCardsPerView] = useState(3);

  // Responsive cards-per-view
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setCardsPerView(w < 640 ? 1 : w < 1024 ? 2 : 3);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const totalSlides = Math.max(1, Math.ceil(visibleFeedback.length / cardsPerView));

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, totalSlides]);

  // Clamp slide index when cards or cardsPerView change
  useEffect(() => {
    setSlideIndex((prev) => Math.min(prev, totalSlides - 1));
  }, [totalSlides]);

  // Like handling (local session only)
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [localLikes, setLocalLikes] = useState<Record<string, number>>({});

  const handleLike = (id: string) => {
    if (likedIds.has(id)) return;
    setLikedIds((prev) => new Set(prev).add(id));
    setLocalLikes((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  // Feedback submission form
  const [feedbackFormOpen, setFeedbackFormOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackRole, setFeedbackRole] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    // In a real app this would POST to the server; for now show confirmation
    setFeedbackText('');
    setFeedbackRole('');
    setFeedbackSubmitted(true);
    setTimeout(() => setFeedbackSubmitted(false), 4000);
  };

  // Scroll-to-top visibility & sticky nav
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showStickyNav, setShowStickyNav] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setShowScrollTop(y > 400);
      setShowStickyNav(y > 120);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!childName || !parentName || !adminNumber || !parentEmail) {
      alert('Please fill in all required fields to request the child report.');
      return;
    }
    setReportSubmitted(true);
  };

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryName || !enquiryEmail || !enquiryMessage) {
      alert('Please complete your office enquiry details.');
      return;
    }
    setEnquirySubmitted(true);
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-[#F8F9FA] font-['Plus_Jakarta_Sans',sans-serif] text-slate-800 antialiased">
      {/* ───────────── Announcement bar ───────────── */}
      <div className="bg-[#082824] px-4 py-2 text-xs text-white/85">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-1 sm:justify-between">
          <p className="text-center sm:text-left">
            <span className="mr-1.5 font-bold text-[#FFAE00]">Term 1 2026:</span>
            {content?.announcementText || 'PCEA St Andrews Kindergarten Portal — Admissions Open.'}
          </p>
          <div className="flex items-center gap-4">
            <a href={`tel:${phone}`} className="flex items-center gap-1.5 hover:text-white">
              <Phone className="h-3.5 w-3.5" aria-hidden="true" /> {phone}
            </a>
            <a href={`mailto:${email}`} className="hidden items-center gap-1.5 hover:text-white md:flex">
              <Mail className="h-3.5 w-3.5" aria-hidden="true" /> {email}
            </a>
          </div>
        </div>
      </div>

      {/* ───────────── Sticky Top Navbar (appears on scroll) ───────────── */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          showStickyNav
            ? 'translate-y-0 opacity-100'
            : '-translate-y-full opacity-0 pointer-events-none'
        }`}
        style={{ backgroundColor: TEAL }}
      >
        <div className="border-b border-white/10 bg-[#0D3B36]/95 backdrop-blur-xl shadow-lg shadow-black/20">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
            <a href="#home" className="flex items-center gap-2.5 text-white" onClick={scrollToTop}>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFAE00] text-sm font-black text-[#0D3B36]">
                PS
              </span>
              <span className="text-sm font-extrabold tracking-tight sm:text-base">PCEA St Andrews</span>
            </a>

            <nav className="hidden items-center gap-6 lg:flex" aria-label="Sticky navigation">
              {NAV_LINKS.map((link) => (
                link.modal ? (
                  <button
                    key={link.href}
                    type="button"
                    onClick={() => setReportModalOpen(true)}
                    className="text-sm font-semibold text-white/70 transition-colors hover:text-white cursor-pointer"
                  >
                    {link.label}
                  </button>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-sm font-semibold text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                )
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onEnterSystem()}
                className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/20"
              >
                <Lock className="h-3 w-3" />
                Staff
              </button>
              <a
                href="#enquire"
                className="hidden rounded-full bg-[#F7941D] px-5 py-2 text-xs font-bold text-white shadow-lg shadow-orange-500/30 transition hover:bg-[#FFAE00] sm:inline-flex"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ───────────── Hero (with header) ───────────── */}
      <div className="relative overflow-hidden" style={{ backgroundColor: TEAL }}>
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -left-32 top-24 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute right-0 top-0 h-[520px] w-[520px] rounded-full bg-teal-300/10 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:26px_26px]" />
        </div>

        {/* Header */}
        <header className="relative z-20">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
            <a href="#home" className="flex items-center gap-3 text-white">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFAE00] text-lg font-black text-[#0D3B36]">
                PS
              </span>
              <span className="leading-tight">
                <span className="block text-base font-extrabold tracking-tight sm:text-lg">PCEA St Andrews</span>
                <span className="block text-[11px] font-medium text-white/60">Kindergarten & School</span>
              </span>
            </a>

            <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
              {NAV_LINKS.map((link, i) => (
                link.modal ? (
                  <button
                    key={link.href}
                    type="button"
                    onClick={() => setReportModalOpen(true)}
                    className={`relative text-sm font-semibold transition-colors hover:text-white cursor-pointer ${
                      'text-white/70 after:w-0 hover:after:w-full'
                    } after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:rounded-full after:bg-[#FFAE00] after:transition-all`}
                  >
                    {link.label}
                  </button>
                ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm font-semibold transition-colors hover:text-white ${
                    i === 0 ? 'text-white after:w-full' : 'text-white/70 after:w-0 hover:after:w-full'
                  } after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:rounded-full after:bg-[#FFAE00] after:transition-all`}
                >
                  {link.label}
                </a>
                )
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onEnterSystem()}
                className="hidden rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-bold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20 sm:inline-flex items-center gap-1.5"
              >
                <Lock className="h-3.5 w-3.5" />
                Staff
              </button>
              <a
                href="#enquire"
                className="hidden rounded-full bg-[#F7941D] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition hover:-translate-y-0.5 hover:bg-[#FFAE00] sm:inline-flex"
              >
                Contact
              </a>
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-white hover:bg-white/10 lg:hidden"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                aria-controls="mobile-nav"
              >
                {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {menuOpen && (
            <nav id="mobile-nav" className="mx-5 mb-4 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-xl lg:hidden" aria-label="Mobile">
              {NAV_LINKS.map((link) => (
                link.modal ? (
                  <button
                    key={link.href}
                    type="button"
                    onClick={() => { setMenuOpen(false); setReportModalOpen(true); }}
                    className="block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-white/90 hover:bg-white/10"
                  >
                    {link.label}
                  </button>
                ) : (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-semibold text-white/90 hover:bg-white/10"
                >
                  {link.label}
                </a>
                )
              ))}
              <button
                type="button"
                onClick={() => { setMenuOpen(false); onEnterSystem(); }}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-bold text-white"
              >
                <Lock className="h-3.5 w-3.5" />
                Staff Login
              </button>
              <a
                href="#enquire"
                onClick={() => setMenuOpen(false)}
                className="mt-2 block rounded-xl bg-[#F7941D] px-4 py-3 text-center text-sm font-bold text-white"
              >
                Contact
              </a>
            </nav>
          )}
        </header>

        {/* Hero content */}
        <section id="home" aria-labelledby="hero-heading" className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-5 pb-36 pt-8 sm:px-8 lg:grid-cols-2 lg:pb-44 lg:pt-12">
          <div className="text-center lg:text-left">
            <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 backdrop-blur">
              <Stars />
              <span className="text-xs font-semibold text-white sm:text-sm">
                Loved by parents <span className="text-white/60">· {admissionLabel}</span>
              </span>
            </div>

            <h1 id="hero-heading" className="mt-6 text-balance text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
              {content?.heroTitle || (
                <>
                  Where little minds <span className="text-[#FFAE00]">grow bright.</span>
                </>
              )}{' '}
              <span className="inline-block origin-bottom-left animate-[wave_2.4s_ease-in-out_infinite]" role="img" aria-label="pointing hand">
                👉
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg lg:mx-0">
              {content?.heroSubtitle ||
                'Montessori-inspired learning, CBC foundations, and Christian values — in a safe, joyful environment at PCEA St Andrews, Church Road, Nairobi.'}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-5 sm:flex-row lg:justify-start">
              <a
                href="#enquire"
                className="group inline-flex items-center gap-2 rounded-2xl bg-[#F7941D] px-6 py-4 text-sm font-bold text-white shadow-xl shadow-orange-500/30 transition hover:-translate-y-0.5 hover:bg-[#FFAE00]"
              >
                {content?.heroPrimaryCtaLabel || 'Enquire About Admissions'}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </a>

              <button type="button" onClick={() => setReportModalOpen(true)} className="group inline-flex items-center gap-3 text-white cursor-pointer">
                <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#0D3B36] shadow-lg transition group-hover:scale-105">
                  <span className="absolute inset-0 animate-ping rounded-full bg-white/30" aria-hidden="true" />
                  <FileText className="relative h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-sm font-bold underline-offset-4 group-hover:underline">
                  {content?.heroSecondaryCtaLabel || 'Request Child Report'}
                </span>
              </button>
            </div>

            <dl className="mt-12 grid grid-cols-3 divide-x divide-white/15 rounded-2xl border border-white/10 bg-white/5 py-5 backdrop-blur">
              {HERO_FACTS.map((s) => (
                <div key={s.value} className="flex flex-col-reverse px-2 text-center sm:px-5">
                  <dt className="mt-1 text-[11px] leading-snug text-white/60 sm:text-xs">{s.label}</dt>
                  <dd className="text-lg font-extrabold text-white sm:text-2xl">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Hero image */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
            <div className="absolute inset-x-6 bottom-0 top-10 rounded-[45%_55%_40%_60%/55%_45%_55%_45%] bg-gradient-to-br from-emerald-300/30 to-teal-500/20" aria-hidden="true" />
            <div className="absolute left-1/2 top-1/2 h-[90%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-white/15" aria-hidden="true" />
            <img
              src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80"
              alt="Children learning together in a bright, welcoming classroom"
              className="relative z-10 mx-auto aspect-[4/5] w-[85%] rounded-b-[2.5rem] rounded-t-[999px] object-cover shadow-2xl shadow-black/40 ring-4 ring-white/10"
              fetchPriority="high"
            />

            <Plus className="absolute left-2 top-8 z-20 h-8 w-8 text-[#FFAE00] [animation:lh-float_5s_ease-in-out_infinite]" strokeWidth={3} aria-hidden="true" />
            <Plus className="absolute bottom-24 right-0 z-20 h-6 w-6 text-[#FFAE00] [animation:lh-float_6s_ease-in-out_infinite_-2s]" strokeWidth={3} aria-hidden="true" />
            <span className="absolute right-6 top-4 z-20 h-5 w-5 rounded-full border-4 border-[#FFAE00]" aria-hidden="true" />
            <span className="absolute bottom-10 left-0 z-20 h-3 w-3 rounded-full bg-white/70" aria-hidden="true" />

            <div className="absolute -left-2 bottom-16 z-20 flex items-center gap-3 rounded-2xl bg-white p-3 pr-5 shadow-2xl [animation:lh-float_6s_ease-in-out_infinite] sm:-left-8">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0D3B36]/10 text-[#0D3B36]">
                <Heart className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-extrabold text-slate-900">Parents trust us</p>
                <p className="text-[11px] text-slate-500">Safe, nurturing, holistic care</p>
              </div>
            </div>

            <div className="absolute -right-2 top-20 z-20 rounded-2xl bg-white px-4 py-3 shadow-2xl [animation:lh-float_7s_ease-in-out_infinite_-3s] sm:-right-6">
              <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-[#F7941D]">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> {admissionLabel}
              </p>
              <p className="mt-0.5 text-sm font-extrabold text-slate-900">Term 1 2026</p>
            </div>
          </div>
        </section>

        <svg className="absolute bottom-0 left-0 z-10 h-20 w-full sm:h-28 lg:h-32" viewBox="0 0 1440 140" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,80 C240,150 480,10 720,60 C960,110 1200,140 1440,50 L1440,140 L0,140 Z" fill="#F8F9FA" />
        </svg>
      </div>

      {/* ───────────── Parent Feedback Carousel ───────────── */}
      {visibleFeedback.length > 0 && (
      <section id="feedback" className="scroll-mt-6 bg-[#F8F9FA] pb-8 pt-16 lg:pb-12 lg:pt-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {/* Header */}
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>What Parents Say</SectionLabel>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0D3B36] sm:text-4xl lg:text-5xl">
              Voices From Our School Community
            </h2>
            <p className="mt-4 text-slate-500">
              Anonymous feedback from parents and guardians about their experience at PCEA St Andrews Kindergarten.
            </p>
          </div>

          {/* Horizontal Slideshow Carousel */}
          <div
            className="relative mt-12 px-6 sm:px-12"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            aria-roledescription="carousel"
            aria-label="Parent feedback"
          >
            {/* Prev / Next arrows */}
            {totalSlides > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides)}
                  className="absolute left-0 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-[#0D3B36] shadow-md transition-all hover:bg-[#0D3B36] hover:text-white"
                  aria-label="Previous feedback"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setSlideIndex((prev) => (prev + 1) % totalSlides)}
                  className="absolute right-0 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-[#0D3B36] shadow-md transition-all hover:bg-[#0D3B36] hover:text-white"
                  aria-label="Next feedback"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Slide track */}
            <div className="overflow-hidden rounded-2xl">
              <div
                className="flex transition-transform duration-600 ease-in-out"
                style={{ transform: `translateX(-${slideIndex * 100}%)` }}
              >
                {/* Each slide is a full-width page of cards */}
                {Array.from({ length: totalSlides }).map((_, slideIdx) => {
                  const slideCards = visibleFeedback.slice(
                    slideIdx * cardsPerView,
                    slideIdx * cardsPerView + cardsPerView
                  );
                  return (
                    <div
                      key={slideIdx}
                      className="grid w-full shrink-0 gap-5"
                      style={{
                        gridTemplateColumns: `repeat(${cardsPerView}, minmax(0, 1fr))`,
                      }}
                      role="group"
                      aria-roledescription="slide"
                      aria-label={`Feedback page ${slideIdx + 1} of ${totalSlides}`}
                    >
                      {slideCards.map((fb) => {
                        const totalLikes = fb.likes + (localLikes[fb.id] || 0);
                        return (
                          <article
                            key={fb.id}
                            className="group relative flex flex-col rounded-3xl rounded-tr-[3rem] border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#0D3B36]/25 hover:shadow-[0_20px_60px_-20px_rgba(13,59,54,0.25)]"
                          >
                            {/* Quote icon */}
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0D3B36]/[0.07] text-[#0D3B36] transition-colors group-hover:bg-[#FFAE00]/15 group-hover:text-[#F7941D]">
                              <Quote className="h-5 w-5" aria-hidden="true" />
                            </span>

                            {/* Comment text */}
                            <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">
                              &ldquo;{fb.text}&rdquo;
                            </p>

                            {/* Footer: role, date, like */}
                            <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4 transition-colors group-hover:border-slate-300">
                              <div className="flex items-center gap-2.5">
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0D3B36] text-xs font-bold text-white">
                                  {fb.role.charAt(0).toUpperCase()}
                                </span>
                                <div className="min-w-0">
                                  <span className="block text-xs font-bold text-[#0D3B36] truncate">{fb.role}</span>
                                  <span className="block text-[10px] text-slate-400">{fb.date}</span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleLike(fb.id)}
                                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
                                  likedIds.has(fb.id)
                                    ? 'bg-[#FFAE00]/15 text-[#F7941D]'
                                    : 'bg-slate-100 text-slate-400 hover:bg-[#FFAE00]/10 hover:text-[#F7941D]'
                                }`}
                                aria-label={`Like this feedback (${totalLikes} likes)`}
                              >
                                <ThumbsUp className={`h-3.5 w-3.5 ${likedIds.has(fb.id) ? 'fill-[#F7941D]' : ''}`} />
                                {totalLikes}
                              </button>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Slide indicator dots */}
            {totalSlides > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                {Array.from({ length: totalSlides }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSlideIndex(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === slideIndex
                        ? 'w-8 bg-[#0D3B36]'
                        : 'w-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Go to feedback page ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Submit Anonymous Feedback — collapsed by default */}
          <div className="mx-auto mt-14 max-w-2xl">
            <div className="relative rounded-3xl rounded-tr-[4rem] border border-slate-200 bg-white shadow-sm overflow-hidden">
              <span className="absolute right-0 top-0 h-14 w-14 rounded-tr-[4rem] border-r-4 border-t-4 border-[#0D3B36]/30" aria-hidden="true" />

              {/* Clickable header — always visible */}
              <button
                type="button"
                onClick={() => setFeedbackFormOpen((o) => !o)}
                className="flex w-full items-center gap-3 p-6 text-left transition-colors hover:bg-slate-50 sm:p-8"
                aria-expanded={feedbackFormOpen}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0D3B36] text-white">
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-extrabold text-[#0D3B36]">Share Your Experience</h3>
                  <p className="text-xs text-slate-500">Your feedback is anonymous and helps other parents.</p>
                </div>
                <ChevronRight
                  className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ${feedbackFormOpen ? 'rotate-90' : ''}`}
                  aria-hidden="true"
                />
              </button>

              {/* Collapsible form */}
              <div
                className="grid transition-all duration-300 ease-in-out"
                style={{ gridTemplateRows: feedbackFormOpen ? '1fr' : '0fr' }}
              >
                <div className="overflow-hidden">
                  <div className="px-6 pb-6 sm:px-8 sm:pb-8">
                    {feedbackSubmitted && (
                      <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                        <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                        Thank you! Your anonymous feedback has been submitted for review.
                      </div>
                    )}

                    <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="fb-text" className="mb-1.5 block text-xs font-bold text-slate-700">Your Comment *</label>
                        <textarea
                          id="fb-text"
                          rows={3}
                          required
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          placeholder="Share your experience as a parent at St Andrews..."
                          className={`${inputClass} resize-none`}
                          maxLength={500}
                        />
                        <p className="mt-1 text-right text-[10px] text-slate-400">{feedbackText.length}/500</p>
                      </div>
                      <div>
                        <label htmlFor="fb-role" className="mb-1.5 block text-xs font-bold text-slate-700">
                          Your Role <span className="font-normal text-slate-400">(optional — e.g. "Parent — PP1")</span>
                        </label>
                        <input
                          id="fb-role"
                          type="text"
                          value={feedbackRole}
                          onChange={(e) => setFeedbackRole(e.target.value)}
                          placeholder="Anonymous Parent"
                          className={inputClass}
                        />
                      </div>
                      <button
                        type="submit"
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0D3B36] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#0D3B36]/20 transition hover:-translate-y-0.5 hover:bg-[#145A52]"
                      >
                        <Send className="h-4 w-4" aria-hidden="true" /> Post Anonymous Feedback
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ───────────── 3 Reasons ───────────── */}
      <section id="about" className="mx-auto max-w-7xl scroll-mt-6 px-5 pt-10 pb-20 sm:px-8 lg:pt-14 lg:pb-24">
        <div className="mx-auto max-w-2xl text-center">
          <SectionLabel>Why PCEA St Andrews</SectionLabel>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0D3B36] sm:text-4xl lg:text-5xl">3 Reasons To Choose Us</h2>
          <p className="mt-4 text-slate-500">
            A holistic, loving and stimulating environment where children discover their full potential.
          </p>
        </div>

        <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map(({ icon: Icon, title, text }, i) => (
            <article
              key={title}
              className={`group relative rounded-3xl rounded-tr-[4.5rem] border border-slate-200 bg-white p-8 shadow-[0_10px_40px_-20px_rgba(13,59,54,0.25)] transition-all duration-300 hover:-translate-y-2 hover:border-[#0D3B36]/40 hover:shadow-[0_30px_60px_-25px_rgba(13,59,54,0.45)] ${
                i === 2 ? 'sm:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <span className="absolute right-0 top-0 h-16 w-16 rounded-tr-[4.5rem] border-r-4 border-t-4 border-[#0D3B36] opacity-80 transition-colors group-hover:border-[#FFAE00]" aria-hidden="true" />
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0D3B36] text-white shadow-lg shadow-[#0D3B36]/30 transition-colors duration-300 group-hover:bg-[#FFAE00] group-hover:text-[#0D3B36]">
                <Icon className="h-7 w-7" aria-hidden="true" />
              </span>
              <h3 className="mt-6 text-xl font-extrabold text-[#0D3B36]">{title}</h3>
              <p className="mt-3 leading-relaxed text-slate-500">{text}</p>
              <a href="#enquire" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#0D3B36] transition-colors hover:text-[#F7941D]">
                Learn More
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* ───────────── How to join ───────────── */}
      <section aria-labelledby="steps-heading" className="bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel>Admissions</SectionLabel>
            <h2 id="steps-heading" className="mt-3 text-3xl font-extrabold tracking-tight text-[#0D3B36] sm:text-4xl lg:text-5xl">
              Follow These 3 Simple Steps to Join Our School!
            </h2>
          </div>

          <div className="mt-16 grid items-center gap-12 lg:grid-cols-[1fr_auto_1fr] lg:gap-14">
            <ol className="relative space-y-4">
              <span className="absolute bottom-8 left-[27px] top-8 w-0.5 bg-slate-200" aria-hidden="true" />
              {STEPS.map((step, i) => {
                const active = i === activeStep;
                return (
                  <li key={step.title}>
                    <button
                      type="button"
                      onClick={() => setActiveStep(i)}
                      onMouseEnter={() => setActiveStep(i)}
                      aria-current={active ? 'step' : undefined}
                      className={`relative flex w-full items-start gap-4 rounded-2xl rounded-tr-[2rem] p-3 text-left transition-all duration-300 ${
                        active ? 'bg-[#0D3B36] shadow-xl shadow-[#0D3B36]/25' : 'hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className={`relative z-10 flex h-8 w-8 shrink-0 translate-x-[7px] items-center justify-center rounded-full text-sm font-extrabold transition-colors ${
                          active ? 'bg-[#FFAE00] text-[#0D3B36]' : 'border-2 border-slate-300 bg-white text-slate-500'
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span className="pl-2">
                        <span className={`block font-extrabold ${active ? 'text-white' : 'text-[#0D3B36]'}`}>{step.title}</span>
                        <span
                          className={`mt-1 block text-sm leading-relaxed transition-all ${
                            active ? 'max-h-24 text-white/70 opacity-100' : 'max-h-0 overflow-hidden opacity-0 lg:max-h-24 lg:text-slate-500 lg:opacity-100'
                          }`}
                        >
                          {step.text}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>

            <div className="relative mx-auto h-72 w-72 sm:h-80 sm:w-80 lg:h-96 lg:w-96">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#0D3B36] to-[#14574f]" aria-hidden="true" />
              <div className="absolute -inset-4 rounded-full border-2 border-dashed border-[#0D3B36]/25 [animation:spin_40s_linear_infinite]" aria-hidden="true" />
              {/* Step images — all rendered, only active one is visible */}
              {STEPS.map((step, i) => (
                <img
                  key={step.title}
                  src={step.image}
                  alt={step.imageAlt}
                  className={`absolute inset-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)] rounded-full object-cover ring-8 ring-white transition-opacity duration-500 ${
                    i === activeStep ? 'opacity-100' : 'opacity-0'
                  }`}
                  loading="lazy"
                />
              ))}
              <span className="absolute -right-1 top-8 flex h-14 w-14 items-center justify-center rounded-full bg-[#FFAE00] text-2xl font-black text-[#0D3B36] shadow-xl ring-4 ring-white transition-all duration-300">
                {activeStep + 1}
              </span>
              <Plus className="absolute -left-4 bottom-10 h-8 w-8 text-[#FFAE00]" strokeWidth={3} aria-hidden="true" />
            </div>

            <dl className="grid grid-cols-2 gap-4 lg:grid-cols-1">
              {VALUES.map((m) => (
                <div
                  key={m.value}
                  className="group flex flex-col-reverse rounded-2xl rounded-tr-[2rem] border border-slate-200 bg-[#F8F9FA] px-6 py-4 transition hover:border-[#0D3B36]/30 hover:bg-white hover:shadow-lg lg:flex-row-reverse lg:items-center lg:justify-between"
                >
                  <dt className="text-sm font-medium text-slate-500">{m.label}</dt>
                  <dd className="text-2xl font-extrabold text-[#0D3B36] transition-colors group-hover:text-[#F7941D]">{m.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ───────────── Programmes ───────────── */}
      <section id="programmes" className="scroll-mt-6 px-4 py-20 sm:px-8 lg:py-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] rounded-tr-[6rem] px-6 py-16 sm:px-12 lg:px-16" style={{ backgroundColor: TEAL }}>
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#FFAE00]/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-emerald-300/10 blur-3xl" />
            <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:24px_24px]" />
          </div>

          <div className="relative flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
            <div>
              <SectionLabel light>Learning Levels</SectionLabel>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">Our Programmes For Your Child</h2>
            </div>
            <a
              href="#enquire"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#F7941D] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition hover:-translate-y-0.5 hover:bg-[#FFAE00]"
            >
              Enquire Now <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <div className="relative mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PROGRAMMES.map(({ icon: Icon, title, age, text }, i) => (
              <article
                key={title}
                className={`group flex flex-col rounded-3xl rounded-tr-[3.5rem] border border-white/10 bg-white/[0.06] p-7 backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:bg-white hover:shadow-2xl ${
                  i === 2 ? 'sm:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFAE00] text-[#0D3B36] shadow-lg shadow-black/20">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-white/80 transition-colors group-hover:bg-[#0D3B36]/10 group-hover:text-[#0D3B36]">
                    {age}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-extrabold text-white transition-colors group-hover:text-[#0D3B36]">{title}</h3>
                <p className="mt-3 flex-1 leading-relaxed text-white/65 transition-colors group-hover:text-slate-500">{text}</p>
                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5 transition-colors group-hover:border-slate-200">
                  <span className="text-xs font-bold text-white/70 group-hover:text-slate-500">{admissionLabel}</span>
                  <a
                    href="#enquire"
                    aria-label={`Enquire about ${title}`}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-all group-hover:rotate-45 group-hover:bg-[#0D3B36]"
                  >
                    <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── Gallery ───────────── */}
      <section id="gallery" className="mx-auto max-w-7xl scroll-mt-6 px-5 pb-20 sm:px-8 lg:pb-24">
        <div className="mx-auto max-w-2xl text-center">
          <SectionLabel>Campus & Activities</SectionLabel>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0D3B36] sm:text-4xl lg:text-5xl">A Glimpse Into Life at St Andrews</h2>
          <p className="mt-4 text-slate-500">Vibrant classrooms, outdoor play areas, creative arts and everyday learning moments.</p>
        </div>

        <div className="mt-12 grid auto-rows-[200px] grid-cols-2 gap-4 sm:auto-rows-[220px] lg:grid-cols-4">
          {galleryImages.map((img, i) => (
            <figure
              key={img.id}
              className={`group relative overflow-hidden rounded-3xl rounded-tr-[3rem] bg-slate-200 shadow-[0_10px_40px_-20px_rgba(13,59,54,0.35)] ${
                i === 0 ? 'col-span-2 row-span-2' : ''
              } ${i === 3 ? 'lg:col-span-2' : ''}`}
            >
              <img
                src={img.url}
                alt={img.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0D3B36]/90 via-[#0D3B36]/40 to-transparent p-4 pt-10">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#FFAE00] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#0D3B36]">
                  <ImageIcon className="h-3 w-3" aria-hidden="true" /> {img.category}
                </span>
                <span className="mt-1.5 block text-sm font-bold text-white">{img.title}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ───────────── Office enquiry ───────────── */}
      <section id="enquire" className="scroll-mt-6 bg-[#F8F9FA] py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-start gap-12 px-5 sm:px-8 lg:grid-cols-2">
          <div>
            <SectionLabel>Direct Contact</SectionLabel>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0D3B36] sm:text-4xl lg:text-5xl">Enquire With Our School Office</h2>
            <p className="mt-4 leading-relaxed text-slate-500">
              Have questions regarding fee structures, admission vacancies, uniform lists, or school bus transport? Send a direct
              enquiry and our admissions officer will respond promptly.
            </p>

            <ul className="mt-8 space-y-4">
              {[
                { icon: Phone, label: 'Call Office Line', value: phone, href: `tel:${phone}` },
                { icon: Mail, label: 'Email Enquiries', value: email, extra: `Alt: ${altEmail}`, href: `mailto:${email}` },
                { icon: MapPin, label: 'Website & Portal', value: location },
              ].map(({ icon: Icon, label, value, extra, href }) => (
                <li
                  key={label}
                  className="group flex items-center gap-4 rounded-2xl rounded-tr-[2rem] border border-slate-200 bg-[#F8F9FA] p-4 transition hover:-translate-y-0.5 hover:border-[#0D3B36]/30 hover:bg-white hover:shadow-lg"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0D3B36] text-white transition-colors group-hover:bg-[#FFAE00] group-hover:text-[#0D3B36]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold text-slate-400">{label}</span>
                    {href ? (
                      <a href={href} className="block break-all font-bold text-[#0D3B36] hover:text-[#F7941D]">
                        {value}
                      </a>
                    ) : (
                      <span className="block break-all font-bold text-[#0D3B36]">{value}</span>
                    )}
                    {extra && <span className="block break-all text-xs text-slate-500">{extra}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative rounded-3xl rounded-tr-[4.5rem] border border-slate-200 bg-white p-6 shadow-[0_30px_80px_-40px_rgba(13,59,54,0.45)] sm:p-8">
            <span className="absolute right-0 top-0 h-16 w-16 rounded-tr-[4.5rem] border-r-4 border-t-4 border-[#FFAE00]" aria-hidden="true" />
            <h3 className="text-xl font-extrabold text-[#0D3B36]">Send Office Message</h3>
            <p className="mt-1 text-sm text-slate-500">Fill out this quick form for office follow-up.</p>

            {enquirySubmitted ? (
              <div className="mt-6 space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" aria-hidden="true" />
                <h4 className="font-bold text-emerald-900">Enquiry Received Successfully!</h4>
                <p className="text-sm text-emerald-700">
                  Thank you, {enquiryName}. Our office will reach out to you via {enquiryEmail} within 24 business hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setEnquirySubmitted(false);
                    setEnquiryName('');
                    setEnquiryEmail('');
                    setEnquiryMessage('');
                  }}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700"
                >
                  Send Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="enq-name" className="mb-1.5 block text-xs font-bold text-slate-700">Your Full Name</label>
                  <input id="enq-name" type="text" required value={enquiryName} onChange={(e) => setEnquiryName(e.target.value)} placeholder="e.g. Mary Wanjiku" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="enq-email" className="mb-1.5 block text-xs font-bold text-slate-700">Parent Email Address</label>
                  <input id="enq-email" type="email" required value={enquiryEmail} onChange={(e) => setEnquiryEmail(e.target.value)} placeholder="e.g. mary@gmail.com" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="enq-msg" className="mb-1.5 block text-xs font-bold text-slate-700">Enquiry Message / Question</label>
                  <textarea id="enq-msg" rows={4} required value={enquiryMessage} onChange={(e) => setEnquiryMessage(e.target.value)} placeholder="Ask about admissions, fee structures, school transport..." className={`${inputClass} resize-none`} />
                </div>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F7941D] py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition hover:-translate-y-0.5 hover:bg-[#FFAE00]"
                >
                  <Send className="h-4 w-4" aria-hidden="true" /> Submit Office Enquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ───────────── Report request CTA banner ───────────── */}
      <section className="px-4 py-14 sm:px-8 lg:py-16">
        <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-6 overflow-hidden rounded-[2.5rem] rounded-tr-[6rem] px-6 py-10 text-center sm:px-12 sm:py-12" style={{ backgroundColor: TEAL }}>
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#FFAE00]/15 blur-3xl" />
            <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:24px_24px]" />
          </div>
          <FileText className="relative h-10 w-10 text-[#FFAE00]" aria-hidden="true" />
          <h2 className="relative text-2xl font-extrabold tracking-tight text-white sm:text-3xl">Request Child Progress Report</h2>
          <p className="relative max-w-lg text-sm text-white/70">
            Parents can request official terminal progress reports and report cards by providing pupil details.
          </p>
          <button
            type="button"
            onClick={() => setReportModalOpen(true)}
            className="relative flex items-center gap-2 rounded-full bg-[#F7941D] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition hover:-translate-y-0.5 hover:bg-[#FFAE00]"
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            Open Report Request Form
          </button>
        </div>
      </section>

      {/* ───────────── Report request MODAL ───────────── */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Request Child Progress Report">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => { setReportModalOpen(false); setReportSubmitted(false); }}
            aria-hidden="true"
          />

          {/* Modal panel */}
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl rounded-tr-[4rem] bg-white shadow-2xl" style={{ animation: 'fadeSlideUp 0.3s ease-out' }}>
            {/* Header */}
            <div className="relative px-6 pt-6 sm:px-8 sm:pt-8" style={{ backgroundColor: TEAL }}>
              <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[#FFAE00]/15 blur-3xl" />
              </div>
              <button
                type="button"
                onClick={() => { setReportModalOpen(false); setReportSubmitted(false); }}
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="relative pb-6 text-center">
                <SectionLabel light>Official Document Portal</SectionLabel>
                <h2 className="mt-2 text-xl font-extrabold tracking-tight text-white sm:text-2xl">Request Child Progress Report</h2>
                <p className="mt-2 text-xs text-white/70">
                  Provide pupil details below to request official terminal progress reports.
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-6 sm:px-8 sm:py-8">
              {reportSubmitted ? (
                <div className="space-y-4 text-center">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" aria-hidden="true" />
                  <h3 className="text-lg font-extrabold text-[#0D3B36]">Report Request Logged Successfully!</h3>
                  <p className="mx-auto max-w-md text-sm leading-relaxed text-slate-600">
                    Child Report Request for <strong className="text-[#F7941D]">{childName}</strong> (Admin No: <span className="font-mono">{adminNumber}</span>)
                    has been submitted for verification. The official term report will be sent to <span className="underline">{parentEmail}</span>.
                  </p>
                  <div className="flex gap-3 justify-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setReportSubmitted(false);
                        setChildName('');
                        setParentName('');
                        setAdminNumber('');
                        setParentEmail('');
                      }}
                      className="rounded-xl bg-[#F7941D] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#FFAE00]"
                    >
                      Request Another
                    </button>
                    <button
                      type="button"
                      onClick={() => { setReportModalOpen(false); setReportSubmitted(false); }}
                      className="rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleReportSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="rep-child" className="mb-1.5 block text-xs font-bold text-slate-700">Name of Child *</label>
                      <input id="rep-child" type="text" required value={childName} onChange={(e) => setChildName(e.target.value)} placeholder="e.g. Liam Kiprono" className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="rep-parent" className="mb-1.5 block text-xs font-bold text-slate-700">Name of Parent *</label>
                      <input id="rep-parent" type="text" required value={parentName} onChange={(e) => setParentName(e.target.value)} placeholder="e.g. David Kiprono" className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="rep-adm" className="mb-1.5 block text-xs font-bold text-slate-700">Child Admission Number *</label>
                      <input id="rep-adm" type="text" required value={adminNumber} onChange={(e) => setAdminNumber(e.target.value)} placeholder="e.g. ADM-2026-001" className={`${inputClass} font-mono`} />
                    </div>
                    <div>
                      <label htmlFor="rep-email" className="mb-1.5 block text-xs font-bold text-slate-700">Parent Email Address *</label>
                      <input id="rep-email" type="email" required value={parentEmail} onChange={(e) => setParentEmail(e.target.value)} placeholder="e.g. david.kiprono@gmail.com" className={inputClass} />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F7941D] py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition hover:-translate-y-0.5 hover:bg-[#FFAE00]"
                  >
                    <FileText className="h-4 w-4" aria-hidden="true" /> Submit Child Report Request
                  </button>
                  <p className="text-center text-xs text-slate-400">Reports are verified against school administrative records before dispatch.</p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ───────────── Footer ───────────── */}
      <footer className="relative overflow-hidden text-white/70" style={{ backgroundColor: '#082824' }}>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FFAE00]/60 to-transparent" aria-hidden="true" />
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFAE00] font-black text-[#0D3B36]">PS</span>
              <span className="font-extrabold text-white">PCEA St Andrews</span>
            </div>
            <p className="text-sm leading-relaxed">
              Nurturing young minds in early childhood education with Christian values, Montessori principles, and CBC academic excellence.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-white">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              {[...NAV_LINKS, { href: '#enquire', label: 'Office Enquiry' }].map((l) => (
                <li key={l.href}>
                  {'modal' in l && l.modal ? (
                    <button type="button" onClick={() => setReportModalOpen(true)} className="transition-colors hover:text-[#FFAE00]">{l.label}</button>
                  ) : (
                    <a href={l.href} className="transition-colors hover:text-[#FFAE00]">{l.label}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-white">Office & Location</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#FFAE00]" aria-hidden="true" /><span className="break-all">{location}</span></li>
              <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#FFAE00]" aria-hidden="true" /><a href={`tel:${phone}`} className="hover:text-white">{phone}</a></li>
              <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#FFAE00]" aria-hidden="true" /><a href={`mailto:${email}`} className="break-all hover:text-white">{email}</a></li>
              <li className="flex items-start gap-2 text-xs"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#FFAE00]" aria-hidden="true" /><span className="break-all">Alt: {altEmail}</span></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-white">Staff & Management</h3>
            <p className="text-xs">Authorised teachers and administrators portal access.</p>
            <button
              type="button"
              onClick={() => onEnterSystem('teacher')}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F7941D] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#FFAE00]"
            >
              Open Teacher Portal <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onEnterSystem('admin')}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              <Lock className="h-4 w-4 text-[#FFAE00]" aria-hidden="true" /> Administrator Login
            </button>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-xs sm:flex-row sm:px-8">
            <p>© {new Date().getFullYear()} PCEA St Andrews Kindergarten & School. All rights reserved.</p>
            <p className="flex items-center gap-1.5 font-semibold text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> Secure SSL Connection
            </p>
          </div>
        </div>
      </footer>

      {/* ───────────── Scroll-to-top button ───────────── */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={`fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-[#0D3B36] text-white shadow-lg shadow-black/20 ring-1 ring-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-[#145A52] hover:shadow-xl hover:scale-105 active:scale-95 ${
          showScrollTop
            ? 'translate-y-0 opacity-100'
            : 'translate-y-4 opacity-0 pointer-events-none'
        }`}
      >
        <ChevronUp className="h-5 w-5" />
      </button>
    </div>
  );
};

export default LandingPage;
