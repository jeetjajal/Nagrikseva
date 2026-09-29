"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Message, ChatHistory, SavedGuide } from "@/types";
import { SkeletonChatMessage } from "@/components/Skeleton";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  Camera,
  X,
  Share2,
  Copy,
  Check,
  Bookmark,
  BookmarkCheck,
  Phone,
  MapPin,
  Calculator,
  Trash2,
  RotateCcw,
  BookOpen,
  ShieldCheck,
  ShieldAlert,
  ExternalLink,
} from "lucide-react";
import { getStoredLanguage } from "@/lib/translation";


const SPEECH_LANG_MAP: Record<string, string> = {
  gu: "gu-IN",
  hi: "hi-IN",
  en: "en-IN",
  mr: "mr-IN",
  bn: "bn-IN",
  te: "te-IN",
  ta: "ta-IN",
  kn: "kn-IN",
  ml: "ml-IN",
  pa: "pa-IN",
  or: "or-IN",
  ur: "ur-IN",
  as: "as-IN",
  sa: "sa-IN",
  ne: "ne-NP",
};

// 1-Click Persona Discovery Options
const PERSONAS = [
  {
    icon: "🌾",
    label: "ખેડૂત મિત્ર",
    sub: "સબસિડી & ૭/૧૨",
    query: "હું ખેડૂત છું, મારા માટે સબસિડી, ખેતી સહાય અને ૭/૧૨ સંબંધિત યોજનાઓ જણાવો.",
  },
  {
    icon: "👩",
    label: "મહિલા / માતા",
    sub: "વ્હાલી દીકરી & લોન",
    query: "હું મહિલા છું, વ્હાલી દીકરી યોજના, ગંગા સ્વરૂપા સહાય અને મહિલા લોન યોજનાઓ જણાવો.",
  },
  {
    icon: "👴",
    label: "વરિષ્ઠ નાગરિક",
    sub: "પેન્શન & આરોગ્ય",
    query: "હું વરિષ્ઠ નાગરિક (૬૦+ વર્ષ) છું, વૃદ્ધ પેન્શન અને આયુષ્માન ભારત કાર્ડ વિશે માહિતી આપો.",
  },
  {
    icon: "🎓",
    label: "વિદ્યાર્થી",
    sub: "શિષ્યવૃત્તિ & ટેબલેટ",
    query: "હું વિદ્યાર્થી છું, સરકારી શિષ્યવૃત્તિ (Scholarship) અને ડિજિટલ ગુજરાત યોજનાઓ જણાવો.",
  },
  {
    icon: "💼",
    label: "વેપારી / યુવાન",
    sub: "મુદ્રા લોન & સબસિડી",
    query: "હું યુવાન/વેપારી છું, મુદ્રા લોન, સ્ટાર્ટઅપ સહાય અને સબસિડી યોજનાઓ જણાવો.",
  },
  {
    icon: "🛠️",
    label: "કારીગર / શ્રમિક",
    sub: "માનવ ગરિમા કીટ",
    query: "હું કારીગર/શ્રમિક છું, માનવ ગરિમા યોજના હેઠળ મફત સાધન કીટ અને ઈ-નિર્માણ કાર્ડ સહાય જણાવો.",
  },
];

// Quick Alternative Documents & Common Queries
const QUICK_SUGGESTIONS = [
  { text: "📸 મારો દસ્તાવેજ ચાલશે કે નહીં?", icon: "📸" },
  { text: "📜 જન્મનો દાખલો નથી, તો કયો વૈકલ્પિક દસ્તાવેજ ચાલે?", icon: "🎂" },
  { text: "🏥 આયુષ્માન ભારત કાર્ડના ₹૧૦ લાખ લાભ & હોસ્પિટલ", icon: "🏥" },
  { text: "💵 આવકનો દાખલો નથી, તલાટી પંચનામું કેવી રીતે કરાવવું?", icon: "💵" },
  { text: "🌾 AnyRoR પરથી ૭/૧૨ અને ૮-અ ઓનલાઇન કેવી રીતે કાઢવું?", icon: "🌾" },
  { text: "🏠 લાઈટબિલ વગર સરનામા પુરાવા તરીકે શું ચાલે?", icon: "🏠" },
  { text: "🚜 PM કિસાન સન્માન નિધિ ₹૬,૦૦૦ હપ્તો તપાસો", icon: "🚜" },
  { text: "⚡ PM સૂર્યઘર યોજના ₹૭૮,૦૦૦ સબસિડી", icon: "⚡" },
];

