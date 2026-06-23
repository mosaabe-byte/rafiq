// api/chat.js
// حارس وسيط آمن بين واجهة رفيق و Claude.
// المفتاح يُقرأ من متغيّر بيئة في Vercel، ولا يظهر أبداً في الكود.

function buildSystemPrompt(project) {
  const base =
    "أنت «رفيق»، مساعد ودود يرافق المطوّر العربي المبتدئ. اشرح بالعربية ببساطة ووضوح، بخطوات صغيرة قابلة للاختبار، وتحقّق بعد كل خطوة قبل الانتقال للتالية، وبأسلوب مشجّع وهادئ.";

  // توجيه يُختم به كل رد: اقتراح الخطوة التالية بلُطف
  const nextStep = `

في نهاية كل رد، اختم باقتراح لطيف وقصير للخطوة التالية (سطر واحد)، يدفع المستخدم للأمام بثقة — مثل سؤال «هل ننتقل إلى كذا؟» أو «جاهز للخطوة التالية، أم تريد أن نتعمّق هنا أكثر؟». اجعله طبيعياً ومتنوّعاً، لا عبارة مكرّرة، ولا تفعله إن كان المستخدم نفسه يسأل سؤالاً ختامياً.`;

  if (!project) return base + nextStep;

  // ضبط عمق الشرح حسب مستوى المستخدم
  const level = (project.level || "").trim();
  let levelGuidance = "";
  if (level.includes("متقدّم") || level.includes("متقدم") || level.includes("محترف")) {
    levelGuidance = `

مستوى المستخدم متقدّم: قلّل التشبيهات المبسّطة، وافترض معرفة سابقة بالأساسيات، وادخل في التفاصيل التقنية الدقيقة بسرعة أكبر، واذكر المصطلحات الإنجليزية الدقيقة. ابقَ رفيقاً مشجّعاً، لكن خاطبه كزميل لا كمبتدئ.`;
  } else if (level.includes("متوسط")) {
    levelGuidance = `

مستوى المستخدم متوسط: وازِن بين التبسيط والعمق، واشرح المفاهيم الجديدة دون إطالة في الأساسيات التي يعرفها غالباً.`;
  } else {
    levelGuidance = `

مستوى المستخدم مبتدئ: استخدم تشبيهات من الحياة اليومية، وتجنّب المصطلحات المعقّدة دون شرحها، وتقدّم بخطوات صغيرة جداً.`;
  }

  const context = `

سياق المستخدم الحالي (استخدمه لتُخصّص ردودك، ورحّب به بوعي بمكانه دون أن تُكرر كل هذه المعلومات حرفياً في كل رد):
- اسم المشروع: ${project.name || "غير محدّد"}
- مستوى المستخدم: ${project.level || "غير محدّد"}
- المرحلة الحالية: ${project.phase || "غير محدّدة"}
- نسبة التقدّم: ${project.progress ?? 0}%
- النظام الأساسي: ${project.platform || "غير محدّد"}`;

  return base + nextStep + levelGuidance + context;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages, project } = req.body;

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
        system: buildSystemPrompt(project),
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: errText });
    }

    const data = await response.json();

    const reply = data.content
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("");

    return res.status(200).json({ reply, usage: data.usage });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}