"use client";

import { Images, Headphones, MoreHorizontal, Zap } from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { BrandLogo } from "./BrandLogo";
import { NavRail } from "./NavRail";
import { TopProgress } from "./TopProgress";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";

export function TopBar() {
  const { pushToast } = useWorkspace();

  return (
    <header className="sticky top-0 z-40">
      <div className="relative border-b border-line/70 bg-[color:var(--color-canvas)]/80 backdrop-blur-md">
        <TopProgress />
        <div className="mx-auto flex h-16 max-w-[1700px] items-center gap-3 px-4 sm:px-6 lg:px-8">
          <BrandLogo />

          <NavRail className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block" />

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => pushToast("You have 120 credits left")}
              className="hidden items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-[13px] font-semibold text-ink shadow-xs transition-colors hover:border-line-2 hover:bg-surface-2 sm:inline-flex"
            >
              <Zap className="size-4 text-coral-700" aria-hidden="true" />
              <span className="nums">120</span>
              <span className="text-ink-3">credits</span>
            </button>

            <div className="hidden items-center gap-1 lg:flex">
              <Button
                variant="ghost"
                size="sm"
                leftIcon={Images}
                onClick={() => pushToast("Gallery — coming soon")}
              >
                Gallery
              </Button>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={Headphones}
                onClick={() => pushToast("Support — coming soon")}
              >
                Support
              </Button>
            </div>

            <IconButton
              icon={MoreHorizontal}
              label="More"
              variant="dark"
              onClick={() => pushToast("More options — coming soon")}
            />

            <button
              type="button"
              aria-label="Your account"
              onClick={() => pushToast("Signed in as Studio")}
              className="grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold text-ink-inv shadow-sm transition-transform active:scale-90 bg-[linear-gradient(145deg,#8a6a52,#5f4636)]"
            >
              A
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
