import { useEffect, useRef } from "react";
import { useAuth } from "@/lib/AuthContext";

// Widget de chat (Chatwoot) com inbox por contexto de autenticação.
//
// - Deslogado (landing/login/cadastro) → inbox PÚBLICO ("Fale conosco no chat").
// - Logado (app autenticado)           → inbox de ATENDIMENTO ao usuário logado.
//
// Nunca carregamos os dois tokens na mesma página: o SDK é injetado UMA única vez
// por carga, com o token certo conforme o estado de auth quando ele resolve. Trocar
// de contexto dentro do SPA (login/logout) não recarrega o SDK — no logout, apenas
// reiniciamos a sessão do widget via `$chatwoot.reset()`.
const BASE_URL = "https://chatwoot-production-1e1f.up.railway.app";

const TOKEN_PUBLICO = "fbNpR1KvZXnDhQEemB5W38ij";  // deslogado (público)
const TOKEN_LOGADO = "xbc97LYPu1mLoxNeeEiLkUei";   // logado (atendimento)

// Módulo-nível (não ref): garante "uma vez por carga de página" mesmo com o
// double-mount do StrictMode em dev.
let sdkInitialized = false;

function initChatwoot(websiteToken, settings) {
  if (sdkInitialized) return;
  sdkInitialized = true;

  try {
    // O SDK lê window.chatwootSettings no init — precisa estar setado ANTES do run().
    if (settings) {
      window.chatwootSettings = settings;
    }

    const script = document.createElement("script");
    script.src = `${BASE_URL}/packs/js/sdk.js`;
    script.async = true;
    script.onload = () => {
      try {
        window.chatwootSDK?.run({ websiteToken, baseUrl: BASE_URL });
      } catch {
        /* SDK indisponível — segue sem chat, sem quebrar o app */
      }
    };
    document.body.appendChild(script);
  } catch {
    /* falha ao injetar — segue sem chat */
  }
}

export default function ChatwootWidget() {
  const { loading, isAuthenticated } = useAuth();
  // Acompanha o último estado de auth conhecido para detectar o logout no SPA.
  const wasAuthenticated = useRef(null);

  useEffect(() => {
    // Espera o auth resolver para escolher o inbox certo.
    if (loading) return;

    if (!sdkInitialized) {
      if (isAuthenticated) {
        initChatwoot(TOKEN_LOGADO, null); // atendimento ao usuário logado
      } else {
        initChatwoot(TOKEN_PUBLICO, {
          position: "right",
          type: "standard",
          launcherTitle: "Fale conosco no chat",
        });
      }
    } else if (wasAuthenticated.current === true && !isAuthenticated) {
      // Logout dentro do SPA: já carregado, só reinicia a conversa do widget.
      try {
        window.$chatwoot?.reset();
      } catch {
        /* sem efeito se o SDK não estiver pronto */
      }
    }

    wasAuthenticated.current = isAuthenticated;
  }, [loading, isAuthenticated]);

  return null;
}
