export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  short: string;
  locale: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English", short: "EN", locale: "en-IN" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", short: "हिं", locale: "hi-IN" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", short: "বাং", locale: "bn-IN" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", short: "मरा", locale: "mr-IN" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", short: "தமி", locale: "ta-IN" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", short: "తెలు", locale: "te-IN" },
];

export function normalizeLanguageName(lang: string | null | undefined): string {
  if (!lang) return "English";
  const lower = lang.toLowerCase().trim();
  if (lower.startsWith("hi")) return "Hindi";
  if (lower.startsWith("bn") || lower.includes("bengali") || lower.includes("bangla")) return "Bengali";
  if (lower.startsWith("mr") || lower.includes("marathi")) return "Marathi";
  if (lower.startsWith("ta") || lower.includes("tamil")) return "Tamil";
  if (lower.startsWith("te") || lower.includes("telugu")) return "Telugu";
  return "English";
}

export function getLanguageOption(lang: string | null | undefined): LanguageOption {
  const norm = normalizeLanguageName(lang);
  return SUPPORTED_LANGUAGES.find((l) => l.name === norm) || SUPPORTED_LANGUAGES[0];
}

/* ─────────────────────────────────────────────────────────────
   Universal Navigation & UI Elements
───────────────────────────────────────────────────────────── */
export const TRANSLATIONS: Record<string, Record<string, string>> = {
  // Navigation
  "nav.home": {
    English: "Home",
    Hindi: "होम",
    Bengali: "হোম",
    Marathi: "मुख्यपृष्ठ",
    Tamil: "முகப்பு",
    Telugu: "హోమ్",
  },
  "nav.checkIn": {
    English: "Check-in",
    Hindi: "चेक-इन",
    Bengali: "চেক-ইন",
    Marathi: "तपासणी",
    Tamil: "பதிவுசெய்க",
    Telugu: "చెక్-ఇన్",
  },
  "nav.feelBetter": {
    English: "Feel better",
    Hindi: "राहत पाएं",
    Bengali: "ভালো থাকুন",
    Marathi: "शांत वाटा",
    Tamil: "நலம் பெறுங்கள்",
    Telugu: "ఉపశమనం పొందండి",
  },
  "nav.sahayak": {
    English: "Sahayak",
    Hindi: "सहायक",
    Bengali: "সহায়ক",
    Marathi: "सहाय्यक",
    Tamil: "சஹாயக்",
    Telugu: "సహాయక్",
  },
  "nav.mySpace": {
    English: "My space",
    Hindi: "मेरी जगह",
    Bengali: "আমার স্থান",
    Marathi: "माझी जागा",
    Tamil: "என் இடம்",
    Telugu: "నా స్పేస్",
  },
  "nav.support": {
    English: "Support",
    Hindi: "सहायता",
    Bengali: "সহায়তা",
    Marathi: "मदत",
    Tamil: "ஆதரவு",
    Telugu: "మద్దతు",
  },
  "nav.rights": {
    English: "Know your rights",
    Hindi: "अपने अधिकार जानें",
    Bengali: "আপনার অধিকার জানুন",
    Marathi: "आपले हक्क जाणून घ्या",
    Tamil: "உங்கள் உரிமைகளை அறியுங்கள்",
    Telugu: "మీ హక్కులను తెలుసుకోండి",
  },
  "nav.profile": {
    English: "My profile",
    Hindi: "मेरी प्रोफ़ाइल",
    Bengali: "আমার প্রোফাইল",
    Marathi: "माझे प्रोफाइल",
    Tamil: "என் சுயவிவரம்",
    Telugu: "నా ప్రొఫైల్",
  },
  "nav.privacy": {
    English: "Privacy & settings",
    Hindi: "गोपनीयता और नियंत्रण",
    Bengali: "গোপনীয়তা ও নিয়ন্ত্রণ",
    Marathi: "गोपनीयता आणि सेटिंग्ज",
    Tamil: "தனியுரிமை & அமைப்புகள்",
    Telugu: "గోప్యత & సెట్టింగ్‌లు",
  },
  "nav.signOut": {
    English: "Sign out",
    Hindi: "साइन आउट",
    Bengali: "সাইন আউট",
    Marathi: "साइन आउट",
    Tamil: "வெளியேறு",
    Telugu: "సైన్ అవుట్",
  },

  // Header
  "header.safety": {
    English: "Safety resources",
    Hindi: "सुरक्षा संसाधन",
    Bengali: "নিরাপত্তা সম্পদ",
    Marathi: "सुरक्षा संसाधने",
    Tamil: "பாதுகாப்பு வளங்கள்",
    Telugu: "భద్రతా వనరులు",
  },
  "header.notifications": {
    English: "Notifications",
    Hindi: "सूचनाएँ",
    Bengali: "বিজ্ঞপ্তি",
    Marathi: "सूचना",
    Tamil: "அறிவிப்புகள்",
    Telugu: "నోటిఫికేషన్‌లు",
  },
  "header.activeSession": {
    English: "Active survivor session",
    Hindi: "सक्रिय सर्वाइवर सत्र",
    Bengali: "সক্রিয় সার্ভাইভার সেশন",
    Marathi: "सक्रिय वापरकर्ता सत्र",
    Tamil: "செயலில் உள்ள அமர்வு",
    Telugu: "క్రియాశీల సెషన్",
  },

  // Common
  "common.notAlone": {
    English: "You don't have to walk alone.",
    Hindi: "आपको अकेले चलने की ज़रूरत नहीं है।",
    Bengali: "আপনাকে একা চলতে হবে না।",
    Marathi: "तुम्हाला एकटे चालण्याची गरज नाही.",
    Tamil: "நீங்கள் தனியாக நடக்க வேண்டியதில்லை.",
    Telugu: "మీరు ఒంటరిగా నడవవలసిన అవసరం లేదు.",
  },
  "common.save": {
    English: "Save",
    Hindi: "सहेजें",
    Bengali: "সংরক্ষণ করুন",
    Marathi: "जतन करा",
    Tamil: "சேமி",
    Telugu: "సేవ్ చేయండి",
  },
  "common.back": {
    English: "Back",
    Hindi: "पीछे जाएं",
    Bengali: "ফিরে যান",
    Marathi: "मागे",
    Tamil: "பின்செல்",
    Telugu: "వెనుకకు",
  },
};

