// ربط مجلّد المشروع: مقبض المجلّد يُحفظ في IndexedDB لكلّ مشروع — للقراءة وحدها، لا كتابة أبداً
const DB_NAME = "rafiq-project-folders";
const STORE = "handles";

export const folderSupported = typeof window !== "undefined" && "showDirectoryPicker" in window;

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function withStore(mode, fn) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const request = fn(tx.objectStore(STORE));
    tx.oncomplete = () => resolve(request?.result);
    tx.onerror = () => reject(tx.error);
  });
}

export function getFolder(projectId) {
  return withStore("readonly", (s) => s.get(String(projectId)));
}

export function removeFolder(projectId) {
  return withStore("readwrite", (s) => s.delete(String(projectId)));
}

// المستخدم يختار المجلّد بيده من نافذة النظام — بإذن القراءة وحده
export async function pickFolder(projectId) {
  const handle = await window.showDirectoryPicker({ mode: "read" });
  await withStore("readwrite", (s) => s.put(handle, String(projectId)));
  return handle;
}

// يتحقّق من الإذن، ويطلبه إن لزم (والطلب يحتاج نقرة من المستخدم)
export async function ensureReadPermission(handle) {
  if ((await handle.queryPermission({ mode: "read" })) === "granted") return true;
  return (await handle.requestPermission({ mode: "read" })) === "granted";
}


// ما لا يُقرأ أبداً، ولو طلبه رفيق وسمح المستخدم
const DENY_SEGMENTS = new Set(["node_modules", ".git", ".vercel", "dist", "build"]);
const DENY_FILE = /^\.env(\..*)?$|\.(pem|key|p12|pfx|keystore)$|^id_(rsa|ed25519)/i;
const MAX_BYTES = 100 * 1024;

// أنماط المفاتيح المعروفة — تُحجب قبل الإرسال، فيقرأ رفيق الكود والمفتاح مخفيّ
const SECRET_PATTERNS = [
  /sk-[A-Za-z0-9_-]{20,}/g,
  /AIza[0-9A-Za-z_-]{30,}/g,
  /eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}/g,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g,
];

// يقرأ ملفّاً بمساره داخل المجلّد المربوط — قراءة فقط، بالشروط كلّها
export async function readProjectFile(dirHandle, path) {
  const clean = String(path || "").trim().replace(/\\/g, "/");
  if (!clean || clean.startsWith("/") || /^[a-zA-Z]:/.test(clean)) return { path: clean, error: "absolute" };
  const parts = clean.split("/").filter(Boolean);
  if (parts.some((p) => p === ".." || p === ".")) return { path: clean, error: "traversal" };
  if (parts.some((p) => DENY_SEGMENTS.has(p)) || DENY_FILE.test(parts[parts.length - 1])) {
    return { path: clean, error: "denied" };
  }
  try {
    let dir = dirHandle;
    for (const seg of parts.slice(0, -1)) dir = await dir.getDirectoryHandle(seg);
    const file = await (await dir.getFileHandle(parts[parts.length - 1])).getFile();
    if (file.size > MAX_BYTES) return { path: clean, error: "too_large" };
    let text = await file.text();
    if (text.includes("\u0000")) return { path: clean, error: "binary" };
    let masked = 0;
    for (const re of SECRET_PATTERNS) {
      text = text.replace(re, () => { masked++; return "[مفتاح محجوب]"; });
    }
    return { path: parts.join("/"), text, masked };
  } catch {
    return { path: clean, error: "not_found" };
  }
}