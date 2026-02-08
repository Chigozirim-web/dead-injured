'use client';

import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";
import { app } from "./config";
import { ensureAnonymAuth } from "./auth";

const functions = getFunctions(app);

export async function createGameFn(name: string, secret: string) {
  await ensureAnonymAuth();
  const fn = httpsCallable(functions, "createGame");
  const res = await fn({ name, secret });
  const data = res.data as { gameId: string };
  return data.gameId;
}

export async function joinGameFn(gameId: string, name: string, secret: string) {
  await ensureAnonymAuth();
  const fn = httpsCallable(functions, "joinGame");
  await fn({ gameId, name, secret });
}

export async function submitGuessFn(gameId: string, guess: string) {
  await ensureAnonymAuth();
  const fn = httpsCallable(functions, "submitGuess");
  await fn({ gameId, guess });
}

export async function toggleTurnFn(gameId: string) {
  await ensureAnonymAuth();
  const fn = httpsCallable(functions, "toggleTurn");
  await fn({ gameId });
}

if(process.env.NODE_ENV === "development") {
  connectFunctionsEmulator(functions, "localhost", 3000);
}