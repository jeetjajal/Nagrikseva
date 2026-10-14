// =========================================================================
// NagrikSeva AI - Multi-Language Scheme & Category Localization
// Supports all 16 Indian Languages (Gujarati, Marathi, Hindi, English, etc.)
// =========================================================================

import { Scheme } from "@/types";

export interface LocalizedSchemeInfo {
  name: string;
  benefits: string[];
  categoryLabel: string;
}

const SCHEME_NAME_TRANSLATIONS: Record<string, Record<string, string>> = {
  "pm-kisan": {
    gu: "PM કિસાન સન્માન નિધિ (ખેડૂત સહાય)",
    mr: "PM किसान सन्मान निधी (शेतकरी सहाय्य)",
    hi: "PM किसान सम्मान निधि (किसान सहायता)",
    en: "PM Kisan Samman Nidhi (Farmer Aid)",
    bn: "পিএম কিষাণ সম্মান নিধি (কৃষক সহায়তা)",
    ta: "பிஎம் கிசான் சம்மான் நிதி (விவசாயி உதவி)",
    te: "పీఎం కిసాన్ సమ్మాన్ నిధి (రైతు సహాయం)",
    kn: "ಪಿಎಂ ಕಿಸಾನ್ ಸಮ್ಮಾನ್ ನಿಧಿ (ರೈತ ನೆರವು)",
    ml: "പിഎം കിസാൻ സമ്മാൻ നിധി (കർഷക സഹായം)",
    pa: "ਪੀਐਮ ਕਿਸਾਨ ਸੰਮਾਨ ਨਿਧੀ (ਕਿਸਾਨ ਸਹਾਇਤਾ)",
    or: "ପିଏମ୍ କିଷାନ୍ ସମ୍ମାନ ନିଧି (କୃଷକ ସହାୟତା)",
    ur: "پی ایم کسان سمان ندھی (کسان امداد)",
  },
  "fasal-bima": {
    gu: "PM ફસલ વીમા યોજના (પાક વીમો)",
    mr: "PM पीक विमा योजना (पीक विमा)",
    hi: "PM फसल बीमा योजना (फसल सुरक्षा)",
    en: "PM Fasal Bima Yojana (Crop Insurance)",
    bn: "পিএম ফসল বিমা যোজনা",
    ta: "பிஎம் பயிர் காப்பீட்டுத் திட்டம்",
    te: "పీఎం ఫసల్ బీమా యోజన",
    kn: "ಪಿಎಂ ಫಸಲ್ ಬಿಮಾ ಯೋಜನೆ",
    ml: "പിഎം ഫസൽ ബീമാ യോജന",
    pa: "ਪੀਐਮ ਫ਼ਸਲ ਬੀਮਾ ਯੋਜਨਾ",
    or: "ପିଏମ୍ ଫସଲ ବୀମା ଯୋଜନା",
    ur: "پی ایم فصل بیما یوجنا",
  },
  "kisan-credit-card": {
    gu: "કિસાન ક્રેડિટ કાર્ડ (KCC સબસિડી લોન)",
    mr: "किसान क्रेडिट कार्ड (KCC सवलत कर्ज)",
    hi: "किसान क्रेडिट कार्ड (KCC रियायती ऋण)",
    en: "Kisan Credit Card (KCC Subsidy Loan)",
    bn: "কিসান ক্রেডিট কার্ড (কেসিসি ঋণ)",
    ta: "கிசான் கிரெடிட் கார்டு (KCC கடன்)",
    te: "కిసాన్ క్రెడిట్ కార్డ్ (KCC రుణం)",
    kn: "ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ (KCC ಸಾಲ)",
    ml: "കിസാൻ ക്രെഡിറ്റ് കാർഡ് (KCC വായ്പ)",
    pa: "ਕਿਸਾਨ ਕ੍ਰੈਡਿਟ ਕਾਰਡ (KCC ਕਰਜ਼ਾ)",
    or: "କିଷାନ କ୍ରେଡିଟ୍ କାର୍ଡ (KCC ଋଣ)",
    ur: "کسان کریڈٹ کارڈ (KCC قرض)",
  },
  "sat-pagla-kisan": {
    gu: "સાત પગલાં ખેડૂત કલ્યાણ (ગુજરાત સરકાર)",
    mr: "सात पावले शेतकरी कल्याण (गुजरात शासन)",
    hi: "सात पगला किसान कल्याण (गुजरात सरकार)",
    en: "Saat Pagla Khedut Kalyan (Govt of Gujarat)",
    bn: "সাত পাগলা কৃষক কল্যাণ যোজনা",
    ta: "சாத் பக்லா விவசாயி நலத் திட்டம்",
    te: "సాత్ పగ్లా రైతు సంక్షేమ పథకం",
    kn: "ಸಾತ್ ಪಗ್ಲಾ ರೈತ ಕಲ್ಯಾಣ ಯೋಜನೆ",
    ml: "സാത് പഗ്‌ല കർഷക ക്ഷേമ പദ്ധതി",
    pa: "ਸਾਤ ਪਗਲਾ ਕਿਸਾਨ ਭਲਾਈ ਯੋਜਨਾ",
    or: "ସାତ ପଗଲା କୃଷକ କଲ୍ୟାଣ ଯୋଜନା",
    ur: "سات پگلا کسان فلاحی اسکیم",
  },
  "ayushman-bharat": {
    gu: "આયુષ્માન ભારત PM-JAY (MAA કાર્ડ)",
    mr: "आयुष्मान भारत PM-JAY (MAA कार्ड)",
    hi: "आयुष्मान भारत PM-JAY (गोल्डन कार्ड)",
    en: "Ayushman Bharat PM-JAY (Health Card)",
    bn: "আয়ুষ্মান ভারত পিএম-জেএওয়াই",
    ta: "ஆயுஷ்மான் பாரத் PM-JAY (மருத்துவ அட்டை)",
    te: "ఆయుష్మాన్ భారత్ PM-JAY (ఆరోగ్య కార్డు)",
    kn: "ಆಯುಷ್ಮಾನ್ ಭಾರತ್ PM-JAY (ಆರೋಗ್ಯ ಕಾರ್ಡ್)",
    ml: "ആയുഷ്മാൻ ഭാരത് PM-JAY",
    pa: "ਆਯੁਸ਼ਮਾਨ ਭਾਰਤ PM-JAY",
    or: "ଆୟୁଷ୍ମାନ ଭାରତ PM-JAY",
    ur: "آیوشمان بھارت PM-JAY (صحت کارڈ)",
  },
  "pm-awas": {
    gu: "પ્રધાનમંત્રી આવાસ યોજના (PMAY પાકું મકાન)",
    mr: "प्रधानमंत्री आवास योजना (PMAY घरकुल)",
    hi: "प्रधानमंत्री आवास योजना (PMAY पक्का मकान)",
    en: "Pradhan Mantri Awas Yojana (PMAY Housing)",
    bn: "প্রধানমন্ত্রী আবাস যোজনা",
    ta: "பிரதம மந்திரி ஆவாஸ் திட்டம்",
    te: "ప్రధాన మంత్రి ఆవాస్ యోజన",
    kn: "ಪ್ರಧಾನ ಮಂತ್ರಿ ಆವಾಸ್ ಯೋಜನೆ",
    ml: "പ്രധാനമന്ത്രി ആവാസ് യോജന",
    pa: "ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਆਵਾਸ ਯੋਜਨਾ",
    or: "ପ୍ରଧାନମନ୍ତ୍ରୀ ଆବାସ ଯୋଜନା",
    ur: "وزیر اعظم آواس یوجنا",
  },
  "barcoded-ration": {
    gu: "બારકોડેડ રેશનકાર્ડ (NFSA અન્ન સુરક્ષા)",
    mr: "बारकोडेड रेशन कार्ड (NFSA अन्न सुरक्षा)",
    hi: "बारकोडेड राशन कार्ड (NFSA खाद्य सुरक्षा)",
    en: "Barcoded Ration Card (NFSA Food Security)",
    bn: "বারকোডেড রেশন কার্ড (NFSA)",
    ta: "பர்கோடு ரேஷன் அட்டை (NFSA)",
    te: "బార్‌కోడెడ్ రేషన్ కార్డు (NFSA)",
    kn: "ಬಾರ್‌ಕೋಡೆಡ್ ರೇಷನ್ ಕಾರ್ಡ್ (NFSA)",
    ml: "ബാർകോഡഡ് റേഷൻ കാർഡ് (NFSA)",
    pa: "ਬਾਰਕੋਡਿਡ ਰਾਸ਼ਨ ਕਾਰਡ (NFSA)",
    or: "ବାରକୋଡେଡ୍ ରାସନ କାର୍ଡ (NFSA)",
    ur: "بارکوڈڈ راشن کارڈ (NFSA)",
  },
  "ujjwala-yojana": {
    gu: "PM ઉજ્જવલા યોજના (મફત LPG ગેસ)",
    mr: "PM उज्ज्वला योजना (मोफत LPG गॅस)",
    hi: "PM उज्ज्वला योजना (मुफ्त LPG गैस)",
    en: "PM Ujjwala Yojana (Free LPG Gas)",
    bn: "পিএম উজ্জ্বলা যোজনা",
    ta: "பிஎம் உஜ்வாலா திட்டம்",
    te: "పీఎం ఉజ్వల యోజన",
    kn: "ಪಿಎಂ ಉಜ್ವಲ ಯೋಜನೆ",
    ml: "പിഎം ഉജ്ജ്വല യോജന",
    pa: "ਪੀਐਮ ਉਜਵਲਾ ਯੋਜਨਾ",
    or: "ପିଏମ୍ ଉଜ୍ଜ୍ୱଳା ଯୋଜନା",
    ur: "پی ایم اجولا یوجنا",
  },
};

