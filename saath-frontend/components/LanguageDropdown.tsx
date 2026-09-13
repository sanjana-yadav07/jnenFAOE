"use client";

import { useEffect, useRef, useState } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { SUPPORTED_LANGUAGES, getLanguageOption } from "@/lib/i18n";

export function LanguageDropdown({
  variant = "pill",
  className = "",
}: {
  variant?: "pill" | "button" | "minimal";
  className?: string;
}) {
  const currentLangName = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const currentOption = getLanguageOption(currentLangName);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (langName: string) => {
    setLanguage(langName);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {variant === "pill" && (
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label="Select language"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-1.5 rounded-full border border-border-color/70 bg-white/80 px-2.5 py-1 text-xs font-semibold text-text-primary shadow-2xs hover:border-deep-teal hover:text-deep-teal transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-teal"
        >
          <Globe size={13} className="text-deep-teal" />
          <span>{currentOption.short}</span>
          <ChevronDown size={11} className={`text-text-secondary transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
      )}

      {variant === "button" && (
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label="Select language"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center justify-between w-full rounded-xl border border-border-color bg-surface px-3.5 py-2.5 text-xs font-semibold text-text-primary hover:border-deep-teal transition-all"
        >
          <div className="flex items-center gap-2">
            <Globe size={14} className="text-deep-teal" />
            <span>{currentOption.nativeName} ({currentOption.name})</span>
          </div>
          <ChevronDown size={14} className={`text-text-secondary transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
      )}

      {variant === "minimal" && (
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label="Select language"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-1 text-xs font-medium text-text-secondary hover:text-deep-teal transition-colors"
        >
          <Globe size={13} />
          <span>{currentOption.nativeName}</span>
          <ChevronDown size={10} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
      )}

      {isOpen && (
        <div
          role="listbox"
          className="absolute right-0 top-[calc(100%+0.45rem)] z-50 min-w-[170px] rounded-2xl border border-border-color bg-surface p-1.5 shadow-[0_16px_36px_rgba(23,35,38,0.14)] backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-text-secondary border-b border-border-color/50 mb-1">
            Regional Language
          </div>

          <div className="space-y-0.5">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = currentOption.code === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(lang.name)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                    isSelected
                      ? "bg-deep-teal text-white font-semibold shadow-2xs"
                      : "text-text-primary hover:bg-surface-subtle hover:text-deep-teal"
                  }`}
                >
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-xs">{lang.nativeName}</span>
                    <span className={`text-[10px] ${isSelected ? "text-white/80" : "text-text-secondary"}`}>
                      {lang.name}
                    </span>
                  </div>
                  {isSelected && <Check size={13} className="shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
