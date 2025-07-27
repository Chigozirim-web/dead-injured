import { House } from 'lucide-react';
import Link from 'next/link';
import Image from "next/image";
import logo from "../../public/images/logo.png"; // Adjust the path as necessary

const navLinks = [
    { name: "Rules", path: "/rules" },
    { name: "About", path: "/about" },
];

export default function NavBar(){
    return (
        <nav className="w-full bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-2xl font-bold text-green-600">
                            <Image className="w-25 mr-3" src={logo} alt="Logo" />
                        </Link>
                    </div>
                    <div className="flex space-x-4 items-center">
                        <Link href="/" className="hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                            <House size={21} />
                        </Link>
                        
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.path}
                                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                    {/**
                     * <div className="md:hidden">
                            {/* Mobile menu button (optional, for expansion) 
                            <button
                                type="button"
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
                                aria-label="Open main menu"
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    */}
                </div>
            </div>
        </nav>
    )
};