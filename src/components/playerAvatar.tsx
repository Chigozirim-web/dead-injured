
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { PlayerAvatarProps } from "@/lib/types";

export function PlayerAvatar({ name, isCurrentTurn}: PlayerAvatarProps) {
    const initials = name
        ? name.slice(0, 2).toUpperCase()
        : "?";

    const avatarContent = (
        <Avatar className={`size-9 border-2 ${isCurrentTurn ? "border-sky-500" : "border-gray-400"}`}>
            <AvatarFallback className="text-lg font-bold">{initials}</AvatarFallback>
        </Avatar>
    );

    // Apply animation only if it's the current turn
    return isCurrentTurn ? (
        <motion.div
            animate={{ scale: [1, 1.1, 1], boxShadow: ["0px 0px 0px rgba(0,0,255,0)", "0px 0px 20px rgba(36, 138, 201, 0.7)", "0px 0px 0px rgba(0,0,255,0)"] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-9 h-9 rounded-full flex items-center justify-center"
        >
            {avatarContent}
        </motion.div>
    ) : (
        avatarContent
    );
}