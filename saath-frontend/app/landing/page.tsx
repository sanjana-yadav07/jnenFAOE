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
} from "lucide-react";

const PORTALS = [
  {
    num: "01",
    label: "For survivors",
    badge: "Direct Support",
    title: "A calm, private space to check in and heal.",
    description:
      "A trauma-informed sanctuary to track your well-being, request counsellor calls, and access community resources at your own pace.",
    cta: "Continue as survivor",
    href: "/welcome",
    icon: HeartHandshake,
    accent: "border-deep-teal/20 hover:border-deep-teal/40",
  },
  {
    num: "02",
    label: "For counsellors",
    badge: "Clinical Care",
    title: "Actionable, prioritised insight into every case.",
    description:
      "Stay connected to the people you support. View flagged check-ins, caseload allocation, and response trends in real time.",
    cta: "Counsellor sign in",
    href: "/staff-login",
    icon: Users,
    accent: "border-calm-blue/25 hover:border-calm-blue/50",
  },
  {
    num: "03",
    label: "For administrators",
    badge: "Governance",
    title: "Aggregated, anonymised decision intelligence.",
    description:
      "Statutory oversight across districts. Monitor resolution metrics, compliance timelines, and welfare allocation transparently.",
    cta: "Admin sign in",
    href: "/staff-login",
    icon: LineChart,
    accent: "border-muted-plum/25 hover:border-muted-plum/50",
  },
];

const PILLARS = [
  {
    num: "01",
    title: "Radical consent & privacy",
    desc: "No forced logins or surveillance. You decide what to share, when to share it, and who receives your check-in updates.",
    icon: Lock,
  },
  {
    num: "02",
    title: "Compassionate, human cadence",
    desc: "Micro-interactions crafted to soothe rather than overwhelm. Low cognitive friction designed specifically for trauma recovery.",
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
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_90%_0%,rgba(220,235,221,.75),transparent_40%),radial-gradient(circle_at_10%_80%,rgba(255,249,240,.9),transparent_40%),var(--warm-cream)] px-5 py-6 sm:px-8 md:px-12 lg:px-20">
      {/* Background Watermark Art */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-5%] top-[12%] select-none font-display text-[18vw] font-bold leading-none text-deep-teal/[0.025] blur-[1px]"
      >
        SAATH
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-4%] bottom-[18%] select-none font-display text-[16vw] font-bold leading-none text-deep-teal/[0.02] blur-[1px]"
      >
        CARE
      </div>

      {/* Header / Nav */}
      <header className="relative z-10 mx-auto max-w-6xl">
        <nav className="flex items-center justify-between py-4" aria-label="Main Navigation">
          <div className="flex items-center gap-3">
            <span className="text-xl text-amber" aria-hidden>
              ✦
            </span>
            <span className="font-display text-2xl font-bold tracking-tight text-deep-teal sm:text-3xl">
              SAATH
            </span>
            <span className="hidden h-4 w-px bg-border-color/60 sm:inline" />
            <span className="hidden text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted sm:inline">
              Support with dignity
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/about"
              className="link-editorial text-sm font-medium text-text-secondary hover:text-deep-teal"
            >
              About the initiative
            </Link>
            <Link
              href="/staff-login"
              className="group inline-flex items-center gap-2 rounded-full border border-border-color/80 bg-white/80 px-4 py-2 text-xs font-semibold tracking-wide text-text-primary shadow-xs transition-all hover:border-deep-teal/40 hover:bg-white hover:text-deep-teal sm:text-sm sm:px-5 sm:py-2.5"
            >
              <KeyRound size={14} className="text-deep-teal transition-transform group-hover:scale-110" />
              <span>Staff sign in</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-5xl pt-16 pb-20 text-center sm:pt-24 sm:pb-28">
        <div className="inline-flex items-center gap-2 rounded-full border border-deep-teal/15 bg-pale-sage/60 px-4 py-1.5 backdrop-blur-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-deep-teal animate-pulse" />
          <span className="eyebrow text-deep-teal">SUPPORTIVE MONITORING, BY CONSENT</span>
        </div>

        <h1 className="mx-auto mt-8 max-w-4xl display-xl text-text-primary">
          You don&apos;t have to{" "}
          <span className="editorial-italic block sm:inline">carry it alone.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg">
          SAATH walks with survivors of atrocities with quiet compassion, radical privacy, and institutional care.{" "}
          <strong className="font-semibold text-text-primary">Notice your feelings, request support when you are ready, and move at your own pace.</strong>
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/welcome"
            className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-deep-teal px-8 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#0c625c] hover:shadow-lg sm:w-auto"
          >
            <span>Get started</span>
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/about"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border-color/80 bg-white/70 px-7 py-3.5 text-sm font-semibold text-deep-teal backdrop-blur-xs transition-all hover:border-deep-teal/30 hover:bg-white sm:w-auto"
          >
            Learn how it works
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-text-muted sm:gap-8">
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-deep-teal" /> 100% confidential & encrypted
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-deep-teal" /> No mandatory reporting
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-deep-teal" /> 24/7 emergency assistance
          </span>
        </div>
      </section>

      {/* Portals Section */}
      <section className="relative z-10 mx-auto max-w-6xl py-12">
        <div className="mb-8 flex flex-col justify-between gap-3 border-b border-border-color/60 pb-5 sm:flex-row sm:items-end">
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
          {PORTALS.map(({ num, label, badge, title, description, cta, href, icon: Icon, accent }) => (
            <div
              key={label}
              className={`group flex flex-col justify-between rounded-3xl border bg-white/80 p-7 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${accent}`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-editorial text-xl italic text-deep-teal/60">{num}</span>
                  <span className="rounded-full bg-pale-sage/60 px-3 py-1 text-[11px] font-semibold text-deep-teal">
                    {badge}
                  </span>
                </div>

                <div className="mt-6 inline-flex rounded-2xl bg-greenish-cream p-3 text-deep-teal transition-colors group-hover:bg-pale-sage/80">
                  <Icon size={22} />
                </div>

                <h3 className="heading-lg mt-4 text-text-primary">{title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-text-secondary">{description}</p>
              </div>

              <div className="mt-8 pt-4 border-t border-border-subtle">
                <Link
                  href={href}
                  className="link-editorial text-sm font-semibold text-deep-teal group-hover:text-deep-teal"
                >
                  <span>{cta}</span>
                  <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Editorial Principles & Framework */}
      <section className="relative z-10 mx-auto my-12 max-w-6xl rounded-[32px] bg-[#14322d] p-8 text-white shadow-xl sm:p-12 md:p-16">
        <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end">
          <div>
            <span className="eyebrow text-pale-sage/80">02 / CORE PRINCIPLES</span>
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
              <span className="font-editorial text-xl italic text-pale-sage/60">{num}</span>
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
      <section className="relative z-10 mx-auto max-w-6xl rounded-3xl border border-border-color/70 bg-white/70 p-6 backdrop-blur-xs sm:p-8">
        <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <div className="flex items-center gap-3.5">
            <div className="rounded-full bg-pale-sage/80 p-2.5 text-deep-teal">
              <PhoneCall size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">
                Need immediate emergency assistance?
              </p>
              <p className="text-xs text-text-secondary">
                National toll-free helplines are available 24 hours a day with confidential responders.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="tel:112"
              className="rounded-full bg-deep-teal px-5 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#0c625c]"
            >
              National Helpline: 112
            </a>
            <a
              href="tel:14566"
              className="rounded-full border border-border-color bg-white px-5 py-2 text-xs font-semibold text-deep-teal shadow-xs transition-colors hover:bg-pale-sage/30"
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