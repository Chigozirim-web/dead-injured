// Tell TS we’re in a worker
export {};

import { Feedback } from "@/lib/types";
import { compareGuess } from "@/lib/logic";

// ==== message contracts ====
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

// ==== util: forward logs to main thread ====
//const log = (...args: unknown[]) => postMessage({ type: "log", value: args });

// ==== game helpers (same rules as your app) ====
function generateAllPossibleGuesses(): string[] {
  const out: string[] = [];
  for (let a = 0; a <= 9; a++)
    for (let b = 0; b <= 9; b++)
      if (b !== a)
        for (let c = 0; c <= 9; c++)
          if (c !== a && c !== b)
            for (let d = 0; d <= 9; d++)
              if (d !== a && d !== b && d !== c)
                out.push(`${a}${b}${c}${d}`);
  return out;
}

// ==== Knuth solver state ====
let ALL: string[] = [];
let S: string[] = [];           // remaining candidates
let lastGuess = "";             // last guess we emitted

function minimaxNextGuess(): string {
  if (S.length === 1) return S[0];

  let best = S[0];
  let minWorst = Infinity;

  // Consider *all* codes as guesses (classic Knuth),
  // tie-breaker prefers guesses that are still in S.
  for (const g of ALL) {
    const bucket = new Map<string, number>();
    for (const s of S) {
      const fb = compareGuess(s, g);      // NOTE: (secret=s, guess=g)
      const key = `${fb.dead}-${fb.injured}`;
      bucket.set(key, (bucket.get(key) || 0) + 1);
    }
    const worst = Math.max(...bucket.values());
    const inS = S.includes(g);
    if (
      worst < minWorst ||
      (worst === minWorst && inS && !S.includes(best))
    ) {
      minWorst = worst;
      best = g;
    }
  }
  return best;
}

function applyFeedback(guess: string, fb: Feedback) {
  S = S.filter((s) => {
    const f = compareGuess(s, guess);
    return f.dead === fb.dead && f.injured === fb.injured;
  });
}

// ==== worker lifecycle ====
self.onmessage = (ev: MessageEvent<MsgIn>) => {
  try {
    const msg = ev.data;

    if (msg.type === "init") {
      ALL = generateAllPossibleGuesses();
      S = [...ALL];
      lastGuess = "";
      postMessage({ type: "ready" } as MsgOut);
      return;
    }

    if (msg.type === "reset") {
      S = [...ALL];
      lastGuess = "";
      postMessage({ type: "reset" } as MsgOut);
      return;
    }

    if (msg.type === "update") {
      applyFeedback(msg.guess, msg.feedback);
      postMessage({ type: "updated" } as MsgOut);
      return;
    }

    if (msg.type === "guess") {
      const next =
        msg.isFirstGuess && lastGuess === "" ? "0123" : minimaxNextGuess();
      lastGuess = next;
      postMessage({ type: "guess", value: next } as MsgOut);
      return;
    }
  } catch (e: unknown) {
    const errorMsg = e instanceof Error ? e.message : String(e);
    postMessage({type: "error", message: errorMsg } as MsgOut);
  }
};
