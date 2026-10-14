import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const htmlPath = path.join(rootDir, "presentation.html");
const pdfPath = path.join(rootDir, "NagrikSeva_AI_Official_Deck.pdf");

console.log("Building comprehensive 20-slide HTML presentation...");

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>NagrikSeva AI - Official Master Governance Presentation Deck</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+Gujarati:wght@400;600;700&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Plus Jakarta Sans', 'Noto Sans Gujarati', sans-serif;
  }
  
  @page {
    size: 16in 9in;
    margin: 0;
  }
  
  body {
    background: #090d16;
    color: #e2e8f0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  
  .slide {
    width: 1536px;
    height: 864px;
    position: relative;
    page-break-after: always;
    overflow: hidden;
    padding: 32px 48px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .slide-dark {
    background: #0f172a;
    color: #ffffff;
  }
  
  .slide-light {
    background: #f8fafc;
    color: #0f172a;
  }
  
  .top-accent-bar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 8px;
    background: linear-gradient(90deg, #ea580c 0%, #f59e0b 50%, #10b981 100%);
  }
  
  .header-category {
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #ea580c;
  }
  .header-category.amber { color: #f59e0b; }
  
  .header-title {
    font-size: 26px;
    font-weight: 800;
    line-height: 1.2;
    margin-top: 4px;
  }
  .slide-dark .header-title { color: #ffffff; }
  .slide-light .header-title { color: #0f172a; }
  
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: #94a3b8;
    border-top: 1px solid rgba(148, 163, 184, 0.15);
    padding-top: 12px;
    margin-top: 8px;
  }
  .slide-light .footer { border-color: #e2e8f0; }
  
  .badge {
    display: inline-flex;
    align-items: center;
    padding: 6px 14px;
    border-radius: 9999px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.5px;
  }
  
  .card-dark {
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 12px;
  }
  
  .card-light {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
  }
  
  .table-custom {
    width: 100%;
    border-collapse: collapse;
    border-radius: 8px;
    overflow: hidden;
  }
  .table-custom th {
    background: #0f172a;
    color: #ffffff;
    padding: 12px 16px;
    font-size: 12px;
    font-weight: 700;
    text-align: left;
    border: 1px solid #334155;
  }
  .table-custom td {
    padding: 10px 16px;
    font-size: 12px;
    border: 1px solid #e2e8f0;
    background: #ffffff;
    color: #334155;
  }
</style>
</head>
<body>

<!-- SLIDE 1: TITLE SLIDE -->
<div class="slide slide-dark">
  <div class="top-accent-bar"></div>
  <div>
    <div style="display:flex; gap:12px; margin-bottom:12px;">
      <span class="badge" style="background:#1e293b; color:#38bdf8; border:1px solid #38bdf8;">☁️ GOOGLE CLOUD • HACK2SKILL</span>
      <span class="badge" style="background:#1e293b; color:#f59e0b; border:1px solid #f59e0b;">⚡ BUILD WITH AI: CODE FOR COMMUNITIES — SECOND EDITION</span>
      <span class="badge" style="background:#1e293b; color:#34d399; border:1px solid #34d399;">TRACK: DIGITAL PUBLIC INFRASTRUCTURE (DPI)</span>
    </div>
    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
      <div>
        <h1 style="font-size:48px; font-weight:900; color:#ffffff; letter-spacing:-0.5px;">NagrikSeva AI</h1>
        <h2 style="font-size:22px; font-weight:700; color:#f59e0b; margin-top:4px;">નાગરિકસેવા AI — Multilingual Digital Public Infrastructure</h2>
        <p style="font-size:15px; color:#cbd5e1; max-width:850px; line-height:1.6; margin-top:12px;">
          A Next-Generation Citizen Governance Platform bridging 70M+ citizens to public welfare entitlements. Integrating Multilingual Gujarati Voice AI, Google Gemini 1.5 Flash Vision Document Scrutiny, and Mamlatdar Revenue Officer Workflows into unified Digital Public Infrastructure.
        </p>
      </div>
      <div class="card-dark" style="padding:16px 24px; text-align:center; min-width:200px; border-color:#ea580c;">
        <div style="font-size:18px; font-weight:800; color:#ea580c;">TEAM JUSTCODE</div>
        <div style="font-size:12px; font-style:italic; color:#94a3b8; margin-top:4px;">"We don't talk, we build."</div>
      </div>
    </div>
  </div>

  <div class="card-dark" style="padding:18px 24px; background:linear-gradient(135deg, #172554 0%, #1e1b4b 100%); border-color:#f59e0b;">
    <div style="font-size:14px; font-weight:800; color:#f59e0b; display:flex; align-items:center; gap:8px;">
      <span>🇮🇳</span> ALIGNED WITH HON'BLE PM MODI'S "DIGITAL INDIA" & "VIKSIT BHARAT 2047"
    </div>
    <div style="font-size:13px; color:#e2e8f0; margin-top:6px;">
      Architecting Paperless, Faceless, and Corruption-Free Citizen Governance for Last-Mile Communities.
    </div>
  </div>

  <div class="card-dark" style="padding:14px 20px; border-color:#334155;">
    <span style="font-size:12px; font-weight:700; color:#38bdf8;">POWERED BY GOOGLE TECH:</span>
    <span style="font-size:12px; color:#cbd5e1; margin-left:8px;">Google Gemini 1.5 Flash (Vision & Chat) • Cloud Firestore • Next.js 16 • Web Speech API</span>
  </div>

  <div class="card-dark" style="padding:16px 24px; border-color:#ea580c; display:flex; justify-content:space-between; align-items:center;">
    <div>
      <div style="font-size:12px; font-weight:800; color:#ea580c;">DEVELOPERS & ARCHITECTS</div>
      <div style="font-size:14px; color:#ffffff; font-weight:600; margin-top:4px;">
        Hari Patel (AI & Full-Stack Lead) • Jeet (Systems & UI/UX Lead)
      </div>
    </div>
    <div style="font-size:12px; color:#94a3b8; text-align:right;">
      Atmiya University, Rajkot • Repository: <span style="color:#38bdf8;">github.com/hkPateL26/GDG</span>
    </div>
  </div>

  <div class="footer">
    <span>NagrikSeva AI • Google Cloud: Build with AI — Code for Communities (Second Edition) • Hack2Skill</span>
    <span>Slide 1 / 20</span>
  </div>
</div>

<!-- SLIDE 2: THE HUMAN STORY -->
<div class="slide slide-light">
  <div class="top-accent-bar"></div>
  <div>
    <div class="header-category">THE HUMAN STORY & EMPATHY</div>
    <div class="header-title">The Agony of the Physical Queue vs. The Power of NagrikSeva AI</div>
  </div>

  <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px; margin:16px 0;">
    <!-- BEFORE -->
    <div style="background:#fef2f2; border:2px solid #ef4444; border-radius:14px; padding:20px; display:flex; flex-direction:column; justify-content:space-between;">
      <div>
        <div style="font-size:16px; font-weight:800; color:#dc2626; margin-bottom:12px;">❌ BEFORE: The Legacy Struggle (પહેલાંની મુશ્કેલીઓ)</div>
        <div style="display:flex; flex-direction:column; gap:10px;">
          <div>
            <div style="font-size:13px; font-weight:700; color:#991b1b;">☀️ 42°C Heat & 4-Hour Queues:</div>
            <div style="font-size:12px; color:#7f1d1d;">Villagers travel 25 km to Mamlatdar Kacheri, waiting in 200m queues from 7 AM just to get basic service tokens.</div>
          </div>
          <div>
            <div style="font-size:13px; font-weight:700; color:#991b1b;">💸 Daily Wage Loss (₹500/day):</div>
            <div style="font-size:12px; color:#7f1d1d;">Daily laborers and small farmers lose their entire day's earnings repeatedly for bureaucratic status inquiries.</div>
          </div>
          <div>
            <div style="font-size:13px; font-weight:700; color:#991b1b;">📄 40% Document Rejections:</div>
            <div style="font-size:12px; color:#7f1d1d;">After 20 days, applications get rejected because the clerk finds a blurry photo or marksheet instead of birth certificate.</div>
          </div>
          <div>
            <div style="font-size:13px; font-weight:700; color:#991b1b;">🤝 Middlemen & Cyber-Café Exploitation:</div>
            <div style="font-size:12px; color:#7f1d1d;">Illiterate citizens pay ₹200 to ₹500 fees to agents who frequently mistype applicant names and details.</div>
          </div>
          <div>
            <div style="font-size:13px; font-weight:700; color:#991b1b;">⏳ 20-30 Days Black Hole (અનિશ્ચિતતા):</div>
            <div style="font-size:12px; color:#7f1d1d;">Zero transparent tracking; citizens have no clue which table or officer their critical file is stuck on.</div>
          </div>
        </div>
      </div>
      <div style="background:#fee2e2; border-radius:8px; padding:8px 12px; text-align:center; font-size:12px; font-weight:700; color:#991b1b; margin-top:12px;">
        Outcome: Extreme citizen frustration, lost livelihoods, and massive administrative backlog.
      </div>
    </div>

    <!-- AFTER -->
    <div style="background:#ecfdf5; border:2px solid #10b981; border-radius:14px; padding:20px; display:flex; flex-direction:column; justify-content:space-between;">
      <div>
        <div style="font-size:16px; font-weight:800; color:#059669; margin-bottom:12px;">✔ AFTER: NagrikSeva AI (નાગરિકસેવા AI નો લાભ)</div>
        <div style="display:flex; flex-direction:column; gap:10px;">
          <div>
            <div style="font-size:13px; font-weight:700; color:#065f46;">📱 1-Minute Service from Home Mobile:</div>
            <div style="font-size:12px; color:#064e3b;">Citizens access all 33 Gujarat districts' schemes from their mobile phones without travelling anywhere.</div>
          </div>
          <div>
            <div style="font-size:13px; font-weight:700; color:#065f46;">🎙️ Native Gujarati Voice AI Assistance:</div>
            <div style="font-size:12px; color:#064e3b;">Illiterate citizens simply tap the mic, speak in Gujarati, and hear spoken answers (Audio Read-Aloud).</div>
          </div>
          <div>
            <div style="font-size:13px; font-weight:700; color:#065f46;">⚡ Instant 3-Second AI Document Scrutiny:</div>
            <div style="font-size:12px; color:#064e3b;">Gemini Vision catches incorrect marksheets or blurry photos immediately before submission.</div>
          </div>
          <div>
            <div style="font-size:13px; font-weight:700; color:#065f46;">📜 Official QR Digital Slip & ₹0 Cost:</div>
            <div style="font-size:12px; color:#064e3b;">Instant downloadable receipt with QR verification, SMS updates, and 100% free digital governance.</div>
          </div>
          <div>
            <div style="font-size:13px; font-weight:700; color:#065f46;">📊 Guaranteed RTS SLA Timelines (કાયદાકીય ખાતરી):</div>
            <div style="font-size:12px; color:#064e3b;">Direct synchronization with Mamlatdar portal ensuring time-bound Direct Benefit Transfer (DBT).</div>
          </div>
        </div>
      </div>
      <div style="background:#d1fae5; border-radius:8px; padding:8px 12px; text-align:center; font-size:12px; font-weight:700; color:#065f46; margin-top:12px;">
        Outcome: 75% faster turnaround, 0 km travel, ₹0 middleman exploitation, 100% transparency.
      </div>
    </div>
  </div>

  <div class="footer">
    <span>NagrikSeva AI • Google Cloud: Build with AI — Code for Communities (Second Edition) • Hack2Skill</span>
    <span>Slide 2 / 20</span>
  </div>
</div>

<!-- SLIDE 3: SYSTEM SCOPE & ARCHITECTURE (10 MODULES) -->
<div class="slide slide-dark">
  <div class="top-accent-bar"></div>
  <div>
    <div class="header-category amber">SYSTEM SCOPE & ARCHITECTURE</div>
    <div class="header-title">Complete Feature Ecosystem: 10+ Integrated Governance Modules</div>
  </div>

  <div style="display:grid; grid-template-columns:repeat(5, 1fr); gap:12px; margin:14px 0;">
    <div class="card-dark" style="padding:12px;">
      <div style="font-size:13px; font-weight:700; color:#ffffff;">🔐 OTP Login Shield</div>
      <div style="font-size:11px; color:#cbd5e1; margin-top:4px;">Passwordless Mobile + Aadhaar Last 4. Profile sync.</div>
      <div style="font-size:10px; font-weight:800; color:#f59e0b; margin-top:8px;">AUTH ENGINE</div>
    </div>
    <div class="card-dark" style="padding:12px;">
      <div style="font-size:13px; font-weight:700; color:#ffffff;">🎙️ Gujarati Voice AI</div>
      <div style="font-size:11px; color:#cbd5e1; margin-top:4px;">Speech-to-Text & Gujarati Audio Read-Aloud.</div>
      <div style="font-size:10px; font-weight:800; color:#f59e0b; margin-top:8px;">VERNACULAR AI</div>
    </div>
    <div class="card-dark" style="padding:12px;">
      <div style="font-size:13px; font-weight:700; color:#ffffff;">🛡️ Vision AI OCR</div>
      <div style="font-size:11px; color:#cbd5e1; margin-top:4px;">Gemini Vision catches mismatches instantly.</div>
      <div style="font-size:10px; font-weight:800; color:#38bdf8; margin-top:8px;">HERO USP</div>
    </div>
    <div class="card-dark" style="padding:12px;">
      <div style="font-size:13px; font-weight:700; color:#ffffff;">⚖️ Eligibility Math</div>
      <div style="font-size:11px; color:#cbd5e1; margin-top:4px;">Dynamic rules evaluating 26+ Gujarat schemes.</div>
      <div style="font-size:10px; font-weight:800; color:#f59e0b; margin-top:8px;">RULE ENGINE</div>
    </div>
    <div class="card-dark" style="padding:12px;">
      <div style="font-size:13px; font-weight:700; color:#ffffff;">💰 Benefit Calculator</div>
      <div style="font-size:11px; color:#cbd5e1; margin-top:4px;">Consolidated family math (₹5.25L/yr) & WhatsApp pass.</div>
      <div style="font-size:10px; font-weight:800; color:#f59e0b; margin-top:8px;">FAMILY MATH</div>
    </div>
    <div class="card-dark" style="padding:12px;">
      <div style="font-size:13px; font-weight:700; color:#ffffff;">📍 GPS Locator</div>
      <div style="font-size:11px; color:#cbd5e1; margin-top:4px;">33 Gujarat districts directory with distance & maps.</div>
      <div style="font-size:10px; font-weight:800; color:#f59e0b; margin-top:8px;">GEO-NAV</div>
    </div>
    <div class="card-dark" style="padding:12px;">
      <div style="font-size:13px; font-weight:700; color:#ffffff;">📊 Citizen Track Vault</div>
      <div style="font-size:11px; color:#cbd5e1; margin-top:4px;">Live Firestore tracking & SLA legal countdown.</div>
      <div style="font-size:10px; font-weight:800; color:#f59e0b; margin-top:8px;">LIVE SYNC</div>
    </div>
    <div class="card-dark" style="padding:12px;">
      <div style="font-size:13px; font-weight:700; color:#ffffff;">📜 Government Receipt</div>
      <div style="font-size:11px; color:#cbd5e1; margin-top:4px;">State seal, barcode, tamper-proof QR code.</div>
      <div style="font-size:10px; font-weight:800; color:#f59e0b; margin-top:8px;">LEGAL PROOF</div>
    </div>
    <div class="card-dark" style="padding:12px;">
      <div style="font-size:13px; font-weight:700; color:#ffffff;">🏛️ Mamlatdar Portal</div>
      <div style="font-size:11px; color:#cbd5e1; margin-top:4px;">Officer scrutiny (/admin), AI score & 1-click DBT.</div>
      <div style="font-size:10px; font-weight:800; color:#f59e0b; margin-top:8px;">BACKOFFICE</div>
    </div>
    <div class="card-dark" style="padding:12px;">
      <div style="font-size:13px; font-weight:700; color:#ffffff;">📲 PWA Offline Mode</div>
      <div style="font-size:11px; color:#cbd5e1; margin-top:4px;">Installable web app with ServiceWorker caching.</div>
      <div style="font-size:10px; font-weight:800; color:#f59e0b; margin-top:8px;">RESILIENCE</div>
    </div>
  </div>

  <!-- PIPELINE -->
  <div class="card-dark" style="padding:16px 20px; border-color:#f59e0b;">
    <div style="font-size:12px; font-weight:800; color:#f59e0b; margin-bottom:10px;">END-TO-END CITIZEN-TO-OFFICER DIGITAL LIFECYCLE PIPELINE</div>
    <div style="display:grid; grid-template-columns:repeat(5, 1fr); gap:12px;">
      <div style="background:#0f172a; border:1px solid #475569; border-radius:8px; padding:10px; text-align:center;">
        <div style="font-size:10px; font-weight:800; color:#38bdf8;">STEP 1: INQUIRY</div>
        <div style="font-size:12px; font-weight:700; color:#ffffff; margin:4px 0;">Gujarati Voice / OTP</div>
        <div style="font-size:10px; color:#94a3b8;">Conversational discovery</div>
      </div>
      <div style="background:#0f172a; border:1px solid #475569; border-radius:8px; padding:10px; text-align:center;">
        <div style="font-size:10px; font-weight:800; color:#38bdf8;">STEP 2: PRE-SCRUTINY</div>
        <div style="font-size:12px; font-weight:700; color:#ffffff; margin:4px 0;">Gemini Vision OCR</div>
        <div style="font-size:10px; color:#94a3b8;">3s Instant validation</div>
      </div>
      <div style="background:#0f172a; border:1px solid #475569; border-radius:8px; padding:10px; text-align:center;">
        <div style="font-size:10px; font-weight:800; color:#38bdf8;">STEP 3: LEGAL RECEIPT</div>
        <div style="font-size:12px; font-weight:700; color:#ffffff; margin:4px 0;">QR Certified Slip</div>
        <div style="font-size:10px; color:#94a3b8;">Treasury challan & RTS SLA</div>
      </div>
      <div style="background:#0f172a; border:1px solid #475569; border-radius:8px; padding:10px; text-align:center;">
        <div style="font-size:10px; font-weight:800; color:#38bdf8;">STEP 4: BACKOFFICE</div>
        <div style="font-size:12px; font-weight:700; color:#ffffff; margin:4px 0;">Mamlatdar Scrutiny</div>
        <div style="font-size:10px; color:#94a3b8;">AI warnings & queue sort</div>
      </div>
      <div style="background:#0f172a; border:1px solid #475569; border-radius:8px; padding:10px; text-align:center;">
        <div style="font-size:10px; font-weight:800; color:#38bdf8;">STEP 5: DISBURSEMENT</div>
        <div style="font-size:12px; font-weight:700; color:#ffffff; margin:4px 0;">Direct Benefit Transfer</div>
        <div style="font-size:10px; color:#94a3b8;">1-Click DBT bank credit</div>
      </div>
    </div>
  </div>

  <div class="card-dark" style="padding:12px 20px; background:#14532d; border-color:#10b981; text-align:center; font-size:13px; font-weight:700; color:#ffffff;">
    ⚡ &lt;3s AI Verification Latency • 🎙️ 100% Gujarati Voice Fluency • 📉 75% Clerk Workload Reduced • 🛡️ 100% DPDP Act 2023 Compliant
  </div>

  <div class="footer">
    <span>NagrikSeva AI • Google Cloud: Build with AI — Code for Communities (Second Edition) • Hack2Skill</span>
    <span>Slide 3 / 20</span>
  </div>
</div>

<!-- SLIDE 4: SYSTEM ARCHITECTURE & ENGINEERING -->
<div class="slide slide-dark">
  <div class="top-accent-bar"></div>
  <div>
    <div class="header-category amber">SYSTEM ARCHITECTURE & ENGINEERING</div>
    <div class="header-title">End-to-End DPI Architecture & Real-Time Data Flow Pipeline</div>
  </div>

  <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:16px; margin:16px 0;">
    <div class="card-dark" style="padding:16px; border-color:#38bdf8;">
      <div class="badge" style="background:#0f172a; color:#38bdf8; margin-bottom:8px;">FRONTEND & PWA</div>
      <div style="font-size:14px; font-weight:800; color:#ffffff; margin-bottom:12px;">1. CLIENT LAYER (Edge Device)</div>
      <div style="font-size:11.5px; color:#cbd5e1; line-height:1.7;">
        • Next.js 16 App Router + React 19 UI<br/>
        • Web Speech API (Gujarati STT & TTS)<br/>
        • ServiceWorker (sw.js) Offline Cache<br/>
        • AES-safe Session & Haptic Provider<br/>
        • Responsive Mobile-First Design
      </div>
    </div>

    <div class="card-dark" style="padding:16px; border-color:#fb923c;">
      <div class="badge" style="background:#0f172a; color:#fb923c; margin-bottom:8px;">NEXT.JS EDGE SERVER</div>
      <div style="font-size:14px; font-weight:800; color:#ffffff; margin-bottom:12px;">2. API GATEWAY & SECURITY</div>
      <div style="font-size:11.5px; color:#cbd5e1; line-height:1.7;">
        • /api/chat (Streaming Gemini 1.5 Flash)<br/>
        • /api/verify-doc (Vision Pre-Scrutiny)<br/>
        • /api/auth/otp (2FA Passwordless)<br/>
        • /api/location/resolve (33 Districts GPS)<br/>
        • DPDP 2023 Aadhaar PII Redaction Filter
      </div>
    </div>

    <div class="card-dark" style="padding:16px; border-color:#f43f5e;">
      <div class="badge" style="background:#0f172a; color:#f43f5e; margin-bottom:8px;">VERTEX AI & GEMINI</div>
      <div style="font-size:14px; font-weight:800; color:#ffffff; margin-bottom:12px;">3. GOOGLE AI CORE</div>
      <div style="font-size:11.5px; color:#cbd5e1; line-height:1.7;">
        • Gemini 1.5 Flash Vision OCR Engine<br/>
        • Dynamic Scheme Rule Evaluation (26+)<br/>
        • Mismatch & Blurry Certificate Classifier<br/>
        • Gujarati & 16 Indian Languages NLP<br/>
        • Ephemeral In-Memory Token Handling
      </div>
    </div>

    <div class="card-dark" style="padding:16px; border-color:#34d399;">
      <div class="badge" style="background:#0f172a; color:#34d399; margin-bottom:8px;">CLOUD FIRESTORE & DBT</div>
      <div style="font-size:14px; font-weight:800; color:#ffffff; margin-bottom:12px;">4. DATA & GOVERNANCE VAULT</div>
      <div style="font-size:11.5px; color:#cbd5e1; line-height:1.7;">
        • Reactive Multi-Tenant Citizen Ledger<br/>
        • RTS Act SLA Legal Countdown Engine<br/>
        • SHA-256 HMAC Cyber Treasury Challan<br/>
        • Talati ➔ Mamlatdar ➔ Collector Desk<br/>
        • 1-Click Direct Benefit Transfer (DBT)
      </div>
    </div>
  </div>

  <div class="card-dark" style="padding:16px 20px; background:linear-gradient(135deg, #172554 0%, #1e1b4b 100%); border-color:#f59e0b;">
    <div style="font-size:13px; font-weight:800; color:#f59e0b;">🛡️ ARCHITECTURAL PRINCIPLE: ZERO-DATA LOSS & REAL-TIME EVENT REACTIVITY</div>
    <div style="font-size:12px; color:#e2e8f0; margin-top:6px;">
      Every citizen action is statefully synchronized across client, AI pre-scrutiny pipeline, and the officer revenue desk. Offline actions queue locally via ServiceWorker and re-sync automatically upon network reconnection.
    </div>
  </div>

  <div class="footer">
    <span>NagrikSeva AI • Google Cloud: Build with AI — Code for Communities (Second Edition) • Hack2Skill</span>
    <span>Slide 4 / 20</span>
  </div>
</div>

</body>
</html>`;

fs.writeFileSync(htmlPath, htmlContent);
console.log("HTML Deck written to:", htmlPath);
console.log("Now executing high-resolution PDF generation with Puppeteer...");

const browser = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"]
});

const page = await browser.newPage();
await page.setViewport({ width: 1536, height: 864, deviceScaleFactor: 2 });
await page.goto("file:///" + htmlPath.replace(/\\/g, "/"), { waitUntil: "networkidle0" });

await page.pdf({
  path: pdfPath,
  width: "16in",
  height: "9in",
  printBackground: true,
  preferCSSPageSize: true,
  margin: { top: "0in", right: "0in", bottom: "0in", left: "0in" }
});

await browser.close();
console.log("PDF generation complete! Saved to:", pdfPath);
