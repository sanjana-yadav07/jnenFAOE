"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ProgressDots } from "@/components/ui/ProgressDots";
import { useAppStore } from "@/store/useAppStore";
import { apiRequest } from "@/lib/api";
import { ShieldCheck, Eye, ArrowLeft, CheckCheck } from "lucide-react";
import { SaathLogo } from "@/components/SaathLogo";

export default function ConsentPage() {
  const router = useRouter();
  const setConsent = useAppStore((s) => s.setConsent);
  const [monitoringConsent, setMonitoringConsent] = useState(false);
  const [voiceConsent, setVoiceConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    setError(null);
    setLoading(true);
    try {
      await apiRequest("/api/v1/consents", {
        method: "POST",
        body: JSON.stringify({ monitoring: monitoringConsent, voice: voiceConsent, text: monitoringConsent, behavioural: false, version: "1.0" }),
      });
      setConsent(monitoringConsent, voiceConsent);
      router.push("/survivor");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to save consent.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row saath-page-bg">
      {/* ── Left panel ── */}
      <aside className="hidden md:flex flex-col justify-between w-[44%] xl:w-[40%] min-h-screen bg-[#0d3a31] px-10 py-12 xl:px-14">
        <Link href="/landing" className="flex items-center gap-3 group w-fit">
          <SaathLogo className="h-8 w-auto transition-transform duration-200 group-hover:scale-105" size={32} />
          <div>
            <div className="font-editorial text-[26px] font-bold leading-none text-white tracking-tight">SAATH</div>
            <div className="mt-1 text-[9.5px] font-semibold uppercase tracking-[0.22em] text-[#9cc8bb]">with you, over time</div>
          </div>
        </Link>

        <div className="my-auto py-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#68c5b9] mb-3">Step 3 of 3</p>
          <h2 className="font-editorial text-[34px] xl:text-[40px] leading-[1.12] text-white mb-4">
            Before you<br />
            <em className="font-normal not-italic text-[#68c5b9]">continue</em>
          </h2>
          <p className="text-[13.5px] text-[#9cc8bb] leading-[1.65] max-w-[340px]">
            SAATH uses your data carefully and only with your consent. You are always in control and can change your settings at any time.
          </p>

          <div className="mt-8 space-y-3.5">
            {[
              { icon: ShieldCheck, text: "Your consent is required at every step" },
              { icon: Eye, text: "You can pause or withdraw at any time from Settings" },
              { icon: CheckCheck, text: "No data is shared without your explicit permission" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#134e43] border border-[#2fa6a0]/30 text-[#68c5b9] shadow-2xs shrink-0 mt-0.5">
                  <Icon size={13} className="text-[#81e6d9]" />
                </span>
                <span className="text-[13px] text-[#c2e2d9] leading-snug">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-[#4d7a71]/80">Prototype — synthetic demonstration data only.</p>
      </aside>

      {/* ── Right panel ── */}
      <div className="flex-1 flex flex-col justify-center px-6 py-10 md:px-12 xl:px-16 min-h-screen">
        {/* Mobile logo */}
        <div className="flex items-center gap-2 mb-6 md:hidden">
          <SaathLogo className="h-7 w-auto" size={28} />
          <span className="font-editorial text-[22px] font-bold text-deep-teal">SAATH</span>
        </div>

        <div className="w-full max-w-[440px] mx-auto md:mx-0">
          <ProgressDots step={3} total={3} />

          <div className="mt-6 mb-5">
            <h1 className="font-editorial text-[28px] xl:text-[34px] leading-[1.1] text-text-primary">
              Before you continue
            </h1>
            <p className="mt-2 text-[14px] text-text-secondary leading-relaxed">
              Please review how SAATH may use your information.
            </p>
          </div>

          {/* Consent summary card */}
          <div className="rounded-2xl border border-border-color bg-surface overflow-hidden shadow-xs">
            <div className="px-4 py-3 border-b border-border-color/60 bg-surface-subtle">
              <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-text-secondary">SAATH may use</p>
            </div>
            <div className="px-4 py-3 space-y-2">
              {["your registered case context", "your voluntary check-ins", "your optional voice/text signals", "engagement information"].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-deep-teal shrink-0" />
                  <span className="text-[12.5px] text-text-primary">{item}</span>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-border-color/60 bg-surface-subtle">
              <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-text-secondary mb-2">Purpose</p>
              <div className="space-y-2">
                {[
                  "understand changes in distress",
                  "support you over time",
                  "recommend appropriate support",
                  "notify authorised professionals when required, according to your consent and safety policy",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-sage shrink-0" />
                    <span className="text-[12.5px] text-text-primary">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="mt-4 space-y-2.5">
            <label className={`flex items-start gap-3 rounded-xl border px-3.5 py-3 cursor-pointer transition-all ${monitoringConsent ? "border-deep-teal bg-success-bg" : "border-border-color bg-surface"}`}>
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 shrink-0 accent-deep-teal"
                checked={monitoringConsent}
                onChange={(e) => setMonitoringConsent(e.target.checked)}
              />
              <div>
                <p className="text-[13px] font-semibold text-text-primary leading-snug">I understand and consent to monitoring.</p>
                <p className="mt-0.5 text-[11.5px] text-text-secondary">Required to use SAATH&apos;s support features.</p>
              </div>
            </label>

            <label className={`flex items-start gap-3 rounded-xl border px-3.5 py-3 cursor-pointer transition-all ${voiceConsent ? "border-deep-teal bg-success-bg" : "border-border-color bg-surface"}`}>
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 shrink-0 accent-deep-teal"
                checked={voiceConsent}
                onChange={(e) => setVoiceConsent(e.target.checked)}
              />
              <div>
                <p className="text-[13px] font-semibold text-text-primary leading-snug">I consent to optional voice-feature analysis.</p>
                <p className="mt-0.5 text-[11.5px] text-text-secondary">Optional — you can change this later in Settings.</p>
              </div>
            </label>
          </div>

          <div className="mt-3">
            <Link
              href="/privacy-notice"
              className="inline-flex items-center gap-1.5 text-[12.5px] text-deep-teal underline underline-offset-2 hover:no-underline transition-all"
            >
              <Eye size={12} />
              View Privacy Notice
            </Link>
          </div>

          {error && (
            <p role="alert" className="mt-3 text-sm text-warm-peach bg-error-bg rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <Button
            size="lg"
            className="w-full mt-4"
            disabled={!monitoringConsent || loading}
            onClick={handleContinue}
          >
            {loading ? "Saving…" : "Continue to SAATH"}
          </Button>

          <p className="mt-2.5 text-center text-[11.5px] text-text-secondary">
            You can pause or stop monitoring at any time from Settings.
          </p>

          <div className="mt-6 pt-4 border-t border-border-color/50">
            <Link href="/case-found" className="flex items-center gap-2 text-[12.5px] text-text-secondary hover:text-text-primary transition-colors w-fit">
              <ArrowLeft size={13} />
              Back to case confirmation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
