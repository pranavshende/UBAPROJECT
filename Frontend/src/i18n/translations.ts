export type TranslationKeys = {
  // Brand
  brand: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  begin: string;
  explore: string;

  // Navigation
  home: string;
  cropRecommendation: string;
  crops: string;
  disease: string;
  weather: string;
  profile: string;
  logout: string;

  // Common
  save: string;
  cancel: string;
  edit: string;
  update: string;
  loading: string;
  error: string;
  success: string;
  retry: string;

  // Home Screen
  goodMorning: string;
  goodAfternoon: string;
  goodEvening: string;
  farmStatus: string;
  weatherToday: string;
  quickActions: string;
  cropHealth: string;
  scanDisease: string;
  farmingTip: string;
  updated: string;

  // Weather Screen
  yourLocation: string;
  clearSky: string;
  partlyCloudy: string;
  foggy: string;
  rainy: string;
  snowy: string;
  thunderstorm: string;
  cloudy: string;
  todayStats: string;
  temperature: string;
  windSpeed: string;
  farmingAdvisory: string;
  weekAhead: string;
  goodForSpraying: string;
  avoidSpraying: string;
  skipIrrigation: string;
  irrigateCrops: string;
  calmWinds: string;
  highWinds: string;
  rainfallExpected: string;
  highTemperature: string;

  // Profile Screen
  language: string;
  farmDetails: string;
  name: string;
  phone: string;
  village: string;
  landSize: string;
  editDetails: string;
  saveChanges: string;
  profileUpdated: string;

  // Crop Recommendation
  cropAdvisor: string;
  smartRecommendations: string;
  all: string;
  winter: string;
  summer: string;
  season: string;
  yield: string;
  viewDetails: string;

  // Disease Detection
  diseaseDetection: string;
  scanPlant: string;
  takePhoto: string;
  selectFromGallery: string;
  analyzing: string;
  results: string;
};

