"use client";

import React, { createContext, useContext, useSyncExternalStore, ReactNode } from "react";
import { getStoredLanguage, applyLanguage, DEFAULT_LANGUAGE } from "@/lib/translation";
import { INDIAN_LANGUAGES, IndianLanguage } from "@/lib/languages";

function subscribeLanguage(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("nagrikseva:languageChange", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("nagrikseva:languageChange", callback);
    window.removeEventListener("storage", callback);
  };
}

function getLanguageSnapshot(): string {
  return getStoredLanguage();
}

function getLanguageServerSnapshot(): string {
  return DEFAULT_LANGUAGE;
}

export interface Translations {
  nav: {
    home: string;
    eligibility: string;
    scanner: string;
    benefits: string;
    schemes: string;
    offices: string;
    track: string;
    chat: string;
    helpline: string;
    installApp: string;
    selectLanguage: string;
    allLanguages: string;
    originalLangBadge: string;
    backToGujarati: string;
  };
  common: {
    back: string;
    next: string;
    submit: string;
    search: string;
    download: string;
    close: string;
    verify: string;
    online: string;
    free: string;
  };
  home: {
    smartEligibilityBadge: string;
    smartEligibilityTitle: string;
    smartEligibilityDesc: string;
    checkNowBtn: string;
    mainSchemesTitle: string;
    viewAll: string;
    quickServicesTitle: string;
    chatBotTitle: string;
    openFullScreen: string;
    heroTitle: string;
    heroSubtitle: string;
    heroDesc: string;
    checkEligibilityHero: string;
    calcBenefitsHero: string;
    kacheriLocatorHero: string;
    activeSchemeBadge: string;
    documentsCountLabel: string;
    viewDetailBtn: string;
    applyNowBtn: string;
    quickToolsHeading: string;
    oneClickBadge: string;
    superAppEligibility: string;
    superAppBenefits: string;
    superAppTrack: string;
    superAppDocs: string;
    statSchemes: string;
    statSchemesShort: string;
    statLanguages: string;
    statLanguagesShort: string;
    statAiVoice: string;
    statAiVoiceShort: string;
    statFreeService: string;
    statFreeServiceShort: string;
    swipeTip: string;
    quickServicesList: { label: string; href: string }[];
  };
  chat: {
    subTitle: string;
    modeLabel: string;
    newChat: string;
    startNewChat: string;
    login: string;
    logout: string;
    online: string;
    verifiedCivic: string;
    listen: string;
    stop: string;
    inputPlaceholder: string;
    inputWithAttachment: string;
    listeningPlaceholder: string;
    send: string;
    historyTitle: string;
    noHistory: string;
    noHistorySub: string;
    clearAllHistory: string;
    clearAllConfirm: string;
    dropTitle: string;
    dropDesc: string;
    loginRequired: string;
    loginDesc: string;
    loginBtn: string;
    modalLoginTitle: string;
    modalLoginDesc: string;
    oneClickLogin: string;
    otpLogin: string;
    close: string;
    networkError: string;
    recordingVoice: string;
    docReadyForAudit: string;
    verifiedReportBadge: string;
    officialActCitation: string;
  };
}

