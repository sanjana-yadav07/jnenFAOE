import Link from "next/link";
import {
  ArrowRight,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Lock,
  Smile,
  Globe2,
  Users,
  LineChart,
  CheckCircle2,
  PhoneCall,
  KeyRound,
  MessageCircle,
  FileCheck2,
  Sparkle,
  ShieldAlert,
  ArrowUpRight,
  Heart,
  Scale,
  Building2,
} from "lucide-react";

const PORTALS = [
  {
    num: "01",
    tag: "SURVIVOR SANCTUARY",
    title: "For Individuals & Families",
    subtitle: "A private, trauma-informed space to check in, track emotional wellness, and connect with assigned support at your own speed.",
    cta: "Enter Safe Space",
    href: "/welcome",
    icon: HeartHandshake,
    features: ["Anonymous daily pulse", "Direct counsellor call request", "Instant emergency helpline"],
    bgClass: "from-[#0f766e]/5 via-[#0f766e]/[0.02] to-transparent",
    accentBorder: "border-[#0f766e]/20 hover:border-[#0f766e]/60",
    badgeBg: "bg-[#0f766e]/10 text-[#0f766e]",
    btnClass: "bg-[#0f766e] text-white hover:bg-[#0c625c]",
  },
  {
    num: "02",
    tag: "CLINICAL DASHBOARD",
    title: "For Welfare Counsellors",
    subtitle: "Prioritised case caseload intelligence, flagged emotional check-ins, and secure follow-up logs in one unified workstation.",
    cta: "Counsellor Login",
    href: "/staff-login",
    icon: Users,
    features: ["Caseload risk prioritization", "Scheduled check-in timelines", "Trauma-informed notes"],
    bgClass: "from-[#5b8db8]/5 via-[#5b8db8]/[0.02] to-transparent",
    accentBorder: "border-[#5b8db8]/30 hover:border-[#5b8db8]/70",
    badgeBg: "bg-[#5b8db8]/15 text-[#3a6e99]",
    btnClass: "bg-[#4379a7] text-white hover:bg-[#34628a]",
  },
  {
    num: "03",
    tag: "STATE & DISTRICT OVERSIGHT",
    title: "For Administrators",
    subtitle: "Statutory tracking under the SC/ST Prevention of Atrocities framework with transparent district compliance metrics.",
    cta: "Admin Portal",
    href: "/staff-login",
    icon: LineChart,
    features: ["District resolution KPIs", "Statutory compensation audit", "Anonymised welfare trends"],
    bgClass: "from-[#8064a2]/5 via-[#8064a2]/[0.02] to-transparent",
    accentBorder: "border-[#8064a2]/30 hover:border-[#8064a2]/70",
    badgeBg: "bg-[#8064a2]/15 text-[#634985]",
    btnClass: "bg-[#6a4f8d] text-white hover:bg-[#553e72]",
  },
];

const STATS = [
  { value: "100%", label: "Encrypted & Consent-Led", detail: "Zero mandatory reporting" },
  { value: "24/7", label: "Crisis Responders Active", detail: "Direct connection via 112 & 14566" },
  { value: "3-Tier", label: "Support Architecture", detail: "Survivor • Counsellor • State" },
  { value: "10+", label: "Regional Languages", detail: "Voice & text check-in enabled" },
];

