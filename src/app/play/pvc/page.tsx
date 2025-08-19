'use client'
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import { Player, Feedback, PVCGameboardProps, DifficultyLevel } from "@/lib/types";
import { compareGuess, generateComputerGuess } from "@/lib/logic";
import { EasyComputerGuesser } from "@/lib/computerGuess/easyGuesser";
import { MediumComputerGuesser } from "@/lib/computerGuess/mediumGuesser";
//import { HardComputerGuesser } from "@/lib/computerGuess/hardGuesser";

import { InputDialog } from "@/components/inputDialog";
import { PVCGameBoard } from "@/components/gameBoard";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { QuitGameModal } from "@/components/quitGameModal";
import { Info } from "lucide-react";
import { useKnuthWorker } from "@/hooks/useKnuthWorker";

const GameOverModal = dynamic(() => import('@/components/gameOverModal'), {
  ssr: false,
});

export default function GameModePage() {
  const router = useRouter();

  const computerGuesserRef = useRef(null as MediumComputerGuesser | EasyComputerGuesser | null  );
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(); // default difficulty
  const [difficultyColor, setDifficultyColor] = useState<string>("");
  
  const { ready, getNextGuess, updateByFeedback, reset } = useKnuthWorker();
  
  const [player1, setPlayer1] = useState('');
  const [player1Secret, setPlayer1Secret] = useState("");
  const [computerSecret, setComputerSecret] = useState(""); // or generated

  useEffect(() => {
  if (difficulty === DifficultyLevel.EASY) {
    computerGuesserRef.current = new EasyComputerGuesser();
  } else if (difficulty === DifficultyLevel.MEDIUM) {
    computerGuesserRef.current = new MediumComputerGuesser();
  } else if (difficulty === DifficultyLevel.HARD) {
    // Worker handles HARD; no class instance needed.
    computerGuesserRef.current = null;
  } else {
    computerGuesserRef.current = new MediumComputerGuesser();
  }
}, [difficulty]);

  const [inputDialogOpen, setInputDialogOpen] = useState(true);
  const [open, setOpen] = useState(false);

  const [quitModalOpen, setQuitModalOpen] = useState(false);

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
  const restartGame: () => void = useCallback(() => {
    setGameOver(false);
    setPlayer1("");
    setPlayer1Secret("");
    setComputerSecret("");
    setInputDialogOpen(true);
    setComputerIsThinking(false);
    setCurrentPlayer("Player 1");
    setGuesses({});
    setFeedbacks({});
    setCurrentGuess("");
    setCurrentFeedback(undefined);
    setWinnerName("");
    setOpen(false);
    setDifficulty(undefined);
    setDifficultyColor("");
    computerGuesserRef.current?.reset();
    if(difficulty === DifficultyLevel.HARD) reset();
  }, [difficulty, reset])

  /*Handle Closing the QuitGame Modal */
  const handleCloseQuitModal = useCallback(() => {
    setQuitModalOpen(false);
  }, []);

  const handleQuitGame = useCallback(() => {
    setQuitModalOpen(false);
    restartGame();
    router.push('/');
  }, [restartGame, router]);

  /* Handle Player Guesses */
  const handleGuess: (guess: string) => void = useCallback((guess: string) => {
    if (!guess || guess.length !== 4) {
      toast("Please enter a valid 4-digit guess.");
      return;
    }
    //const opponentSecret = currentPlayer === 'Player 1' ? player2Secret : player1Secret;
    const feedback = compareGuess(computerSecret, guess);
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
      setWinnerName(player1);
      setGameOver(true);
      setCurrentFeedback(undefined);
      return;
    }
  }, [computerSecret, currentPlayer, player1]);

  /* Switch Player Turns */
  // IMPORTANT: make HARD async and wait for worker
  const toggleTurn = useCallback(async () => {
    setComputerIsThinking(true);
    setCurrentPlayer("Computer");

    // tiny delay to show “thinking…”
    await new Promise((r) => setTimeout(r, 3000));

    try {
      let guess = "";

      if (difficulty === DifficultyLevel.HARD) {
        if (!ready) {
          // if user clicked super fast before worker ready, wait a bit
          await new Promise((r) => setTimeout(r, 50));
        }
        const isFirst = (guesses["Computer"]?.length || 0) === 0;
        guess = await getNextGuess(isFirst);   // <-- WAIT for worker
      } else {
        guess = computerGuesserRef.current?.makeGuess?.() ?? "";
      }

      const fb = compareGuess(player1Secret, guess);

      if (difficulty === DifficultyLevel.HARD) {
        updateByFeedback(guess, fb);           // narrow candidate set in worker
      } else {
        computerGuesserRef.current?.updatePossibleSecrets?.(guess, fb);
      }

      setCurrentGuess(guess);
      setCurrentFeedback(fb);
      setGuesses((p) => ({ ...p, Computer: [...(p.Computer || []), guess] }));
      setFeedbacks((p) => ({ ...p, Computer: [...(p.Computer || []), fb] }));
      setComputerIsThinking(false);

      // Finish turn after showing feedback briefly
      if(fb.dead === 4) {
        setTimeout(() => {
          setWinnerName("Computer");
          setGameOver(true);
        }, 1500);
      } else {
        setTimeout(() => {
          setCurrentPlayer("Player 1");
          setCurrentGuess("");
          setCurrentFeedback(undefined);
        }, 2500)
      }
      
    } catch (err) {
      console.error(err);
      setComputerIsThinking(false);
      toast("Computer had an issue thinking of a guess.");
    }
  }, [difficulty, ready, guesses, player1Secret, getNextGuess, updateByFeedback]);

  const gameBoard = useMemo<PVCGameboardProps>(() => ({
    playerName: player1,
    playerSecret: player1Secret,
    guesses: guesses[currentPlayer] || [],
    feedbacks: feedbacks[currentPlayer] || [],
    currentPlayer: currentPlayer === 'Computer' ? 'Computer' : player1,
    isComputer: currentPlayer === 'Computer',
    computerIsThinking,
    computerGuess: currentGuess,
    currentFeedback,
    handleGuess,
    handleToggle: toggleTurn,
  }), [
    player1,
    player1Secret,
    guesses,
    feedbacks,
    currentPlayer,
    computerIsThinking,
    currentGuess,
    currentFeedback,
    handleGuess,
    toggleTurn
  ]);

  /* Save player names and secret numbers */
  const handleInput = useCallback((name: string, secret: string, difficulty?: DifficultyLevel) => {
    /*if (!name || !secret) {
      toast("Name and secret must be provided.");
      return;
    }*/

    if(difficulty) {
      setDifficulty(difficulty);
      if(difficulty === DifficultyLevel.EASY) {
        setDifficultyColor("bg-green-300");
      } else if(difficulty === DifficultyLevel.MEDIUM) {
        setDifficultyColor("bg-yellow-400");
      } else if(difficulty === DifficultyLevel.HARD) {
        setDifficultyColor("bg-red-400");
      }
    };

    setPlayer1(name);
    setPlayer1Secret(secret);
    setOpen(false);

    setInputDialogOpen(false); 
    const computerSecret = generateComputerGuess();
    setComputerSecret(computerSecret);
    setCurrentPlayer('Player 1'); // Switch back to Player 1 after setting Computer
  }, []);

  const inputDialogProps = useMemo(() => ({
    mode: "pvc",
    handleInput: handleInput,
  }), [handleInput]);

  return (
    <div className='flex flex-col self-start gap-4 w-full max-w-full p-4 mx-auto sm:p-7 text-gray-700 font-[family-name:var(--font-geist-sans)]'>
      <div className="flex flex-col items-center gap-4 mb-3">
        <div className="flex justify-center items-center gap-10 sm:gap-20">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800"> Player vs Computer</h2>
          {difficulty && <Badge className={`py-1 ${difficultyColor}`}>Level: {difficulty.toUpperCase()}</Badge> }
        </div>
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
              <InputDialog {...inputDialogProps} />
            </Dialog> 
          </div>
        )} 
      </div>
      <Separator className="" />
      {!inputDialogOpen && (
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4 p-2">
          <div className="flex sm:flex-col items-center gap-10 sm:gap-2 mb-10 sm:mb-0 sm:self-start">
            <Popover>
              <PopoverTrigger>
                <div className="flex items-center gap-1 cursor-help">
                  <Info size="18" className="" />
                  <span className="font-semibold">Guide</span>
                </div>
              </PopoverTrigger>
              <PopoverContent>
                <p className="text-sm text-gray-600"> 
                  <code>x d (dead)</code> ➡️ x correct digits in the correct position.
                </p>
                <p className="text-sm text-gray-600"> 
                  <code>x inj (injured)</code> ➡️ x correct digits, but in the wrong position.
                </p>
              </PopoverContent>
            </Popover>
            
            <Dialog open={quitModalOpen} onOpenChange={setQuitModalOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="p-2 transition duration-250 ease-in-out bg-red-400 text-white hover:bg-red-500 hover:text-white hover:scale-110 cursor-pointer"
                >
                  Quit Game
                </Button>
              </DialogTrigger>
              <QuitGameModal 
                onClose={handleCloseQuitModal} 
                onQuit={handleQuitGame}
              ></QuitGameModal>
            </Dialog>
          </div>
          
          <div className="flex-1">
            <PVCGameBoard {...gameBoard as PVCGameboardProps} />
          </div>
        </div>
      )}
      <GameOverModal
        winnerName={winnerName}
        open={gameOver}
        isWinner={winnerName === player1}
        onRestart={restartGame}
        winnerSecret={winnerName === 'Computer' ? computerSecret : player1Secret}
      />
    </div>
  )
}