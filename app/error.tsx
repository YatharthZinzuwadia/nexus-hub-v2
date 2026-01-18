"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="relative w-full h-screen bg-background flex flex-col items-center justify-center overflow-hidden">
      {/* Grid pattern background */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <motion.div
        className="relative z-10 text-center px-4 max-w-md"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 border border-destructive/20 mb-6">
          <AlertCircle className="w-8 h-8 text-destructive" strokeWidth={1.5} />
        </div>

        <h2
          className="text-2xl md:text-3xl text-foreground font-bold mb-2 tracking-tight"
          style={{ fontFamily: "IBM Plex Mono, monospace" }}
        >
          CRITICAL_FAILURE
        </h2>

        <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
          An unexpected runtime error has occurred in the neural interface.
          <br />
          <span className="text-xs opacity-70 mt-2 block font-mono bg-secondary p-2 rounded border border-border/30 overflow-hidden text-ellipsis whitespace-nowrap">
            {error.message || "Unknown Error"}
          </span>
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.button
            onClick={reset}
            className="flex items-center space-x-2 px-6 py-3 bg-secondary text-foreground rounded-sm hover:bg-secondary/80 border border-border/30 transition-all w-full sm:w-auto justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RefreshCw className="w-4 h-4" />
            <span style={{ fontFamily: "IBM Plex Mono, monospace" }}>
              REBOOT_SYSTEM
            </span>
          </motion.button>

          <Link href="/" className="w-full sm:w-auto">
            <motion.button
              className="flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-sm hover:bg-destructive border border-primary transition-all w-full justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Home className="w-4 h-4" />
              <span style={{ fontFamily: "IBM Plex Mono, monospace" }}>
                SAFE_MODE
              </span>
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
