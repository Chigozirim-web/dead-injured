import { FieldValue, Timestamp } from "firebase/firestore";

export type HandleInputFn = (name: string, secret: string) => void;

export type ResultType = 'dead' | 'injured';

export type Feedback = {
    'dead': number;
    'injured': number;
}

export type Player = 'Player 1' | 'Player 2' | 'Computer';

export type PlayStatus =  "waiting" | "playing" | "finished";

export enum DifficultyLevel {
    EASY = "easy",
    MEDIUM = "medium",  
    HARD = "hard"
}

export type PlayerState = {
    id: string;
    name: string;
}

export type PlayerMove = {
    playerId: string;
    guess: string;
    result: Feedback;
    id?: string; //maybe use the database id generated when it is added instead of setting it manually in game ??
    createdAt?: Date | Timestamp | FieldValue;
}

export type PVPGameState = {
    player1: PlayerState;
    player2: PlayerState | null;
    status: PlayStatus;
    currentTurn: string; //playerID
    gameOver: boolean;
    winner?: string | null; //playerID of winner 
    revealedSecret?: string; //to reveal winner's secret at end of game
    showOpponentGuess: boolean; //to show results immediately after guess
    createdAt: Date | Timestamp | FieldValue;
}

export type GameOverModalProps = {
    winnerName: string;
    open: boolean;
    onRestart: () => void;
    isWinner?: boolean; 
    opponentName?: string;
    winnerSecret?: string;
};

export interface PVPGameBoardProps {
    gameState: PVPGameState;
    gameMoves: PlayerMove[];
    disabled: boolean;
    myPlayerId: string;
    submitSuccess: boolean;
    onGuess: (guess: string) => void;
    onToggleTurn: () => void; 
}

export type PVCGameboardProps = {
    playerName: string;
    playerSecret: string;
    guesses: string[];
    feedbacks: Feedback[];
    currentPlayer: string;
    isComputer: boolean;
    computerIsThinking?: boolean;
    computerGuess?: string;
    currentFeedback?: Feedback;
    handleGuess: (guess: string) => void;
    handleToggle: () => void;
    //error: string;
}

export interface PlayerAvatarProps {
  name: string;
  isCurrentTurn: boolean;
  imageUrl?: string;
};

export type InputDialogProps = {
    mode: string;
    handleInput: (name: string, secret: string, difficultyLevel?: DifficultyLevel) => void;
};

export type QuitGameModalProps = {
    onClose: () => void;
    onQuit: () => void;
};

export type AuthState = {
    uid: string | null;
    loading: boolean;
    error: Error | null;
    refresh: () => Promise<void>;
};
