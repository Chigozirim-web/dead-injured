import { Feedback } from "./types";

export const isUniqueDigits = (input: string) => {
    return /^(?!.*(.).*\1)\d{4}$/.test(input);
};


export function compareGuess(secret: string, guess: string): Feedback {
    const result: Feedback = {
        'dead': 0,
        'injured': 0 
    };

    const tempResult: boolean[] = Array(4).fill(false);

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

    return result;
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