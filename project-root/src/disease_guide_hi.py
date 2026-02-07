# src/disease_guide_hi.py

DISEASE_GUIDE_HI = {
    "aphids": {
        "disease_name_hi": "माहू (एफिड्स) का प्रकोप",
        "description_hi": "पत्तियों पर छोटे हरे या काले रंग के कीड़े दिखाई देते हैं, जिससे पत्तियाँ मुड़ जाती हैं और पौधा कमजोर हो जाता है।",
        "treatment_steps_hi": [
            "प्रभावित पत्तियों को तोड़कर नष्ट करें",
            "खेत में चींटियों को नियंत्रित करें",
            "नीम तेल का छिड़काव करें (3–5 मिली प्रति लीटर पानी)",
            "खेत को अधिक नाइट्रोजन खाद से बचाएँ"
        ],
        "recommended_pesticides_hi": [
            "इमिडाक्लोप्रिड 17.8 SL (0.3 मिली / लीटर पानी)",
            "थायोमेथोक्साम 25 WG (0.25 ग्राम / लीटर पानी)"
        ]
    },

    "target_spot": {
        "disease_name_hi": "टारगेट स्पॉट रोग",
        "description_hi": "पत्तियों पर भूरे रंग के गोल धब्बे बनते हैं, जिनके चारों ओर हल्का घेरा दिखाई देता है।",
        "treatment_steps_hi": [
            "संक्रमित पत्तियों को हटाकर नष्ट करें",
            "खेत में हवा का अच्छा संचार बनाए रखें",
            "ऊपर से सिंचाई (स्प्रिंकलर) से बचें"
        ],
        "recommended_pesticides_hi": [
            "मैनकोजेब 75 WP (2 ग्राम / लीटर पानी)",
            "क्लोरोथालोनिल 75 WP (2 ग्राम / लीटर पानी)"
        ]
    },

    "powdery_mildew": {
        "disease_name_hi": "चूर्णी फफूंदी रोग",
        "description_hi": "पत्तियों की सतह पर सफेद पाउडर जैसी परत दिखाई देती है, जिससे पत्तियाँ पीली पड़ जाती हैं।",
        "treatment_steps_hi": [
            "संक्रमित पत्तियों को नष्ट करें",
            "खेत में नमी कम रखें",
            "समय पर फफूंदनाशी दवा का छिड़काव करें"
        ],
        "recommended_pesticides_hi": [
            "वेटेबल सल्फर 80 WP (2 ग्राम / लीटर पानी)",
            "हेक्साकोनाज़ोल 5 EC (1 मिली / लीटर पानी)"
        ]
    },

    "bacterial_blight": {
        "disease_name_hi": "बैक्टीरियल ब्लाइट (कपास का झुलसा रोग)",
        "description_hi": "पत्तियों पर पानी से भीगे हुए कोणीय धब्बे बनते हैं, जो बाद में काले या भूरे हो जाते हैं।",
        "treatment_steps_hi": [
            "रोगग्रस्त पौधों को खेत से निकालकर नष्ट करें",
            "स्वस्थ और प्रमाणित बीजों का ही उपयोग करें",
            "खेत में जलभराव से बचें",
            "फसल चक्र (क्रॉप रोटेशन) अपनाएँ"
        ],
        "recommended_pesticides_hi": [
            "कॉपर ऑक्सीक्लोराइड 50 WP (3 ग्राम / लीटर पानी)",
            "स्ट्रेप्टोसाइक्लिन (0.5 ग्राम / 10 लीटर पानी)"
        ]
    },

    "army_worms": {
        "disease_name_hi": "आर्मी वर्म (सेना कीट)",
        "description_hi": "ये कीट पत्तियों को झुंड में खाकर पौधे को पूरी तरह नष्ट कर सकते हैं।",
        "treatment_steps_hi": [
            "प्रारंभिक अवस्था में कीटों को हाथ से नष्ट करें",
            "रात में खेत का निरीक्षण करें क्योंकि कीट सक्रिय रहते हैं",
            "प्रकाश प्रपंच (लाइट ट्रैप) का उपयोग करें"
        ],
        "recommended_pesticides_hi": [
            "इमामेक्टिन बेंजोएट 5 SG (0.4 ग्राम / लीटर पानी)",
            "स्पिनोसैड 45 SC (0.3 मिली / लीटर पानी)"
        ]
    },

    "healthy": {
        "disease_name_hi": "स्वस्थ पौधा",
        "description_hi": "पौधा पूरी तरह स्वस्थ है और किसी रोग या कीट का प्रकोप नहीं है।",
        "treatment_steps_hi": [
            "नियमित निरीक्षण करते रहें",
            "संतुलित खाद और सही समय पर सिंचाई करें"
        ],
        "recommended_pesticides_hi": []
    }
}


def get_disease_guide_hindi(class_name: str):
    """
    Maps model output class name to canonical disease key
    and returns Hindi disease guidance.
    """

    if not class_name or not isinstance(class_name, str):
        return {
            "disease_name_hi": "अज्ञात",
            "description_hi": "रोग की पहचान नहीं हो सकी।",
            "treatment_steps_hi": [],
            "recommended_pesticides_hi": []
        }

    # -----------------------------------------
    # STEP 1: Normalize model output aggressively
    # -----------------------------------------
    raw = class_name.lower()

    # remove common noise words
    for token in ["leaf", "leaves", "plant", "-", "_"]:
        raw = raw.replace(token, " ")

    raw = " ".join(raw.split())  # remove extra spaces

    # -----------------------------------------
    # STEP 2: Canonical mapping
    # -----------------------------------------
    if "aphid" in raw:
        key = "aphids"
    elif "target" in raw:
        key = "target_spot"
    elif "powdery" in raw:
        key = "powdery_mildew"
    elif "bacterial" in raw or "blight" in raw:
        key = "bacterial_blight"
    elif "army" in raw or "worm" in raw:
        key = "army_worms"
    elif "healthy" in raw:
        key = "healthy"
    else:
        key = None

    # -----------------------------------------
    # STEP 3: Fetch guide
    # -----------------------------------------
    if key is None or key not in DISEASE_GUIDE_HI:
        return {
            "disease_name_hi": class_name,
            "description_hi": "इस रोग या कीट की जानकारी उपलब्ध नहीं है।",
            "treatment_steps_hi": [],
            "recommended_pesticides_hi": []
        }

    return DISEASE_GUIDE_HI[key]
