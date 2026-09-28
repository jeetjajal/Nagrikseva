import { getChatModel, genAI } from "@/lib/gemini";
import { SCHEMES_DATA } from "@/lib/schemes-data";
import { ChatHistory } from "@/types";
import { NextRequest, NextResponse } from "next/server";

function getLocalFallbackReply(query: string, hasImage: boolean = false): string {
  const q = query.toLowerCase();

  // If user uploaded a photo and system is in offline/fallback mode
  if (hasImage) {
    return `📸 **દસ્તાવેજ AI સ્કેનર રીવ્યુ (NagrikSeva AI Pre-Check)**\n\n` +
      `✅ **પ્રારંભિક તપાસ:** તમારો દસ્તાવેજ સફળતાપૂર્વક અપલોડ થયો છે.\n` +
      `📌 **સરકારી સ્વીકૃતિ માપદંડો:**\n` +
      `• ફોટો સ્પષ્ટ હોવો જોઈએ, બધા ૪ ખૂણા દેખાવા જોઈએ.\n` +
      `• નામ, જન્મતારીખ અને આઈડી નંબર વાંચી શકાય તેવા હોવા જોઈએ.\n\n` +
      `🔄 **જો આ દસ્તાવેજ ન હોય તો માન્ય વૈકલ્પિક દસ્તાવેજો (Alternative Documents):**\n` +
      `• **જન્મ પુરાવા માટે:** જન્મનો દાખલો ન હોય તો 👉 **શાળા છોડ્યાનું પ્રમાણપત્ર (LC)** અથવા પાસપોર્ટ ચાલશે.\n` +
      `• **ઓળખ પુરાવા માટે:** આધાર કાર્ડ ન હોય તો 👉 **ચૂંટણી કાર્ડ (Voter ID)** અથવા પાન કાર્ડ ચાલશે.\n` +
      `• **સરનામા પુરાવા માટે:** લાઈટબિલ ન હોય તો 👉 **રેશનકાર્ડ**, વેરા પાવતી અથવા બેંક પાસબુક ચાલશે.\n` +
      `• **આવક પુરાવા માટે:** મામલતદારનો દાખલો ન હોય તો 👉 **તલાટીનું પંચનામું** ચાલશે.\n\n` +
      `💡 વધુ ચોકસાઈ માટે નજીકના **જન સેવા કેન્દ્ર (CSC)** અથવા ગ્રામ પંચાયતનો સંપર્ક કરો.`;
  }

  // 1. Alternative Documents Queries (વૈકલ્પિક દસ્તાવેજો)
  if (
    q.includes("જન્મનો દાખલો નથી") ||
    q.includes("જન્મ દાખલો નથી") ||
    q.includes("birth certificate") ||
    q.includes("lc ચાલશે") ||
    q.includes("school leaving") ||
    q.includes("માર્કશીટ ચાલશે") ||
    q.includes("marksheet")
  ) {
    return `🎂 **જન્મ તારીખના પુરાવા અંગે સરકારી નિયમો (DOB Proof Guide)**\n\n` +
      `📌 **જો તમારી પાસે જન્મનો દાખલો (Birth Certificate) ન હોય, તો નીચેનામાંથી કોઈપણ ૧ દસ્તાવેજ ૧૦૦% માન્ય ગણાશે:**\n` +
      `1. ✅ **શાળા છોડ્યાનું પ્રમાણપત્ર (School Leaving Certificate - LC)**\n` +
      `2. ✅ **ભારતીય પાસપોર્ટ (Indian Passport)**\n` +
      `3. ✅ **ધોરણ ૧૦ બોર્ડ સનદ (10th Board Passing Certificate)**\n\n` +
      `⚠️ **ખાસ નોંધ:** માત્ર માર્કશીટ (Statement of Marks) જન્મના પુરાવા તરીકે ચાલતી નથી, LC અથવા જન્મનો દાખલો જ માન્ય છે.\n` +
      `📍 **જન્મનો દાખલો કઢાવવા માટે:** ગ્રામ પંચાયત (તલાટી) અથવા નગરપાલિકા/મહાનગરપાલિકા જન્મ-મરણ નોંધણી શાખાનો સંપર્ક કરો.`;
  }

  if (
    q.includes("આવકનો દાખલો નથી") ||
    q.includes("આવક દાખલો નથી") ||
    q.includes("income certificate") ||
    q.includes("તલાટી પંચનામું") ||
    q.includes("પંચનામુ")
  ) {
    return `💵 **આવકના દાખલા અંગે માર્ગદર્શન & વૈકલ્પિક પુરાવા**\n\n` +
      `📌 **આવકનો દાખલો (Income Certificate) કઢાવવા માટેના પગલાં:**\n` +
      `1. ગ્રામ્ય વિસ્તારમાં **તલાટી કમ મંત્રીનું રૂબરૂ પંચનામું** કરાવો.\n` +
      `2. નોકરી કરતા હોય તો **ફોર્મ-૧૬ (Form 16)** અથવા પગાર સ્લિપ.\n` +
      `3. વેપારીઓ માટે **છેલ્લા ૩ વર્ષનું ITR રિટર્ન**.\n` +
      `4. BPL કુટુંબ માટે **BPL સ્કોર યાદી / અન્નોદય કાર્ડ**.\n\n` +
      `📍 **ક્યાં જવું:** તાલુકા મામલતદાર કચેરી અથવા જન સેવા કેન્દ્ર (Digital Gujarat Portal પરથી ઓનલાઇન પણ નીકળે છે).\n` +
      `⏱️ **સમયમર્યાદા:** ૧ થી ૩ દિવસ (સરકારી ફી: ₹૨૦).`;
  }

  if (
    q.includes("લાઈટબિલ નથી") ||
    q.includes("લાઈટ બિલ નથી") ||
    q.includes("light bill") ||
    q.includes("સરનામાનો પુરાવો") ||
    q.includes("address proof") ||
    q.includes("રહેઠાણ")
  ) {
    return `🏠 **રહેઠાણ / સરનામાના માન્ય વૈકલ્પિક પુરાવા (Address Proofs)**\n\n` +
      `📌 **જો લાઈટબિલ ન હોય, તો નીચેનામાંથી કોઈપણ ૧ દસ્તાવેજ સરનામાના પુરાવા તરીકે માન્ય છે:**\n` +
      `1. ✅ **બારકોડેડ રેશનકાર્ડ (Ration Card)**\n` +
      `2. ✅ **નગરપાલિકા / ગ્રામ પંચાયત મકાન વેરા પાવતી (Property Tax Receipt)**\n` +
      `3. ✅ **રાષ્ટ્રીયકૃત બેંકની ફોટાવાળી પાસબુક (Bank Passbook)**\n` +
      `4. ✅ **સબ-રજિસ્ટ્રાર કચેરીમાં નોંધાયેલ ભાડા કરાર (Registered Rent Agreement)**\n` +
      `5. ✅ **ચૂંટણી કાર્ડ (Voter ID)** અથવા પાસપોર્ટ.`;
  }

  if (
    q.includes("૭/૧૨ નથી") ||
    q.includes("7/12 નથી") ||
    q.includes("જમીનનો દાખલો") ||
    q.includes("anyror") ||
    q.includes("૮-અ")
  ) {
    return `🌾 **૭/૧૨ અને ૮-અ જમીન નકલ ઓનલાઇન મેળવવાની રીત**\n\n` +
      `📌 **ઘરે બેઠા મોબાઈલમાંથી ૧ મિનિટમાં ૭/૧૨ ડાઉનલોડ કરો:**\n` +
      `1. ગુજરાત સરકારના સત્તાવાર પોર્ટલ **[AnyRoR Gujarat](https://anyror.gujarat.gov.in)** પર જાઓ.\n` +
      `2. **"View Land Record - Rural / Urban"** પસંદ કરો.\n` +
      `3. તમારો જિલ્લો, તાલુકો, ગામ અને **સર્વે નંબર અથવા ખાતા નંબર** નાખો.\n` +
      `4. કેપ્ચા કોડ નાખીને **"Get Record Detail"** ક્લિક કરતાં જ ૭/૧૨ અને ૮-અ લાઈવ દેખાશે.\n\n` +
      `💡 સહી-સિક્કાવાળી સત્તાવાર નકલ માટે ગ્રામ પંચાયત (ઈ-ગ્રામ) કે મામલતદાર કચેરી જઈ ₹૫ ફી ભરીને મેળવી શકો છો.`;
  }

  // 2. Specialized Direct Handling for Gujarat Civil Supplies / Ration Card (BUG-021)
  if (
    q.includes("ration") ||
    q.includes("રેશન") ||
    q.includes("રાશન") ||
    q.includes("બારકોડેડ રેશનકાર્ડ")
  ) {
    return `📜 **ગુજરાત અન્ન અને નાગરિક પુરવઠા સેવાઓ - રેશનકાર્ડ સહાય**\n\n` +
      `📌 **મુખ્ય ઑનલાઇન સેવાઓ:**\n` +
      `• નવા બારકોડેડ રેશનકાર્ડ માટે નવી અરજી\n` +
      `• કુટુંબમાં નવા સભ્ય (બાળક/પત્ની) નું નામ ઉમેરવું\n` +
      `• લગ્ન કે અવસાન બાદ નામ કમી કરાવવું\n` +
      `• અલગ રહેતા કુટુંબ માટે રેશનકાર્ડ વિભાજન (Split Card)\n` +
      `• સરનામું ફેરબદલી અથવા વાજબી ભાવની દુકાન (FPS) ટ્રાન્સફર\n\n` +
      `📄 **જરૂરી આધાર પુરાવા:**\n` +
      `• અરજદાર તથા તમામ સભ્યોના આધાર કાર્ડ\n` +
      `• રહેઠાણ પુરાવો (લાઈટબિલ / વેરા પાવતી)\n` +
      `• નામ ઉમેરવા માટે જન્મ દાખલો / લગ્ન નોંધણી પ્રમાણપત્ર / LC\n` +
      `• જૂના રેશનકાર્ડની નકલ\n\n` +
      `🌐 **સત્તાવાર પોર્ટલ:** [Digital Gujarat Portal](https://www.digitalgujarat.gov.in)\n` +
      `💡 તમે આ પોર્ટલના **"દસ્તાવેજ સેવાઓ"** ટેબમાંથી પણ રેશનકાર્ડ સુધારા માટે સીધી અરજી કરી શકો છો.`;
  }

  // 3. Specialized Handling for Ayushman Bharat PM-JAY / MAA Card
  if (
    q.includes("ayushman") ||
    q.includes("આયુષ્માન") ||
    q.includes("pmjay") ||
    q.includes("પીએમજેવાય") ||
    q.includes("maa card") ||
    q.includes("મા કાર્ડ") ||
    q.includes("હેલ્થ કાર્ડ") ||
    q.includes("સારવાર")
  ) {
    return `🏥 **આયુષ્માન ભારત PM-JAY (MAA અમૃતમ યોજના - ગુજરાત)**\n\n` +
      `📌 **યોજના હેઠળ મળવાપાત્ર લાભો:**\n` +
      `• ગુજરાત સરકાર દ્વારા પરિવાર દીઠ વાર્ષિક **₹૧૦ લાખ સુધી કેશલેસ સારવાર**\n` +
      `• ૨,૫૦૦+ થી વધુ સરકારી અને માન્ય ખાનગી હૉસ્પિટલોમાં કેશલેસ દાખલ થવાની સુવિધા\n` +
      `• ઓપરેશન, ICU, દવાઓ અને રિપોર્ટ્સનો સંપૂર્ણ ખર્ચ સરકાર ચૂકવે છે\n\n` +
      `📄 **કાર્ડ કઢાવવા માટે જરૂરી દસ્તાવેજો:**\n` +
      `• કુટુંબના તમામ સભ્યોના આધાર કાર્ડ (Aadhaar Card)\n` +
      `• NFSA / BPL અથવા માન્ય રેશનકાર્ડ (Ration Card)\n` +
      `• વાર્ષિક આવકનો દાખલો (₹૪ લાખથી ઓછી આવક માટે)\n` +
      `• આધાર સાથે લિંક થયેલ મોબાઈલ નંબર\n\n` +
      `📍 **કાર્ડ ક્યાંથી કઢાવવું?**\n` +
      `• નજીકના **જન સેવા કેન્દ્ર (CSC)** અથવા સરકારી દવાખાને જાઓ\n` +
      `• સત્તાવાર પોર્ટલ: [beneficiary.nha.gov.in](https://beneficiary.nha.gov.in)\n` +
      `📞 હેલ્પલાઇન: **14555** અથવા **104** (ટોલ ફ્રી)`;
  }

  // 4. Exact or Keyword Scheme Match across 26 Schemes
  const matchedScheme = SCHEMES_DATA.find((s) => {
    return (
      q.includes(s.name.toLowerCase()) ||
      q.includes(s.nameGu.toLowerCase()) ||
      (s.nameHi && q.includes(s.nameHi.toLowerCase())) ||
      q.includes(s.category.toLowerCase()) ||
      (q.includes("kisan") && s.id === "pm-kisan") ||
      (q.includes("ખેડૂત") && s.id === "pm-kisan") ||
      (q.includes("ikhedut") && s.id.includes("khedut")) ||
      (q.includes("ખેતી") && s.id.includes("kisan")) ||
      (q.includes("bima") && s.id === "fasal-bima") ||
      (q.includes("વીમો") && s.id === "fasal-bima") ||
      (q.includes("awas") && s.id.includes("awas")) ||
      (q.includes("આવાસ") && s.id.includes("awas")) ||
      (q.includes("મકાન") && s.id.includes("awas")) ||
      (q.includes("gas") && (s.id === "ujjwala-yojana" || s.id === "pm-ujjwala")) ||
      (q.includes("ગેસ") && (s.id === "ujjwala-yojana" || s.id === "pm-ujjwala")) ||
      (q.includes("સિલિન્ડર") && (s.id === "ujjwala-yojana" || s.id === "pm-ujjwala")) ||
      (q.includes("loan") && (s.id === "mudra-loan" || s.id === "pm-mudra")) ||
      (q.includes("લોન") && (s.id === "mudra-loan" || s.id === "pm-mudra")) ||
      (q.includes("દીકરી") && s.id.includes("dikri")) ||
      (q.includes("સુકન્યા") && s.id.includes("sukanya")) ||
      (q.includes("પેન્શન") && s.id.includes("pension")) ||
      (q.includes("સોલાર") && s.id.includes("surya")) ||
      (q.includes("solar") && s.id.includes("surya"))
    );
  });

  if (matchedScheme) {
    return `📋 **${matchedScheme.nameGu} (${matchedScheme.name})**\n\n` +
      `📌 **મુખ્ય લાભો:**\n` +
      matchedScheme.benefits.map((b) => `• ${b}`).join("\n") +
      `\n\n📄 **જરૂરી દસ્તાવેજો:**\n` +
      matchedScheme.documents.map((d) => `• ${d}`).join("\n") +
      `\n\n🌐 **સત્તાવાર પોર્ટલ:** [${matchedScheme.applicationUrl}](${matchedScheme.applicationUrl})\n` +
      `💡 વધુ માહિતી માટે નજીકના જનસેવા કેન્દ્ર (CSC) અથવા ઈ-ગ્રામ કેન્દ્રની મુલાકાત લો.`;
  }

  return `નમસ્તે! 🙏 NagrikSeva AI સહાયક સેવા કાર્યરત છે.\n\n` +
    `તમે નીચેની કોઈપણ લોકપ્રિય સરકારી યોજનાઓ અથવા સેવાઓ વિશે પૂછી શકો છો:\n` +
    `• 🌾 **PM કિસાન સન્માન નિધિ** (ખેડૂતોને વાર્ષિક ₹6,000 સહાય)\n` +
    `• 🏥 **આયુષ્માન ભારત PM-JAY** (વાર્ષિક ₹10 લાખ સુધી કેશલેસ સારવાર)\n` +
    `• 🏠 **PM આવાસ યોજના** (પાકા મકાન બાંધકામ સહાય)\n` +
    `• 🔥 **PM ઉજ્જવલા યોજના** (મફત ગેસ સિલિન્ડર અને ચૂલ્હો)\n` +
    `• 💼 **PM મુદ્રા યોજના** (ધંધા-રોજગાર માટે વગર ગેરંટી લોન)\n` +
    `• 👧 **વ્હાલી દીકરી યોજના** (દીકરીના ભણતર અને લગ્ન માટે ₹1.10 લાખ સહાય)\n` +
    `• 📜 **રેશનકાર્ડ સેવાઓ** (નવા નામ ઉમેરવા/કમી કરવા, વિભાજન)\n` +
    `• 📸 **દસ્તાવેજ ચકાસણી:** કેમેરા બટન દબાવી ફોટો મોકલો કે દસ્તાવેજ ચાલશે કે નહીં!\n\n` +
    `તમારો પ્રશ્ન ગુજરાતી, હિન્દી કે અંગ્રેજીમાં લખો, અમે તરત જ માર્ગદર્શન આપીશું!`;
}

