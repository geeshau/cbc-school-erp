# PCEA St Andrews Kindergarten — Design Document

> **Living document** — Updated with every design change.
> Last updated: **22 November 2026**

---

## Table of Contents

1. [Brand Identity](#1-brand-identity)
2. [Design Tokens & Colour Palette](#2-design-tokens--colour-palette)
3. [Typography](#3-typography)
4. [Signature Visual Motifs](#4-signature-visual-motifs)
5. [Icons](#5-icons)
6. [Landing Page — Public Website](#6-landing-page--public-website)
7. [Staff Portal — System UI](#7-staff-portal--system-ui)
8. [CMS — Website Content Manager](#8-cms--website-content-manager)
9. [Data Models](#9-data-models)
10. [Animations & Motion](#10-animations--motion)
11. [Responsive Breakpoints](#11-responsive-breakpoints)
12. [Accessibility](#12-accessibility)
13. [Technology Stack](#13-technology-stack)
14. [Component Inventory](#14-component-inventory)
15. [Changelog](#15-changelog)

---

## 1. Brand Identity

| Attribute         | Value                                                                 |
| ----------------- | --------------------------------------------------------------------- |
| **School Name**   | PCEA St Andrews Kindergarten & School                                 |
| **Tagline**       | "Where little minds grow bright."                                     |
| **Logo Badge**    | "PS" monogram in a rounded-3xl yellow-orange badge on navy background |
| **Curriculum**    | CBC (Competency-Based Curriculum) + Montessori-inspired               |
| **Values**        | Christian ethos, holistic care, play-based learning                   |
| **Location**      | Church Road, St Andrews Compound, Nairobi, Kenya                      |
| **Levels**        | Playgroup (Ages 2–3) → PP1 & PP2 (Ages 4–5) → Grade 1–3 (CBC Primary)|
| **Domain**        | kindergarten.pceastandrews.org                                        |

---

## 2. Design Tokens & Colour Palette

Defined in `src/index.css` via Tailwind `@theme` block:

### Primary — Brand Navy

| Token              | Hex       | Usage                                                      |
| ------------------ | --------- | ---------------------------------------------------------- |
| `brand-50`         | `#eef2f8` | Lightest tint — hover backgrounds                          |
| `brand-100`        | `#d5e1ee` | Soft borders, dividers                                     |
| `brand-200`        | `#a9c3dc` | Secondary borders                                          |
| `brand-300`        | `#729ec6` | Inactive states                                            |
| `brand-400`        | `#3f74a8` | Secondary buttons                                          |
| `brand-500`        | `#174a7e` | Icon accents in portal                                     |
| `brand-600`        | `#113c66` | Sidebar items                                              |
| `brand-700`        | `#0f3152` | Deeper backgrounds                                         |
| **`brand-800`**    | **`#0D2840`** | ⭐ **Primary brand colour** — hero, navs, footer, headings |
| `brand-900`        | `#0a1f33` | Portal sidebar, dark-mode card backgrounds                 |
| `brand-950`        | `#061320` | Darkest — dark-mode body, deep overlays                    |

### Accent — Yellow-Orange

| Token              | Hex       | Usage                                                      |
| ------------------ | --------- | ---------------------------------------------------------- |
| `accent-300`       | `#ffc94d` | Star fills, soft highlights                                |
| **`accent-400`**   | **`#FFAE00`** | ⭐ **Secondary accent** — badges, stars, hover states, logo |
| **`accent-500`**   | **`#F7941D`** | ⭐ **CTA orange** — buttons, links, active states           |
| `accent-600`       | `#e07d0a` | Pressed/dark CTA states                                    |

### Semantic Colours

| Colour            | Hex / Class      | Usage                                       |
| ----------------- | ---------------- | ------------------------------------------- |
| Canvas / Page BG  | `#F8F9FA`        | Light section backgrounds                   |
| Dark-mode body    | `#040b14`        | `html.dark body` background                 |
| Footer BG         | `#071D33`        | Footer & announcement bar                   |
| White text        | `white/70–85`    | Body text on dark backgrounds               |
| Slate-500         | (Tailwind)       | Body text on light backgrounds              |
| Emerald-600       | (Tailwind)       | Success states, confirmations                |
| Red-400           | (Tailwind)       | Delete buttons, error states                 |
| Amber-400/500     | (Tailwind)       | Pin badges, star ratings                     |

---

## 3. Typography

| Property           | Value                                                      |
| ------------------ | ---------------------------------------------------------- |
| **Font Family**    | `'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif`|
| **Headings**       | `font-extrabold` / `font-black` (800–900 weight)           |
| **Body**           | `font-normal` (400) with `leading-relaxed`                 |
| **Navigation**     | `font-semibold` (600), `text-sm` (14px)                    |
| **Labels**         | `font-bold` (700), `text-xs` (12px), `uppercase`, `tracking-[0.2em]` |
| **Micro-text**     | `text-[10px]` or `text-[11px]` for dates, badges, metadata |
| **Rendering**      | `-webkit-font-smoothing: antialiased`, `text-rendering: optimizeLegibility` |

### Heading Scale (Landing Page)

| Element        | Mobile          | Desktop                  |
| -------------- | --------------- | ------------------------ |
| Hero `<h1>`    | `text-4xl`      | `lg:text-[3.4rem]`       |
| Section `<h2>` | `text-3xl`      | `lg:text-5xl`            |
| Card `<h3>`    | `text-xl`       | `text-xl` (unchanged)    |
| Card `<h4>`    | `text-sm`       | `text-sm` (unchanged)    |

---

## 4. Signature Visual Motifs

### Asymmetric Corner Cut
Every card, section wrapper, and modal uses a distinctive large top-right border radius:
- Cards: `rounded-3xl rounded-tr-[4rem]` to `rounded-tr-[4.5rem]`
- Section containers: `rounded-[2.5rem] rounded-tr-[6rem]`
- Modals: `rounded-3xl rounded-tr-[4rem]`
- Portal cards: `rounded-2xl rounded-tr-[2rem]`
- Accent corner border: `border-r-4 border-t-4 border-[#0D2840]` or `border-[#FFAE00]` on the top-right

### Dot-Grid Background
Repeating radial-gradient dot pattern on every dark-background section:
```css
opacity-[0.06] to opacity-[0.07]
[background-image:radial-gradient(white_1px,transparent_1px)]
[background-size:24px_24px] to [background-size:26px_26px]
```

### Atmospheric Blur Glows
Large blurred circles (280–520px) positioned absolutely in dark sections:
- Blue: `bg-blue-400/10 blur-3xl` or `bg-sky-300/10 blur-3xl`
- Amber: `bg-[#FFAE00]/10–15 blur-3xl`

### Deep Shadows
Navy-tinted soft shadows instead of generic grey:
```
shadow-[0_10px_40px_-24px_rgba(13,40,64,0.35)]   — standard cards
shadow-[0_10px_40px_-20px_rgba(13,40,64,0.25)]    — lighter cards
shadow-[0_30px_80px_-40px_rgba(13,40,64,0.45)]    — featured elements
shadow-[0_20px_60px_-20px_rgba(13,40,64,0.25)]    — hover state cards
shadow-[0_8px_30px_-18px_rgba(13,40,64,0.18)]     — announcement cards
```

### Floating Decorative Elements
- Yellow-orange `+` (Plus) icons with bob/float animation
- Dashed-border circles (`border-2 border-dashed border-white/15`)
- Small filled circles (`bg-white/70`)
- Floating white info cards with shadow and bob animation

---

## 5. Icons

| Library   | Package         | Usage                                            |
| --------- | --------------- | ------------------------------------------------ |
| Lucide    | `lucide-react`  | All icons throughout landing page and portal      |

Key icons used:
- **Navigation:** Menu, X, Lock, ChevronUp, ChevronLeft, ChevronRight
- **Hero:** Star, ArrowRight, FileText, Heart, Sparkles, Plus
- **Features:** Users, ShieldCheck, BookOpen
- **Programmes:** Baby, Blocks, GraduationCap
- **Gallery:** Image (aliased as ImageIcon)
- **Downloads:** Download, FileDown, Eye
- **Contact:** Phone, Mail, MapPin, Send
- **Feedback:** MessageCircle, Quote, Star
- **Announcements:** Megaphone, Pin, Calendar
- **Portal:** LayoutDashboard, CreditCard, Award, CalendarDays, FileSpreadsheet, Globe, CalendarHeart
- **Actions:** Plus, Trash2, Edit3, Save, CheckCircle2, ArrowUp, ArrowDown, Eye, EyeOff
- **CMS:** GripVertical, Upload, File, Link (aliased as LinkIcon)

---

## 6. Landing Page — Public Website

### 6.1 Splash Screen
| Property          | Value                                                        |
| ----------------- | ------------------------------------------------------------ |
| Background        | `bg-gradient-to-br from-[#0D2840] via-[#102E4A] to-[#071D33]` |
| Z-index           | `z-[9999]`, fixed overlay                                    |
| Duration          | 2.4s display → 700ms fade-out → unmount at 3.2s             |
| Elements          | Two decorative ring circles (white 4–7% opacity), "PS" badge with bounce-scale animation, "Welcome to" subtitle, "PCEA St Andrews" title, "Kindergarten" accent text, three pulsing dots |
| Animations        | `splash-badge` (bounce-scale), `splash-line` (staggered fade-up at 0.25s intervals), `splash-dot` (infinite pulse) |

### 6.2 Announcement Bar
| Property          | Value                                                        |
| ----------------- | ------------------------------------------------------------ |
| Background        | `#071D33`                                                    |
| Height            | `py-2`, single-line                                          |
| Content           | Yellow-orange "Term 1 2026:" label + CMS-editable text + phone + email links |
| Text              | `text-xs text-white/85`                                      |

### 6.3 Navigation — Two Variants

**Main Hero Header** (inside hero, desktop):
- Logo: "PS" badge (`rounded-2xl bg-[#FFAE00]`) + school name + "Kindergarten & School" subtitle
- Nav links: `text-sm font-semibold text-white/70` with `::after` underline in `bg-[#FFAE00]` on hover
- Buttons: Ghost "Staff" button + filled orange "Contact" button
- Mobile: hamburger → frosted-glass dropdown (`bg-white/5 backdrop-blur-xl`)

**Sticky Header** (appears on scroll > 120px):
- Same structure, `position: fixed`, `backdrop-blur-xl bg-[#0D2840]/95`
- Slide-down animation: `translate-y` + opacity transition with `duration-300`

**Nav Links:**
| Label       | Target       | Type   |
| ----------- | ------------ | ------ |
| Home        | `#home`      | anchor |
| About       | `#about`     | anchor |
| Programmes  | `#programmes`| anchor |
| Gallery     | `#gallery`   | anchor |
| Downloads   | `#downloads` | anchor |
| Reports     | `#reports`   | modal  |

### 6.4 Hero Section
| Property          | Value                                                        |
| ----------------- | ------------------------------------------------------------ |
| Background        | Navy `#0D2840` with dot-grid + blue/sky blur glows           |
| Layout            | 2-column grid on `lg:` (text left, image right)              |
| Badge             | 5 gold stars + "Loved by parents · Admissions Open"          |
| Title             | Extrabold white with one yellow-orange phrase + animated 👉 emoji |
| Subtitle          | `text-white/70`, max-w-xl                                    |
| Primary CTA       | Orange filled `rounded-2xl`, "Enquire About Admissions" + ArrowRight |
| Secondary CTA     | Animated pinging circle icon + "Request Child Report"        |
| Stats bar         | 3-column frosted-glass panel (PG–G3, CBC, Nairobi)          |
| Hero image        | Pill-shaped mask (`rounded-t-[999px] rounded-b-[2.5rem]`), `ring-4 ring-white/10`, deep shadow |
| Floating cards    | "Parents trust us" card + "Admissions Open / Term 1" card, bob animation |
| Bottom divider    | SVG wave curve transitioning to `#F8F9FA`                    |

### 6.5 Announcements Section
| Property          | Value                                                        |
| ----------------- | ------------------------------------------------------------ |
| Background        | Light canvas `#F8F9FA`                                       |
| Section ID        | `#announcements`                                             |
| Label             | "ANNOUNCEMENTS" (orange uppercase)                           |
| Title             | "Latest School Updates"                                      |
| Cards             | 1/2/3-column responsive grid, `rounded-2xl`, white bg, navy shadow |
| Card features     | Calendar icon + date, bold title (hover → orange), body text, gradient accent bar |
| Pinned badge      | Absolute positioned `bg-[#FFAE00]` pill with Pin icon, `top: -10px` |
| Sort order        | Pinned first, then newest-first by date                      |
| Visibility        | Only `visible: true` announcements shown                     |

### 6.6 Parent Feedback Carousel
| Property          | Value                                                        |
| ----------------- | ------------------------------------------------------------ |
| Background        | Light canvas `#F8F9FA`                                       |
| Section ID        | `#feedback`                                                  |
| Layout            | Horizontal slideshow, page-by-page (1/2/3 cards per view)   |
| Cards             | Asymmetric corner cut (`rounded-3xl rounded-tr-[3rem]`), Quote icon, text in quotes, avatar initial, role, date, 1–5 star rating |
| Navigation        | Prev/Next circle buttons + dot-indicator pagination          |
| Auto-advance      | Every 5 seconds, pauses on hover                            |
| Feedback form     | Collapsible "Share Your Experience" form with `grid-template-rows` animation |

### 6.7 "3 Reasons" Section
| Property          | Value                                                        |
| ----------------- | ------------------------------------------------------------ |
| Section ID        | `#about`                                                     |
| Cards             | 3 feature cards: Caring Educators, Safe Campus, CBC-Aligned Learning |
| Card style        | Asymmetric corner + navy accent border, navy icon badge → yellow-orange on hover, deep shadow + lift |

### 6.8 Admissions Steps Section
| Property          | Value                                                        |
| ----------------- | ------------------------------------------------------------ |
| Background        | White                                                        |
| Layout            | 3-column: interactive step list | circular image | values grid |
| Steps             | Send Enquiry → Visit School → Complete Enrolment             |
| Active step       | Navy background + yellow-orange number badge, image crossfade |
| Values grid       | Montessori, CBC, Christian, Holistic — hover lift + glow     |

### 6.9 Programmes Section
| Property          | Value                                                        |
| ----------------- | ------------------------------------------------------------ |
| Section ID        | `#programmes`                                                |
| Container         | Full-width navy `rounded-[2.5rem] rounded-tr-[6rem]` with dot-grid + blurs |
| Cards             | Glass-morphism (`bg-white/[0.06] backdrop-blur border-white/10`) → inverts to white on hover |
| Programmes        | Playgroup (Ages 2–3), PP1 & PP2 (Ages 4–5), Grade 1–3 (CBC Primary) |
| Each card         | Yellow-orange icon badge, age tag, description, circular ArrowUpRight link (rotates 45° on hover) |

### 6.10 Gallery Section
| Property          | Value                                                        |
| ----------------- | ------------------------------------------------------------ |
| Section ID        | `#gallery`                                                   |
| Layout            | Masonry grid (`auto-rows-[200px]`), first image spans 2×2    |
| Cards             | `rounded-3xl rounded-tr-[3rem]`, hover zoom `scale-105`     |
| Caption overlay   | Gradient from navy/90 to transparent, yellow-orange category pill |

### 6.11 Downloads & Resources Section
| Property          | Value                                                        |
| ----------------- | ------------------------------------------------------------ |
| Section ID        | `#downloads`                                                 |
| Background        | Navy `#0D2840` with dot-grid + blurs                         |
| Filter            | Category pills (yellow-orange active, ghost white inactive)  |
| Cards             | Glass-morphism, FileDown icon badge, category tag, title, metadata, Preview + Download buttons |
| Preview modal     | Full modal with navy header, iframe for PDFs, image display, or fallback message, download footer |

### 6.12 Office Enquiry Section
| Property          | Value                                                        |
| ----------------- | ------------------------------------------------------------ |
| Section ID        | `#enquire`                                                   |
| Layout            | 2-column: contact details left, form right                   |
| Contact cards     | Phone, Mail, MapPin with navy icon badges → yellow-orange on hover |
| Form              | White card with asymmetric corner (yellow-orange border accent), name/email/message fields, orange submit button |
| Success state     | Green confirmation with CheckCircle                          |

### 6.13 Report Request CTA Banner
Navy rounded container with dot-grid, FileText icon, title, and orange CTA button → opens modal.

### 6.14 Report Request Modal
Navy header with form fields (child name, parent name, admission number, email), orange submit, green success state with submitted details echo.

### 6.15 Footer
| Property          | Value                                                        |
| ----------------- | ------------------------------------------------------------ |
| Background        | `#071D33` with gradient gold line at top                     |
| Layout            | 4-column: brand info, quick links, office contacts, staff portal |
| Links             | Hover → `text-[#FFAE00]`                                    |
| Staff buttons     | Orange "Open Teacher Portal" + ghost "Administrator Login"   |
| Copyright         | Bottom bar with year auto-increment                          |

### 6.16 Scroll-to-Top Button
Fixed `bottom-6 right-6`, navy `rounded-full`, ChevronUp icon, appears after 400px scroll with opacity/translate-y transition. Hover scale + active press effects.

---

## 7. Staff Portal — System UI

### 7.1 Login Page
| Property          | Value                                                        |
| ----------------- | ------------------------------------------------------------ |
| Layout            | Split-screen: left branding panel (navy, desktop only) + right form panel |
| Left panel        | GraduationCap icon, school name in extrabold, description text, "Back to Website" button |
| Form              | Tabbed role selector (Admin / Teacher), email + password fields, "Remember Me" checkbox (default checked), orange login button |
| Dark mode         | Full `dark:` variant support on all form elements            |

### 7.2 Portal Layout
| Component         | Description                                                  |
| ----------------- | ------------------------------------------------------------ |
| **Navbar**        | Sticky top bar, `bg-brand-800` (dark: `bg-brand-950`), "PS" badge + school name, breadcrumb-style page title, user avatar + name pill |
| **Sidebar**       | Bottom-docked on mobile (`rounded-full` pill), left sidebar on desktop, navy bg with white/70 nav items, active item highlighted, collapsible, theme switcher |
| **Content area**  | `bg-canvas` (light) / `bg-[#040b14]` (dark), padded, scrollable |

### 7.3 Portal Tabs / Modules

| Tab               | Component                | Key Features                                    |
| ----------------- | ------------------------ | ----------------------------------------------- |
| Dashboard         | `DashboardOverview`      | Stat cards (students, fees, grades, events), charts, quick actions |
| Enrolment         | `EnrolmentManager`       | Student CRUD table, add/edit/delete modals, search/filter |
| Fees              | `FeeManager`             | Payment records, fee structures, receipts, statements modal |
| Grading           | `GradingTracker`         | Grade records, entry forms, stats cards, subject/term filters |
| Timetable         | `TimetableManager`       | Weekly timetable grid, slot management          |
| Reports           | `ReportCardsManager`     | Student report cards, CBC strands, PDF generation |
| Calendar          | `SchoolCalendarManager`  | School events, term dates, holiday management   |
| Website CMS       | `WebsiteContentManager`  | All landing page content editing (see §8)       |

### 7.4 Portal Card Style
All portal cards use:
- `bg-white dark:bg-brand-950` background
- `border border-slate-200/80 dark:border-brand-900`
- `rounded-2xl rounded-tr-[2rem]` (signature asymmetric corner)
- `shadow-[0_10px_40px_-24px_rgba(13,40,64,0.35)]` navy-tinted shadow
- Group hover effects on stat cards

### 7.5 Portal Dark Mode
- Class-based: `html.dark` toggle
- Three modes: Light / Dark / System (via `ThemeSwitcher` component)
- All 11 system components have full `dark:` variant coverage:
  LoginPage, DashboardOverview, EnrolmentManager, FeeManager, GradingTracker, QuickActionsFloatingMenu, StudentFeeStatementModal, ReportCardsManager, TimetableManager, WebsiteContentManager, SchoolCalendarManager

---

## 8. CMS — Website Content Manager

### 8.1 CMS Sections

| Section             | SectionName       | Fields                                                   |
| ------------------- | ----------------- | -------------------------------------------------------- |
| Contact & Banner    | `contact`         | Announcement bar text, phone, email, alt email, location |
| Hero & Overview     | `hero`            | Admission label, hero title, subtitle, primary CTA label, secondary CTA label |
| Announcements       | `announcements`   | CRUD list: title, body, date, pinned toggle, visibility  |
| Gallery             | `gallery`         | CRUD list: image title, URL, category                    |
| Downloads           | `downloads`       | CRUD list: title, description, category, file upload/URL, visibility |
| Feedback            | `feedback`        | CRUD list: comment text, role, 1–5 star rating, visibility, reorder |

### 8.2 CMS Features
- **Per-section "Save & Publish"** buttons with loading state and success confirmation
- **Global sticky save bar** at the bottom with backdrop-blur
- **Inline editing** for feedback and announcements (edit mode within each card)
- **Visibility toggle** (Eye/EyeOff) for announcements, feedback, and downloads
- **Pin toggle** for announcements
- **Reorder** (ArrowUp/ArrowDown) for feedback
- **File upload** for download resources (supports drag-and-drop, data-URL encoding)
- **Full dark mode** support across all CMS panels

### 8.3 CMS Persistence
- Backend: `GET /api/cms`, `POST /api/cms`, `PATCH /api/cms` endpoints
- In-memory store (`cmsContentStore`) on the Express server
- Frontend: `api.getCmsContent()`, `api.saveCmsContent()`, `api.patchCmsContent()`
- CMS data loaded in `refreshData()` and synced to `websiteContent` state in `App.tsx`

---

## 9. Data Models

### WebsiteContent
```typescript
interface WebsiteContent {
  announcementText: string;
  announcements?: Announcement[];
  phone: string;
  email: string;
  altEmail: string;
  heroTitle: string;
  heroSubtitle: string;
  location: string;
  admissionLabel?: string;
  heroPrimaryCtaLabel?: string;
  heroSecondaryCtaLabel?: string;
  galleryImages: { id: string; title: string; url: string; category: string }[];
  feedbackComments?: FeedbackComment[];
  downloadResources?: DownloadResource[];
}
```

### Announcement
```typescript
interface Announcement {
  id: string;
  title: string;
  body: string;
  date: string;      // YYYY-MM-DD
  pinned: boolean;
  visible: boolean;
}
```

### FeedbackComment
```typescript
interface FeedbackComment {
  id: string;
  text: string;
  role: string;
  date: string;
  rating: number;     // 1–5 star rating
  visible: boolean;
}
```

### DownloadResource
```typescript
interface DownloadResource {
  id: string;
  title: string;
  description?: string;
  category: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  url: string;
  uploadedAt: string;
  visible: boolean;
}
```

### Core System Models
- `User` — id, name, email, role (admin/teacher), title, assignedClasses, assignedSubjects, phone
- `Student` — admissionNumber, personal details, guardian info, feeBalance, performanceIndex
- `FeePayment` — studentId, amount, paymentDate, paymentMethod, receiptNumber
- `GradeRecord` — studentId, subject, term, score, letterGrade, remarks
- `TimetableSlot` — day, period, subject, teacher, room
- `SchoolEvent` — title, date, type, description

---

## 10. Animations & Motion

### CSS Keyframes (defined in `src/index.css`)

| Keyframe              | Duration / Easing        | Usage                                 |
| --------------------- | ------------------------ | ------------------------------------- |
| `splash-badge`        | 0.6s ease-out            | Logo badge bounce-scale entrance      |
| `splash-line`         | 0.7s ease-out (staggered)| Splash text fade-up                   |
| `splash-dot`          | 1.4s ease-in-out infinite| Loading dots pulse                    |
| `hero-glow-pulse`     | alternating              | Background glow pulse                 |
| `hero-fade-in`        | 700ms cubic-bezier       | Hero content entrance                 |
| `hero-float` / `lh-float` | 5–7s ease-in-out infinite | Floating decorative elements      |
| `wave`                | 2.4s ease-in-out infinite| 👉 emoji wave                         |
| `fadeSlideUp`         | 0.3s ease-out            | Modal entrances                       |
| `toastSlideDown/Up`   | 0.3s                     | Toast notification entrance/exit      |
| `feedbackScrollLeft`  | linear infinite          | (Legacy) feedback scroll animation    |
| `gallery-scroll-right`| 42s linear infinite      | Gallery marquee track                 |

### JavaScript Smooth Scroll
Custom `smoothScrollTo()` function using `requestAnimationFrame`:
- **Easing:** `easeOutCubic` — `1 - (1 - t)^3`
- **Duration:** 900ms (default), 800ms for scroll-to-top
- **Header offset:** 72px (sticky nav height)
- **Replaces:** native CSS `scroll-behavior: smooth` (removed from `index.css`)
- **Handler:** `handleNavClick(e, href)` on all anchor links calls `preventDefault()` + `smoothScrollTo()`

### Interaction Transitions

| Element           | Effect                           | Duration |
| ----------------- | -------------------------------- | -------- |
| Cards hover       | `hover:-translate-y-1` to `-y-2` | 300ms    |
| Gallery images    | `hover:scale-105`                | 500ms    |
| Nav underline     | `::after` width 0 → 100%        | default  |
| Carousel slide    | `transform: translateX`          | 600ms ease-in-out |
| Feedback form     | `grid-template-rows: 0fr → 1fr` | 300ms ease-in-out |
| Sticky nav        | `translate-y` + opacity          | 300ms    |
| Splash fade-out   | opacity 1 → 0                   | 700ms    |
| Programme cards   | bg/text colour inversion on hover| 300ms    |

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  /* All float, wave, fade, and scroll animations disabled */
}
```

---

## 11. Responsive Breakpoints

| Breakpoint | Tailwind | Pixel   | Key Changes                                        |
| ---------- | -------- | ------- | -------------------------------------------------- |
| Default    | —        | < 640px | Single column, mobile nav, bottom-docked sidebar   |
| `sm`       | `sm:`    | ≥ 640px | 2-column grids, Contact button visible             |
| `md`       | `md:`    | ≥ 768px | Email visible in announcement bar, 2-col forms     |
| `lg`       | `lg:`    | ≥ 1024px| Desktop nav, 2/3-column hero, full sidebar, 3-col grids |
| `xl`       | `xl:`    | ≥ 1280px| Wider modal max-widths                             |

---

## 12. Accessibility

| Feature                  | Implementation                                           |
| ------------------------ | -------------------------------------------------------- |
| Semantic HTML            | `<section>`, `<article>`, `<nav>`, `<header>`, `<footer>`, `<main>` |
| ARIA labels              | All interactive elements, modals (`role="dialog" aria-modal`), carousels (`aria-roledescription="carousel"`) |
| Keyboard navigation      | All buttons/links focusable, Escape closes modals, Enter/Space on resource cards |
| Alt text                 | All images have descriptive `alt` attributes             |
| Colour contrast          | White text on navy (#0D2840) ≥ 11:1 ratio               |
| `aria-expanded`          | Mobile menu, collapsible feedback form                   |
| `aria-current="step"`    | Active admission step                                    |
| `fetchPriority="high"`   | Hero image for LCP optimisation                          |
| `prefers-reduced-motion` | All decorative animations disabled                       |

---

## 13. Technology Stack

| Layer          | Technology                                                   |
| -------------- | ------------------------------------------------------------ |
| **Frontend**   | React 18 + TypeScript                                        |
| **Build**      | Vite 6.4.5                                                   |
| **Styling**    | Tailwind CSS v4 (`@theme` tokens, `@custom-variant dark`)   |
| **Icons**      | Lucide React                                                 |
| **Backend**    | Express.js (in `server.ts`)                                  |
| **Data store** | In-memory JavaScript objects (MongoDB ready, falls back gracefully) |
| **Auth**       | `crypto.scryptSync` password hashing (salt:hash format)      |
| **Session**    | Dual storage: `sessionStorage` (refresh) + `localStorage` (Remember Me) |
| **Dev server** | `node node_modules/vite/bin/vite.js dev --port 5173`         |
| **Build cmd**  | `node node_modules/vite/bin/vite.js build`                   |
| **Type check** | `node node_modules/typescript/bin/tsc --noEmit`              |

---

## 14. Component Inventory

### Landing Page (`src/components/LandingPage.tsx`)
Single file containing all public website sections:
Splash Screen → Announcement Bar → Sticky Nav → Hero Header → Hero Section → Announcements → Feedback Carousel → 3 Reasons → Admissions Steps → Programmes → Gallery → Downloads → Office Enquiry → Report CTA → Resource Preview Modal → Report Request Modal → Footer → Scroll-to-top

### Portal Components
| File                          | Purpose                              |
| ----------------------------- | ------------------------------------ |
| `LoginPage.tsx`               | Staff authentication                 |
| `Navbar.tsx`                  | Portal top navigation bar            |
| `Sidebar.tsx`                 | Tab navigation + theme switcher      |
| `DashboardOverview.tsx`       | Admin/teacher dashboard              |
| `EnrolmentManager.tsx`        | Student CRUD management              |
| `FeeManager.tsx`              | Fee payments & structures            |
| `GradingTracker.tsx`          | CBC grade recording                  |
| `TimetableManager.tsx`        | Weekly timetable management          |
| `ReportCardsManager.tsx`      | Student report card generation       |
| `SchoolCalendarManager.tsx`   | School events & calendar             |
| `WebsiteContentManager.tsx`   | CMS for landing page content         |
| `StudentFeeStatementModal.tsx`| Individual fee statement display      |
| `QuickActionsFloatingMenu.tsx`| Floating action buttons              |
| `ThemeSwitcher.tsx`           | Light/Dark/System toggle             |
| `DateRangeFilter.tsx`         | Reusable date range picker           |
| `TimetableCalendarView.tsx`   | Calendar-style timetable view        |
| `SystemSpecificationViewer.tsx`| In-app spec document viewer          |

### Support Files
| File                 | Purpose                           |
| -------------------- | --------------------------------- |
| `src/App.tsx`        | Root component, routing, state    |
| `src/types.ts`       | TypeScript interfaces             |
| `src/lib/api.ts`     | API client functions              |
| `src/lib/theme.ts`   | Theme management utilities        |
| `src/data/mockData.ts`| Seed/demo data                   |
| `src/index.css`      | Tailwind config, tokens, keyframes|
| `server.ts`          | Express backend + API endpoints   |

---

## 15. Changelog

| Date           | Change                                                                |
| -------------- | --------------------------------------------------------------------- |
| 22 Nov 2026    | 📄 Initial design document created                                    |
| 22 Nov 2026    | ✨ Splash screen added (PS badge, staggered text, dots, 2.4s → fade) |
| 22 Nov 2026    | 📢 Announcements section added below hero (cards with pin/date/body) |
| 22 Nov 2026    | 🛠 Announcements CMS section added (CRUD, pin, visibility, inline edit)|
| 22 Nov 2026    | 🎯 Custom smooth scroll (easeOutCubic, 900ms) on all anchor links    |
| 22 Nov 2026    | 🌙 Dark mode fixes applied across all 11 system components           |
| 22 Nov 2026    | ⭐ Star ratings (1–5) replaced likes system in feedback               |
| 22 Nov 2026    | 💾 CMS persistence via GET/POST/PATCH /api/cms endpoints             |
| 22 Nov 2026    | 🔐 Remember Me + session persistence (sessionStorage + localStorage) |
| 22 Nov 2026    | 📌 Sticky floating global save bar in CMS                            |
| 22 Nov 2026    | 📥 Per-section "Save & Publish" buttons in CMS (6 sections)          |

---

> **Maintenance rule:** When any visual, structural, or interactive change is made to the landing page, portal, or CMS, append a new row to the [Changelog](#15-changelog) and update the relevant section above. Keep the "Last updated" date at the top current.