const SCHEME_BENEFITS_TRANSLATIONS: Record<string, Record<string, string[]>> = {
  "pm-kisan": {
    gu: [
      "₹6,000 પ્રતિ વર્ષ (₹2,000 ના ૩ સમાન હપ્તા)",
      "સીધા બેંક ખાતામાં DBT મારફતે જમા",
      "તમામ સીમાંત અને નાના ખેડૂત પરિવારો પાત્ર",
    ],
    mr: [
      "₹६,००० प्रति वर्ष (₹२,००० चे ३ समान हप्ते)",
      "थेट बँक खात्यात DBT द्वारे जमा",
      "सर्व अल्प व अत्यल्प भूधारक शेतकरी पात्र",
    ],
    hi: [
      "₹6,000 प्रति वर्ष (₹2,000 की 3 समान किश्तें)",
      "सीधे बैंक खाते में DBT द्वारा अंतरण",
      "सभी पात्र किसान परिवारों को वित्तीय लाभ",
    ],
    en: [
      "₹6,000 per year (3 equal installments of ₹2,000)",
      "Direct Benefit Transfer (DBT) to bank account",
      "All eligible small and marginal farmer families",
    ],
  },
  "fasal-bima": {
    gu: [
      "ખરીફ પાક માટે માત્ર ૨% પ્રીમિયમ અને રવી પાક માટે ૧.૫% પ્રીમિયમ",
      "દુષ્કાળ, પૂર કે કમોસમી વરસાદ સામે ૧૦૦% વીમા કવચ",
      "દાવાની રકમ સીધી બેંક ખાતામાં જમા",
    ],
    mr: [
      "खरीप पिकासाठी फक्त २% प्रीमियम आणि रब्बीसाठी १.५% प्रीमियम",
      "दुष्काळ, पूर किंवा अवकाळी पावसापासून १००% विमा संरक्षण",
      "दाव्याची रक्कम थेट बँक खात्यात जमा",
    ],
    hi: [
      "खरीफ फसल हेतु मात्र 2% एवं रबी फसल हेतु 1.5% प्रीमियम",
      "सूखा, बाढ़ या बेमौसम बारिश से पूर्ण फसल सुरक्षा",
      "दावे की राशि सीधे बैंक खाते में जमा",
    ],
    en: [
      "Only 2% premium for Kharif crops, 1.5% for Rabi crops",
      "Comprehensive insurance against drought, floods, hailstorms",
      "Claims transferred directly to bank account",
    ],
  },
  "kisan-credit-card": {
    gu: [
      "₹૩ લાખ સુધી માત્ર ૪% રાહત દરે ખેતી ધિરાણ",
      "કોઈપણ પ્રકારની વધારાની જામીનગીરી વિના સરળ લોન",
      "એટીએમ સાથે કિસાન ક્રેડિટ કાર્ડ સુવિધા",
    ],
    mr: [
      "₹३ लाखांपर्यंत केवळ ४% सवलतीच्या दरात पीक कर्ज",
      "कोणत्याही अतिरिक्त हमीशिवाय सुलभ कर्ज मंजुरी",
      "ATM सह RuPay किसान क्रेडिट कार्ड सुविधा",
    ],
    hi: [
      "₹3 लाख तक मात्र 4% रियायती ब्याज दर पर कृषि ऋण",
      "बिना किसी अतिरिक्त बंधक के आसान स्वीकृति",
      "एटीएम सहित किसान क्रेडिट कार्ड सुविधा",
    ],
    en: [
      "Agri credit up to ₹3 Lakhs at concessional 4% interest rate",
      "Collateral-free hassle-free loans up to ₹1.60 Lakhs",
      "RuPay ATM enabled Kisan Credit Card",
    ],
  },
  "sat-pagla-kisan": {
    gu: [
      "દેશી ગાય આધારિત પ્રાકૃતિક ખેતી માટે ₹૯૦૦ પ્રતિ માસ (વાર્ષિક ₹૧૦,૮૦૦)",
      "જીવામૃત બનાવવા માટે કીટ અને ડ્રમ સહાય",
      "ખેડૂતોને સ્માર્ટફોન અને તાર ફેન્સિંગ સહાય",
    ],
    mr: [
      "देशी गाय आधारित नैसर्गिक शेतीसाठी ₹९०० प्रति महिना (वार्षिक ₹१०,८००)",
      "जिवामृत तयार करण्यासाठी ड्रम व किट अनुदान",
      "शेतकऱ्यांना स्मार्टफोन आणि तार कुंपण अनुदान",
    ],
    hi: [
      "देशी गाय आधारित प्राकृतिक खेती हेतु ₹900 प्रति माह (वार्षिक ₹10,800)",
      "जीवामृत तैयार करने हेतु ड्रम एवं किट सहायता",
      "स्मार्टफोन एवं तार फेंसिंग हेतु विशेष सब्सिडी",
    ],
    en: [
      "₹900/month (₹10,800/yr) for indigenous cow natural farming",
      "Drum kit assistance for preparing Jeevamrut",
      "Smartphone subsidy and wire fencing grants",
    ],
  },
  "ayushman-bharat": {
    gu: [
      "ગુજરાતના પરિવારો માટે વાર્ષિક ₹૧૦ લાખ સુધી કેશલેસ સારવાર",
      "સમગ્ર દેશની માન્ય સરકારી અને ખાનગી હોસ્પિટલોમાં મફત દાખલ સેવા",
      "દવાઓ, તપાસ અને ઓપરેશનનો સંપૂર્ણ ખર્ચ સરકાર ભોગવે",
    ],
    mr: [
      "पात्र कुटुंबांसाठी दरवर्षी ₹१० लाखांपर्यंत मोफत कॅशलेस उपचार",
      "देशभरातील सर्व सरकारी व खाजगी रुग्णालयांत मोफत दाखल सुविधा",
      "औषधे, तपासणी व शस्त्रक्रियांचा संपूर्ण खर्च शासनाकडून",
    ],
    hi: [
      "प्रति परिवार प्रति वर्ष ₹10 लाख तक मुफ्त कैशलेस अस्पताल उपचार",
      "देशभर के सूचीबद्ध सरकारी एवं निजी अस्पतालों में भर्ती सुविधा",
      "दवाएं, जांच व ऑपरेशन का सम्पूर्ण खर्च सरकार द्वारा वहन",
    ],
    en: [
      "Up to ₹10 Lakhs per family per year cashless hospital coverage",
      "Secondary and tertiary hospitalization across empanelled hospitals",
      "Pre & post-hospitalization medicines and surgery fully covered",
    ],
  },
  "pm-awas": {
    gu: [
      "ગ્રામીણ વિસ્તારમાં પાકું મકાન બાંધવા ₹૧.૨૦ લાખ સીધી આર્થિક સહાય",
      "શૌચાલય બાંધકામ માટે સ્વચ્છ ભારત મિશન હેઠળ ₹૧૨,૦૦૦ વધારાના",
      "મનરેગા હેઠળ ૯૦ દિવસની મજૂરી સહાય",
    ],
    mr: [
      "ग्रामीण भागात पक्के घर बांधण्यासाठी ₹१.२० लाख थेट आर्थिक मदत",
      "शौचालय बांधकामासाठी स्वच्छ भारत अंतर्गत ₹१२,००० अतिरिक्त",
      "मनरेगा अंतर्गत ९० दिवसांचे रोजगार वेतन",
    ],
    hi: [
      "ग्रामीण क्षेत्र में पक्का मकान निर्माण हेतु ₹1.20 लाख सीधी आर्थिक सहायता",
      "शौचालय निर्माण हेतु स्वच्छ भारत से ₹12,000 अतिरिक्त",
      "मनरेगा अंतर्गत 90 दिन की मजदूरी सहायता",
    ],
    en: [
      "₹1.20 Lakh direct financial assistance for pakka house construction",
      "Additional ₹12,000 under Swachh Bharat Mission for toilet",
      "90 days of unskilled wage labor support under MGNREGA",
    ],
  },
};

