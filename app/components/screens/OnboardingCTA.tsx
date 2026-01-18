"use client";

import { ArrowRight, Coffee, Github, Rocket } from "lucide-react";
import { motion, easeOut } from "motion/react";

interface OnboardingCTAProps {
  onSignIn: () => void;
}

/**
 * ONBOARDING CTA - Fixed for responsiveness
 *
 * Fixes:
 * - Made fully responsive
 * - Added overflow handling
 * - Reduced delays
 * - Fixed mobile layout
 */

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: easeOut,
      when: "beforeChildren",
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

const statsGridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      staggerChildren: 0.08,
    },
  },
};

const OnboardingCTA = ({ onSignIn }: OnboardingCTAProps) => {
  return (
    <div className="relative w-full min-h-screen bg-background flex items-center justify-center overflow-y-auto overflow-x-hidden py-8 md:py-0">
      {/* Grid pattern background */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Animated corner accents */}
      <motion.div
        className="absolute top-0 left-0 w-48 h-48 md:w-64 md:h-64 bg-primary opacity-5 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.08, 0.05] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-primary opacity-5 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.08, 0.05] }}
        transition={{ duration: 4, repeat: Infinity, delay: 2 }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 w-full max-w-4xl px-4 sm:px-6 md:px-8 text-center"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Status indicator */}
        <motion.div
          className="inline-flex items-center space-x-2 px-3 md:px-4 py-1.5 md:py-2 bg-secondary border border-border/30 rounded-sm mb-6 md:mb-8"
          variants={itemVariants}
        >
          <Rocket className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
          <span
            className="text-muted-foreground text-xs md:text-sm"
            style={{ fontFamily: "IBM Plex Mono, monospace" }}
          >
            READY FOR DEPLOYMENT
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-foreground mb-4 md:mb-6 leading-tight"
          variants={itemVariants}
        >
          Your Journey
          <br />
          <span className="text-primary">Begins Here</span>
        </motion.h1>

        <motion.p
          className="text-muted-foreground text-base md:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto mb-8 md:mb-12 px-4"
          variants={itemVariants}
        >
          Join the developers who&apos;ve traded bloated dashboards for
          something truly exceptional. No marketing speak, just honest
          engineering.
        </motion.p>

        {/* CTA Button */}
        <motion.button
          onClick={onSignIn}
          className="group w-full sm:w-auto inline-flex justify-center items-center space-x-2 md:space-x-3 px-6 md:px-8 py-3 md:py-4 bg-primary text-primary-foreground rounded-sm hover:bg-destructive transition-all duration-200 border border-primary mb-8 md:mb-12"
          style={{ fontFamily: "IBM Plex Mono, monospace" }}
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-base md:text-lg">Initialize Session</span>
          <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>

        {/* Social proof / Stats */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto"
          variants={statsGridVariants}
        >
          <motion.div
            className="terminal-glass p-4 md:p-6 rounded-sm border border-border/20 hover:border-primary/50 transition-all"
            variants={itemVariants}
            whileHover={{ y: -3, scale: 1.01 }}
          >
            <Github
              className="w-6 h-6 md:w-8 md:h-8 text-primary mb-2 md:mb-3 mx-auto"
              strokeWidth={1.5}
            />
            <div
              className="text-2xl md:text-3xl text-foreground mb-1 md:mb-2"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              10K+
            </div>
            <div className="text-sm text-muted-foreground">Stars on GitHub</div>
            <div
              className="text-xs text-muted-foreground mt-2"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              Open source ftw
            </div>
          </motion.div>

          <motion.div
            className="terminal-glass p-4 md:p-6 rounded-sm border border-border/20 hover:border-primary/50 transition-all"
            variants={itemVariants}
            whileHover={{ y: -3, scale: 1.01 }}
          >
            <Coffee
              className="w-6 h-6 md:w-8 md:h-8 text-primary mb-2 md:mb-3 mx-auto"
              strokeWidth={1.5}
            />
            <div
              className="text-2xl md:text-3xl text-foreground mb-1 md:mb-2"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              ∞
            </div>
            <div className="text-sm text-muted-foreground">Cups of Coffee</div>
            <div
              className="text-xs text-muted-foreground mt-2"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              Fuel for innovation
            </div>
          </motion.div>

          <motion.div
            className="terminal-glass p-4 md:p-6 rounded-sm border border-border/20 hover:border-primary/50 transition-all"
            variants={itemVariants}
            whileHover={{ y: -3, scale: 1.01 }}
          >
            <Rocket
              className="w-6 h-6 md:w-8 md:h-8 text-primary mb-2 md:mb-3 mx-auto"
              strokeWidth={1.5}
            />
            <div
              className="text-2xl md:text-3xl text-foreground mb-1 md:mb-2"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              24/7
            </div>
            <div className="text-sm text-muted-foreground">Always Shipping</div>
            <div
              className="text-xs text-muted-foreground mt-2"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              Move fast, build things
            </div>
          </motion.div>
        </motion.div>

        {/* Terminal-style footer quote */}
        <motion.div
          className="mt-8 md:mt-12 terminal-glass-strong rounded-sm overflow-hidden border border-border/30 max-w-2xl mx-auto"
          variants={itemVariants}
        >
          <div
            className="p-4 md:p-6 text-left"
            style={{ fontFamily: "IBM Plex Mono, monospace" }}
          >
            <div className="text-muted-foreground text-xs md:text-sm mb-2">
              <span className="text-primary">$</span> fortune
            </div>
            <div className="text-foreground text-xs md:text-sm pl-3 md:pl-4 border-l-2 border-primary ml-2">
              &quot;Talk is cheap. Show me the code.&quot;
              <div className="text-muted-foreground text-xs mt-2">
                — Linus Torvalds
              </div>
            </div>
          </div>
        </motion.div>

        {/* Progress indicator */}
        <motion.div
          className="flex items-center justify-center space-x-2 md:space-x-3 mt-8 md:mt-12"
          variants={itemVariants}
        >
          <div className="w-8 md:w-12 h-1 bg-border/30" />
          <div className="w-8 md:w-12 h-1 bg-border/30" />
          <motion.div
            className="w-8 md:w-12 h-1 bg-primary"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.4, ease: easeOut, delay: 0.3 }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OnboardingCTA;
