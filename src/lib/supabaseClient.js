import { createClient } from '@supabase/supabase-js';

// @ts-ignore
/// <reference types="vite/client" />

// A URL e a publishable key do Supabase são PÚBLICAS por design (vão para o
// browser de todo cliente). A segurança real é garantida pelo Row-Level Security
// no banco. Usamos as variáveis de ambiente quando presentes (permite apontar
// para outro projeto) e caímos nos valores públicos do projeto como fallback,
// para que o build na Vercel funcione mesmo sem env vars configuradas.
const FALLBACK_URL = 'https://rqcvxnauxmgwgiqdlzuv.supabase.co';
const FALLBACK_ANON_KEY = 'sb_publishable_XZYkkB6EL6A8W4uyhXtCUw_zyGaT8Xv';

// @ts-ignore
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || FALLBACK_URL;
// @ts-ignore
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