const CATEGORY_NAMES_I18N: Record<string, Record<string, string>> = {
  agriculture: {
    gu: "કૃષિ અને ખેડૂત કલ્યાણ",
    mr: "कृषी आणि शेतकरी कल्याण",
    hi: "कृषि एवं किसान कल्याण",
    en: "Agriculture & Farmer Welfare",
    bn: "কৃষি ও কৃষক কল্যাণ",
    ta: "வேளாண்மை மற்றும் உழவர் நலன்",
    te: "వ్యవసాయం & రైతు సంక్షేమం",
    kn: "ಕೃಷಿ ಮತ್ತು ರೈತ ಕಲ್ಯಾಣ",
    ml: "കൃഷിയും കർഷക ക്ഷേമവും",
    pa: "ਖੇਤੀਬਾੜੀ ਅਤੇ ਕਿਸਾਨ ਭਲਾਈ",
    or: "କୃଷି ଏବଂ କୃଷକ କଲ୍ୟାଣ",
    ur: "زراعت اور کسانوں کی بہبود",
  },
  health: {
    gu: "આરોગ્ય અને પરિવાર કલ્યાણ",
    mr: "आरोग्य आणि कुटुंब कल्याण",
    hi: "स्वास्थ्य एवं परिवार कल्याण",
    en: "Health & Family Welfare",
    bn: "স্বাস্থ্য ও পরিবার কল্যাণ",
    ta: "சுகாதாரம் மற்றும் குடும்ப நலம்",
    te: "ఆరోగ్యం & కుటుంబ సంక్షేమం",
    kn: "ಆರೋಗ್ಯ ಮತ್ತು ಕುಟುಂಬ ಕಲ್ಯಾಣ",
    ml: "ആരോഗ്യവും കുടുംബക്ഷേമവും",
    pa: "ਸਿਹਤ ਅਤੇ ਪਰਿਵਾਰ ਭਲਾਈ",
    or: "ସ୍ୱାସ୍ଥ୍ୟ ଏବଂ ପରିବାର କଲ୍ୟାଣ",
    ur: "صحت اور خاندانی بہبود",
  },
  housing: {
    gu: "આવાસ અને શહેરી વિકાસ",
    mr: "गृहनिर्माण आणि नगर विकास",
    hi: "आवास एवं शहरी विकास",
    en: "Housing & Urban Development",
    bn: "আবাসন ও নগর উন্নয়ন",
    ta: "வீட்டுவசதி மற்றும் நகர்ப்புற வளர்ச்சி",
    te: "గృహనిర్మాణం & పట్టణాభివృద్ధి",
    kn: "ವಸತಿ ಮತ್ತು ನಗರಾಭಿವೃದ್ಧಿ",
    ml: "ഭവന നിർമ്മാണവും നഗരവികസനവും",
    pa: "ਹਾਊਸਿੰਗ ਅਤੇ ਸ਼ਹਿਰੀ ਵਿਕਾਸ",
    or: "ଗୃହ ଏବଂ ସହରାଞ୍ଚଳ ବିକାଶ",
    ur: "ہاؤسنگ اور شہری ترقی",
  },
  education: {
    gu: "શિક્ષણ અને શિષ્યવૃત્તિ",
    mr: "शिक्षण आणि शिष्यवृत्ती",
    hi: "शिक्षा एवं छात्रवृत्ति",
    en: "Education & Scholarships",
    bn: "শিক্ষা ও বৃত্তি",
    ta: "கல்வி மற்றும் உதவித்தொகை",
    te: "విద్య & స్కాలర్‌షిప్‌లు",
    kn: "ಶಿಕ್ಷಣ ಮತ್ತು ವಿದ್ಯಾರ್ಥಿವೇತನ",
    ml: "വിദ്യാഭ്യാസവും സ്കോളർഷിപ്പുകളും",
    pa: "ਸਿੱਖਿਆ ਅਤੇ ਵਜ਼ੀਫ਼ੇ",
    or: "ଶିକ୍ଷା ଏବଂ ବୃତ୍ତି",
    ur: "تعلیم اور وظائف",
  },
  women: {
    gu: "મહિલા અને બાળ વિકાસ",
    mr: "महिला आणि बाल विकास",
    hi: "महिला एवं बाल विकास",
    en: "Women & Child Development",
    bn: "মহিলা ও শিশু বিকাশ",
    ta: "மகளிர் மற்றும் குழந்தைகள் மேம்பாடு",
    te: "మహిళా & శిశు సంక్షేమం",
    kn: "ಮಹಿಳಾ ಮತ್ತು ಮಕ್ಕಳ ಅಭಿವೃದ್ಧಿ",
    ml: "വനിതാ ശിശു വികസനം",
    pa: "ਮਹਿਲਾ ਅਤੇ ਬਾਲ ਵਿਕਾਸ",
    or: "ମହିଳା ଏବଂ ଶିଶୁ ବିକାଶ",
    ur: "خواتین اور بچوں کی ترقی",
  },
  business: {
    gu: "ઉદ્યોગ, લોન અને સ્વરોજગાર",
    mr: "उद्योग, कर्ज आणि स्वयंरोजगार",
    hi: "उद्योग, ऋण एवं स्वरोजगार",
    en: "Business, Loans & Self-Employment",
    bn: "শিল্প, ঋণ ও স্বরোজগার",
    ta: "தொழில், கடன் மற்றும் சுயதொழில்",
    te: "వ్యాపారం, రుణాలు & స్వయం ఉపాధి",
    kn: "ಉದ್ಯಮ, ಸಾಲ ಮತ್ತು ಸ್ವಯಂ ಉದ್ಯೋಗ",
    ml: "വ്യവസായം, വായ്പ, സ്വയംതൊഴിൽ",
    pa: "ਕਾਰੋਬਾਰ, ਕਰਜ਼ੇ ਅਤੇ ਸਵੈ-ਰੁਜ਼ਗਾਰ",
    or: "ବ୍ୟବସାୟ, ଋଣ ଏବଂ ସ୍ୱ-ନିୟୋଜନ",
    ur: "کاروبار، قرض اور خود روزگار",
  },
  social: {
    gu: "સામાજિક ન્યાય અને પેન્શન",
    mr: "सामाजिक न्याय आणि निवृत्तीवेतन",
    hi: "सामाजिक न्याय एवं पेंशन",
    en: "Social Justice & Pension",
    bn: "সামাজিক ন্যায় ও পেনশন",
    ta: "சமூக நீதி மற்றும் ஓய்வூதியம்",
    te: "సామాజిక న్యాయం & పెన్షన్",
    kn: "ಸಾಮಾಜಿಕ ನ್ಯಾಯ ಮತ್ತು ಪಿಂಚಣಿ",
    ml: "സാമൂഹ്യനീതിയും പെൻഷനും",
    pa: "ਸਮਾਜਿਕ ਨਿਆਂ ਅਤੇ ਪੈਨਸ਼ਨ",
    or: "ସାମାଜିକ ନ୍ୟାୟ ଏବଂ ପେନସନ",
    ur: "سماجی انصاف اور پنشن",
  },
  digital: {
    gu: "ડિજિટલ સેવા અને પ્રમાણપત્રો",
    mr: "डिजिटल सेवा आणि प्रमाणपत्रे",
    hi: "डिजिटल सेवाएं एवं प्रमाण पत्र",
    en: "Digital Services & Certificates",
    bn: "ডিজিটাল সেবা ও সনদপত্র",
    ta: "டிஜிட்டல் சேவைகள் மற்றும் சான்றிதழ்கள்",
    te: "డిజిటల్ సేవలు & ధృవపత్రాలు",
    kn: "ಡಿಜಿಟಲ್ ಸೇವೆಗಳು ಮತ್ತು ಪ್ರಮಾಣಪತ್ರಗಳು",
    ml: "ഡിജിറ്റൽ സേവനങ്ങളും സർട്ടിഫിക്കറ്റുകളും",
    pa: "ਡਿਜੀਟਲ ਸੇਵਾਵਾਂ ਅਤੇ ਸਰਟੀਫਿਕੇਟ",
    or: "ଡିଜିଟାଲ୍ ସେବା ଏବଂ ପ୍ରମାଣପତ୍ର",
    ur: "ڈیجیٹل خدمات اور سرٹیفکیٹ",
  },
  energy: {
    gu: "સૌર ઊર્જા અને સબસિડી",
    mr: "सौर ऊर्जा आणि अनुदान",
    hi: "सौर ऊर्जा एवं सब्सिडी",
    en: "Solar Energy & Subsidies",
    bn: "সৌরশক্তি ও ভর্তুকি",
    ta: "சூரிய சக்தி மற்றும் மானியங்கள்",
    te: "సౌర శక్తి & రాయితీలు",
    kn: "ಸೌರ ಶಕ್ತಿ ಮತ್ತು ಸಬ್ಸಿಡಿಗಳು",
    ml: "സൗരോർജ്ജവും സബ്‌സിഡിയും",
    pa: "ਸੌਰ ਊਰਜਾ ਅਤੇ ਸਬਸਿਡੀ",
    or: "ସୌର ଶକ୍ତି ଏବଂ ସବସିଡି",
    ur: "شمسی توانائی اور سبسڈی",
  },
};

