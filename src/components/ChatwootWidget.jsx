import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

// Widget de chat (Chatwoot) com inbox por contexto de autenticação.
//
// - Deslogado (landing/cadastro) → inbox PÚBLICO ("Fale conosco no chat").
// - Logado (app autenticado)     → inbox de ATENDIMENTO ao usuário logado.
// - Rotas em SEM_WIDGET (ex.: /login) → não aparece.
//
// Nunca carregamos os dois tokens na mesma página: o SDK é injetado UMA única vez
// por carga, com o token certo conforme o estado de auth quando ele resolve. A
// visibilidade da bolha é ajustada por rota (esconde no /login).
// Cada inbox vive em uma instância de Chatwoot diferente:
// - Público (landing) → instância nova em atendimento.oreembolsobot.app
// - Logado (atendimento) → instância antiga no Railway
const BASE_URL_PUBLICO = "https://atendimento.oreembolsobot.app";
const BASE_URL_LOGADO = "https://chatwoot-production-1e1f.up.railway.app";

const TOKEN_PUBLICO = "eiWrqkST7i3QpmDg5BbXNQiy";  // deslogado (público)
const TOKEN_LOGADO = "xbc97LYPu1mLoxNeeEiLkUei";   // logado (atendimento)

// Rotas onde o chat NÃO deve aparecer.
const SEM_WIDGET = ["/login"];
const ocultarNaRota = (path) => SEM_WIDGET.some((p) => path === p || path.startsWith(p + "/"));

// Módulo-nível (não ref): garante "uma vez por carga de página" mesmo com o
// double-mount do StrictMode em dev.
let sdkInitialized = false;

function initChatwoot(websiteToken, baseUrl, settings) {
  if (sdkInitialized) return;
  sdkInitialized = true;

  try {
    // O SDK lê window.chatwootSettings no init — precisa estar setado ANTES do run().
    if (settings) {
      window.chatwootSettings = settings;
    }

    const script = document.createElement("script");
    script.src = `${baseUrl}/packs/js/sdk.js`;
    script.async = true;
    script.onload = () => {
      try {
        window.chatwootSDK?.run({ websiteToken, baseUrl });
      } catch {
        /* SDK indisponível — segue sem chat, sem quebrar o app */
      }
    };
    document.body.appendChild(script);
  } catch {
    /* falha ao injetar — segue sem chat */
  }
}

function setBubbleVisible(visible) {
  try {
    window.$chatwoot?.toggleBubbleVisibility?.(visible ? "show" : "hide");
  } catch {
    /* sem efeito se o SDK não estiver pronto */
  }
}

export default function ChatwootWidget() {
  const { loading, isAuthenticated } = useAuth();
  const { pathname } = useLocation();
  // Acompanha o último estado de auth conhecido para detectar o logout no SPA.
  const wasAuthenticated = useRef(null);

  useEffect(() => {
    // Espera o auth resolver para escolher o inbox certo.
    if (loading) return;
    const oculto = ocultarNaRota(pathname);

    if (!sdkInitialized) {
      // Não carrega o script numa rota proibida (ex.: /login). Quando o usuário
      // sair dela (navegação no SPA), o efeito roda de novo e injeta.
      if (oculto) return;
      if (isAuthenticated) {
        initChatwoot(TOKEN_LOGADO, BASE_URL_LOGADO, null); // atendimento ao usuário logado
      } else {
        initChatwoot(TOKEN_PUBLICO, BASE_URL_PUBLICO, {
          position: "right",
          type: "standard",
          launcherTitle: "Fale conosco no chat",
        });
      }
    } else {
      // Já carregado: esconde/mostra a bolha conforme a rota.
      setBubbleVisible(!oculto);
      // Logout dentro do SPA: reinicia a conversa do widget.
      if (wasAuthenticated.current === true && !isAuthenticated) {
        try {
          window.$chatwoot?.reset();
        } catch {
          /* sem efeito se o SDK não estiver pronto */
        }
      }
    }

    wasAuthenticated.current = isAuthenticated;
  }, [loading, isAuthenticated, pathname]);

  return null;
}
