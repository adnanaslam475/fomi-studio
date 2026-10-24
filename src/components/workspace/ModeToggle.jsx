"use client";

import { ImageIcon, Clapperboard } from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { Segmented } from "@/components/ui/Segmented";

const OPTIONS = [
  { value: "image", label: "Image", icon: ImageIcon },
  { value: "video", label: "Video", icon: Clapperboard },
];

export function ModeToggle({ size = "md", className }) {
  const { composer, setMode } = useWorkspace();
  return (
    <Segmented
      options={OPTIONS}
      value={composer.mode}
      onChange={setMode}
      ariaLabel="Generation mode"
      size={size}
      className={className}
    />
  );
}
