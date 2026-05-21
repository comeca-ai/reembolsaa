import React, { useState, useCallback } from "react";
import { Shield } from "lucide-react";
import { motion } from "framer-motion";
import { EXTRACTED_RULES, VERSION_HISTORY } from "@/lib/mockData";
import { base44 } from "@/api/base44Client";

const N8N_WEBHOOK = "https://workflows.oreembolsobot.app/webhook-test/01772137-eb84-4ed4-a308-d5dfe1eb06f2";

import EmptyState from "@/components/policy/EmptyState";
import UploadingState from "@/components/policy/UploadingState";
import ExtractingState from "@/components/policy/ExtractingState";
import ReviewState from "@/components/policy/ReviewState";
import ActiveState from "@/components/policy/ActiveState";
import VersionHistory from "@/components/policy/VersionHistory";
import DevToolbar from "@/components/policy/DevToolbar";

export default function PolicyPage() {
  const [screenState, setScreenState] = useState("empty");
  const [fileName, setFileName] = useState("politica_2026.pdf");
  const [rules, setRules] = useState([]);
  const [currentVersion, setCurrentVersion] = useState(3);
  const [versions, setVersions] = useState(VERSION_HISTORY);

  const handleFileSelected = useCallback(async (file) => {
    setFileName(file.name);
    setScreenState("uploading");

    // Upload to base44 storage first, then send URL to n8n
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
      // Send to n8n webhook as JSON with the file URL
      await fetch(N8N_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file_url, file_name: file.name }),
      });
    } catch (err) {
      console.error("Erro ao enviar para n8n:", err);
    }
  }, []);

  const handleUploadComplete = useCallback(() => {
    setScreenState("extracting");
  }, []);

  const handleExtractionComplete = useCallback(() => {
    setRules([...EXTRACTED_RULES]);
    setScreenState("review");
  }, []);

  const handleActivate = useCallback(() => {
    setVersions((prev) =>
      prev.map((v) =>
        v.version === currentVersion
          ? { ...v, status: "active" }
          : v.status === "active"
            ? { ...v, status: "archived" }
            : v
      )
    );
    setScreenState("active");
  }, [currentVersion]);

  const handleNewVersion = useCallback(() => {
    const nextVersion = currentVersion + 1;
    setCurrentVersion(nextVersion);
    setVersions((prev) => [
      {
        id: `p-${String(nextVersion).padStart(3, "0")}`,
        version: nextVersion,
        status: "draft",
        file_name: "",
        uploaded_by: "Mariana Costa",
        created_at: new Date().toISOString(),
        rules_count: 0,
      },
      ...prev.map((v) => (v.status === "active" ? { ...v, status: "archived" } : v)),
    ]);
    setRules([]);
    setScreenState("empty");
  }, [currentVersion]);

  // Dev toolbar state override
  const handleDevStateChange = useCallback((state) => {
    if (state === "review" && rules.length === 0) {
      setRules([...EXTRACTED_RULES]);
    }
    setScreenState(state);
  }, [rules.length]);

  const showVersionHistory = screenState === "review" || screenState === "active";

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 md:mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <h1 className="font-heading text-foreground text-2xl md:text-3xl">
              Política da empresa
            </h1>
          </div>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl ml-[52px]">
            Suba o PDF da sua política de reembolso. A IA transforma o documento em regras
            estruturadas, aplicadas automaticamente a cada despesa.
          </p>
        </motion.div>

        {/* Content by state */}
        {screenState === "empty" && (
          <EmptyState onFileSelected={handleFileSelected} />
        )}

        {screenState === "uploading" && (
          <UploadingState fileName={fileName} onComplete={handleUploadComplete} />
        )}

        {screenState === "extracting" && (
          <ExtractingState fileName={fileName} onComplete={handleExtractionComplete} />
        )}

        {screenState === "review" && (
          <ReviewState
            rules={rules}
            setRules={setRules}
            fileName={fileName}
            version={currentVersion}
            onActivate={handleActivate}
          />
        )}

        {screenState === "active" && (
          <ActiveState
            rules={rules}
            fileName={fileName}
            version={currentVersion}
            onNewVersion={handleNewVersion}
          />
        )}

        {/* Version history */}
        {showVersionHistory && (
          <div className="mt-10">
            <VersionHistory versions={versions} />
          </div>
        )}
      </div>

      {/* Dev toolbar */}
      <DevToolbar currentState={screenState} onStateChange={handleDevStateChange} />
    </div>
  );
}