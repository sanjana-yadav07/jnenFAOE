"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/Button";
import { staffService } from "@/services/case";
import { AdminProfile } from "@/types";
import { Bell, ClipboardList, FileBarChart, LayoutDashboard, LogOut, MapPin, Settings, UsersRound } from "lucide-react";

export function StaffTopNav({ role, children }: { role: "counsellor" | "admin"; children?: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const logout = useAppStore((s) => s.logout);
  const counsellorProfile = useAppStore((s) => s.counsellorProfile);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);

  useEffect(() => {
    if (role === "admin") {
      staffService.getMe()
        .then((p) => setAdminProfile(p))
        .catch(() => {
          // Default fallback
        });
    }
  }, [role]);

  const greetingName = role === "counsellor" ? (counsellorProfile?.name?.split(" ")[0] ?? "there") : null;
  const items = role === "counsellor"
    ? [
        { href: "/counsellor", label: "Overview", icon: LayoutDashboard },
        { href: "/counsellor/my-cases", label: "My cases", icon: UsersRound },
        { href: "/counsellor/alerts", label: "Alerts", icon: Bell },
        { href: "/counsellor/follow-ups", label: "Follow-ups", icon: ClipboardList },
        { href: "/counsellor/reports", label: "Reports", icon: FileBarChart },
      ]
    : [
        { href: "/admin", label: "Overview", icon: LayoutDashboard },
        { href: "/admin/cases", label: "Cases", icon: ClipboardList },
        { href: "/admin/reports", label: "Reports", icon: FileBarChart },
        { href: "/admin/settings", label: "Settings", icon: Settings },
      ];

  function signOut() { logout(); router.push("/landing"); }

  return <div className="min-h-screen bg-background md:flex">
    <aside className="hidden w-64 shrink-0 border-r border-border-color bg-surface px-5 py-7 md:flex md:flex-col">
      <Link href={role === "counsellor" ? "/counsellor" : "/admin"} className="font-display text-3xl font-bold text-primary-teal">SAATH</Link>
      <p className="mt-1 text-[10px] font-bold uppercase tracking-[.2em] text-text-secondary">
        {role === "counsellor" ? "Counsellor workspace" : "Admin workspace"}
      </p>
      {role === "admin" && (
        <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-surface-subtle px-2.5 py-1.5 border border-border-color/60 text-xs">
          <MapPin size={13} className="shrink-0 text-deep-teal" />
          <span className="truncate font-semibold text-deep-teal">
            {adminProfile?.scopeTitle || "Authorized Jurisdiction"}
          </span>
        </div>
      )}
      <nav className="mt-8 space-y-1" aria-label="Staff navigation">{items.map(({ href, label, icon: Icon }, index) => { const active = href === "/counsellor" || href === "/admin" ? pathname === href : pathname?.startsWith(href); return <Link key={`${label}-${index}`} href={href} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium ${active ? "bg-primary-teal-dark text-primary-teal" : "text-text-secondary hover:bg-surface-subtle hover:text-primary-teal"}`}><Icon size={17} /><span>{label}</span>{label === "Alerts" && <span className="ml-auto rounded-full bg-warning-bg px-2 py-0.5 text-[10px] font-bold text-warning">2</span>}</Link>; })}</nav>
      <div className="mt-auto border-t border-border-color pt-4"><Button size="sm" variant="ghost" className="w-full justify-start gap-2" onClick={signOut}><LogOut size={16} />Sign out</Button></div>
    </aside>
    <div className="min-w-0 flex-1"><header className="border-b border-border-color bg-surface"><div className="mx-auto flex w-full items-center justify-between px-5 py-4 md:px-8"><Link href={role === "counsellor" ? "/counsellor" : "/admin"} className="font-semibold text-primary-teal md:hidden">SAATH · {role === "counsellor" ? "Counsellor" : "Admin"}</Link><p className="hidden text-sm font-semibold text-text-primary md:block">{role === "counsellor" ? `Good to see you, ${greetingName}` : adminProfile?.scopeTitle ? `${adminProfile.scopeTitle} · Aggregated Decision Intelligence` : "Aggregated Decision Intelligence"}</p><Button size="sm" variant="ghost" className="md:hidden" onClick={signOut}>Sign out</Button></div></header><nav className="flex gap-2 overflow-x-auto border-b border-border-color bg-surface px-5 py-2 md:hidden" aria-label="Staff navigation">{items.slice(0, 4).map(({ href, label }) => <Link key={label} href={href} className="whitespace-nowrap rounded-full bg-surface-subtle px-3 py-1.5 text-xs font-semibold text-text-secondary">{label}</Link>)}</nav><main className="w-full px-5 py-8 md:px-8 xl:px-12">{children}</main></div>
  </div>;
}