const UI_TRANSLATIONS_BASE: Record<string, Translations> = {
  gu: {
    nav: {
      home: "Home",
      eligibility: "પાત્રતા",
      scanner: "📸 AI સ્કેનર",
      benefits: "💰 લાભ ગણો",
      schemes: "Schemes",
      offices: "કચેરી",
      track: "Track",
      chat: "AI Chat",
      helpline: "14567",
      installApp: "એપ ઇન્સ્ટોલ",
      selectLanguage: "ભાષા પસંદ કરો",
      allLanguages: "બધી ૧૬ ભાષાઓ »",
      originalLangBadge: "મૂળ",
      backToGujarati: "ગુજરાતી પર પાછા જાઓ",
    },
    common: {
      back: "પાછળ",
      next: "આગળ",
      submit: "જમા કરો",
      search: "શોધો",
      download: "ડાઉનલોડ",
      close: "બંધ કરો",
      verify: "ચકાસો",
      online: "ઓનલાઇન",
      free: "મફત",
    },
    home: {
      smartEligibilityBadge: "નવું ફીચર",
      smartEligibilityTitle: "તમે કઈ કઈ સરકારી યોજનાના હકદાર છો?",
      smartEligibilityDesc: "ઉંમર, આવક અને વ્યવસાય નાખીને ૧ મિનિટમાં જાણી લો!",
      checkNowBtn: "હમણાં જ ચેક કરો",
      mainSchemesTitle: "મુખ્ય સરકારી યોજનાઓ",
      viewAll: "બધી જુઓ",
      quickServicesTitle: "ઝડપી સેવાઓ (Quick Access)",
      chatBotTitle: "નાગરિકસેવા AI સાથે વાત કરો",
      openFullScreen: "સંપૂર્ણ સ્ક્રીનમાં ખોલો",
      heroTitle: "NagrikSeva AI",
      heroSubtitle: "AI-Powered Digital Public Infrastructure Assistant",
      heroDesc: "સરકારી યોજનાઓ, દસ્તાવેજ સહાય, પાત્રતા ચકાસણી અને સ્થિતિ ટ્રેકિંગ — બધું એક જ જગ્યાએ",
      checkEligibilityHero: "પાત્રતા ચકાસો (Eligibility)",
      calcBenefitsHero: "💰 લાભ ગણો & WhatsApp પાસ",
      kacheriLocatorHero: "કચેરી લોકેટર",
      activeSchemeBadge: "● સક્રિય યોજના",
      documentsCountLabel: "દસ્તાવેજો",
      viewDetailBtn: "વિગત જુઓ",
      applyNowBtn: "અરજી કરો",
      quickToolsHeading: "ઝડપી નાગરિક સેવાઓ (Quick Tools)",
      oneClickBadge: "1-Click",
      superAppEligibility: "પાત્રતા",
      superAppBenefits: "લાભ ગણો",
      superAppTrack: "અરજી ટ્રેક",
      superAppDocs: "દસ્તાવેજ",
      statSchemes: "સરકારી યોજનાઓ",
      statSchemesShort: "યોજનાઓ",
      statLanguages: "ભાષાઓ (ગુજ/હિં/અંગ્રેજી)",
      statLanguagesShort: "ભાષાઓ",
      statAiVoice: "AI & વોઈસ સપોર્ટ",
      statAiVoiceShort: "AI વોઈસ",
      statFreeService: "મફત નાગરિક સેવા",
      statFreeServiceShort: "મફત સેવા",
      swipeTip: "← સ્વાઈપ →",
      quickServicesList: [
        { label: "પાત્રતા કેલ્ક્યુલેટર (Eligibility)", href: "/eligibility" },
        { label: "💰 કુટુંબ લાભ કેલ્ક્યુલેટર & પાસ", href: "/benefit-calculator" },
        { label: "નજીકની કચેરી (Jan Seva Locator)", href: "/locator" },
        { label: "રેશન કાર્ડ ગાઈડ & ચેકલિસ્ટ", href: "/documents?type=ration" },
        { label: "આયુષ્માન કાર્ડ કેવી રીતે કઢાવવું?", href: "/documents?type=health" },
      ],
    },
    chat: {
      subTitle: "સત્તાવાર ઈ-ગવર્નન્સ સહાયક",
      modeLabel: "GU Mode",
      newChat: "નવી ચેટ",
      startNewChat: "➕ નવી ચેટ શરૂ કરો (New Chat)",
      login: "લૉગિન",
      logout: "લૉગઆઉટ",
      online: "Online",
      verifiedCivic: "પ્રમાણિત સરકારી સહાય",
      listen: "સાંભળો 🔊",
      stop: "બંધ કરો",
      inputPlaceholder: "સવાલ પૂછો અથવા દસ્તાવેજ ડ્રોપ કરો...",
      inputWithAttachment: "આ દસ્તાવેજ વિશે સવાલ લખો...",
      listeningPlaceholder: "સ્પષ્ટ બોલો (GU)...",
      send: "મોકલો",
      historyTitle: "ચેટ ઇતિહાસ (History)",
      noHistory: "હજી કોઈ અગાઉની ચેટ નથી.",
      noHistorySub: "તમે જે પણ ચેટ કરશો તે અહીં આપમેળે સેવ થશે.",
      clearAllHistory: "બધી હિસ્ટ્રી સાફ કરો (Clear All)",
      clearAllConfirm: "શું તમે બધી ચેટ હિસ્ટ્રી સાફ કરવા માંગો છો?",
      dropTitle: "📥 સરકારી દસ્તાવેજ અહીં ડ્રોપ કરો",
      dropDesc: "આધાર કાર્ડ, રેશનકાર્ડ, ૭/૧૨, આવકનો દાખલો કે કોઈપણ સરકારી ફોટો ડ્રોપ કરો. AI આપમેળે ખરાઈ કરી માન્ય યોજનાઓ બતાવશે!",
      loginRequired: "🔐 લૉગિન જરૂરી છે",
      loginDesc: "તમારી ખાનગી ચેટ હિસ્ટ્રી અને અરજીઓ સુરક્ષિત રાખવા માટે કૃપા કરીને લૉગિન કરો.",
      loginBtn: "સત્તાવાર નાગરિક લૉગિન",
      modalLoginTitle: "સત્તાવાર નાગરિક 2FA લૉગિન",
      modalLoginDesc: "લૉગિન કરવાથી તમારી ચેટ હિસ્ટ્રી, કુટુંબ પ્રોફાઈલ અને સરકારી અરજીઓ તમારા આધાર / મોબાઈલ સાથે સુરક્ષિત લિંક થશે.",
      oneClickLogin: "⚡ ૧-ક્લિક લૉગિન: હરી વિનોદરાઈ પટેલ",
      otpLogin: "📲 આધાર & OTP વડે લૉગિન પોર્ટલ ખોલો →",
      close: "બંધ કરો",
      networkError: "⚠️ નેટવર્ક જોડાણમાં વિલંબ થયો છે. ગુજરાત જાહેર સેવા હક અધિનિયમ, ૨૦૧૩ હેઠળ તમામ સેવાઓ જનસેવા કેન્દ્ર પર પણ ઉપલબ્ધ છે.",
      recordingVoice: "તમારો અવાજ રેકોર્ડ થઈ રહ્યો છે... GU માં બોલો...",
      docReadyForAudit: "સરકારી માર્ગદર્શિકા મુજબ ચકાસવા તૈયાર",
      verifiedReportBadge: "સરકારી ખરાઈ અહેવાલ",
      officialActCitation: "GRTSA ૨૦૧૩ માન્ય",
    },
  },

  mr: {
    nav: {
      home: "Home",
      eligibility: "पात्रता",
      scanner: "📸 AI स्कॅनर",
      benefits: "💰 लाभ मोजा",
      schemes: "Schemes",
      offices: "कचेरी",
      track: "Track",
      chat: "AI Chat",
      helpline: "14567",
      installApp: "अॅप इन्स्टॉल",
      selectLanguage: "भाषा निवडा",
      allLanguages: "सर्व १६ भाषा »",
      originalLangBadge: "मूळ",
      backToGujarati: "गुजरातीवर परत जा",
    },
    common: {
      back: "मागे",
      next: "पुढे",
      submit: "सबमिट करा",
      search: "शोधा",
      download: "डाउनलोड",
      close: "बंद करा",
      verify: "तपासा",
      online: "ऑनलाइन",
      free: "मोफत",
    },
    home: {
      smartEligibilityBadge: "नवीन वैशिष्ट्य",
      smartEligibilityTitle: "तुम्ही कोणत्या सरकारी योजनांसाठी पात्र आहात?",
      smartEligibilityDesc: "वय, उत्पन्न आणि व्यवसाय निवडून १ मिनिटात जाणून घ्या!",
      checkNowBtn: "आत्ताच तपासा",
      mainSchemesTitle: "मुख्य सरकारी योजना",
      viewAll: "सर्व पहा",
      quickServicesTitle: "जलद सेवा (Quick Access)",
      chatBotTitle: "नागरिकसेवा AI शी संवाद साधा",
      openFullScreen: "पूर्ण स्क्रीनमध्ये उघडा",
      heroTitle: "NagrikSeva AI",
      heroSubtitle: "AI-Powered Digital Public Infrastructure Assistant",
      heroDesc: "सरकारी योजना, कागदपत्र मदत, पात्रता तपासणी आणि स्थिती ट्रॅकिंग — सर्व एकाच ठिकाणी",
      checkEligibilityHero: "पात्रता तपासा (Eligibility)",
      calcBenefitsHero: "💰 लाभ मोजा & WhatsApp पास",
      kacheriLocatorHero: "कार्यालय लोकेटर",
      activeSchemeBadge: "● सक्रिय योजना",
      documentsCountLabel: "कागदपत्रे",
      viewDetailBtn: "तपशील पहा",
      applyNowBtn: "अर्ज करा",
      quickToolsHeading: "जलद नागरिक सेवा (Quick Tools)",
      oneClickBadge: "1-Click",
      superAppEligibility: "पात्रता",
      superAppBenefits: "लाभ मोजा",
      superAppTrack: "अर्ज ट्रॅक",
      superAppDocs: "कागदपत्रे",
      statSchemes: "सरकारी योजना",
      statSchemesShort: "योजना",
      statLanguages: "भाषा (मराठी/हिंदी/इतर)",
      statLanguagesShort: "भाषा",
      statAiVoice: "AI & व्हॉइस सपोर्ट",
      statAiVoiceShort: "AI व्हॉइस",
      statFreeService: "मोफत नागरिक सेवा",
      statFreeServiceShort: "मोफत सेवा",
      swipeTip: "← स्वाइप →",
      quickServicesList: [
        { label: "पात्रता कॅल्क्युलेटर (Eligibility)", href: "/eligibility" },
        { label: "💰 कुटुंब लाभ कॅल्क्युलेटर & पास", href: "/benefit-calculator" },
        { label: "जवळचे कार्यालय (Jan Seva Locator)", href: "/locator" },
        { label: "रेशन कार्ड मार्गदर्शक & यादी", href: "/documents?type=ration" },
        { label: "आयुष्मान कार्ड कसे काढायचे?", href: "/documents?type=health" },
      ],
    },
    chat: {
      subTitle: "अधिकृत ई-प्रशासन सहाय्यक",
      modeLabel: "MR Mode",
      newChat: "नवीन चॅट",
      startNewChat: "➕ नवीन चॅट सुरू करा (New Chat)",
      login: "लॉगिन",
      logout: "लॉगआउट",
      online: "सक्रिय (Online)",
      verifiedCivic: "प्रमाणित सरकारी मदत",
      listen: "ऐका 🔊",
      stop: "थांबवा",
      inputPlaceholder: "प्रश्न विचारा किंवा कागदपत्र ड्रॅग करा...",
      inputWithAttachment: "या कागदपत्राबद्दल प्रश्न विचारा...",
      listeningPlaceholder: "स्पष्ट बोला (MR)...",
      send: "पाठवा",
      historyTitle: "चॅट इतिहास (History)",
      noHistory: "अद्याप कोणताही मागील चॅट नाही.",
      noHistorySub: "तुम्ही जे संभाषण कराल ते येथे आपोआप सेव्ह होईल.",
      clearAllHistory: "सर्व इतिहास साफ करा (Clear All)",
      clearAllConfirm: "तुम्ही सर्व चॅट इतिहास हटवू इच्छिता का?",
      dropTitle: "📥 सरकारी कागदपत्र येथे टाका",
      dropDesc: "आधार कार्ड, रेशन कार्ड, ७/१२, उत्पन्न दाखला किंवा कोणताही सरकारी फोटो टाका. AI आपोआप पडताळणी करेल!",
      loginRequired: "🔐 लॉगिन आवश्यक आहे",
      loginDesc: "तुमचा खाजगी चॅट इतिहास आणि अर्ज सुरक्षित ठेवण्यासाठी कृपया लॉगिन करा.",
      loginBtn: "अधिकृत नागरिक लॉगिन",
      modalLoginTitle: "अधिकृत नागरिक 2FA लॉगिन",
      modalLoginDesc: "लॉगिन केल्याने तुमचा चॅट इतिहास, कौटुंबिक प्रोफाइल आणि सरकारी अर्ज सुरक्षित राहतील.",
      oneClickLogin: "⚡ १-क्लिक लॉगिन: हरी विनोदराय पटेल",
      otpLogin: "📲 आधार & OTP द्वारे लॉगिन पोर्टल उघडा →",
      close: "बंद करा",
      networkError: "⚠️ नेटवर्क जोडणीत अडचण आली आहे. सेवा हक्क अधिनियमांतर्गत सर्व सेवा जनसेवा केंद्रावरही उपलब्ध आहेत.",
      recordingVoice: "तुमचा आवाज रेकॉर्ड होत आहे... मराठीत बोला...",
      docReadyForAudit: "सरकारी नियमांनुसार पडताळणीसाठी तयार",
      verifiedReportBadge: "सरकारी पडताळणी अहवाल",
      officialActCitation: "GRTSA २०१३ मान्य",
    },
  },

  hi: {
    nav: {
      home: "Home",
      eligibility: "पात्रता",
      scanner: "📸 AI स्कैनर",
      benefits: "💰 लाभ गणना",
      schemes: "Schemes",
      offices: "सेवा केंद्र",
      track: "Track",
      chat: "AI Chat",
      helpline: "14567",
      installApp: "ऐप इंस्टॉल",
      selectLanguage: "भाषा चुनें",
      allLanguages: "सभी १६ भाषाएँ »",
      originalLangBadge: "मूल",
      backToGujarati: "गुजराती पर वापस जाएं",
    },
    common: {
      back: "पीछे",
      next: "आगे",
      submit: "जमा करें",
      search: "खोजें",
      download: "डाउनलोड",
      close: "बंद करें",
      verify: "सत्यापित करें",
      online: "ऑनलाइन",
      free: "निःशुल्क",
    },
    home: {
      smartEligibilityBadge: "नया फीचर",
      smartEligibilityTitle: "आप किन-किन सरकारी योजनाओं के पात्र हैं?",
      smartEligibilityDesc: "उम्र, आय और व्यवसाय डालकर १ मिनट में जानें!",
      checkNowBtn: "अभी जांचें",
      mainSchemesTitle: "प्रमुख सरकारी योजनाएं",
      viewAll: "सभी देखें",
      quickServicesTitle: "त्वरित सेवाएं (Quick Access)",
      chatBotTitle: "नागरिकसेवा AI से बात करें",
      openFullScreen: "पूरी स्क्रीन में खोलें",
      heroTitle: "NagrikSeva AI",
      heroSubtitle: "AI-Powered Digital Public Infrastructure Assistant",
      heroDesc: "सरकारी योजनाएं, दस्तावेज़ सहायता, पात्रता जांच और स्थिति ट्रैकिंग — सब एक ही स्थान पर",
      checkEligibilityHero: "पात्रता जांचें (Eligibility)",
      calcBenefitsHero: "💰 लाभ गणना & WhatsApp पास",
      kacheriLocatorHero: "कार्यालय लोकेटर",
      activeSchemeBadge: "● सक्रिय योजना",
      documentsCountLabel: "दस्तावेज़",
      viewDetailBtn: "विवरण देखें",
      applyNowBtn: "आवेदन करें",
      quickToolsHeading: "त्वरित नागरिक सेवाएं (Quick Tools)",
      oneClickBadge: "1-Click",
      superAppEligibility: "पात्रता",
      superAppBenefits: "लाभ गणना",
      superAppTrack: "आवेदन ट्रैक",
      superAppDocs: "दस्तावेज़",
      statSchemes: "सरकारी योजनाएं",
      statSchemesShort: "योजनाएं",
      statLanguages: "भाषाएं (हिंदी/गुज/अंग्रेजी)",
      statLanguagesShort: "भाषाएं",
      statAiVoice: "AI & वॉइस सपोर्ट",
      statAiVoiceShort: "AI वॉइस",
      statFreeService: "निःशुल्क नागरिक सेवा",
      statFreeServiceShort: "मुफ्त सेवा",
      swipeTip: "← स्वाइप →",
      quickServicesList: [
        { label: "पात्रता कैलकुलेटर (Eligibility)", href: "/eligibility" },
        { label: "💰 पारिवारिक लाभ कैलकुलेटर & पास", href: "/benefit-calculator" },
        { label: "नज़दीकी केंद्र (Jan Seva Locator)", href: "/locator" },
        { label: "राशन कार्ड गाइड & चेकलिस्ट", href: "/documents?type=ration" },
        { label: "आयुष्मान कार्ड कैसे बनवाएं?", href: "/documents?type=health" },
      ],
    },
    chat: {
      subTitle: "आधिकारिक ई-गवर्नेंस सहायक",
      modeLabel: "HI Mode",
      newChat: "नई चैट",
      startNewChat: "➕ नई चैट शुरू करें (New Chat)",
      login: "लॉगिन",
      logout: "लॉगआउट",
      online: "ऑनलाइन",
      verifiedCivic: "प्रमाणित सरकारी सहायता",
      listen: "सुनें 🔊",
      stop: "रोकें",
      inputPlaceholder: "सवाल पूछें या दस्तावेज़ अपलोड करें...",
      inputWithAttachment: "इस दस्तावेज़ के बारे में प्रश्न पूछें...",
      listeningPlaceholder: "स्पष्ट बोलें (HI)...",
      send: "भेजें",
      historyTitle: "चैट इतिहास (History)",
      noHistory: "अभी कोई पिछला चैट नहीं है।",
      noHistorySub: "आप जो भी चैट करेंगे वह यहाँ स्वतः सहेज ली जाएगी।",
      clearAllHistory: "सभी चैट हटाएं (Clear All)",
      clearAllConfirm: "क्या आप सभी चैट इतिहास हटाना चाहते हैं?",
      dropTitle: "📥 सरकारी दस्तावेज़ यहाँ छोड़ें",
      dropDesc: "आधार, राशन कार्ड, 7/12, आय प्रमाण पत्र या कोई भी सरकारी फोटो यहाँ छोड़ें। AI स्वतः सत्यापन करेगा!",
      loginRequired: "🔐 लॉगिन आवश्यक है",
      loginDesc: "अपनी चैट हिस्ट्री और आवेदन सुरक्षित रखने के लिए कृपया लॉगिन करें।",
      loginBtn: "आधिकारिक नागरिक लॉगिन",
      modalLoginTitle: "आधिकारिक नागरिक 2FA लॉगिन",
      modalLoginDesc: "लॉगिन करने से आपकी चैट हिस्ट्री और सरकारी आवेदन आधार से सुरक्षित लिंक होंगे।",
      oneClickLogin: "⚡ १-क्लिक लॉगिन: हरी विनोदराय पटेल",
      otpLogin: "📲 आधार व OTP से लॉगिन पोर्टल खोलें →",
      close: "बंद करें",
      networkError: "⚠️ नेटवर्क कनेक्शन में समस्या है। लोक सेवा अधिकार अधिनियम के तहत सभी सेवाएं जन सेवा केंद्र पर भी उपलब्ध हैं।",
      recordingVoice: "आपकी आवाज़ रिकॉर्ड हो रही है... हिंदी में बोलें...",
      docReadyForAudit: "सरकारी नियमों अनुसार सत्यापन हेतु तैयार",
      verifiedReportBadge: "सरकारी सत्यापन रिपोर्ट",
      officialActCitation: "GRTSA २०१३ प्रमाणित",
    },
  },

  en: {
    nav: {
      home: "Home",
      eligibility: "Eligibility",
      scanner: "📸 AI Scanner",
      benefits: "💰 Benefits",
      schemes: "Schemes",
      offices: "Offices",
      track: "Track",
      chat: "AI Chat",
      helpline: "14567",
      installApp: "Install App",
      selectLanguage: "Select Language",
      allLanguages: "All 16 Languages »",
      originalLangBadge: "Default",
      backToGujarati: "Switch back to Gujarati",
    },
    common: {
      back: "Back",
      next: "Next",
      submit: "Submit",
      search: "Search",
      download: "Download",
      close: "Close",
      verify: "Verify",
      online: "Online",
      free: "Free",
    },
    home: {
      smartEligibilityBadge: "New Feature",
      smartEligibilityTitle: "Which Government Schemes Are You Eligible For?",
      smartEligibilityDesc: "Check in 1 minute by entering age, income, and occupation!",
      checkNowBtn: "Check Now",
      mainSchemesTitle: "Major Government Schemes",
      viewAll: "View All",
      quickServicesTitle: "Quick Access Services",
      chatBotTitle: "Chat with NagrikSeva AI",
      openFullScreen: "Open in Full Screen",
      heroTitle: "NagrikSeva AI",
      heroSubtitle: "AI-Powered Digital Public Infrastructure Assistant",
      heroDesc: "Government schemes, document verification, eligibility checking, and tracking — all in one place",
      checkEligibilityHero: "Check Eligibility",
      calcBenefitsHero: "💰 Calculate Benefits & WhatsApp Pass",
      kacheriLocatorHero: "Office Locator",
      activeSchemeBadge: "● Active Scheme",
      documentsCountLabel: "Documents",
      viewDetailBtn: "View Details",
      applyNowBtn: "Apply Now",
      quickToolsHeading: "Quick Citizen Tools",
      oneClickBadge: "1-Click",
      superAppEligibility: "Eligibility",
      superAppBenefits: "Benefits",
      superAppTrack: "Track App",
      superAppDocs: "Documents",
      statSchemes: "Government Schemes",
      statSchemesShort: "Schemes",
      statLanguages: "16 Indian Languages",
      statLanguagesShort: "Languages",
      statAiVoice: "24/7 AI & Voice Support",
      statAiVoiceShort: "AI Voice",
      statFreeService: "100% Free Civic Service",
      statFreeServiceShort: "Free Service",
      swipeTip: "← Swipe →",
      quickServicesList: [
        { label: "Eligibility Calculator", href: "/eligibility" },
        { label: "💰 Family Benefit Calculator & Pass", href: "/benefit-calculator" },
        { label: "Nearby Offices (Jan Seva Locator)", href: "/locator" },
        { label: "Ration Card Guide & Checklist", href: "/documents?type=ration" },
        { label: "How to Apply for Ayushman Card?", href: "/documents?type=health" },
      ],
    },
    chat: {
      subTitle: "Official e-Governance Assistant",
      modeLabel: "EN Mode",
      newChat: "New Chat",
      startNewChat: "➕ Start New Chat",
      login: "Login",
      logout: "Logout",
      online: "Online",
      verifiedCivic: "Verified Civic Aid",
      listen: "Listen 🔊",
      stop: "Stop",
      inputPlaceholder: "Ask a question or drag a document...",
      inputWithAttachment: "Ask a question about this document...",
      listeningPlaceholder: "Listening... speak now...",
      send: "Send",
      historyTitle: "Chat History",
      noHistory: "No previous chat history yet.",
      noHistorySub: "Any messages you send will be saved automatically here.",
      clearAllHistory: "Clear All History",
      clearAllConfirm: "Are you sure you want to clear all chat history?",
      dropTitle: "📥 Drop Government Document Here",
      dropDesc: "Drop Aadhaar, Ration Card, 7/12, Income Certificate or any government photo. AI will audit automatically!",
      loginRequired: "🔐 Login Required",
      loginDesc: "Please log in to keep your chat history and applications securely saved.",
      loginBtn: "Official Citizen Login",
      modalLoginTitle: "Official Citizen 2FA Login",
      modalLoginDesc: "Logging in securely links your chat history and applications to your Aadhaar and mobile.",
      oneClickLogin: "⚡ 1-Click Login: Hari Vinodrai Patel",
      otpLogin: "📲 Open Login Portal with Aadhaar & OTP →",
      close: "Close",
      networkError: "⚠️ Network latency detected. Under the Right to Public Services Act, all services are also available at Jan Seva Kendras.",
      recordingVoice: "Your voice is recording... speak in English...",
      docReadyForAudit: "Ready for official verification",
      verifiedReportBadge: "Verification Audit Report",
      officialActCitation: "GRTSA 2013 Certified",
    },
  },
};

