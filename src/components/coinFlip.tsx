"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function CoinFlip() {
    const [flipping, setFlipping] = useState(false);
    const [result, setResult] = useState<"Heads" | "Tails" | null>(null);

    const flipCoin = () => {
        if (flipping) return; // prevent spam clicks

        setFlipping(true);

        // Random result
        const newResult = Math.random() > 0.5 ? "Heads" : "Tails";

        // Simulate flipping delay
        setTimeout(() => {
            setResult(newResult);
            setFlipping(false);
        }, 1500);
    };

    return (
        <div className="flex flex-col items-center gap-4 p-6">
            <motion.div
                className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center text-black font-bold text-xl shadow-lg cursor-pointer"
                onClick={flipCoin}
                animate={{ rotateX: flipping ? 1800 : 0, }} //5 full flips
                transition={{ duration: 1.5, ease: "easeInOut",}}
            >
                {result || "?"}
            </motion.div>

            {result && !flipping && (
                <p className="text-lg font-semibold">{result} goes first!</p>
            )}

            <button
                onClick={flipCoin}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
                disabled={flipping}
            >
                Flip Coin
            </button>
        </div>
    );
}
