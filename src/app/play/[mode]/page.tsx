'use client'

import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import { useParams } from 'next/navigation';
import { Player, Feedback, GameboardProps } from "@/lib/types";
import { compareGuess, generateComputerGuess } from "@/lib/logic";
import { ComputerGuesser } from "@/lib/computerGuesser";

import { InputDialog } from "@/components/inputDialog";
import { GameBoard } from "@/components/gameBoard";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import GameOverModal from "@/components/gameOverModal";
 
export default function GameModePage() {
  const { mode } = useParams(); 
  const computerGuesserRef = useRef<ComputerGuesser | null>(null);
  
  useEffect(() => {
    if (mode === 'pvc') {
      computerGuesserRef.current = new ComputerGuesser();
    }
  }, [mode])
  
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState(''); // or computer player

  const [player1Secret, setPlayer1Secret] = useState("");
  const [player2Secret, setPlayer2Secret] = useState(""); // or generated

  const [inputDialogOpen, setInputDialogOpen] = useState(true);
  const [open, setOpen] = useState(false);

  const [computerIsThinking, setComputerIsThinking] = useState(false);

  //const [error, setError] = useState("");

  const [gameOver, setGameOver] = useState(false);
  const [winnerName, setWinnerName] = useState("");

  const [currentPlayer, setCurrentPlayer] = useState<Player>('Player 1');
  const [guesses, setGuesses] = useState<{ [key in Player]?: string[] }>({});
  const [feedbacks, setFeedbacks] = useState<{ [key in Player]?: Feedback[] }>({});
  const [currentGuess, setCurrentGuess] = useState("");
  const [currentFeedback, setCurrentFeedback] = useState<Feedback>();

  /* Handle Game Restart */
  function restartGame() {
    setGameOver(false);
    setPlayer1("");
    setPlayer1Secret("");
    setPlayer2("");
    setPlayer2Secret("");
    setInputDialogOpen(true);
    setComputerIsThinking(false);
    setCurrentPlayer("Player 1");
    setGuesses({});
    setFeedbacks({});
    setCurrentGuess("");
    setCurrentFeedback(undefined);
    computerGuesserRef.current?.reset();
  }

  /* Handle Player Guesses */
  const handleGuess: (guess: string) => void = useCallback((guess: string) => {
    if (!guess || guess.length !== 4) {
      toast("Please enter a valid 4-digit guess.");
      return;
    }
    const opponentSecret = currentPlayer === 'Player 1' ? player2Secret : player1Secret;
    const feedback = compareGuess(opponentSecret, guess);
    setCurrentFeedback(feedback);

    setGuesses(prev => ({
      ...prev,
      [currentPlayer]: [...(prev[currentPlayer] || []), guess],
    }));
    setFeedbacks(prev => ({
      ...prev,
      [currentPlayer]: [...(prev[currentPlayer] || []), feedback],
    }));

    //Check win
    if (feedback.dead === 4) {
      const currentName = currentPlayer === 'Player 1' ? player1 : player2;
      setWinnerName(currentName);
      setGameOver(true);
      setCurrentFeedback(undefined);
      return;
    }
  }, [currentPlayer, player1, player2, player1Secret, player2Secret]);

/* Switch Player Turns */
  const toggleTurn: (player: Player) => void = useCallback((player: Player) => {
    if(mode === 'pvp') {
      if (player === 'Player 1') {
        setCurrentPlayer('Player 2');
      } else {
        setCurrentPlayer('Player 1');
      }
    } else {
      // PvC: simulate computer move
      setComputerIsThinking(true);
      setCurrentPlayer('Computer');

      setTimeout(() => {
        const computerGuess = computerGuesserRef.current?.makeGuess();
        if (computerGuess) {
          const compFeedback = compareGuess(player1Secret, computerGuess);
          computerGuesserRef.current?.updatePossibleSecrets(computerGuess, compFeedback);
          
          setComputerIsThinking(false);
          setCurrentGuess(computerGuess);
          setCurrentFeedback(compFeedback);
          setGuesses(prev => ({
            ...prev,
            ['Computer']: [...(prev['Computer'] || []), computerGuess],
          }));
           setFeedbacks(prev => ({
            ...prev,
            ['Computer']: [...(prev['Computer'] || []), compFeedback],
          }));

          if(compFeedback.dead === 4) {
            setWinnerName("Computer");
            setGameOver(true);
          }else {
            setTimeout(() => {
              setCurrentPlayer('Player 1');
              setCurrentGuess("");
              setCurrentFeedback(undefined);
            }, 2500);
          }
        }else {
          toast("An Internal error occured.\nAn issue with computer-guess function ")
        }
      }, 5000);
    }
    setCurrentGuess("");
    setCurrentFeedback(undefined);
  }, [computerGuesserRef, mode, player1Secret]);

  const gameBoard = useMemo<{[key in Player]: GameboardProps}>(() => ({
    'Player 1': {
      playerType: 'Player 1',
      playerName: player1,
      playerSecret: '',
      mode: mode as 'pvp' | 'pvc',
      isComputer: false,
      guesses: guesses['Player 1'] || [],
      feedbacks: feedbacks['Player 1'] || [],
      currentFeedback: currentFeedback,
      handleGuess: handleGuess,
      handleToggle: toggleTurn,
    },
    'Player 2': {
      playerType: 'Player 2',
      playerName: player2,
      playerSecret: '',
      mode: mode as 'pvp' | 'pvc',
      isComputer: false,
      guesses: guesses['Player 2'] || [],
      feedbacks: feedbacks['Player 2'] || [],
      currentFeedback: currentFeedback,
      handleGuess: handleGuess,
      handleToggle: toggleTurn,
    },
    'Computer': {
      playerType: 'Computer',
      playerName: 'Computer',
      playerSecret: '',
      mode: 'pvc',
      isComputer: true,
      computerIsThinking: computerIsThinking,
      computerGuess: currentGuess,
      guesses: guesses['Computer'] || [],
      feedbacks: feedbacks['Computer'] || [],
      currentFeedback: currentFeedback,
      handleGuess: handleGuess,
      handleToggle: toggleTurn,
    }
  }), [computerIsThinking, currentFeedback, currentGuess, feedbacks, guesses, handleGuess, mode, player1, player2, toggleTurn]);

  /* Save player names and secret numbers */
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
        const computerSecret = generateComputerGuess();
        setPlayer2('Computer');
        setPlayer2Secret(computerSecret);

        console.log(`Computer's secret is: ${computerSecret}`);
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

  return (
    <div className='flex flex-col gap-4 w-full max-w-full p-4 mx-auto sm:p-7 text-gray-700 font-[family-name:var(--font-geist-sans)]'>
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
      {!inputDialogOpen && (
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4 p-2">
          <div className="sm:w-64 mb-15 sm:mb-0 shrink-0 sticky top-4 sm:self-start">
            <div className="p-5 bg-white shadow rounded-lg mb-3">
              <h2 className="text-md font-semibold mb-2">Guide:</h2>
              <p className="text-sm text-gray-600">
                Guess the 4-digit number.
              </p>
              <p className="text-sm text-gray-600"> 
                <code>x d (dead)</code> ➡️ x correct digits in the correct position.
              </p>
              <p className="text-sm text-gray-600"> 
                <code>x inj (injured)</code> ➡️ x correct digits, but in the wrong position.
              </p>
            </div>
            <Button 
              variant="outline" 
              className="p-2 transition duration-250 ease-in-out bg-red-400 text-white hover:bg-red-500 hover:text-white hover:scale-110 cursor-pointer"
            >
              Quit Game
            </Button>
          </div>
          
          <div className="flex-1">
            <GameBoard {...gameBoard[currentPlayer] as GameboardProps} />
          </div>
        </div>
      )}
      <GameOverModal
        winnerName={winnerName}
        open={gameOver}
        onRestart={restartGame}
      />
    </div>
  )
}