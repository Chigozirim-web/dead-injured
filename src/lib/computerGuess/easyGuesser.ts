import { compareGuess, generateAllPossibleGuesses } from "../logic";
import { Feedback } from "../types";

// Algorithm is a simple random guesser
export class EasyComputerGuesser {
    private allCodes: string[];
    private possibleCodes: string[];
    private randomGuessCount: number;

    constructor() {
        this.allCodes = generateAllPossibleGuesses();
        this.possibleCodes = [...this.allCodes];
        this.randomGuessCount = 0; // To track the number of random guesses made
    }

    makeGuess(): string {
        console.log("I am EasyComputerGuesser, making a guess...");
        // Make first guess = '0123'
        if (this.possibleCodes.length === this.allCodes.length) {
            return '0123';
        }

        if (this.possibleCodes.length === 0) { //will prob never happen, before this, the game should end
            throw new Error("No possible codes left to guess.");
        }

        const idx = Math.floor(Math.random() * this.possibleCodes.length);
        return this.possibleCodes[idx];   
    }

    updatePossibleSecrets(lastGuess: string, feedback: Feedback) {
        if(this.randomGuessCount < 6) {
            const idx = this.possibleCodes.indexOf(lastGuess);
            if (idx !== -1) {
                this.possibleCodes.splice(idx, 1); // Remove the last guess from possible codes
                this.randomGuessCount++;
            }
            return;
        }

        // After 6 random guesses, switch to a more strategic guess 
        this.possibleCodes = this.possibleCodes.filter(code => {
            const fb = compareGuess(code, lastGuess);
            return fb.dead === feedback.dead && fb.injured === feedback.injured;
        });
    }

    reset() {
        this.possibleCodes = [...this.allCodes];
    }
}