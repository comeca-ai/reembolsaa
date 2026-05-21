import React, { useState } from "react";
import { Bug, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const STATES = ["empty", "uploading", "extracting", "review", "active"];

const STATE_LABELS = {
  empty: "Empty",
  uploading: "Uploading",
  extracting: "Extracting",
  review: "Review",
  active: "Active",
};

export default function DevToolbar({ currentState, onStateChange }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-between gap-3 px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <div className="flex items-center gap-1.5">
            <Bug className="w-3 h-3" />
            <span className="font-mono">DEV</span>
          </div>
          {collapsed ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {!collapsed && (
          <div className="px-2 pb-2 flex flex-col gap-1">
            {STATES.map((state) => (
              <Button
                key={state}
                variant={currentState === state ? "default" : "ghost"}
                size="sm"
                className={`text-xs justify-start h-7 font-mono ${
                  currentState === state ? "" : "text-muted-foreground"
                }`}
                onClick={() => onStateChange(state)}
              >
                {STATE_LABELS[state]}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}