export function t(key: string, languageName: string): string {
  const norm = normalizeLanguageName(languageName);
  const entry = TRANSLATIONS[key];
  if (!entry) return key;
  return entry[norm] || entry["English"] || key;
}

/* ─────────────────────────────────────────────────────────────
   Home Dashboard Content
───────────────────────────────────────────────────────────── */
export interface HomeTranslations {
  greeting: string;
  enough: string;
  privateSpace: string;
  quickCheckInTitle: string;
  checkInHeading: string;
  moodPrompt: string;
  moods: {
    light: string;
    heavy: string;
    veryHeavy: string;
    okay: string;
  };
  selected: string;
  continueCheckIn: string;
  careCardTitle: string;
  careCardDesc: string;
  careCardCta: string;
  wayCardTitle: string;
  wayCardDesc: string;
  caseCardTitle: string;
  hearingLabel: string;
  supportTeam: string;
  privacyNotice: string;
  demoData: string;
}

export function getHomeTranslations(lang: string): HomeTranslations {
  const norm = normalizeLanguageName(lang);
  const hour = typeof window !== "undefined" ? new Date().getHours() : 10;

  switch (norm) {
    case "Hindi":
      return {
        greeting: "नमस्ते",
        enough: "आप यहाँ हैं। इतना काफ़ी है।",
        privateSpace: "आपकी जगह निजी और आपकी सहमति के अनुसार है",
        quickCheckInTitle: "त्वरित चेक-इन",
        checkInHeading: "आज आप कैसा महसूस कर रहे हैं?",
        moodPrompt: "एक पल रुकें और वह भाव चुनें जो अभी सबसे सही लगे।",
        moods: {
          light: "ठीक हूँ",
          heavy: "थोड़ा मुश्किल है",
          veryHeavy: "बहुत मुश्किल है",
          okay: "बहुत भारी लग रहा है",
        },
        selected: "चुना गया",
        continueCheckIn: "चेक-इन जारी रखें",
        careCardTitle: "आपके लिए कुछ शांत पल",
        careCardDesc: "दो मिनट रुककर एक सौम्य ग्राउंडिंग गतिविधि करें।",
        careCardCta: "शुरू करें",
        wayCardTitle: "अपने तरीके से चेक-इन",
        wayCardDesc: "टेक्स्ट, आवाज़ या IVRS में से जो सहज लगे चुनें।",
        caseCardTitle: "आपका केस",
        hearingLabel: "अगली सुनवाई",
        supportTeam: "आपकी सहायता टीम आपके साथ है",
        privacyNotice: "आपकी पसंद, सहमति और गोपनीयता नियंत्रण हमेशा आपके पास हैं",
        demoData: "सिंथेटिक डेमो डेटा",
      };

    case "Bengali":
      return {
        greeting: "নমস্কার",
        enough: "আপনি এখানে আছেন। এটুকুই যথেষ্ট।",
        privateSpace: "আপনার স্থান সম্পূর্ণ ব্যক্তিগত ও আপনার সম্মতিতে সুরক্ষিত",
        quickCheckInTitle: "দ্রুত চেক-ইন",
        checkInHeading: "আজ কেমন অনুভব করছেন?",
        moodPrompt: "এক মুহূর্ত থামুন এবং যা সবচেয়ে কাছের মনে হয় তা বেছে নিন।",
        moods: {
          light: "আমি ঠিক আছি",
          heavy: "একটু কঠিন",
          veryHeavy: "বেশ কঠিন",
          okay: "অত্যধিক ভারী লাগছে",
        },
        selected: "নির্বাচিত",
        continueCheckIn: "চেক-ইন চালিয়ে যান",
        careCardTitle: "আপনার জন্য কিছু শান্তির মুহূর্ত",
        careCardDesc: "একটি সহজ গ্রাউন্ডিং অনুশীলনের সাথে নিজেকে শান্ত করুন।",
        careCardCta: "শুরু করুন",
        wayCardTitle: "নিজের সুবিধাজনক উপায়ে চেক-ইন",
        wayCardDesc: "টেক্সট, ভয়েস বা IVRS — যা স্বস্তিদায়ক মনে হয়।",
        caseCardTitle: "আপনার মামলা",
        hearingLabel: "পরবর্তী শুনানি",
        supportTeam: "আপনার সহায়তা দল আপনার সাথে আছে",
        privacyNotice: "আপনার গোপনীয়তা ও নিয়ন্ত্রণ সবসময় আপনার হাতে।",
        demoData: "সিন্থেটিক ডেমো ডেটা",
      };

    case "Marathi":
      return {
        greeting: "नमस्कार",
        enough: "तुम्ही इथे आहात, हेच पुरेसे आहे.",
        privateSpace: "तुमची जागा खाजगी आणि तुमच्या संमतीनुसार सुरक्षित आहे",
        quickCheckInTitle: "जलद तपासणी",
        checkInHeading: "आज कसे वाटत आहे?",
        moodPrompt: "एक क्षण थांबा आणि जे सर्वात जवळचे वाटते ते निवडा.",
        moods: {
          light: "मी ठीक आहे",
          heavy: "थोडे कठीण वाटत आहे",
          veryHeavy: "खूप कठीण वाटत आहे",
          okay: "खूप ताण जाणवत आहे",
        },
        selected: "निवडलेले",
        continueCheckIn: "तपासणी पुढे सुरू ठेवा",
        careCardTitle: "तुमच्यासाठी काही शांत क्षण",
        careCardDesc: "दोन मिनिटे थांबून मनाला शांत करणारे व्यायाम करा.",
        careCardCta: "सुरू करा",
        wayCardTitle: "तुमच्या आवडीनुसार चेक-इन",
        wayCardDesc: "मजकूर, आवाज किंवा IVRS — जे सोयीचे वाटेल ते निवडा.",
        caseCardTitle: "तुमची केस",
        hearingLabel: "पुढील सुनावणी",
        supportTeam: "तुमची मदत करणारी टीम तुमच्या सोबत आहे",
        privacyNotice: "तुमची गोपनीयता आणि नियंत्रण नेहमी तुमच्याकडेच असते.",
        demoData: "सिंथेटिक डेमो डेटा",
      };

    case "Tamil":
      return {
        greeting: "வணக்கம்",
        enough: "நீங்கள் இங்கு இருப்பது போதுமானது.",
        privateSpace: "உங்கள் இடம் முற்றிலும் தனிப்பட்டதும் உங்கள் ஒப்புதலுடன் கூடியதும்",
        quickCheckInTitle: "விரைவு பதிவு",
        checkInHeading: "இன்று நீங்கள் எவ்வாறு உணர்கிறீர்கள்?",
        moodPrompt: "ஒரு கணம் நின்று தற்போது உங்களுக்குப் பொருந்தும் உணர்வைத் தேர்ந்தெடுக்கவும்.",
        moods: {
          light: "நலமாக உள்ளேன்",
          heavy: "சற்று கடினமாக உள்ளது",
          veryHeavy: "மிகவும் கடினமாக உள்ளது",
          okay: "தாங்க இயலாத பாரம்",
        },
        selected: "தேர்ந்தெடுக்கப்பட்டது",
        continueCheckIn: "தொடரவும்",
        careCardTitle: "உங்களுக்கான அமைதிப் பயிற்சி",
        careCardDesc: "இரு நிமிடங்கள் அமைதியாக இருந்து உடலையும் மனதையும் அமைதிப்படுத்துங்கள்.",
        careCardCta: "தொடங்குங்கள்",
        wayCardTitle: "உங்கள் வழியில் பதிவு செய்யுங்கள்",
        wayCardDesc: "உரை, குரல் அல்லது IVRS — எது உங்களுக்கு எளிதோ அதைத் தேர்வுசெய்யவும்.",
        caseCardTitle: "உங்கள் வழக்கு",
        hearingLabel: "அடுத்த விசாரணை",
        supportTeam: "உங்கள் ஆதரவுக் குழு உங்களுடன் உள்ளது",
        privacyNotice: "உங்கள் தனியுரிமையும் கட்டுப்பாடும் எப்போதும் உங்களிடமே இருக்கும்.",
        demoData: "டெமோ தரவு",
      };

    case "Telugu":
      return {
        greeting: "నమస్కారం",
        enough: "మీరు ఇక్కడ ఉన్నారు. ఇది చాలు.",
        privateSpace: "మీ స్థలం వ్యక్తిగతమైనది మరియు మీ సమ్మతితో రక్షించబడింది",
        quickCheckInTitle: "త్వరిత చెక్-ఇన్",
        checkInHeading: "ఈ రోజు మీరు ఎలా భావిస్తున్నారు?",
        moodPrompt: "ఒక క్షణం ఆగి, ప్రస్తుతం మీకు సరిపోయే భావాన్ని ఎంచుకోండి.",
        moods: {
          light: "నేను బాగానే ఉన్నాను",
          heavy: "కొంచెం కష్టంగా ఉంది",
          veryHeavy: "చాలా కష్టంగా ఉంది",
          okay: "తీవ్రమైన ఒత్తిడిలో ఉన్నాను",
        },
        selected: "ఎంపిక చేయబడింది",
        continueCheckIn: "చెక్-ఇన్ కొనసాగించండి",
        careCardTitle: "మీ కోసం ప్రశాంతమైన సమయం",
        careCardDesc: "రెండు నిమిషాలు ఆగి మనస్సును ప్రశాంతపరుచుకోండి.",
        careCardCta: "ప్రారంభించండి",
        wayCardTitle: "మీకు అనువైన మార్గంలో చెక్-ఇన్",
        wayCardDesc: "టెక్స్ట్, వాయిస్ లేదా IVRS — ఏది సౌకర్యంగా ఉంటే అది ఎంచుకోండి.",
        caseCardTitle: "మీ కేసు",
        hearingLabel: "తదుపరి విచారణ",
        supportTeam: "మీ సహాయ బృందం మీకు తోడుగా ఉంది",
        privacyNotice: "మీ గోప్యత మరియు నియంత్రణ ఎల్లప్పుడూ మీ చేతుల్లోనే ఉంటాయి.",
        demoData: "డెమో డేటా",
      };

    default:
      return {
        greeting: hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening",
        enough: "Take today at your own pace.",
        privateSpace: "Your space is private and consent-first",
        quickCheckInTitle: "Quick check-in",
        checkInHeading: "How are things feeling today?",
        moodPrompt: "Take a moment and pick the one that feels closest right now.",
        moods: {
          light: "I'm okay",
          heavy: "A little heavy",
          veryHeavy: "Quite heavy",
          okay: "I'm overwhelmed",
        },
        selected: "Selected",
        continueCheckIn: "Continue check-in",
        careCardTitle: "Something for you",
        careCardDesc: "Take two minutes to slow down with a gentle grounding activity.",
        careCardCta: "Begin",
        wayCardTitle: "Check in your way",
        wayCardDesc: "Text, voice, or IVRS. Choose what feels most comfortable today.",
        caseCardTitle: "Your case",
        hearingLabel: "Next hearing",
        supportTeam: "Your support team is with you",
        privacyNotice: "Your choices, consent, and privacy controls are always visible.",
        demoData: "Synthetic demonstration data",
      };
  }
}

