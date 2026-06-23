// api/define.js
// يأخذ مصطلحاً تقنياً ويُرجع تعريفه الكامل بصيغة JSON ليملأ المعجم.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { term } = req.body;

    if (!term || !term.trim()) {
      return res.status(400).json({ error: "المصطلح مطلوب" });
    }

    const systemPrompt = `أنت «رفيق»، معلّم ودود للمطوّر العربي المبتدئ. مهمتك: شرح مصطلح تقني واحد بشكل مبسّط جداً.
أعطِ ردّك حصرياً بصيغة JSON صالحة، دون أي نص قبله أو بعده، ودون علامات Markdown. الصيغة المطلوبة بالضبط:
{
  "en": "المصطلح بالإنجليزية بصيغته الصحيحة الشائعة",
  "ph": "نطق المصطلح بحروف عربية تقريبية، مثل: فْرونت-إند",
  "ar": "الترجمة العربية المختصرة",
  "def": "تعريف مبسّط جداً بجملة أو جملتين، بأسلوب مشجّع وبتشبيه من الحياة إن أمكن، يفهمه مبتدئ تماماً",
  "example": "مثال ملموس قصير واحد",
  "tags": ["وسم1", "وسم2"]
}
اجعل التعريف بالعربية الفصحى البسيطة. الوسوم كلمات عربية مفردة تصنّف المصطلح (مثل: برمجة، تصميم، خادم، أدوات).`;

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
        messages: [{ role: "user", content: `اشرح هذا المصطلح: ${term.trim()}` }],
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
      return res.status(500).json({ error: "تعذّر تحليل رد رفيق. حاول مرة أخرى." });
    }

    return res.status(200).json({ result: parsed });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}