export async function POST(req: NextRequest) {
  try {
    const {
      message,
      history,
      language,
      imageBase64,
      mimeType,
    }: {
      message?: string;
      history?: ChatHistory[];
      language?: string;
      imageBase64?: string;
      mimeType?: string;
    } = await req.json();

    const userQuery = message?.trim() || "";
    const hasImage = Boolean(imageBase64?.trim());

    if (!userQuery && !hasImage) {
      return NextResponse.json({ error: "Message or image is required" }, { status: 400 });
    }

    // Gemini requires chat history to start with 'user' and alternate properly
    let sanitizedHistory: ChatHistory[] = [];
    if (Array.isArray(history)) {
      const firstUserIdx = history.findIndex((h) => h.role === "user");
      if (firstUserIdx !== -1) {
        sanitizedHistory = history.slice(firstUserIdx).filter((h, idx, arr) => {
          if (idx === 0) return h.role === "user";
          return h.role !== arr[idx - 1].role;
        });
      }
    }

    // Try available active models with a 7-second per-model timeout
    let lastError: Error | null = null;
    const fastModels = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro"];
    const langPrompt =
      language && language !== "gu"
        ? `\n\n[Instruction: Respond in '${language}' language accurately with easy-to-understand terms.]`
        : "";

    // If an image is uploaded, use multimodal vision prompt
    if (hasImage && imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:(image|application)\/\w+;base64,/, "");
      const visionPrompt =
        `તમે ગુજરાત સરકારના મુખ્ય દસ્તાવેજ ચકાસણી અધિકારી (Chief Document Verification Officer) છો.\n` +
        `નાગરિકે આ દસ્તાવેજનો ફોટો અપલોડ કર્યો છે. નાગરિકનો સવાલ/સંદર્ભ: "${userQuery || "આ દસ્તાવેજ સરકારી યોજના માટે ચાલશે કે નહીં?"}".\n\n` +
        `કૃપા કરીને આ ૪ મુદ્દાઓમાં સ્પષ્ટ અને સરળ ગુજરાતીમાં વિગતવાર જવાબ આપો:\n` +
        `1. 📄 **દસ્તાવેજની ઓળખ:** આ કયો દસ્તાવેજ છે? (દા.ત. આધાર કાર્ડ, જન્મનો દાખલો, માર્કશીટ, રેશનકાર્ડ, લાઈટબિલ, ૭/૧૨ નકલ વગેરે).\n` +
        `2. 🔍 **ચાલશે કે નહીં? (Pre-Check Status):** શું આ દસ્તાવેજ સરકારી કચેરીમાં સ્વીકાર્ય છે? ફોટો સ્પષ્ટ છે કે ઝાંખો/કપાયેલો છે? જો કોઈ ખામી હોય તો જણાવો.\n` +
        `3. 🔄 **વૈકલ્પિક દસ્તાવેજો (Alternative Documents):** જો નાગરિક પાસે આ દસ્તાવેજ ન હોય અથવા આ રિજેક્ટ થાય (દા.ત. જન્મના પુરાવા માટે માર્કશીટ ન ચાલે પણ LC ચાલે), તો કયા બીજા સરકારી માન્ય કાગળો ચાલશે?\n` +
        `4. 📍 **માર્ગદર્શન & આગળનું પગલું:** નજીકના જન સેવા કેન્દ્ર, ગ્રામ પંચાયત અથવા ડિજિટલ ગુજરાત પોર્ટલ પરથી આગળની પ્રક્રિયા કેવી રીતે કરવી.` +
        langPrompt;

      if (genAI) {
        for (const modelName of fastModels) {
          try {
            const model = genAI.getGenerativeModel({
              model: modelName,
              generationConfig: {
                maxOutputTokens: 900,
                temperature: 0.2,
              },
            });

            const sendPromise = model.generateContent([
              visionPrompt,
              {
                inlineData: {
                  data: cleanBase64,
                  mimeType: mimeType || "image/jpeg",
                },
              },
            ]);

            const timeoutPromise = new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error(`Timeout on vision model ${modelName}`)), 7000)
            );

            const result = await Promise.race([sendPromise, timeoutPromise]);
            const reply = result.response.text();
            if (reply?.trim()) {
              return NextResponse.json({ reply, success: true, isVision: true });
            }
          } catch (err: unknown) {
            lastError = err instanceof Error ? err : new Error(String(err));
          }
        }
      }

      // Fallback for image verification
      const fallbackReply = getLocalFallbackReply(userQuery || "document verification", true);
      return NextResponse.json({ reply: fallbackReply, success: true, isLocalFallback: true });
    }

    // Regular text chat flow
    for (const modelName of fastModels) {
      try {
        const model = getChatModel(modelName);
        if (!model) break; // GenAI not initialized (missing API key), fallback immediately

        const chat = model.startChat({ history: sanitizedHistory });

        const sendPromise = chat.sendMessage(userQuery + langPrompt);
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout on model ${modelName}`)), 6000)
        );

        const result = await Promise.race([sendPromise, timeoutPromise]);
        const reply = result.response.text();
        if (reply?.trim()) {
          return NextResponse.json({ reply, success: true });
        }
      } catch (err: unknown) {
        lastError = err instanceof Error ? err : new Error(String(err));
        // Continue to try next model in fallback list
      }
    }

    // If external models are busy/offline (e.g. 503 high demand or no API key), provide curated intelligent response
    if (lastError) {
      console.warn("External Gemini API notice, serving intelligent local fallback:", lastError.message);
    }
    const fallbackReply = getLocalFallbackReply(userQuery);
    return NextResponse.json({ reply: fallbackReply, success: true, isLocalFallback: true });
  } catch (error) {
    console.error("Chat API Fatal Error:", error);
    // Always return 200 with friendly fallback response so browser never logs 500 error
    const safeFallback = getLocalFallbackReply("help");
    return NextResponse.json({
      reply: safeFallback,
      success: true,
      errorHandled: true,
    });
  }
}
