"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ProgressDots } from "@/components/ui/ProgressDots";
import { caseService } from "@/services/case";
import { ShieldCheck, Lock, ArrowLeft } from "lucide-react";
import { SaathLogo } from "@/components/SaathLogo";

export default function ConnectCasePage() {
  const router = useRouter();
  const [docket, setDocket] = useState("NHAA-RJ-2026-004821");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await caseService.verifyDocket(docket);
    setLoading(false);
    if (!result.ok) {
      setError(result.message ?? "Unable to verify this docket reference.");
      return;
    }
    router.push(`/case-found?docket=${encodeURIComponent(docket)}`);
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
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#68c5b9] mb-3">Step 1 of 3</p>
          <h2 className="font-editorial text-[34px] xl:text-[40px] leading-[1.12] text-white mb-4">
            Connect your<br />
            <em className="font-normal not-italic text-[#68c5b9]">registered case</em>
          </h2>
          <p className="text-[13.5px] text-[#9cc8bb] leading-[1.65] max-w-[340px]">
            SAATH links to your official NHAA case record to provide personalised, continuous support — privately and securely.
          </p>
          <div className="mt-8 space-y-3.5">
            {[
              { icon: ShieldCheck, text: "No real government systems are accessed" },
              { icon: Lock, text: "Your data is encrypted and consent-first" },
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
          <ProgressDots step={1} total={3} />

          <div className="mt-6 mb-6">
            <h1 className="font-editorial text-[28px] xl:text-[34px] leading-[1.1] text-text-primary">
              Connect your case
            </h1>
            <p className="mt-2 text-[14px] text-text-secondary leading-relaxed">
              Enter your NHAA docket or reference number to verify your case.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-text-secondary mb-1.5 uppercase tracking-[0.14em]" htmlFor="docket">
                NHAA Docket / Reference Number
              </label>
              <Input
                id="docket"
                value={docket}
                onChange={(e) => setDocket(e.target.value)}
                placeholder="NHAA-XX-YYYY-NNNNNN"
                required
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-warm-peach bg-error-bg rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <div className="flex items-start gap-2.5 rounded-xl bg-surface-subtle border border-border-color/60 px-3.5 py-3">
              <ShieldCheck size={14} className="text-deep-teal mt-0.5 shrink-0" />
              <p className="text-[11.5px] text-text-secondary leading-relaxed">
                Your case information will be fetched securely after verification. This demo uses a synthetic NHAA case registry — no real government systems are accessed.
              </p>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Verifying…" : "Verify my case"}
            </Button>
          </form>

          <p className="mt-4 text-[12px] text-center text-text-secondary">
            Try docket{" "}
            <button
              type="button"
              className="font-mono text-deep-teal underline underline-offset-2 hover:no-underline transition-all"
              onClick={() => setDocket("NHAA-RJ-2026-004821")}
            >
              NHAA-RJ-2026-004821
            </button>{" "}
            for this demo.
          </p>

          <div className="mt-8 pt-5 border-t border-border-color/50">
            <Link href="/landing" className="flex items-center gap-2 text-[12.5px] text-text-secondary hover:text-text-primary transition-colors w-fit">
              <ArrowLeft size={13} />
              Back to landing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
