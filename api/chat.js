// api/chat.js
// حارس وسيط آمن بين واجهة رفيق و Claude.
// المفتاح يُقرأ من متغيّر بيئة في Vercel، ولا يظهر أبداً في الكود.

export default async function handler(req, res) {
  // نقبل فقط طلبات من نوع POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages مطلوبة" });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system:
          "أنت «رفيق»، مساعد ودود يرافق المطوّر العربي المبتدئ. اشرح بالعربية ببساطة ووضوح، بخطوات صغيرة، وبأسلوب مشجّع.",
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: errText });
    }

    const data = await response.json();

    // نستخرج نص الجواب من رد Claude
    const reply = data.content
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("");

    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}