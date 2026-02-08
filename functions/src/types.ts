export type PlayerState = {
    id: string;
    name: string;
}

export type PVPGameState = {
    player1: PlayerState;
    player2: PlayerState | null;
    status: "waiting" | "playing" | "finished";
    currentTurn: string; //playerID
    gameOver: boolean;
    winner?: string | null; //playerID of winner 
    revealedSecret?: string; //to reveal winner's secret at end of game
    showOpponentGuess: boolean; //to show results immediately after guess
    //createdAt: Date | Timestamp | FieldValue;
}