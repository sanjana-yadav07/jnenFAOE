"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, HeartHandshake, PhoneCall, Sparkles, Wind } from "lucide-react";
import { aiService } from "@/services/ai";
import { useAppStore } from "@/store/useAppStore";
import { normalizeLanguageName } from "@/lib/i18n";

export default function IVRSPage() {
  const [step, setStep] = useState(0); // 0: Question, 1: Response & Call, 2: Complete
  const language = useAppStore((store) => store.language);
  const survivorName = useAppStore((store) => store.survivorName);
  const currentCase = useAppStore((store) => store.currentCase);
  const victimToken = useAppStore((store) => store.victimToken);
  const docket = useAppStore((store) => store.docket);
  const addCounsellorMessage = useAppStore((store) => store.addCounsellorMessage);
  const addFollowUp = useAppStore((store) => store.addFollowUp);
  const addVoiceCheckIn = useAppStore((store) => store.addVoiceCheckIn);

  const [response, setResponse] = useState<string | null>(null);
  const [requestCall, setRequestCall] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const norm = normalizeLanguageName(language);

  const copy = {
    English: {
      back: "Check-in",
      eyebrow: "IVRS Check-in",
      title: "Support, by phone.",
      desc: "A low-reading-burden check-in for when speaking on a call feels easier.",
      steps: ["Question", "Response", "Complete"],
      qTitle: "How are things feeling today?",
      qSubtitle: "Choose what fits best, or skip if you'd rather not say.",
      optHeavy: "A little heavy today",
      optHeavyDesc: "Things have felt difficult or overwhelming.",
      optOkay: "Mostly okay",
      optOkayDesc: "Holding steady and taking things one step at a time.",
      optSkip: "Skip this question",
      optSkipDesc: "Prefer to proceed without recording a mood state.",
      callHeading: "Would you like a counsellor call?",
      callSubheading: "We can alert the counsellor team right away so they can reach out to you with support.",
      requestCallLabel: "Request a phone call from counsellor",
      requestCallSelected: "✓ Phone call callback requested",
      requestCallHelp: "Your counsellor will receive an instant notification to call you back on your registered phone number.",
      submitBtn: "Complete check-in",
      savingBtn: "Saving check-in...",
      savedTitle: "Check-in saved",
      savedCallMsg: "A phone call request has been sent to your counsellor. They will call you on your registered number shortly.",
      savedNoCallMsg: "Your phone check-in has been recorded. Thank you for checking in with yourself today.",
      homeCta: "Return to Home",
      feelBetterCta: "Explore Calm Exercises",
      taaraCta: "Talk to TAARA",
    },
    Hindi: {
      back: "चेक-इन",
      eyebrow: "IVRS चेक-इन",
      title: "फ़ोन पर सहारा",
      desc: "जब बोलकर चेक-इन करना आसान लगे, यह विकल्प चुनें।",
      steps: ["सवाल", "जवाब", "पूरा"],
      qTitle: "आज कैसा महसूस हो रहा है?",
      qSubtitle: "जो सबसे सही लगे उसे चुनें, या चाहें तो छोड़ दें।",
      optHeavy: "आज थोड़ा भारी लग रहा है",
      optHeavyDesc: "मन थोड़ा परेशान या थका हुआ है।",
      optOkay: "ज़्यादातर ठीक हूँ",
      optOkayDesc: "चीज़ें संभली हुई हैं और सहज महसूस कर रहा/रही हूँ।",
      optSkip: "इस सवाल को छोड़ें",
      optSkipDesc: "बिना मूड चुने आगे बढ़ें।",
      callHeading: "क्या आपको counsellor का फ़ोन चाहिए?",
      callSubheading: "हम आपकी counsellor टीम को तुरंत सूचना भेज सकते हैं ताकि वे आपसे संपर्क कर सकें।",
      requestCallLabel: "Counsellor से फ़ोन कॉल का अनुरोध करें",
      requestCallSelected: "✓ फ़ोन कॉल का अनुरोध चुना गया",
      requestCallHelp: "आपके counsellor को तुरंत सूचना मिलेगी कि आप कॉल पर बात करना चाहते हैं।",
      submitBtn: "चेक-इन पूरा करें",
      savingBtn: "सेव हो रहा है...",
      savedTitle: "चेक-इन सेव हो गया",
      savedCallMsg: "Counsellor को फ़ोन कॉल का अनुरोध भेज दिया गया है। वे जल्द ही आपके नंबर पर संपर्क करेंगे।",
      savedNoCallMsg: "आपका चेक-इन सुरक्षित रूप से रिकॉर्ड हो गया है। आज खुद का ख्याल रखने के लिए शुक्रिया।",
      homeCta: "डैशबोर्ड पर जाएं",
      feelBetterCta: "शांत गतिविधियाँ देखें",
      taaraCta: "तारा से बात करें",
    },
    Bengali: {
      back: "চেক-ইন",
      eyebrow: "IVRS চেক-ইন",
      title: "ফোনে সহায়তা",
      desc: "যখন ফোনে কথা বলে চেক-ইন করা সহজ মনে হয়, এটি বেছে নিন।",
      steps: ["প্রশ্ন", "প্রতিক্রিয়া", "সম্পূর্ণ"],
      qTitle: "আজ কেমন অনুভব করছেন?",
      qSubtitle: "যা সবচেয়ে ভালো মনে হয় তা নির্বাচন করুন, বা এড়িয়ে যান।",
      optHeavy: "আজ কিছুটা ভারী লাগছে",
      optHeavyDesc: "মন কিছুটা ক্লান্ত বা ভারাক্রান্ত।",
      optOkay: "বেশিরভাগ সময় ঠিক আছি",
      optOkayDesc: "পরিস্থিতি শান্ত ও নিয়ন্ত্রণে রয়েছে।",
      optSkip: "এই প্রশ্নটি এড়িয়ে যান",
      optSkipDesc: "কোনো বিকল্প না বেছে এগিয়ে যান।",
      callHeading: "আপনি কি কাউন্সেলরের ফোন কল চান?",
      callSubheading: "আমরা কাউন্সেলর টিমকে দ্রুত বার্তা পাঠাতে পারি যাতে তারা আপনার সাথে কথা বলতে পারেন।",
      requestCallLabel: "কাউন্সেলরের থেকে ফোন কল অনুরোধ করুন",
      requestCallSelected: "✓ ফোন কলের অনুরোধ গ্রহণ করা হয়েছে",
      requestCallHelp: "আপনার কাউন্সেলর দ্রুত নোটিফিকেশন পাবেন এবং আপনার নম্বরে কল করবেন।",
      submitBtn: "চেক-ইন সম্পন্ন করুন",
      savingBtn: "সংরক্ষণ হচ্ছে...",
      savedTitle: "চেক-ইন সংরক্ষিত হয়েছে",
      savedCallMsg: "কাউন্সেলরকে ফোন কলের অনুরোধ পাঠানো হয়েছে। তারা শীঘ্রই আপনার সাথে যোগাযোগ করবেন।",
      savedNoCallMsg: "আপনার ফোন চেক-ইন সফলভাবে সংরক্ষিত হয়েছে।",
      homeCta: "হোমে ফিরে যান",
      feelBetterCta: "শান্ত ব্যায়াম দেখুন",
      taaraCta: "তারার সাথে কথা বলুন",
    },
    Marathi: {
      back: "चेक-इन",
      eyebrow: "IVRS चेक-इन",
      title: "फोनवर आधार",
      desc: "जेव्हा फोनवर बोलून चेक-इन करणे सोपे वाटते, हा पर्याय निवडा.",
      steps: ["प्रश्न", "प्रतिसाद", "पूर्ण"],
      qTitle: "आज कसे वाटत आहे?",
      qSubtitle: "जे योग्य वाटेल ते निवडा किंवा पुढे जा.",
      optHeavy: "आज थोडे कठीण वाटत आहे",
      optHeavyDesc: "मन थोडे थकलेले किंवा अस्वस्थ वाटत आहे.",
      optOkay: "साधारणपणे ठीक आहे",
      optOkayDesc: "गोष्टी नियंत्रणात आहेत आणि बरे वाटत आहे.",
      optSkip: "हा प्रश्न वगळा",
      optSkipDesc: "मूड न निवडता पुढे जा.",
      callHeading: "तुम्हाला counsellor चा फोन हवा आहे का?",
      callSubheading: "आम्ही counsellor टीमला तातडीने संदेश पाठवू शकतो जेणेकरून ते तुमच्याशी संपर्क साधतील.",
      requestCallLabel: "Counsellor कडून फोन कॉलची विनंती करा",
      requestCallSelected: "✓ फोन कॉलची विनंती नोंदवली",
      requestCallHelp: "तुमच्या counsellor ला त्वरित सूचना दिली जाईल की तुम्हाला कॉलवर बोलायचे आहे.",
      submitBtn: "चेक-इन पूर्ण करा",
      savingBtn: "जतन होत आहे...",
      savedTitle: "चेक-इन जतन झाले",
      savedCallMsg: "Counsellor ला फोन कॉलची विनंती पाठवली आहे. ते लवकरच तुमच्या नंबरवर संपर्क साधतील.",
      savedNoCallMsg: "तुमचे फोन चेक-इन सुरक्षितपणे नोंदवले गेले आहे.",
      homeCta: "मुख्य पानावर जा",
      feelBetterCta: "शांतता व्यायाम पहा",
      taaraCta: "ताराशी बोला",
    },
    Tamil: {
      back: "செக்-இன்",
      eyebrow: "IVRS செக்-இன்",
      title: "தொலைபேசியில் ஆதரவு",
      desc: "அழைப்பில் பேசுவது எளிதாக இருக்கும் போது இந்த வழியைப் பயன்படுத்தவும்.",
      steps: ["கேள்வி", "பதில்", "முடிந்தது"],
      qTitle: "இன்று எப்படி உணர்கிறீர்கள்?",
      qSubtitle: "உங்களுக்கு பொருத்தமானதைத் தேர்ந்தெடுக்கவும் அல்லது தவிர்க்கவும்.",
      optHeavy: "இன்று சற்று பாரமாக உள்ளது",
      optHeavyDesc: "மனம் சற்று சோர்வாக அல்லது பாரமாக உணர்கிறது.",
      optOkay: "பெரும்பாலும் பரவாயில்லை",
      optOkayDesc: "சூழ்நிலை நிதானமாக உள்ளது.",
      optSkip: "இந்த கேள்வியைத் தவிர்க்கவும்",
      optSkipDesc: "தேர்வு செய்யாமல் தொடரவும்.",
      callHeading: "ஆலோசகர் உங்களிடம் பேச வேண்டுமா?",
      callSubheading: "ஆலோசகர் குழு உங்களுக்கு அழைக்க உடனடியாக செய்தி அனுப்புகிறோம்.",
      requestCallLabel: "ஆலோசகரிடம் இருந்து அழைப்பைக் கோரவும்",
      requestCallSelected: "✓ அழைப்பு கோரப்பட்டது",
      requestCallHelp: "உங்களுக்கு அழைக்க உங்கள் ஆலோசகருக்கு உடனடியாக அறிவிப்பு அனுப்பப்படும்.",
      submitBtn: "செக்-இன் முடிக்கவும்",
      savingBtn: "சேமிக்கிறது...",
      savedTitle: "செக்-இன் சேமிக்கப்பட்டது",
      savedCallMsg: "ஆலோசகருக்கு அழைப்பு கோரிக்கை அனுப்பப்பட்டுள்ளது. அவர்கள் விரைவில் தொடர்பு கொள்வார்கள்.",
      savedNoCallMsg: "உங்கள் தொலைபேசி செக்-இன் வெற்றிகரமாகப் பதிவு செய்யப்பட்டது.",
      homeCta: "முகப்புக்குச் செல்லவும்",
      feelBetterCta: "அமைதி பயிற்சிகள்",
      taaraCta: "தாராவிடம் பேசுங்கள்",
    },
    Telugu: {
      back: "చెక్-ఇన్",
      eyebrow: "IVRS చెక్-ఇన్",
      title: "ఫోన్‌లో మద్దతు",
      desc: "కాల్‌లో మాట్లాడటం సులభంగా అనిపించినప్పుడు ఈ ఎంపికను ఎంచుకోండి.",
      steps: ["ప్రశ్న", "స్పందన", "పూర్తయింది"],
      qTitle: "ఈ రోజు ఎలా అనిపిస్తోంది?",
      qSubtitle: "మీకు సరిపోయేదాన్ని ఎంచుకోండి లేదా దాటవేయండి.",
      optHeavy: "ఈ రోజు కాస్త భారంగా ఉంది",
      optHeavyDesc: "మనస్సు కాస్త అలసిపోయినట్లుగా ఉంది.",
      optOkay: "చాలా వరకు బాగానే ఉంది",
      optOkayDesc: "పరిస్థితి ప్రశాంతంగా ఉంది.",
      optSkip: "ఈ ప్రశ్నను దాటవేయండి",
      optSkipDesc: "ఎంపిక చేయకుండా కొనసాగించండి.",
      callHeading: "కౌన్సిలర్ నుండి ఫోన్ కాల్ కావాలా?",
      callSubheading: "వారు మీతో మాట్లాడేలా మేము కౌన్సిలర్ బృందానికి వెంటనే తెలియజేస్తాము.",
      requestCallLabel: "కౌన్సిలర్ నుండి ఫోన్ కాల్ అభ్యర్థించండి",
      requestCallSelected: "✓ ఫోన్ కాల్ అభ్యర్థన పంపబడింది",
      requestCallHelp: "మీతో మాట్లాడాలని మీ కౌన్సిలర్‌కు తక్షణ నోటిఫికేషన్ వెళ్తుంది.",
      submitBtn: "చెక్-ఇన్ పూర్తి చేయండి",
      savingBtn: "సేవ్ అవుతోంది...",
      savedTitle: "చెక్-ఇన్ సేవ్ అయింది",
      savedCallMsg: "కౌన్సిలర్‌కు కాల్ అభ్యర్థన పంపబడింది. వారు త్వరలోనే మీకు కాల్ చేస్తారు.",
      savedNoCallMsg: "మీ ఫోన్ చెక్-ఇన్ రికార్డ్ అయింది.",
      homeCta: "హోమ్‌కు వెళ్లండి",
      feelBetterCta: "ప్రశాంతత వ్యాయామాలు",
      taaraCta: "తారాతో మాట్లాడండి",
    },
  }[norm] ?? {
    back: "Check-in",
    eyebrow: "IVRS Check-in",
    title: "Support, by phone.",
    desc: "A low-reading-burden check-in for when speaking on a call feels easier.",
    steps: ["Question", "Response", "Complete"],
    qTitle: "How are things feeling today?",
    qSubtitle: "Choose what fits best, or skip if you'd rather not say.",
    optHeavy: "A little heavy today",
    optHeavyDesc: "Things have felt difficult or overwhelming.",
    optOkay: "Mostly okay",
    optOkayDesc: "Holding steady and taking things one step at a time.",
    optSkip: "Skip this question",
    optSkipDesc: "Prefer to proceed without recording a mood state.",
    callHeading: "Would you like a counsellor call?",
    callSubheading: "We can alert the counsellor team right away so they can reach out to you with support.",
    requestCallLabel: "Request a phone call from counsellor",
    requestCallSelected: "✓ Phone call callback requested",
    requestCallHelp: "Your counsellor will receive an instant notification to call you back on your registered phone number.",
    submitBtn: "Complete check-in",
    savingBtn: "Saving check-in...",
    savedTitle: "Check-in saved",
    savedCallMsg: "A phone call request has been sent to your counsellor. They will call you on your registered number shortly.",
    savedNoCallMsg: "Your phone check-in has been recorded. Thank you for checking in with yourself today.",
    homeCta: "Return to Home",
    feelBetterCta: "Explore Calm Exercises",
    taaraCta: "Talk to TAARA",
  };

  async function saveCheckIn() {
    setLoading(true);
    setError(null);
    try {
      // 1. Submit to AI / IVRS API
      const langCode = norm === "Hindi" ? "hi" : norm === "Bengali" ? "bn" : norm === "Marathi" ? "mr" : norm === "Tamil" ? "ta" : norm === "Telugu" ? "te" : "en";
      await aiService.submitIvrsCheckIn(langCode, { wellbeing: response ?? "skip" }, requestCall);

      // 2. If phone call requested, notify counsellor immediately
      if (requestCall) {
        const survivorDisplay = survivorName || "Sunita Kumari";
        const docketNum = docket || currentCase?.docket || "N/A";
        const token = victimToken || "victim-token";

        // Push alert/message to counsellor queue
        addCounsellorMessage({
          id: crypto.randomUUID(),
          caseId: currentCase?.id ?? token,
          victimToken: token,
          docket: docketNum,
          survivorName: survivorDisplay,
          subject: "Urgent Callback Request (IVRS)",
          urgency: "urgent",
          message: `${survivorDisplay} requested a phone call / callback during IVRS check-in.`,
          createdAt: new Date().toISOString(),
          read: false,
        });

        // Add to follow-up schedule as requested by survivor
        addFollowUp({
          id: crypto.randomUUID(),
          caseId: currentCase?.id ?? token,
          victimToken: token,
          survivorName: survivorDisplay,
          docket: docketNum,
          date: new Date().toISOString(),
          status: "REQUESTED",
          initiatedBy: "SURVIVOR",
          requestedBy: "survivor",
          notes: `IVRS Callback Request (Wellbeing: ${response ?? "not specified"})`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      // 3. Save voice check-in record
      addVoiceCheckIn({
        id: crypto.randomUUID(),
        victimToken: victimToken ?? undefined,
        survivorName: survivorName ?? undefined,
        docket: docket ?? undefined,
        createdAt: new Date().toISOString(),
        channel: "ivrs",
        requestCounsellorCall: requestCall,
        transcript: `IVRS Phone Check-in: Mood state [${response ?? "skip"}]. Counsellor call requested: ${requestCall ? "YES" : "NO"}`,
      });

      setStep(2);
    } catch {
      setError(norm === "Hindi" ? "फ़ोन चेक-इन सेव नहीं हो पाया। कृपया फिर कोशिश करें।" : "The phone check-in could not be saved. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-5 pb-12 md:px-10 xl:px-14">
      {/* Back button */}
      <Link href="/survivor/check-in" className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-deep-teal transition-colors">
        <ArrowLeft size={16} /> {copy.back}
      </Link>

      <div className="mx-auto mt-7 max-w-3xl">
        {/* Header */}
        <p className="text-xs font-bold uppercase tracking-[.2em] text-text-secondary">{copy.eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl text-text-primary md:text-5xl">{copy.title}</h1>
        <p className="mt-3 text-base sm:text-lg text-text-secondary">{copy.desc}</p>

        {/* 3-Step Clean Progress Bar */}
        <div className="mt-8 grid grid-cols-3 gap-2.5 sm:gap-4">
          {copy.steps.map((name, index) => {
            const isPassed = index < step;
            const isCurrent = index === step;
            return (
              <div key={name} className="flex flex-col">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isCurrent ? "bg-deep-teal shadow-xs" : isPassed ? "bg-primary-teal-light/70" : "bg-border-color/60"
                  }`}
                />
                <div className="mt-2 flex items-center gap-1.5">
                  <span className={`text-[11px] font-bold ${isCurrent ? "text-deep-teal" : isPassed ? "text-text-primary" : "text-text-secondary"}`}>
                    0{index + 1}.
                  </span>
                  <span className={`text-[11px] font-semibold ${isCurrent ? "text-deep-teal" : isPassed ? "text-text-primary" : "text-text-secondary"}`}>
                    {name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Main Surface */}
        <div className="surface mt-8 rounded-[28px] p-6 sm:p-10 border border-border-color/70 shadow-sm transition-all">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-pale-sage text-deep-teal shadow-xs">
            <PhoneCall size={26} />
          </div>

          {/* ── STEP 0: QUESTION ────────────────────────────────────────── */}
          {step === 0 && (
            <div className="mt-6 text-center animate-fadeIn">
              <h2 className="font-display text-2xl sm:text-3xl text-text-primary">{copy.qTitle}</h2>
              <p className="mt-2.5 text-sm text-text-secondary">{copy.qSubtitle}</p>

              <div className="mx-auto mt-7 grid max-w-lg gap-3 text-left">
                {/* Option: Heavy */}
                <button
                  onClick={() => {
                    setResponse("heavy");
                    setStep(1);
                  }}
                  className="group flex items-start gap-4 rounded-2xl border border-border-color bg-surface p-4.5 transition-all hover:border-deep-teal hover:bg-[#eef8f4] hover:shadow-xs active:scale-[0.99]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff0e5] text-xl">🌧️</span>
                  <div className="min-w-0">
                    <p className="font-semibold text-text-primary group-hover:text-deep-teal transition-colors">{copy.optHeavy}</p>
                    <p className="mt-0.5 text-xs text-text-secondary leading-relaxed">{copy.optHeavyDesc}</p>
                  </div>
                </button>

                {/* Option: Okay */}
                <button
                  onClick={() => {
                    setResponse("okay");
                    setStep(1);
                  }}
                  className="group flex items-start gap-4 rounded-2xl border border-border-color bg-surface p-4.5 transition-all hover:border-deep-teal hover:bg-[#eef8f4] hover:shadow-xs active:scale-[0.99]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pale-sage text-xl">🌤️</span>
                  <div className="min-w-0">
                    <p className="font-semibold text-text-primary group-hover:text-deep-teal transition-colors">{copy.optOkay}</p>
                    <p className="mt-0.5 text-xs text-text-secondary leading-relaxed">{copy.optOkayDesc}</p>
                  </div>
                </button>

                {/* Option: Skip */}
                <button
                  onClick={() => {
                    setResponse("skip");
                    setStep(1);
                  }}
                  className="group flex items-start gap-4 rounded-2xl border border-dashed border-border-color/90 bg-surface/60 p-4.5 transition-all hover:border-deep-teal hover:bg-surface-subtle active:scale-[0.99]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-subtle text-text-secondary text-sm font-bold">
                    —
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-text-secondary group-hover:text-text-primary transition-colors">{copy.optSkip}</p>
                    <p className="mt-0.5 text-xs text-text-secondary/80 leading-relaxed">{copy.optSkipDesc}</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 1: RESPONSE & CALL REQUEST ────────────────────────── */}
          {step === 1 && (
            <div className="mt-6 text-center animate-fadeIn">
              <h2 className="font-display text-2xl sm:text-3xl text-text-primary">{copy.callHeading}</h2>
              <p className="mt-2.5 max-w-md mx-auto text-sm text-text-secondary">{copy.callSubheading}</p>

              {/* Call toggle card */}
              <div className="mx-auto mt-7 max-w-md">
                <button
                  type="button"
                  onClick={() => setRequestCall(!requestCall)}
                  className={`w-full rounded-2xl border p-5 text-left transition-all ${
                    requestCall
                      ? "border-deep-teal bg-pale-sage/80 shadow-xs"
                      : "border-border-color bg-surface hover:border-deep-teal/60 hover:bg-surface-subtle"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`flex h-9 w-9 items-center justify-center rounded-full ${requestCall ? "bg-deep-teal text-white" : "bg-surface-subtle text-text-secondary"}`}>
                        <PhoneCall size={17} />
                      </span>
                      <span className={`text-sm font-bold ${requestCall ? "text-deep-teal" : "text-text-primary"}`}>
                        {requestCall ? copy.requestCallSelected : copy.requestCallLabel}
                      </span>
                    </div>
                    <span className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-border-color transition-colors ${requestCall ? "bg-deep-teal" : "bg-border-color"}`}>
                      <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-xs transition-transform ${requestCall ? "translate-x-6" : "translate-x-1"}`} />
                    </span>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-text-secondary">
                    {copy.requestCallHelp}
                  </p>
                </button>
              </div>

              {error && <p className="mt-4 text-sm font-semibold text-warm-peach">{error}</p>}

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setStep(0)}
                  className="w-full sm:w-auto rounded-full px-6 py-3 text-sm font-bold text-text-secondary hover:bg-surface-subtle transition-colors"
                >
                  {copy.back}
                </button>
                <button
                  onClick={() => void saveCheckIn()}
                  disabled={loading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-deep-teal px-8 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-primary-teal hover:shadow-lg disabled:opacity-50"
                >
                  {loading ? copy.savingBtn : copy.submitBtn}
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: COMPLETE ────────────────────────────────────────── */}
          {step === 2 && (
            <div className="mt-6 text-center animate-fadeIn">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-bg text-success shadow-sm">
                <CheckCircle2 size={32} />
              </span>
              <h2 className="mt-5 font-display text-3xl text-[#2b473b]">{copy.savedTitle}</h2>
              <p className="mt-3 max-w-md mx-auto text-sm leading-relaxed text-text-secondary">
                {requestCall ? copy.savedCallMsg : copy.savedNoCallMsg}
              </p>

              {requestCall && (
                <div className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-success-bg px-4 py-2.5 text-xs font-semibold text-success">
                  <Check size={15} /> Counsellor Alert Active
                </div>
              )}

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/survivor"
                  className="rounded-full bg-deep-teal px-7 py-3 text-sm font-bold text-white shadow-sm hover:bg-primary-teal transition-all"
                >
                  {copy.homeCta}
                </Link>
                <Link
                  href="/survivor/feel-better"
                  className="inline-flex items-center gap-2 rounded-full border border-border-color bg-surface px-6 py-3 text-sm font-bold text-deep-teal hover:bg-pale-sage/50 transition-all"
                >
                  <Wind size={16} /> {copy.feelBetterCta}
                </Link>
                <Link
                  href="/survivor/taara"
                  className="inline-flex items-center gap-2 rounded-full border border-border-color bg-surface px-6 py-3 text-sm font-bold text-deep-teal hover:bg-pale-sage/50 transition-all"
                >
                  <Sparkles size={16} /> {copy.taaraCta}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
