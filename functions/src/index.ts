import * as admin from "firebase-admin";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onInit } from "firebase-functions/v2/core";
import {  isUniqueDigits, compareGuess } from "./gameLogic";
import { PVPGameState } from "./types";

//admin.initializeApp();
//const db = admin.firestore();

let db: admin.firestore.Firestore;

onInit(() => {
    admin.initializeApp();
    db = admin.firestore();
});

function requireAuth(request: any) {
  const uid = request.auth?.uid;
  if (!uid) throw new HttpsError("unauthenticated", "Auth required");
  return uid;
}

function assert(condition: any, code: HttpsError["code"], message: string) {
  if (!condition) throw new HttpsError(code, message);
}

function normalizeName(name: unknown) {
  assert(typeof name === "string", "invalid-argument", "Invalid name");
  const trimmed = (name as string).trim();
  assert(trimmed.length >= 1 && trimmed.length <= 20, "invalid-argument", "Name must be 1–20 chars");
  return trimmed;
}

function normalizeSecret(secret: unknown) {
  assert(typeof secret === "string", "invalid-argument", "Invalid secret");
  assert(isUniqueDigits(secret as string), "invalid-argument", "Secret must be 4 unique digits");
  return secret;
}

function normalizeGuess(guess: unknown) {
  assert(typeof guess === "string", "invalid-argument", "Invalid guess");
  assert(isUniqueDigits(guess as string), "invalid-argument", "Guess must be 4 unique digits");
  return guess;
}

function newGameId() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export const createGame = onCall(async (request) => {
  const uid = requireAuth(request);
  const name = normalizeName(request.data.name);
  const secret = normalizeSecret(request.data.secret);

  let gameId = newGameId();
  for (let i = 0; i < 10; i++) {
    const exists = (await db.doc(`games/${gameId}`).get()).exists;
    if (!exists) break;
    gameId = newGameId();
  }

  const gameRef = db.doc(`games/${gameId}`);
  const secretRef = db.doc(`games/${gameId}/secrets/${uid}`);

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(gameRef);
    assert(!snap.exists, "already-exists", "Game ID collision, retry");

    tx.set(gameRef, {
      player1: { id: uid, name },
      player2: null,
      status: "waiting",
      gameOver: false,
      winner: null,
      showOpponentGuess: false,
      currentTurn: uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    tx.set(secretRef, {
      secretNumber: secret,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

  return { gameId };
});

export const joinGame = onCall(async (request) => {
    const uid = requireAuth(request); 
    const gameId = String(request.data?.gameId || "").toUpperCase();
    const name = normalizeName(request.data.name);
    const secret = normalizeSecret(request.data.secret);

    const gameRef = db.doc(`games/${gameId}`);
    const secretRef = db.doc(`games/${gameId}/secrets/${uid}`);
    
    await db.runTransaction(async (tx) => {
        const snap = await tx.get(gameRef);
        assert(snap.exists, "not-found", "Game not found");

        const game = snap.data() as PVPGameState;
        assert(game.status === "waiting", "failed-precondition", "Game is not joinable");
        assert(game.player1.id !== uid, "failed-precondition", "You cannot join your own game");
        assert(!game.player2, "failed-precondition", "Game is full");

        tx.update(gameRef, {
          player2: { id: uid, name },
          status: "playing",
        });

        tx.set(secretRef, {
            secretNumber: secret,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
    });
    return { ok: true };
});

export const submitGuess = onCall(async (request) => {
    const uid = requireAuth(request);
    const gameId = String(request.data?.gameId || "").toUpperCase();
    const guess = normalizeGuess(request.data?.guess);

    const gameRef = db.doc(`games/${gameId}`);
    const movesRef = db.collection(`games/${gameId}/moves`);

    await db.runTransaction(async (tx) => {
        const snap = await tx.get(gameRef);
        assert(snap.exists, "not-found", "Game not found");

        const game = snap.data() as PVPGameState;
        assert(game.status === "playing", "failed-precondition", "Game is not active");
        assert(!game.gameOver, "failed-precondition", "Game is over");
        assert(game.currentTurn === uid, "permission-denied", "Not your turn");
        
        const opponentId = game.player1.id === uid ? game.player2?.id : game.player1.id;
        assert(opponentId, "failed-precondition", "Opponent not found");

        // --- READS FIRST (Firestore transactions require all reads before any writes) ---
        const opponentSecretRef = db.doc(`games/${gameId}/secrets/${opponentId}`);
        const winnerSecretRef = db.doc(`games/${gameId}/secrets/${uid}`);

        const opponentSecretSnap = await tx.get(opponentSecretRef);
        assert(opponentSecretSnap.exists, "failed-precondition", "Opponent's secret not found");

        const opponentSecret = (opponentSecretSnap.data() as any).secretNumber as string;

        //Read secret first before any writes (tx.set or tx.update) to satisfy Firestore transaction requirements. 
        const winnerSecretSnap = await tx.get(winnerSecretRef);
        assert(winnerSecretSnap.exists, "failed-precondition", "Winner secret missing");
        const winnerSecret = (winnerSecretSnap.data() as any).secretNumber as string;

        const result = compareGuess(opponentSecret, guess as string);

        const moveDoc = movesRef.doc();
        tx.set(moveDoc, {
            playerId: uid,
            guess,
            result,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // show opponent guess to other player
        tx.update(gameRef, { showOpponentGuess: true });

        // win condition handled server-side
        if (result.dead === 4) {
            const winnerUid = uid;

            tx.update(gameRef, {
                gameOver: true,
                winner: winnerUid,
                revealedSecret: winnerSecret,
                status: "finished",
                showOpponentGuess: false,
            });
        }
    });

  return { ok: true };
});

export const toggleTurn = onCall(async (request) => {
    const uid = requireAuth(request);
    const gameId = String(request.data.gameId || "").toUpperCase();

    const gameRef = db.doc(`games/${gameId}`);

    await db.runTransaction(async (tx) => {
        const gameSnap = await tx.get(gameRef);
        assert(gameSnap.exists, "not-found", "Game not found");

        const game = gameSnap.data() as PVPGameState;
        assert(game.status === "playing", "failed-precondition", "Game not in playing state");
        assert(!game.gameOver, "failed-precondition", "Game already finished");
        assert(game.currentTurn === uid, "permission-denied", "Not your turn");

        const p1 = game.player1?.id;
        const p2 = game.player2?.id;
        assert(p1 && p2, "failed-precondition", "Game not ready");

        const nextTurn = uid === p1 ? p2 : p1;

        tx.update(gameRef, {
            currentTurn: nextTurn,
            showOpponentGuess: false,
        });
    });

  return { ok: true };
});