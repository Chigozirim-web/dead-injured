import { Feedback } from "../types";
import { compareGuess, generateAllPossibleGuesses } from "../logic";

// Algorithm is a smart elimination method; a simpler version of Knuth's algorithm
export class MediumComputerGuesser {
    private allCodes: string[];
    private possibleCodes: string[];

    constructor() {
        this.allCodes = generateAllPossibleGuesses();
        this.possibleCodes = [...this.allCodes];
    }

    makeGuess(): string {
        console.log("I am MediumComputerGuesser, making a guess...");
        //Make first guess = '0123'
        if (this.possibleCodes.length === this.allCodes.length) {
            return '0123';
        }

        // Pick a random guess from remaining possible secrets
        const idx = Math.floor(Math.random() * this.possibleCodes.length);
        return this.possibleCodes[idx];
    }

    updatePossibleSecrets(lastGuess: string, feedback: Feedback) {
        this.possibleCodes = this.possibleCodes.filter(code => {
            const fb = compareGuess(code, lastGuess);
            return fb.dead === feedback.dead && fb.injured === feedback.injured;
        });
    }

    reset() {
        this.possibleCodes = [...this.allCodes];
    }
}
