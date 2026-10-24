"use client";

import { TopBar } from "./TopBar";
import { HistoryStrip } from "./HistoryStrip";
import { Composer } from "./Composer";
import { ResultDetails } from "./ResultDetails";
import { ResultsArea } from "./ResultsArea";
import { MobileComposer } from "./MobileComposer";
import { Toasts } from "@/components/ui/Toasts";

export function Workspace() {
  return (
    <div className="flex min-h-dvh flex-col overflow-x-clip">
      <TopBar />
      <HistoryStrip />

      <main className="mx-auto w-full min-w-0 max-w-[1700px] flex-1 px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-12">
        <div className="lg:grid lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-5 xl:grid-cols-[336px_212px_minmax(0,1fr)]">
          {/* Composer — tablet & desktop */}
          <div className="hidden lg:block">
            <Composer className="scroll-thin sticky top-[76px] max-h-[calc(100dvh-92px)] overflow-y-auto pr-1" />
          </div>

          {/* Prompt details — wide desktop only */}
          <div className="hidden xl:block">
            <ResultDetails
              layout="column"
              className="sticky top-[76px] max-h-[calc(100dvh-92px)]"
            />
          </div>

          {/* Results — always visible */}
          <section aria-label="Results" className="min-w-0">
            <ResultDetails layout="bar" className="mb-4 xl:hidden" />
            <ResultsArea />
          </section>
        </div>
      </main>

      <MobileComposer />
      <Toasts />
    </div>
  );
}
