import { compareGuess, generateAllPossibleGuesses } from "../logic";
import { Feedback } from "../types";

//KNUTH'S ALGORITHM
//  More complex, takes longer, although correct guess is guaranteed in <=5 turns

export class HardComputerGuesser {
    private allCodes: string[];        // All possible secret codes
    private possibleCodes: string[];   // Codes still possible given feedback so far
    private lastGuess: string;

    constructor() {
        this.allCodes = generateAllPossibleGuesses();
        this.possibleCodes = [...this.allCodes];
        this.lastGuess = '';
    }

    // Knuth's next guess selection
    private selectNextGuess(): string {
        if (this.possibleCodes.length === 1) {
            return this.possibleCodes[0];
        }

        let bestGuess = "";
        let minWorstCase = Infinity;

        for (const guess of this.allCodes) {
            // Map feedback pattern -> count
            const feedbackMap = new Map<string, number>();
            for (const possible of this.possibleCodes) {
                const fb = compareGuess(possible, guess);
                const key = `${fb.dead}-${fb.injured}`;
                feedbackMap.set(key, (feedbackMap.get(key) || 0) + 1);
            }

            const worstCase = Math.max(...feedbackMap.values());

            // Minimax: pick guess minimizing worst case size
            if (worstCase < minWorstCase || 
               (worstCase === minWorstCase && this.possibleCodes.includes(guess))) {
                minWorstCase = worstCase;
                bestGuess = guess;
            }
        }
        return bestGuess;
    }

    // Make the next guess
    public makeGuess(): string {
        if (!this.lastGuess) {
            this.lastGuess = "0123"; // arbitrary first guess
        } else {
            this.lastGuess = this.selectNextGuess();
        }
        console.log("HardComputerGuesser done guessing");
        return this.lastGuess;
    }

    updatePossibleSecrets(guess: string, feedback: Feedback) {
        this.possibleCodes = this.possibleCodes.filter(code => {
            const f = compareGuess(code, guess);
            return f.dead === feedback.dead && f.injured === feedback.injured;
        });
    }

    reset() {
        this.possibleCodes = [...this.allCodes];
        this.lastGuess = '';
    }
}