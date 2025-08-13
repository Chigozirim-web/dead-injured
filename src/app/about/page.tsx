import { Puzzle } from 'lucide-react';

export default function AboutSection() {
    return (
        <div className="grid grid-rows-[20px_1fr] gap-7 items-center justify-items-center p-10 sm:p-10 font-[family-name:var(--font-geist-sans)]">
            <h1 className="text-3xl font-bold text-sky-700">
                About the Game
                <Puzzle size={30} className="inline-block ml-2 text-sky-700" />
            </h1>
            <div className="sm:max-w-1/2 flex flex-col bg-white border border-gray-300 p-8 rounded-md">
                <p className="text-lg/8 text-center text-gray-700 mb-2">
                    In high school, I would play this game called <i className='text-sky-700 font-semibold'>Dead and Injured</i> with my friends.
                    We would strategically try to guess each other&apos;s secret numbers on a piece of paper. 
                </p>
                 <p className="text-lg/8 text-center text-gray-700 mb-2">
                     I loved the thrill of it, so I decided to recreate it as a web app, to be played online.
                 </p>
                <p className="text-lg/8 text-center text-gray-700 mb-2">
                    The game is a fun and interactive way to challenge your friends. <br />
                    It is designed to be simple yet engaging, with a focus on strategy and deduction.
                </p>
            </div>
        </div>
    );
}