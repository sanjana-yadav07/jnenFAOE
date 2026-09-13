"use client";
 
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, HeartHandshake, Trash2, UserPlus } from "lucide-react";
import { aiService } from "@/services/ai";
 
interface SafeCircleContact {
  id: string;
  name: string;
  relation: string;
  email: string;
  consentToContact: boolean;
}
 
export default function SafeCirclePage() {
  const [contacts, setContacts] = useState<SafeCircleContact[]>([]);
  const [loadingList, setLoadingList] = useState(true);
 
  // Add-person form state
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("Sister");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
 
  const canSubmit = name.trim() && relation.trim() && consent && email.trim();
 
  useEffect(() => {
    let cancelled = false;
    aiService
      .getSafeCircle()
      .then((data: any) => {
        if (!cancelled && Array.isArray(data)) setContacts(data);
      })
      .catch(() => {
        // If this fails, the person can still add someone new below.
      })
      .finally(() => {
        if (!cancelled) setLoadingList(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);
 
  function resetForm() {
    setName("");
    setRelation("Sister");
    setEmail("");
    setConsent(false);
  }
 
  async function handleSubmit() {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      const created = await aiService.createSafeCircleItem({
        name: name.trim(),
        relation: relation.trim(),
        email: email.trim(),
        consentToContact: consent,
      });
      setContacts((prev) => [...prev, created]);
      setJustAdded(created.name);
      resetForm();
      setShowForm(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Couldn't save this contact. Please try again.");
    } finally {
      setLoading(false);
    }
  }
 
  async function handleRemove(id: string) {
    setRemovingId(id);
    try {
      await aiService.deleteSafeCircleItem(id);
      setContacts((prev) => prev.filter((c) => c.id !== id));
    } catch {
      // leave the contact in the list if the delete failed
    } finally {
      setRemovingId(null);
    }
  }
 
  return (
    <div className="px-5 pb-10 md:px-10 xl:px-14">
      <Link href="/survivor/support" className="inline-flex items-center gap-2 text-sm font-semibold text-[#75857f]">
        <ArrowLeft size={16} /> Support
      </Link>
      <div className="mx-auto mt-9 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[.2em] text-[#7e918b]">Safe Circle</p>
        <h1 className="mt-3 font-display text-5xl text-[#172326]">Choose people who can be there.</h1>
        <p className="mt-4 text-lg text-[#63736e]">
          If SAATH ever detects a real crisis signal, the people in your Safe Circle will be emailed automatically so they can be there for you.
        </p>
 
        {/* ── Existing people ──────────────────────────────────────── */}
        <div className="surface mt-10 rounded-[28px] p-7 md:p-10">
          <h2 className="font-display text-2xl text-[#263c35]">Your Safe Circle</h2>
 
          {loadingList ? (
            <div className="mt-6 space-y-3">
              {[1, 2].map((n) => (
                <div key={n} className="h-16 animate-pulse rounded-2xl bg-[#eef2ef]" />
              ))}
            </div>
          ) : contacts.length === 0 ? (
            <p className="mt-3 text-sm text-[#6b7b75]">You haven&apos;t added anyone yet. Add your first trusted person below.</p>
          ) : (
            <div className="mt-6 space-y-3">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-[#c8d3d0] bg-white px-5 py-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff0e5] text-[#b56e4e] font-bold">
                      {contact.name.trim().charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <p className="font-semibold text-[#263c35]">{contact.name}</p>
                      <p className="text-xs text-[#6b7b75]">{contact.relation} · {contact.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(contact.id)}
                    disabled={removingId === contact.id}
                    className="rounded-lg p-2 text-[#b5473f] hover:bg-[#fbe9e7] disabled:opacity-50"
                    title="Remove from Safe Circle"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
            </div>
          )}
 
          {justAdded && !showForm && (
            <div className="mt-6 flex items-center gap-3 rounded-2xl bg-[#dcebdd] px-5 py-4 text-[#2b473b]">
              <Check size={18} />
              <p className="text-sm font-semibold">{justAdded} has been added to your Safe Circle.</p>
            </div>
          )}
 
          {/* ── Add another person ─────────────────────────────────── */}
          {!showForm ? (
            <button
              onClick={() => {
                setJustAdded(null);
                setShowForm(true);
              }}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-full border border-dashed border-[#0f766e] px-6 py-3 text-sm font-bold text-[#0f766e] hover:bg-[#dcebdd]/40"
            >
              <UserPlus size={16} /> {contacts.length === 0 ? "Add a trusted person" : "Add another person"}
            </button>
          ) : (
            <div className="mt-8 border-t border-[#e3e9e7] pt-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff0e5] text-[#b56e4e]">
                <HeartHandshake size={22} />
              </span>
              <h3 className="mt-6 font-display text-2xl text-[#263c35]">Add a trusted person</h3>
 
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-semibold text-[#51635b]">
                  Name
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-[#c8d3d0] bg-white px-4 py-3 font-normal outline-none focus:border-[#0f766e]"
                    placeholder="e.g. Asha"
                  />
                </label>
                <label className="text-sm font-semibold text-[#51635b]">
                  Relationship
                  <select
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-[#c8d3d0] bg-white px-4 py-3 font-normal outline-none focus:border-[#0f766e]"
                  >
                    <option>Sister</option>
                    <option>Friend</option>
                    <option>Parent</option>
                    <option>Other trusted person</option>
                  </select>
                </label>
                <label className="text-sm font-semibold text-[#51635b] sm:col-span-2">
                  Email
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-[#c8d3d0] bg-white px-4 py-3 font-normal outline-none focus:border-[#0f766e]"
                    placeholder="asha@example.com"
                  />
                </label>
              </div>
 
              <label className="mt-6 flex items-start gap-3 text-sm text-[#51635b]">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1" />
                <span>
                  I understand {name.trim() || "this person"} may be emailed automatically, without asking me again each time, if SAATH detects a genuine crisis signal.
                </span>
              </label>
 
              {error && <p className="mt-4 text-sm font-semibold text-[#b5473f]">{error}</p>}
 
              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={() => {
                    resetForm();
                    setError(null);
                    setShowForm(false);
                  }}
                  className="rounded-full px-6 py-3 text-sm font-bold text-[#51635b] hover:bg-[#eef2ef]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit || loading}
                  className="rounded-full bg-[#0f766e] px-6 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save trusted person"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
 
