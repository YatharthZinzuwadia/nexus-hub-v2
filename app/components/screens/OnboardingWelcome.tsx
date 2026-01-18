"use client";

import {
  ChevronRight,
  Code2,
  Cpu,
  Database,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";
import ParticleField from "../effects/ParticleField";
import { easeOut, motion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * ONBOARDING WELCOME - Fixed for responsiveness and proper animations
 *
 * Fixes:
 * - Removed excessive delays (was 0.1s, now immediate)
 * - Made fully responsive with proper overflow handling
 * - Fixed mobile layout issues
 * - Reduced animation complexity for better performance
 * - Added proper scrolling support
 */

// Simplified page variants - no delay
const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: easeOut,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const leftColumnVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: easeOut,
      staggerChildren: 0.08,
    },
  },
};

const rightColumnVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: easeOut,
      delayChildren: 0.2,
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: easeOut },
  },
};

interface OnboardingWelcomeProps {
  onNext: () => void;
  onSkip: () => void;
}

const OnboardingWelcome = ({ onNext, onSkip }: OnboardingWelcomeProps) => {
  const [snippetIndex, setSnippetIndex] = useState(0);

  const codeSnippets = [
    "const future = await build();",
    "sudo make me_a_developer",
    'git commit -m "ship it"',
    "npm run legendary",
  ];

  useEffect(() => {
    const id = setInterval(() => {
      setSnippetIndex((prev) => (prev + 1) % codeSnippets.length);
    }, 3000);
    return () => clearInterval(id);
  }, [codeSnippets.length]);

  return (
    <div className="relative w-full min-h-screen bg-background flex items-center justify-center overflow-y-auto overflow-x-hidden py-8 md:py-0">
      {/* Background effects */}
      <ParticleField density={150} />
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute inset-0 scan-effect" />

      {/* Main content */}
      <motion.div
        className="relative z-10 w-full max-w-6xl px-4 sm:px-6 md:px-8"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* LEFT COLUMN */}
          <motion.div
            className="space-y-6 md:space-y-8"
            variants={leftColumnVariants}
          >
            {/* Status badge */}
            <motion.div className="inline-block" variants={itemVariants}>
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-secondary border border-border/30 rounded-sm">
                <motion.div
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span
                  className="text-muted-foreground text-xs"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  SYSTEM_ONLINE • v2.1.0
                </span>
              </div>
            </motion.div>

            {/* Hero heading */}
            <div>
              <motion.h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-foreground mb-3 md:mb-4 leading-tight"
                variants={itemVariants}
              >
                Welcome to the
                <br />
                <motion.span
                  className="text-primary"
                  animate={{
                    textShadow: [
                      "0 0 10px rgba(220, 38, 38, 0.5)",
                      "0 0 20px rgba(220, 38, 38, 0.8)",
                      "0 0 10px rgba(220, 38, 38, 0.5)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Developer
                </motion.span>{" "}
                Portal
              </motion.h1>

              <motion.p
                className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-lg"
                variants={itemVariants}
              >
                A portfolio dashboard engineered for those who speak in code,
                dream in algorithms, and build the future one commit at a time.
              </motion.p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 md:gap-4 pt-2">
              {[
                { Icon: Code2, value: "50+", label: "Components" },
                { Icon: Database, value: "99.9%", label: "Uptime" },
                { Icon: Zap, value: "<12ms", label: "Response" },
              ].map(({ Icon, value, label }, index) => (
                <motion.div
                  key={label}
                  className="terminal-glass p-3 md:p-4 rounded-sm border border-border/20 hover:border-primary/50 transition-all duration-300"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <Icon
                    className="w-5 h-5 md:w-6 md:h-6 text-primary mb-2"
                    strokeWidth={1.5}
                  />
                  <div
                    className="text-lg md:text-2xl text-foreground"
                    style={{ fontFamily: "IBM Plex Mono, monospace" }}
                  >
                    {value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4 pt-2"
              variants={itemVariants}
            >
              <motion.button
                onClick={onNext}
                className="group flex items-center justify-center space-x-2 px-6 md:px-8 py-3 md:py-4 bg-primary text-primary-foreground rounded-sm hover:bg-destructive transition-all duration-200 border border-primary relative overflow-hidden"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 text-sm md:text-base">
                  Begin_Tour()
                </span>
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform relative z-10" />
              </motion.button>

              <motion.button
                onClick={onSkip}
                className="px-6 md:px-8 py-3 md:py-4 bg-transparent text-muted-foreground rounded-sm hover:text-foreground hover:bg-secondary transition-all duration-200 border border-border/30 hover:border-primary/50"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-sm md:text-base">Skip_Intro()</span>
              </motion.button>
            </motion.div>

            {/* Code snippet */}
            <motion.div
              className="pt-2 text-muted-foreground text-xs md:text-sm"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
              variants={itemVariants}
            >
              <motion.span
                key={snippetIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                // {codeSnippets[snippetIndex]}
              </motion.span>
            </motion.div>
          </motion.div>

          {/* RIGHT COLUMN - Terminal */}
          <motion.div className="relative" variants={rightColumnVariants}>
            <div className="terminal-glass-strong rounded-sm overflow-hidden border border-border/30 relative">
              {/* Header */}
              <motion.div
                className="flex items-center justify-between px-3 md:px-4 py-2 md:py-3 bg-popover border-b border-border/30"
                variants={itemVariants}
              >
                <div className="flex items-center space-x-2">
                  <motion.div
                    className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-primary"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-muted-foreground" />
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-muted-foreground" />
                </div>
                <span
                  className="text-muted-foreground text-xs"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  nexus_terminal.sh
                </span>
              </motion.div>

              {/* Terminal body */}
              <div
                className="p-4 md:p-6 space-y-2 text-xs md:text-sm"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
              >
                <motion.div
                  className="text-muted-foreground"
                  variants={itemVariants}
                >
                  <span className="text-primary">developer@nexus</span>
                  <span className="text-foreground">:</span>
                  <span className="text-foreground">~/portfolio$</span>
                  <span className="ml-2">./initialize.sh</span>
                </motion.div>

                {[
                  { text: "Compiling future...", status: "OK" },
                  { text: "Loading creativity.dll...", status: "OK" },
                  { text: "Deploying innovation...", status: "OK" },
                  { text: "Initializing AI modules...", status: "OK" },
                ].map(({ text, status }, index) => (
                  <motion.div
                    key={text}
                    className="text-foreground pl-4"
                    variants={itemVariants}
                  >
                    {text} [<span className="text-success">{status}</span>]
                  </motion.div>
                ))}

                <motion.div
                  className="text-muted-foreground pt-4"
                  variants={itemVariants}
                >
                  <span className="text-primary">developer@nexus</span>
                  <span className="text-foreground">:</span>
                  <span className="text-foreground">~/portfolio$</span>
                  <span className="ml-2 cursor-blink">_</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Progress indicator */}
        <motion.div
          className="flex items-center justify-center space-x-3 mt-8 md:mt-12"
          variants={itemVariants}
        >
          <motion.div
            className="w-8 md:w-12 h-1 bg-primary"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          />
          <div className="w-8 md:w-12 h-1 bg-border/30" />
          <div className="w-8 md:w-12 h-1 bg-border/30" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OnboardingWelcome;