export function getLocalizedSchemeName(scheme: Scheme, lang = "gu"): string {
  const custom = SCHEME_NAME_TRANSLATIONS[scheme.id]?.[lang];
  if (custom) return custom;
  if (lang === "en") return scheme.name;
  if (lang === "hi") return scheme.nameHi || scheme.name;
  if (lang === "gu") return scheme.nameGu || scheme.name;
  // If specific Indian language is requested and we don't have custom, prefer Marathi or Hindi over Gujarati
  if (lang === "mr") return SCHEME_NAME_TRANSLATIONS[scheme.id]?.mr || scheme.nameHi || scheme.name;
  return scheme.nameGu || scheme.name;
}

export function getLocalizedSchemeBenefits(scheme: Scheme, lang = "gu"): string[] {
  const custom = SCHEME_BENEFITS_TRANSLATIONS[scheme.id]?.[lang];
  if (custom && custom.length > 0) return custom;
  if (lang === "en") return scheme.benefits;
  if (lang === "mr" && SCHEME_BENEFITS_TRANSLATIONS[scheme.id]?.mr) {
    return SCHEME_BENEFITS_TRANSLATIONS[scheme.id].mr;
  }
  if (lang === "hi" && SCHEME_BENEFITS_TRANSLATIONS[scheme.id]?.hi) {
    return SCHEME_BENEFITS_TRANSLATIONS[scheme.id].hi;
  }
  return scheme.benefits;
}

export function getLocalizedCategoryLabel(categoryKey: string, lang = "gu"): string {
  const item = CATEGORY_NAMES_I18N[categoryKey]?.[lang];
  if (item) return item;
  if (lang === "mr") return CATEGORY_NAMES_I18N[categoryKey]?.mr || CATEGORY_NAMES_I18N[categoryKey]?.hi || categoryKey;
  if (lang === "hi") return CATEGORY_NAMES_I18N[categoryKey]?.hi || categoryKey;
  if (lang === "en") return CATEGORY_NAMES_I18N[categoryKey]?.en || categoryKey;
  return CATEGORY_NAMES_I18N[categoryKey]?.gu || categoryKey;
}
