import { PlayerMove, PVPGameState } from '@/lib/types';
import { db } from './config';
import { collection, doc, setDoc, updateDoc, getDoc, onSnapshot, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';


export const createGame = async (player1Name: string, player1Secret: string) => {
    const gameId = uuidv4().slice(0, 6).toUpperCase();
    const playerId = uuidv4();
    
    const gamesRef = collection(db, "games");

    const gameProps: PVPGameState = {
        player1: { 
            id: playerId,
            name: player1Name,
            secretNumber: player1Secret,
        },
        player2: null,
        status: 'waiting',
        gameOver: false,
        showOpponentGuess: false, // Optional, if you want to show results immediately after guess
        currentTurn: playerId, //player starts for now BUT➡️ TODO: Implement logic for players to decide who starts, like rolling a dice etc.
        createdAt: new Date(),
    }

    await setDoc(doc(gamesRef, gameId), gameProps);
    localStorage.setItem("myPlayerId", playerId);

    return gameId;
};

export const joinGame = async (gameId: string, name: string, secret: string) => {
    const ref = doc(db, 'games', gameId);
    const snap = await getDoc(ref);

    if (!snap.exists()) throw new Error('Game not found\n. Make sure the code is entered correctly');
    if (snap.data().player2) throw new Error('Game is full');

    /*const storedPlayerId = localStorage.getItem("myPlayerId");
    if (storedPlayerId) {
        throw new Error('You have already joined this game');
    }*/

    const myPlayerId = uuidv4();

    await updateDoc(ref, {
        player2: { id: myPlayerId, name: name, secretNumber: secret, isThinking: false },
        status: 'playing',
    });

    localStorage.setItem("myPlayerId", myPlayerId);
};

export const toggleTurn = async (gameId: string, playerId: string) => {
    const gamesRef = doc(db, 'games', gameId);
    const gameSnap = await getDoc(gamesRef);

    if (!gameSnap.exists()) throw new Error('Game not found');

    await updateDoc(gamesRef, {
        currentTurn: playerId,
        showOpponentGuess: false, // Reset this to false when toggling turns
        //gameSnap.data().currentTurn === gameSnap.data().player1.id ? gameSnap.data().player2?.id : gameSnap.data().player1.id,
    });
}

export const submitGuess = async (gameId: string, move: PlayerMove) => {
    const moveRef = collection(db, "games", gameId, "moves");
    await addDoc(moveRef, {...move, createdAt: serverTimestamp()});

    const gameRef = doc(db, "games", gameId);
    await updateDoc(gameRef, {
        showOpponentGuess: true, // Show opponent's guess after submission
    });
}

export const winGame = async (gameId: string, winnerId: string) => {
    const gameRef = doc(db, "games", gameId);
    await updateDoc(gameRef, {
        gameOver: true,
        winner: winnerId,
        status: 'finished',
        showOpponentGuess: false, // Reset this as well
    });
};

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