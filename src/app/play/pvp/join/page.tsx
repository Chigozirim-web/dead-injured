'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { joinGame } from '@/firebase/gameService';

import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { isUniqueDigits } from '@/lib/logic';
import { REGEXP_ONLY_DIGITS } from 'input-otp';

export default function JoinGamePage() {
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [secret, setSecret] = useState('');
    const [error, setError] = useState("");

    const router = useRouter();

    const handleChange = (val: string) => {
        setSecret(val);
        setError(""); // clear error while typing
    };
    
    const handleComplete = (val: string) => {
        if (!isUniqueDigits(val)) {
            setError("Digits must be unique and 4 total.");
        } else {
            setError("");
            setSecret(val);
            // You can call setSecret(val) or move to next step
        }
    };

    const handleJoin = async () => {
        if(!code.trim() || !name.trim() || !secret.trim()) {
            toast.error("Please fill in all fields.");
            return
        }
        if (!isUniqueDigits(secret)) {
            setError("Secret must be a 4-digit number with unique digits.");
            return;
        }

        try {
            await joinGame(code.trim().toUpperCase(), name, secret);
            toast.success("Successfully joined the game!");
            router.push(`/play/pvp/game/${code}`);
        } catch (e) {
            console.error("Error joining game:", e);
            const errorMessage = (e instanceof Error) ? e.message : String(e);
            toast.error(`Error joining game: ${errorMessage}`);
        }
    };

    return (
        <div className="flex flex-col p-5 items-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Join Game with Code</h2>
            <div className="grid gap-4 border p-6 sm:p-10 rounded-lg bg-gray-50">
                <div className="grid gap-2 mb-2">
                    <label htmlFor="game-code" className="text-sm font-medium text-gray-700">Game Code:</label>
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Enter game code"
                        className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                </div>
                <div className="grid gap-2 mb-2">
                    <label htmlFor="player" className="text-sm font-medium text-gray-700">Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                </div>
                <div className="grid gap-2 mb-4">
                    <label htmlFor="playerSecret" className="text-sm font-medium text-gray-700">Secret Number:</label>
                    {error && <p className="font-bold text-sm text-red-500">{error}</p>}
                    <InputOTP
                        maxLength={4}
                        pattern={REGEXP_ONLY_DIGITS}
                        value={secret}
                        onChange={handleChange}
                        onComplete={handleComplete}
                    >
                        <InputOTPGroup className='space-x-2'>
                            <InputOTPSlot index={0} className='rounded-md border-l border-sky-200' />
                            <InputOTPSlot index={1} className='rounded-md border-l border-sky-200' />
                            <InputOTPSlot index={2} className='rounded-md border-l border-sky-200' />
                            <InputOTPSlot index={3} className='rounded-md border-l border-sky-200' />
                        </InputOTPGroup>
                    </InputOTP>
                    <div className='text-xs text-gray-500'>
                        The number must have non-repeating digits
                    </div>
                </div>
                <Button 
                    variant="outline" 
                    className='w-full sm:w-auto bg-sky-600 text-white px-4 py-2 rounded-lg shadow hover:text-white hover:bg-sky-700 transition text-center cursor-pointer'
                    onClick={handleJoin}
                >
                    Submit
                </Button>
            </div>
        </div>
    );
}