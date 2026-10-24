"use client";

import { Home, ImageIcon, Clapperboard, Wand2, Sparkles } from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { IconButton } from "@/components/ui/IconButton";

/**
 * Center tool rail. Image/Video switch the composer mode; the rest are other
 * tools in the suite (acknowledged with a toast for this build).
 */
export function NavRail({ className }) {
  const { composer, setMode, pushToast } = useWorkspace();

  const items = [
    { id: "home", label: "Home", icon: Home, onClick: () => pushToast("Home — coming soon") },
    {
      id: "image",
      label: "Image",
      icon: ImageIcon,
      active: composer.mode === "image",
      onClick: () => setMode("image"),
    },
    {
      id: "video",
      label: "Video",
      icon: Clapperboard,
      active: composer.mode === "video",
      onClick: () => setMode("video"),
    },
    { id: "edit", label: "Edit", icon: Wand2, onClick: () => pushToast("Editor — coming soon") },
    { id: "upscale", label: "Upscale", icon: Sparkles, onClick: () => pushToast("Upscaler — coming soon") },
  ];

  return (
    <nav aria-label="Tools" className={className}>
      <ul className="flex items-center gap-1 rounded-full border border-line bg-surface/70 p-1 shadow-xs backdrop-blur-sm">
        {items.map((item) => (
          <li key={item.id}>
            <IconButton
              icon={item.icon}
              label={item.label}
              active={item.active}
              onClick={item.onClick}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
