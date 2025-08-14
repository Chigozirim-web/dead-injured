import { BicepsFlexed, SquareArrowOutUpRight, BookOpenText, Check } from 'lucide-react';
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
import { Button } from "@/components/ui/button";

export default function RulesPage() {
  return (
    <div className="grid grid-rows-[20px_1fr] gap-7 items-center justify-items-center p-10 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-3xl font-bold text-sky-700">
        Rules
        <BookOpenText size={30} className="inline-block ml-2 text-sky-700" />
      </h1>
      <div className="flex flex-col bg-white border border-gray-300 p-8 rounded-md">
        <p className="text-md text-center mb-4 text-sky-700">
          Think Wordle, but with numbers!
        </p>
        <ul className="pl-5 text-gray-500">
          <li className="mb-2">
            <Check size={16} className="inline-block mr-2 text-sky-700" />
            <span>Guess a 4-digit number with unique digits.</span>
          </li>
          <li className="mb-2">
            <Check size={16} className="inline-block mr-2 text-sky-700" />
            Receive feedback in the form of &quot;dead&quot; and &quot;injured&quot;.
          </li>
          <li className="mb-2">
            <Check size={16} className="inline-block mr-2 text-sky-700" />
            <strong>&quot;Dead&quot;</strong> means a digit is correct and in the right position.
          </li>
          <li className="mb-2">
            <Check size={16} className="inline-block mr-2 text-sky-700" />
            <strong>&quot;Injured&quot;</strong> means a digit is correct but in the wrong position.
          </li>
          <li className="mb-2">
            <Check size={16} className="inline-block mr-2 text-sky-700" />
            First to guess the number wins!
          </li>
          <li className="mb-2">
            <Check size={16} className="inline-block mr-2 text-sky-700" />
            Tip: When setting your secret number, try not to choose one that is too easy to guess.
          </li>
        </ul>
        <div className='bg-gray-50 p-5 mt-6 text-md rounded-lg shadow-sm'>
          <h3 className="mb-4 font-bold text-sky-700">Example Game Play</h3>
          <p className="text-gray-500 mt-2">
            Secret number ➡️ <code>9876</code>
          </p>
          <p className="text-gray-500">Your guess ➡️ <code>9760</code> </p>
          <p className="text-gray-500">Feedback: </p>
          <ul className="pl-5 text-gray-500 mt-2">
            <li className="mb-2">
              <Check size={16} className="inline-block mr-2 text-sky-700" />
              1 <strong>dead</strong>  (9 is correct and in the right position)
            </li>
            <li className="mb-2">
              <Check size={16} className="inline-block mr-2 text-sky-700" />
              2 <strong>injured</strong> (7 and 6 are correct but in the wrong positions)
            </li>
          </ul>
          <p className="text-sm text-gray-500 mt-2">
            Note: the number must have non-repeating digits.
            For instance, <strong><code>1231</code></strong> is not valid.
          </p>
        </div>
        <div className="mt-9 w-full text-center text-gray-600">
          <h3 className="text-md text-sky-900 mb-4">
            Got the rules? Now, go ahead and play😊
          </h3>
          <div className="flex flex-col sm:flex-row sm:justify-center items-center gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  type="button"
                  className="w-full sm:w-auto bg-sky-600 text-white rounded-lg shadow hover:bg-sky-700 transition text-center hover:text-white cursor-pointer"
                >
                  Player vs Player
                  <SquareArrowOutUpRight size={16} className="inline-block ml-1" />
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
                      className="transition duration-250 ease-in-out bg-red-400 text-white hover:bg-red-500 hover:text-white hover:scale-110 cursor-pointer"
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog> 

            <span className="font-bold text-gray-700 hidden sm:inline-block">OR</span>

            <Link
              href="/play/pvc"
              className='w-full sm:w-auto'
            >
              <Button
                variant="outline"
                className="w-full sm:w-auto bg-sky-600 text-white rounded-lg shadow hover:bg-sky-700 hover:text-white cursor-pointer transition text-center"
              >
                 Player vs Computer{" "}
                <SquareArrowOutUpRight size={16} className="inline-block ml-1" />
              </Button>
            </Link>
          </div>
        </div>
        <p className='text-center text-sm mt-4 text-gray-500'>
          May the best guesser win!
            <BicepsFlexed size={19} className="inline-block ml-2 mb-1 text-sky-700" />
        </p>
      </div>
    </div>
  );
}