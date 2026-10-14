"use client";

import Navbar from "@/components/Navbar";
import ChatBot from "@/components/ChatBot";
import MobileGreetingCard from "@/components/MobileGreetingCard";
import Link from "next/link";
import DynamicFeaturedSchemes from "@/components/DynamicFeaturedSchemes";
import { useLanguage } from "@/context/LanguageContext";
import {
  LayoutGrid,
  Bot,
  FileText,
  ChevronRight,
  Sparkles,
  MapPin,
  IndianRupee,
  HeartPulse,
  Search,
} from "lucide-react";

export default function Home() {
  const { t, currentLang } = useLanguage();

  const quickServices = [
    { icon: Sparkles,    label: t.home.quickServicesList[0]?.label || "પાત્રતા કેલ્ક્યુલેટર (Eligibility)", href: "/eligibility" },
    { icon: IndianRupee, label: t.home.quickServicesList[1]?.label || "💰 કુટુંબ લાભ કેલ્ક્યુલેટર & પાસ", href: "/benefit-calculator" },
    { icon: MapPin,      label: t.home.quickServicesList[2]?.label || "નજીકની કચેરી (Jan Seva Locator)",   href: "/locator" },
    { icon: FileText,    label: t.home.quickServicesList[3]?.label || "રેશન કાર્ડ ગાઈડ & ચેકલિસ્ટ",        href: "/documents?type=ration" },
    { icon: HeartPulse,  label: t.home.quickServicesList[4]?.label || "આયુષ્માન કાર્ડ કેવી રીતે કઢાવવું?",  href: "/documents?type=health" },
  ];

  const superAppGrid = [
    {
      icon: Sparkles,
      label: t.home.superAppEligibility,
      href: "/eligibility",
      bg: "bg-orange-50 text-orange-600 border-orange-200/70",
    },
    {
      icon: IndianRupee,
      label: t.home.superAppBenefits,
      href: "/benefit-calculator",
      bg: "bg-emerald-50 text-emerald-600 border-emerald-200/70",
    },
    {
      icon: Search,
      label: t.home.superAppTrack,
      href: "/track",
      bg: "bg-purple-50 text-purple-600 border-purple-200/70",
    },
    {
      icon: FileText,
      label: t.home.superAppDocs,
      href: "/documents?type=ration",
      bg: "bg-amber-50 text-amber-600 border-amber-200/70",
    },
  ];

  const stats = [
    { num: "26+",  label: t.home.statSchemes,     shortLabel: t.home.statSchemesShort,   emoji: "📋" },
    { num: "16",   label: t.home.statLanguages,   shortLabel: t.home.statLanguagesShort, emoji: "🗣️" },
    { num: "24/7", label: t.home.statAiVoice,     shortLabel: t.home.statAiVoiceShort,  emoji: "🎙️" },
    { num: "100%", label: t.home.statFreeService, shortLabel: t.home.statFreeServiceShort, emoji: "✅" },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50">

        {/* ══════════════════════════════════════════════════════════════════
            📱 MOBILE NATIVE SUPER-APP HOME (DigiLocker + UMANG + PhonePe UI)
            Zero duplication with Bottom Nav (Home, Schemes, AI Chat, Offices, Login)
           ══════════════════════════════════════════════════════════════════ */}
        <section className="sm:hidden px-3 pt-3 pb-1 space-y-3">
          {/* 1. Compact DigiLocker-Style Greeting Card (Dynamic Logged-In Name) */}
          <MobileGreetingCard />

          {/* 2. PhonePe / UMANG 4-Column Unique Quick Services Grid (No duplicate Bottom Nav items) */}
          <div className="bg-white rounded-3xl p-3.5 border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2.5 px-0.5">
              <h2 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <Sparkles size={14} className="text-orange-500 shrink-0" />
                <span>{t.home.quickToolsHeading}</span>
              </h2>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                {t.home.oneClickBadge}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {superAppGrid.map(({ icon: Icon, label, href, bg }) => (
                <Link
                  key={href}
                  href={href}
                  className="app-touch-card flex flex-col items-center justify-start group min-w-0"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl border flex items-center justify-center shadow-2xs transition-transform group-active:scale-92 ${bg}`}
                  >
                    <Icon size={21} strokeWidth={2.1} />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 mt-1.5 text-center whitespace-nowrap truncate w-full px-0.5">
                    {label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* 3. Compact 4-Column Bento Stats Strip */}
          <div className="grid grid-cols-4 gap-2">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-white rounded-2xl py-2 px-1.5 border border-slate-200/80 shadow-2xs text-center"
              >
                <div className="text-sm font-black text-orange-600 leading-tight">
                  {s.num}
                </div>
                <div className="text-[10px] font-semibold text-slate-500 truncate mt-0.5">
                  {s.shortLabel}
                </div>
              </div>
            ))}
          </div>

          {/* 4. Dynamic Live Featured Scheme Cards */}
          <DynamicFeaturedSchemes variant="mobile-cards" />
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            💻 DESKTOP & TABLET HERO + STATS
           ══════════════════════════════════════════════════════════════════ */}
        <section className="hidden sm:block bg-gradient-to-br from-orange-500 via-orange-400 to-green-600 text-white py-12 sm:py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white/95 p-2.5 shadow-lg flex items-center justify-center select-none">
              <img
                src="/icon.svg"
                alt="National Emblem"
                width="44"
                height="44"
                className="w-11 h-11 object-contain"
              />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 tracking-tight">
              NagrikSeva <span className="text-yellow-300">AI</span>
            </h1>
            <p className="text-orange-100 text-base sm:text-lg mb-1">
              {t.home.heroSubtitle}
            </p>
            <p className="text-orange-200 text-xs sm:text-sm mb-7">
              {t.home.heroDesc}
            </p>

            <div className="flex flex-wrap gap-2.5 justify-center">
              <Link
                href="/eligibility"
                className="flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition shadow-lg active:scale-95"
              >
                <Sparkles size={15} /> {t.home.checkEligibilityHero}
              </Link>
              <Link
                href="/benefit-calculator"
                className="flex items-center gap-1.5 bg-green-700 hover:bg-green-800 text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition shadow active:scale-95"
              >
                {t.home.calcBenefitsHero}
              </Link>
              <Link
                href="/locator"
                className="flex items-center gap-1.5 bg-orange-700/80 hover:bg-orange-800 text-white px-3.5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition border border-white/20 active:scale-95"
              >
                <MapPin size={15} /> {t.home.kacheriLocatorHero}
              </Link>
            </div>
          </div>
        </section>

        {/* ── Desktop Stats ── */}
        <section className="hidden sm:block bg-white border-b shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-5 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-center">
            {stats.map((s) => (
              <div key={s.label} className="py-2">
                <div className="text-xl sm:text-2xl mb-0.5">{s.emoji}</div>
                <div className="text-xl sm:text-2xl font-bold text-orange-500">{s.num}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Main Content (ChatBot + Desktop Sidebar) ── */}
        <div className="w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-8 grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-8">

          {/* ── Sidebar (Desktop & Tablet) ── */}
          <aside className="hidden lg:block lg:col-span-1 space-y-4">

            {/* Smart Eligibility Banner */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-4 text-white shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider bg-white/25 px-2.5 py-0.5 rounded-full inline-block mb-2">
                {t.home.smartEligibilityBadge}
              </span>
              <h3 className="font-bold text-base leading-snug">
                {t.home.smartEligibilityTitle}
              </h3>
              <p className="text-xs text-orange-100 mt-1 mb-3">
                {t.home.smartEligibilityDesc}
              </p>
              <Link
                href="/eligibility"
                className="inline-flex items-center gap-1 bg-white text-orange-600 text-xs font-bold px-3.5 py-2 rounded-xl hover:bg-orange-50 transition shadow-sm"
              >
                {t.home.checkNowBtn} <ChevronRight size={13} />
              </Link>
            </div>

            {/* Popular Schemes (Dynamic from Firestore / CMS) */}
            <DynamicFeaturedSchemes variant="desktop-sidebar" />

            {/* Quick Services */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-blue-100">
                <h3 className="font-bold text-gray-700 text-sm flex items-center gap-2">
                  <FileText size={15} className="text-blue-500" />
                  {t.home.quickServicesTitle}
                </h3>
              </div>
              <div className="divide-y divide-blue-100">
                {quickServices.map(({ icon: Icon, label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition group"
                  >
                    <Icon size={16} className="text-blue-500 flex-shrink-0" />
                    <span className="text-xs font-medium text-gray-700 group-hover:text-blue-600 flex-1 truncate">
                      {label}
                    </span>
                    <ChevronRight size={13} className="text-gray-300 group-hover:text-blue-400 flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* ── ChatBot Column ── */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-2.5 px-0.5">
              <h2 className="font-extrabold text-slate-800 text-xs sm:text-base flex items-center gap-1.5">
                <Bot size={17} className="text-orange-500 shrink-0" />
                <span>{t.home.chatBotTitle}</span>
              </h2>
              <Link
                href="/chat"
                className="hidden sm:flex text-xs font-bold text-orange-600 hover:underline items-center gap-0.5 whitespace-nowrap"
              >
                {t.home.openFullScreen} <ChevronRight size={12} />
              </Link>
            </div>
            <ChatBot />
          </div>
        </div>
      </main>
    </>
  );
}
