import { Feedback } from "./types";
import { compareGuess } from "./logic";

// Helper to generate all 4-digit numbers with no repeating digits
function generateAllPossibleGuesses(): string[] {
  const results: string[] = [];
  for (let i = 0; i < 10000; i++) {
    const str = i.toString().padStart(4, '0');
    const unique = new Set(str);
    if (unique.size === 4) {
      results.push(str);
    }
  }
  return results;
}

export class ComputerGuesser {
    private allCodes: string[];
    private possibleCodes: string[];

    constructor() {
        this.allCodes = generateAllPossibleGuesses();
        this.possibleCodes = [...this.allCodes];
    }

    makeGuess(): string {
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




/**
 * KNUTH'S ALGORITHM
 * More complex, takes longer, although correct guess is guaranteed in <=5 turns
export class KnuthSolver {
    private allCodes: string[];
    private possibleCodes: string[];

    constructor() {
        this.allCodes = generateAllCodes();
        this.possibleCodes = [...this.allCodes];
    }

    nextGuess(): string {
        // Knuth's original first guess is '0123'
        if (this.possibleCodes.length === this.allCodes.length) {
        return '0123';
        }

        let minMax = Infinity;
        let bestGuess = this.possibleCodes[0];

        for (const guess of this.allCodes) {
            const counts: Record<string, number> = {};

            for (const code of this.possibleCodes) {
                const { dead, injured } = compareGuess (code, guess);
                const key = `${dead}-${injured}`;
                counts[key] = (counts[key] || 0) + 1;
            }

            const worst = Math.max(...Object.values(counts));
            if (worst < minMax) {
                minMax = worst;
                bestGuess = guess;
            }
        }

            return bestGuess;
    }

    updateState(guess: string, feedback: Feedback) {
        this.possibleCodes = this.possibleCodes.filter(code => {
        const f = compareGuess(code, guess);
        return f.dead === feedback.dead && f.injured === feedback.injured;
        });
    }

    reset() {
        this.possibleCodes = [...this.allCodes];
    }
}
 */