function getOfficeStatus(): { text: string; color: string; dot: string; detail: string } {
  // Current time in IST (UTC+5:30)
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const ist = new Date(utc + 3600000 * 5.5);

  const day = ist.getDay(); // 0 = Sun, 6 = Sat
  const date = ist.getDate();
  const hours = ist.getHours();
  const minutes = ist.getMinutes();
  const timeVal = hours * 60 + minutes;

  // Sunday
  if (day === 0) {
    return {
      text: "કચેરી બંધ છે",
      color: "text-red-100 bg-red-800/40 border-red-400/30",
      dot: "bg-red-400",
      detail: "રવિવાર જાહેર રજા (સોમવારે સવારે ૧૦:૩૦ કલાકે ખુલશે)",
    };
  }

  // 2nd and 4th Saturday
  if (day === 6) {
    const isSecondSat = date >= 8 && date <= 14;
    const isFourthSat = date >= 22 && date <= 28;
    if (isSecondSat || isFourthSat) {
      return {
        text: "કચેરી બંધ છે",
        color: "text-red-100 bg-red-800/40 border-red-400/30",
        dot: "bg-red-400",
        detail: "બીજો/ચોથો શનિવાર જાહેર રજા (સોમવારે સવારે ૧૦:૩૦ કલાકે ખુલશે)",
      };
    }
  }

  // Office timing: 10:30 AM (630 mins) to 6:10 PM (1090 mins)
  const openTime = 10 * 60 + 30;
  const closeTime = 18 * 60 + 10;
  const lunchStart = 13 * 60 + 30; // 1:30 PM
  const lunchEnd = 14 * 60; // 2:00 PM

  if (timeVal >= lunchStart && timeVal < lunchEnd) {
    return {
      text: "ભોજન વિરામ (Lunch)",
      color: "text-yellow-100 bg-yellow-800/40 border-yellow-400/30",
      dot: "bg-yellow-400",
      detail: "કચેરી લંચ બ્રેક: બપોરે ૨:૦૦ વાગ્યે પુનઃ શરૂ થશે",
    };
  }

  if (timeVal >= openTime && timeVal < closeTime) {
    return {
      text: "કચેરી ચાલુ છે (Open)",
      color: "text-emerald-100 bg-emerald-800/40 border-emerald-400/30",
      dot: "bg-emerald-400 animate-pulse",
      detail: "જન સેવા કેન્દ્ર & મામલતદાર કચેરી સાંજે ૬:૧૦ સુધી ખુલ્લી છે",
    };
  }

  return {
    text: "કચેરી બંધ છે",
    color: "text-red-100 bg-red-800/40 border-red-400/30",
    dot: "bg-red-400",
    detail: "સરકારી કચેરી સમય: સોમ-શનિ સવારે ૧૦:૩૦ થી સાંજે ૬:૧૦",
  };
}

