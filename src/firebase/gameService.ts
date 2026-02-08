'use client';
import { PlayerMove, PVPGameState } from '@/lib/types';
import { db } from './config';
import { collection, doc, onSnapshot, query, orderBy } from 'firebase/firestore';


export const listenToGame = (gameId: string, callback: (data: PVPGameState) => void) => {
    return onSnapshot(doc(db, 'games', gameId), (doc) => {
        if (doc.exists()) callback(doc.data() as PVPGameState);
    });
};

export const listenToMoves = (gameId: string, onUpdate: (moves: PlayerMove[]) => void) => {
    const movesRef = collection(db, "games", gameId, "moves");
    const q = query(movesRef, orderBy("createdAt", "asc"));

    return onSnapshot(q, (snapshot) => {
        const moves = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data()  } as PlayerMove));
        onUpdate(moves);
    })
}