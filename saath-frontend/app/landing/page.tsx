import Link from "next/link";
import { SaathLogo } from "@/components/SaathLogo";
import {
  ArrowRight,
  Sparkles,
  Lock,
  Smile,
  Globe2,
  Users,
  LineChart,
  CheckCircle2,
  PhoneCall,
  KeyRound,
  ShieldCheck,
  Scale,
  ShieldAlert,
  ArrowUpRight,
  EyeOff,
  UserCheck,
  FileCheck2,
  Activity,
  HeartHandshake,
} from "lucide-react";

const JOURNEY_STAGES = [
  {
    num: "01",
    tag: "CHECK IN",
    title: "Share how you are feeling",
    desc: "A private, low-friction moment to note your emotional state or record a voice note in your regional language.",
    icon: Smile,
  },
  {
    num: "02",
    tag: "UNDERSTAND",
    title: "Turn patterns into insight",
    desc: "Reflect on your wellbeing journey over time with clear, non-stigmatising patterns and grounding exercises.",
    icon: Activity,
  },
  {
    num: "03",
    tag: "CONNECT",
    title: "Stay linked with care",
    desc: "Direct link to your assigned district welfare counsellor who receives compassionate context at your pace.",
    icon: Users,
  },
  {
    num: "04",
    tag: "SUPPORT",
    title: "Access statutory rights",
    desc: "Verify PoA relief disbursements, legal aid, and social welfare provisions transparently without bureaucracy.",
    icon: Scale,
  },
  {
    num: "05",
    tag: "KEEP MOVING",
    title: "Healing on your own terms",
    desc: "No forced deadlines, no surveillance. A safe sanctuary that stays with you for as long as you need.",
    icon: HeartHandshake,
  },
];

const PRIVACY_PRINCIPLES = [
  {
    tag: "CONSENT FIRST",
    title: "You are always in control",
    desc: "Your participation, emotional check-ins, and data sharing remain strictly under your voluntary direction. Zero mandatory logs.",
    icon: UserCheck,
  },
  {
    tag: "PRIVATE BY DESIGN",
    title: "End-to-end data isolation",
    desc: "Grievance identity and health logs are stored in secure, encrypted silos. No commercial tracking or third-party profiling.",
    icon: Lock,
  },
  {
    tag: "HUMAN REVIEW",
    title: "AI assists, humans care",
    desc: "High-impact safety and wellbeing decisions are never delegated to algorithms alone. Qualified human counsellors provide genuine care.",
    icon: HeartHandshake,
  },
  {
    tag: "NO FORCED REPORTING",
    title: "A safe space to reflect",
    desc: "Using wellbeing tools, emotional grounding, or self-help exercises never triggers automatic police escalation or unwanted intervention.",
    icon: EyeOff,
  },
];

const PROCESS_FLOW = [
  {
    step: "01",
    title: "Case Connection",
    desc: "Optionally link your grievance identifier or continue anonymously.",
  },
  {
    step: "02",
    title: "Informed Consent",
    desc: "Set granular sharing boundaries that you can pause or revoke at any time.",
  },
  {
    step: "03",
    title: "Gentle Check-In",
    desc: "Express emotions via simple scales, text reflections, or regional voice notes.",
  },
  {
    step: "04",
    title: "Wellbeing Insights",
    desc: "Receive grounding exercises and notice emotional recovery rhythms.",
  },
  {
    step: "05",
    title: "Human Support",
    desc: "Request counsellor calls and statutory relief guidance when you are ready.",
  },
  {
    step: "06",
    title: "Continuous Healing",
    desc: "Longitudinal care that stays with you beyond legal case timelines.",
  },
];

