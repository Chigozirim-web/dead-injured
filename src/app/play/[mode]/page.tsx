'use client'

import { useCallback, useState } from "react";
import { useParams } from 'next/navigation'
import { compareGuess, Feedback, generateComputerGuess, isUniqueDigits } from "@/lib/logic";
import { InputDialog } from "@/components/inputDialog";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { AnimatePresence, motion } from "motion/react"

type Player = 'Player 1' | 'Player 2' | 'Computer';
 
export default function GameModePage() {
  const { mode } = useParams();
  
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState(''); // or computer player

  const [player1Secret, setPlayer1Secret] = useState("");
  const [player2Secret, setPlayer2Secret] = useState(""); // or generated

  const [inputDialogOpen, setInputDialogOpen] = useState(true);
  const [open, setOpen] = useState(false);

  const [error, setError] = useState("");

  //const [turn, setTurn] = useState<Player>('Player 1');
  const [currentPlayer, setCurrentPlayer] = useState<Player>('Player 1');
  const [guesses, setGuesses] = useState<{ [key in Player]?: string[] }>({});
  const [feedbacks, setFeedbacks] = useState<{ [key in Player]?: Feedback[] }>({});
  const [currentGuess, setCurrentGuess] = useState("");
  const [currentFeedback, setCurrentFeedback] = useState<Feedback | null>(null);

  const handleInput = useCallback((name: string, secret: string) => {
    if (!name || !secret) {
      toast("Name and secret must be provided.");
      return;
    }

    console.log(`Setting ${currentPlayer}'s name to ${name} and secret to ${secret}`);

    if (currentPlayer === 'Player 1') {
      setPlayer1(name);
      setPlayer1Secret(secret);
      setOpen(false);

      if (mode === "pvp") {
        setCurrentPlayer('Player 2'); // Switch to Player 2 after setting Player 1
      } else {
        setInputDialogOpen(false); 
        const computerGuess = generateComputerGuess();
        setPlayer2('Computer');
        setPlayer2Secret(computerGuess);

        console.log(`Computer's secret is: ${computerGuess}`);
        setCurrentPlayer('Player 1'); // Switch back to Player 1 after setting Computer
      }
    } else if (currentPlayer === 'Player 2') {
      setPlayer2(name);
      setPlayer2Secret(secret);

      setInputDialogOpen(false);
      setOpen(false); 
      setCurrentPlayer('Player 1');
    } else {
      console.log("Player is Computer, cannot set name and secret.");
    }
  }, [currentPlayer, mode]);

  const handleGuess = () => {
    if (!currentGuess || currentGuess.length !== 4) {
      toast("Please enter a valid 4-digit guess.");
      return;
    }
    const opponentSecret = currentPlayer === 'Player 1' ? player2Secret : player1Secret;
    const feedback = compareGuess(opponentSecret, currentGuess);
    setCurrentFeedback(feedback);

    setGuesses(prev => ({
      ...prev,
      [currentPlayer]: [...(prev[currentPlayer] || []), currentGuess],
    }));
    setFeedbacks(prev => ({
      ...prev,
      [currentPlayer]: [...(prev[currentPlayer] || []), feedback],
    }));

    //Check win
    if (feedback.dead === 4) {
      const currentName = currentPlayer === 'Player 1' ? player1 : player2;
      toast(`${currentName} wins!`);
      // Reset game or handle win logic
      setGuesses({});
      setFeedbacks({});
      setCurrentGuess("");
      setCurrentFeedback(null);
      return;
    }

    if (mode === 'pvc') {
      // PvC: simulate computer move
      setTimeout(() => {
        const computerGuess = generateComputerGuess(); // or write logic for computer to guess player's secret
        const compFeedback = compareGuess(player1Secret, computerGuess);
        //setCurrentFeedback(compFeedback);
        setGuesses(prev => ({
          ...prev,
          ['Computer']: [...(prev['Computer'] || []), computerGuess],
        }));
        setFeedbacks(prev => ({
          ...prev,
          ['Computer']: [...(prev['Computer'] || []), compFeedback],
        }));

        if (compFeedback.dead === 4) {
          toast(`Computer wins!`);
        } else {
          setCurrentPlayer('Player 1');
        }
      }, 1000);
    }
  };

  const handleComplete = (val: string) => {
    if (!isUniqueDigits(val)) {
        setError("Digits must be unique and 4 total.");
    } else {
        setError("");
        setCurrentGuess(val);
        // You can call setCurrentGuess(val) or move to next step
    }
  };

  const toggleTurn = () => {
    setCurrentPlayer(currentPlayer === 'Player 1' ? 'Player 2' : 'Player 1');
    setCurrentGuess("");
    setCurrentFeedback(null);
  };

 
  return (
    <div className='flex flex-col items-center p-7 sm:p-7 text-gray-700 font-[family-name:var(--font-geist-sans)]'>
      <div className="flex flex-col items-center gap-4 mb-5">
        <h2 className="text-2xl font-bold text-gray-800"> {mode === "pvp" ? "Player vs Player" : "Player vs Computer"}</h2>
        {inputDialogOpen && (
          <div className="flex gap-2 items-center">
            <p className="text-l text-gray-600">{currentPlayer}:</p>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="p-2 border-green-300 bg-green-200 text-gray-600 hover:bg-green-300 hover:text-gray-700 cursor-pointer"
                  >
                    Set Name and Secret
                    {/* This button opens a dialog to set player names and secrets */}
                  </Button>
              </DialogTrigger>
              <InputDialog handleInput={handleInput} />
            </Dialog> 
          </div>
        )} 
      </div>
      <Separator className="mb-4" />
    
        {player1 !== '' && player2 !== '' &&
          <motion.div
            key={currentPlayer}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="mb-8 flex"
          >
            <Badge
              variant="outline"
              className="border-b-1 border-sky-400 text-sm font-semibold px-4 py-2 text-gray-700"
            >
              {currentPlayer === 'Player 1' ? player1 : player2} &apos;s Turn
            </Badge>
          </motion.div>
        }
      
      {!inputDialogOpen && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPlayer}
            initial={{ opacity: 0, x: 100 }} // when appearing
            animate={{ opacity: 1, x: 0 }}   // while on screen
            exit={{ opacity: 0, x: -100, scale: 0.95, filter: "blur(4px)" }}   // when exiting
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex flex-col gap-2 mb-3 border border-gray-300 p-6 rounded-md shadow-sm bg-white"
          >
            {guesses[currentPlayer]?.map((guess, index) => (
              <div key={index} className="flex gap-4 items-center">
                <span className="text-gray-400 text-sm w-10">{index + 1}.</span>
                <InputOTP
                  maxLength={4}
                  value={guess}
                  disabled
                >
                  <InputOTPGroup className='space-x-2 mb-2'>
                    <InputOTPSlot index={0} className='rounded-md border-l size-12 border-sky-200' />
                    <InputOTPSlot index={1} className='rounded-md border-l size-12 border-sky-200' />
                    <InputOTPSlot index={2} className='rounded-md border-l size-12 border-sky-200' />
                    <InputOTPSlot index={3} className='rounded-md border-l size-12 border-sky-200' />
                  </InputOTPGroup>
                </InputOTP>
                <Badge
                  variant="outline"
                  className="py-1 border-sky-200 text-sm text-gray-400"
                >
                  {feedbacks[currentPlayer]?.[index]?.dead} dead, {feedbacks[currentPlayer]?.[index]?.injured} injured
                </Badge>
              </div> 
            ))}

            <div className="flex gap-4 items-center">
              <span className="text-gray-500 font-semibold text-sm w-10">Guess:</span>
              <div className="flex flex-col gap-2">
                {error && <p className="text-sm text-red-500">{error}</p>}
                <InputOTP
                  maxLength={4}
                  pattern={REGEXP_ONLY_DIGITS}
                  value={currentGuess}
                  onChange={(value: string) => setCurrentGuess(value)}
                  onComplete={handleComplete}
                >
                  <InputOTPGroup className='space-x-2'>
                    <InputOTPSlot index={0} className='rounded-md border-l size-12 border-sky-300' />
                    <InputOTPSlot index={1} className='rounded-md border-l size-12 border-sky-300' />
                    <InputOTPSlot index={2} className='rounded-md border-l size-12 border-sky-300' />
                    <InputOTPSlot index={3} className='rounded-md border-l size-12 border-sky-300' />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              
              {/* Display current feedback if available */}
              {currentFeedback ? (
                <span className='text-sm text-gray-600'>
                  {currentFeedback.dead} dead, {currentFeedback.injured} injured
                </span>
              ) : (
                <button 
                  className='px-2 py-1 text-sm bg-sky-500 text-white rounded cursor-pointer hover:bg-sky-600'
                  onClick={handleGuess}
                >
                  Submit Guess
                  {/* After submitting, this button changes to feedback result. E.g.: 0 dead 2 inj */}
                </button>
              )}
            </div>
            {currentFeedback && (
              <button 
                className='mt-10 p-2 bg-green-500 text-white rounded-md cursor-pointer hover:bg-green-600'
                onClick={toggleTurn}
              >
                End Turn
                {/* This button ends the turn and switches to the next player */}
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}