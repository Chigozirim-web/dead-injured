import { Feedback } from "./types";

export const isUniqueDigits = (input: string) => {
    return /^(?!.*(.).*\1)\d{4}$/.test(input);
};

export function compareGuess(secret: string, guess: string): Feedback {
    let dead = 0;
    let injured = 0;

    for (let i = 0; i < 4; i++) {
        if (guess[i] === secret[i]) {
            dead++;
        } else if (secret.includes(guess[i])) {
            injured++;
        }
    }

    return {dead, injured};
}

export function generateComputerGuess(): string {
  const digits = [...Array(10).keys()].map(String); // ['0', '1', ..., '9']
  const guess = [];

  while (guess.length < 4) {
    const randIndex = Math.floor(Math.random() * digits.length);
    const digit = digits.splice(randIndex, 1)[0];

    /* In the case where first digit can't be '0' (leading zero)
    if (guess.length === 0 && digit === '0') continue;
    */
    guess.push(digit);
  }

  return guess.join('');
}

// Helper to generate all 4-digit numbers with no repeating digits
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

/**
 * THIS COMPARE GUESS LOGIC IS BETTER FOR WHEN NUMBERS (SECRET OR GUESS) COULD HAVE REPEATING DIGITS
 * 
 * ...
 *  const tempResult: boolean[] = Array(4).fill(false);

    const secretArr = secret.split('');
    const guessArr = guess.split('');
    const used = Array(4).fill(false);

    // Check correct
    for (let i = 0; i < 4; i++) {
        if (guessArr[i] === secretArr[i]) {
            tempResult[i] = true;
            result['dead']+=1;
            used[i] = true;
        }
    }

    // Check misplaced
    for (let i = 0; i < 4; i++) {
        if (! tempResult[i]) {
            const idx = secretArr.findIndex((digit, j) =>
                digit === guessArr[i] && !used[j] && guessArr[j] !== secretArr[j]
            );
            if (idx !== -1) {
                result['injured'] += 1;
                used[idx] = true;
            }
        }
    }

 */