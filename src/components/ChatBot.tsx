"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Message,
  ChatHistory,
  ChatSessionRecord,
  DocumentAttachment,
} from "@/types";
import { SkeletonChatMessage } from "@/components/Skeleton";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  Share2,
  ShieldCheck,
  ChevronRight,
  UserCheck,
  ArrowRight,
  Paperclip,
  FileText,
  X,
  Plus,
  Trash2,
  History as HistoryIcon,
  LogIn,
  LogOut,
  User,
  Lock,
  CheckCircle2,
  UploadCloud,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { getLocalizedCategoryPrompts, getLocalizedChatGreeting } from "@/lib/chatbot-i18n";

let globalSessionSequence = 1000;
function createNewSessionId(): string {
  globalSessionSequence += 1;
  return `sess-${globalSessionSequence}`;
}

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

interface CitizenSession {
  citizenName?: string;
  citizenNameGu?: string;
  mobile?: string;
  district?: string;
  taluka?: string;
  village?: string;
  aadhaarLast4?: string;
}

interface LiveLocationInfo {
  village: string;
  villageGu: string;
  taluka: string;
  talukaGu: string;
  district: string;
  districtGu: string;
  nearestOffice?: string;
  nearestOfficeGu?: string;
  distanceKm?: number;
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
  const pathname = usePathname();
  const isChatPage = pathname === "/chat";
  const { currentLang, t } = useLanguage();

  // Citizen Session (initialized null so SSR and initial client hydration match 100%)
  const [citizenSession, setCitizenSession] = useState<CitizenSession | null>(null);

  // ChatGPT-style Chat Sessions & Active Session (Strictly isolated by user session)
  const [chatSessions, setChatSessions] = useState<ChatSessionRecord[]>([]);

  const [activeSessionId, setActiveSessionId] = useState<string>("session-init");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // File Attachment & Drag Drop
  const [attachment, setAttachment] = useState<DocumentAttachment | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getGreetingForLang = useCallback((lang: string, cit?: CitizenSession | null) => {
    const citizenName = cit?.citizenNameGu || cit?.citizenName;
    return getLocalizedChatGreeting(lang, citizenName);
  }, []);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<number | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<{ stop: () => void; start: () => void; lang: string; continuous: boolean; interimResults: boolean; onstart: (() => void) | null; onresult: ((e: { results: { [index: number]: { [index: number]: { transcript: string } } } }) => void) | null; onerror: (() => void) | null; onend: (() => void) | null } | null>(null);
  const isInitialMount = useRef<boolean>(true);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Live GPS Location
  const [liveLocation, setLiveLocation] = useState<LiveLocationInfo>({
    village: "Gomta",
    villageGu: "ગોમટા",
    taluka: "Gondal",
    talukaGu: "ગોંડલ",
    district: "Rajkot",
    districtGu: "રાજકોટ",
    nearestOfficeGu: "તાલુકા સેવા સદન & મામલતદાર કચેરી, ગોંડલ",
    distanceKm: 0,
  });
  const [locationLoading, setLocationLoading] = useState(false);

