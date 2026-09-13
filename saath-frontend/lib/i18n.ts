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

/* Universal UI translations */
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

  // Greetings & Header
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
  "header.selectLanguage": {
    English: "Change language",
    Hindi: "भाषा बदलें",
    Bengali: "ভাষা পরিবর্তন করুন",
    Marathi: "भाषा बदला",
    Tamil: "மொழியை மாற்றவும்",
    Telugu: "భాషను మార్చండి",
  },

  // Reassurance & Core Messages
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
  "common.loading": {
    English: "Loading…",
    Hindi: "लोड हो रहा है…",
    Bengali: "লোড হচ্ছে…",
    Marathi: "लोड होत आहे…",
    Tamil: "ஏற்றுகிறது…",
    Telugu: "లోడ్ అవుతోంది…",
  },
};

export function t(key: string, languageName: string): string {
  const norm = normalizeLanguageName(languageName);
  const entry = TRANSLATIONS[key];
  if (!entry) return key;
  return entry[norm] || entry["English"] || key;
}
