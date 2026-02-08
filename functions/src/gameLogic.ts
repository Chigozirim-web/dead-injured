export type Feedback = { dead: number; injured: number };

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