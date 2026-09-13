"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, BookHeart, FileText, History, LockKeyhole, Scale, Settings2, SlidersHorizontal } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { getMySpaceItems, t } from "@/lib/i18n";

const iconMap: Record<string, any> = {
  FileText,
  Scale,
  BookHeart,
  History,
  LockKeyhole,
  SlidersHorizontal,
  Sparkles: SlidersHorizontal,
};

export default function MySpacePage() {
  const language = useAppStore((state) => state.language);
  const items = getMySpaceItems(language);

  return (
    <div className="px-5 pb-10 md:px-10 xl:px-14">
      <Link href="/survivor" className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary">
        <ArrowLeft size={16} /> {t("nav.home", language)}
      </Link>

      <div className="saath-fade mt-6">
        <p className="text-xs font-bold uppercase tracking-[.2em] text-[#7e918b]">
          {t("nav.mySpace", language)}
        </p>
        <h1 className="mt-3 font-display text-5xl leading-none text-[#172326] md:text-6xl">
          {language === "Hindi"
            ? "एक जगह जो हमेशा आपकी है।"
            : language === "Bengali"
            ? "এমন একটি জায়গা যা সবসময় আপনার।"
            : language === "Marathi"
            ? "एक जागा जी नेहमी तुमचीच राहील."
            : language === "Tamil"
            ? "எப்போதும் உங்களுக்கான ஒரு பாதுகாப்பான இடம்."
            : language === "Telugu"
            ? "ఎల్లప్పుడూ మీదే అయిన ఒక ప్రశాంత స్థలం."
            : "A place that stays yours."}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#63736e]">
          {language === "Hindi"
            ? "आपका केस, आपकी यात्रा और आपकी पसंद — एक शांत, निजी जगह में।"
            : language === "Bengali"
            ? "আপনার মামলা, আপনার যাত্রা এবং আপনার পছন্দ — একটি শান্ত ব্যক্তিগত স্থানে।"
            : language === "Marathi"
            ? "तुमची केस, तुमचा प्रवास आणि तुमच्या निवडी — एका शांत आणि खाजगी जागेत."
            : language === "Tamil"
            ? "உங்கள் வழக்கு, உங்கள் பயணம் மற்றும் உங்கள் விருப்பங்கள் — ஒரே இடத்தில்."
            : language === "Telugu"
            ? "మీ కేసు, మీ ప్రయాణం మరియు మీ ప్రాధాన్యతలు — ఒకే ప్రశాంత స్థలంలో."
            : "Your case, your journey, and your choices — gathered in one calm, private space."}
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map(({ href, icon, title, desc, tone }) => {
          const Icon = iconMap[icon] || FileText;
          return (
            <Link
              href={href}
              key={href}
              className="surface group rounded-[26px] p-6 hover:-translate-y-1 hover:shadow-xl transition-all"
            >
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tone}`}>
                <Icon size={21} />
              </span>
              <h2 className="mt-6 font-display text-2xl text-[#243630]">
                {title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#6b7b75]">
                {desc}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-[#0f766e]">
                {language === "Hindi" ? "खोलें" : language === "Bengali" ? "খুলুন" : language === "Marathi" ? "उघडा" : language === "Tamil" ? "திறக்கவும்" : language === "Telugu" ? "తెరవండి" : "Open"} <ArrowRight size={14} />
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 flex items-center gap-4 rounded-[26px] border border-[#c8d3d0]/60 bg-[#f4f6ec]/70 p-5 text-sm text-[#60706a]">
        <Settings2 size={19} className="text-[#0f766e] shrink-0" />
        <span>
          {language === "Hindi"
            ? "SAATH पूरी तरह सहमति पर आधारित है। सहायता हमेशा उपलब्ध रहेगी चाहे निगरानी सक्रिय हो, रुकी हो या बंद।"
            : language === "Bengali"
            ? "SAATH সম্পূর্ণভাবে সম্মতির ভিত্তিতে কাজ করে। সহায়তা সবসময় আপনার জন্য প্রস্তুত।"
            : language === "Marathi"
            ? "SAATH पूर्णपणे संमतीवर आधारित आहे. मदत नेहमी उपलब्ध राहील."
            : language === "Tamil"
            ? "SAATH முற்றிலும் உங்கள் ஒப்புதலின் அடிப்படையில் செயல்படுகிறது. ஆதரவு எப்போதும் கிடைக்கும்."
            : language === "Telugu"
            ? "SAATH పూర్తిగా సమ్మతి ఆధారంగా పనిచేస్తుంది. మద్దతు ఎల్లప్పుడూ అందుబాటులో ఉంటుంది."
            : "SAATH is built around consent. You can pause or stop monitoring while support remains available."}
        </span>
      </div>
    </div>
  );
}