export const translations: Record<"en" | "hi" | "mr", TranslationKeys> = {
  en: {
    // Brand
    brand: "KRISHIMITRA",
    tagline: "Smart Agricultural Intelligence",
    heroTitle: "Empowering Farmers with Intelligent Insights",
    heroSubtitle: "Data-driven agriculture for a sustainable tomorrow.",
    begin: "Begin Analysis",
    explore: "Explore Tools",

    // Navigation
    home: "Home",
    cropRecommendation: "Crop Recommendation",
    crops: "Crops",
    disease: "Disease Detection",
    weather: "Weather",
    profile: "Profile",
    logout: "Logout",

    // Common
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    update: "Update",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    retry: "Retry",

    // Home Screen
    goodMorning: "Good Morning",
    goodAfternoon: "Good Afternoon",
    goodEvening: "Good Evening",
    farmStatus: "Let's check your farm status today.",
    weatherToday: "Weather Today",
    quickActions: "Quick Actions",
    cropHealth: "Crop Health",
    scanDisease: "Scan Disease",
    farmingTip: "Farming Tip",
    updated: "Updated",

    // Weather Screen
    yourLocation: "Your Location",
    clearSky: "Clear Sky",
    partlyCloudy: "Partly Cloudy",
    foggy: "Foggy",
    rainy: "Rainy",
    snowy: "Snowy",
    thunderstorm: "Thunderstorm",
    cloudy: "Cloudy",
    todayStats: "Today's Stats",
    temperature: "Temperature",
    windSpeed: "Wind Speed",
    farmingAdvisory: "Farming Advisory",
    weekAhead: "Week Ahead",
    goodForSpraying: "Good for Spraying",
    avoidSpraying: "Avoid Spraying",
    skipIrrigation: "Skip Irrigation",
    irrigateCrops: "Irrigate Crops",
    calmWinds: "Calm winds and no rain. Ideal for pesticides.",
    highWinds: "High winds or rain expected. Chemicals may wash off.",
    rainfallExpected: "Rainfall is expected today. Save water.",
    highTemperature: "High temperatures detected. Crops need water.",

    // Profile Screen
    language: "Language",
    farmDetails: "Farm Details",
    name: "Name",
    phone: "Phone",
    village: "Village",
    landSize: "Land Size",
    editDetails: "Edit Details",
    saveChanges: "Save Changes",
    profileUpdated: "Profile updated",

    // Crop Recommendation
    cropAdvisor: "Crop Advisor",
    smartRecommendations: "Smart recommendations for your farm",
    all: "All",
    winter: "Winter",
    summer: "Summer",
    season: "Season",
    yield: "Yield",
    viewDetails: "View Details",

    // Disease Detection
    diseaseDetection: "Disease Detection",
    scanPlant: "Scan Plant",
    takePhoto: "Take Photo",
    selectFromGallery: "Select from Gallery",
    analyzing: "Analyzing...",
    results: "Results",
  },

  hi: {
    // Brand
    brand: "कृषिमित्र",
    tagline: "स्मार्ट कृषि बुद्धिमत्ता",
    heroTitle: "बुद्धिमान समाधान के साथ किसानों को सशक्त बनाना",
    heroSubtitle: "डेटा आधारित कृषि से बेहतर भविष्य की ओर।",
    begin: "विश्लेषण प्रारंभ करें",
    explore: "उपकरण देखें",

    // Navigation
    home: "होम",
    cropRecommendation: "फसल सिफारिश",
    crops: "फसलें",
    disease: "रोग पहचान",
    weather: "मौसम",
    profile: "प्रोफ़ाइल",
    logout: "लॉग आउट",

    // Common
    save: "सहेजें",
    cancel: "रद्द करें",
    edit: "संपादित करें",
    update: "अपडेट करें",
    loading: "लोड हो रहा है...",
    error: "त्रुटि",
    success: "सफलता",
    retry: "पुनः प्रयास करें",

    // Home Screen
    goodMorning: "सुप्रभात",
    goodAfternoon: "शुभ दोपहर",
    goodEvening: "शुभ संध्या",
    farmStatus: "आज अपने खेत की स्थिति देखें।",
    weatherToday: "आज का मौसम",
    quickActions: "त्वरित कार्य",
    cropHealth: "फसल स्वास्थ्य",
    scanDisease: "रोग स्कैन करें",
    farmingTip: "खेती की सलाह",
    updated: "अपडेट किया गया",

    // Weather Screen
    yourLocation: "आपका स्थान",
    clearSky: "स्वच्छ आसमान",
    partlyCloudy: "आंशिक बादल",
    foggy: "कोहरा",
    rainy: "बारिश",
    snowy: "बर्फबारी",
    thunderstorm: "आंधी",
    cloudy: "बादल छाए",
    todayStats: "आज के आंकड़े",
    temperature: "तापमान",
    windSpeed: "हवा की गति",
    farmingAdvisory: "खेती सलाह",
    weekAhead: "आगे का सप्ताह",
    goodForSpraying: "छिड़काव के लिए अच्छा",
    avoidSpraying: "छिड़काव से बचें",
    skipIrrigation: "सिंचाई छोड़ें",
    irrigateCrops: "फसलों की सिंचाई करें",
    calmWinds: "शांत हवा और बारिश नहीं। कीटनाशकों के लिए आदर्श।",
    highWinds: "तेज हवा या बारिश की उम्मीद। रसायन बह सकते हैं।",
    rainfallExpected: "आज बारिश होने की उम्मीद है। पानी बचाएं।",
    highTemperature: "उच्च तापमान का पता चला। फसलों को पानी की जरूरत है।",

    // Profile Screen
    language: "भाषा",
    farmDetails: "खेत का विवरण",
    name: "नाम",
    phone: "फोन",
    village: "गांव",
    landSize: "भूमि का आकार",
    editDetails: "विवरण संपादित करें",
    saveChanges: "परिवर्तन सहेजें",
    profileUpdated: "प्रोफाइल अपडेट हो गया",

    // Crop Recommendation
    cropAdvisor: "फसल सलाहकार",
    smartRecommendations: "आपके खेत के लिए स्मार्ट सुझाव",
    all: "सभी",
    winter: "सर्दी",
    summer: "गर्मी",
    season: "मौसम",
    yield: "उपज",
    viewDetails: "विवरण देखें",

    // Disease Detection
    diseaseDetection: "रोग पहचान",
    scanPlant: "पौधा स्कैन करें",
    takePhoto: "फोटो लें",
    selectFromGallery: "गैलरी से चुनें",
    analyzing: "विश्लेषण कर रहे हैं...",
    results: "परिणाम",
  },

  mr: {
    // Brand
    brand: "कृषिमित्र",
    tagline: "स्मार्ट शेती बुद्धिमत्ता",
    heroTitle: "बुद्धिमान तंत्रज्ञानाद्वारे शेतकऱ्यांना सक्षम करणे",
    heroSubtitle: "डेटा-आधारित शेतीसह शाश्वत भविष्याकडे.",
    begin: "विश्लेषण सुरू करा",
    explore: "साधने पहा",

    // Navigation
    home: "होम",
    cropRecommendation: "पीक शिफारस",
    crops: "पिके",
    disease: "रोग ओळख",
    weather: "हवामान",
    profile: "प्रोफाइल",
    logout: "लॉगआउट",

    // Common
    save: "जतन करा",
    cancel: "रद्द करा",
    edit: "संपादित करा",
    update: "अद्यतनित करा",
    loading: "लोड होत आहे...",
    error: "त्रुटी",
    success: "यश",
    retry: "पुन्हा प्रयत्न करा",

    // Home Screen
    goodMorning: "सुप्रभात",
    goodAfternoon: "शुभ दुपार",
    goodEvening: "शुभ संध्याकाळ",
    farmStatus: "आज आपल्या शेताची स्थिती तपासूया.",
    weatherToday: "आजचे हवामान",
    quickActions: "द्रुत क्रिया",
    cropHealth: "पीक आरोग्य",
    scanDisease: "रोग स्कॅन करा",
    farmingTip: "शेती सल्ला",
    updated: "अद्यतनित",

    // Weather Screen
    yourLocation: "तुमचे स्थान",
    clearSky: "स्वच्छ आकाश",
    partlyCloudy: "अंशतः ढगाळ",
    foggy: "धुके",
    rainy: "पाऊस",
    snowy: "बर्फवृष्टी",
    thunderstorm: "वादळ",
    cloudy: "ढगाळ",
    todayStats: "आजचे आकडे",
    temperature: "तापमान",
    windSpeed: "वाऱ्याचा वेग",
    farmingAdvisory: "शेती सल्ला",
    weekAhead: "पुढील आठवडा",
    goodForSpraying: "फवारणीसाठी चांगले",
    avoidSpraying: "फवारणी टाळा",
    skipIrrigation: "सिंचन टाळा",
    irrigateCrops: "पिकांना पाणी द्या",
    calmWinds: "शांत वारे आणि पाऊस नाही. कीटकनाशकांसाठी आदर्श.",
    highWinds: "जोरदार वारे किंवा पाऊस अपेक्षित. रसायने वाहू शकतात.",
    rainfallExpected: "आज पाऊस पडण्याची शक्यता आहे. पाणी वाचवा.",
    highTemperature: "उच्च तापमान आढळले. पिकांना पाण्याची गरज आहे.",

    // Profile Screen
    language: "भाषा",
    farmDetails: "शेताचा तपशील",
    name: "नाव",
    phone: "फोन",
    village: "गाव",
    landSize: "जमिनीचा आकार",
    editDetails: "तपशील संपादित करा",
    saveChanges: "बदल जतन करा",
    profileUpdated: "प्रोफाइल अद्यतनित केले",

    // Crop Recommendation
    cropAdvisor: "पीक सल्लागार",
    smartRecommendations: "तुमच्या शेतासाठी स्मार्ट शिफारसी",
    all: "सर्व",
    winter: "हिवाळा",
    summer: "उन्हाळा",
    season: "हंगाम",
    yield: "उत्पन्न",
    viewDetails: "तपशील पहा",

    // Disease Detection
    diseaseDetection: "रोग ओळख",
    scanPlant: "वनस्पती स्कॅन करा",
    takePhoto: "फोटो काढा",
    selectFromGallery: "गॅलरीमधून निवडा",
    analyzing: "विश्लेषण करत आहे...",
    results: "परिणाम",
  },
};

export type Language = keyof typeof translations;
