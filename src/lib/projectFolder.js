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