const METRICS = [
  { value: "100%", label: "Consent-Led & Encrypted", detail: "Zero mandatory reporting" },
  { value: "24/7", label: "Crisis Support Active", detail: "Direct connection via 112 & 14566" },
  { value: "3-Tier", label: "Support Architecture", detail: "Survivor • Counsellor • State" },
  { value: "10+", label: "Regional Languages", detail: "Voice & text check-in enabled" },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#faf8f5] text-[#172326] selection:bg-[#dcebdd] selection:text-[#0f766e]">
      {/* Editorial Decorative Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Restrained Soft Warm Tones */}
        <div className="absolute top-[-8%] left-[10%] h-[550px] w-[750px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(220,235,221,0.55),transparent_70%)] blur-3xl" />
        <div className="absolute top-[30%] right-[-5%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_at_center,rgba(232,154,120,0.08),transparent_70%)] blur-3xl" />
        <div className="absolute bottom-[10%] left-[-5%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(214,158,46,0.06),transparent_70%)] blur-3xl" />
      </div>

      {/* Main Top Navigation */}
      <header className="relative z-30 mx-auto max-w-7xl px-5 pt-7 sm:px-10">
        <nav className="flex items-center justify-between border-b border-[#c8d3d0]/60 pb-5" aria-label="Main Navigation">
          <Link href="/landing" className="flex items-center gap-3 group">
            <SaathLogo className="h-9 w-auto transition-transform duration-200 group-hover:scale-105" size={38} />
            <span className="font-display text-3xl font-bold tracking-tight text-[#0f766e]">
              SAATH
            </span>
            <span className="hidden h-4 w-px bg-[#c8d3d0] sm:inline" />
            <span className="hidden text-[11px] font-semibold tracking-wide text-[#61706d] sm:inline">
              Support After Trauma & Healing
            </span>
          </Link>

          <div className="flex items-center gap-6 sm:gap-8">
            <a
              href="#how-it-works"
              className="hidden text-xs font-semibold uppercase tracking-wider text-[#46565a] hover:text-[#0f766e] transition-colors sm:inline-block"
            >
              How It Works
            </a>
            <Link
              href="/about"
              className="text-xs font-semibold uppercase tracking-wider text-[#46565a] hover:text-[#0f766e] transition-colors"
            >
              How SAATH Protects You
            </Link>
            <Link
              href="/staff-login"
              className="group inline-flex items-center gap-2 rounded-full border border-[#c8d3d0] bg-white px-4 py-2 text-xs font-bold text-[#172326] shadow-xs transition-all hover:border-[#0f766e] hover:bg-[#0f766e]/5 hover:text-[#0f766e]"
            >
              <KeyRound size={13} className="text-[#0f766e] transition-transform group-hover:rotate-12" />
              <span>Official Sign In</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section — 2-Column Editorial Composition */}
      <section className="relative z-20 mx-auto max-w-7xl px-5 pt-14 pb-20 sm:px-10 sm:pt-20 sm:pb-28">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Typography & Intentional CTAs */}
          <div className="text-left lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0f766e]/20 bg-[#dcebdd]/70 px-3.5 py-1.5 shadow-2xs backdrop-blur-xs">
              <span className="h-2 w-2 rounded-full bg-[#0f766e] animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#0f766e]">
                SUPPORT AFTER TRAUMA & HEALING
              </span>
            </div>

            <h1 className="mt-7 font-display text-4xl sm:text-6xl lg:text-[4.25rem] font-medium tracking-tight text-[#172326] leading-[1.06]">
              You do not have to <br />
              <span className="font-editorial italic font-normal text-[#0f766e]">
                walk through it alone.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-[#46565a]">
              SAATH gives survivors a private space to check in, understand their wellbeing, stay connected to support, and move forward at their own pace.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/welcome"
                className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-[#0f766e] px-7 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#0c625c] hover:shadow-lg hover:-translate-y-0.5"
              >
                <span>Enter Survivor Space</span>
                <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#0f766e]/40 bg-[#faf8f5] px-6 py-3.5 text-sm font-semibold text-[#0f766e] transition-all duration-200 hover:bg-[#dcebdd]/40 hover:border-[#0f766e]"
              >
                <span>How SAATH Protects You</span>
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-6 text-xs text-[#61706d]">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <CheckCircle2 size={14} className="text-[#0f766e]" /> 100% Consent-Led
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium">
                <CheckCircle2 size={14} className="text-[#0f766e]" /> Zero Forced Reporting
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium">
                <CheckCircle2 size={14} className="text-[#0f766e]" /> Trauma-Informed
              </span>
            </div>
          </div>

          {/* Right Column: Signature Abstract "Support Journey" Visual (Two Parallel Flowing Paths) */}
          <div className="relative flex items-center justify-center lg:col-span-5">
            <div className="relative w-full max-w-[460px] aspect-[4/3.8] rounded-3xl border border-[#c8d3d0]/80 bg-gradient-to-b from-white/95 to-[#f8faf8] p-7 shadow-[0_20px_45px_rgba(23,35,38,0.04)] backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-[#c8d3d0]/50 pb-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#0f766e]" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#61706d]">
                    THE CONTINUUM OF CARE
                  </span>
                </div>
                <span className="text-[11px] font-editorial italic text-[#d69e2e]">
                  walking alongside
                </span>
              </div>

              {/* Handcrafted Support Curve Artwork (SVG) */}
              <div className="relative my-4 flex h-48 w-full items-center justify-center">
                <svg
                  viewBox="0 0 380 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full overflow-visible"
                  aria-label="Two parallel flowing paths representing survivor journey and continuous human support"
                >
                  <defs>
                    <linearGradient id="survivorPathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#0f766e" stopOpacity="0.4" />
                      <stop offset="50%" stopColor="#0f766e" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#0f766e" stopOpacity="1" />
                    </linearGradient>
                    <linearGradient id="supportPathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#d69e2e" stopOpacity="0.3" />
                      <stop offset="60%" stopColor="#d69e2e" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#0f766e" stopOpacity="0.8" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Sanctuary Protected Haven Circles */}
                  <circle cx="90" cy="115" r="28" fill="#dcebdd" fillOpacity="0.35" />
                  <circle cx="210" cy="85" r="34" fill="#dcebdd" fillOpacity="0.45" />
                  <circle cx="330" cy="65" r="24" fill="#fff9f0" stroke="#d69e2e" strokeWidth="1" strokeDasharray="3 3" />

                  {/* Path 1: Survivor's Organic Journey */}
                  <path
                    d="M 20 150 C 70 140, 110 95, 170 100 C 230 105, 270 70, 360 55"
                    stroke="url(#survivorPathGrad)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Path 2: Dedicated Continuous Support Path (Running Alongside) */}
                  <path
                    d="M 20 170 C 80 160, 120 125, 180 120 C 240 115, 280 85, 360 70"
                    stroke="url(#supportPathGrad)"
                    strokeWidth="2.5"
                    strokeDasharray="4 3"
                    strokeLinecap="round"
                  />

                  {/* Waypoint Markers */}
                  <circle cx="90" cy="115" r="5" fill="#0f766e" />
                  <circle cx="210" cy="85" r="6" fill="#0f766e" filter="url(#glow)" />
                  <circle cx="330" cy="65" r="4.5" fill="#d69e2e" />

                  {/* Waypoint Labels */}
                  <text x="75" y="152" fill="#61706d" fontSize="9" fontWeight="600" letterSpacing="0.05em">
                    SAFE ENTRY
                  </text>
                  <text x="180" y="60" fill="#0f766e" fontSize="9" fontWeight="700" letterSpacing="0.05em">
                    PROTECTED SPACE
                  </text>
                  <text x="310" y="42" fill="#d69e2e" fontSize="9" fontWeight="600" letterSpacing="0.05em">
                    HORIZON
                  </text>
                </svg>
              </div>

              {/* Visual Micro-Legend */}
              <div className="flex items-center justify-between border-t border-[#c8d3d0]/50 pt-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-4 rounded-full bg-[#0f766e]" />
                  <span className="text-[11px] font-medium text-[#46565a]">Your Personal Pace</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-4 rounded-full border border-dashed border-[#d69e2e]" />
                  <span className="text-[11px] font-medium text-[#46565a]">Counsellor & Rights</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Value Transition Strip — 5-Stage Journey */}
      <section className="relative z-20 mx-auto max-w-7xl px-5 py-16 sm:px-10 sm:py-20 border-t border-[#c8d3d0]/60">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0f766e]">
            THE HEALING CONTINUUM
          </span>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-medium text-[#172326]">
            Built around your journey — <br />
            <span className="font-editorial italic font-normal text-[#0f766e]">
              not your diagnosis.
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#46565a]">
            SAATH brings together private check-ins, wellbeing insights, human support and trusted resources in one consent-led space.
          </p>
        </div>

        {/* 5 Journey Stages: Horizontal flow on desktop, stacked on mobile */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {JOURNEY_STAGES.map(({ num, tag, title, desc, icon: Icon }) => (
            <div
              key={tag}
              className="flex flex-col justify-between rounded-2xl border border-[#c8d3d0]/80 bg-white/90 p-5 shadow-xs transition-all duration-200 hover:border-[#0f766e]/50 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-editorial text-lg italic text-[#0f766e]">{num}</span>
                  <span className="rounded-full bg-[#f4f6ec] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0f766e]">
                    {tag}
                  </span>
                </div>
                <div className="mt-4 flex h-9 w-9 items-center justify-center rounded-xl bg-[#dcebdd]/70 text-[#0f766e]">
                  <Icon size={18} />
                </div>
                <h3 className="mt-4 text-sm font-bold text-[#172326] leading-snug">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-[#61706d]">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Privacy Section */}
      <section className="relative z-20 mx-auto max-w-7xl px-5 py-16 sm:px-10 sm:py-20 border-t border-[#c8d3d0]/60">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0f766e]">
              PRIVACY & INTEGRITY
            </span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-medium text-[#172326]">
              Your data is yours.
            </h2>
          </div>
          <p className="max-w-md text-xs sm:text-sm leading-relaxed text-[#61706d]">
            SAATH is designed around consent, privacy and human oversight. No corporate tracking, no forced disclosure.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PRIVACY_PRINCIPLES.map(({ tag, title, desc, icon: Icon }) => (
            <div
              key={tag}
              className="rounded-2xl border border-[#c8d3d0]/70 bg-white p-6 shadow-xs"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4f6ec] text-[#0f766e]">
                <Icon size={20} />
              </div>
              <span className="mt-4 block text-[10px] font-bold uppercase tracking-wider text-[#0f766e]">
                {tag}
              </span>
              <h3 className="mt-1 text-base font-bold text-[#172326]">{title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-[#46565a]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process Section — How SAATH Works */}
      <section id="how-it-works" className="relative z-20 mx-auto max-w-7xl px-5 py-16 sm:px-10 sm:py-20 border-t border-[#c8d3d0]/60">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0f766e]">
            STEP-BY-STEP PROCESS
          </span>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-medium text-[#172326]">
            How SAATH Works
          </h2>
          <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#61706d]">
            A seamless, consent-first continuum designed to support recovery over time.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROCESS_FLOW.map(({ step, title, desc }) => (
            <div key={step} className="relative rounded-2xl border border-[#c8d3d0]/70 bg-white/80 p-6 shadow-xs">
              <span className="font-editorial text-2xl italic text-[#0f766e]">{step}</span>
              <h3 className="mt-3 text-base font-bold text-[#172326]">{title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-[#46565a]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Human Support Section */}
      <section className="relative z-20 mx-auto max-w-7xl px-5 py-16 sm:px-10 sm:py-20 border-t border-[#c8d3d0]/60">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0f766e]">
              HUMAN CONNECTION
            </span>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-medium text-[#172326] leading-snug">
              Technology can listen. <br />
              <span className="font-editorial italic font-normal text-[#0f766e]">
                People still matter.
              </span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#46565a]">
              SAATH assists support systems rather than replacing human care. It enables district welfare counsellors and support networks to understand how you are doing, notice when you might need a helping hand, and connect when you are ready.
            </p>
            <div className="mt-6 space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-[#172326]">
                <CheckCircle2 size={15} className="text-[#0f766e]" />
                <span>Dedicated district counsellor allocation</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-[#172326]">
                <CheckCircle2 size={15} className="text-[#0f766e]" />
                <span>Trauma-informed follow-up protocols</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-[#172326]">
                <CheckCircle2 size={15} className="text-[#0f766e]" />
                <span>Seamless linkage to statutory PoA rehabilitation schemes</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl border border-[#c8d3d0]/80 bg-[#172e29] p-8 text-white shadow-xl sm:p-10">
              <div className="flex items-center gap-3 text-[#7faf86]">
                <HeartHandshake size={24} />
                <span className="text-xs font-bold uppercase tracking-wider">Compassionate Cadence</span>
              </div>
              <h3 className="mt-4 font-display text-2xl font-bold text-white">
                Support that stays with you beyond legal timelines.
              </h3>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-white/80">
                Grievance cases move through institutional calendars. Personal recovery happens on human time. SAATH ensures you are never lost in bureaucratic transitions.
              </p>
              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-white/60">Ready to enter your sanctuary?</span>
                <Link
                  href="/welcome"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#7faf86] hover:underline"
                >
                  <span>Enter Survivor Space</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Proof & Metrics Section */}
      <section className="relative z-20 mx-auto max-w-7xl px-5 py-14 sm:px-10 border-t border-[#c8d3d0]/60">
        <div className="grid grid-cols-2 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#c8d3d0]/60 lg:grid-cols-4">
          {METRICS.map(({ value, label, detail }) => (
            <div key={label} className="pt-4 sm:pt-0 sm:px-6 text-center sm:text-left">
              <p className="font-display text-3xl sm:text-4xl font-bold text-[#0f766e]">{value}</p>
              <p className="mt-1 text-sm font-bold text-[#172326]">{label}</p>
              <p className="mt-0.5 text-xs text-[#61706d]">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Emergency Reassurance Band */}
      <section className="relative z-20 mx-auto max-w-7xl px-5 py-8 sm:px-10">
        <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-[#c8d3d0] bg-white p-6 shadow-xs md:flex-row md:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f7e2dd] text-[#b86a59]">
              <ShieldAlert size={24} />
            </div>
            <div>
              <p className="font-display text-base sm:text-lg font-bold text-[#172326]">
                Need immediate emergency response or in danger?
              </p>
              <p className="text-xs text-[#61706d] mt-0.5">
                Official national toll-free helplines are available 24 hours a day with confidential first responders.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="tel:112"
              className="inline-flex items-center gap-2 rounded-full bg-[#b86a59] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#a2594a]"
            >
              <PhoneCall size={13} />
              <span>National Emergency: 112</span>
            </a>
            <a
              href="tel:14566"
              className="inline-flex items-center gap-2 rounded-full border border-[#c8d3d0] bg-[#faf8f5] px-5 py-2.5 text-xs font-bold text-[#172326] shadow-xs transition-colors hover:bg-[#dcebdd]"
            >
              <span>NHAA Atrocity Helpline: 14566</span>
            </a>
          </div>
        </div>
      </section>

      {/* Final Reassuring CTA */}
      <section className="relative z-20 mx-auto max-w-7xl px-5 py-16 sm:px-10 sm:py-24 border-t border-[#c8d3d0]/60">
        <div className="rounded-3xl border border-[#c8d3d0]/80 bg-[#0f766e] p-8 text-center text-white shadow-xl sm:p-14">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#dcebdd]">
            BEGIN YOUR SPACE
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl font-medium text-white">
            Support that stays with you.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-[#dcebdd]/90">
            Move forward at your own pace, with a space built around dignity, privacy and human support.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/welcome"
              className="inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-[#0f766e] shadow-md transition-all hover:bg-[#faf8f5] hover:shadow-lg hover:scale-[1.02]"
            >
              <span>Enter SAATH</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Clean Premium Footer */}
      <footer className="relative z-20 mx-auto max-w-7xl border-t border-[#c8d3d0]/80 px-5 pt-8 pb-14 sm:px-10 text-xs text-[#61706d]">
        <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
          <div className="flex items-center gap-2.5">
            <ShieldCheck size={18} className="text-[#0f766e]" />
            <span className="font-medium text-[#172326]">
              SAATH • Support After Trauma & Healing
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 font-semibold">
            <a href="#how-it-works" className="hover:text-[#0f766e] transition-colors">
              How It Works
            </a>
            <Link href="/about" className="hover:text-[#0f766e] transition-colors">
              How SAATH Protects You
            </Link>
            <Link href="/about" className="hover:text-[#0f766e] transition-colors">
              Legal & Rights
            </Link>
            <Link href="/staff-login" className="hover:text-[#0f766e] transition-colors">
              Official Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}