/* ─────────────────────────────────────────────────────────────
   Feel Better Hub Content
───────────────────────────────────────────────────────────── */
export interface ExerciseContentItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  icon: string;
  tone: string;
  href: string;
}

export function getFeelBetterExercises(lang: string): ExerciseContentItem[] {
  const norm = normalizeLanguageName(lang);

  const data: Record<string, { title: string; desc: string; time: string }[]> = {
    Hindi: [
      { title: "साँस लें", desc: "अपने शरीर को शांत और स्थिर करने के लिए एक सहज लय।", time: "2 मिनट" },
      { title: "ज़मीन से जुड़ें (ग्राउंडिंग)", desc: "अपने आस-पास क्या है, एक समय में एक इंद्री से महसूस करें।", time: "3 मिनट" },
      { title: "विश्राम", desc: "थके या अशांत मन के लिए एक निर्देशित ठहराव।", time: "5 मिनट" },
      { title: "सुनें", desc: "जब शब्द भारी लगें, तब के लिए सौम्य शांत ध्वनियाँ।", time: "4 मिनट" },
      { title: "बस यहीं रहें", desc: "आपको अभी कुछ भी बोलने या समझाने की ज़रूरत नहीं है।", time: "शांत जगह" },
      { title: "समझें", desc: "मुश्किल दिनों के लिए सरल भाषा में मददगार मार्गदर्शिकाएँ।", time: "पढ़ें या सुनें" },
    ],
    Bengali: [
      { title: "শ্বাস নিন", desc: "শরীরকে শিথিল এবং শান্ত করার জন্য একটি মৃদু ছন্দ।", time: "২ মিনিট" },
      { title: "গ্রাউন্ডিং", desc: "আপনার চারপাশের অনুভূতিগুলোকে এক এক করে উপলব্ধি করুন।", time: "৩ মিনিট" },
      { title: "বিশ্রাম", desc: "ক্লান্ত মনের জন্য একটি নির্দেশিত বিরতি।", time: "৫ মিনিট" },
      { title: "শুনুন", desc: "যখন শব্দ ভারী লাগে, তখন শোনার জন্য শান্ত সুর।", time: "৪ মিনিট" },
      { title: "এখানে থাকুন", desc: "আপনাকে এখনই কোনো কথা বলতে বা বোঝাতে হবে না।", time: "শান্ত স্থান" },
      { title: "বুঝুন", desc: "কঠিন দিনগুলির জন্য সহজ ভাষার সহায়িকা।", time: "পড়ুন বা শুনুন" },
    ],
    Marathi: [
      { title: "श्वास घ्या", desc: "शरीराला शांत आणि स्थिर करण्यासाठी एक सोपी लय.", time: "२ मिनिटे" },
      { title: "ग्राउंडिंग", desc: "आपल्या सभोवतालच्या गोष्टी एका वेळी एका इंद्रियाने अनुभवा.", time: "३ मिनिटे" },
      { title: "विश्रांती", desc: "थकलेल्या मनासाठी एक मार्गदर्शित शांतता.", time: "५ मिनिटे" },
      { title: "ऐका", desc: "जेव्हा शब्दांचा ताण येतो, तेव्हा ऐकण्यासाठी शांत ध्वनी.", time: "४ मिनिटे" },
      { title: "फक्त इथे राहा", desc: "तुम्हाला आत्ता काहीही बोलण्याची किंवा समजावण्याची गरज नाही.", time: "शांत जागा" },
      { title: "समजून घ्या", desc: "कठीण दिवसांसाठी सोप्या भाषेतील मार्गदर्शक.", time: "वाचा किंवा ऐका" },
    ],
    Tamil: [
      { title: "மூச்சுப் பயிற்சி", desc: "உடலை அமைதிப்படுத்த ஒரு மென்மையான தாளம்.", time: "2 நிமிடம்" },
      { title: "தரைப்படுத்துதல்", desc: "உங்கள் சுற்றுப்புறத்தை ஒரு நேரத்தில் ஒரு உணர்வாக கவனியுங்கள்.", time: "3 நிமிடம்" },
      { title: "ஓய்வு", desc: "சோர்வடைந்த மனதிற்கு ஒரு வழிகாட்டப்பட்ட அமைதி.", time: "5 நிமிடம்" },
      { title: "கேளுங்கள்", desc: "வார்த்தைகள் கடினமாக இருக்கும்போது அமைதியான ஒலி.", time: "4 நிமிடம்" },
      { title: "இங்கேயே இருங்கள்", desc: "நீங்கள் இப்போது எதுவும் பேசவோ விளக்கவோ தேவையில்லை.", time: "அமைதியான இடம்" },
      { title: "புரிந்துகொள்ளுங்கள்", desc: "கடினமான நாட்களுக்கான எளிய வழிகாட்டிகள்.", time: "படிக்க அல்லது கேட்க" },
    ],
    Telugu: [
      { title: "శ్వాస తీసుకోండి", desc: "శరీరాన్ని ప్రశాంతపరచడానికి ఒక సున్నితమైన లయ.", time: "2 నిమిషాలు" },
      { title: "గ్రౌండింగ్", desc: "మీ చుట్టూ ఉన్న విషయాలను ఒకసారి ఒక ఇంద్రియంతో గమనించండి.", time: "3 నిమిషాలు" },
      { title: "విశ్రాంతి", desc: "అలసిపోయిన మనస్సుకు మార్గదర్శక విరామం.", time: "5 నిమిషాలు" },
      { title: "వినండి", desc: "మాటలు భారంగా అనిపించినప్పుడు వినడానికి ప్రశాంతమైన ధ్వనులు.", time: "4 నిమిషాలు" },
      { title: "ఇక్కడే ఉండండి", desc: "మీరు ఇప్పుడు ఏమీ మాట్లాడవలసిన అవసరం లేదు.", time: "ప్రశాంత స్థలం" },
      { title: "అర్థం చేసుకోండి", desc: "కష్ట సమయాల కోసం సరళమైన మార్గదర్శకాలు.", time: "చదవండి లేదా వినండి" },
    ],
    English: [
      { title: "Breathe", desc: "A gentle rhythm to help your body soften.", time: "2 min" },
      { title: "Ground", desc: "Notice what is around you, one sense at a time.", time: "3 min" },
      { title: "Relax", desc: "A guided pause for a busy or tired mind.", time: "5 min" },
      { title: "Listen", desc: "Soft audio spaces for whenever words feel too much.", time: "4 min" },
      { title: "Just Stay", desc: "You do not have to talk right now.", time: "Open space" },
      { title: "Understand", desc: "Small, plain-language guides for hard days.", time: "Read or listen" },
    ],
  };

  const selected = data[norm] || data.English;
  const ids = ["breathe", "ground", "relax", "listen", "just-stay", "understand"];
  const icons = ["Wind", "Leaf", "Moon", "Ear", "Sparkles", "BookOpen"];
  const tones = [
    "bg-[#e5f2ec] text-[#327d70]",
    "bg-[#f2ecd9] text-[#a47730]",
    "bg-[#eee8f5] text-[#8064a2]",
    "bg-[#f9e9e3] text-[#b26b55]",
    "bg-[#dcebdd] text-[#0f766e]",
    "bg-[#e5eef5] text-[#5b8db8]",
  ];
  const hrefs = [
    "/survivor/breathe",
    "/survivor/ground",
    "/survivor/relax",
    "/survivor/listen",
    "/survivor/just-stay",
    "/survivor/understand",
  ];

  return ids.map((id, i) => ({
    id,
    title: selected[i]?.title || id,
    desc: selected[i]?.desc || "",
    time: selected[i]?.time || "",
    icon: icons[i],
    tone: tones[i],
    href: hrefs[i],
  }));
}

