"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { apiRequest, setSession } from "@/lib/api";
import { counsellorService } from "@/services/case";
import { useAppStore } from "@/store/useAppStore";
import { Role } from "@/types";
import { SaathLogo } from "@/components/SaathLogo";

const STATE_DISTRICT_MAP: Record<string, string[]> = {
  Delhi: ["South Delhi", "North Delhi", "West Delhi", "New Delhi"],
  Rajasthan: ["Jaipur", "Jodhpur"],
  Maharashtra: ["Pune", "Mumbai Suburban"],
  "Uttar Pradesh": ["Lucknow", "Varanasi"],
  "West Bengal": ["Kolkata", "Howrah"],
  Karnataka: ["Bengaluru Urban", "Mysuru"],
  "Tamil Nadu": ["Chennai", "Coimbatore"],
  Bihar: ["Patna"],
  Gujarat: ["Ahmedabad"],
  Odisha: ["Bhubaneswar"],
  Kerala: ["Ernakulam"],
};

export default function StaffLoginPage() {
  const router = useRouter();
  const setStaffRole = useAppStore((s) => s.setStaffRole);
  const [tab, setTab] = useState<"counsellor" | "admin">("counsellor");

  // Counsellor real login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Admin dynamic jurisdiction selection
  const [adminTier, setAdminTier] = useState<"DISTRICT_ADMIN" | "STATE_ADMIN" | "NATIONAL_ADMIN">("DISTRICT_ADMIN");
  const [selectedState, setSelectedState] = useState<string>("Delhi");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("South Delhi");

  // When state changes, update default district
  function handleStateChange(newState: string) {
    setSelectedState(newState);
    const districts = STATE_DISTRICT_MAP[newState] || [];
    if (districts.length > 0) {
      setSelectedDistrict(districts[0]);
    }
  }

  async function counsellorLogin() {
    setError(null);
    setLoading(true);
    try {
      const profile = await counsellorService.login(email, password);
      setStaffRole("counsellor");
      void profile;
      router.push("/counsellor");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  async function adminLogin() {
    setError(null);
    setLoading(true);
    try {
      const staffId =
        adminTier === "DISTRICT_ADMIN"
          ? `district-${selectedDistrict.toLowerCase().replace(/\s+/g, "_")}@saath`
          : adminTier === "STATE_ADMIN"
          ? `state-${selectedState.toLowerCase().replace(/\s+/g, "_")}@saath`
          : "national@saath";

      const roleMapping: Record<string, Role> = {
        DISTRICT_ADMIN: "district",
        STATE_ADMIN: "state",
        NATIONAL_ADMIN: "national",
      };

      const payload: {
        role: "DISTRICT_ADMIN" | "STATE_ADMIN" | "NATIONAL_ADMIN";
        staffId: string;
        state?: string;
        district?: string;
      } = {
        role: adminTier,
        staffId,
        state: adminTier !== "NATIONAL_ADMIN" ? selectedState : undefined,
        district: adminTier === "DISTRICT_ADMIN" ? selectedDistrict : undefined,
      };

      const response = await apiRequest<{ accessToken?: string }>("/api/v1/auth/staff-token", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (response.accessToken) setSession(response.accessToken);
      setStaffRole(roleMapping[adminTier]);
      router.push("/admin");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to sign in with the staff account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col px-6 py-10 max-w-md mx-auto w-full">
      <Link href="/landing" className="flex items-center gap-2.5 mb-6 group w-fit">
        <SaathLogo className="h-8 w-auto transition-transform duration-200 group-hover:scale-105" size={32} />
        <span className="font-display text-2xl font-bold tracking-tight text-deep-teal">SAATH</span>
      </Link>
      <p className="text-xs font-semibold text-amber uppercase tracking-wide">Secure staff access</p>
      <h1 className="mt-1 text-xl font-semibold">Staff sign in</h1>

      <div className="mt-6 flex gap-2 rounded-full bg-pale-sage/40 p-1 text-sm font-semibold">
        <button
          type="button"
          onClick={() => { setTab("counsellor"); setError(null); }}
          className={`flex-1 rounded-full px-3 py-2 ${tab === "counsellor" ? "bg-deep-teal text-white" : "text-text-secondary"}`}
        >
          Counsellor
        </button>
        <button
          type="button"
          onClick={() => { setTab("admin"); setError(null); }}
          className={`flex-1 rounded-full px-3 py-2 ${tab === "admin" ? "bg-deep-teal text-white" : "text-text-secondary"}`}
        >
          Admin
        </button>
      </div>

      {tab === "counsellor" && (
        <div className="mt-6 space-y-3">
          <p className="text-xs text-text-secondary">Sign in with your counsellor account.</p>
          <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") void counsellorLogin(); }}
          />
          {error && <p role="alert" className="text-sm text-warm-peach">{error}</p>}
          <Button className="w-full" onClick={() => void counsellorLogin()} disabled={loading || !email || !password}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
          <p className="text-xs text-text-secondary">Demo: anjali@saath.com / saath123</p>
        </div>
      )}

      {tab === "admin" && (
        <div className="mt-6 space-y-4">
          <div>
            <p className="text-xs text-text-secondary mb-1">Select administrative tier and jurisdiction:</p>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <button
                type="button"
                onClick={() => setAdminTier("DISTRICT_ADMIN")}
                className={`rounded-xl px-2.5 py-2 text-xs font-semibold border transition-all ${
                  adminTier === "DISTRICT_ADMIN"
                    ? "bg-deep-teal text-white border-deep-teal shadow-sm"
                    : "bg-surface text-text-secondary border-border-color hover:border-deep-teal/50"
                }`}
              >
                District Admin
              </button>
              <button
                type="button"
                onClick={() => setAdminTier("STATE_ADMIN")}
                className={`rounded-xl px-2.5 py-2 text-xs font-semibold border transition-all ${
                  adminTier === "STATE_ADMIN"
                    ? "bg-deep-teal text-white border-deep-teal shadow-sm"
                    : "bg-surface text-text-secondary border-border-color hover:border-deep-teal/50"
                }`}
              >
                State Admin
              </button>
              <button
                type="button"
                onClick={() => setAdminTier("NATIONAL_ADMIN")}
                className={`rounded-xl px-2.5 py-2 text-xs font-semibold border transition-all ${
                  adminTier === "NATIONAL_ADMIN"
                    ? "bg-deep-teal text-white border-deep-teal shadow-sm"
                    : "bg-surface text-text-secondary border-border-color hover:border-deep-teal/50"
                }`}
              >
                National Admin
              </button>
            </div>
          </div>

          {/* Dynamic Geographic Jurisdiction Selection */}
          {adminTier !== "NATIONAL_ADMIN" && (
            <div className="space-y-3 rounded-2xl border border-border-color bg-surface-subtle p-3.5">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Assigned State
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface px-3 py-2 text-sm font-medium text-text-primary focus:border-deep-teal focus:outline-none"
                >
                  {Object.keys(STATE_DISTRICT_MAP).map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {adminTier === "DISTRICT_ADMIN" && (
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    Assigned District
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-surface px-3 py-2 text-sm font-medium text-text-primary focus:border-deep-teal focus:outline-none"
                  >
                    {(STATE_DISTRICT_MAP[selectedState] || []).map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {adminTier === "NATIONAL_ADMIN" && (
            <div className="rounded-2xl border border-border-color bg-surface-subtle p-3.5 text-xs text-text-secondary">
              <span className="font-semibold text-deep-teal">National Scope:</span> Authorised across all states and districts nationwide with full anonymized statistical aggregation.
            </div>
          )}

          {error && <p role="alert" className="text-sm text-warm-peach">{error}</p>}

          <Button className="w-full" onClick={() => void adminLogin()} disabled={loading}>
            {loading ? "Authorizing..." : `Enter ${adminTier === "DISTRICT_ADMIN" ? `${selectedDistrict} District` : adminTier === "STATE_ADMIN" ? `${selectedState} State` : "National"} Admin`}
          </Button>

          <p className="text-[11px] text-center text-text-secondary">
            Role and geographic boundaries are cryptographically enforced server-side.
          </p>
        </div>
      )}
    </div>
  );
}
