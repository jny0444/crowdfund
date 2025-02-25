"use client";

import { motion, AnimatePresence } from "motion/react";
import { Loader2 } from "lucide-react";

interface TransitionOverlayProps {
  isVisible: boolean;
  message: string;
}

export default function TransitionOverlay({ isVisible, message }: TransitionOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="text-white text-2xl font-text flex items-center gap-3"
          >
            <Loader2 size={32} className="animate-spin text-purple-500" />
            {message}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 