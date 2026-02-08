'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { listenToGame, listenToMoves } from '@/firebase/gameService';
import { submitGuessFn, toggleTurnFn } from '@/firebase/functionClient';
import { PlayerMove, PVPGameState } from '@/lib/types';
import {
    Dialog,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { QuitGameModal } from '@/components/quitGameModal';
import { useAuth } from '@/components/auth/AuthProvider';
    
const GameOverModal = dynamic(() => import('@/components/gameOverModal'), {
    ssr: false,
});

const PlayerAvatar = dynamic(() => import('@/components/playerAvatar'), {
    ssr: false,
});

const PVPGameBoard = dynamic(() => import('@/components/pvpGameBoard'), {
    ssr: false
});

export default function GameRoomPage() {
    const { gameId } = useParams();
    const { uid, loading: authLoading, error: authError } = useAuth();
    const router = useRouter();

    const [gameState, setGameState] = useState<PVPGameState>();
    const [gameMoves, setGameMoves] = useState<PlayerMove[]>([]);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const [quitModalOpen, setQuitModalOpen] = useState(false);
    //const [coinFlipModalOpen, setCoinFlipModalOpen] = useState(false);

    useEffect(() => {
        if (!gameId) return;

        if(!uid) return;//wait until auth is ready

        const unsubscribeGame = listenToGame(gameId as string, setGameState);
        const unsubscribeMoves = listenToMoves(gameId as string, setGameMoves);

        return () => {
            unsubscribeGame();
            unsubscribeMoves();
        }
    }, [gameId, uid]);

    if (!gameId) {
        return <h2>Invalid game link.</h2>;
    };

    if (authLoading) return <h2>Loading...</h2>;
    if (authError) return <h2>Auth error. Please refresh.</h2>;
    if (!uid) return <h2>Please refresh.</h2>;
    
    if (!gameState) {
        return <h2>Loading game...</h2>;
    } else if (gameState.player2 === null) {
        return <h2 className='font-bold'>Waiting for other player to join...</h2>;
    }
    else {
        const isMyTurn = gameState.currentTurn === uid;
        const myInfo = gameState.player1.id === uid ? gameState.player1 : gameState.player2;
        const opponent = gameState.player1.id === uid ? gameState.player2 : gameState.player1;

        const winnerName =
            gameState.gameOver && gameState.winner
                ? gameState.winner === uid
                    ? myInfo.name
                    : opponent.name
                : "";


        const handleGuess = async (guess: string) => {
            if (!isMyTurn) return;

            if (!guess || guess.length !== 4) {
                toast("Please enter a valid 4-digit guess.");
                return;
            }
            
            try {
                await submitGuessFn(gameId as string, guess);
                setSubmitSuccess(true);
            } catch (error: unknown) {
                console.error("Error submitting guess:", error);
                toast.error(error instanceof Error ? error.message : "Failed to submit guess.");
            }
        };

        const handleToggleTurn = async () => {
            try {
                await toggleTurnFn(gameId as string);
                setSubmitSuccess(false); // Reset success state after toggling turn
                return;
            } catch (error) {
                console.error("Error toggling turn:", error);
                toast.error("Failed to end turn. Please try again.");
            }
        };

        const startNewGame = () => {
            setSubmitSuccess(false);
            router.push('/');
        };

        /*Handle Closing the QuitGame Modal */
        const handleCloseQuitModal = () => {
            setQuitModalOpen(false);
        };
        
        const handleQuitGame = () => {
            setQuitModalOpen(false);
            startNewGame();
        };
        

        return (
            <div className='flex flex-col self-start gap-4 w-full max-w-full p-4 mx-auto sm:p-7 text-gray-700 font-[family-name:var(--font-geist-sans)]'>
                <div className="flex justify-center items-center gap-10 sm:gap-20">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800"> Player vs Player</h2>
                    <div className='flex self-end gap-2'>
                        <PlayerAvatar name={gameState.player1.name} isCurrentTurn={gameState.currentTurn === gameState.player1.id}  />
                        <PlayerAvatar name={gameState.player2.name} isCurrentTurn={gameState.currentTurn === gameState.player2.id}  />
                    </div>
                </div>
                <Separator className="" />
                <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4 p-2">
                    <div className="flex sm:flex-col items-center gap-10 sm:gap-2 mb-7 sm:mb-0 sm:self-start">
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
                        <PVPGameBoard 
                            gameState={gameState} 
                            gameMoves={gameMoves} 
                            myPlayerId={uid} 
                            submitSuccess={submitSuccess}
                            disabled={!isMyTurn}
                            onGuess={handleGuess}
                            onToggleTurn={handleToggleTurn}
                        />
                    </div>
                </div>   
                {gameState.gameOver && (
                    <GameOverModal
                        winnerName={winnerName}
                        open
                        onRestart={startNewGame}
                        isWinner={gameState.winner === uid}
                        opponentName={opponent.name}
                        winnerSecret={gameState.revealedSecret}
                    />
                )}
            </div>
        );
    }
}
