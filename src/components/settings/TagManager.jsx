import React, { useState } from "react";
import { Plus, X, Pencil, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TagManager({ title, description, icon: Icon, color = "primary", tags, onAdd, onRemove, onRename }) {
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const colorMap = {
    primary:     { bg: "bg-primary/10",     text: "text-primary",     border: "border-primary/20"     },
    warning:     { bg: "bg-warning/10",     text: "text-warning",     border: "border-warning/20"     },
    destructive: { bg: "bg-destructive/10", text: "text-destructive", border: "border-destructive/20" },
  };
  const c = colorMap[color] || colorMap.primary;

  const handleAdd = () => {
    const v = input.trim();
    if (!v || tags.some((t) => t.label.toLowerCase() === v.toLowerCase())) return;
    onAdd(v);
    setInput("");
  };

  const startEdit = (tag) => {
    setEditingId(tag.id);
    setEditValue(tag.label);
  };

  const commitEdit = (id) => {
    const v = editValue.trim();
    if (v) onRename(id, v);
    setEditingId(null);
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-4.5 h-4.5 ${c.text}`} style={{ width: 18, height: 18 }} />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
        <span className={`ml-auto text-xs font-mono px-2 py-0.5 rounded-full border ${c.bg} ${c.text} ${c.border}`}>
          {tags.length}
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 min-h-[40px]">
        <AnimatePresence>
          {tags.map((tag) => (
            <motion.div
              key={tag.id}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${c.bg} ${c.border} text-xs font-medium ${c.text}`}
            >
              {editingId === tag.id ? (
                <>
                  <input
                    autoFocus
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") commitEdit(tag.id); if (e.key === "Escape") setEditingId(null); }}
                    className="bg-transparent outline-none w-24 text-xs"
                  />
                  <button onClick={() => commitEdit(tag.id)} className="hover:opacity-70">
                    <Check className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <>
                  <span>{tag.label}</span>
                  <button onClick={() => startEdit(tag)} className="opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity">
                    <Pencil className="w-2.5 h-2.5" />
                  </button>
                  <button onClick={() => onRemove(tag.id)} className="opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity">
                    <X className="w-3 h-3" />
                  </button>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {tags.length === 0 && (
          <p className="text-xs text-muted-foreground italic">Nenhuma tag cadastrada ainda.</p>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
          placeholder={`Adicionar ${title.toLowerCase()}...`}
          className="flex-1 bg-secondary/40 border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40"
        />
        <button
          onClick={handleAdd}
          disabled={!input.trim()}
          className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}