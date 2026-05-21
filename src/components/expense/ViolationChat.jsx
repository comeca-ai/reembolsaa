import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Paperclip, MessageSquare, FileText, X, Loader2 } from "lucide-react";
import { CURRENT_USER } from "@/lib/mockData";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ViolationChat({ expenseId }) {
  const [messages, setMessages] = useState([
    {
      id: "sys-1",
      role: "system",
      text: "Sua despesa foi sinalizada para análise de violação. Adicione comentários ou documentos adicionais para auxiliar o gestor na revisão.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const fileRef = React.useRef();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    // Pré-visualização local do anexo (upload real de comprovante: feature em breve).
    const file_url = URL.createObjectURL(file);
    setAttachedFile({ name: file.name, url: file_url });
    setUploading(false);
  };

  const handleSend = () => {
    if (!text.trim() && !attachedFile) return;
    const newMsg = {
      id: `m-${Date.now()}`,
      role: "user",
      author: CURRENT_USER.name,
      avatar: CURRENT_USER.avatar,
      text: text.trim(),
      file: attachedFile,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setText("");
    setAttachedFile(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-card border border-warning/20 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border bg-warning/5">
        <MessageSquare className="w-4 h-4 text-warning" />
        <div>
          <p className="text-sm font-medium text-foreground">Conversa da solicitação</p>
          <p className="text-[11px] text-muted-foreground">Adicione informações para o gestor revisar</p>
        </div>
      </div>

      {/* Messages */}
      <div className="px-5 py-4 space-y-3 max-h-64 overflow-y-auto">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={msg.role === "system" ? "flex justify-center" : "flex items-start gap-3"}
            >
              {msg.role === "system" ? (
                <p className="text-[11px] text-muted-foreground bg-secondary/60 rounded-lg px-3 py-2 text-center max-w-sm">
                  {msg.text}
                </p>
              ) : (
                <>
                  <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                    <span className="text-primary font-mono text-[10px] font-semibold">{msg.avatar}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-foreground">{msg.author}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {format(new Date(msg.timestamp), "dd/MM · HH:mm", { locale: ptBR })}
                      </span>
                    </div>
                    {msg.text && (
                      <p className="text-sm text-foreground bg-secondary/40 rounded-xl rounded-tl-sm px-3 py-2 leading-relaxed">
                        {msg.text}
                      </p>
                    )}
                    {msg.file && (
                      <a
                        href={msg.file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1.5 inline-flex items-center gap-2 bg-secondary/60 border border-border rounded-lg px-3 py-2 text-xs text-foreground hover:border-primary/30 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                        {msg.file.name}
                      </a>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Attached file preview */}
      {attachedFile && (
        <div className="mx-5 mb-2 flex items-center gap-2 bg-secondary/60 border border-border rounded-lg px-3 py-2 text-xs">
          <FileText className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="flex-1 truncate text-foreground">{attachedFile.name}</span>
          <button onClick={() => setAttachedFile(null)}>
            <X className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
          </button>
        </div>
      )}

      {/* Input */}
      <div className="px-5 py-3 border-t border-border flex items-end gap-2">
        <input type="file" ref={fileRef} onChange={handleFileChange} className="hidden" />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="shrink-0 w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
        >
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Paperclip className="w-3.5 h-3.5" />}
        </button>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Adicione um comentário ou justificativa..."
          rows={1}
          className="flex-1 bg-secondary/40 border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 resize-none leading-relaxed"
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() && !attachedFile}
          className="shrink-0 w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}