'use client';
//import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

import {
    Dialog,
    DialogTrigger,
    DialogClose,
    DialogHeader,
    DialogTitle,
    DialogContent,
    DialogFooter,
} from "@/components/ui/dialog";

export default function Home() {

  return (
    <div className="flex flex-col items-center self-center p-20 sm:p-20 text-center font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome to the Dead & Injured game!</h1>
      <p className="text-md sm:text-lg text-blue-400 mt-2">
        Guess the number in a fun and engaging way.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-10 w-full max-w-md">
        <Dialog>
          <DialogTrigger asChild>
              <Button
                variant="outline"
                type="button"
                className="border-blue-400 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold hover:text-gray-500 cursor-pointer"
              >
                Player vs Player
              </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-center text-gray-600 p-2 border-b-1 border-gray-400">Welcome to PVP mode!</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center gap-5 py-4 w-full">
              <Link href="/play/pvp/create">
                <Button
                  variant="outline"
                  className="border-2 border-green-500 text-gray-700 font-bold cursor-pointer"
                >
                  Create New Game
                </Button>
              </Link>
              <span className="font-bold text-gray-700">OR</span> 
              <Link href="/play/pvp/join">
                <Button 
                  variant="outline"
                  className="border-2 border-green-500 text-gray-700 font-bold cursor-pointer"
                >
                  Join Game with Code
                </Button>
              </Link>
              
            </div>
            <DialogFooter>
              <DialogClose asChild >
                <Button 
                  variant="outline"
                   className=" transition duration-250 ease-in-out bg-red-400 text-white hover:bg-red-500 hover:text-white hover:scale-110 cursor-pointer"
                >
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog> 

        <span className="font-bold text-gray-700">OR</span> 
        
        <Link href="/play/pvc" className="">
          <Button
            variant="outline" 
            className="border-blue-400 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold hover:text-gray-500 cursor-pointer"
          >
            Player vs Computer
          </Button>
        </Link>
      </div>
    </div>
  );
}
