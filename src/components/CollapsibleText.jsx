import { useState } from "react";
import "./CollapsibleText.css";

// رسالة المستخدم الطويلة تُعرض مطويّة بعد عدد من الأسطر، مع زرّ لعرضها كلّها
export default function CollapsibleText({ text, maxLines = 10, moreLabel, lessLabel }) {
  const [open, setOpen] = useState(false);
  const lines = String(text || "").split("\n");
  if (lines.length <= maxLines) return text;
  return (
    <>
      {open ? text : lines.slice(0, maxLines).join("\n") + " …"}
      <button type="button" className="collapsible-toggle" onClick={() => setOpen(!open)}>
        {open ? lessLabel : moreLabel}
      </button>
    </>
  );
}