/* ─────────────────────────────────────────────────────────────
   My Space Hub Items
───────────────────────────────────────────────────────────── */
export interface HubItem {
  href: string;
  title: string;
  desc: string;
  tone: string;
  icon: string;
}

export function getMySpaceItems(lang: string): HubItem[] {
  const norm = normalizeLanguageName(lang);

  const data: Record<string, { title: string; desc: string }[]> = {
    Hindi: [
      { title: "मेरा केस", desc: "केस का विवरण, महत्वपूर्ण चरण और सहायता टीम।" },
      { title: "अपने कानूनी अधिकार", desc: "सत्यापित कानूनी अधिकार, निःशुल्क विधिक सहायता और सुरक्षा प्रावधान।" },
      { title: "उम्मीद की तिजोरी", desc: "वे छोटी-छोटी बातें संभालें जो आपको हिम्मत देती हैं।" },
      { title: "मेरी यात्रा", desc: "अपने चेक-इन, प्रगति के पड़ाव और मिले सहयोग को देखें।" },
      { title: "गोपनीयता और नियंत्रण", desc: "अपनी पसंद समझें और निगरानी स्थिति को प्रबंधित करें।" },
      { title: "सुलभता (Accessibility)", desc: "टेक्स्ट साइज़, कंट्रास्ट और आवाज़ मार्गदर्शन बदलें।" },
      { title: "तारा (TAARA)", desc: "अपनी सौम्य मार्गदर्शिका तारा के साथ शांत बातचीत करें।" },
    ],
    Bengali: [
      { title: "আমার মামলা", desc: "মামলার বিবরণ, অগ্রগতির ধাপ ও সহায়তা টিম।" },
      { title: "আপনার আইনি অধিকার", desc: "যাচাইকৃত আইনি অধিকার, বিনামূল্যে আইনি সহায়তা ও সুরক্ষা।" },
      { title: "আশার ভল্ট", desc: "যে ছোট ছোট জিনিসগুলো আপনাকে শক্তি যোগায় তা জমিয়ে রাখুন।" },
      { title: "আমার যাত্রা", desc: "আপনার চেক-ইন, মাইলফলক এবং পাওয়া সমর্থন দেখুন।" },
      { title: "গোপনীয়তা ও নিয়ন্ত্রণ", desc: "আপনার পছন্দ বুঝুন এবং পর্যবেক্ষণ পরিচালনা করুন।" },
      { title: "অ্যাক্সেসিবিলিটি", desc: "টেক্সটের আকার, বৈসাদৃশ্য ও ভয়েস নির্দেশিকা পরিবর্তন করুন।" },
      { title: "তারা (TAARA)", desc: "আপনার শান্ত সঙ্গী তারার সাথে কথোপকথন করুন।" },
    ],
    Marathi: [
      { title: "माझी केस", desc: "केस तपशील, प्रगतीचे टप्पे आणि मदत पथक." },
      { title: "आपले कायदेशीर हक्क", desc: "कायदेशीर हक्क, मोफत कायदेशीर मदत आणि सुरक्षा." },
      { title: "आशेची तिजोरी", desc: "तुम्हाला धीर देणाऱ्या लहान गोष्टी जतन करा." },
      { title: "माझा प्रवास", desc: "तुमच्या नोंदी, प्रगतीचे टप्पे आणि मिळालेले सहकार्य पहा." },
      { title: "गोपनीयता आणि सेटिंग्ज", desc: "तुमच्या निवडी समजून घ्या आणि नियंत्रण व्यवस्थापित करा." },
      { title: "सुलभता", desc: "अक्षर आकार, रंगछटा आणि आवाज मार्गदर्शक बदला." },
      { title: "तारा (TAARA)", desc: "तुमची मार्गदर्शिका तारा सोबत शांत संवाद साधा." },
    ],
    Tamil: [
      { title: "என் வழக்கு", desc: "வழக்கு விவரங்கள், முக்கிய கட்டங்கள் மற்றும் ஆதரவு." },
      { title: "உங்கள் சட்ட உரிமைகள்", desc: "சட்ட உரிமைகள், இலவச சட்ட உதவி மற்றும் பாதுகாப்பு." },
      { title: "நம்பிக்கைப் பெட்டகம்", desc: "உங்களுக்கு நம்பிக்கை தரும் சிறு நினைவுகளைப் பாதுகாக்கவும்." },
      { title: "என் பயணம்", desc: "உங்கள் பதிவுகள், மைல்கற்கள் மற்றும் ஆதரவு வரலாற்றைப் பார்க்கவும்." },
      { title: "தனியுரிமை & கட்டுப்பாடு", desc: "உங்கள் விருப்பங்களைப் புரிந்துகொண்டு மாற்றவும்." },
      { title: "அணுகல்தன்மை", desc: "எழுத்து அளவு, மாறுபாடு மற்றும் குரல் வழிகாட்டலை மாற்றவும்." },
      { title: "தாரா (TAARA)", desc: "உங்கள் அமைதியான வழிகாட்டி தாராவுடன் பேசுங்கள்." },
    ],
    Telugu: [
      { title: "నా కేసు", desc: "కేసు వివరాలు, ముఖ్యమైన దశలు మరియు సహాయక బృందం." },
      { title: "మీ చట్టపరమైన హక్కులు", desc: "చట్టపరమైన హక్కులు, ఉచిత న్యాయ సహాయం మరియు రక్షణ." },
      { title: "ఆశా భాండాగారం", desc: "మీకు ధైర్యాన్నిచ్చే చిన్న చిన్న విషయాలను భద్రపరుచుకోండి." },
      { title: "నా ప్రయాణం", desc: "మీ చెక్-ఇన్‌లు, మైలురాళ్ళు మరియు మద్దతు చరిత్రను చూడండి." },
      { title: "గోప్యత & నియంత్రణ", desc: "మీ ప్రాధాన్యతలను అర్థం చేసుకుని నిర్వహించండి." },
      { title: "యాక్సెసిబిలిటీ", desc: "టెక్స్ట్ పరిమాణం, కాంట్రాస్ట్ మరియు వాయిస్ మార్గదర్శకాన్ని సర్దుబాటు చేయండి." },
      { title: "తార (TAARA)", desc: "మీ స్నేహితురాలు తారాతో ప్రశాంతంగా మాట్లాడండి." },
    ],
    English: [
      { title: "My Case", desc: "Your case context, milestones, and support assignment." },
      { title: "Know Your Rights", desc: "Verified legal rights, free legal aid, and official protections." },
      { title: "Hope Vault", desc: "Keep the little things that remind you what matters." },
      { title: "My Journey", desc: "See your check-ins, milestones, and moments of support." },
      { title: "Privacy & Control", desc: "Understand your choices and manage monitoring." },
      { title: "Accessibility", desc: "Adjust text, contrast, motion, and voice guidance." },
      { title: "TAARA", desc: "Open a quiet space with your gentle guide." },
    ],
  };

  const selected = data[norm] || data.English;
  const hrefs = [
    "/survivor/case",
    "/survivor/rights",
    "/survivor/hope-vault",
    "/survivor/journey",
    "/survivor/privacy",
    "/survivor/accessibility",
    "/survivor/taara",
  ];
  const tones = [
    "bg-[#e4f0eb] text-[#2d7a70]",
    "bg-[#e5eef5] text-[#2c6e91]",
    "bg-[#fff0e5] text-[#b56e4e]",
    "bg-[#e8e4f2] text-[#8064a2]",
    "bg-[#e8eff4] text-[#5b8db8]",
    "bg-[#f1ecd9] text-[#9f7835]",
    "bg-[#dff2ec] text-[#0f766e]",
  ];
  const icons = ["FileText", "Scale", "BookHeart", "History", "LockKeyhole", "SlidersHorizontal", "Sparkles"];

  return hrefs.map((href, i) => ({
    href,
    title: selected[i]?.title || "Item",
    desc: selected[i]?.desc || "",
    tone: tones[i],
    icon: icons[i],
  }));
}

