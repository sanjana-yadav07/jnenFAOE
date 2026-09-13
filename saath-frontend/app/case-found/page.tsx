"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ProgressDots } from "@/components/ui/ProgressDots";
import { caseService } from "@/services/case";
import { CaseRecord } from "@/types";
import { formatDate } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { CheckCircle2, FileText, ArrowLeft } from "lucide-react";
import { SaathLogo } from "@/components/SaathLogo";

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-baseline gap-4 py-3 border-b border-border-color/50 last:border-0">
      <span className="text-[13px] text-text-secondary shrink-0">{label}</span>
      <span className={`text-[14px] font-semibold text-right ${highlight ? "text-deep-teal" : "text-text-primary"}`}>{value}</span>
    </div>
  );
}

function CaseFoundInner() {
  const router = useRouter();
  const params = useSearchParams();
  const docket = params.get("docket") ?? "";
  const [caseRecord, setCaseRecord] = useState<CaseRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const setSurvivorSession = useAppStore((s) => s.setSurvivorSession);

  useEffect(() => {
    caseService.connectCase(docket).then(setCaseRecord).catch((reason: unknown) => {
      setError(reason instanceof Error ? reason.message : "Unable to load your case.");
    });
  }, [docket]);

  function handleConfirm() {
    if (!caseRecord) return;
    setSurvivorSession({
      victimToken: caseRecord.victimToken,
      docket: caseRecord.docket,
      survivorName: caseRecord.survivorName,
      caseRecord,
    });
    router.push("/consent");
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <p className="text-warm-peach text-center">{error}</p>
      </div>
    );
  }
  if (!caseRecord) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-text-secondary">
          <div className="h-8 w-8 rounded-full border-2 border-deep-teal border-t-transparent animate-spin" />
          <span className="text-sm">Loading case…</span>
        </div>
      </div>
    );
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
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#68c5b9] mb-3">Step 2 of 3</p>
          <h2 className="font-editorial text-[34px] xl:text-[40px] leading-[1.12] text-white mb-4">
            We found<br />
            <em className="font-normal not-italic text-[#68c5b9]">your case</em>
          </h2>
          <p className="text-[13.5px] text-[#9cc8bb] leading-[1.65] max-w-[340px]">
            Please review the details below and confirm this is your registered case before continuing.
          </p>

          <div className="mt-8 flex items-start gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#134e43] border border-[#2fa6a0]/30 text-[#68c5b9] shadow-2xs shrink-0 mt-0.5">
              <FileText size={13} className="text-[#81e6d9]" />
            </span>
            <span className="text-[13px] text-[#c2e2d9] leading-snug">Only you can see this information. It is never shared without your explicit consent.</span>
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
          <ProgressDots step={2} total={3} />

          <div className="mt-6 mb-6">
            <div className="flex items-center gap-2.5 mb-1.5">
              <CheckCircle2 size={20} className="text-deep-teal" />
              <h1 className="font-editorial text-[28px] xl:text-[34px] leading-[1.1] text-text-primary">
                Case found
              </h1>
            </div>
            <span className="inline-flex items-center rounded-full bg-warning-bg border border-amber/30 px-2.5 py-0.5 text-[10.5px] font-semibold text-amber uppercase tracking-[0.12em]">
              Synthetic NHAA Demo Data
            </span>
          </div>

          {/* Case detail card */}
          <div className="rounded-2xl border border-border-color bg-surface shadow-xs overflow-hidden">
            <div className="px-4 py-3 border-b border-border-color/60 bg-surface-subtle">
              <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-text-secondary">Case Details</p>
            </div>
            <div className="px-4 py-1.5 divide-y divide-border-color/40">
              <Row label="Docket" value={caseRecord.docket} highlight />
              <Row label="Registered" value={formatDate(caseRecord.registrationDate)} />
              <Row label="State" value={caseRecord.state} />
              <Row label="District" value={caseRecord.district} />
              <Row label="Case category" value={caseRecord.caseCategory} />
              <Row label="Current stage" value={caseRecord.currentStage} />
              <Row label="Preferred language" value={caseRecord.preferredLanguage} />
            </div>
          </div>

          <p className="mt-5 text-[13.5px] font-semibold text-text-primary text-center">Is this your registered case?</p>

          <div className="mt-3.5 space-y-2.5">
            <Button size="lg" className="w-full" onClick={handleConfirm}>
              Yes, continue
            </Button>
            <Button size="lg" variant="secondary" className="w-full" onClick={() => router.push("/connect-case")}>
              This is not my case
            </Button>
          </div>

          <div className="mt-7 pt-5 border-t border-border-color/50">
            <Link href="/connect-case" className="flex items-center gap-2 text-[12.5px] text-text-secondary hover:text-text-primary transition-colors w-fit">
              <ArrowLeft size={13} />
              Back to docket entry
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CaseFoundPage() {
  return (
    <Suspense fallback={null}>
      <CaseFoundInner />
    </Suspense>
  );
}
