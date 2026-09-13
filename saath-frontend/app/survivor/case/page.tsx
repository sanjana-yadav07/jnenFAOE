"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Copy, ShieldCheck, HeartHandshake, Scale, HandCoins, Activity } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/store/useAppStore";
import { caseService } from "@/services/case";
import { CaseRecord } from "@/types";
import { formatDate } from "@/lib/utils";

const STAGES = [
  { id: "Registered", label: "Registered", description: "Your case has been formally recorded." },
  { id: "Investigation", label: "Being looked into", description: "Authorities are actively working on your case." },
  { id: "Trial", label: "Legal proceedings", description: "Your case is moving through the court process." },
  { id: "Compensation", label: "Relief & support", description: "Financial relief and welfare entitlements are being processed." },
  { id: "Rehabilitation", label: "Rebuilding", description: "Support for your future — housing, livelihood, and wellbeing." },
];

export default function MyCasePage() {
  const { victimToken, currentCase, monitoring, setMonitoring } = useAppStore();
  const [caseRecord, setCaseRecord] = useState<CaseRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!victimToken) {
      if (currentCase) setCaseRecord(currentCase);
      setLoading(false);
      setError(currentCase ? null : "Connect your case to view its details.");
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    caseService.getCase(victimToken)
      .then((record) => {
        if (cancelled) return;
        if (!record) {
          setCaseRecord(currentCase);
          setError("We could not load your case details. Please try again.");
          return;
        }
        setCaseRecord(record);
      })
      .catch(() => {
        if (!cancelled) {
          setCaseRecord(currentCase);
          setError("We could not load your case details. Please try again.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [currentCase, victimToken]);

  if (loading) return <div className="px-6 py-8 text-text-secondary">Loading your case…</div>;
  if (!caseRecord) return <div className="px-6 py-8 text-text-secondary">{error}</div>;

  const stageIndex = STAGES.findIndex(s => s.id === caseRecord.currentStage);
  const effectiveStageIndex = stageIndex === -1 ? 0 : stageIndex;

  const counsellorName =
    caseRecord.assignedCounsellor?.name ||
    (caseRecord.counsellorAssigned &&
      caseRecord.counsellorAssigned !== "Not assigned" &&
      caseRecord.counsellorAssigned !== "true" &&
      caseRecord.counsellorAssigned !== "false"
      ? caseRecord.counsellorAssigned
      : null);

  /* Determine what good things are happening */
  const positivePoints: string[] = [];
  if (caseRecord.firStatus && caseRecord.firStatus.toLowerCase() !== "not registered")
    positivePoints.push("Your complaint has been formally registered with the police.");
  if (caseRecord.investigationStatus)
    positivePoints.push("An investigation is underway on your behalf.");
  if (caseRecord.legalAidStatus && caseRecord.legalAidStatus.toLowerCase() !== "not assigned")
    positivePoints.push("Legal aid has been arranged for you.");
  if (caseRecord.financialReliefEligible)
    positivePoints.push("You may be eligible for financial relief and welfare support.");
  if (counsellorName)
    positivePoints.push(`${counsellorName} is your assigned counsellor and is here for you.`);
  if (caseRecord.protectionStatus && caseRecord.protectionStatus.toLowerCase() !== "not requested")
    positivePoints.push("Protection measures have been requested for your safety.");
  if (positivePoints.length === 0)
    positivePoints.push("Your case is being handled with care. Support is being arranged.");

  return (
    <div className="px-5 pb-10 md:px-10 xl:px-14 space-y-6">
      <Link href="/survivor/my-space" className="inline-flex items-center gap-2 text-sm font-semibold text-[#75857f]">
        <ArrowLeft size={16} /> My space
      </Link>

      <CaseHeader caseRecord={caseRecord} />

      {/* ── What's happening ── */}
      <Card className="!p-6 border-l-4 border-l-deep-teal">
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-deep-teal" />
          What's being done for you
        </CardTitle>
        <p className="mt-2 text-sm text-text-secondary leading-relaxed">
          You don't need to navigate this alone. Here is what's actively being handled on your behalf.
        </p>
        <ul className="mt-4 space-y-2.5">
          {positivePoints.map((point, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-text-primary">
              <Check size={15} className="mt-0.5 shrink-0 text-deep-teal" />
              {point}
            </li>
          ))}
        </ul>
      </Card>

      {/* ── Case Journey ── */}
      <Card className="!p-6">
        <CardTitle>Your case journey</CardTitle>
        <p className="mt-1 text-xs text-text-secondary">
          Cases move through stages. Each step means progress.
        </p>
        <div className="mt-6 flex items-start overflow-x-auto pb-2">
          {STAGES.map((stage, i) => (
            <div key={stage.id} className={`flex ${i < STAGES.length - 1 ? "flex-1 min-w-[110px]" : ""}`}>
              <div className="flex flex-col items-center text-center w-28 shrink-0">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    i < effectiveStageIndex
                      ? "bg-deep-teal text-white"
                      : i === effectiveStageIndex
                      ? "bg-amber text-white ring-4 ring-amber/20"
                      : "bg-pale-sage/60 text-text-secondary"
                  }`}
                >
                  {i < effectiveStageIndex ? <Check size={15} /> : i + 1}
                </div>
                <p className={`mt-2 text-xs leading-tight ${i === effectiveStageIndex ? "font-semibold text-text-primary" : "text-text-secondary"}`}>
                  {stage.label}
                </p>
                {i === effectiveStageIndex && (
                  <p className="mt-1 text-[11px] text-amber font-medium">Current</p>
                )}
              </div>
              {i < STAGES.length - 1 && (
                <div className={`mt-4 h-px flex-1 min-w-[24px] ${i < effectiveStageIndex ? "bg-deep-teal" : "bg-border-color"}`} />
              )}
            </div>
          ))}
        </div>
        {STAGES[effectiveStageIndex] && (
          <p className="mt-5 rounded-xl bg-pale-sage/40 px-4 py-3 text-sm text-text-secondary leading-relaxed">
            <span className="font-semibold text-text-primary">{STAGES[effectiveStageIndex].label}:</span>{" "}
            {STAGES[effectiveStageIndex].description}
          </p>
        )}
      </Card>

      {/* ── Your Support ── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Counsellor */}
        <Card className="!p-6">
          <CardTitle className="flex items-center gap-2">
            <HeartHandshake size={16} className="text-deep-teal" /> Your counsellor
          </CardTitle>
          <p className="mt-3 text-sm font-semibold text-text-primary">
            {counsellorName ?? "Being arranged for you"}
          </p>
          <p className="mt-1.5 text-xs text-text-secondary leading-relaxed">
            {counsellorName
              ? `${counsellorName} is here to listen and support you. You can reach out through the support section whenever you feel ready.`
              : "A counsellor is being allocated for your case. They will be here for you soon."}
          </p>
          <div className="mt-4">
            <Link
              href="/survivor/support/counsellor"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-deep-teal hover:underline"
            >
              Go to counsellor support →
            </Link>
          </div>
        </Card>

        {/* Legal Aid */}
        <Card className="!p-6">
          <CardTitle className="flex items-center gap-2">
            <Scale size={16} className="text-deep-teal" /> Legal support
          </CardTitle>
          <p className="mt-3 text-sm font-semibold text-text-primary capitalize">
            {caseRecord.legalAidStatus ? caseRecord.legalAidStatus : "Being arranged"}
          </p>
          <p className="mt-1.5 text-xs text-text-secondary leading-relaxed">
            You are entitled to free legal aid. A legal aid representative ensures your rights are protected throughout the process.
          </p>
          <div className="mt-4">
            <Link
              href="/survivor/rights"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-deep-teal hover:underline"
            >
              Know your rights →
            </Link>
          </div>
        </Card>

        {/* Compensation */}
        <Card className="!p-6">
          <CardTitle className="flex items-center gap-2">
            <HandCoins size={16} className="text-deep-teal" /> Financial relief
          </CardTitle>
          <p className="mt-3 text-sm font-semibold text-text-primary capitalize">
            {caseRecord.compensationStatus
              ? caseRecord.compensationStatus
              : "Eligibility is being assessed"}
          </p>
          {(caseRecord.compensationAmountReceived && Number(caseRecord.compensationAmountReceived) > 0) ? (
            <p className="mt-1.5 text-xs text-text-secondary leading-relaxed">
              Relief has been disbursed to you. Contact your counsellor if you need further assistance.
            </p>
          ) : (
            <p className="mt-1.5 text-xs text-text-secondary leading-relaxed">
              Financial relief under PoA schemes is being processed. Your counsellor can help you follow up if needed.
            </p>
          )}
        </Card>

        {/* Well-being */}
        <Card className="!p-6">
          <CardTitle className="flex items-center gap-2">
            <Activity size={16} className="text-deep-teal" /> Your well-being check-ins
          </CardTitle>
          <p className="mt-3 text-sm text-text-secondary leading-relaxed">
            Current monitoring: <span className="font-medium text-text-primary capitalize">{monitoring}</span>
          </p>
          <p className="mt-1.5 text-xs text-text-secondary">
            No pressure. You remain in control. Support stays available even if you pause or stop.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {monitoring !== "active" && (
              <Button size="sm" onClick={() => setMonitoring("active")}>Resume check-ins</Button>
            )}
            {monitoring === "active" && (
              <Button size="sm" variant="secondary" onClick={() => setMonitoring("paused")}>Pause for now</Button>
            )}
            {monitoring !== "stopped" && (
              <Button size="sm" variant="danger" onClick={() => setMonitoring("stopped")}>Stop check-ins</Button>
            )}
          </div>
        </Card>
      </div>

      {/* ── Reassurance Footer ── */}
      <div className="rounded-2xl bg-pale-sage/30 border border-deep-teal/20 px-6 py-5 text-sm text-text-secondary leading-relaxed">
        <p className="font-semibold text-text-primary mb-1">You are not alone in this.</p>
        SAATH is here to ensure your case is being handled, your rights are protected, and support is always close. You don't need to face this by yourself.
      </div>
    </div>
  );
}

function CaseHeader({ caseRecord }: { caseRecord: CaseRecord }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(caseRecord.docket);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access can fail silently; the docket is still visible on screen.
    }
  };

  /* Show the current stage in human language, not "Investigation" */
  const stageLabels: Record<string, string> = {
    Registered: "Registered",
    Investigation: "Being investigated",
    Trial: "In legal proceedings",
    Compensation: "Relief being processed",
    Rehabilitation: "Rehabilitation stage",
  };
  const humanStage = stageLabels[caseRecord.currentStage ?? ""] ?? caseRecord.currentStage;

  return (
    <div className="saath-fade">
      <p className="text-xs font-bold uppercase tracking-[.2em] text-[#7e918b]">My space</p>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-4xl leading-none text-[#172326] md:text-5xl">My Case</h1>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-2 rounded-full border border-border-color bg-white/80 px-3.5 py-2 font-mono text-sm text-text-secondary hover:border-deep-teal hover:text-deep-teal"
          title="Copy case reference"
        >
          {caseRecord.docket}
          {copied ? <Check size={14} className="text-deep-teal" /> : <Copy size={14} />}
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {/* Show location context only — no risk labels */}
        {caseRecord.district && <Badge tone="teal">{caseRecord.district}, {caseRecord.state}</Badge>}
        {humanStage && <Badge tone="neutral">{humanStage}</Badge>}
        {/* No "Risk: HIGH" badge here — that is for counsellors only */}
      </div>
    </div>
  );
}