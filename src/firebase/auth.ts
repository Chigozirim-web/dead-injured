'use client';

import { getAuth, signInAnonymously } from "firebase/auth";
import { app } from "./config"; // export app from config

export async function ensureAnonymAuth() {
  const auth = getAuth(app);
  if (!auth.currentUser) {
    try {
      await signInAnonymously(auth);
    } catch (error) {
        //const errorCode = (error as { code?: string }).code;
        console.error("Anonymous sign-in failed:", error);
        throw error;
    }
  }
  return auth.currentUser!.uid;
}
