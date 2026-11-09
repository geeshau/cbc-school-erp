import React, { useState } from 'react';
import {
  Headphones,
  UserCheck,
  GraduationCap,
  ArrowRight,
  ArrowUpRight,
  Play,
  Star,
  Menu,
  X,
  Plus,
  PenTool,
  Code2,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';

const TEAL = '#0D3B36';

const NAV_LINKS = ['Home', 'About', 'Services', 'Pricing', 'Resources'];

const HERO_STATS = [
  { value: '20M+', label: 'Satisfied users all over the world' },
  { value: '120+', label: 'Countries' },
  { value: '80+', label: 'Designer & Developer' },
];

const REASONS = [
  {
    icon: Headphones,
    title: '24/7 Support',
    text: 'Real humans ready to help any time of day, so you never get stuck on a lesson or a setting.',
  },
  {
    icon: UserCheck,
    title: 'Top Guide',
    text: 'Learn from industry mentors who break complex topics into clear, practical steps.',
  },
  {
    icon: GraduationCap,
    title: 'Best Course',
    text: 'Carefully curated programs with projects, quizzes and certificates that employers trust.',
  },
];

const STEPS = [
  {
    title: 'Choose Best Course For You',
    text: 'Browse curated tracks and pick the one that matches your goals and schedule.',
  },
  {
    title: 'Active Learning Engagement',
    text: 'Join live sessions, complete hands-on projects and get feedback from mentors.',
  },
  {
    title: 'Joining Course Made Easy',
    text: 'Sign up in minutes, pay securely and start learning instantly on any device.',
  },
];

const METRICS = [
  { value: '160+', label: 'Expert instructors' },
  { value: '500+', label: 'Online courses' },
  { value: '24 Lakh', label: 'Active learners' },
  { value: '12K', label: 'Five-star reviews' },
];

const COURSES = [
  {
    icon: PenTool,
    title: 'UI/UX Design',
    text: 'Master user research, wireframing, prototyping and visual design in Figma.',
    lessons: '42 Lessons',
  },
  {
    icon: Code2,
    title: 'Web Development',
    text: 'Build fast, responsive websites with HTML, CSS, JavaScript and React.',
    lessons: '58 Lessons',
  },
  {
    icon: Smartphone,
    title: 'App Development',
    text: 'Ship cross-platform mobile apps for iOS and Android from idea to store.',
    lessons: '36 Lessons',
  },
];

const AppleLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z" />
  </svg>
);

const Stars: React.FC<{ size?: string }> = ({ size = 'h-4 w-4' }) => (
  <span className="flex items-center gap-0.5" aria-hidden="true">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`${size} fill-[#FFAE00] text-[#FFAE00]`} />
    ))}
  </span>
);

