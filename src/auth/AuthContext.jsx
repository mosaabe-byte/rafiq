import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

// يشتقّ اسم عرض من المتوفّر: الاسم المحفوظ ← اسم Google ← الجزء قبل @ من البريد
export function deriveDisplayName(user, profile) {
  if (profile?.full_name && profile.full_name.trim()) {
    return profile.full_name.trim();
  }
  const meta = user?.user_metadata || {};
  if (meta.full_name && meta.full_name.trim()) return meta.full_name.trim();
  if (meta.name && meta.name.trim()) return meta.name.trim();
  const email = user?.email || "";
  if (email.includes("@")) return email.split("@")[0];
  return email || "—";
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // يتحقق من وجود جلسة دخول محفوظة عند فتح التطبيق
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // يستمع لأي تغيير في حالة الدخول (تسجيل دخول، خروج، إلخ)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // عند توفّر المستخدم: اجلب صفّ profiles الخاص به (أو أنشئه إن لم يوجد)
  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }

    let cancelled = false;

    async function loadProfile() {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, country, birth_year, created_at")
        .eq("id", user.id)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        // في حال أي خطأ، لا نُعطّل التطبيق — نكتفي بغياب الملف
        setProfile(null);
        return;
      }

      if (data) {
        setProfile(data);
      } else {
        // مستخدم قديم بلا صفّ (احتياط): أنشئ صفّاً له الآن
        const { data: created } = await supabase
          .from("profiles")
          .insert({
            id: user.id,
            full_name: user.user_metadata?.full_name || null,
          })
          .select("id, full_name, country, birth_year, created_at")
          .maybeSingle();
        if (!cancelled) setProfile(created || null);
      }
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [user]);

  async function signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    return { data, error };
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  }

  async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({ provider: "google" });
    return { data, error };
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  // تحديث اسم الملف الشخصي (نحتاجها لاحقاً لشاشة تعديل الاسم)
  async function updateProfile(fields) {
    if (!user) return { error: new Error("no user") };
    const { data, error } = await supabase
      .from("profiles")
      .update(fields)
      .eq("id", user.id)
      .select("id, full_name, country, birth_year, created_at")
      .maybeSingle();
    if (!error && data) setProfile(data);
    return { data, error };
  }

  const displayName = deriveDisplayName(user, profile);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        displayName,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}