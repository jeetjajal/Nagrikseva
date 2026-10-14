import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir1 = path.join(__dirname, "perfect_screenshots");
const outDir2 = path.resolve(__dirname, "..", "perfect_screenshots");

const browser = await puppeteer.launch({
  headless: "new",
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-web-security"]
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

console.log("Capturing 07_benefit_calculator.png...");
await page.goto("http://localhost:3000/benefit-calculator", { waitUntil: "domcontentloaded", timeout: 30000 });
await new Promise(r => setTimeout(r, 2000));

const p1 = path.join(outDir1, "07_benefit_calculator.png");
const p2 = path.join(outDir2, "07_benefit_calculator.png");
await page.screenshot({ path: p1, fullPage: false });
fs.copyFileSync(p1, p2);
console.log("Successfully captured 07_benefit_calculator.png!");

await browser.close();
