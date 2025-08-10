import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QuitGameModalProps } from "@/lib/types";

export function QuitGameModal({ onClose, onQuit }: QuitGameModalProps) {
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Quit Game</DialogTitle>
                <DialogDescription>
                    Are you sure you want to quit the game? Your progress will be lost.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline" className="cursor-pointer" onClick={onClose}>
                        Cancel
                    </Button>
                </DialogClose>
                <Button className='cursor-pointer bg-red-500 hover:bg-red-600' onClick={onQuit}>
                    Quit
                </Button>
            </DialogFooter>
        </DialogContent>
    );
}