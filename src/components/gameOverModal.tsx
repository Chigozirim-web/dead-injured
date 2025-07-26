import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { GameOverModalProps } from '@/lib/types';

import Confetti from "react-confetti";
import { useWindowSize } from 'react-use'// optional hook for auto size

export default function GameOverModal({ winnerName, open, onRestart }: GameOverModalProps) {
    const { width, height } = useWindowSize()

    useEffect(() => {
        if (open) {
            const audio = new Audio("/sounds/victory.mp3");
            audio.play().catch((err) => console.error("Sound error:", err));
        }
    }, [open]);
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <Confetti width={width} height={height} numberOfPieces={300} recycle={false} />

                    <motion.div
                        className="bg-white p-12 rounded-2xl shadow-xl text-center max-w-lg w-full"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.7 }}
                    >
                        <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 {winnerName} Wins! 🎉</h2>
                        {winnerName === 'Computer' ? (
                            <p className="text-gray-600 font-bold mb-6">Unfortunately, Computer guessed correctly first. <br />
                                Better luck next time!
                            </p>
                        ) : (
                             <p className="text-gray-600 font-bold mb-6">Congratulations! <br />You guessed the secret number correctly. </p>
                        )}
                       
                        <Button onClick={onRestart} className="bg-green-500 hover:bg-green-600 text-white cursor-pointer">
                            Play Again
                        </Button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}