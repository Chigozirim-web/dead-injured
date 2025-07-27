'use client';
//import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center self-center p-20 sm:p-20 text-center font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome to the Dead & Injured game!</h1>
      <p className="text-md sm:text-lg text-blue-400 mt-2">
        Guess the number in a fun and engaging way.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-10 w-full max-w-md">
        <Link href="/play/pvp" className="w-full">
          <Button
            variant="outline"
            type="button"
            className="w-full border-blue-400 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold hover:text-gray-500 cursor-pointer"
          >
            Player vs Player
          </Button>
        </Link>

        <span className="font-bold text-gray-700">OR</span> 
        
        <Link href="/play/pvc" className="w-full">
          <Button
            variant="outline" 
            className="w-full border-blue-400 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold hover:text-gray-500 cursor-pointer"
          >
            Player vs Computer
          </Button>
        </Link>
      </div>
    </div>
  );
}
