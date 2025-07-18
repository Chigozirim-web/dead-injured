'use client';
//import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center mt-10 p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-3xl font-bold text-gray-900">Welcome to the Dead & Injured game!</h1>
      <p className="text-lg text-blue-400 mt-2">
        Guess the number in a fun and engaging way.
      </p>
      <div className="flex items-center gap-7 mt-15">
        <Link href="/play/pvp" className="text-gray-700 hover:text-blue-600">
          <Button
            variant="outline"
            type="button"
            className="p-5 w-3xs border-blue-400 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold hover:text-gray-500 cursor-pointer"
          >
            Player vs Player
          </Button>
        </Link>

        <span className="font-bold text-gray-700">OR</span> 
        
        <Link href="/play/pvc" className="text-gray-700 hover:text-blue-600">
          <Button
            variant="outline" 
            className="p-5 w-3xs border-blue-400 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold hover:text-gray-500 cursor-pointer"
          >
            Player vs Computer
          </Button>
        </Link>
      </div>
    </div>
  );
}