export const LearnHouseLanding: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="min-h-screen overflow-x-clip bg-[#F8F9FA] font-['Plus_Jakarta_Sans',sans-serif] text-slate-800 antialiased">
      {/* ───────────── Hero (with header) ───────────── */}
      <div className="relative overflow-hidden" style={{ backgroundColor: TEAL }}>
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -left-32 top-24 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute right-0 top-0 h-[520px] w-[520px] rounded-full bg-teal-300/10 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:26px_26px]" />
        </div>

        {/* Header */}
        <header className="relative z-20">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
            <a href="#" className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFAE00] text-[#0D3B36]">
                <GraduationCap className="h-5 w-5" aria-hidden="true" />
              </span>
              Learn<span className="text-[#FFAE00]">@</span>House
            </a>

            <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
              {NAV_LINKS.map((link, i) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className={`relative text-sm font-semibold transition-colors hover:text-white ${
                    i === 0 ? 'text-white' : 'text-white/70'
                  } after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:rounded-full after:bg-[#FFAE00] after:transition-all ${
                    i === 0 ? 'after:w-full' : 'after:w-0 hover:after:w-full'
                  }`}
                >
                  {link}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <a
                href="#contact"
                className="hidden rounded-full bg-[#F7941D] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition hover:-translate-y-0.5 hover:bg-[#FFAE00] sm:inline-flex"
              >
                Contact
              </a>
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-white hover:bg-white/10 md:hidden"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
              >
                {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {menuOpen && (
            <nav className="mx-5 mb-4 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-xl md:hidden" aria-label="Mobile">
              {NAV_LINKS.map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-semibold text-white/90 hover:bg-white/10"
                >
                  {link}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="mt-2 block rounded-xl bg-[#F7941D] px-4 py-3 text-center text-sm font-bold text-white"
              >
                Contact
              </a>
            </nav>
          )}
        </header>

        {/* Hero content */}
        <section id="home" className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-5 pb-36 pt-8 sm:px-8 lg:grid-cols-2 lg:pb-44 lg:pt-12">
          <div className="text-center lg:text-left">
            <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 backdrop-blur">
              <Stars />
              <span className="text-xs font-semibold text-white sm:text-sm">
                5.0 Star <span className="text-white/60">(1.2M+ Reviews)</span>
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.6rem]">
              Because Email Is <span className="text-[#FFAE00]">Complicated</span> Enough.{' '}
              <span className="inline-block origin-bottom-left animate-[wave_2.4s_ease-in-out_infinite]" role="img" aria-label="pointing hand">
                👉
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg lg:mx-0">
              Learn@House brings expert-led courses, live mentoring and a supportive community together in one simple
              platform — so you can focus on learning, not on managing inboxes and schedules.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-5 sm:flex-row lg:justify-start">
              <a
                href="#"
                className="group inline-flex items-center gap-3 rounded-2xl bg-black px-5 py-3 text-white shadow-xl shadow-black/30 ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:bg-neutral-900"
              >
                <AppleLogo className="h-7 w-7" />
                <span className="text-left leading-tight">
                  <span className="block text-[10px] font-medium uppercase tracking-wide text-white/70">Download on the</span>
                  <span className="block text-lg font-bold">App Store</span>
                </span>
              </a>

              <button type="button" className="group inline-flex items-center gap-3 text-white">
                <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#0D3B36] shadow-lg transition group-hover:scale-105">
                  <span className="absolute inset-0 animate-ping rounded-full bg-white/30" aria-hidden="true" />
                  <Play className="relative h-5 w-5 translate-x-0.5 fill-current" aria-hidden="true" />
                </span>
                <span className="text-sm font-bold underline-offset-4 group-hover:underline">Watch Demo</span>
              </button>
            </div>

            {/* Stats bar */}
            <dl className="mt-12 grid grid-cols-3 divide-x divide-white/15 rounded-2xl border border-white/10 bg-white/5 py-5 backdrop-blur">
              {HERO_STATS.map((s) => (
                <div key={s.value} className="px-3 text-center sm:px-5">
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="text-2xl font-extrabold text-white sm:text-3xl">{s.value}</dd>
                  <dd className="mt-1 text-[11px] leading-snug text-white/60 sm:text-xs">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Hero image */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
            <div className="absolute inset-x-6 bottom-0 top-10 rounded-[45%_55%_40%_60%/55%_45%_55%_45%] bg-gradient-to-br from-emerald-300/30 to-teal-500/20" aria-hidden="true" />
            <div className="absolute left-1/2 top-1/2 h-[90%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-white/15" aria-hidden="true" />
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80"
              alt="Smiling instructor with glasses and arms crossed"
              className="relative z-10 mx-auto aspect-[4/5] w-[85%] rounded-t-[999px] rounded-b-[2.5rem] object-cover shadow-2xl shadow-black/40 ring-4 ring-white/10"
            />

            {/* Floating decorations */}
            <Plus className="absolute left-2 top-8 z-20 h-8 w-8 text-[#FFAE00] [animation:lh-float_5s_ease-in-out_infinite]" strokeWidth={3} aria-hidden="true" />
            <Plus className="absolute bottom-24 right-0 z-20 h-6 w-6 text-[#FFAE00] [animation:lh-float_6s_ease-in-out_infinite_-2s]" strokeWidth={3} aria-hidden="true" />
            <span className="absolute right-6 top-4 z-20 h-5 w-5 rounded-full border-4 border-[#FFAE00]" aria-hidden="true" />
            <span className="absolute bottom-10 left-0 z-20 h-3 w-3 rounded-full bg-white/70" aria-hidden="true" />

            <div className="absolute -left-2 bottom-16 z-20 flex items-center gap-3 rounded-2xl bg-white p-3 pr-5 shadow-2xl [animation:lh-float_6s_ease-in-out_infinite] sm:-left-8">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0D3B36]/10 text-[#0D3B36]">
                <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-extrabold text-slate-900">250K+</p>
                <p className="text-[11px] text-slate-500">Courses completed</p>
              </div>
            </div>

            <div className="absolute -right-2 top-20 z-20 rounded-2xl bg-white p-3 shadow-2xl [animation:lh-float_7s_ease-in-out_infinite_-3s] sm:-right-6">
              <div className="flex -space-x-2">
                {['photo-1494790108377-be9c29b29330', 'photo-1506794778202-cad84cf45f1d', 'photo-1534528741775-53994a69daeb'].map((id) => (
                  <img
                    key={id}
                    src={`https://images.unsplash.com/${id}?auto=format&fit=crop&w=80&h=80&q=80`}
                    alt=""
                    className="h-8 w-8 rounded-full border-2 border-white object-cover"
                  />
                ))}
              </div>
              <p className="mt-1.5 text-[11px] font-bold text-slate-700">Join 20M+ learners</p>
            </div>
          </div>
        </section>

        {/* Wave divider */}
        <svg
          className="absolute bottom-0 left-0 z-10 h-20 w-full sm:h-28 lg:h-32"
          viewBox="0 0 1440 140"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0,80 C240,150 480,10 720,60 C960,110 1200,140 1440,50 L1440,140 L0,140 Z" fill="#F8F9FA" />
        </svg>
      </div>

      {/* ───────────── 3 Reasons ───────────── */}
      <section id="about" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#F7941D]">Why Learn@House</span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0D3B36] sm:text-4xl lg:text-5xl">
            3 Reasons To Choose Us
          </h2>
          <p className="mt-4 text-slate-500">Everything you need to learn faster and smarter, backed by people who care.</p>
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
              <a
                href="#"
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#0D3B36] transition-colors hover:text-[#F7941D]"
              >
                Read More
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* ───────────── How It Works ───────────── */}
      <section id="services" className="bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#F7941D]">How It Works</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0D3B36] sm:text-4xl lg:text-5xl">
              Follow These 3 Simple Steps to Join Our Class!
            </h2>
          </div>

          <div className="mt-16 grid items-center gap-12 lg:grid-cols-[1fr_auto_1fr] lg:gap-14">
            {/* Steps */}
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

            {/* Circular image */}
            <div className="relative mx-auto h-72 w-72 sm:h-80 sm:w-80 lg:h-96 lg:w-96">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#0D3B36] to-[#14574f]" aria-hidden="true" />
              <div className="absolute -inset-4 rounded-full border-2 border-dashed border-[#0D3B36]/25 [animation:spin_40s_linear_infinite]" aria-hidden="true" />
              <img
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80"
                alt="Instructor holding up three fingers to explain the three steps"
                className="absolute inset-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)] rounded-full object-cover ring-8 ring-white"
              />
              <span className="absolute -right-1 top-8 flex h-14 w-14 items-center justify-center rounded-full bg-[#FFAE00] text-2xl font-black text-[#0D3B36] shadow-xl ring-4 ring-white">
                3
              </span>
              <Plus className="absolute -left-4 bottom-10 h-8 w-8 text-[#FFAE00]" strokeWidth={3} aria-hidden="true" />
            </div>

            {/* Metrics */}
            <dl className="grid grid-cols-2 gap-4 lg:grid-cols-1">
              {METRICS.map((m) => (
                <div
                  key={m.value}
                  className="group flex flex-col rounded-2xl rounded-tr-[2rem] border border-slate-200 bg-[#F8F9FA] px-6 py-4 transition hover:border-[#0D3B36]/30 hover:bg-white hover:shadow-lg lg:flex-row lg:items-center lg:justify-between"
                >
                  <dd className="text-3xl font-extrabold text-[#0D3B36] transition-colors group-hover:text-[#F7941D]">{m.value}</dd>
                  <dt className="text-sm font-medium text-slate-500">{m.label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ───────────── Courses ───────────── */}
      <section id="pricing" className="px-4 py-20 sm:px-8 lg:py-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] rounded-tr-[6rem] px-6 py-16 sm:px-12 lg:px-16" style={{ backgroundColor: TEAL }}>
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#FFAE00]/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-emerald-300/10 blur-3xl" />
            <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:24px_24px]" />
          </div>

          <div className="relative flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
            <div>
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#FFAE00]">Explore Programs</span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Our Popular Courses For You
              </h2>
            </div>
            <a
              href="#resources"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#F7941D] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition hover:-translate-y-0.5 hover:bg-[#FFAE00]"
            >
              View All Courses <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <div className="relative mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {COURSES.map(({ icon: Icon, title, text, lessons }, i) => (
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
                    {lessons}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-extrabold text-white transition-colors group-hover:text-[#0D3B36]">{title}</h3>
                <p className="mt-3 flex-1 leading-relaxed text-white/65 transition-colors group-hover:text-slate-500">{text}</p>
                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5 transition-colors group-hover:border-slate-200">
                  <span className="flex items-center gap-2">
                    <Stars size="h-3.5 w-3.5" />
                    <span className="text-xs font-bold text-white/70 group-hover:text-slate-500">5.0</span>
                  </span>
                  <a
                    href="#"
                    aria-label={`Open ${title} course`}
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

      {/* ───────────── Footer ───────────── */}
      <footer id="contact" className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-slate-500 sm:flex-row sm:px-8">
          <span className="font-extrabold text-[#0D3B36]">
            Learn<span className="text-[#F7941D]">@</span>House
          </span>
          <span id="resources">© {new Date().getFullYear()} Learn@House. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
};

export default LearnHouseLanding;
