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
  Activity,
  Compass,
  FileCheck2,
  Sparkle,
} from "lucide-react";

const PORTALS = [
  {
    num: "01",
    label: "For survivors",
    badge: "Direct Support",
    tagline: "Trauma-Informed Safe Space",
    title: "A calm, private space to check in and heal.",
    description:
      "A compassionate sanctuary to track your emotional well-being, request counsellor follow-ups, and access welfare entitlements at your own pace.",
    cta: "Continue as survivor",
    href: "/welcome",
    icon: HeartHandshake,
    accent: "hover:border-deep-teal/40 hover:shadow-teal-900/5",
    theme: "bg-white/90",
  },
  {
    num: "02",
    label: "For counsellors",
    badge: "Clinical Care",
    tagline: "Prioritised Case Intelligence",
    title: "Actionable, timely insight into every case.",
    description:
      "Stay meaningfully connected to those you support. Monitor flagged check-ins, scheduled outreach, and wellness trends in real time.",
    cta: "Counsellor sign in",
    href: "/staff-login",
    icon: Users,
    accent: "hover:border-calm-blue/40 hover:shadow-blue-900/5",
    theme: "bg-white/90",
  },
  {
    num: "03",
    label: "For administrators",
    badge: "Governance",
    tagline: "Institutional Accountability",
    title: "Aggregated, anonymised decision intelligence.",
    description:
      "Statutory oversight across districts. Monitor resolution metrics, compliance timelines, and welfare allocation transparently.",
    cta: "Admin sign in",
    href: "/staff-login",
    icon: LineChart,
    accent: "hover:border-muted-plum/40 hover:shadow-purple-900/5",
    theme: "bg-white/90",
  },
];

const JOURNEY_STEPS = [
  {
    step: "Step 01",
    title: "Private Check-In",
    desc: "Express how you are feeling in seconds using text, gentle emoji scales, or voice in your own regional language.",
    icon: Smile,
  },
  {
    step: "Step 02",
    title: "Compassionate Support",
    desc: "Your assigned counsellor receives gentle context without invasive questioning, respecting your boundary and pace.",
    icon: Users,
  },
  {
    step: "Step 03",
    title: "Rights & Welfare Access",
    desc: "Track statutory compensation milestones, legal guidance, and community schemes under the PoA framework.",
    icon: FileCheck2,
  },
];

