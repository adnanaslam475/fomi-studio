"use client";

import { Sparkles, Square } from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { Button } from "@/components/ui/Button";

export function GenerateButton({ size = "md", block = false, afterClick, className }) {
  const { generation, runGenerate, cancelGenerate } = useWorkspace();
  const loading = generation.status === "loading";

  const handleGenerate = () => {
    runGenerate();
    afterClick?.();
  };

  if (loading) {
    return (
      <Button
        variant="soft"
        size={size}
        leftIcon={Square}
        onClick={cancelGenerate}
        aria-label="Stop generation"
        className={className}
      >
        Stop
      </Button>
    );
  }

  return (
    <Button
      variant="primary"
      size={size}
      leftIcon={Sparkles}
      onClick={handleGenerate}
      className={className}
      style={block ? { width: "100%" } : undefined}
    >
      Generate
    </Button>
  );
}
