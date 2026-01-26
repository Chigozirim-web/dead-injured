import { Feedback } from "./types";

export const isUniqueDigits = (input: string) => {
    // Ensures exactly 4 digits with no repeated digit
    return /^(?!.*(.).*\1)\d{4}$/.test(input);
};

export function compareGuess(secret: string, guess: string): Feedback {
    let dead = 0;
    let injured = 0;

    const secretUsed = Array(secret.length).fill(false);
    const guessUsed = Array(guess.length).fill(false);

    // Pass 1: count exact matches ("dead") and mark used positions
    for (let i = 0; i < 4; i++) {
        if (guess[i] === secret[i]) {
            dead++;
            secretUsed[i] = true;
            guessUsed[i] = true;
        }
    }

    // Pass 2: count correct digits in wrong positions ("injured") without double-counting
    for (let i = 0; i < 4; i++) {
        if (!guessUsed[i]) {
            for (let j = 0; j < 4; j++) {
                if (!secretUsed[j] && guess[i] === secret[j]) {
                    injured++;
                    secretUsed[j] = true;
                    break;
                }
            }
        }
    }

    return { dead, injured };
}

export function generateComputerGuess(): string {
  const digits = [...Array(10).keys()].map(String); // ['0', '1', ..., '9']
  const guess = [];

  while (guess.length < 4) {
    const randIndex = Math.floor(Math.random() * digits.length);
    const digit = digits.splice(randIndex, 1)[0];

    /* If you want to forbid leading zero, uncomment:
    if (guess.length === 0 && digit === '0') continue;
    */
    guess.push(digit);
  }

  return guess.join('');
}

// Generates all 4-digit strings with no repeating digits (0000–9999 filtered by uniqueness)
export function generateAllPossibleGuesses(): string[] {
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
