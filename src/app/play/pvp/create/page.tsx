'use client';
import { useCallback, useMemo, useState } from "react";
import { createGameFn } from "@/firebase/functionClient";
import { InputDialog } from "@/components/inputDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";

import { Copy } from 'lucide-react';
import { toast } from "sonner";
import { InputDialogProps } from "@/lib/types";

export default function CreateGamePage() {

    const [open, setOpen] = useState(false);
    const [gameCreated, setGameCreated] = useState(false);
    const [gameCode, setGameCode] = useState(""); 

    const handleCreateGame = useCallback(async (name: string, secret: string) => {
        setOpen(false);
        setGameCreated(true);
        try {
            const gameId = await createGameFn(name, secret);
            setGameCode(gameId);
        } catch (error: unknown) {
            console.error("Error creating game:", error);
            toast.error(error instanceof Error ? error.message : "Failed to create game.");
            setGameCreated(false);
            return;
        };
    }, []);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(gameCode);
            toast.success("Game code copied to clipboard!");
        } catch (error) {
            console.error("Failed to copy game code:", error);
            toast.error("Failed to copy");
        }
    };

     const inputProps = useMemo<InputDialogProps>(() => ({
        mode: "pvp",
        handleInput: handleCreateGame,
      }), [handleCreateGame]);

    return (
        <div className="flex flex-col p-5 items-center">
            {gameCreated ? 
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Game Created🎉</h1>
                : <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Create New Game</h1>
            }
            <div className="">
                { gameCreated ? (
                    <div className="flex flex-col items-center border p-6 sm:p-10 rounded-lg bg-gray-100">
                        <h3 className="font-semibold mb-4">Send code to player to join your game</h3>
                        <div className="flex gap-2 items-center mb-5">
                            <Input className="text-center" value={gameCode} readOnly/>
                            <Copy
                                size={24}
                                className="inline-block cursor-pointer text-gray-500 hover:text-gray-700" 
                                onClick={handleCopy}
                            />
                        </div>
                        <Link 
                            href={`/play/pvp/game/${gameCode}`}
                            className="w-full sm:w-auto bg-sky-600 text-white px-4 py-2 rounded-lg shadow hover:bg-sky-700 transition text-center"
                        >
                            Go to game 
                        </Link>
                    </div>
                ) : 
                (
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
                        <InputDialog {...inputProps}/>
                    </Dialog> 
                )}
            </div>
        </div>
        
    );
}