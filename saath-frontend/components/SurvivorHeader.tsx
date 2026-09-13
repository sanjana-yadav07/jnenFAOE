"use client";

import { useEffect, useRef, useState } from "react";
import { Accessibility, Bell, LogOut, Settings, Shield, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SaathLogo } from "@/components/SaathLogo";
import { BackButton } from "@/components/BackButton";
import { defaultAccessibilitySettings, useAppStore } from "@/store/useAppStore";
import { notificationService } from "@/services/notifications";
import { LanguageDropdown } from "@/components/LanguageDropdown";
import { getLanguageOption, t } from "@/lib/i18n";

type ToggleRowProps = {
  label: string;
  description?: string;
  checked: boolean;
  onChange: () => void;
};

type ChoicePillProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-border-color bg-surface-subtle p-2.5 text-left">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-text-primary">{label}</p>
        {description && <p className="mt-0.5 text-[11px] leading-4 text-text-secondary">{description}</p>}
      </div>
      <span className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-border-color transition-colors duration-150 focus-within:ring-2 focus-within:ring-focus-ring focus-within:ring-offset-2">
        <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" aria-label={label} />
        <span className={`absolute inset-0 rounded-full transition-colors ${checked ? "bg-primary-teal" : "bg-border"}`} />
        <span className={`relative ml-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
      </span>
    </label>
  );
}

function ChoicePill({ label, selected, onClick }: ChoicePillProps) {
  return (
    <button type="button" aria-pressed={selected} onClick={onClick} className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors ${selected ? "border-primary-teal bg-primary-teal text-white" : "border-border-color bg-surface-subtle text-text-secondary hover:border-primary-teal-light"}`}>
      {label}
    </button>
  );
}

function SectionGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3 rounded-2xl border border-border-color bg-surface-subtle p-3.5">
      <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-text-secondary">{title}</h3>
      {children}
    </section>
  );
}

