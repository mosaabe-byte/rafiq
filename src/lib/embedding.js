// توليد متّجهات التضمين في المتصفّح عبر نموذج gte-small
import { pipeline } from "@huggingface/transformers";
import { supabase } from "./supabase";

// نحمّل النموذج مرّة واحدة ونعيد استعماله (تحميله ثقيل، فلا نكرّره)
let embedderPromise = null;

function getEmbedder() {
  if (!embedderPromise) {
    embedderPromise = pipeline(
      "feature-extraction",
      "Supabase/gte-small"
    );
  }
  return embedderPromise;
}

// تحوّل نصّاً إلى متّجه من 384 رقماً
export async function embedText(text) {
  const embedder = await getEmbedder();
  const output = await embedder(text, {
    pooling: "mean",
    normalize: true,
  });
  // نحوّل الناتج إلى مصفوفة أرقام عاديّة
  return Array.from(output.data);
}

// تقطيع نصّ طويل إلى مقاطع متداخلة (للتضمين)
export function chunkText(text, size = 500, overlap = 50) {
  const clean = (text || "").trim();
  if (!clean) return [];
  const chunks = [];
  let start = 0;
  while (start < clean.length) {
    const end = Math.min(start + size, clean.length);
    chunks.push(clean.slice(start, end));
    if (end === clean.length) break;
    start = end - overlap; // نرجع قليلاً للتداخل
  }
  return chunks;
}

// تقطيع نصّ ملفّ وتضمين مقاطعه وتخزينها في library_chunks
export async function indexFileChunks(fileId, userId, text) {
  const chunks = chunkText(text);
  if (chunks.length === 0) return;

  // نضمّن كل مقطع ونجهّز صفّه
  const rows = [];
  for (const content of chunks) {
    const embedding = await embedText(content);
    rows.push({
      file_id: fileId,
      user_id: userId,
      content,
      embedding,
    });
  }

  // نخزّنها دفعة واحدة
  const { error } = await supabase.from("library_chunks").insert(rows);
  if (error) {
    console.error("تعذّر تخزين مقاطع الملفّ:", error.message);
  }
}

// البحث الدلاليّ: يجد أقرب مقاطع مكتبة المستخدم لسؤالٍ ما
export async function searchLibrary(query, userId, count = 5) {
  const queryEmbedding = await embedText(query);
  const { data, error } = await supabase.rpc("match_library_chunks", {
    query_embedding: queryEmbedding,
    match_user_id: userId,
    match_count: count,
  });
  if (error) {
    console.error("تعذّر البحث الدلاليّ:", error.message);
    return [];
  }
  return data || [];
}