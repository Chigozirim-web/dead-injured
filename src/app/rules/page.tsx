import { BicepsFlexed, SquareArrowOutUpRight, BookOpenText, Check } from 'lucide-react';
import Link from 'next/link';

export default function RulesPage() {
  return (
    <div className="grid grid-rows-[20px_1fr] gap-7 items-center justify-items-center p-10 sm:p-10 font-[family-name:var(--font-geist-sans)]">
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
            So, for instance, <strong><code>1231</code></strong> is not valid.
          </p>
        </div>
        <div className="mt-9 text-center text-gray-600">
          <h3 className="text-md text-sky-900">
            Got the rules? Now, go ahead and play😊
          </h3>
          <Link href="/play/pvp" className=" mt-3 inline-block bg-sky-600 text-white px-4 py-2 rounded-lg shadow hover:bg-sky-700 transition">
            Player vs Player <SquareArrowOutUpRight size={16} className="inline-block ml-1" />
          </Link>
          &nbsp; <strong>OR</strong> &nbsp; 
          <Link href="/play/pvc" className="inline-block bg-sky-600 text-white px-4 py-2 rounded-lg shadow hover:bg-sky-700 transition">
            Player vs Computer <SquareArrowOutUpRight size={16} className="inline-block ml-1" />
          </Link>
        </div>
        <p className='text-center text-sm mt-4 text-gray-500'>
          May the best guesser win!
            <BicepsFlexed size={19} className="inline-block ml-2 mb-1 text-sky-700" />
        </p>
      </div>
    </div>
  );
}