export function SurvivorHeader() {
  const router = useRouter();
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const survivorName = useAppStore((state) => state.survivorName);
  const logout = useAppStore((state) => state.logout);
  const accessibility = useAppStore((state) => state.accessibility);
  const setAccessibility = useAppStore((state) => state.setAccessibility);
  const resetAccessibility = useAppStore((state) => state.resetAccessibility);
  const pathname = usePathname();
  const hideLanguageSelector = pathname?.startsWith("/survivor/check-in/ivrs");
  const unreadCount = useAppStore((state) => state.unreadNotificationCount);
  const fetchNotifications = useAppStore((state) => state.fetchNotifications);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const panelButtonRef = useRef<HTMLButtonElement | null>(null);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  const displayName = survivorName?.trim() || "Sunita Kumari";
  const userInitials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("") || "SK";

  useEffect(() => {
    void fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (!isAccessibilityOpen && !isProfileMenuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (panelRef.current && !panelRef.current.contains(target) && panelButtonRef.current && !panelButtonRef.current.contains(target)) {
        setIsAccessibilityOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(target)) {
        setIsProfileMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsAccessibilityOpen(false);
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAccessibilityOpen, isProfileMenuOpen]);

  const hindi = language === "Hindi";

  return (
    <header className="flex items-center justify-between gap-2 px-4 py-4 sm:px-6 md:px-10 md:py-7 xl:px-14">
      <div className="flex shrink-0 items-center gap-2 md:hidden">
        <SaathLogo className="h-6.5 w-auto sm:h-7" size={26} />
        <span className="font-display text-xl font-bold text-deep-teal sm:text-2xl">SAATH</span>
      </div>
      <div className="hidden md:block">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-text-secondary">
          {new Date().toLocaleDateString(getLanguageOption(language).locale, { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
        </p>
      </div>

      <div className="relative flex shrink-0 items-center gap-1.5 sm:gap-2">
        {!hideLanguageSelector && (
          <LanguageDropdown variant="pill" />
        )}

        <button
          ref={panelButtonRef}
          type="button"
          aria-label="Accessibility settings"
          aria-haspopup="dialog"
          aria-expanded={isAccessibilityOpen}
          aria-controls="saath-accessibility-panel"
          onClick={() => setIsAccessibilityOpen((current) => !current)}
          className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-border-color/70 bg-white/70 text-text-secondary transition-colors hover:text-deep-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e] focus-visible:ring-offset-2"
          title="Accessibility settings"
        >
          <Accessibility size={15} />
        </button>

        <BackButton />
        <Link href="/survivor/safety" aria-label={t("header.safety", language)} title={t("header.safety", language)} className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-[#e4b7a8]/70 bg-[#fbe6e0]/70 text-[#a15f4e] hover:bg-[#fbe6e0]">
          <Shield size={16} />
        </Link>
        <Link
          href="/survivor/notifications"
          aria-label={`${t("header.notifications", language)} (${unreadCount})`}
          title={t("header.notifications", language)}
          className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-border-color/70 bg-white/70 text-text-secondary hover:text-deep-teal transition-colors"
        >
          <Bell size={16} />
          {unreadCount > 0 && (
            <span
              aria-label={`${unreadCount} unread`}
              className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-warm-peach px-1 text-[10px] font-bold text-white shadow-sm"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Link>

        {/* Profile Avatar & Quick Menu */}
        <div className="relative" ref={profileMenuRef}>
          <button
            type="button"
            aria-haspopup="true"
            aria-expanded={isProfileMenuOpen}
            aria-label={t("nav.profile", language)}
            onClick={() => setIsProfileMenuOpen((prev) => !prev)}
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-border-color/70 bg-white/80 text-xs font-bold text-deep-teal shadow-xs transition-all hover:border-primary-teal hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e] focus-visible:ring-offset-2"
            title={displayName || t("nav.profile", language)}
          >
            {userInitials}
          </button>

          {isProfileMenuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-[calc(100%+0.6rem)] z-50 w-56 rounded-2xl border border-border-color bg-surface p-2 shadow-[0_18px_40px_rgba(23,35,38,0.12)] backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="border-b border-border-color/60 px-3 py-2.5">
                <p className="truncate text-xs font-bold text-text-primary">{displayName}</p>
                <p className="truncate text-[11px] text-text-secondary">{t("header.activeSession", language)}</p>
              </div>

              <div className="py-1">
                <Link
                  href="/survivor/profile"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-text-primary hover:bg-surface-subtle hover:text-deep-teal transition-colors"
                  role="menuitem"
                >
                  <User size={15} />
                  <span>{t("nav.profile", language)}</span>
                </Link>

                <Link
                  href="/survivor/privacy"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-text-primary hover:bg-surface-subtle hover:text-deep-teal transition-colors"
                  role="menuitem"
                >
                  <Settings size={15} />
                  <span>{t("nav.privacy", language)}</span>
                </Link>
              </div>

              <div className="border-t border-border-color/60 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    logout();
                    router.push("/landing");
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-warm-peach hover:bg-[#fbe6e0]/60 transition-colors"
                  role="menuitem"
                >
                  <LogOut size={15} />
                  <span>{t("nav.signOut", language)}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {isAccessibilityOpen && (
          <div id="saath-accessibility-panel" ref={panelRef} role="dialog" aria-modal="false" aria-label="Accessibility" className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[min(25rem,calc(100vw-1.25rem))] overflow-hidden rounded-[1.5rem] border border-border-color bg-surface shadow-[0_18px_50px_rgba(23,35,38,0.14)] backdrop-blur-sm">
            <div className="flex items-start justify-between border-b border-border-color px-4 py-3.5">
              <div>
                <h2 className="font-display text-[1.45rem] leading-none text-text-primary">Accessibility</h2>
                <p className="mt-1 text-xs text-text-secondary">Choose the settings that make SAATH easier to use.</p>
              </div>
              <button type="button" aria-label="Close accessibility panel" onClick={() => setIsAccessibilityOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-full border border-border-color bg-surface-subtle text-text-primary hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2">
                <X size={15} />
              </button>
            </div>

            <div className="max-h-[min(68vh,560px)] overflow-y-auto p-3.5">
              <div className="space-y-3">
                <SectionGroup title="Text Size">
                  <div className="flex flex-wrap gap-2">
                    <ChoicePill label="A−" selected={accessibility.textSize === "small"} onClick={() => setAccessibility({ textSize: "small" })} />
                    <ChoicePill label="Default" selected={accessibility.textSize === "default"} onClick={() => setAccessibility({ textSize: "default" })} />
                    <ChoicePill label="A+" selected={accessibility.textSize === "large" || accessibility.textSize === "extra-large"} onClick={() => setAccessibility({ textSize: "large" })} />
                  </div>
                </SectionGroup>

                <SectionGroup title="Page Zoom">
                  <div className="flex flex-wrap items-center gap-2">
                    <button type="button" aria-label="Decrease zoom" onClick={() => setAccessibility({ pageZoom: Math.max(80, accessibility.pageZoom - 10) })} className="rounded-lg border border-border-color bg-surface-subtle px-2.5 py-1.5 text-xs font-semibold text-text-secondary hover:bg-surface-raised transition-colors">−</button>
                    <ChoicePill label={`${accessibility.pageZoom}%`} selected={accessibility.pageZoom === 100} onClick={() => setAccessibility({ pageZoom: 100 })} />
                    <button type="button" aria-label="Increase zoom" onClick={() => setAccessibility({ pageZoom: Math.min(150, accessibility.pageZoom + 10) })} className="rounded-lg border border-border-color bg-surface-subtle px-2.5 py-1.5 text-xs font-semibold text-text-secondary hover:bg-surface-raised transition-colors">+</button>
                  </div>
                </SectionGroup>

                <SectionGroup title="Color & Contrast">
                  <ToggleRow label="Dark mode" description="Apply a calmer dark theme." checked={accessibility.darkMode} onChange={() => setAccessibility({ darkMode: !accessibility.darkMode, highContrastLight: false })} />
                  <ToggleRow label="High contrast light" description="Increase contrast while staying light." checked={accessibility.highContrastLight} onChange={() => setAccessibility({ highContrastLight: !accessibility.highContrastLight, darkMode: false })} />
                  <ToggleRow label="Invert colors" description="Invert page colors for high visual contrast." checked={accessibility.invertColors} onChange={() => setAccessibility({ invertColors: !accessibility.invertColors, grayscale: false })} />
                  <ToggleRow label="Grayscale" description="Reduce visual color to black and white." checked={accessibility.grayscale} onChange={() => setAccessibility({ grayscale: !accessibility.grayscale, invertColors: false })} />
                </SectionGroup>

                <SectionGroup title="Color Modes">
                  <ToggleRow label="Soft tones" description="Keep colors muted and gentle." checked={accessibility.softTones} onChange={() => setAccessibility({ softTones: !accessibility.softTones, vividTones: false })} />
                  <ToggleRow label="Vivid tones" description="Boost colors more strongly for higher intensity." checked={accessibility.vividTones} onChange={() => setAccessibility({ vividTones: !accessibility.vividTones, softTones: false })} />
                </SectionGroup>

                <SectionGroup title="Typography">
                  <ToggleRow label="Readable font" description="Use a clearer reading font." checked={accessibility.readableFont} onChange={() => setAccessibility({ readableFont: !accessibility.readableFont })} />
                  <ToggleRow label="Atkinson font" description="Use Atkinson Hyperlegible when available." checked={accessibility.atkinsonFont} onChange={() => setAccessibility({ atkinsonFont: !accessibility.atkinsonFont })} />
                  <ToggleRow label="Increase line height" description="Add more vertical space to text." checked={accessibility.lineHeight > 1.5} onChange={() => setAccessibility({ lineHeight: accessibility.lineHeight > 1.5 ? 1.5 : 1.8 })} />
                  <ToggleRow label="Increase letter spacing" description="Add more spacing between letters." checked={accessibility.letterSpacing > 0} onChange={() => setAccessibility({ letterSpacing: accessibility.letterSpacing > 0 ? 0 : 0.04 })} />
                  <ToggleRow label="Increase word spacing" description="Add more spacing between words." checked={accessibility.wordSpacing > 0} onChange={() => setAccessibility({ wordSpacing: accessibility.wordSpacing > 0 ? 0 : 0.08 })} />
                </SectionGroup>

                <SectionGroup title="Text Alignment">
                  <div className="flex flex-wrap gap-2">
                    <ChoicePill label="Left" selected={accessibility.textAlign === "left"} onClick={() => setAccessibility({ textAlign: "left" })} />
                    <ChoicePill label="Center" selected={accessibility.textAlign === "center"} onClick={() => setAccessibility({ textAlign: "center" })} />
                    <ChoicePill label="Justify" selected={accessibility.textAlign === "justify"} onClick={() => setAccessibility({ textAlign: "justify" })} />
                  </div>
                </SectionGroup>

                <SectionGroup title="Pointer & Motion">
                  <ToggleRow label="Big cursor" description="Increase the cursor size across the interface." checked={accessibility.bigCursor} onChange={() => setAccessibility({ bigCursor: !accessibility.bigCursor })} />
                  <ToggleRow label="No animations" description="Turn off unnecessary animations." checked={accessibility.noAnimations} onChange={() => setAccessibility({ noAnimations: !accessibility.noAnimations })} />
                  <ToggleRow label="Stop motion" description="Reduce moving effects across the page." checked={accessibility.stopMotion} onChange={() => setAccessibility({ stopMotion: !accessibility.stopMotion, noAnimations: !accessibility.noAnimations })} />
                  <ToggleRow label="Epilepsy safe" description="Block flashing or rapid visual changes." checked={accessibility.epilepsySafe} onChange={() => setAccessibility({ epilepsySafe: !accessibility.epilepsySafe, noAnimations: !accessibility.noAnimations })} />
                </SectionGroup>

                <SectionGroup title="Media & Sound">
                  <ToggleRow label="Mute sounds" description="Silence audio and media playback." checked={accessibility.muteSounds} onChange={() => setAccessibility({ muteSounds: !accessibility.muteSounds })} />
                </SectionGroup>
              </div>
            </div>

            <div className="border-t border-border-color px-4 py-3">
              <button type="button" onClick={() => { resetAccessibility(); setIsAccessibilityOpen(false); }} className="w-full rounded-xl border border-border-color bg-surface-subtle px-3 py-2 text-sm font-semibold text-text-primary hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2">
                Reset all settings
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}