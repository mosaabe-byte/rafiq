import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function PageHint({ pageKey, text }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function check() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('pages_seen')
        .eq('id', user.id)
        .maybeSingle();
      if (!cancelled && !data?.pages_seen?.[pageKey]) setShow(true);
    }
    check();
    return () => { cancelled = true; };
  }, [pageKey]);

  async function dismiss() {
    setShow(false);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .select('pages_seen')
      .eq('id', user.id)
      .maybeSingle();
    const next = { ...(data?.pages_seen || {}), [pageKey]: true };
    await supabase.from('profiles').update({ pages_seen: next }).eq('id', user.id);
  }

  if (!show) return null;

  return (
    <div className="page-hint">
      <span className="page-hint-text">{text}</span>
      <button className="page-hint-close" onClick={dismiss} aria-label="×">×</button>
    </div>
  );
}