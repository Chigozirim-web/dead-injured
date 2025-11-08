'use client';
import { useEffect, useRef, useState, useCallback } from "react";

type Feedback = { dead: number; injured: number };

type MsgIn =
  | { type: "init" }
  | { type: "guess"; isFirstGuess: boolean }
  | { type: "update"; guess: string; feedback: Feedback }
  | { type: "reset" };

type MsgOut =
  | { type: "ready" }
  | { type: "guess"; value: string }
  | { type: "updated" }
  | { type: "reset" }
  | { type: "log"; value: unknown[] }
  | { type: "error"; message: string };

export function useKnuthWorker() {
  const workerRef = useRef<Worker | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Only on client
    if (typeof window === "undefined") return;

    const w = new Worker(new URL("@/workers/knuthWorker.ts", import.meta.url));
    workerRef.current = w;

    w.onmessage = (e: MessageEvent<MsgOut>) => {
      const m = e.data;
      if (m.type === "log") {
        // forward worker logs to main console
        // eslint-disable-next-line no-console
        console.log("[KnuthWorker]", ...m.value);
        return;
      }
      if (m.type === "ready") setReady(true);
    };

    w.postMessage({ type: "init" } satisfies MsgIn);

    return () => {
      w.terminate();
      workerRef.current = null;
      setReady(false);
    };
  }, []);

  // Promise helpers
  const getNextGuess = useCallback(
    (isFirst: boolean) =>
      new Promise<string>((resolve, reject) => {
        const w = workerRef.current;
        if (!w) return reject(new Error("Worker not initialized"));

        const handler = (e: MessageEvent<MsgOut>) => {
          if (e.data.type === "guess") {
            w.removeEventListener("message", handler);
            resolve(e.data.value);
          } else if (e.data.type === "error") {
            w.removeEventListener("message", handler);
            reject(new Error(e.data.message));
          }
        };
        w.addEventListener("message", handler);
        w.postMessage({ type: "guess", isFirstGuess: isFirst } satisfies MsgIn);
      }),
    []
  );

  const updateByFeedback = useCallback((guess: string, fb: Feedback) => {
    workerRef.current?.postMessage({ type: "update", guess, feedback: fb } as MsgIn);
  }, []);

  const reset = useCallback(() => {
    workerRef.current?.postMessage({ type: "reset" } as MsgIn);
  }, []);

  return { ready, getNextGuess, updateByFeedback, reset };
}