// Generates fallback dictionary for other Indian languages (Bengali, Tamil, Telugu, Malayalam, etc.)
// Uses Gujarati base so Google Translate can cleanly translate everything from the original page
function buildFullTranslations(langCode: string): Translations {
  const base = UI_TRANSLATIONS_BASE[langCode];
  if (base) return base;

  // Use Gujarati as native original base so Google Translate performs uniform full-page translation
  const fallback = UI_TRANSLATIONS_BASE.gu;
  return {
    ...fallback,
    chat: {
      ...fallback.chat,
      modeLabel: `${langCode.toUpperCase()} Mode`,
    },
  };
}

const UI_TRANSLATIONS: Record<string, Translations> = {
  ...UI_TRANSLATIONS_BASE,
  bn: buildFullTranslations("bn"),
  te: buildFullTranslations("te"),
  ta: buildFullTranslations("ta"),
  kn: buildFullTranslations("kn"),
  ml: buildFullTranslations("ml"),
  pa: buildFullTranslations("pa"),
  or: buildFullTranslations("or"),
  ur: buildFullTranslations("ur"),
  as: buildFullTranslations("as"),
  sa: buildFullTranslations("sa"),
  ne: buildFullTranslations("ne"),
};

interface LanguageContextType {
  currentLang: string;
  setLanguage: (lang: string) => void;
  t: Translations;
  languages: IndianLanguage[];
}

const LanguageContext = createContext<LanguageContextType>({
  currentLang: DEFAULT_LANGUAGE,
  setLanguage: () => {},
  t: UI_TRANSLATIONS.gu,
  languages: INDIAN_LANGUAGES,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const currentLang = useSyncExternalStore(
    subscribeLanguage,
    getLanguageSnapshot,
    getLanguageServerSnapshot
  );

  const changeLang = (lang: string) => {
    applyLanguage(lang);
  };

  const t = UI_TRANSLATIONS[currentLang] || UI_TRANSLATIONS.mr || UI_TRANSLATIONS.hi || UI_TRANSLATIONS.en || UI_TRANSLATIONS.gu;

  return (
    <LanguageContext.Provider
      value={{
        currentLang,
        setLanguage: changeLang,
        t,
        languages: INDIAN_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
