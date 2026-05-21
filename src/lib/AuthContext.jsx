import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);   // { id, empresa_id, nome, email, role }
  const [empresa, setEmpresa] = useState(null);    // { id, nome, onboarding_done, politica_documento }
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);

  // Carrega o profile (e a empresa) do usuário a partir do Supabase.
  const loadProfile = useCallback(async (currentUser) => {
    if (!currentUser) {
      setProfile(null);
      setEmpresa(null);
      return null;
    }
    const { data: prof, error } = await supabase
      .from('profiles')
      .select('id, empresa_id, nome, email, role')
      .eq('id', currentUser.id)
      .maybeSingle();

    if (error) {
      console.error('[auth] falha ao carregar profile:', error.message);
      setProfile(null);
      setEmpresa(null);
      return null;
    }

    setProfile(prof || null);

    if (prof?.empresa_id) {
      const { data: emp } = await supabase
        .from('empresa')
        .select('id, nome, onboarding_done, politica_documento, politica_texto')
        .eq('id', prof.empresa_id)
        .maybeSingle();
      setEmpresa(emp || null);
    } else {
      setEmpresa(null);
    }
    return prof;
  }, []);

  // 1) Acompanha a sessão. IMPORTANTE: o callback de onAuthStateChange NÃO pode
  //    chamar outros métodos do Supabase (deadlock conhecido do supabase-js que
  //    trava o app em loading). Aqui ele só atualiza session/user.
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: initial } }) => {
      setSession(initial);
      setUser(initial?.user ?? null);
      setAuthReady(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setAuthReady(true);
    });

    return () => subscription?.unsubscribe();
  }, []);

  // 2) Carrega o profile quando o usuário muda — FORA do callback de auth.
  useEffect(() => {
    if (!authReady) return;
    let active = true;
    (async () => {
      setLoading(true);
      await loadProfile(user);
      if (active) setLoading(false);
    })();
    return () => { active = false; };
  }, [authReady, user?.id, loadProfile]);

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signUp = async (email, password, nome) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nome } },
    });
    if (error) throw error;
    return data; // data.session é null quando a confirmação de e-mail está ativa
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setEmpresa(null);
  };

  // Self-service: cria uma empresa e vira admin.
  const createEmpresa = async (nome) => {
    const { data, error } = await supabase.rpc('create_empresa', { p_nome: nome });
    if (error) throw error;
    await loadProfile(user);
    return data; // empresa id
  };

  const refreshProfile = useCallback(() => loadProfile(user), [loadProfile, user]);

  const value = {
    session,
    user,
    profile,
    empresa,
    loading,
    isAuthenticated: !!session,
    hasEmpresa: !!profile?.empresa_id,
    isAdmin: profile?.role === 'admin',
    // Admin que ainda não concluiu o onboarding da política vê a tela de upload.
    needsPolicyOnboarding: profile?.role === 'admin' && !!profile?.empresa_id && empresa?.onboarding_done === false,
    signIn,
    signUp,
    signOut,
    createEmpresa,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
