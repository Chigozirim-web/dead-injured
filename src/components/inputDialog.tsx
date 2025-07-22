import { ReactElement, useState } from 'react';
import { isUniqueDigits } from "@/lib/logic";
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";


type InputDialogProps = {
  handleInput: (name: string, secret: string) => void;
};

export const InputDialog = ({ handleInput }: InputDialogProps): ReactElement => {
    //const { mode } = props;
    const [secret, setSecret] = useState("");
    const [error, setError] = useState("");
    const [name, setName] = useState("");

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

    return (
        <DialogContent className="sm:max-w-xl">
          <DialogHeader className=''>
            <DialogTitle>Welcome!</DialogTitle>
            <DialogDescription>
              Please enter your name and secret number to continue:
              <br />
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
                <label htmlFor="player" className="text-sm font-medium text-gray-700">Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>
            <div className="grid gap-3">
                <label htmlFor="playerSecret" className="text-sm font-medium text-gray-700">Secret Number:</label>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <InputOTP
                    maxLength={4}
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
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={(): void => handleInput(name, secret)}>Save changes</Button>
            {/* TODO: Button saves secret even if it contains repeating digits. Change this...  */}
          </DialogFooter>
        </DialogContent>  
    );
}

/**
 * <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
            <h1 className="text-2xl font-bold mb-4 text-center">Welcome!</h1>
            <p className="mb-6 text-center text-gray-600">Please enter your name to continue:</p>
            <form className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Your name"
                    className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                >
                    Continue
                </button>
            </form>
        </div>
    </div>
 */