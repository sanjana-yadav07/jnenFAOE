"use client";

import Link from "next/link";
import { FileText, HeartHandshake, Home, LogOut, MessageSquareText, Settings, Sparkles, UserRound, Wind } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { SaathLogo } from "@/components/SaathLogo";
import { useAppStore } from "@/store/useAppStore";
import { t } from "@/lib/i18n";

const NAV_ITEMS = [
  { href: "/survivor", key: "nav.home", defaultLabel: "Home", icon: Home },
  { href: "/survivor/check-in", key: "nav.checkIn", defaultLabel: "Check-in", icon: HeartHandshake },
  { href: "/survivor/feel-better", key: "nav.feelBetter", defaultLabel: "Feel better", icon: Wind },
  { href: "/survivor/sahayak", key: "nav.sahayak", defaultLabel: "Sahayak", icon: MessageSquareText },
  { href: "/survivor/my-space", key: "nav.mySpace", defaultLabel: "My space", icon: FileText },
  { href: "/survivor/support", key: "nav.support", defaultLabel: "Support", icon: Sparkles },
] as const;

const ITEM_BASE = "group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-colors";
const ITEM_ACTIVE = "bg-primary-teal-dark text-primary-teal shadow-sm";
const ITEM_INACTIVE = "text-text-secondary hover:bg-surface-subtle hover:text-primary-teal";

export function SurvivorSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { language, survivorName, logout } = useAppStore();
  const name = survivorName || t("nav.mySpace", language);

  const isActive = (href: string) => (href === "/survivor" ? pathname === href : pathname.startsWith(href));

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-63 flex-col border-r border-border-color/65 bg-sidebar-background/90 px-5 py-7 backdrop-blur-xl md:flex xl:w-68">
      <Link href="/survivor" className="flex items-center gap-3 px-2 group">
        <SaathLogo className="h-8 w-auto transition-transform duration-200 group-hover:scale-105" size={32} />
        <div>
          <div className="font-editorial text-[27px] font-bold leading-none tracking-tight text-deep-teal">SAATH</div>
          <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-text-secondary">
            {t("common.notAlone", language).slice(0, 24)}
          </div>
        </div>
      </Link>

      <div className="my-9 h-px bg-border/55" />

      <p className="px-3 text-[10px] font-bold uppercase tracking-[.2em] text-text-secondary">
        {t("nav.mySpace", language)}
      </p>
      <nav className="mt-3 space-y-1">
        {NAV_ITEMS.map(({ href, key, defaultLabel, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link key={href} href={href} className={`${ITEM_BASE} ${active ? ITEM_ACTIVE : ITEM_INACTIVE}`}>
              <Icon size={18} strokeWidth={active ? 2.3 : 1.8} />
              <span>{t(key, language) || defaultLabel}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-1">
        <Link href="/survivor/profile" className={`${ITEM_BASE} ${isActive("/survivor/profile") ? ITEM_ACTIVE : ITEM_INACTIVE}`}>
          <UserRound size={18} strokeWidth={isActive("/survivor/profile") ? 2.3 : 1.8} />
          <span>{name}</span>
        </Link>
        <Link href="/survivor/privacy" className={`${ITEM_BASE} ${isActive("/survivor/privacy") ? ITEM_ACTIVE : ITEM_INACTIVE}`}>
          <Settings size={18} strokeWidth={isActive("/survivor/privacy") ? 2.3 : 1.8} />
          <span>{t("nav.privacy", language)}</span>
        </Link>
      </div>
    </aside>
  );
}