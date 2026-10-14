import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import { PLANNING_FORM, COLUMN_QUESTIONS, pick, isFormReady, mergeWithProject } from "../lib/phaseForms";
import "./PhaseForm.css";

// استمارة التخطيط في «الطريق»: تُملأ على دفعات، وكلّ إجابة تُحفظ وأنت تكتب.
// أسئلة الأعمدة (من سيستعمله، ونوعه) تُقرأ من المشروع وتُكتب فيه — جواب واحد أينما عُدِّل.
export default function PhaseForm({ projectId, lang, onSend }) {
  const [allForms, setAllForms] = useState(null);
  const [answers, setAnswers] = useState({});
  const [status, setStatus] = useState("");
  const timer = useRef(null);
  const latest = useRef({});

  useEffect(() => {
    let cancelled = false;
    supabase.from("projects").select("phase_forms, audience, platform").eq("id", projectId).maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        const all = data?.phase_forms || {};
        const merged = mergeWithProject(all.planning, data);
        setAllForms(all);
        setAnswers(merged);
        latest.current = merged;
      });
    return () => { cancelled = true; clearTimeout(timer.current); };
  }, [projectId]);

  // حفظ واحد: أسئلة الأعمدة في أعمدتها، والباقي في الاستمارة
  async function save(next) {
    const formOnly = { ...next };
    const columns = {};
    for (const q of COLUMN_QUESTIONS) {
      columns[q.column] = next[q.id] || null;
      delete formOnly[q.id];
    }
    const all = { ...(allForms || {}), planning: formOnly };
    const { error } = await supabase.from("projects").update({ phase_forms: all, ...columns }).eq("id", projectId);
    if (!error) { setAllForms(all); setStatus("saved"); } else setStatus("");
  }

  function update(id, value) {
    const next = { ...latest.current, [id]: value };
    latest.current = next;
    setAnswers(next);
    setStatus("saving");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => save(next), 800);
  }

  function toggleIn(id, value) {
    const list = latest.current[id] || [];
    update(id, list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  // الإرسال ينتظر آخر حفظ، فلا تضيع إجابة كُتبت للتوّ
  async function handleSend() {
    clearTimeout(timer.current);
    await save(latest.current);
    onSend();
  }

  if (allForms === null) return null;
  const f = PLANNING_FORM;
  const ready = isFormReady(answers);

  return (
    <div className="phase-form">
      <div className="phase-form-head">
        <span className="phase-form-title">{pick(f.title, lang)}</span>
        {status && <span className="phase-form-status">{pick(status === "saving" ? f.saving : f.saved, lang)}</span>}
      </div>
      <p className="phase-form-intro">{pick(f.intro, lang)}</p>

      {f.questions.map((q) => (
        <div key={q.id} className="phase-form-q">
          <label className="phase-form-label">{pick(q.label, lang)}</label>
          {q.column && <p className="phase-form-hint">{pick(f.fromProject, lang)}</p>}

          {q.type === "textarea" && (
            <textarea
              className="phase-form-input"
              rows={2}
              value={answers[q.id] || ""}
              onChange={(e) => update(q.id, e.target.value)}
            />
          )}

          {q.type === "choice" && (
            <div className="phase-form-options">
              {q.options.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  className={"phase-form-option" + (answers[q.id] === o.id ? " selected" : "")}
                  onClick={() => update(q.id, o.id)}
                >
                  {pick(o.label, lang)}
                </button>
              ))}
            </div>
          )}

          {q.type === "multi" && (
            <div className="phase-form-options">
              {q.options.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  className={"phase-form-option" + ((answers[q.id] || []).includes(o.id) ? " selected" : "")}
                  onClick={() => toggleIn(q.id, o.id)}
                >
                  {pick(o.label, lang)}
                </button>
              ))}
            </div>
          )}

          {q.id === "accounts" && answers.accounts === "yes" && (
            <div className="phase-form-auth">
              <p className="phase-form-hint">{pick(f.authHint, lang)}</p>
              <div className="phase-form-options">
                {f.authParts.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={"phase-form-option" + ((answers.authNow || []).includes(p.id) ? " selected" : "")}
                    onClick={() => toggleIn("authNow", p.id)}
                  >
                    {pick(p.label, lang)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      <button type="button" className="phase-form-send" disabled={!ready} onClick={handleSend}>
        {pick(f.send, lang)}
      </button>
      {!ready && <p className="phase-form-hint">{pick(f.needRequired, lang)}</p>}
    </div>
  );
}