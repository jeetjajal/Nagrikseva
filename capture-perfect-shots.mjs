import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir1 = path.join(__dirname, "perfect_screenshots");
const outDir2 = path.resolve(__dirname, "..", "perfect_screenshots");

[outDir1, outDir2].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

async function saveScreenshot(page, filename) {
  const p1 = path.join(outDir1, filename);
  const p2 = path.join(outDir2, filename);
  await page.screenshot({ path: p1, fullPage: false });
  fs.copyFileSync(p1, p2);
  console.log(`Saved ${filename} successfully.`);
}

async function safeGoto(page, url, delay = 1200) {
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });
  } catch (e) {
    console.log(`Warning on goto ${url}:`, e.message);
  }
  await new Promise((r) => setTimeout(r, delay));
}

async function run() {
  console.log("Launching browser to capture high-res screenshots from http://localhost:3000 ...");
  
  let launchOptions = {
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-web-security"]
  };
  
  if (fs.existsSync("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe")) {
    launchOptions.executablePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  }

  const browser = await puppeteer.launch(launchOptions);
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  // 1. Homepage Hero
  console.log("1. Capturing Homepage Hero...");
  await safeGoto(page, "http://localhost:3000/", 1200);
  await saveScreenshot(page, "01_home_hero.png");

  // 2. Chatbot with Voice & Interactive UI
  console.log("2. Capturing Interactive Voice Chatbot...");
  await safeGoto(page, "http://localhost:3000/chat", 1200);
  await saveScreenshot(page, "02_voice_chat.png");

  // 3. Citizen Login Shield (OTP 2FA screen)
  console.log("3. Capturing Citizen OTP Login Shield...");
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await safeGoto(page, "http://localhost:3000/documents", 1200);
  await saveScreenshot(page, "03_login_otp.png");

  // Set mock citizen session
  await page.evaluate(() => {
    const session = {
      mobile: "9974442291",
      citizenName: "Ramesh Patel",
      citizenNameGu: "રમેશ પટેલ",
      district: "Rajkot",
      districtGu: "રાજકોટ",
      taluka: "Gondal",
      village: "Gondal Rural",
      aadhaarLast4: "1413",
      annualIncome: 180000,
      occupation: "farmer",
      category: "OBC",
      hasLand: true,
      hasBPL: false,
      availedBenefits: [
        { schemeId: "pm-kisan", schemeName: "PM Kisan", amount: 6000, date: "2026-01-15" }
      ]
    };
    localStorage.setItem("nagrik_citizen_session", JSON.stringify(session));
  });

  // 4. Citizen Track Vault
  console.log("4. Capturing Logged-in Track Vault...");
  await safeGoto(page, "http://localhost:3000/track", 1500);
  await saveScreenshot(page, "04_track_vault.png");

  // 5. Document Service Portal (Logged-in)
  console.log("5. Capturing Document Service Portal...");
  await safeGoto(page, "http://localhost:3000/documents", 1500);
  await saveScreenshot(page, "05_doc_portal.png");

  // 6. Officer Scrutiny Portal (/admin)
  console.log("6. Capturing Officer / Mamlatdar Scrutiny Portal...");
  await page.evaluate(() => {
    sessionStorage.setItem(
      "nagrik_officer_session",
      JSON.stringify({
        id: "OFF-MAM-01",
        name: "H. V. Patel, GAS",
        designation: "મામલતદાર (Mamlatdar)",
        district: "Rajkot",
        taluka: "Gondal"
      })
    );
  });
  await safeGoto(page, "http://localhost:3000/admin?mode=officer", 1500);
  await saveScreenshot(page, "06_officer_admin.png");

  // 7. Family Welfare Benefit Calculator
  console.log("7. Capturing Family Benefit Calculator...");
  await safeGoto(page, "http://localhost:3000/benefit-calculator", 1500);
  await saveScreenshot(page, "07_benefit_calculator.png");

  // 8. Smart Kacheri GPS Locator
  console.log("8. Capturing Smart Kacheri GPS Locator...");
  await safeGoto(page, "http://localhost:3000/locator", 1500);
  await saveScreenshot(page, "08_kacheri_locator.png");

  // 9. Dynamic Scheme Eligibility Calculator
  console.log("9. Capturing Dynamic Scheme Eligibility Calculator...");
  await safeGoto(page, "http://localhost:3000/eligibility", 1500);
  await saveScreenshot(page, "09_eligibility_calculator.png");

  // 10. Official Receipt / Certificate
  console.log("10. Capturing Official Receipt & Certificate...");
  await safeGoto(page, "http://localhost:3000/track", 1200);
  try {
    const receiptBtn = await page.$("button:has-text('પહોંચ'), button:has-text('Receipt'), button:has-text('PDF')");
    if (receiptBtn) {
      await receiptBtn.click();
      await new Promise((r) => setTimeout(r, 1000));
    }
  } catch (e) {}
  await saveScreenshot(page, "10_receipt_or_detail.png");

  await browser.close();
  console.log("All 10 authentic screenshots captured and synchronized successfully!");
}

run().catch((err) => {
  console.error("Puppeteer capture error:", err);
  process.exit(1);
});