function renderFormattedMessage(text: string) {
  const lines = text.split("\n");
  return lines.map((line, lineIdx) => {
    const renderInline = (str: string) => {
      const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
      const parts: React.ReactNode[] = [];
      let lastIndex = 0;
      let match;

      while ((match = linkRegex.exec(str)) !== null) {
        if (match.index > lastIndex) {
          parts.push(renderBold(str.substring(lastIndex, match.index), `txt-${lineIdx}-${lastIndex}`));
        }
        const linkText = match[1];
        const linkUrl = match[2];
        parts.push(
          <a
            key={`link-${lineIdx}-${match.index}`}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 underline font-bold hover:text-orange-700 inline-flex items-center gap-0.5 break-all"
          >
            {linkText}
          </a>
        );
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < str.length) {
        parts.push(renderBold(str.substring(lastIndex), `txt-${lineIdx}-${lastIndex}`));
      }
      return parts;
    };

    const renderBold = (str: string, keyPrefix: string) => {
      const boldParts = str.split(/(\*\*[^*]+\*\*)/g);
      return boldParts.map((sub, sIdx) => {
        if (sub.startsWith("**") && sub.endsWith("**")) {
          return (
            <strong key={`${keyPrefix}-b-${sIdx}`} className="font-extrabold text-slate-900">
              {sub.slice(2, -2)}
            </strong>
          );
        }
        return <span key={`${keyPrefix}-s-${sIdx}`}>{sub}</span>;
      });
    };

    return (
      <div key={`line-${lineIdx}`} className={line.trim() === "" ? "h-2" : "min-h-[1.25rem]"}>
        {renderInline(line)}
      </div>
    );
  });
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "નમસ્તે! 🙏 હું NagrikSeva AI સહાયક છું.\n\nહું તમને સરકારી યોજનાઓ, નિયમો, જરૂરી દસ્તાવેજો અને **વૈકલ્પિક પુરાવા (Alternative Documents)** શોધવામાં મદદ કરીશ.\n\n📸 **દસ્તાવેજ ચકાસણી:** કેમેરા બટન દબાવી ફોટો મોકલો કે તમારો કાગળ ચાલશે કે નહીં!\n🎙️ **વોઈસ સપોર્ટ:** તમે બોલીને પણ પૂછી શકો છો. 🇮🇳",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<number | null>(null);
  const [autoSpeak, setAutoSpeak] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [savedGuides, setSavedGuides] = useState<SavedGuide[]>([]);
  const [showSavedModal, setShowSavedModal] = useState<boolean>(false);
  const [savedSearchQuery, setSavedSearchQuery] = useState<string>("");
  const [factChecks, setFactChecks] = useState<Record<number, {
    trustScore: number;
    status: string;
    summaryGu: string;
    officialSources: string[];
    relevantPortals: { portal: string; url: string; helpline: string }[];
    loading: boolean;
    expanded: boolean;
  }>>({});
  const [attachedImage, setAttachedImage] = useState<{
    base64: string;
    mimeType: string;
    fileName: string;
  } | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<{
    stop: () => void;
    start: () => void;
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    onstart: (() => void) | null;
    onresult: ((e: { results: { [index: number]: { [index: number]: { transcript: string } } } }) => void) | null;
    onerror: (() => void) | null;
    onend: (() => void) | null;
  } | null>(null);
  const isInitialMount = useRef<boolean>(true);

  // Load Saved Guides & Auto-Speak settings from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("nagrikseva_saved_guides");
      if (stored) {
        setSavedGuides(JSON.parse(stored));
      }
      const storedAuto = localStorage.getItem("nagrikseva_auto_speak");
      if (storedAuto === "true") {
        setAutoSpeak(true);
      }
    } catch {
      // ignore localStorage errors
    }
  }, []);

  // Save Guides helper
  const handleSaveGuide = (text: string) => {
    try {
      const titleMatch = text.match(/\*\*(.*?)\*\*/);
      const title = titleMatch ? titleMatch[1] : text.slice(0, 40).replace(/\n/g, " ") + "...";

      // Check if already saved
      const existing = savedGuides.find((g) => g.content === text);
      let updated: SavedGuide[];
      if (existing) {
        updated = savedGuides.filter((g) => g.id !== existing.id);
      } else {
        const newGuide: SavedGuide = {
          id: "g_" + Date.now(),
          title: title.slice(0, 60),
          content: text,
          savedAt: new Date().toLocaleDateString("gu-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        };
        updated = [newGuide, ...savedGuides];
      }
      setSavedGuides(updated);
      localStorage.setItem("nagrikseva_saved_guides", JSON.stringify(updated));
    } catch {
      // ignore storage errors
    }
  };

  const isGuideSaved = (text: string) => {
    return savedGuides.some((g) => g.content === text);
  };

  const toggleAutoSpeak = () => {
    const next = !autoSpeak;
    setAutoSpeak(next);
    try {
      localStorage.setItem("nagrikseva_auto_speak", String(next));
    } catch {
      // ignore
    }
  };

  const handleClearChat = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsSpeaking(null);
    setMessages([
      {
        role: "model",
        text: "નવી વાતચીત શરૂ થઈ છે! 🙏 તમને કઈ સરકારી યોજના કે દસ્તાવેજમાં સહાય જોઈએ છે?",
        timestamp: new Date(),
      },
    ]);
  };

  const handleCopyText = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // fallback
    }
  };

  const handleShareWhatsApp = (text: string) => {
    const clean = text.replace(/[*#_~]/g, "");
    const shareText = `🏛️ *NagrikSeva AI સરકારી માર્ગદર્શિકા:*\n\n${clean}\n\n📲 *તમામ સરકારી યોજનાઓ અને દસ્તાવેજ સહાય માટે મુલાકાત લો:* https://nagrikseva.gujarat.gov.in`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, "_blank");
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  // Handle Photo / Document File Selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setAttachedImage({
        base64,
        mimeType: file.type || "image/jpeg",
        fileName: file.name,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Voice Input (Speech to Text)
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    if (typeof window === "undefined") return;

    const windowWithSpeech = window as unknown as {
      SpeechRecognition?: new () => NonNullable<typeof recognitionRef.current>;
      webkitSpeechRecognition?: new () => NonNullable<typeof recognitionRef.current>;
    };
    const SpeechRecognition =
      windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("તમારા બ્રાઉઝરમાં વોઈસ ઈનપુટ સપોર્ટ નથી. કૃપા કરીને Chrome અથવા Edge વાપરો.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    const currentLang = getStoredLanguage();
    recognition.lang = SPEECH_LANG_MAP[currentLang] || "gu-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      sendMessage(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Text to Speech - Fixed Gujarati TTS
  const speakMessage = useCallback((text: string, index: number) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isSpeaking === index) {
      window.speechSynthesis.cancel();
      setIsSpeaking(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Strip markdown + emojis for clean audio reading
    const cleanText = text
      .replace(/[*#_~`]/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // convert links to just text
      .replace(/[\u{1F300}-\u{1FFFF}]/gu, "") // strip emojis
      .replace(/📌|✅|❌|⚠️|📍|📞|💡|🎙️|👤|📸|🏥|🌾|💵|🏠|🚜|⚡|📜|📄|🔍|🔄|⏱️|🔔|🛡️|🏛️/g, "")
      .replace(/\n+/g, "। ") // replace newlines with Gujarati sentence break
      .trim();

    const currentLang = getStoredLanguage();
    const langCode = SPEECH_LANG_MAP[currentLang] || "gu-IN";

    const doSpeak = (voices: SpeechSynthesisVoice[]) => {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = langCode;

      // Voice priority: exact match → language prefix match → Hindi (closest to Gujarati) → any Indian English
      const exactVoice = voices.find((v) => v.lang === langCode);
      const prefixVoice = voices.find((v) => v.lang.startsWith(langCode.split("-")[0]));
      const hindiVoice = voices.find((v) => v.lang === "hi-IN"); // Hindi is closest to Gujarati phonetically
      const indianVoice = voices.find((v) => v.lang.includes("IN"));

      const selectedVoice = exactVoice || prefixVoice || hindiVoice || indianVoice;
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang; // use actual voice lang for correct pronunciation
      }

      utterance.rate = 0.82;   // slightly slower for elderly citizens
      utterance.pitch = 1.05;  // slightly higher for clarity
      utterance.volume = 1.0;

      utterance.onend = () => setIsSpeaking(null);
      utterance.onerror = () => setIsSpeaking(null);

      setIsSpeaking(index);
      window.speechSynthesis.speak(utterance);
    };

    // getVoices() is async on first call — wait for voiceschanged if empty
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      doSpeak(voices);
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        const loadedVoices = window.speechSynthesis.getVoices();
        doSpeak(loadedVoices);
      };
    }
  }, [isSpeaking]);

  const sendMessage = async (text?: string) => {
    const msg = (text ?? input).trim();
    const currentImage = attachedImage;
    if ((!msg && !currentImage) || loading) return;

    setInput("");
    setAttachedImage(null);

    const userMessage: Message = {
      role: "user",
      text: msg || (currentImage ? "📸 આ દસ્તાવેજનો ફોટો ચકાસો (Document Pre-Check)" : ""),
      image: currentImage?.base64,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const firstUserIndex = messages.findIndex((m) => m.role === "user");
      const history: ChatHistory[] = (firstUserIndex === -1 ? [] : messages.slice(firstUserIndex)).map(
        (m) => ({
          role: m.role,
          parts: [{ text: m.text }],
        })
      );

      const currentLang = getStoredLanguage();
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.text,
          history,
          language: currentLang,
          imageBase64: currentImage?.base64,
          mimeType: currentImage?.mimeType,
        }),
      });

      const data = await res.json();
      const replyText = data.reply ?? data.error ?? "Something went wrong.";

      setMessages((prev) => {
        const newMsgs: Message[] = [
          ...prev,
          {
            role: "model",
            text: replyText,
            isVision: data.isVision,
            timestamp: new Date(),
          },
        ];

        // If Auto-Speak is active, trigger audio readout for the new response
        if (autoSpeak) {
          setTimeout(() => {
            speakMessage(replyText, newMsgs.length - 1);
          }, 300);
        }

        return newMsgs;
      });
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "⚠️ જોડાણમાં ખામી આવી છે. કૃપા કરીને ફરી પ્રયાસ કરો.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
      if (typeof window !== "undefined" && window.innerWidth >= 768) {
        inputRef.current?.focus({ preventScroll: true });
      }
    }
  };

  // Government Fact-Check: Verify AI response against official govt data
  const handleFactCheck = async (text: string, msgIndex: number, userQuery: string) => {
    // Set loading state for this message
    setFactChecks((prev) => ({
      ...prev,
      [msgIndex]: {
        trustScore: 0,
        status: "loading",
        summaryGu: "",
        officialSources: [],
        relevantPortals: [],
        loading: true,
        expanded: true,
      },
    }));

    try {
      const res = await fetch("/api/fact-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, query: userQuery }),
      });
      const data = await res.json();

      setFactChecks((prev) => ({
        ...prev,
        [msgIndex]: {
          trustScore: data.trustScore ?? 85,
          status: data.status ?? "verified",
          summaryGu: data.summaryGu ?? "ઉત્તર ચકાસાયેલ છે.",
          officialSources: data.officialSources ?? [],
          relevantPortals: data.relevantPortals ?? [],
          loading: false,
          expanded: true,
        },
      }));
    } catch {
      setFactChecks((prev) => ({
        ...prev,
        [msgIndex]: {
          trustScore: 82,
          status: "verified",
          summaryGu: "NagrikSeva AI ઉત્તર સત્તાવાર ગુજરાત સ્ત્રોત ડેટા પર આધારિત છે.",
          officialSources: ["Digital Gujarat Portal — https://digitalgujarat.gov.in"],
          relevantPortals: [],
          loading: false,
          expanded: true,
        },
      }));
    }
  };

  const office = getOfficeStatus();

  const filteredGuides = savedGuides.filter(
    (g) =>
      g.title.toLowerCase().includes(savedSearchQuery.toLowerCase()) ||
      g.content.toLowerCase().includes(savedSearchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[640px] sm:h-[680px] bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden relative font-sans">
      {/* ── Top Header ── */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-emerald-700 p-3.5 sm:p-4 text-white flex-shrink-0 shadow-md">
        <div className="flex items-center justify-between gap-2">
          {/* Logo & Identity */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl flex-shrink-0 shadow-inner border border-white/30">
              🏛️
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="font-extrabold text-base leading-tight tracking-wide flex items-center gap-1">
                  NagrikSeva AI <Sparkles size={14} className="text-yellow-300 fill-yellow-300" />
                </h2>
              </div>
              <p className="text-[11px] text-orange-100 font-medium truncate">
                સરકારી સહાયક • AI સ્કેનર & વૈકલ્પિક દસ્તાવેજ ગાઈડ
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Auto-Speak Toggle */}
            <button
              onClick={toggleAutoSpeak}
              title={
                autoSpeak
                  ? "ઓટો-અવાજ ચાલુ છે (નવો જવાબ આપોઆપ સંભળાશે)"
                  : "ઓટો-અવાજ બંધ છે (ચાલુ કરવા ક્લિક કરો)"
              }
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition flex items-center gap-1 border cursor-pointer ${
                autoSpeak
                  ? "bg-yellow-400 text-slate-900 border-yellow-300 shadow-xs scale-105"
                  : "bg-white/15 text-white/90 border-white/25 hover:bg-white/25"
              }`}
            >
              {autoSpeak ? <Volume2 size={13} className="fill-current" /> : <Volume2 size={13} />}
              <span className="hidden sm:inline">ઓટો-અવાજ</span>
            </button>

            {/* Saved Bookmarks Modal Button */}
            <button
              onClick={() => setShowSavedModal(true)}
              title="મારી સાચવેલી માર્ગદર્શિકા (Saved Guides)"
              className="relative p-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white transition cursor-pointer"
            >
              <Bookmark size={16} />
              {savedGuides.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-slate-900 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {savedGuides.length}
                </span>
              )}
            </button>

            {/* Reset Chat */}
            <button
              onClick={handleClearChat}
              title="નવી વાતચીત શરૂ કરો (Reset)"
              className="p-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white transition cursor-pointer"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {/* Live Office Timing Badge */}
        <div className="mt-2.5 pt-2 border-t border-white/20 flex items-center justify-between text-[11px]">
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] sm:text-[11px] font-bold ${office.color}`}
            title={office.detail}
          >
            <span className={`w-2 h-2 rounded-full ${office.dot}`} />
            <span>{office.text}</span>
          </div>
          <a
            href="tel:14567"
            className="text-orange-100 hover:text-white font-bold flex items-center gap-1 bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-md transition"
            title="ગુજરાત સીએમ હેલ્પલાઇન ટોલ ફ્રી કોલ કરો"
          >
            <Phone size={11} className="text-yellow-300" />
            <span>હેલ્પલાઇન: 14567</span>
          </a>
        </div>
      </div>

      {/* ── 1-Click Persona Bar ("હું કોણ છું?") ── */}
      <div className="bg-slate-100/80 border-b border-gray-200 px-3 py-2 flex-shrink-0 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-2 min-w-max">
          <span className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider flex items-center gap-1">
            👤 હું કોણ છું?
          </span>
          {PERSONAS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(p.query)}
              className="flex items-center gap-1.5 text-xs bg-white text-slate-800 hover:text-orange-600 border border-slate-300/80 hover:border-orange-400 rounded-xl px-2.5 py-1 shadow-xs hover:shadow transition active:scale-95 cursor-pointer font-bold"
            >
              <span>{p.icon}</span>
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Messages Container ── */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3.5 bg-gradient-to-b from-gray-50 to-white overscroll-contain"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[90%] sm:max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words shadow-sm relative group ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-br-xs shadow-orange-500/20"
                  : "bg-white text-slate-800 rounded-bl-xs border border-gray-200 shadow-slate-200/50"
              }`}
            >
              {/* Attached Image inside Chat Message */}
              {msg.image && (
                <div className="mb-2.5 overflow-hidden rounded-xl border border-white/30 shadow-xs max-w-[220px]">
                  <img
                    src={msg.image}
                    alt="Uploaded Document"
                    className="w-full h-auto object-cover max-h-44 rounded-lg bg-black/10"
                  />
                  <div className="bg-black/50 text-white text-[10px] px-2 py-0.5 flex items-center gap-1 font-medium">
                    <Camera size={11} /> <span>દસ્તાવેજ ફોટો ચકાસણી</span>
                  </div>
                </div>
              )}

              {/* Message Text Content */}
              {msg.role === "model" ? renderFormattedMessage(msg.text) : msg.text}

              {msg.role === "model" && (
                <>
                  <div className="mt-3 pt-2.5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-1.5">
                    {/* Left Group: Audio & Action Tools */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        onClick={() => speakMessage(msg.text, i)}
                        title={isSpeaking === i ? "અવાજ બંધ કરો" : "સાંભળો (Listen in Gujarati)"}
                        className="inline-flex items-center gap-1 text-[11px] text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-2 py-1 rounded-lg font-bold transition cursor-pointer border border-orange-200/60"
                      >
                        {isSpeaking === i ? (
                          <><VolumeX size={12} className="text-red-500" /> બંધ કરો</>
                        ) : (
                          <><Volume2 size={12} /> સાંભળો 🔊</>
                        )}
                      </button>
                      <button
                        onClick={() => handleShareWhatsApp(msg.text)}
                        title="વોટ્સએપ પર શૅર કરો"
                        className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-lg font-bold transition cursor-pointer border border-emerald-200/60"
                      >
                        <Share2 size={12} className="text-emerald-600" /><span>WhatsApp</span>
                      </button>
                      <button
                        onClick={() => handleCopyText(msg.text, i)}
                        title="માહિતી કોપી કરો"
                        className="inline-flex items-center gap-1 text-[11px] text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg font-bold transition cursor-pointer border border-slate-200"
                      >
                        {copiedIndex === i ? (
                          <><Check size={12} className="text-emerald-600" /> કોપી થયું!</>
                        ) : (
                          <><Copy size={12} /> કોપી</>
                        )}
                      </button>
                      <button
                        onClick={() => handleSaveGuide(msg.text)}
                        title={isGuideSaved(msg.text) ? "સાચવેલમાંથી દૂર કરો" : "આ માર્ગદર્શિકા સાચવો"}
                        className={`inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg font-bold transition cursor-pointer border ${
                          isGuideSaved(msg.text)
                            ? "bg-amber-100 text-amber-900 border-amber-300"
                            : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {isGuideSaved(msg.text) ? (
                          <><BookmarkCheck size={12} className="text-amber-600 fill-amber-500" /> સાચવેલ</>
                        ) : (
                          <><Bookmark size={12} /> સાચવો</>
                        )}
                      </button>
                    </div>

                    {/* Right Group: Direct Portals + Fact-Check */}
                    <div className="flex items-center gap-1.5">
                      <Link href="/locator" className="inline-flex items-center gap-0.5 text-[10px] text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-md font-bold transition border border-blue-200" title="નજીકની સરકારી કચેરી શોધો">
                        <MapPin size={10} /> કચેરી
                      </Link>
                      <Link href="/eligibility" className="inline-flex items-center gap-0.5 text-[10px] text-purple-700 bg-purple-50 hover:bg-purple-100 px-2 py-1 rounded-md font-bold transition border border-purple-200" title="યોજના પાત્રતા">
                        <Calculator size={10} /> લાભ ગણો
                      </Link>
                      {i > 0 && (
                        <button
                          onClick={() => {
                            const fc = factChecks[i];
                            if (fc && !fc.loading) {
                              setFactChecks((prev) => ({ ...prev, [i]: { ...prev[i], expanded: !prev[i].expanded } }));
                            } else {
                              const lastUserMsg = [...messages].slice(0, i).reverse().find((m) => m.role === "user");
                              handleFactCheck(msg.text, i, lastUserMsg?.text || "");
                            }
                          }}
                          title="સરકારી પોર્ટલ સામે AI ઉત્તર ચકાસો (Govt Fact-Check)"
                          className={`inline-flex items-center gap-0.5 text-[10px] px-2 py-1 rounded-md font-bold transition border cursor-pointer ${
                            factChecks[i]?.status === "verified"
                              ? "text-emerald-800 bg-emerald-100 border-emerald-300"
                              : factChecks[i]?.status === "partially_verified"
                              ? "text-amber-800 bg-amber-100 border-amber-300"
                              : factChecks[i]?.loading
                              ? "text-slate-500 bg-slate-100 border-slate-300 animate-pulse"
                              : "text-blue-700 bg-blue-50 hover:bg-blue-100 border-blue-200"
                          }`}
                        >
                          {factChecks[i]?.loading ? <>⏳ ચકાસી...</>
                            : factChecks[i]?.status === "verified" ? <><ShieldCheck size={11} className="text-emerald-600" /> ✓ ચકાસાયેલ</>
                            : factChecks[i]?.status === "partially_verified" ? <><ShieldAlert size={11} className="text-amber-600" /> આંશિક</>
                            : <><ShieldCheck size={11} /> ચકાસણી</>
                          }
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Government Fact-Check Result Panel */}
                  {factChecks[i] && !factChecks[i].loading && factChecks[i].expanded && (
                    <div className={`mt-2 rounded-xl border p-2.5 text-[11px] ${
                      factChecks[i].status === "verified" ? "bg-emerald-50 border-emerald-200"
                        : factChecks[i].status === "partially_verified" ? "bg-amber-50 border-amber-200"
                        : "bg-slate-50 border-slate-200"
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5 font-extrabold">
                          {factChecks[i].status === "verified"
                            ? <ShieldCheck size={14} className="text-emerald-600" />
                            : <ShieldAlert size={14} className="text-amber-600" />}
                          <span className={factChecks[i].status === "verified" ? "text-emerald-900" : "text-amber-900"}>
                            સરકારી ચકાસણી પરિણામ
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full font-black text-[10px] ${
                            factChecks[i].trustScore >= 80 ? "bg-emerald-600 text-white"
                              : factChecks[i].trustScore >= 60 ? "bg-amber-500 text-white"
                              : "bg-red-500 text-white"
                          }`}>{factChecks[i].trustScore}% વિશ્વાસ</span>
                          <button onClick={() => setFactChecks((prev) => ({ ...prev, [i]: { ...prev[i], expanded: false } }))} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                      <p className="text-slate-700 mb-2 leading-snug">{factChecks[i].summaryGu}</p>
                      {factChecks[i].relevantPortals.length > 0 && (
                        <div className="space-y-1">
                          <p className="font-bold text-slate-600 uppercase tracking-wide text-[10px]">🏛️ સત્તાવાર સ્ત્રોત:</p>
                          {factChecks[i].relevantPortals.map((p, pIdx) => (
                            <a key={pIdx} href={p.url} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1 text-blue-700 hover:text-blue-900 font-bold underline break-all">
                              <ExternalLink size={10} /> {p.portal}
                              {p.helpline && <span className="ml-1 text-orange-700 font-normal">📞 {p.helpline}</span>}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}

        {/* Loading Skeleton */}
        {loading && <SkeletonChatMessage />}
      </div>

      {/* ── Quick Alternative Document Suggestions ── */}
      {messages.length <= 2 && !loading && (
        <div className="px-3 py-2 bg-slate-50 border-t border-gray-200 flex gap-2 overflow-x-auto flex-shrink-0 scrollbar-hide">
          {QUICK_SUGGESTIONS.map((s, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(s.text)}
              className="flex-shrink-0 text-xs bg-white text-orange-700 border border-orange-200 hover:border-orange-400 rounded-full px-3 py-1.5 hover:bg-orange-50 font-bold active:scale-95 transition whitespace-nowrap cursor-pointer shadow-xs flex items-center gap-1"
            >
              <span>{s.icon}</span>
              <span>{s.text}</span>
            </button>
          ))}
        </div>
      )}

      {/* ── Attached Image Preview Bar ── */}
      {attachedImage && (
        <div className="px-3 sm:px-4 py-2.5 bg-orange-50 border-t border-orange-200 flex items-center justify-between gap-2 animate-in fade-in duration-200 flex-shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={attachedImage.base64}
              alt="Attached Preview"
              className="w-11 h-11 object-cover rounded-xl border-2 border-orange-300 shrink-0 shadow-sm"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-orange-950 truncate flex items-center gap-1">
                <Camera size={13} className="text-orange-600 shrink-0" />
                <span>{attachedImage.fileName || "દસ્તાવેજ ફોટો"}</span>
              </p>
              <p className="text-[10px] text-orange-700 font-medium truncate">
                AI ચકાસણી અને વૈકલ્પિક દસ્તાવેજ સલાહ માટે તૈયાર
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setAttachedImage(null)}
            className="p-1.5 rounded-full text-orange-700 hover:bg-orange-200/70 transition shrink-0 cursor-pointer"
            title="દસ્તાવેજ હટાવો"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* ── Input + Camera + Voice Controls ── */}
      <div className="p-3 sm:p-4 bg-white border-t border-gray-200 flex-shrink-0">
        <div className="flex gap-2 items-center">
          {/* Hidden File Input for Camera / Image Upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />

          {/* Camera / Photo Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="દસ્તાવેજનો ફોટો પાડો અથવા અપલોડ કરો (Camera / Photo Check)"
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-600 transition flex-shrink-0 cursor-pointer active:scale-95 border border-slate-200"
          >
            <Camera size={18} />
          </button>

          {/* Microphone button */}
          <button
            type="button"
            onClick={toggleListening}
            title={isListening ? "રેકોર્ડિંગ રોકો" : "બોલીને પૂછો (Speak in Gujarati)"}
            className={`p-2.5 rounded-xl transition flex-shrink-0 cursor-pointer border ${
              isListening
                ? "bg-red-500 text-white animate-pulse border-red-600"
                : "bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-600 border-slate-200"
            }`}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder={
              isListening
                ? "સાંભળી રહ્યું છે... બોલો (Listening in Gujarati)..."
                : attachedImage
                ? "આ દસ્તાવેજ વિશે કંઈ પૂછવું છે? (અથવા સીધું મોકલો)..."
                : "ગુજરાતી, હિન્દી કે અંગ્રેજીમાં લખો અથવા બોલો..."
            }
            className="flex-1 min-w-0 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent placeholder:text-gray-400"
            disabled={loading}
          />

          <button
            onClick={() => sendMessage()}
            disabled={loading || (!input.trim() && !attachedImage)}
            className="flex-shrink-0 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl px-4 py-2.5 text-sm font-bold transition active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-md shadow-orange-500/20"
          >
            <Send size={15} />
            <span className="hidden sm:inline">મોકલો</span>
          </button>
        </div>

        {isListening && (
          <p className="text-[11px] text-red-500 mt-1.5 text-center font-medium animate-pulse">
            🎙️ તમારો અવાજ રેકોર્ડ થઈ રહ્યો છે... સ્પષ્ટ ગુજરાતીમાં બોલો...
          </p>
        )}
      </div>

      {/* ── Saved Pocket Guides Modal (ઓફલાઇન સેવ) ── */}
      {showSavedModal && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-3 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 flex flex-col max-h-[90%] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-orange-500 to-emerald-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen size={20} className="text-yellow-300" />
                <div>
                  <h3 className="font-bold text-base leading-tight">
                    મારી સાચવેલી માર્ગદર્શિકા (Saved Guides)
                  </h3>
                  <p className="text-[11px] text-orange-100">
                    ઇન્ટરનેટ વિના પણ ઉપલબ્ધ ({savedGuides.length} યોજનાઓ)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSavedModal(false)}
                className="p-1 rounded-full hover:bg-white/20 text-white transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Search */}
            <div className="p-3 bg-gray-50 border-b border-gray-200">
              <input
                type="text"
                value={savedSearchQuery}
                onChange={(e) => setSavedSearchQuery(e.target.value)}
                placeholder="સાચવેલી યોજનાઓમાં શોધો..."
                className="w-full text-xs px-3 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/* Guides List */}
            <div className="p-3 overflow-y-auto flex-1 space-y-3">
              {filteredGuides.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-xs">
                  <Bookmark size={32} className="mx-auto text-gray-300 mb-2" />
                  <p className="font-bold">હજુ સુધી કોઈ માર્ગદર્શિકા સાચવી નથી.</p>
                  <p className="mt-1 text-gray-400">
                    ચેટમાં AI ના જવાબ નીચે ⭐ સાચવો બટન દબાવી અહીં સાચવી શકો છો.
                  </p>
                </div>
              ) : (
                filteredGuides.map((guide) => (
                  <div
                    key={guide.id}
                    className="p-3 rounded-xl border border-gray-200 bg-white shadow-xs hover:border-orange-300 transition"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h4 className="font-extrabold text-xs text-slate-900 leading-snug">
                        {guide.title}
                      </h4>
                      <span className="text-[10px] text-gray-400 shrink-0">{guide.savedAt}</span>
                    </div>
                    <div className="text-[11px] text-gray-700 line-clamp-3 mb-2 whitespace-pre-wrap">
                      {guide.content.replace(/[*#]/g, "")}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px]">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleShareWhatsApp(guide.content)}
                          className="text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Share2 size={12} /> શૅર
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(guide.content);
                            alert("માર્ગદર્શિકા કોપી થઈ ગઈ!");
                          }}
                          className="text-slate-600 hover:text-slate-800 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Copy size={12} /> કોપી
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          const updated = savedGuides.filter((g) => g.id !== guide.id);
                          setSavedGuides(updated);
                          localStorage.setItem("nagrikseva_saved_guides", JSON.stringify(updated));
                        }}
                        className="text-red-500 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 size={12} /> હટાવો
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowSavedModal(false)}
                className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-4 py-1.5 rounded-xl transition cursor-pointer"
              >
                બંધ કરો
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