const JOURNEY_STEPS = [
  {
    num: "01",
    title: "Consent-Led Check-In",
    desc: "Share your mood or daily state with a single tap or voice note. No bureaucratic forms, zero interrogation.",
    icon: Smile,
  },
  {
    num: "02",
    title: "Human Counsellor Bridge",
    desc: "When needed, your assigned district counsellor reaches out with warm, trauma-informed guidance on your terms.",
    icon: Users,
  },
  {
    num: "03",
    title: "Statutory Rights & Relief",
    desc: "Seamlessly track state welfare allowances, legal aid milestones, and PoA rehabilitation provisions without friction.",
    icon: Scale,
  },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#faf8f5] text-[#172326] selection:bg-[#dcebdd] selection:text-[#0f766e]">
      {/* Editorial Decorative Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Subtle Warm Mesh Glows */}
        <div className="absolute top-[-10%] left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(220,235,221,0.65),transparent_70%)] blur-3xl" />
        <div className="absolute top-[35%] right-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_at_center,rgba(232,154,120,0.12),transparent_70%)] blur-3xl" />
        <div className="absolute bottom-[10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(91,141,184,0.12),transparent_70%)] blur-3xl" />
        
        {/* Subtle Centered Background Watermark */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[18%] -translate-x-1/2 select-none font-display text-[26vw] font-bold leading-none text-[#0f766e]/[0.018] blur-[1px]"
        >
          SAATH
        </div>
      </div>

      {/* Main Top Navigation - Clean Edge-to-Edge with subtle border */}
      <header className="relative z-30 mx-auto max-w-7xl px-5 pt-7 sm:px-10">
        <nav className="flex items-center justify-between border-b border-[#c8d3d0]/60 pb-5" aria-label="Main Navigation">
          <Link href="/landing" className="flex items-center gap-3">
            <span className="text-xl text-[#d69e2e]" aria-hidden>
              ✦
            </span>
            <span className="font-display text-3xl font-bold tracking-tight text-[#0f766e]">
              SAATH
            </span>
            <span className="hidden h-4 w-px bg-[#c8d3d0] sm:inline" />
            <span className="hidden text-[11px] font-semibold tracking-wide text-[#61706d] sm:inline">
              You Don&apos;t Have to Walk Alone
            </span>
          </Link>

          <div className="flex items-center gap-5 sm:gap-7">
            <Link
              href="/about"
              className="text-xs font-semibold uppercase tracking-wider text-[#46565a] hover:text-[#0f766e] transition-colors"
            >
              How It Protects You
            </Link>
            <Link
              href="/staff-login"
              className="group inline-flex items-center gap-2 rounded-full border border-[#c8d3d0] bg-white/80 px-4 py-2 text-xs font-bold text-[#172326] shadow-xs transition-all hover:border-[#0f766e] hover:bg-white hover:text-[#0f766e]"
            >
              <KeyRound size={13} className="text-[#0f766e] transition-transform group-hover:rotate-12" />
              <span>Official Sign In</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-20 mx-auto max-w-5xl px-5 pt-16 pb-20 text-center sm:pt-24 sm:pb-28">
        {/* Editorial Pill */}
        <div className="inline-flex items-center gap-2.5 rounded-full border border-[#0f766e]/25 bg-[#dcebdd]/70 px-4 py-1.5 shadow-2xs backdrop-blur-xs">
          <span className="h-2 w-2 rounded-full bg-[#0f766e] animate-ping" />
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0f766e]">
            A National Initiative For Dignity & Recovery
          </span>
        </div>

        {/* Master Headline */}
        <h1 className="mx-auto mt-8 max-w-4xl font-display text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-[#172326] leading-[1.08]">
          You do not have to <br />
          <span className="font-editorial italic font-normal text-[#0f766e]">
            walk through it alone.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-7 max-w-2xl text-base sm:text-lg leading-relaxed text-[#46565a]">
          SAATH connects survivors of atrocities to continuous emotional care, assigned district counsellors, and statutory welfare milestones — <strong className="font-semibold text-[#172326]">entirely on your own terms, with complete privacy.</strong>
        </p>

        {/* Primary Call To Actions */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
          <Link
            href="/welcome"
            className="group relative inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-[#0f766e] px-8 py-4 text-sm font-bold text-white shadow-[0_10px_25px_rgba(15,118,110,0.25)] transition-all duration-200 hover:bg-[#0c625c] hover:shadow-[0_12px_30px_rgba(15,118,110,0.35)] hover:-translate-y-0.5 sm:w-auto"
          >
            <span>Enter Survivor Space</span>
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>

          <Link
            href="/about"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#c8d3d0] bg-white/90 px-7 py-4 text-sm font-bold text-[#172326] shadow-xs transition-all duration-200 hover:border-[#0f766e] hover:bg-white hover:text-[#0f766e] sm:w-auto"
          >
            <span>How SAATH Protects You</span>
          </Link>
        </div>

        {/* Reassurance Metrics */}
        <div className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-4 rounded-2xl border border-[#c8d3d0]/60 bg-white/60 p-4 backdrop-blur-sm sm:grid-cols-4 sm:p-5">
          {STATS.map(({ value, label, detail }) => (
            <div key={label} className="text-center">
              <p className="font-display text-xl sm:text-2xl font-bold text-[#0f766e]">{value}</p>
              <p className="text-xs font-bold text-[#172326] mt-0.5">{label}</p>
              <p className="text-[10px] text-[#61706d] mt-0.5 hidden sm:block">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Preview Card / Safe Haven Showcase */}
      <section className="relative z-20 mx-auto max-w-6xl px-5 py-6">
        <div className="overflow-hidden rounded-3xl border border-[#c8d3d0]/80 bg-white shadow-[0_20px_50px_rgba(23,35,38,0.06)]">
          <div className="grid lg:grid-cols-12">
            {/* Left Narrative Pillar */}
            <div className="flex flex-col justify-between border-b border-[#c8d3d0]/60 p-8 sm:p-12 lg:col-span-5 lg:border-b-0 lg:border-r">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0f766e]">
                  Human-First Architecture
                </span>
                <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold leading-snug text-[#172326]">
                  Support that respects your pace and privacy.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-[#46565a]">
                  Unlike conventional portals that demand endless paperwork, SAATH is built like a quiet sanctuary. Log your feelings, speak in your language, or request an empathetic phone call whenever you need.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-[#c8d3d0]/50">
                <div className="flex items-center gap-3 text-xs font-semibold text-[#0f766e]">
                  <CheckCircle2 size={16} />
                  <span>No institutional surveillance • Strict consent protocol</span>
                </div>
              </div>
            </div>

            {/* Right Live Interaction Showcase */}
            <div className="bg-[#f8faf8] p-8 sm:p-12 lg:col-span-7">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#c8d3d0]/70 bg-white p-5 shadow-xs transition-all hover:border-[#0f766e]/40 hover:shadow-md">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#dcebdd] text-[#0f766e]">
                    <Smile size={20} />
                  </div>
                  <h4 className="mt-3 font-bold text-[#172326]">Daily Emotional Pulse</h4>
                  <p className="mt-1 text-xs leading-relaxed text-[#46565a]">
                    Express how you feel in one click. Voice inputs and low-literacy intuitive visual cues supported.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#c8d3d0]/70 bg-white p-5 shadow-xs transition-all hover:border-[#5b8db8]/40 hover:shadow-md">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#dfeaf4] text-[#4d7ea1]">
                    <PhoneCall size={20} />
                  </div>
                  <h4 className="mt-3 font-bold text-[#172326]">Dedicated Counsellor</h4>
                  <p className="mt-1 text-xs leading-relaxed text-[#46565a]">
                    Your assigned district case counsellor receives context with empathy to provide meaningful check-ins.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#c8d3d0]/70 bg-white p-5 shadow-xs transition-all hover:border-[#8064a2]/40 hover:shadow-md">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0ebf5] text-[#8064a2]">
                    <Scale size={20} />
                  </div>
                  <h4 className="mt-3 font-bold text-[#172326]">PoA Welfare Tracker</h4>
                  <p className="mt-1 text-xs leading-relaxed text-[#46565a]">
                    Stay informed on statutory compensation stages, FIR milestones, and social justice entitlements.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#c8d3d0]/70 bg-white p-5 shadow-xs transition-all hover:border-[#d69e2e]/40 hover:shadow-md">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fcf4e6] text-[#b67926]">
                    <Lock size={20} />
                  </div>
                  <h4 className="mt-3 font-bold text-[#172326]">Vault & Privacy Lock</h4>
                  <p className="mt-1 text-xs leading-relaxed text-[#46565a]">
                    All check-ins are end-to-end encrypted. You can pause or delete your participation history at any time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Dedicated Stakeholder Portals */}
      <section className="relative z-20 mx-auto max-w-6xl px-5 py-16">
        <div className="mb-12 flex flex-col justify-between gap-4 border-b border-[#c8d3d0]/70 pb-6 md:flex-row md:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0f766e]">
              01 / STAKEHOLDER PLATFORMS
            </span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-[#172326]">
              A Purpose-Built Workspace for Everyone
            </h2>
          </div>
          <p className="max-w-md text-xs sm:text-sm text-[#61706d]">
            Dedicated access channels ensuring clarity, emotional security, and administrative transparency.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {PORTALS.map(({ num, tag, title, subtitle, cta, href, icon: Icon, features, bgClass, accentBorder, badgeBg, btnClass }) => (
            <div
              key={title}
              className={`group flex flex-col justify-between rounded-3xl border bg-gradient-to-b ${bgClass} bg-white p-7 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${accentBorder}`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-editorial text-2xl italic text-[#61706d]">{num}</span>
                  <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${badgeBg}`}>
                    {tag}
                  </span>
                </div>

                <div className="mt-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-xs border border-[#c8d3d0]/60">
                  <Icon size={24} className="text-[#172326]" />
                </div>

                <h3 className="mt-5 font-display text-2xl font-bold text-[#172326]">{title}</h3>
                <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-[#46565a]">{subtitle}</p>

                <ul className="mt-6 space-y-2 border-t border-[#c8d3d0]/40 pt-5">
                  {features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-xs font-medium text-[#46565a]">
                      <CheckCircle2 size={13} className="text-[#0f766e] shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4">
                <Link
                  href={href}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold uppercase tracking-wider shadow-xs transition-all ${btnClass}`}
                >
                  <span>{cta}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Continuum */}
      <section className="relative z-20 mx-auto max-w-6xl px-5 py-12">
        <div className="rounded-3xl border border-[#c8d3d0]/80 bg-[#172e29] p-8 text-white shadow-2xl sm:p-12 md:p-16">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7faf86]">
              02 / CONTINUUM OF CARE
            </span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-white">
              How SAATH Restores Dignity
            </h2>
            <p className="mt-3 text-sm text-white/70">
              Transforming complex statutory monitoring into a continuous, humane support cycle.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {JOURNEY_STEPS.map(({ num, title, desc, icon: Icon }) => (
              <div key={title} className="relative rounded-2xl bg-white/5 p-6 border border-white/10 backdrop-blur-xs">
                <div className="flex items-center justify-between">
                  <span className="font-editorial text-2xl italic text-[#7faf86]">{num}</span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white">
                    <Icon size={18} />
                  </div>
                </div>
                <h3 className="mt-4 font-display text-xl font-bold text-white">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-white/70">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Immediate Emergency Reassurance Band */}
      <section className="relative z-20 mx-auto max-w-6xl px-5 py-8">
        <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-[#c8d3d0] bg-white p-6 shadow-sm md:flex-row md:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#f7e2dd] text-[#b86a59]">
              <ShieldAlert size={26} />
            </div>
            <div>
              <p className="font-display text-lg font-bold text-[#172326]">
                In immediate physical danger or distress?
              </p>
              <p className="text-xs text-[#61706d] mt-0.5">
                Official national toll-free helplines are monitored 24 hours a day with confidential first responders.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="tel:112"
              className="inline-flex items-center gap-2 rounded-xl bg-[#b86a59] px-5 py-3 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#a2594a]"
            >
              <PhoneCall size={14} />
              <span>National Police & Emergency: 112</span>
            </a>
            <a
              href="tel:14566"
              className="inline-flex items-center gap-2 rounded-xl border border-[#c8d3d0] bg-[#faf8f5] px-5 py-3 text-xs font-bold text-[#172326] shadow-xs transition-colors hover:bg-[#dcebdd]"
            >
              <span>NHAA Atrocity Helpline: 14566</span>
            </a>
          </div>
        </div>
      </section>

      {/* Official Statutory Footer */}
      <footer className="relative z-20 mx-auto mt-12 max-w-6xl border-t border-[#c8d3d0]/80 px-5 pt-8 pb-14 text-xs text-[#61706d]">
        <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
          <div className="flex items-center gap-2.5">
            <ShieldCheck size={18} className="text-[#0f766e]" />
            <span className="font-medium text-[#172326]">
              SAATH • Ministry of Social Justice and Empowerment Initiative
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 font-semibold">
            <Link href="/about" className="hover:text-[#0f766e] transition-colors">
              Statutory Guidelines
            </Link>
            <Link href="/about" className="hover:text-[#0f766e] transition-colors">
              Privacy Charter
            </Link>
            <Link href="/staff-login" className="hover:text-[#0f766e] transition-colors">
              Authorised Official Portal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}