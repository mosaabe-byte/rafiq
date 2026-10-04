import { useEffect, useState } from "react";
import { folderSupported, getFolder, pickFolder, removeFolder } from "../lib/projectFolder";
import "./ProjectFolderLink.css";

// «مجلّد المشروع» في العمود الجانبيّ: ربط وفكّ — ولا يظهر في متصفّح لا يدعم الواجهة
export default function ProjectFolderLink({ projectId, labels }) {
  const [name, setName] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setName(null);
    if (!folderSupported || !projectId) return;
    getFolder(projectId)
      .then((h) => { if (!cancelled) setName(h ? h.name : null); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [projectId]);

  if (!folderSupported || !projectId) return null;

  async function link() {
    try {
      const h = await pickFolder(projectId);
      setName(h.name);
    } catch {
      // ألغى المستخدم نافذة الاختيار — لا شيء يُفعل
    }
  }

  async function unlink() {
    await removeFolder(projectId);
    setName(null);
  }

  return (
    <div className="project-folder">
      <span className="project-folder-label">{labels.title}</span>
      {name ? (
        <>
          <span className="project-folder-name">📁 {name}</span>
          <button type="button" className="project-folder-btn" onClick={unlink}>{labels.unlink}</button>
        </>
      ) : (
        <button type="button" className="project-folder-btn" onClick={link}>{labels.link}</button>
      )}
    </div>
  );
}