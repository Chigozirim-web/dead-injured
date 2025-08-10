import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { GameOverModalProps } from '@/lib/types';

import Confetti from "react-confetti";
import { useWindowSize } from 'react-use'// optional hook for auto size

export default function GameOverModal({ winnerName, open, onRestart, isWinner, winnerSecret }: GameOverModalProps) {
    const { width, height } = useWindowSize();

    useEffect(() => {
        if (open) {
            const audioPath = isWinner ? "/sounds/victory.mp3" : "/sounds/fail.mp3";
            const audio = new Audio(audioPath);
            audio.play().catch((err) => console.error("Sound error:", err));
        }
    }, [isWinner, open]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {isWinner && <Confetti width={width} height={height} numberOfPieces={300} recycle={false} /> }

                    <motion.div
                        className="bg-white p-12 rounded-2xl shadow-xl text-center w-4/5 lg:w-2/3"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.7 }}
                    >
                        <h2 className="text-lg sm:text-3xl font-bold text-green-600 mb-4">🎉{winnerName} Wins!🎉</h2>
                        {winnerName === 'Computer' ? (
                            <p className="text-gray-600 text-sm sm:text-lg font-bold mb-6">Unfortunately, Computer guessed correctly first. <br />
                                Better luck next time!
                            </p>
                        ) : !isWinner  ? (
                            <p className="text-gray-600 text-sm sm:text-lg font-bold mb-6">Unfortunately, {winnerName} guessed correctly first. <br />
                                Better luck next time!
                            </p>
                        ): (
                             <p className="text-gray-600 font-bold mb-6">Congratulations! <br />You guessed the secret number correctly. </p>
                        )}

                        {!isWinner && 
                            <div className='p-4 sm:py-4 mb-6 bg-gray-50 rounded-lg shadow-sm sm:w-3/4 mx-auto'>
                                <p className="text-gray-500 font-semibold mb-4">{winnerName}&apos;s secret number was: {winnerSecret}</p>
                            </div>
                        }
                       
                        <Button onClick={onRestart} className="bg-green-500 hover:bg-green-600 text-white cursor-pointer">
                            Play Again
                        </Button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}