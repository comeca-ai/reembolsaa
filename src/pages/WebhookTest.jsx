import React, { useEffect, useState } from "react";

const FILE_URL = "https://media.base44.com/files/public/6a0e7a7ba2f3e7202ba94ab4/ce5642c19_POLITICADEDESPESASEREEMBOLSO.pdf";
const FILE_NAME = "POLITICADEDESPESASEREEMBOLSO.pdf";
const WEBHOOK = "https://webhooks.oreembolsobot.app/webhook/01772137-eb84-4ed4-a308-d5dfe1eb06f2";

export default function WebhookTest() {
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [response, setResponse] = useState(null);

  const sendWebhook = async () => {
    setStatus("sending");
    setResponse(null);
    const res = await fetch(WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file_url: FILE_URL, file_name: FILE_NAME }),
    });
    const text = await res.text();
    setResponse(text);
    setStatus(res.ok ? "success" : "error");
  };

  useEffect(() => {
    sendWebhook();
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="bg-card border border-border rounded-xl p-8 max-w-lg w-full space-y-4">
        <h1 className="font-heading text-xl text-foreground">Teste Webhook n8n</h1>

        <div className="bg-secondary/50 rounded-lg p-3 text-xs font-mono break-all space-y-1">
          <p className="text-muted-foreground">file_url:</p>
          <p className="text-foreground">{FILE_URL}</p>
          <p className="text-muted-foreground mt-2">file_name:</p>
          <p className="text-foreground">{FILE_NAME}</p>
        </div>

        <div className={`rounded-lg px-4 py-3 text-sm font-medium ${
          status === "sending" ? "bg-warning/10 text-warning" :
          status === "success" ? "bg-primary/10 text-primary" :
          status === "error" ? "bg-destructive/10 text-destructive" :
          "bg-secondary text-muted-foreground"
        }`}>
          {status === "sending" && "⏳ Enviando para o webhook..."}
          {status === "success" && "✓ Enviado com sucesso!"}
          {status === "error" && "✗ Erro ao enviar"}
          {status === "idle" && "Aguardando..."}
        </div>

        {response && (
          <div className="bg-secondary/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Resposta do n8n:</p>
            <pre className="text-xs text-foreground whitespace-pre-wrap break-all">{response}</pre>
          </div>
        )}

        <button
          onClick={sendWebhook}
          className="w-full bg-primary text-primary-foreground font-medium py-2.5 rounded-lg text-sm hover:bg-primary/90 transition-colors"
        >
          Reenviar
        </button>
      </div>
    </div>
  );
}