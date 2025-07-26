export type HandleInputFn = (name: string, secret: string) => void;

export type ResultType = 'dead' | 'injured';

export type Feedback = {
    'dead': number;
    'injured': number;
}

export type Player = 'Player 1' | 'Player 2' | 'Computer';


export type GameOverModalProps = {
    winnerName: string;
    open: boolean;
    onRestart: () => void;
};

export type GameboardProps = {
    playerType: Player;
    playerName: string;
    playerSecret: string;
    mode: 'pvp' | 'pvc';
    isComputer: boolean;
    computerIsThinking?: boolean;
    computerGuess?: string;
    guesses: string[];
    feedbacks: Feedback[];
    currentFeedback?: Feedback;
    handleGuess: (guess: string) => void;
    handleToggle: (playerType: Player) => void;
    //error: string;
}
