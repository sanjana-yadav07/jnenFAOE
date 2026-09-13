"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  FileQuestion,
  FileText,
  HandCoins,
  HeartHandshake,
  HelpCircle,
  Info,
  Layers,
  MessageSquare,
  PhoneCall,
  RefreshCw,
  Scale,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAppStore } from "@/store/useAppStore";
import { aiService } from "@/services/ai";

export default function KnowYourRightsPage() {
  const { language, currentCase, survivorName, docket } = useAppStore();
  const hindi = language === "Hindi";

  const [legalData, setLegalData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any>(null);
  const [searching, setSearching] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const loadData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const caseId = currentCase?.id || docket || undefined;
      const data = await aiService.getLegalContent(caseId, hindi ? "hi" : "en");
      setLegalData(data);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentCase, docket, hindi]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    setSearching(true);
    try {
      const caseId = currentCase?.id || docket || undefined;
      const res = await aiService.queryLegal(searchQuery.trim(), caseId);
      setSearchResults(res);
    } catch {
      setSearchResults(null);
    } finally {
      setSearching(false);
    }
  };

  const context = legalData?.contextSummary;
  const activeStage = legalData?.activeStageGuide;

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-5 pb-16 md:px-8 xl:px-10">
      {/* Header */}
      <div>
        <Link
          href="/survivor"
          className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-deep-teal transition-colors"
        >
          <ArrowLeft size={16} /> {hindi ? "होम" : "Home"}
        </Link>

        <div className="mt-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-deep-teal">
                {hindi ? "कानूनी सहायता एवं अधिकार" : "Legal & Rights Module"}
              </span>
              <span className="rounded-full bg-pale-sage/80 px-2.5 py-0.5 text-[10px] font-bold text-deep-teal">
                {hindi ? "सत्यापित स्रोत" : "Authoritative Sources"}
              </span>
            </div>
            <h1 className="mt-1 font-editorial text-3xl font-bold tracking-tight text-text-primary md:text-5xl">
              {hindi ? "अपने कानूनी अधिकार समझें" : "Know Your Rights"}
            </h1>
            <p className="mt-2 text-base text-text-secondary max-w-2xl leading-relaxed">
              {hindi
                ? "सरल भाषा में आपके कानूनी अधिकार, निःशुल्क विधिक सहायता (NALSA/DLSA), सुरक्षा प्रावधान और आधिकारिक सरकारी स्रोतों की सत्यापित जानकारी।"
                : "Trauma-informed guidance on applicable laws, free legal aid (NALSA/DLSA), victim protections, and official government resources in plain language."}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button size="sm" variant="secondary" onClick={() => loadData(true)} disabled={loading || refreshing}>
              <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} /> {hindi ? "रिफ्रेश" : "Refresh"}
            </Button>
          </div>
        </div>
      </div>

      {/* Official Disclaimer Banner */}
      <div className="rounded-2xl border border-border-color/70 bg-(--surface-subtle) p-4 text-xs text-text-secondary leading-relaxed flex items-start gap-3 shadow-xs">
        <Info size={18} className="text-deep-teal shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-text-primary">
            {hindi ? "शैक्षणिक एवं सहायता सूचना" : "Educational & Supportive Information Notice"}
          </p>
          <p className="mt-0.5">
            {legalData?.disclaimer ||
              "This information is for general awareness and supportive guidance sourced from official portals (India Code, NALSA, DoSJE). It is not a substitute for legal advice from an authorized legal professional."}
          </p>
        </div>
      </div>

      {/* Active Case Context Banner */}
      {context && (
        <Card className="p-5 border-l-4 border-l-deep-teal bg-(--surface)">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-deep-teal">
                {hindi ? "सक्रिय केस संदर्भ (Active Case Context)" : "Active Case Contextualisation"}
              </p>
              <p className="mt-1 text-base font-bold text-text-primary">
                {context.caseCategory || "General Case"} &middot; {context.currentStage || "Investigation"}
              </p>
              <p className="text-xs text-text-secondary mt-0.5">
                {context.district ? `${context.district}, ` : ""}{context.state || "National"} &middot; {hindi ? "डॉकेट" : "Docket"}: {context.activeDocket || docket || "Connected"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {context.legalAidAssigned ? (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                  ✦ {hindi ? "विधिक सहायता निर्दिष्ट" : "Legal Aid Assigned"}
                </span>
              ) : (
                <span className="rounded-full bg-pale-sage px-3 py-1 text-xs font-bold text-deep-teal border border-border-color/60">
                  ✦ {hindi ? "निःशुल्क विधिक सहायता हेतु पात्र" : "Eligible for Free Legal Aid"}
                </span>
              )}
              {context.protectionStatus && (
                <span className="rounded-full bg-amber/10 px-3 py-1 text-xs font-bold text-[#b67926] border border-amber/30">
                  ✦ {hindi ? "सुरक्षा" : "Protection"}: {context.protectionStatus}
                </span>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Search Legal Knowledge Base */}
      <Card className="p-5">
        <form onSubmit={handleSearch} className="space-y-3">
          <div className="flex items-center gap-2">
            <Search size={17} className="text-deep-teal" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-text-primary">
              {hindi ? "कानूनी प्रश्न पूछें या अधिकार खोजें" : "Ask a Legal or Rights Question"}
            </h2>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                hindi
                  ? "उदा. क्या मुझे मुफ़्त वकील मिल सकता है? मुझे सुरक्षा कैसे मिलेगी?"
                  : "e.g., Can I get free legal aid? What is Section 15A? What happens next?"
              }
              className="flex-1 rounded-xl border border-border-color bg-white px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/70 focus:border-deep-teal focus:outline-none"
            />
            <Button type="submit" disabled={searching || !searchQuery.trim()} className="shrink-0">
              {searching ? (hindi ? "खोज रहे हैं..." : "Searching...") : (hindi ? "सत्यापित उत्तर खोजें" : "Search Verified Base")}
            </Button>
          </div>
        </form>

        {/* Search Results Display */}
        {searchResults && (
          <div className="mt-4 rounded-xl border border-border-color/80 bg-(--surface-subtle) p-4 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-deep-teal">
              {hindi ? "सत्यापित ज्ञानकोष परिणाम" : "Verified Knowledge Base Match"}
            </p>
            {searchResults.matchedFaq && (
              <div>
                <p className="text-sm font-bold text-text-primary">{searchResults.matchedFaq.question}</p>
                <p className="mt-1 text-xs text-text-secondary leading-relaxed">{searchResults.matchedFaq.answer}</p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-text-secondary">
                  <span><strong>{hindi ? "स्रोत" : "Source"}:</strong> {searchResults.matchedFaq.official_source}</span>
                  <a
                    href={searchResults.matchedFaq.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-deep-teal hover:underline"
                  >
                    {hindi ? "आधिकारिक पोर्टल" : "Official Source"} <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            )}
            {searchResults.matchedAct && (
              <div className="border-t border-border-color/60 pt-3">
                <p className="text-sm font-bold text-text-primary">{searchResults.matchedAct.title}</p>
                <p className="mt-1 text-xs text-text-secondary leading-relaxed">{searchResults.matchedAct.plain_language_summary}</p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-text-secondary">
                  <span><strong>{hindi ? "स्रोत" : "Source"}:</strong> {searchResults.matchedAct.official_source_name}</span>
                  <a
                    href={searchResults.matchedAct.official_source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-deep-teal hover:underline"
                  >
                    India Code <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            )}
            <div className="border-t border-border-color/60 pt-2 flex items-center justify-between">
              <span className="text-[10px] text-text-secondary">Verified through SAATH Legal Standards Registry</span>
              <button
                type="button"
                onClick={() => setSearchResults(null)}
                className="text-[11px] font-semibold text-text-secondary hover:underline"
              >
                {hindi ? "बंद करें" : "Dismiss"}
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* 1. Verified Applicable Laws Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e5eef5] text-[#2c6e91]">
              <Scale size={18} />
            </span>
            <div>
              <h2 className="text-lg font-bold text-text-primary">
                {hindi ? "आपके मामले से संबंधित महत्वपूर्ण कानून" : "Applicable Laws & Statutory Framework"}
              </h2>
              <p className="text-xs text-text-secondary">
                {hindi ? "सत्यापित केंद्रीय एवं राज्य विधान (India Code)" : "Prioritised based on your active case type"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {(legalData?.relevantActs || []).map((act: any) => (
            <Card key={act.id} className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sm text-text-primary">{act.title}</h3>
                  <span className="rounded-full bg-pale-sage px-2 py-0.5 text-[10px] font-bold text-deep-teal shrink-0">
                    {act.content_type}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                  {act.plain_language_summary}
                </p>

                {act.key_provisions && act.key_provisions.length > 0 && (
                  <div className="mt-3 space-y-1.5 rounded-xl bg-(--surface-subtle) p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                      {hindi ? "मुख्य प्रावधान" : "Key Provisions"}
                    </p>
                    {act.key_provisions.map((p: any) => (
                      <div key={p.section} className="text-xs">
                        <span className="font-semibold text-deep-teal">{p.section} ({p.title}): </span>
                        <span className="text-text-secondary">{p.summary}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 border-t border-border-color/50 pt-3 flex items-center justify-between text-xs">
                <span className="text-[11px] text-text-secondary truncate max-w-[200px]">
                  {act.official_source_name}
                </span>
                <a
                  href={act.official_source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-deep-teal hover:underline shrink-0"
                >
                  {hindi ? "कानून पढ़ें (India Code)" : "Read Full Act"} <ExternalLink size={12} />
                </a>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 2. Your Guaranteed Rights Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e5f2ec] text-deep-teal">
            <ShieldCheck size={18} />
          </span>
          <div>
            <h2 className="text-lg font-bold text-text-primary">
              {hindi ? "पीड़ित / गवाह के रूप में आपके अधिकार" : "Your Rights as a Victim / Survivor"}
            </h2>
            <p className="text-xs text-text-secondary">
              {hindi ? "कानून द्वारा प्रदत्त सुरक्षा, गरिमा और सहायता के अधिकार" : "Statutory rights under Indian legal frameworks"}
            </p>
          </div>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {(legalData?.applicableRights || []).map((right: any) => (
            <div
              key={right.id}
              className="rounded-2xl border border-border-color/80 bg-white/80 p-4.5 flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-deep-teal text-white text-xs font-bold">
                    ✓
                  </span>
                  <h3 className="font-bold text-sm text-text-primary">{right.title}</h3>
                </div>
                <p className="mt-2 text-xs font-medium text-text-primary leading-snug">{right.summary}</p>
                <p className="mt-1.5 text-xs text-text-secondary leading-relaxed">{right.details}</p>
              </div>

              <div className="mt-4 border-t border-border-color/50 pt-2.5 flex items-center justify-between text-[11px]">
                <span className="text-text-secondary truncate max-w-[170px]">{right.source}</span>
                <a
                  href={right.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-deep-teal hover:underline shrink-0 inline-flex items-center gap-0.5"
                >
                  Verify <ExternalLink size={10} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Free Legal Aid & NALSA Section */}
      {legalData?.legalAidFramework && (
        <Card className="p-6 bg-gradient-to-br from-white to-(--surface-subtle)">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-deep-teal/10 px-2.5 py-0.5 text-xs font-bold text-deep-teal">
                  NALSA · Section 12
                </span>
                <span className="text-xs font-semibold text-text-secondary">Free Legal Aid</span>
              </div>
              <h2 className="text-xl font-bold text-text-primary">
                {hindi ? "निःशुल्क विधिक सहायता (Free Legal Aid)" : "Free Legal Representation & Aid"}
              </h2>
              <p className="text-xs text-text-secondary max-w-2xl leading-relaxed">
                {legalData.legalAidFramework.eligibility_summary}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <a
                href={`tel:${legalData.legalAidFramework.helpline_national}`}
                className="inline-flex items-center gap-2 rounded-xl bg-deep-teal px-4 py-2.5 text-xs font-bold text-white hover:bg-deep-teal/90 shadow-sm transition-all"
              >
                <PhoneCall size={14} /> Call Helpline {legalData.legalAidFramework.helpline_national}
              </a>
              <a
                href={legalData.legalAidFramework.online_application_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border-color bg-white px-3.5 py-2.5 text-xs font-bold text-text-primary hover:border-deep-teal hover:text-deep-teal transition-all"
              >
                NALSA Portal <ExternalLink size={13} />
              </a>
            </div>
          </div>

          <div className="mt-5 grid gap-2.5 sm:grid-cols-2 rounded-xl bg-white/70 p-4 border border-border-color/60">
            {legalData.legalAidFramework.services_covered.map((srv: string, i: number) => (
              <div key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                <CheckCircle2 size={14} className="text-[#16a34a] shrink-0 mt-0.5" />
                <span>{srv}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 4. Process Guide by Active Stage */}
      {activeStage && (
        <Card className="p-6">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f2ecd9] text-[#a47730]">
              <Layers size={18} />
            </span>
            <div>
              <h2 className="text-lg font-bold text-text-primary">
                {hindi ? `केस प्रक्रिया मार्गदर्शिका: ${activeStage.stage}` : `Process Guide: ${activeStage.stage} Stage`}
              </h2>
              <p className="text-xs text-text-secondary">
                {hindi ? "इस चरण में क्या होता है और आपके क्या अधिकार हैं" : "What happens in this stage and relevant rights"}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border-color/70 bg-(--surface-subtle) p-4">
            <p className="text-sm font-semibold text-text-primary">{activeStage.title}</p>
            <p className="mt-1 text-xs text-text-secondary leading-relaxed">{activeStage.general_overview}</p>

            <div className="mt-4 space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-deep-teal">
                {hindi ? "इस चरण में मुख्य अधिकार" : "Key Rights in this Stage"}
              </p>
              {activeStage.key_rights.map((r: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-text-secondary">
                  <span className="text-deep-teal font-bold">•</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-border-color/50 pt-3">
              <p className="text-xs text-text-secondary">
                <strong>{hindi ? "अगला संभावित कदम" : "Typical Next Steps"}:</strong> {activeStage.next_steps_overview}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* 5. Verified Official Helplines & Authorities */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fdf2e9] text-[#c96c2e]">
            <PhoneCall size={18} />
          </span>
          <div>
            <h2 className="text-lg font-bold text-text-primary">
              {hindi ? "सत्यापित आधिकारिक हेल्पलाइन एवं संपर्क" : "Verified Official Helplines & Portals"}
            </h2>
            <p className="text-xs text-text-secondary">
              {hindi ? "सीधा संपर्क और सत्यापन लिंक" : "Zero fabricated phone numbers. All verified with official registries."}
            </p>
          </div>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {(legalData?.verifiedResources || []).map((res: any) => (
            <div
              key={res.id}
              className="rounded-2xl border border-border-color/80 bg-white/80 p-4 flex flex-col justify-between shadow-xs"
            >
              <div>
                <span className="rounded-md bg-pale-sage/60 px-2 py-0.5 text-[10px] font-bold text-deep-teal">
                  {res.category}
                </span>
                <h3 className="mt-2 font-bold text-sm text-text-primary">{res.name}</h3>
                <p className="mt-1 text-xs text-text-secondary leading-relaxed">{res.description}</p>
              </div>

              <div className="mt-4 border-t border-border-color/50 pt-3 flex items-center justify-between">
                {res.phone ? (
                  <a
                    href={`tel:${res.phone}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-deep-teal px-3 py-1.5 text-xs font-bold text-white hover:bg-deep-teal/90 shadow-xs"
                  >
                    <PhoneCall size={12} /> {res.phone}
                  </a>
                ) : (
                  <span className="text-xs text-text-secondary font-medium">Digital Portal</span>
                )}

                {res.website && (
                  <a
                    href={res.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-deep-teal hover:underline"
                  >
                    Website <ExternalLink size={11} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Legal FAQs Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eee8f5] text-[#8064a2]">
            <HelpCircle size={18} />
          </span>
          <div>
            <h2 className="text-lg font-bold text-text-primary">
              {hindi ? "अक्सर पूछे जाने वाले कानूनी प्रश्न (FAQs)" : "Frequently Asked Legal Questions"}
            </h2>
            <p className="text-xs text-text-secondary">
              {hindi ? "सत्यापित सरकारी नियमों पर आधारित स्पष्ट उत्तर" : "Sourced from NALSA and Central Victim Compensation frameworks"}
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {(legalData?.faqs || []).map((faq: any) => {
            const isOpen = expandedFaq === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-2xl border border-border-color/80 bg-white/80 overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(isOpen ? null : faq.id)}
                  className="w-full flex items-center justify-between p-4 text-left font-bold text-sm text-text-primary hover:bg-(--surface-subtle) transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    size={16}
                    className={`text-text-secondary transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 text-xs text-text-secondary leading-relaxed border-t border-border-color/40 bg-(--surface-subtle)/50">
                    <p>{faq.answer}</p>
                    <div className="mt-3 flex items-center justify-between text-[11px] pt-2 border-t border-border-color/40">
                      <span><strong>Source:</strong> {faq.official_source}</span>
                      <a
                        href={faq.source_url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-deep-teal hover:underline inline-flex items-center gap-0.5"
                      >
                        Official Document <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Ask TAARA Integration Card */}
      <div className="rounded-[28px] border border-deep-teal/30 bg-deep-teal/5 p-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-deep-teal text-white shadow-sm shrink-0">
            <MessageSquare size={22} />
          </span>
          <div>
            <h3 className="font-display text-xl font-bold text-text-primary">
              {hindi ? "तारा से कानूनी अधिकारों पर बात करें" : "Have more questions? Ask TAARA"}
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              {hindi
                ? "तारा सत्यापित कानूनी जानकारी को सरल भाषा में समझाने में आपकी मदद कर सकती है।"
                : "TAARA can explain these verified rights and connect you to support sessions with your counsellor."}
            </p>
          </div>
        </div>
        <Link
          href="/survivor/taara"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-deep-teal px-5 py-3 text-xs font-bold text-white hover:bg-deep-teal/90 shadow-sm transition-all shrink-0"
        >
          {hindi ? "तारा खोलें" : "Open TAARA"} <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