/* ─────────────────────────────────────────────────────────────
   Support Hub Items
───────────────────────────────────────────────────────────── */
export function getSupportItems(lang: string): HubItem[] {
  const norm = normalizeLanguageName(lang);

  const data: Record<string, { title: string; desc: string }[]> = {
    Hindi: [
      { title: "परामर्शदाता से बात करें", desc: "आपकी सहायता के लिए नियुक्त विशेषज्ञ से बात या कॉल करें।" },
      { title: "सुरक्षित घेरा (Safe Circle)", desc: "किसी भरोसेमंद व्यक्ति को जोड़ें जो ज़रूरत पर साथ दे सके।" },
      { title: "सहायता नेविगेटर", desc: "कानूनी, चिकित्सा, सुरक्षा और पुनर्वास सहायता केंद्र खोजें।" },
      { title: "आप अकेले नहीं हैं", desc: "सुरक्षित अनाम समुदाय, जो आपकी अनुमति के बिना चालू नहीं होता।" },
    ],
    Bengali: [
      { title: "কাউন্সেলরের সাথে কথা বলুন", desc: "আপনার সাথে নিযুক্ত সহায়তা বিশেষজ্ঞের সাথে যোগাযোগ করুন।" },
      { title: "নিরাপদ বৃত্ত (Safe Circle)", desc: "একজন বিশ্বস্ত ব্যক্তিকে যুক্ত করুন যিনি প্রয়োজনে পাশে থাকবেন।" },
      { title: "সহায়তা নেভিগেটর", desc: "আইনি, চিকিৎসা, সুরক্ষা ও পুনর্বাসন সম্পদ খুঁজুন।" },
      { title: "আপনি একা নন", desc: "একটি নিয়ন্ত্রিত বেনামী সম্প্রদায়, যা আপনার অনুমতিতে সক্রিয় হয়।" },
    ],
    Marathi: [
      { title: "समुपदेशकाशी बोला", desc: "तुमच्या मदतीसाठी नियुक्त केलेल्या तज्ञाशी संपर्क साधा." },
      { title: "सुरक्षित वर्तुळ (Safe Circle)", desc: "गरजेच्या वेळी मदतीसाठी विश्वासू व्यक्ती जोडा." },
      { title: "मदत नेव्हिगेटर", desc: "कायदेशीर, वैद्यकीय, संरक्षण आणि पुनर्वसन संसाधने शोधा." },
      { title: "तुम्ही एकटे नाही आहात", desc: "सुरक्षित अज्ञात समुदाय, जो तुमच्या संमतीनेच सुरू होतो." },
    ],
    Tamil: [
      { title: "ஆலோசகருடன் பேசுங்கள்", desc: "உங்களுக்கு ஒதுக்கப்பட்ட ஆதரவு நிபுணரைத் தொடர்பு கொள்ளுங்கள்." },
      { title: "பாதுகாப்பு வட்டம் (Safe Circle)", desc: "தேவைப்படும்போது உதவ நம்பகமான ஒருவரைச் சேர்க்கவும்." },
      { title: "ஆதரவு வழிகாட்டி", desc: "சட்டம், மருத்துவம் மற்றும் பாதுகாப்பு வளங்களைக் கண்டறியவும்." },
      { title: "நீங்கள் தனியாக இல்லை", desc: "உங்கள் ஒப்புதலுடன் இயங்கும் பாதுகாப்பான சமூகம்." },
    ],
    Telugu: [
      { title: "కౌన్సిలర్‌తో మాట్లాడండి", desc: "మీకు కేటాయించిన నిపుణుడిని సంప్రదించండి." },
      { title: "సేఫ్ సర్కిల్ (Safe Circle)", desc: "అవసరమైనప్పుడు తోడుగా ఉండటానికి నమ్మకమైన వ్యక్తిని జోడించండి." },
      { title: "సహాయ నావిగేటర్", desc: "చట్టపరమైన, వైద్య మరియు పునరావాస వనరులను కనుగొనండి." },
      { title: "మీరు ఒంటరిగా లేరు", desc: "మీ అనుమతితో మాత్రమే పనిచేసే సురక్షిత సంఘం." },
    ],
    English: [
      { title: "Talk to a counsellor", desc: "Reach the person assigned to support your journey." },
      { title: "Safe Circle", desc: "Prepare a trusted person to be there when you need them." },
      { title: "Support Navigator", desc: "Find legal, medical, protection, and rehabilitation resources." },
      { title: "You Are Not Alone", desc: "A moderated anonymous community, off until you choose to enable it." },
    ],
  };

  const selected = data[norm] || data.English;
  const hrefs = [
    "/survivor/support/counsellor",
    "/survivor/support/safe-circle",
    "/survivor/support/navigator",
    "/survivor/support/community",
  ];
  const tones = [
    "bg-[#e5f2ec] text-[#327d70]",
    "bg-[#fff0e5] text-[#b56e4e]",
    "bg-[#e8eef5] text-[#5b8db8]",
    "bg-[#eee8f5] text-[#8064a2]",
  ];
  const icons = ["PhoneCall", "HeartHandshake", "MapPinned", "UsersRound"];

  return hrefs.map((href, i) => ({
    href,
    title: selected[i]?.title || "Support",
    desc: selected[i]?.desc || "",
    tone: tones[i],
    icon: icons[i],
  }));
}