  const requestLiveLocation = useCallback(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) return;

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch("/api/location/resolve", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            }),
          });
          const data = await res.json();
          if (data.success && data.location) {
            setLiveLocation(data.location);
          }
        } catch (err) {
          console.warn("Location resolve fetch failed:", err);
        } finally {
          setLocationLoading(false);
        }
      },
      (err) => {
        console.warn("Geolocation prompt/error:", err.message);
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  }, []);

  // Async GPS location query on mount without synchronous setState in effect body
  useEffect(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetch("/api/location/resolve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success && data.location) {
              setLiveLocation(data.location);
            }
          })
          .catch(() => {});
      },
      () => {},
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  }, []);

  // Real-time Auth Sync: Listen for login/logout across tabs, components, and portals
  useEffect(() => {
    const handleAuthSync = () => {
      if (typeof window === "undefined") return;
      const raw = localStorage.getItem("nagrik_citizen_session");
      if (!raw) {
        // User is logged out: wipe all history, reset messages and active session immediately
        setCitizenSession(null);
        setChatSessions([]);
        setMessages([]);
        setActiveSessionId(createNewSessionId());
        setIsHistoryOpen(false);
        setAttachment(null);
        if (currentAudioRef.current) {
          currentAudioRef.current.pause();
          currentAudioRef.current = null;
        }
        setIsSpeaking(null);
      } else {
        try {
          const parsed = JSON.parse(raw);
          const cit = parsed.citizen || parsed;
          setCitizenSession(cit);
          setActiveSessionId((prev) => (prev === "session-init" ? createNewSessionId() : prev));
          if (cit?.mobile) {
            // Load this citizen's cached sessions immediately
            try {
              const localCitSessions = localStorage.getItem(`nagrik_chat_sessions_${cit.mobile}`);
              if (localCitSessions) {
                setChatSessions(JSON.parse(localCitSessions));
              }
            } catch {}

            // Then sync latest from database
            fetch(`/api/chat/history?userId=${encodeURIComponent(cit.mobile)}`)
              .then((res) => res.json())
              .then((data) => {
                if (data.success && Array.isArray(data.sessions)) {
                  setChatSessions((prev) => {
                    const map = new Map<string, ChatSessionRecord>();
                    data.sessions.forEach((s: ChatSessionRecord) => map.set(s.id, s));
                    prev.forEach((s) => map.set(s.id, s));
                    const merged = Array.from(map.values()).sort(
                      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                    );
                    try {
                      localStorage.setItem(`nagrik_chat_sessions_${cit.mobile}`, JSON.stringify(merged));
                    } catch {}
                    return merged;
                  });
                }
              })
              .catch(() => {});
          }
        } catch {
          // ignore
        }
      }
    };

    handleAuthSync();
    window.addEventListener("storage", handleAuthSync);
    window.addEventListener("nagrik_auth_change", handleAuthSync);
    return () => {
      window.removeEventListener("storage", handleAuthSync);
      window.removeEventListener("nagrik_auth_change", handleAuthSync);
    };
  }, []);

  // Fetch backend sessions when citizen session changes
  useEffect(() => {
    if (!citizenSession?.mobile) {
      setChatSessions([]);
      return;
    }
    const mobile = citizenSession.mobile;
    const localRaw = localStorage.getItem(`nagrik_chat_sessions_${mobile}`);
    if (localRaw) {
      try {
        setChatSessions(JSON.parse(localRaw));
      } catch {}
    }

    fetch(`/api/chat/history?userId=${encodeURIComponent(mobile)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.sessions) && data.sessions.length > 0) {
          setChatSessions((prev) => {
            const map = new Map<string, ChatSessionRecord>();
            data.sessions.forEach((s: ChatSessionRecord) => map.set(s.id, s));
            prev.forEach((s) => map.set(s.id, s));
            const merged = Array.from(map.values()).sort(
              (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            );
            if (typeof window !== "undefined") {
              try {
                localStorage.setItem(`nagrik_chat_sessions_${mobile}`, JSON.stringify(merged));
              } catch {}
            }
            return merged;
          });
        }
      })
      .catch(() => {});
  }, [citizenSession?.mobile]);

  // Citizen Logout Handler - Cleanly clears active state & notifies all components
  const handleCitizenLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("nagrik_citizen_session");
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("nagrik_auth_change"));
    }
    setCitizenSession(null);
    setChatSessions([]);
    setMessages([]);
    setActiveSessionId(createNewSessionId());
    setIsHistoryOpen(false);
    setAttachment(null);
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    setIsSpeaking(null);
  };

  // Derived messages: if user hasn't sent anything in this session, show dynamic greeting
  const displayMessages: Message[] =
    messages.length === 0
      ? [
          {
            role: "model",
            text: getGreetingForLang(currentLang, citizenSession),
            timestamp: new Date(),
          },
        ]
      : messages;

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
  }, [displayMessages.length, loading]);

  // Persist session to local storage & backend (strictly per-user)
  const persistSession = useCallback((sessId: string, msgs: Message[]) => {
    if (msgs.length === 0) return;
    const isCitizen = Boolean(citizenSession?.mobile);
    const userId = citizenSession?.mobile || "guest";

    const firstUserMsg = msgs.find((m) => m.role === "user");
    const title = firstUserMsg
      ? firstUserMsg.text.slice(0, 36) + (firstUserMsg.text.length > 36 ? "..." : "")
      : "નવી ચેટ";

    const sessionObj: ChatSessionRecord = {
      id: sessId,
      title,
      messages: msgs,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      citizenId: userId,
      citizenName: citizenSession?.citizenNameGu || citizenSession?.citizenName,
    };

    // Only persist history if citizen is logged in to ensure complete logout privacy
    if (isCitizen && citizenSession?.mobile) {
      const storageKey = `nagrik_chat_sessions_${citizenSession.mobile}`;
      setChatSessions((prev) => {
        const idx = prev.findIndex((s) => s.id === sessId);
        const nextList = idx !== -1 ? [...prev] : [sessionObj, ...prev];
        if (idx !== -1) nextList[idx] = sessionObj;
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(storageKey, JSON.stringify(nextList));
          } catch {
            // ignore
          }
        }
        return nextList;
      });

      fetch("/api/chat/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session: sessionObj }),
      }).catch(() => {});
    }
  }, [citizenSession]);

  // New Chat Handler
  const handleNewChat = () => {
    if (messages.length > 0) {
      persistSession(activeSessionId, messages);
    }
    const newId = createNewSessionId();
    setActiveSessionId(newId);
    setMessages([]);
    setAttachment(null);
    setIsHistoryOpen(false);
  };

  // Select Past Chat Handler
  const handleSelectSession = (sess: ChatSessionRecord) => {
    if (messages.length > 0 && activeSessionId !== sess.id) {
      persistSession(activeSessionId, messages);
    }
    setActiveSessionId(sess.id);
    setMessages(sess.messages || []);
    setAttachment(null);
    setIsHistoryOpen(false);
  };

  // Delete Single Chat Session
  const handleDeleteSession = async (sessId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = chatSessions.filter((s) => s.id !== sessId);
    setChatSessions(updated);
    if (citizenSession?.mobile && typeof window !== "undefined") {
      try {
        localStorage.setItem(`nagrik_chat_sessions_${citizenSession.mobile}`, JSON.stringify(updated));
      } catch {
        // ignore
      }
    }
    const userId = citizenSession?.mobile || "guest";
    try {
      await fetch(
        `/api/chat/history?id=${encodeURIComponent(sessId)}&userId=${encodeURIComponent(userId)}`,
        { method: "DELETE" }
      );
    } catch {
      // ignore
    }

    if (activeSessionId === sessId) {
      setActiveSessionId(createNewSessionId());
      setMessages([]);
    }
  };

  // Clear All Chat History
  const handleClearAllHistory = async () => {
    if (!confirm("શું તમે બધી ચેટ હિસ્ટ્રી સાફ કરવા માંગો છો?")) return;
    setChatSessions([]);
    if (citizenSession?.mobile && typeof window !== "undefined") {
      try {
        localStorage.removeItem(`nagrik_chat_sessions_${citizenSession.mobile}`);
      } catch {
        // ignore
      }
    }
    const userId = citizenSession?.mobile || "guest";
    try {
      await fetch(`/api/chat/history?userId=${encodeURIComponent(userId)}&all=true`, {
        method: "DELETE",
      });
    } catch {
      // ignore
    }
    setActiveSessionId(createNewSessionId());
    setMessages([]);
  };

  // File Selection & Drag-and-Drop
  const processUploadedFile = (file: File) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("દસ્તાવેજની સાઈઝ 10 MB કરતાં ઓછી હોવી જોઈએ.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setAttachment({
        name: file.name,
        type: file.type || "application/octet-stream",
        base64: reader.result as string,
        size: file.size,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  // Voice Input (Speech to Text strictly synced with current selected language)
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
      const unsupportedMsg =
        currentLang === "mr"
          ? "तुमच्या ब्राऊझरमध्ये व्हॉइस इनपुट सपोर्ट नाही. कृपया Chrome किंवा Edge वापरा."
          : currentLang === "hi"
          ? "आपके ब्राउज़र में वॉइस इनपुट सपोर्ट नहीं है। कृपया Chrome या Edge का उपयोग करें।"
          : currentLang === "en"
          ? "Voice input is not supported in this browser. Please use Chrome or Edge."
          : "તમારા બ્રાઉઝરમાં વોઈસ ઈનપુટ સપોર્ટ નથી. કૃપા કરીને Chrome અથવા Edge વાપરો.";
      alert(unsupportedMsg);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    const selectedLocale = SPEECH_LANG_MAP[currentLang] || "gu-IN";
    recognition.lang = selectedLocale;
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

  // High-Fidelity Native TTS Speech Playback with Web Speech Fallback
  const speakMessage = async (text: string, index: number) => {
    if (typeof window === "undefined") return;

    if (isSpeaking === index) {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(null);
      return;
    }

    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setIsSpeaking(index);

    const fallbackSpeech = (fullText: string) => {
      if (!("speechSynthesis" in window)) {
        setIsSpeaking(null);
        return;
      }

      const cleanText = fullText.replace(/[*#_~`>•]/g, " ").replace(/https?:\/\/\S+/g, "").trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      const targetLocale = SPEECH_LANG_MAP[currentLang] || "gu-IN";
      utterance.lang = targetLocale;

      const voices = window.speechSynthesis.getVoices();
      const targetTag = targetLocale.slice(0, 2);
      const matchedVoice =
        voices.find((v) => v.lang.toLowerCase().startsWith(targetTag)) ||
        voices.find((v) => v.lang.toLowerCase().includes("gu")) ||
        voices.find((v) => v.lang.toLowerCase().includes("hi")) ||
        voices.find((v) => v.lang.includes("IN"));

      if (matchedVoice) utterance.voice = matchedVoice;
      utterance.onend = () => setIsSpeaking(null);
      utterance.onerror = () => setIsSpeaking(null);

      window.speechSynthesis.speak(utterance);
    };

    try {
      // 1. Primary: Native High-Fidelity /api/tts Endpoint (Multi-chunk MP3 Stream without character cutoff)
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, lang: currentLang }),
      });

      if (!res.ok) {
        throw new Error("TTS endpoint error");
      }

      const audioBlob = await res.blob();
      const blobUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(blobUrl);
      currentAudioRef.current = audio;

      audio.onended = () => {
        setIsSpeaking(null);
        currentAudioRef.current = null;
        URL.revokeObjectURL(blobUrl);
      };

      audio.onerror = () => {
        URL.revokeObjectURL(blobUrl);
        fallbackSpeech(text);
      };

      await audio.play();
    } catch {
      fallbackSpeech(text);
    }
  };

  const handleShareWhatsApp = (msgText: string, appCard?: Message["applicationCard"]) => {
    let textToSend = `*🏛️ NagrikSeva AI - સત્તાવાર સરકારી સહાય*\n\n${msgText}\n\n`;
    if (appCard) {
      textToSend +=
        `📋 *અરજી ક્રમાંક:* ${appCard.id}\n` +
        `📌 *સ્થિતિ:* ${appCard.statusLabelGu}\n` +
        `🏢 *ડેસ્ક:* ${appCard.currentDeskGu}\n` +
        `⚖️ *કાયદો:* ${appCard.actCitation}\n\n`;
    }
    const origin = typeof window !== "undefined" ? window.location.origin : "https://nagrikseva-ai-one.vercel.app";
    textToSend += `🌐 સત્તાવાર પોર્ટલ: ${origin}/chat`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(textToSend)}`, "_blank");
  };

  const sendMessage = async (text?: string) => {
    const msg = (text ?? input).trim();
    if ((!msg && !attachment) || loading) return;
    setInput("");

    const currentAttachment = attachment;
    setAttachment(null);

    const userMessage: Message = {
      role: "user",
      text: msg || "આ દસ્તાવેજની સરકારી નિયમો મુજબ ખરાઈ કરો.",
      timestamp: new Date(),
      attachment: currentAttachment || undefined,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    persistSession(activeSessionId, nextMessages);
    setLoading(true);

    try {
      const firstUserIndex = displayMessages.findIndex((m) => m.role === "user");
      const history: ChatHistory[] = (firstUserIndex === -1 ? [] : displayMessages.slice(firstUserIndex)).map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.text,
          history,
          language: currentLang,
          citizenContext: {
            name: citizenSession?.citizenName,
            nameGu: citizenSession?.citizenNameGu,
            district: liveLocation?.district || citizenSession?.district || "Rajkot",
            taluka: liveLocation?.taluka || citizenSession?.taluka || "Gondal",
            village: liveLocation?.village || citizenSession?.village || "Gomta",
            mobile: citizenSession?.mobile,
            aadhaarLast4: citizenSession?.aadhaarLast4,
          },
          fileData: currentAttachment
            ? {
                fileName: currentAttachment.name,
                mimeType: currentAttachment.type,
                base64: currentAttachment.base64,
              }
            : undefined,
        }),
      });

      const data = await res.json();
      const botMessage: Message = {
        role: "model",
        text: data.reply ?? data.error ?? "Something went wrong.",
        timestamp: new Date(),
        applicationCard: data.applicationCard,
        actionButtons: data.actionButtons,
        documentReport: data.documentReport,
      };

      const updatedWithBot = [...nextMessages, botMessage];
      setMessages(updatedWithBot);
      persistSession(activeSessionId, updatedWithBot);
    } catch {
      const errorMsg: Message = {
        role: "model",
        text: t.chat.networkError,
        timestamp: new Date(),
        actionButtons: [
          {
            label: currentLang === "mr" ? "💰 माझी पात्रता मोजा" : currentLang === "hi" ? "💰 मेरी पात्रता जांचें" : currentLang === "en" ? "💰 Check My Eligibility" : "💰 પાત્રતા કેલ્ક્યુલેટર",
            href: "/benefit-calculator",
            variant: "primary",
          },
          {
            label: currentLang === "mr" ? "📍 जवळचे कार्यालय शोधा" : currentLang === "hi" ? "📍 नज़दीकी कार्यालय खोजें" : currentLang === "en" ? "📍 Find Nearest Office" : "📍 કચેરી લોકેટર",
            href: "/locator",
            variant: "secondary",
          },
        ],
      };
      const updatedWithErr = [...nextMessages, errorMsg];
      setMessages(updatedWithErr);
      persistSession(activeSessionId, updatedWithErr);
    } finally {
      setLoading(false);
      if (typeof window !== "undefined" && window.innerWidth >= 768) {
        inputRef.current?.focus({ preventScroll: true });
      }
    }
  };

  const handleQuickDemoLogin = () => {
    const demoCitizen: CitizenSession = {
      citizenName: "Hari Vinodrai Patel",
      citizenNameGu: "હરી વિનોદરાઈ પટેલ",
      mobile: "9825012345",
      district: "Rajkot",
      taluka: "Gondal",
      village: "Gomta",
      aadhaarLast4: "4829",
    };
    localStorage.setItem("nagrik_citizen_session", JSON.stringify(demoCitizen));
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("nagrik_auth_change"));
    setCitizenSession(demoCitizen);
    setIsLoginModalOpen(false);
    requestLiveLocation();
  };

  const activePills = getLocalizedCategoryPrompts(currentLang);

  return (
    <div
      onDragOver={handleDragOver}
      onDragEnter={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative flex flex-col w-full bg-white overflow-hidden sm:h-[720px] md:h-[760px] lg:h-[800px] sm:rounded-3xl sm:shadow-2xl sm:border sm:border-slate-200 ${
        isChatPage
          ? "h-full rounded-none shadow-none border-0"
          : "h-[540px] rounded-2xl shadow-md border border-slate-200"
      }`}
    >
      {/* ── DRAG & DROP OVERLAY ── */}
      {isDragging && (
        <div className="absolute inset-0 z-50 bg-orange-600/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-white text-center animate-in fade-in duration-200 border-4 border-dashed border-white m-3 rounded-3xl">
          <UploadCloud size={64} className="animate-bounce mb-3 text-amber-200" />
          <h3 className="text-xl sm:text-2xl font-black mb-1">
            {t.chat.dropTitle}
          </h3>
          <p className="text-xs sm:text-sm text-orange-100 max-w-md">
            {t.chat.dropDesc}
          </p>
        </div>
      )}

      {/* ── CHATGPT-STYLE CHAT HISTORY SIDEBAR / DRAWER ── */}
      {isHistoryOpen && (
        <div className="absolute inset-y-0 left-0 z-40 w-72 sm:w-80 bg-slate-900 text-white shadow-2xl flex flex-col border-r border-slate-800 animate-in slide-in-from-left duration-250">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HistoryIcon size={18} className="text-orange-400" />
              <h3 className="font-black text-sm">{t.chat.historyTitle}</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsHistoryOpen(false)}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {!citizenSession ? (
            <div className="flex-1 flex flex-col items-center justify-start pt-8 p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl mb-3 text-orange-400">
                <Lock size={24} />
              </div>
              <h4 className="font-bold text-sm text-white mb-1.5">{t.chat.loginRequired}</h4>
              <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                {t.chat.loginDesc}
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsHistoryOpen(false);
                  setIsLoginModalOpen(true);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs shadow-md transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <LogIn size={14} />
                <span>{t.chat.loginBtn}</span>
              </button>
            </div>
          ) : (
            <>
              {/* Citizen info header with Logout button */}
              <div className="p-3 bg-slate-800/70 border-b border-slate-800 flex items-center justify-between">
                <div className="min-w-0 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xs shrink-0">
                    <User size={14} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-200 truncate">
                      {citizenSession.citizenNameGu || citizenSession.citizenName}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      📱 {citizenSession.mobile}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCitizenLogout}
                  title="Logout"
                  className="px-2 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-white border border-rose-500/30 text-[10.5px] font-bold transition cursor-pointer flex items-center gap-1 shrink-0 active:scale-95"
                >
                  <LogOut size={12} />
                  <span>{t.chat.logout}</span>
                </button>
              </div>

              {/* New Chat Button */}
              <div className="p-3 border-b border-slate-800/80">
                <button
                  type="button"
                  onClick={handleNewChat}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-xs shadow-md transition active:scale-95 cursor-pointer"
                >
                  <Plus size={16} />
                  <span>{t.chat.startNewChat}</span>
                </button>
              </div>

              {/* Sessions List */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
                {chatSessions.length === 0 ? (
                  <div className="text-center py-10 px-4 text-xs text-slate-400">
                    <p>{t.chat.noHistory}</p>
                    <p className="text-[11px] text-slate-500 mt-1">{t.chat.noHistorySub}</p>
                  </div>
                ) : (
                  chatSessions.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => handleSelectSession(s)}
                      className={`group flex items-center justify-between p-2.5 rounded-xl text-xs transition cursor-pointer ${
                        activeSessionId === s.id
                          ? "bg-orange-600/20 text-orange-300 border border-orange-500/40"
                          : "hover:bg-slate-800/80 text-slate-300"
                      }`}
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <p className="font-bold truncate text-[11.5px] leading-tight">{s.title}</p>
                        <span className="text-[9.5px] text-slate-500 block mt-0.5">
                          {new Date(s.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleDeleteSession(s.id, e)}
                        title="Delete this chat"
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-rose-500/20 hover:text-rose-400 text-slate-500 transition cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Clear All Footer */}
              {chatSessions.length > 0 && (
                <div className="p-3 border-t border-slate-800 bg-slate-950/60">
                  <button
                    type="button"
                    onClick={handleClearAllHistory}
                    className="w-full text-center text-[10.5px] text-rose-400 hover:text-rose-300 font-bold py-1 transition cursor-pointer"
                  >
                    {t.chat.clearAllHistory}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── 1-CLICK CITIZEN LOGIN MODAL (Fixed Full-Screen Viewport Overlay for Mobile App & Website) ── */}
      {isLoginModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9998] bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setIsLoginModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl p-5 sm:p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-center relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-3.5 right-3.5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              title={t.chat.close}
            >
              <X size={16} />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-3 text-2xl font-bold shadow-xs">
              🔐
            </div>
            <h3 className="text-base font-black text-slate-900 mb-1">
              {t.chat.modalLoginTitle}
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              {t.chat.modalLoginDesc}
            </p>

            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-black text-xs shadow-md transition active:scale-95 mb-2.5 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <UserCheck size={14} />
              <span>{t.chat.oneClickLogin}</span>
            </button>

            <Link
              href="/track?mode=citizen"
              onClick={() => setIsLoginModalOpen(false)}
              className="block w-full py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-orange-50 text-slate-800 hover:text-orange-700 border border-slate-200 text-xs font-extrabold transition"
            >
              {t.chat.otpLogin}
            </Link>

            <button
              type="button"
              onClick={() => setIsLoginModalOpen(false)}
              className="mt-3 text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {t.chat.close}
            </button>
          </div>
        </div>
      )}

      {/* ── RESPONSIVE HEADER ── */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-green-700 p-2.5 sm:p-4 text-white flex-shrink-0 shadow-sm">
        {/* DESKTOP VIEW (>= 640px) */}
        <div className="hidden sm:flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* History Toggle Button */}
            <button
              type="button"
              onClick={() => setIsHistoryOpen((prev) => !prev)}
              title="ચેટ ઇતિહાસ જુઓ"
              className="p-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 transition cursor-pointer text-white shrink-0 active:scale-95"
            >
              <HistoryIcon size={16} />
            </button>

            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-xl shrink-0 border border-white/25 shadow-inner">
              🤖
            </div>
            <div className="min-w-0">
              <h2 className="font-black text-base leading-tight flex items-center gap-1 truncate">
                NagrikSeva AI <Sparkles size={14} className="text-yellow-300 shrink-0" />
              </h2>
              <p className="text-[11px] text-orange-100 truncate flex items-center gap-1">
                <span>{t.chat.subTitle} &bull; {t.chat.modeLabel.replace("{lang}", currentLang.toUpperCase())}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* New Chat Top Shortcut */}
            <button
              type="button"
              onClick={handleNewChat}
              title={t.chat.startNewChat}
              className="px-2.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-black text-xs border border-white/25 transition flex items-center gap-1 active:scale-95 cursor-pointer"
            >
              <Plus size={14} />
              <span>{t.chat.newChat}</span>
            </button>

            {citizenSession ? (
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 text-[11px] bg-white/20 text-white font-bold px-2.5 py-1 rounded-xl border border-white/30 backdrop-blur-xs max-w-[150px] truncate">
                  <UserCheck size={12} className="text-amber-300 shrink-0" />
                  <span className="truncate">
                    {currentLang === "gu"
                      ? (citizenSession.citizenNameGu || citizenSession.citizenName)
                      : (citizenSession.citizenName || citizenSession.citizenNameGu)}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={handleCitizenLogout}
                  title="Logout"
                  className="inline-flex items-center gap-1 text-[11px] bg-rose-600/80 hover:bg-rose-600 text-white font-bold px-2.5 py-1 rounded-xl border border-rose-300/30 transition active:scale-95 cursor-pointer shadow-xs"
                >
                  <LogOut size={12} />
                  <span>{t.chat.logout}</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsLoginModalOpen(true)}
                className="inline-flex items-center gap-1 text-xs bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-2.5 py-1.5 rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
              >
                <LogIn size={13} />
                <span>{t.chat.login}</span>
              </button>
            )}

            {/* Live Location GPS Pill */}
            <div
              title={
                liveLocation?.nearestOfficeGu
                  ? `Nearest Office: ${liveLocation.nearestOfficeGu}`
                  : "Live GPS tracking active"
              }
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/25 text-[11px] font-bold border border-white/20 backdrop-blur-xs text-white shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="truncate max-w-[130px]">
                📍 {currentLang === "gu"
                  ? (liveLocation ? `${liveLocation.villageGu}, ${liveLocation.talukaGu}` : citizenSession?.village ? `${citizenSession.village}, ${citizenSession.taluka || "ગોંડલ"}` : "ગોમટા, ગોંડલ")
                  : (liveLocation ? `${liveLocation.village}, ${liveLocation.taluka}` : citizenSession?.village ? `${citizenSession.village}, ${citizenSession.taluka || "Gondal"}` : "Gomta, Gondal")}
              </span>
              <button
                type="button"
                onClick={requestLiveLocation}
                title="Refresh location"
                className="hover:text-amber-300 text-xs transition cursor-pointer shrink-0 ml-0.5"
              >
                {locationLoading ? "..." : "🔄"}
              </button>
            </div>

            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/20 text-[11px] font-bold border border-white/10">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span>{t.chat.online}</span>
            </div>
          </div>
        </div>

        {/* MOBILE VIEW (< 640px) */}
        <div className="sm:hidden space-y-2">
          {/* Row 1: Brand & Key Actions */}
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              {/* History Toggle */}
              <button
                type="button"
                onClick={() => setIsHistoryOpen((prev) => !prev)}
                title={t.chat.historyTitle}
                className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 border border-white/25 transition cursor-pointer text-white shrink-0 active:scale-95"
              >
                <HistoryIcon size={15} />
              </button>

              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-base shrink-0 border border-white/25 relative">
                🤖
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full border border-green-800 animate-pulse" />
              </div>

              <div className="min-w-0">
                <h2 className="font-black text-xs leading-tight flex items-center gap-1 truncate">
                  NagrikSeva AI <Sparkles size={11} className="text-yellow-300 shrink-0" />
                </h2>
                <p className="text-[9.5px] text-orange-100 truncate">
                  {t.chat.subTitle} • {currentLang.toUpperCase()}
                </p>
              </div>
            </div>

            {/* Right: New Chat + Citizen / Login / Logout */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleNewChat}
                title={t.chat.startNewChat}
                className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-[10px] border border-white/25 transition flex items-center gap-0.5 active:scale-95 cursor-pointer"
              >
                <Plus size={13} />
                <span className="text-[10px]">{t.chat.newChat}</span>
              </button>

              {citizenSession ? (
                <>
                  <span className="inline-flex items-center gap-1 text-[10px] bg-white/20 text-white font-bold px-1.5 py-1 rounded-xl border border-white/30 backdrop-blur-xs max-w-[85px] truncate">
                    <UserCheck size={10} className="text-amber-300 shrink-0" />
                    <span className="truncate">{citizenSession.citizenNameGu || citizenSession.citizenName}</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleCitizenLogout}
                    title="Logout"
                    className="p-1.5 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white border border-rose-300/30 transition active:scale-95 cursor-pointer flex items-center"
                  >
                    <LogOut size={12} />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsLoginModalOpen(true)}
                  className="inline-flex items-center gap-1 text-[10px] bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-2 py-1 rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
                >
                  <LogIn size={11} />
                  <span>{t.chat.login}</span>
                </button>
              )}
            </div>
          </div>

          {/* Row 2: Live Location & Citizen Administrative Area */}
          <div className="flex items-center justify-between gap-1.5 pt-0.5 border-t border-white/15 text-[10px]">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-black/25 border border-white/15 text-white min-w-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="truncate font-bold">
                📍 {liveLocation ? `${liveLocation.villageGu}, ${liveLocation.talukaGu}` : citizenSession?.village ? `${citizenSession.village}, ${citizenSession.taluka || "ગોંડલ"}` : "ગોમટા, ગોંડલ"}
              </span>
              <button
                type="button"
                onClick={requestLiveLocation}
                title="Refresh location"
                className="hover:text-amber-300 text-[10px] transition cursor-pointer shrink-0 ml-0.5"
              >
                {locationLoading ? "..." : "🔄"}
              </button>
            </div>

            <span className="text-[9.5px] text-orange-100 font-medium truncate shrink-0 bg-white/10 px-1.5 py-0.5 rounded">
              {t.chat.officialActCitation}
            </span>
          </div>
        </div>

        {/* Top Guided Topic Pills (Smooth touch-scrollable for all screens) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-0.5 -mx-1 px-1 scrollbar-none touch-pan-x">
          {activePills.map((pill) => (
            <button
              key={pill.label}
              type="button"
              onClick={() => sendMessage(pill.query)}
              className="shrink-0 px-2 sm:px-2.5 py-1 rounded-xl text-[10px] sm:text-[10.5px] font-bold bg-white/15 hover:bg-white/25 active:bg-white/30 text-white border border-white/20 transition flex items-center gap-1 active:scale-95 cursor-pointer touch-manipulation whitespace-nowrap"
            >
              <span>{pill.icon}</span>
              <span>{pill.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── MESSAGES CONTAINER ── */}
      <div
        ref={messagesContainerRef}
        className="flex-1 min-h-0 overflow-y-auto p-2.5 sm:p-4 space-y-3 bg-slate-50 overscroll-contain"
      >
        {displayMessages.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} animate-in fade-in duration-200`}
          >
            <div
              className={`max-w-[92%] sm:max-w-[85%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words shadow-xs relative group ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-br-none shadow-sm"
                  : "bg-white text-slate-800 rounded-bl-none border border-slate-200/80 shadow-2xs"
              }`}
            >
              {/* User Attachment Display */}
              {msg.role === "user" && msg.attachment && (
                <div className="mb-2.5 p-2 bg-black/15 rounded-xl border border-white/20 flex items-center gap-2">
                  {msg.attachment.type.startsWith("image/") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={msg.attachment.base64}
                      alt={msg.attachment.name}
                      className="w-12 h-12 object-cover rounded-lg border border-white/30 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                      <FileText size={20} className="text-white" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1 text-[11px]">
                    <span className="font-bold block truncate">{msg.attachment.name}</span>
                    <span className="text-[10px] text-orange-100">
                      {(msg.attachment.size / 1024).toFixed(1)} KB • સરકારી દસ્તાવેજ અપલોડ
                    </span>
                  </div>
                </div>
              )}

              {/* Message Text */}
              {msg.role === "model" ? renderFormattedMessage(msg.text) : msg.text}

              {/* ── DOCUMENT VERIFICATION AUDIT REPORT CARD ── */}
              {msg.role === "model" && msg.documentReport && (
                <div className="mt-3.5 pt-3 border-t border-slate-200 space-y-3 bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/90 p-3 sm:p-4 rounded-2xl border-2 border-emerald-500 shadow-xs">
                  <div className="flex items-center justify-between gap-2 border-b border-emerald-200 pb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="p-1.5 bg-emerald-600 text-white rounded-xl shadow-xs shrink-0">
                        <CheckCircle2 size={18} />
                      </span>
                      <div className="min-w-0">
                        <span className="text-[9.5px] font-black uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                          સરકારી ખરાઈ અહેવાલ
                        </span>
                        <h4 className="font-black text-xs sm:text-sm text-slate-900 mt-1 truncate">
                          {msg.documentReport.documentTypeGu}
                        </h4>
                      </div>
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                      {msg.documentReport.confidence}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-700 bg-white/80 p-2 rounded-xl border border-emerald-200/80">
                    <span className="font-bold text-slate-500 block text-[9.5px]">જારી કરનાર સત્તાધિકારી:</span>
                    <span className="font-bold text-slate-900">{msg.documentReport.issuingAuthority}</span>
                  </div>

                  {/* Checklist */}
                  <div className="space-y-1.5">
                    <span className="text-[10.5px] font-black text-slate-800 block">
                      🔍 નવીનતમ સરકારી માર્ગદર્શિકા મુજબ ખરાઈ:
                    </span>
                    <div className="space-y-1">
                      {msg.documentReport.guidelineChecklist.map((item, gIdx) => (
                        <div
                          key={gIdx}
                          className="flex items-start gap-1.5 text-[10.5px] bg-white/90 p-1.5 rounded-lg border border-slate-200"
                        >
                          <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-slate-900">{item.rule}:</span>{" "}
                            <span className="text-slate-600">{item.remark}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Eligible Schemes List */}
                  {msg.documentReport.eligibleSchemes && msg.documentReport.eligibleSchemes.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10.5px] font-black text-slate-800 block">
                        🎯 આ દસ્તાવેજનો કઈ કઈ સરકારી યોજનાઓમાં ઉપયોગ થઈ શકે?
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {msg.documentReport.eligibleSchemes.map((scheme, sIdx) => (
                          <div
                            key={sIdx}
                            className="bg-white p-2 rounded-xl border border-emerald-200 flex flex-col justify-between"
                          >
                            <span className="font-bold text-[11px] text-slate-900">{scheme.schemeNameGu}</span>
                            <span className="text-[9.5px] text-slate-500 mt-0.5">{scheme.department}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── IN-CHAT LIVE APPLICATION TRACKING CARD ── */}
              {msg.role === "model" && msg.applicationCard && (
                <div className="mt-3.5 pt-3 border-t border-slate-200 space-y-3 bg-gradient-to-br from-amber-50/80 via-white to-orange-50/80 p-3 sm:p-4 rounded-2xl border-2 border-orange-400 shadow-xs">
                  <div className="flex items-center justify-between gap-2 border-b border-orange-200 pb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xl sm:text-2xl p-1 bg-white rounded-xl shadow-2xs border border-orange-200 shrink-0">
                        {msg.applicationCard.schemeEmoji}
                      </span>
                      <div className="min-w-0">
                        <span className="font-mono text-[10px] font-black bg-orange-600 text-white px-1.5 py-0.5 rounded-md">
                          {msg.applicationCard.id}
                        </span>
                        <h4 className="font-black text-xs sm:text-sm text-slate-900 mt-0.5 truncate">
                          {msg.applicationCard.schemeNameGu}
                        </h4>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 border ${
                        msg.applicationCard.status === "approved"
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : msg.applicationCard.status === "rejected"
                          ? "bg-rose-100 text-rose-800 border-rose-300"
                          : "bg-blue-100 text-blue-800 border-blue-300"
                      }`}
                    >
                      {msg.applicationCard.statusLabelGu}
                    </span>
                  </div>

                  {/* 3-Stage Progress Stepper */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-600">
                      <span className="text-emerald-700">૧. ઓનલાઇન અરજી ✓</span>
                      <span className={msg.applicationCard.workflowStage >= 2 ? "text-emerald-700" : "text-slate-400"}>
                        ૨. કચેરી સ્ક્રુટિની {msg.applicationCard.workflowStage >= 2 ? "✓" : "⏳"}
                      </span>
                      <span className={msg.applicationCard.workflowStage >= 3 ? "text-emerald-700" : "text-slate-400"}>
                        ૩. આખરી મંજૂરી / e-Sign {msg.applicationCard.workflowStage >= 3 ? "✓" : "⏳"}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-orange-500 to-emerald-600 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(msg.applicationCard.workflowStage / msg.applicationCard.totalStages) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Metadata Row */}
                  <div className="grid grid-cols-2 gap-2 text-[10.5px] pt-1">
                    <div className="bg-white/80 p-2 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block text-[9.5px]">અધિકૃત ડેસ્ક:</span>
                      <span className="font-bold text-slate-800">{msg.applicationCard.currentDeskGu}</span>
                    </div>
                    <div className="bg-white/80 p-2 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block text-[9.5px]">કાનૂની અધિનિયમ:</span>
                      <span className="font-bold text-orange-700">{msg.applicationCard.actCitation}</span>
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <Link
                      href={`/track?id=${encodeURIComponent(msg.applicationCard.id)}`}
                      className="flex-1 min-h-[38px] px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[11px] font-black flex items-center justify-center gap-1 shadow-xs transition"
                    >
                      <span>ટ્રેકિંગ વૉલ્ટમાં જુઓ</span>
                      <ArrowRight size={12} />
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleShareWhatsApp(msg.text, msg.applicationCard)}
                      className="min-h-[38px] px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-black flex items-center gap-1 shadow-xs transition cursor-pointer"
                    >
                      <span>WhatsApp સ્ટેટસ</span>
                      <Share2 size={12} />
                    </button>
                  </div>
                </div>
              )}

              {/* ── INTERACTIVE ACTION BUTTONS ── */}
              {msg.role === "model" && msg.actionButtons && msg.actionButtons.length > 0 && (
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-2 flex-wrap">
                  {msg.actionButtons.map((btn, btnIdx) => (
                    <Link
                      key={btnIdx}
                      href={btn.href}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-bold transition shadow-2xs active:scale-95 ${
                        btn.variant === "primary"
                          ? "bg-orange-600 hover:bg-orange-700 text-white"
                          : "bg-slate-100 hover:bg-orange-50 text-slate-800 border border-slate-300 hover:border-orange-300"
                      }`}
                    >
                      <span>{btn.label}</span>
                      <ChevronRight size={12} />
                    </Link>
                  ))}
                </div>
              )}

              {/* ── BOTTOM UTILITY BAR (Native Voice Speak + WhatsApp Share) ── */}
              {msg.role === "model" && (
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-1 text-[11px]">
                  <span className="text-[10px] text-slate-400 hidden xs:flex items-center gap-1 font-semibold truncate">
                    <ShieldCheck size={11} className="text-emerald-600 shrink-0" />
                    પ્રમાણિત સરકારી સહાય
                  </span>

                  <div className="flex items-center gap-1.5 ml-auto">
                    {/* WhatsApp Share Button */}
                    <button
                      type="button"
                      onClick={() => handleShareWhatsApp(msg.text, msg.applicationCard)}
                      title="આ માહિતી WhatsApp પર મેળવો"
                      className="inline-flex items-center gap-1 text-[10.5px] sm:text-[11px] text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-lg font-bold transition cursor-pointer touch-manipulation"
                    >
                      <Share2 size={11} />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </button>

                    {/* Speech Voice Button */}
                    <button
                      type="button"
                      onClick={() => speakMessage(msg.text, i)}
                      title={isSpeaking === i ? t.chat.stop : t.chat.listen}
                      className="inline-flex items-center gap-1 text-[10.5px] sm:text-[11px] text-orange-700 hover:text-orange-800 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-2 py-0.5 rounded-lg font-bold transition cursor-pointer touch-manipulation"
                    >
                      {isSpeaking === i ? (
                        <>
                          <VolumeX size={12} className="text-rose-600 animate-spin" />
                          <span>{t.chat.stop}</span>
                        </>
                      ) : (
                        <>
                          <Volume2 size={12} />
                          <span>{t.chat.listen}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Skeleton while waiting for LLM */}
        {loading && <SkeletonChatMessage />}
      </div>

      {/* ── ATTACHMENT PREVIEW CHIP ── */}
      {attachment && (
        <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-amber-50/90 border-t border-amber-200 flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 min-w-0">
            {attachment.type.startsWith("image/") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={attachment.base64}
                alt={attachment.name}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover border border-amber-300 shrink-0"
              />
            ) : (
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
                <FileText size={15} />
              </div>
            )}
            <div className="min-w-0 text-xs">
              <span className="font-bold text-slate-800 block truncate text-[11px] sm:text-xs">{attachment.name}</span>
              <span className="text-[9.5px] sm:text-[10px] text-slate-500">
                {(attachment.size / 1024).toFixed(1)} KB • {t.chat.docReadyForAudit}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setAttachment(null)}
            className="p-1 rounded-full hover:bg-amber-200 text-slate-600 transition cursor-pointer shrink-0"
            title={t.chat.close}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── INPUT + CONTROLS ── */}
      <div className="p-2 sm:p-3 bg-white border-t border-slate-200 flex-shrink-0">
        <div className="flex gap-1 sm:gap-2 items-center">
          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                processUploadedFile(e.target.files[0]);
              }
            }}
            className="hidden"
          />

          {/* Document / Photo Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Upload Document"
            className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-slate-100 hover:bg-orange-50 text-slate-700 hover:text-orange-600 border border-slate-200 transition flex-shrink-0 cursor-pointer shadow-xs active:scale-95 touch-manipulation"
          >
            <Paperclip size={17} />
          </button>

          {/* Microphone button */}
          <button
            type="button"
            onClick={toggleListening}
            title={isListening ? "Listening... click to stop" : `Voice (${currentLang.toUpperCase()})`}
            className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl transition flex-shrink-0 cursor-pointer shadow-xs touch-manipulation ${
              isListening
                ? "bg-rose-600 text-white animate-pulse ring-4 ring-rose-200"
                : "bg-slate-100 hover:bg-orange-50 text-slate-700 hover:text-orange-600 border border-slate-200"
            }`}
          >
            {isListening ? <MicOff size={17} /> : <Mic size={17} />}
          </button>

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder={
              attachment
                ? t.chat.inputWithAttachment
                : isListening
                ? t.chat.listeningPlaceholder.replace("{lang}", currentLang.toUpperCase())
                : t.chat.inputPlaceholder
            }
            className="flex-1 min-w-0 border border-slate-300 rounded-xl sm:rounded-2xl px-2.5 sm:px-4 py-2 sm:py-2.5 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent placeholder:text-slate-400 bg-slate-50 focus:bg-white transition"
            disabled={loading}
          />

          <button
            type="button"
            onClick={() => sendMessage()}
            disabled={loading || (!input.trim() && !attachment)}
            className="flex-shrink-0 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-black transition active:scale-95 flex items-center gap-1 shadow-sm cursor-pointer touch-manipulation"
          >
            <Send size={14} />
            <span className="hidden sm:inline">{t.chat.send}</span>
          </button>
        </div>

        {isListening && (
          <p className="text-[10px] sm:text-[11px] text-rose-600 mt-1 text-center font-bold animate-pulse flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
            {t.chat.recordingVoice.replace("{lang}", currentLang.toUpperCase())}
          </p>
        )}
      </div>
    </div>
  );
}
