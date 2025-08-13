import { FC, ReactElement, useState } from 'react';
import { PVCGameboardProps } from '@/lib/types';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Badge } from "@/components/ui/badge";

import { AnimatePresence, motion } from "motion/react"
import { isUniqueDigits } from '@/lib/logic';

export const PVCGameBoard: FC<PVCGameboardProps> = (props): ReactElement => {
    const { 
        currentPlayer,
        isComputer, 
        computerIsThinking,
        computerGuess,
        guesses, 
        feedbacks,
        currentFeedback,
        handleGuess, 
        handleToggle,
    } = props;

    const [currentGuess, setCurrentGuess] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleComplete = (val: string) => {
        if (!isUniqueDigits(val)) {
            setErrorMessage("Digits must be unique and 4 total.");
        } else {
            setErrorMessage("");
            setCurrentGuess(val);
            // You can call setCurrentGuess(val) or move to next step
        }
    };

    // Render the game board based on the props
    return (
        <AnimatePresence mode='wait'>
            <div className='flex flex-col items-center w-full max-w-full px-4 sm:px-8 mx-auto'>
                <motion.div
                    key={currentPlayer+"_name"}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="mb-6"
                >
                    <Badge
                        variant="outline"
                        className="border-b-1 border-sky-400 text-sm font-semibold px-4 py-2 text-gray-700"
                    >
                        {currentPlayer}&apos;s Turn
                    </Badge>
                </motion.div>

                <motion.div
                    key={currentPlayer+"_gameboard"}
                    initial={{ opacity: 0, x: 100 }} // when appearing
                    animate={{ opacity: 1, x: 0 }}   // while on screen
                    exit={{ opacity: 0, x: -100, scale: 0.95, filter: "blur(4px)" }}   // when exiting
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="flex flex-col gap-2 mb-3 border border-gray-300 p-4 sm:p-6 rounded-md shadow-sm bg-white"
                >
                    {guesses.map((guess, index) => (
                        <div key={index} className="flex gap-2 items-center">
                            <span className="text-gray-400 text-sm sm:w-10">{index + 1}.</span>
                            <InputOTP
                                maxLength={4}
                                value={guess}
                                disabled
                            >
                                <InputOTPGroup className='space-x-2 mb-2'>
                                    <InputOTPSlot index={0} className='rounded-md border-l w-9 h-10 sm:w-12 sm:h-12 border-sky-200 text-center text-md' />
                                    <InputOTPSlot index={1} className='rounded-md border-l w-9 h-10 sm:w-12 sm:h-12 border-sky-200 text-center text-md' />
                                    <InputOTPSlot index={2} className='rounded-md border-l w-9 h-10 sm:w-12 sm:h-12 border-sky-200 text-center text-md' />
                                    <InputOTPSlot index={3} className='rounded-md border-l w-9 h-10 sm:w-12 sm:h-12 border-sky-200 text-center text-md' />
                                </InputOTPGroup>
                            </InputOTP>
                            <Badge
                                variant="outline"
                                className="w-20 whitespace-normal sm:whitespace-nowrap sm:w-auto sm:py-2 border-transparent border-2 border-b-sky-200 text-sm text-gray-400"
                            >
                                {feedbacks[index].dead} d, {feedbacks[index].injured} inj
                            </Badge>
                        </div> 
                    ))}

                    {/* TODO: keep working on pvc game logic*/}

                    {isComputer ? (
                        <motion.div
                            className="flex gap-4 items-center"
                            initial={{ opacity: 1 }}
                            animate={computerIsThinking? { opacity: [1, 0.2, 1] } : { opacity: 1 }}
                            transition={computerIsThinking? { repeat: Infinity , duration: 4, ease: "easeInOut" } : {}}
                        >
                            <span className="text-gray-500 font-semibold text-sm w-15">
                            {computerIsThinking? "Thinking..." : "Guess:"}
                            </span> 
                            <InputOTP
                                maxLength={4}
                                pattern={REGEXP_ONLY_DIGITS}
                                value={computerGuess}
                                readOnly
                            >
                                <InputOTPGroup className='space-x-2'>
                                <InputOTPSlot index={0} className='rounded-md border-l w-10 h-12 sm:w-12 sm:h-12 border-sky-300 text-center text-md' />
                                <InputOTPSlot index={1} className='rounded-md border-l w-10 h-12 sm:w-12 sm:h-12 border-sky-300 text-center text-md' />
                                <InputOTPSlot index={2} className='rounded-md border-l w-10 h-12 sm:w-12 sm:h-12 border-sky-300 text-center text-md' />
                                <InputOTPSlot index={3} className='rounded-md border-l w-10 h-12 sm:w-12 sm:h-12 border-sky-300 text-center text-md' />
                                </InputOTPGroup>
                            </InputOTP>
                        </motion.div> 
                    ) : (
                        <div className="flex flex-col gap-5 mt-2">
                            <div className='flex flex-wrap gap-2 items-center'>
                                <span className="text-gray-400 font-bold text-sm">Guess:</span>
                                <div className="flex flex-col gap-2">
                                    {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
                                    <InputOTP
                                        maxLength={4}
                                        pattern={REGEXP_ONLY_DIGITS}
                                        value={currentGuess}
                                        onChange={(value: string) => setCurrentGuess(value)}
                                        onComplete={handleComplete}
                                        disabled={!!currentFeedback}
                                    >
                                        <InputOTPGroup className='space-x-2'>
                                        <InputOTPSlot index={0} className='rounded-md border-l w-12 h-12 sm:w-12 sm:h-12 border-sky-300 text-center text-lg' />
                                        <InputOTPSlot index={1} className='rounded-md border-l w-12 h-12 sm:w-12 sm:h-12 border-sky-300 text-center text-lg' />
                                        <InputOTPSlot index={2} className='rounded-md border-l w-12 h-12 sm:w-12 sm:h-12 border-sky-300 text-center text-lg' />
                                        <InputOTPSlot index={3} className='rounded-md border-l w-12 h-12 sm:w-12 sm:h-12 border-sky-300 text-center text-lg' />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>
                            </div>
                            
                            {/* Display current feedback if available */}
                            {!currentFeedback && (
                            <button 
                                className='px-2 py-1 text-sm bg-sky-500 text-white rounded-lg cursor-pointer hover:bg-sky-600'
                                onClick={() => handleGuess(currentGuess)}
                            >
                                Submit Guess
                                 {/* TODO: Do not submit if number has repeating digit. Implement logic here!! */}
                            </button>
                            )}
                        </div>
                    )}

                    {!isComputer && currentFeedback && (
                        <button 
                            className='mt-5 p-2 bg-green-500 text-white rounded-md cursor-pointer hover:bg-green-600'
                            onClick={() => { setCurrentGuess(""); handleToggle(); }} 
                        >
                            End Turn {/* This button ends the turn and switches to the next player */}
                        </button>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    )
};