// نافذة المحادثة المُرسَلة إلى رفيق: تتحرّك بقفزات من ٢٠ رسالة لا برسالة رسالة،
// فتبقى بدايتها ثابتة ٢٠ رسالة متتالية فتُقرأ من المخبّأ — ورفيق يرى بين ٢٠ و٤٠ رسالة.
// وتُقصّ من أوّلها إن تجاوز حجمها الحدّ (ملفّات مقروءة كبيرة)، وتبدأ دائماً برسالة من المستخدم.
const STEP = 20;
const MAX_CHARS = 120000;

export function historyWindow(list) {
  let start = list.length > 2 * STEP ? Math.floor((list.length - STEP) / STEP) * STEP : 0;
  let total = 0;
  for (let i = start; i < list.length; i++) total += String(list[i].content || "").length;
  while (total > MAX_CHARS && start < list.length - 1) {
    total -= String(list[start].content || "").length;
    start++;
  }
  while (start < list.length - 1 && list[start].role !== "user") start++;
  return list.slice(start);
}