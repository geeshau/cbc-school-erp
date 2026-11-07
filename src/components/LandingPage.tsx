import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  CalendarCheck,
  FileText,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  Lock,
  Heart,
  Award,
  Sun,
  Moon,
  Send,
  Image as ImageIcon,
  MessageSquare,
  HelpCircle
} from 'lucide-react';
import { useTheme } from '../lib/theme';
import { User } from '../types';
import { DEMO_USERS } from '../data/mockData';

import { WebsiteContent } from './WebsiteContentManager';

interface LandingPageProps {
  content?: WebsiteContent;
  onEnterSystem: (role?: 'teacher' | 'admin') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ content, onEnterSystem }) => {
  const { toggleTheme, isDark } = useTheme();
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const galleryImages = content?.galleryImages || [
    { id: '1', title: 'Interactive Classroom Session', url: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80', category: 'Academics' },
    { id: '2', title: 'Safe Outdoor Play Ground', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80', category: 'Recreation' },
    { id: '3', title: 'Creative Arts & Crafts', url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80', category: 'Talents' }
  ];
  const galleryTilePositions = [
    'gallery-bento-tile-large',
    'gallery-bento-tile-wide',
    'gallery-bento-tile-small-top',
    'gallery-bento-tile-small-middle',
    'gallery-bento-tile-small-bottom',
    'gallery-bento-tile-small-last'
  ];

  // Form states for Report Request
  const [childName, setChildName] = useState('');
  const [parentName, setParentName] = useState('');
  const [adminNumber, setAdminNumber] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // Office Enquiry states
  const [enquiryName, setEnquiryName] = useState('');
  const [enquiryEmail, setEnquiryEmail] = useState('');
  const [enquiryMessage, setEnquiryMessage] = useState('');
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!childName || !parentName || !adminNumber || !parentEmail) {
      alert('Please fill in all required fields to request the child report.');
      return;
    }
    setReportSubmitted(true);
    setTimeout(() => {
      // reset after some time
    }, 5000);
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
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-neutral-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Announcement Bar */}
      <div className="bg-orange-600 dark:bg-orange-950 text-white px-4 py-2 text-xs font-semibold flex flex-wrap items-center justify-between gap-2 shadow-inner">
        <div className="flex items-center gap-2 max-w-4xl mx-auto md:mx-0">
          <span className="font-bold tracking-wide">
            Term 1 2026:
          </span>
          <span>{content?.announcementText || 'PCEA St Andrews Kindergarten Portal (kindergarten.pceastandrews.org) — Admissions Open.'}</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] mx-auto md:mx-0">
          <span className="flex items-center gap-1">
            <Phone className="w-3 h-3" /> {content?.phone || '0786198873'}
          </span>
          <span className="hidden sm:inline">|</span>
          <span className="flex items-center gap-1">
            <Mail className="w-3 h-3" /> {content?.email || 'kindergarten@pceastandrews.org'}
          </span>
        </div>
      </div>

      {/* Main Navigation (Clean, advertising & info focused, no direct management buttons in header) */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-black/95 backdrop-blur-md border-b border-slate-200/80 dark:border-neutral-900 px-4 sm:px-8 py-3.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & School Name */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/20 font-black text-xl">
              PS
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
                PCEA St Andrews Kindergarten
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Nurturing Excellence in Early Childhood Education
              </p>
            </div>
          </div>

          {/* Navigation Links & Theme Toggle */}
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600 dark:text-slate-300">
              <a href="#about" className="hover:text-orange-600 transition-colors">About Us</a>
              <a href="#gallery" className="hover:text-orange-600 transition-colors">Gallery</a>
              <a href="#enquire" className="hover:text-orange-600 transition-colors">Office Enquiry</a>
              <a href="#report-form" className="hover:text-orange-600 transition-colors">Request Report</a>
            </nav>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-neutral-900 transition-all cursor-pointer"
              title="Toggle theme (Shift+D)"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        id="about"
        aria-labelledby="hero-heading"
        className="relative isolate overflow-hidden bg-[#fbfbfc] dark:bg-black"
      >
        {/* Modern background: soft radial light, fine grid, restrained glow */}
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(1100px_520px_at_15%_-10%,rgba(251,146,60,0.16),transparent_60%),radial-gradient(900px_420px_at_90%_10%,rgba(245,158,11,0.10),transparent_55%)] dark:bg-[radial-gradient(1100px_520px_at_15%_-10%,rgba(251,146,60,0.10),transparent_60%),radial-gradient(900px_420px_at_90%_10%,rgba(245,158,11,0.06),transparent_55%)]" />
          <div className="absolute inset-0 opacity-[0.55] [background-image:linear-gradient(to_right,rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.045)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_35%,black,transparent)] dark:opacity-[0.35] dark:[background-image:linear-gradient(to_right,rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.055)_1px,transparent_1px)]" />
          <div className="hero-glow absolute left-1/2 top-[-140px] h-[460px] w-[min(920px,120vw)] -translate-x-1/2 rounded-full bg-gradient-to-r from-orange-300/20 via-amber-200/14 to-orange-200/18 blur-3xl dark:from-orange-500/10 dark:via-amber-500/8 dark:to-orange-600/10" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-neutral-800" />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8 lg:pb-24 lg:pt-20">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-14 xl:gap-16">
            {/* Left: copy */}
            <div className="hero-fade-in max-w-2xl">
              <div className="inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-slate-200/80 bg-white/80 px-3 py-1.5 shadow-[0_1px_0_rgba(255,255,255,0.9),0_8px_24px_-18px_rgba(15,23,42,0.35)] backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/75 dark:shadow-none">
                <span className="inline-flex h-5 shrink-0 items-center rounded-full bg-orange-600 px-2 text-[10px] font-extrabold uppercase tracking-[0.08em] text-white">
                  2026
                </span>
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">Admissions open</span>
                <span className="hidden h-1 w-1 rounded-full bg-emerald-500 sm:inline-block" aria-hidden="true" />
                <span className="text-[11px] text-slate-500 dark:text-slate-400">PCEA St Andrews · Nairobi</span>
              </div>

              <h2
                id="hero-heading"
                className="mt-6 text-balance text-[2.35rem] font-black leading-[1.03] tracking-[-0.03em] text-slate-950 dark:text-white sm:text-[3.45rem] lg:text-[4.1rem]"
              >
                {content?.heroTitle ? (
                  content.heroTitle
                ) : (
                  <>
                    Where little minds{' '}
                    <span className="relative inline-block">
                      <span className="relative z-10 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 bg-clip-text text-transparent dark:from-orange-400 dark:via-orange-300 dark:to-amber-300">
                        grow bright.
                      </span>
                      <span className="absolute inset-x-0 bottom-[0.08em] -z-0 h-[0.3em] rounded-full bg-orange-200/60 dark:bg-orange-500/15" aria-hidden="true" />
                    </span>
                  </>
                )}
              </h2>

              <p className="mt-5 max-w-xl text-pretty text-[15px] leading-7 text-slate-600 dark:text-slate-300 sm:text-lg sm:leading-8">
                {content?.heroSubtitle ||
                  'Montessori-inspired learning, CBC foundations, and Christian values — in a safe, joyful environment at PCEA St Andrews, Church Road, Nairobi.'}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <a
                  href="#report-form"
                  className="group inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 text-sm font-bold text-white shadow-[0_1px_0_rgba(255,255,255,0.08)_inset,0_10px_30px_-12px_rgba(15,23,42,0.55)] transition duration-200 hover:-translate-y-0.5 hover:bg-slate-900 hover:shadow-[0_1px_0_rgba(255,255,255,0.08)_inset,0_16px_36px_-14px_rgba(15,23,42,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:bg-white dark:text-slate-950 dark:shadow-[0_10px_30px_-14px_rgba(255,255,255,0.18)] dark:hover:bg-slate-100 dark:focus-visible:ring-offset-black"
                >
                  <span>Request Child Report</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                </a>
                <a
                  href="#enquire"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200/90 bg-white/90 px-6 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur transition duration-200 hover:border-slate-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-slate-100 dark:hover:border-neutral-700 dark:hover:bg-neutral-900 dark:focus-visible:ring-offset-black"
                >
                  <HelpCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" aria-hidden="true" />
                  <span>Talk to the office</span>
                </a>
              </div>

              <ul className="mt-9 grid grid-cols-1 gap-3 border-t border-slate-200/80 pt-6 sm:grid-cols-3 sm:gap-4 dark:border-neutral-800" aria-label="School highlights">
                {[
                  { icon: Users, label: 'Caring educators', detail: 'Attentive early-years support' },
                  { icon: ShieldCheck, label: 'Safe campus', detail: 'Secure, child-friendly spaces' },
                  { icon: BookOpen, label: 'CBC-aligned', detail: 'Strong learning foundations' },
                ].map(({ icon: Icon, label, detail }) => (
                  <li key={label} className="flex items-start gap-3 rounded-2xl border border-transparent p-1 sm:p-0">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm ring-1 ring-slate-200/70 dark:bg-neutral-900 dark:text-slate-200 dark:ring-neutral-800">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13px] font-semibold leading-5 text-slate-800 dark:text-slate-100">{label}</span>
                      <span className="block text-[11px] leading-4 text-slate-500 dark:text-slate-400">{detail}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: visual composition */}
            <div className="hero-fade-in hero-fade-in-delay relative lg:pl-2">
              <div className="relative mx-auto max-w-[620px] lg:max-w-none">
                <div className="absolute -inset-x-6 -inset-y-8 -z-10 rounded-[3rem] bg-gradient-to-tr from-orange-200/35 via-transparent to-amber-100/25 blur-2xl dark:from-orange-900/15 dark:to-amber-900/10" aria-hidden="true" />

                <div className="group relative overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/70 p-2 shadow-[0_1px_0_rgba(255,255,255,0.85)_inset,0_24px_70px_-28px_rgba(15,23,42,0.38)] backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/70 dark:shadow-[0_24px_70px_-34px_rgba(0,0,0,0.85)]">
                  <div className="relative overflow-hidden rounded-[1.45rem] bg-slate-100 dark:bg-neutral-800">
                    <div className="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3]">
                      <img
                        src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1400&q=80"
                        alt="Children learning together in a bright, welcoming classroom"
                        className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
                        fetchPriority="high"
                        decoding="async"
                        sizes="(min-width: 1024px) 46vw, (min-width: 640px) 92vw, 100vw"
                      />
                    </div>
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/5 to-transparent" />
                    <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/5" />

                    <div className="absolute left-3 top-3 sm:left-4 sm:top-4">
                      <div className="inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-white/90 px-2.5 py-1 text-[10px] font-bold text-slate-900 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-neutral-950/80 dark:text-white">
                        <Sparkles className="h-3.5 w-3.5 text-orange-500" aria-hidden="true" />
                        Admissions Open 2026
                      </div>
                    </div>

                    <div className="absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4">
                      <div className="flex flex-wrap gap-1.5">
                        {['Montessori', 'CBC', 'Christian Values'].map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-white/15 bg-slate-950/25 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-2 pt-3 sm:gap-3 sm:p-3">
                    {[
                      { label: 'Playgroup', sub: 'Ages 2–3' },
                      { label: 'PP1 & PP2', sub: 'Ages 4–5' },
                      { label: 'Grade 1–3', sub: 'CBC Primary' },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-xl border border-slate-200/70 bg-slate-50/80 px-2 py-2.5 text-center transition-colors hover:bg-white dark:border-neutral-800 dark:bg-neutral-800/55 dark:hover:bg-neutral-800 sm:px-3"
                      >
                        <div className="text-[11px] font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-xs">{item.label}</div>
                        <div className="mt-0.5 text-[9px] text-slate-500 dark:text-slate-400 sm:text-[10px]">{item.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-3 flex items-stretch gap-3 sm:absolute sm:-bottom-5 sm:left-4 sm:mt-0 sm:max-w-[320px]">
                  <div className="flex w-full items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/95 p-3 shadow-[0_12px_34px_-18px_rgba(15,23,42,0.28)] backdrop-blur dark:border-neutral-700 dark:bg-neutral-950/92 dark:shadow-none sm:p-3.5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-sm">
                      <Heart className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[13px] font-extrabold leading-4 text-slate-900 dark:text-white">Parents trust us</div>
                      <div className="mt-0.5 text-[11px] leading-4 text-slate-500 dark:text-slate-400">Safe, nurturing, holistic care for every child.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Picture Gallery Section */}
      <section id="gallery" className="py-20 px-4 sm:px-8 bg-white dark:bg-black border-t border-b border-slate-200 dark:border-neutral-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 flex items-center justify-center gap-1.5">
              <ImageIcon className="w-4 h-4" /> Campus & Activities Gallery
            </span>
            <h3 className="text-2xl sm:text-3xl font-black mt-2 text-slate-900 dark:text-white">
              A Glimpse Into Life at PCEA St Andrews
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
              Explore our vibrant classrooms, outdoor play areas, creative arts studios, and learning moments.
            </p>
          </div>

          <div className="overflow-hidden" role="region" aria-label="Campus and activities gallery">
            <div className="gallery-marquee">
              <div className="gallery-marquee-track">
                {[0, 1].map((copy) => (
                  <div className="gallery-bento-group" key={`gallery-group-${copy}`} aria-hidden={copy > 0}>
                    {galleryImages.map((img, imageIndex) => (
                      <figure
                        key={`${copy}-${img.id}`}
                        className={`gallery-bento-tile ${galleryTilePositions[imageIndex % galleryTilePositions.length]}`}
                      >
                        <img src={img.url} alt={img.title} loading="lazy" />
                      </figure>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative w-full overflow-hidden border-y border-slate-200 dark:border-neutral-900">
        <div
          className="h-[220px] sm:h-[300px] lg:h-[420px] w-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=80')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-900/40 to-slate-950/75" />
        <div className="absolute inset-0 flex items-center justify-center px-4 text-center">
          <div className="max-w-3xl">
            <p className="text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.25em] text-orange-200">
              Learning in Motion
            </p>
            <h3 className="mt-3 text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Discover a school where every child grows with confidence.
            </h3>
          </div>
        </div>
      </section>

      {/* Office Enquiry Section */}
      <section id="enquire" className="py-20 px-4 sm:px-8 bg-slate-50 dark:bg-black">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
              Direct Contact
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Enquire With Our School Office
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Have questions regarding fee structures, admission vacancies, uniform lists, or school bus transport? Send a direct enquiry to the administration office and our admissions officer will respond promptly.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-900">
                <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-semibold">Call Office Line</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{content?.phone || '0786198873'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-900">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-semibold">Email Enquiries</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{content?.email || 'kindergarten@pceastandrews.org'}</span>
                  <span className="text-xs text-slate-500 block">Alt: {content?.altEmail || 'pceastandrewskindergarten@gmail.com'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-900">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-semibold">Official Website & Portal</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{content?.location || 'kindergarten.pceastandrews.org'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-white dark:bg-neutral-950 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-neutral-900 shadow-xl">
              <h4 className="text-base font-black text-slate-900 dark:text-white mb-2">Send Office Message</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Fill out this quick form for instant office follow-up.</p>

              {enquirySubmitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h5 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">Enquiry Received Successfully!</h5>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400">
                    Thank you, {enquiryName}. Our office will reach out to you via {enquiryEmail} within 24 business hours.
                  </p>
                  <button
                    onClick={() => {
                      setEnquirySubmitted(false);
                      setEnquiryName('');
                      setEnquiryEmail('');
                      setEnquiryMessage('');
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                  >
                    Send Another Enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={enquiryName}
                      onChange={(e) => setEnquiryName(e.target.value)}
                      placeholder="e.g. Mary Wanjiku"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Parent Email Address</label>
                    <input
                      type="email"
                      required
                      value={enquiryEmail}
                      onChange={(e) => setEnquiryEmail(e.target.value)}
                      placeholder="e.g. mary@gmail.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Enquiry Message / Question</label>
                    <textarea
                      rows={3}
                      required
                      value={enquiryMessage}
                      onChange={(e) => setEnquiryMessage(e.target.value)}
                      placeholder="Ask about admissions, fee structures, school transport..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-md shadow-orange-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Office Enquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Request Child Report Section */}
      <section id="report-form" className="py-20 px-4 sm:px-8 bg-white dark:bg-black border-t border-b border-slate-200 dark:border-neutral-900">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-orange-600 to-amber-600 rounded-3xl p-6 sm:p-12 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div className="max-w-xl mx-auto text-center mb-8">
              <p className="text-xs font-extrabold uppercase tracking-widest text-white/80 mb-2">
                Official Document Portal
              </p>
              <h3 className="text-2xl sm:text-3xl font-black">Request Child Progress Report</h3>
              <p className="text-xs text-white/90 mt-2">
                Parents can request official terminal progress reports and report cards directly by providing pupil details below.
              </p>
            </div>

            {reportSubmitted ? (
              <div className="bg-white dark:bg-neutral-950 text-slate-900 dark:text-white p-8 rounded-2xl text-center space-y-4 shadow-xl">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-lg font-black">Report Request Logged Successfully!</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-md mx-auto">
                  Child Report Request for <strong className="text-orange-600">{childName}</strong> (Admin No: <span className="font-mono">{adminNumber}</span>) has been submitted for verification. The official term report will be sent to <span className="underline">{parentEmail}</span>.
                </p>
                <button
                  onClick={() => {
                    setReportSubmitted(false);
                    setChildName('');
                    setParentName('');
                    setAdminNumber('');
                    setParentEmail('');
                  }}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-orange-600 text-white hover:bg-orange-700 cursor-pointer shadow-md"
                >
                  Request Another Report
                </button>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="bg-white dark:bg-neutral-950 text-slate-900 dark:text-slate-100 p-6 sm:p-8 rounded-2xl shadow-xl space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Name of Child *</label>
                    <input
                      type="text"
                      required
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      placeholder="e.g. Liam Kiprono"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Name of Parent *</label>
                    <input
                      type="text"
                      required
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      placeholder="e.g. David Kiprono"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Child Admission Number *</label>
                    <input
                      type="text"
                      required
                      value={adminNumber}
                      onChange={(e) => setAdminNumber(e.target.value)}
                      placeholder="e.g. ADM-2026-001"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 text-xs font-mono text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Parent Email Address *</label>
                    <input
                      type="email"
                      required
                      value={parentEmail}
                      onChange={(e) => setParentEmail(e.target.value)}
                      placeholder="e.g. david.kiprono@gmail.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl text-xs font-black text-white bg-orange-600 hover:bg-orange-700 shadow-md shadow-orange-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Submit Child Report Request</span>
                  </button>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center mt-2">
                    Reports are verified against school administrative records before dispatch.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer containing all system login / management system action buttons */}
      <footer className="bg-black text-slate-400 py-16 px-4 sm:px-8 mt-auto border-t border-neutral-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: School Bio */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-base">
                PS
              </div>
              <h5 className="text-white font-bold text-sm">PCEA St Andrews</h5>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nurturing young minds in early childhood education with Christian values, Montessori principles, and CBC academic excellence.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h6 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Quick Links</h6>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#about" className="hover:text-orange-400 transition-colors">About Kindergarten</a></li>
              <li><a href="#gallery" className="hover:text-orange-400 transition-colors">Campus & Gallery</a></li>
              <li><a href="#enquire" className="hover:text-orange-400 transition-colors">Office Enquiry</a></li>
              <li><a href="#report-form" className="hover:text-orange-400 transition-colors">Request Report Form</a></li>
            </ul>
          </div>

          {/* Col 3: Contact */}
          <div>
            <h6 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Office & Location</h6>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span>{content?.location || 'kindergarten.pceastandrews.org'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span>{content?.phone || '0786198873'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span>{content?.email || 'kindergarten@pceastandrews.org'}</span>
              </li>
              <li className="flex items-center gap-2 text-[11px] text-slate-400">
                <Mail className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span>Alt: {content?.altEmail || 'pceastandrewskindergarten@gmail.com'}</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Footer Actions (System Logins & Management Portal) */}
          <div className="space-y-3">
            <h6 className="text-white font-bold text-xs uppercase tracking-wider mb-2">Staff & Management Actions</h6>
            <p className="text-[11px] text-slate-400 mb-3">Authorized teachers and administrators portal access.</p>

            <button
              onClick={() => onEnterSystem('teacher')}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Open Teacher Portal & SMS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onEnterSystem('admin')}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Administrator Login</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-neutral-900 flex flex-wrap items-center justify-between gap-4 text-xs">
          <p>© 2026 PCEA St Andrews Kindergarten & School Management System. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Secure SSL Connection Active
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
