"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { fetchCatalog, fetchHistory, generate } from "@/lib/api-client";
import { ADVANCED_DEFAULTS, SAMPLE_PROMPTS } from "@/data/catalog";
import { clamp } from "@/lib/utils";

const WorkspaceContext = createContext(null);

const DEFAULT_COMPOSER = {
  prompt: "",
  mode: "image", // "image" | "video"
  count: 4,
  ratio: "4:5",
  modelId: "lumen-2",
  styleIds: [],
  advanced: { ...ADVANCED_DEFAULTS },
};

let toastId = 0;

export function WorkspaceProvider({ children }) {
  // ---- Catalog ---------------------------------------------------------
  const [catalog, setCatalog] = useState(null);
  const [catalogStatus, setCatalogStatus] = useState("loading");

  // ---- Composer --------------------------------------------------------
  const [composer, setComposer] = useState(DEFAULT_COMPOSER);
  const composerRef = useRef(composer);
  useEffect(() => {
    composerRef.current = composer;
  }, [composer]);

  // ---- Generation state machine ---------------------------------------
  const [generation, setGeneration] = useState({
    status: "idle", // idle | loading | success | error
    current: null,
    error: null,
    pendingCount: 4,
    pendingRatio: "4:5",
  });
  const [progress, setProgress] = useState(0);

  // ---- History ---------------------------------------------------------
  const [history, setHistory] = useState([]);
  const [historyStatus, setHistoryStatus] = useState("loading");

  // ---- Toasts ----------------------------------------------------------
  const [toasts, setToasts] = useState([]);
  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);
  const pushToast = useCallback(
    (message, tone = "default") => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { id, message, tone }]);
      setTimeout(() => dismissToast(id), 2800);
    },
    [dismissToast],
  );

  // Timers / abort refs
  const abortRef = useRef(null);
  const progressTimer = useRef(null);
  const progressReset = useRef(null);

  const clearProgressTimers = () => {
    clearInterval(progressTimer.current);
    clearTimeout(progressReset.current);
  };

  // ---- Initial data ----------------------------------------------------
  useEffect(() => {
    const ctrl = new AbortController();
    fetchCatalog(ctrl.signal)
      .then((data) => {
        setCatalog(data);
        setCatalogStatus("ready");
      })
      .catch((err) => {
        if (err.name !== "AbortError") setCatalogStatus("error");
      });

    fetchHistory(ctrl.signal)
      .then((items) => {
        setHistory(items);
        setHistoryStatus("ready");
        // Returning user: surface the most recent generation instead of an
        // empty canvas (matches the "continue an existing project" assumption).
        setGeneration((prev) =>
          prev.current || prev.status !== "idle" || !items[0]
            ? prev
            : {
                status: "success",
                current: items[0],
                error: null,
                pendingCount: items[0].assets.length,
                pendingRatio: items[0].ratio,
              },
        );
      })
      .catch((err) => {
        if (err.name !== "AbortError") setHistoryStatus("error");
      });

    return () => ctrl.abort();
  }, []);

  useEffect(() => () => clearProgressTimers(), []);

  // ---- Composer actions -----------------------------------------------
  const updateComposer = useCallback((patch) => {
    setComposer((prev) => ({ ...prev, ...patch }));
  }, []);

  const updateAdvanced = useCallback((patch) => {
    setComposer((prev) => ({
      ...prev,
      advanced: { ...prev.advanced, ...patch },
    }));
  }, []);

  const setMode = useCallback((mode) => {
    setComposer((prev) => {
      if (prev.mode === mode) return prev;
      if (mode === "video") {
        return {
          ...prev,
          mode,
          modelId: "motion-1",
          ratio: "16:9",
          count: Math.min(prev.count, 4),
        };
      }
      // back to image — leave a video-only model behind
      return {
        ...prev,
        mode,
        modelId: prev.modelId === "motion-1" ? "lumen-2" : prev.modelId,
        ratio: prev.ratio === "16:9" ? "4:5" : prev.ratio,
      };
    });
  }, []);

  const toggleStyle = useCallback((id) => {
    setComposer((prev) => {
      if (id === "none") return { ...prev, styleIds: [] };
      const has = prev.styleIds.includes(id);
      const styleIds = has
        ? prev.styleIds.filter((s) => s !== id)
        : [...prev.styleIds, id];
      return { ...prev, styleIds };
    });
  }, []);

  const surpriseMe = useCallback(() => {
    const prompt =
      SAMPLE_PROMPTS[Math.floor(Math.random() * SAMPLE_PROMPTS.length)];
    setComposer((prev) => ({ ...prev, prompt }));
  }, []);

  // ---- Progress simulation --------------------------------------------
  const startProgress = useCallback(() => {
    clearProgressTimers();
    setProgress(8);
    progressTimer.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 92) return p;
        const step = Math.max(0.6, (92 - p) * 0.08);
        return Math.min(92, p + step);
      });
    }, 180);
  }, []);

  const finishProgress = useCallback(() => {
    clearProgressTimers();
    setProgress(100);
    progressReset.current = setTimeout(() => setProgress(0), 650);
  }, []);

  // ---- Generate --------------------------------------------------------
  const runGenerate = useCallback(
    async (overrides = {}) => {
      const current = { ...composerRef.current, ...overrides };
      if (!current.prompt.trim()) {
        pushToast("Describe what you'd like to create first.", "warn");
        return;
      }

      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;

      const pendingCount =
        current.mode === "video"
          ? Math.min(current.count, 4)
          : clamp(current.count, 1, 8);

      setGeneration((prev) => ({
        ...prev,
        status: "loading",
        error: null,
        pendingCount,
        pendingRatio: current.mode === "video" ? "16:9" : current.ratio,
      }));
      startProgress();

      try {
        const result = await generate(
          {
            prompt: current.prompt,
            mode: current.mode,
            count: current.count,
            ratio: current.ratio,
            modelId: current.modelId,
            styleIds: current.styleIds,
            advanced: current.advanced,
            _forceError: current._forceError,
          },
          ctrl.signal,
        );
        finishProgress();
        setGeneration({
          status: "success",
          current: result,
          error: null,
          pendingCount,
          pendingRatio: current.ratio,
        });
        setHistory((prev) => [result, ...prev]);
      } catch (err) {
        if (err.name === "AbortError") return; // user cancelled
        clearProgressTimers();
        setProgress(0);
        setGeneration((prev) => ({
          ...prev,
          status: "error",
          error: err.message || "Something went wrong. Please try again.",
        }));
      }
    },
    [pushToast, startProgress, finishProgress],
  );

  const cancelGenerate = useCallback(() => {
    abortRef.current?.abort();
    clearProgressTimers();
    setProgress(0);
    setGeneration((prev) => ({ ...prev, status: "idle" }));
  }, []);

  const retryGenerate = useCallback(() => runGenerate(), [runGenerate]);

  // ---- History / asset actions ----------------------------------------
  const loadFromHistory = useCallback((gen) => {
    setGeneration({
      status: "success",
      current: gen,
      error: null,
      pendingCount: gen.assets.length,
      pendingRatio: gen.ratio,
    });
    setComposer((prev) => ({
      ...prev,
      prompt: gen.prompt,
      mode: gen.mode,
      ratio: gen.ratio,
      modelId: gen.modelId,
    }));
  }, []);

  const toggleFavorite = useCallback(
    (assetId) => {
      const flip = (gen) =>
        !gen
          ? gen
          : {
              ...gen,
              assets: gen.assets.map((a) =>
                a.id === assetId ? { ...a, favorite: !a.favorite } : a,
              ),
            };
      let didFavorite = false;
      setGeneration((prev) => {
        if (!prev.current) return prev;
        const found = prev.current.assets.find((a) => a.id === assetId);
        if (found) didFavorite = !found.favorite;
        return { ...prev, current: flip(prev.current) };
      });
      setHistory((prev) => prev.map(flip));
      pushToast(didFavorite ? "Added to favorites" : "Removed from favorites");
    },
    [pushToast],
  );

  const value = useMemo(
    () => ({
      catalog,
      catalogStatus,
      composer,
      updateComposer,
      updateAdvanced,
      setMode,
      toggleStyle,
      surpriseMe,
      generation,
      progress,
      runGenerate,
      cancelGenerate,
      retryGenerate,
      history,
      historyStatus,
      loadFromHistory,
      toggleFavorite,
      toasts,
      pushToast,
      dismissToast,
    }),
    [
      catalog,
      catalogStatus,
      composer,
      updateComposer,
      updateAdvanced,
      setMode,
      toggleStyle,
      surpriseMe,
      generation,
      progress,
      runGenerate,
      cancelGenerate,
      retryGenerate,
      history,
      historyStatus,
      loadFromHistory,
      toggleFavorite,
      toasts,
      pushToast,
      dismissToast,
    ],
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return ctx;
}
