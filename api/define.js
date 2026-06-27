// api/define.js
// يأخذ مصطلحاً تقنياً ولغة الواجهة، ويُرجع تعريفه الكامل بصيغة JSON ليملأ المعجم.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { term, lang } = req.body;
    const userLang = ["ar", "fr", "en"].includes(lang) ? lang : "ar";

    const ERR = {
      ar: { required: "المصطلح مطلوب", parseFailed: "تعذّر تحليل رد رفيق. حاول مرة أخرى." },
      fr: { required: "Le terme est requis", parseFailed: "Impossible d'analyser la reponse de Rafiq. Reessayez." },
      en: { required: "The term is required", parseFailed: "Could not parse Rafiq's response. Try again." },
    };

    if (!term || !term.trim()) {
      return res.status(400).json({ error: ERR[userLang].required });
    }

    const PROMPTS = {
      ar: `أنت «رفيق»، معلّم ودود للمطوّر العربي المبتدئ. مهمتك: شرح مصطلح تقني واحد بشكل مبسّط جداً، بالعربية الفصحى البسيطة.
أعطِ ردّك حصرياً بصيغة JSON صالحة، دون أي نص قبله أو بعده، ودون علامات Markdown. الصيغة المطلوبة بالضبط:
{
  "en": "المصطلح بالإنجليزية بصيغته الصحيحة الشائعة",
  "ph": "نطق المصطلح بحروف عربية تقريبية، مثل: فْرونت-إند",
  "ar": "الترجمة العربية المختصرة",
  "def": "تعريف مبسّط جداً بجملة أو جملتين، بأسلوب مشجّع وبتشبيه من الحياة إن أمكن، يفهمه مبتدئ تماماً",
  "example": "مثال ملموس قصير واحد",
  "tags": ["وسم1", "وسم2"]
}
الوسوم كلمات عربية مفردة تصنّف المصطلح (مثل: برمجة، تصميم، خادم، أدوات).`,

      fr: `Tu es "Rafiq", un mentor bienveillant pour le developpeur arabe debutant. Ta mission : expliquer un terme technique de maniere tres simple, en francais clair.
Reponds exclusivement en JSON valide, sans aucun texte avant ou apres, et sans balises Markdown. Le format exact requis :
{
  "en": "le terme en anglais dans sa forme correcte et courante",
  "ph": "",
  "ar": "la traduction courte en francais",
  "def": "une definition tres simple en une ou deux phrases, sur un ton encourageant, avec une analogie de la vie quotidienne si possible, comprehensible par un debutant complet",
  "example": "un exemple concret et court",
  "tags": ["etiquette1", "etiquette2"]
}
Le champ "ph" doit rester une chaine vide "". Les etiquettes sont des mots simples en francais qui categorisent le terme (par exemple : programmation, design, serveur, outils).`,

      en: `You are "Rafiq", a friendly mentor for the beginner Arab developer. Your task: explain one technical term very simply, in clear English.
Respond exclusively in valid JSON, with no text before or after, and no Markdown tags. The exact required format:
{
  "en": "the term in English in its correct common form",
  "ph": "",
  "ar": "the short translation in English",
  "def": "a very simple definition in one or two sentences, in an encouraging tone, with a real-life analogy if possible, understandable by a complete beginner",
  "example": "one short, concrete example",
  "tags": ["tag1", "tag2"]
}
The "ph" field must remain an empty string "". Tags are simple English words that categorize the term (e.g. programming, design, server, tools).`,
    };

    const USER_MSG = {
      ar: `اشرح هذا المصطلح: ${term.trim()}`,
      fr: `Explique ce terme : ${term.trim()}`,
      en: `Explain this term: ${term.trim()}`,
    };

    const systemPrompt = PROMPTS[userLang];

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 600,
        system: systemPrompt,
        messages: [{ role: "user", content: USER_MSG[userLang] }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: errText });
    }

    const data = await response.json();

    let raw = data.content
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("")
      .trim();

    // تنظيف أي علامات Markdown محتملة حول JSON
    raw = raw.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      return res.status(500).json({ error: ERR[userLang].parseFailed });
    }

    return res.status(200).json({ result: parsed });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}