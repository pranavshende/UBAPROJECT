export type TranslationKeys = {
  brand: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  begin: string;
  explore: string;
  crop: string;
  disease: string;
  weather: string;
  logout: string;
};

export const translations: Record<"en" | "hi" | "mr", TranslationKeys> = {
  en: {
    brand: "KRISHIMITRA",
    tagline: "Smart Agricultural Intelligence",
    heroTitle: "Empowering Farmers with Intelligent Insights",
    heroSubtitle: "Data-driven agriculture for a sustainable tomorrow.",
    begin: "Begin Analysis",
    explore: "Explore Tools",
    crop: "Crop Intelligence",
    disease: "Disease Detection",
    weather: "Weather Analytics",
    logout: "Logout",
  },

  hi: {
    brand: "कृषिमित्र",
    tagline: "स्मार्ट कृषि बुद्धिमत्ता",
    heroTitle: "बुद्धिमान समाधान के साथ किसानों को सशक्त बनाना",
    heroSubtitle: "डेटा आधारित कृषि से बेहतर भविष्य की ओर।",
    begin: "विश्लेषण प्रारंभ करें",
    explore: "उपकरण देखें",
    crop: "फसल सुझाव",
    disease: "रोग पहचान",
    weather: "मौसम विश्लेषण",
    logout: "लॉग आउट",
  },

  mr: {
    brand: "कृषिमित्र",
    tagline: "स्मार्ट शेती बुद्धिमत्ता",
    heroTitle: "बुद्धिमान तंत्रज्ञानाद्वारे शेतकऱ्यांना सक्षम करणे",
    heroSubtitle: "डेटा-आधारित शेतीसह शाश्वत भविष्याकडे.",
    begin: "विश्लेषण सुरू करा",
    explore: "साधने पहा",
    crop: "पीक शिफारस",
    disease: "रोग ओळख",
    weather: "हवामान विश्लेषण",
    logout: "लॉगआउट",
  },
};

export type Language = keyof typeof translations;
