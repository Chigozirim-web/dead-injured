'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { listenToGame, listenToMoves, submitGuess, toggleTurn, winGame } from '@/firebase/gameService';
import { PlayerMove, PVPGameState } from '@/lib/types';
import {
    Dialog,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { PVPGameBoard } from '@/components/pvpGameBoard';
import { compareGuess } from '@/lib/logic';
import { toast } from 'sonner';
import GameOverModal from '@/components/gameOverModal';
import { PlayerAvatar } from '@/components/playerAvatar';
import { QuitGameModal } from '@/components/quitGameModal';

export default function GameRoomPage() {
    const { gameId } = useParams();
    const router = useRouter();

    const [gameState, setGameState] = useState<PVPGameState>();
    const [gameMoves, setGameMoves] = useState<PlayerMove[]>([]);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [myPlayerId, setMyPlayerId] = useState<string | null>(null);
    
    const [winnerName, setWinnerName] = useState("");

    const [quitModalOpen, setQuitModalOpen] = useState(false);

    useEffect(() => {
        const storedId = localStorage.getItem("myPlayerId");
        if (storedId) {
            setMyPlayerId(storedId);
        }
    }, []);

    useEffect(() => {
        if (!gameId) return;

        const unsubscribeGame = listenToGame(gameId as string, setGameState);
        const unsubscribeMoves = listenToMoves(gameId as string, setGameMoves);

        console.log("Winner Name:", winnerName);    
        return () => {
            unsubscribeGame();
            unsubscribeMoves()
        } 
    }, [gameId, winnerName]);

    if (!myPlayerId) {
        return <h2 className='font-bold'>Please start or join a game first.</h2>;
    }
    
    if (!gameState) {
        return <h2>Loading game...</h2>;
    } else if (gameState.player2 === null) {
        return <h2 className='font-bold'>Waiting for other player to join...</h2>;
    }
    else {
        const isMyTurn = gameState.currentTurn === myPlayerId;
        const myInfo = gameState.player1.id === myPlayerId ? gameState.player1 : gameState.player2;

        const opponent = gameState.player1.id === myPlayerId ? gameState.player2 : gameState.player1;

        const handleGuess = async (guess: string) => {
            if (!isMyTurn) return;

            if (!guess || guess.length !== 4) {
                toast("Please enter a valid 4-digit guess.");
                return;
            }

            const feedback = compareGuess(opponent.secretNumber, guess);
            const move: PlayerMove = {
                playerId: myPlayerId,
                guess,
                result: feedback,
            };
            try {
                await submitGuess(gameId as string, move);
                setSubmitSuccess(true);
                if(feedback.dead === 4) {
                    try {  
                        await winGame(gameId as string, myPlayerId);
                        setWinnerName(gameState.player1.id === myPlayerId ? gameState.player1.name : gameState.player2?.name || "Unknown");
                    } catch (error) {
                        console.error("Error winning game:", error);
                        toast.error("Failed to declare winner. Please try again.");
                    }
                }
                return;
            } catch (error) {
                console.error("Error submitting guess:", error);
                toast.error("Failed to submit guess. Please try again.");
            }
        };

        const handleToggleTurn = async (playerId: string) => {
            if (gameState.currentTurn === playerId) return; // Prevent toggling if it's already the player's turn
            if(playerId === "") {
                toast.error("System Error: Invalid player ID for toggling turn.");
                return;
            }

            try {
                await toggleTurn(gameId as string, playerId);
                setSubmitSuccess(false); // Reset success state after toggling turn
                return;
            } catch (error) {
                console.error("Error toggling turn:", error);
                toast.error("Failed to end turn. Please try again.");
            }
        };

        const startNewGame = () => {
            setWinnerName("");
            setSubmitSuccess(false);
            setMyPlayerId(null);
            localStorage.removeItem("myPlayerId");
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
                        <HoverCard>
                            <HoverCardTrigger>
                                <div className="flex items-center gap-1 cursor-help">
                                    <Info size="18" className="" />
                                    <span className="font-semibold">Guide</span>
                                </div>
                            </HoverCardTrigger>
                            <HoverCardContent>
                                <p className="text-sm text-gray-600"> 
                                    <code>x d (dead)</code> ➡️ x correct digits in the correct position.
                                </p>
                                <p className="text-sm text-gray-600"> 
                                    <code>x inj (injured)</code> ➡️ x correct digits, but in the wrong position.
                                </p>
                            </HoverCardContent>
                        </HoverCard>
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
                            myPlayerId={myPlayerId} 
                            submitSuccess={submitSuccess}
                            disabled={!isMyTurn}
                            onGuess={handleGuess}
                            onToggleTurn={handleToggleTurn}
                        />
                    </div>
                </div>   
                <GameOverModal
                    winnerName={gameState.winner === myPlayerId ? myInfo.name : opponent.name}
                    open={gameState.gameOver}
                    onRestart={startNewGame}
                    isWinner={gameState.winner === myPlayerId}
                    opponentName={opponent.name}
                    winnerSecret={opponent.secretNumber}
                />  
            </div>
        );
    }
}
