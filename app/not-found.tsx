"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative w-full h-screen bg-background flex flex-col items-center justify-center overflow-hidden">
      {/* Grid pattern background */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <motion.div
        className="relative z-10 text-center px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary border border-border/30 mb-8"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <AlertTriangle
            className="w-10 h-10 text-destructive"
            strokeWidth={1.5}
          />
        </motion.div>

        <h1
          className="text-6xl md:text-8xl text-foreground font-bold mb-4 tracking-tighter"
          style={{ fontFamily: "IBM Plex Mono, monospace" }}
        >
          404
        </h1>

        <div className="w-24 h-1 bg-primary mx-auto mb-6" />

        <h2 className="text-xl md:text-2xl text-foreground mb-4">
          SYSTEM_ERROR: PAGE_NOT_FOUND
        </h2>

        <p className="text-muted-foreground max-w-md mx-auto mb-8 text-sm md:text-base leading-relaxed">
          The requested path could not be resolved by the neural network. Please
          verify your coordinates and try again.
        </p>

        <Link href="/">
          <motion.button
            className="group flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-sm hover:bg-destructive transition-all duration-200 border border-primary mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span style={{ fontFamily: "IBM Plex Mono, monospace" }}>
              RETURN_HOME
            </span>
          </motion.button>
        </Link>
      </motion.div>

      <div
        className="absolute bottom-8 text-xs text-muted-foreground"
        style={{ fontFamily: "IBM Plex Mono, monospace" }}
      >
        ERR_CODE: NAN_VOID_REFERENCE
      </div>
    </div>
  );
}