const PILLARS = [
  {
    num: "01",
    title: "Radical consent & privacy",
    desc: "No forced surveillance. You decide what to share, when to share it, and who receives your updates.",
    icon: Lock,
  },
  {
    num: "02",
    title: "Trauma-informed design",
    desc: "Micro-interactions crafted to soothe rather than overwhelm. Low cognitive friction designed for safety.",
    icon: HeartHandshake,
  },
  {
    num: "03",
    title: "Statutory & institutional trust",
    desc: "Built to support the SC/ST Prevention of Atrocities framework with verifiable audit trails and secure jurisdictional routing.",
    icon: ShieldCheck,
  },
  {
    num: "04",
    title: "Multilingual & low-literacy ready",
    desc: "Voice-first check-ins, intuitive visual scales, and accessibility enhancements so no survivor is left unsupported.",
    icon: Globe2,
  },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(220,235,221,.85),transparent_70%),radial-gradient(circle_at_90%_75%,rgba(255,249,240,1),transparent_50%),var(--warm-cream)] px-5 py-6 sm:px-8 md:px-12 lg:px-20">
      {/* Background Watermark Art */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-5%] top-[10%] select-none font-display text-[22vw] font-bold leading-none text-deep-teal/[0.022] blur-[1px]"
      >
        SAATH
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-4%] bottom-[12%] select-none font-display text-[18vw] font-bold leading-none text-deep-teal/[0.018] blur-[1px]"
      >
        CARE
      </div>

      {/* Header / Nav */}
      <header className="relative z-10 mx-auto max-w-6xl">
        <nav className="flex items-center justify-between rounded-full border border-border-color/60 bg-white/70 px-5 py-3 backdrop-blur-md shadow-xs" aria-label="Main Navigation">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pale-sage/80 text-deep-teal font-display text-base font-bold shadow-xs">
              S
            </span>
            <span className="font-display text-2xl font-bold tracking-tight text-deep-teal">
              SAATH
            </span>
            <span className="hidden h-4 w-px bg-border-color/60 sm:inline" />
            <span className="hidden text-[11px] font-semibold uppercase tracking-[0.16em] text-text-muted sm:inline">
              Support with dignity
            </span>
          </div>

          <div className="flex items-center gap-5">
            <Link
              href="/about"
              className="link-editorial text-sm font-medium text-text-secondary hover:text-deep-teal hidden sm:inline-flex"
            >
              About the initiative
            </Link>
            <Link
              href="/staff-login"
              className="group inline-flex items-center gap-2 rounded-full border border-border-color/80 bg-white px-4 py-2 text-xs font-semibold tracking-wide text-text-primary shadow-xs transition-all hover:border-deep-teal/40 hover:bg-pale-sage/20 hover:text-deep-teal sm:text-sm sm:px-5"
            >
              <KeyRound size={14} className="text-deep-teal transition-transform group-hover:scale-110" />
              <span>Staff sign in</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-5xl pt-14 pb-16 text-center sm:pt-20 sm:pb-24">
        <div className="inline-flex items-center gap-2 rounded-full border border-deep-teal/20 bg-pale-sage/70 px-4 py-1.5 shadow-xs backdrop-blur-xs">
          <span className="h-2 w-2 rounded-full bg-deep-teal animate-pulse" />
          <span className="eyebrow text-deep-teal">SUPPORTIVE MONITORING, BY CONSENT</span>
        </div>

        <h1 className="mx-auto mt-7 max-w-4xl display-xl text-text-primary">
          You don&apos;t have to{" "}
          <span className="editorial-italic block sm:inline font-normal">carry it alone.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg">
          SAATH walks with survivors of atrocities with quiet compassion, radical privacy, and statutory care.{" "}
          <strong className="font-semibold text-text-primary">Notice your feelings, request support when you are ready, and move at your own pace.</strong>
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/welcome"
            className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-deep-teal px-8 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#0c625c] hover:shadow-lg sm:w-auto"
          >
            <span>Get started</span>
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/about"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border-color/90 bg-white/80 px-7 py-3.5 text-sm font-semibold text-deep-teal backdrop-blur-xs transition-all hover:border-deep-teal/40 hover:bg-white shadow-xs sm:w-auto"
          >
            Learn how it works
          </Link>
        </div>

        {/* Reassurance Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-text-secondary sm:gap-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/60 px-3.5 py-1.5 border border-border-subtle shadow-xs">
            <CheckCircle2 size={15} className="text-deep-teal" /> 100% confidential & encrypted
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/60 px-3.5 py-1.5 border border-border-subtle shadow-xs">
            <CheckCircle2 size={15} className="text-deep-teal" /> No mandatory reporting
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/60 px-3.5 py-1.5 border border-border-subtle shadow-xs">
            <CheckCircle2 size={15} className="text-deep-teal" /> 24/7 emergency response
          </span>
        </div>
      </section>

      {/* Visual Support Experience Preview Mock */}
      <section className="relative z-10 mx-auto max-w-5xl mb-20">
        <div className="rounded-3xl border border-border-color/70 bg-gradient-to-b from-white/95 to-[#f7faf8] p-6 shadow-xl backdrop-blur-md sm:p-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-subtle pb-6">
            <div>
              <div className="flex items-center gap-2 text-deep-teal">
                <Sparkle size={18} />
                <span className="eyebrow">A CALM, SAFE DIGITAL COMPANION</span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl text-text-primary mt-1">
                Designed to feel like a deep breath, not a bureaucratic portal.
              </h3>
            </div>
            <Link
              href="/welcome"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-deep-teal hover:underline self-start md:self-auto"
            >
              Explore Sanctuary →
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-border-color/60 bg-white p-5 shadow-xs transition-all hover:border-deep-teal/30 hover:shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pale-sage text-deep-teal">
                <Smile size={20} />
              </div>
              <h4 className="font-semibold text-text-primary mt-3 text-base">Daily Pulse Check</h4>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                Log how you feel in one tap. No long surveys or clinical interrogation.
              </p>
            </div>

            <div className="rounded-2xl border border-border-color/60 bg-white p-5 shadow-xs transition-all hover:border-deep-teal/30 hover:shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e0effa] text-calm-blue">
                <MessageCircle size={20} />
              </div>
              <h4 className="font-semibold text-text-primary mt-3 text-base">Counsellor Bridge</h4>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                Request a warm call from your dedicated welfare counsellor whenever you feel ready.
              </p>
            </div>

            <div className="rounded-2xl border border-border-color/60 bg-white p-5 shadow-xs transition-all hover:border-deep-teal/30 hover:shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5e8ea] text-muted-plum">
                <ShieldCheck size={20} />
              </div>
              <h4 className="font-semibold text-text-primary mt-3 text-base">Rights & Relief</h4>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                Verify statutory entitlements and compensation timelines without navigating complex offices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Portals Section */}
      <section className="relative z-10 mx-auto max-w-6xl py-6">
        <div className="mb-10 flex flex-col justify-between gap-3 border-b border-border-color/60 pb-5 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow text-deep-teal">01 / DEDICATED PORTALS</p>
            <h2 className="heading-xl mt-1 text-text-primary">
              Designed for every stakeholder in the journey
            </h2>
          </div>
          <p className="max-w-md text-xs text-text-muted sm:text-sm">
            Tailored interfaces prioritizing dignity for victims, clarity for counsellors, and accountability for administration.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {PORTALS.map(({ num, label, badge, tagline, title, description, cta, href, icon: Icon, accent, theme }) => (
            <div
              key={label}
              className={`group relative flex flex-col justify-between rounded-3xl border border-border-color/80 ${theme} p-7 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${accent}`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-editorial text-2xl italic text-deep-teal/60">{num}</span>
                  <span className="rounded-full bg-pale-sage/80 px-3 py-1 text-[11px] font-semibold text-deep-teal shadow-2xs">
                    {badge}
                  </span>
                </div>

                <div className="mt-6 inline-flex rounded-2xl bg-greenish-cream p-3.5 text-deep-teal transition-all group-hover:scale-105 group-hover:bg-pale-sage">
                  <Icon size={24} />
                </div>

                <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted mt-4">{tagline}</p>
                <h3 className="font-display text-2xl font-bold text-text-primary mt-1">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{description}</p>
              </div>

              <div className="mt-8 pt-5 border-t border-border-subtle">
                <Link
                  href={href}
                  className="link-editorial text-sm font-semibold text-deep-teal"
                >
                  <span>{cta}</span>
                  <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works / Journey Section */}
      <section className="relative z-10 mx-auto my-16 max-w-6xl py-8">
        <div className="mb-10 text-center">
          <p className="eyebrow text-deep-teal">02 / HOW IT WORKS</p>
          <h2 className="heading-xl mt-1 text-text-primary">
            A three-step continuum of continuous care
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-text-secondary">
            Built to maintain human connection without overwhelming survivors with bureaucratic paperwork.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {JOURNEY_STEPS.map(({ step, title, desc, icon: Icon }) => (
            <div key={title} className="relative rounded-3xl border border-border-color/60 bg-white/70 p-7 shadow-xs backdrop-blur-xs">
              <span className="text-xs font-bold uppercase tracking-widest text-deep-teal">{step}</span>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pale-sage/70 text-deep-teal">
                  <Icon size={20} />
                </div>
                <h3 className="font-display text-xl font-bold text-text-primary">{title}</h3>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-text-secondary sm:text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Editorial Principles & Framework Banner */}
      <section className="relative z-10 mx-auto my-12 max-w-6xl rounded-[32px] bg-[#14322d] p-8 text-white shadow-xl sm:p-12 md:p-16">
        <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end">
          <div>
            <span className="eyebrow text-pale-sage/80">03 / CORE PRINCIPLES</span>
            <h2 className="heading-xl mt-2 text-white">
              Built on empathy, grounded in statute.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-white/70">
            Technology should never feel cold or coercive. SAATH restores dignity by keeping the survivor in control at every touchpoint.
          </p>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map(({ num, title, desc, icon: Icon }) => (
            <div key={title} className="flex flex-col">
              <span className="font-editorial text-2xl italic text-pale-sage/60">{num}</span>
              <div className="mt-4 flex items-center gap-2.5 text-pale-sage">
                <Icon size={20} />
                <h3 className="font-sans-ui text-base font-semibold text-white">{title}</h3>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-white/70 sm:text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reassurance & Crisis Support Bar */}
      <section className="relative z-10 mx-auto max-w-6xl rounded-3xl border border-border-color/70 bg-white/80 p-6 shadow-sm backdrop-blur-xs sm:p-8">
        <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pale-sage/90 text-deep-teal shadow-xs">
              <PhoneCall size={22} />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary sm:text-base">
                Need immediate emergency assistance?
              </p>
              <p className="text-xs text-text-secondary">
                National toll-free helplines are available 24 hours a day with confidential responders.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="tel:112"
              className="rounded-full bg-deep-teal px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#0c625c]"
            >
              National Emergency: 112
            </a>
            <a
              href="tel:14566"
              className="rounded-full border border-border-color bg-white px-5 py-2.5 text-xs font-semibold text-deep-teal shadow-xs transition-colors hover:bg-pale-sage/30"
            >
              Tribal Support: 14566
            </a>
          </div>
        </div>
      </section>

      {/* Statutory Footer */}
      <footer className="relative z-10 mx-auto mt-16 max-w-6xl border-t border-border-color/60 pt-8 pb-12 text-xs text-text-muted">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-deep-teal" />
            <span>SAATH • Ministry of Social Justice and Empowerment Initiative</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/about" className="link-editorial hover:text-deep-teal">
              Privacy Charter
            </Link>
            <Link href="/about" className="link-editorial hover:text-deep-teal">
              Accessibility Statement
            </Link>
            <Link href="/staff-login" className="link-editorial hover:text-deep-teal">
              Authorized Personnel
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}