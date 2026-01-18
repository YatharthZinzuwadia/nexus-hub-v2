"use client";

import { Brain, ChevronRight, Layers, Sparkles, Terminal } from "lucide-react";
import { easeInOut, easeOut, motion } from "motion/react";

interface OnboardingFeaturesProps {
  onNext: () => void;
  onSkip: () => void;
}

/**
 * ONBOARDING FEATURES - Fixed for responsiveness and proper animations
 *
 * Fixes:
 * - Added initial="hidden" to trigger entry animations
 * - Removed excessive delays
 * - Made fully responsive
 * - Added overflow handling
 * - Optimized animations
 */

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

const headerVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easeOut,
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

const featuresGridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      staggerChildren: 0.08,
    },
  },
};

const featureCardVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: easeOut,
    },
  },
};

const OnboardingFeatures = ({ onNext, onSkip }: OnboardingFeaturesProps) => {
  const features = [
    {
      icon: Terminal,
      title: "Command-Line Aesthetics",
      description:
        "Inspired by the elegance of UNIX terminals and the simplicity of pure code.",
      tag: "RETRO",
    },
    {
      icon: Brain,
      title: "AI-Powered Intelligence",
      description:
        "Neural networks meet developer workflows. Like HAL 9000, but friendlier.",
      tag: "SMART",
    },
    {
      icon: Layers,
      title: "Modular Architecture",
      description:
        "Built with composable components. Every module is a building block.",
      tag: "SCALABLE",
    },
    {
      icon: Sparkles,
      title: "Zero-BS Interface",
      description:
        "No bloat, no fluff. Just pure functionality wrapped in minimalist design.",
      tag: "CLEAN",
    },
  ];

  return (
    <div className="relative w-full min-h-screen bg-background flex justify-center items-center overflow-y-auto overflow-x-hidden py-8 md:py-0">
      {/* Grid pattern background */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Main animated container */}
      <motion.div
        className="relative z-10 w-full max-w-6xl px-4 sm:px-6 md:px-8"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        {/* HEADER */}
        <motion.div
          className="text-center mb-8 md:mb-12"
          variants={headerVariants}
        >
          {/* Top badge */}
          <motion.div className="inline-block mb-4" variants={itemVariants}>
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-secondary border border-border/30 rounded-sm">
              <span
                className="text-primary text-xs"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
              >
                █████░░░░░
              </span>
              <span
                className="text-muted-foreground text-xs"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
              >
                LOADING FEATURES
              </span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl tracking-tight text-foreground mb-3 md:mb-4"
            variants={itemVariants}
          >
            Built for <span className="text-primary">Developers</span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto px-4"
            variants={itemVariants}
          >
            Every feature designed with the hacker mindset. Because good code
            deserves a good interface.
          </motion.p>
        </motion.div>

        {/* FEATURES GRID */}
        <motion.div
          className="grid sm:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-12"
          variants={featuresGridVariants}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                className="group terminal-glass p-4 md:p-6 rounded-sm border border-border/20 hover:border-primary/50 transition-all duration-300"
                variants={featureCardVariants}
                whileHover={{
                  translateY: -3,
                  scale: 1.01,
                }}
              >
                <div className="flex items-start justify-between mb-3 md:mb-4">
                  {/* Icon container */}
                  <div className="p-2.5 md:p-3 bg-secondary border border-border/30 rounded-sm">
                    <Icon
                      className="w-5 h-5 md:w-6 md:h-6 text-primary"
                      strokeWidth={1.5}
                    />
                  </div>

                  {/* Tag pill */}
                  <span
                    className="text-xs text-muted-foreground px-2 py-1 bg-secondary border border-border/30 rounded-sm"
                    style={{ fontFamily: "IBM Plex Mono, monospace" }}
                  >
                    {feature.tag}
                  </span>
                </div>

                {/* Title & description */}
                <h3 className="text-lg md:text-xl text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover footer line */}
                <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-border/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-primary text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <span style={{ fontFamily: "IBM Plex Mono, monospace" }}>
                        Explore
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                    <div className="flex-1 ml-4 h-px bg-border/30 overflow-hidden">
                      <div className="h-px w-0 bg-primary group-hover:w-full transition-all duration-300" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CODE SNIPPET SHOWCASE */}
        <motion.div
          className="terminal-glass-strong rounded-sm overflow-hidden border border-border/30 max-w-3xl mx-auto mb-8 md:mb-12"
          variants={itemVariants}
        >
          {/* Header bar */}
          <div className="flex items-center justify-between px-3 md:px-4 py-2 bg-popover border-b border-border/30">
            <span
              className="text-muted-foreground text-xs"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              example.tsx
            </span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-muted-foreground" />
              <div className="w-2 h-2 rounded-full bg-muted-foreground" />
              <motion.div
                className="w-2 h-2 rounded-full bg-primary"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
            </div>
          </div>

          {/* Code content */}
          <div
            className="p-4 md:p-6 text-xs md:text-sm"
            style={{ fontFamily: "IBM Plex Mono, monospace" }}
          >
            <div className="text-muted-foreground">
              <span className="text-primary">const</span>{" "}
              <span className="text-foreground">developer</span> ={" "}
              <span className="text-success">&quot;You&quot;</span>;
            </div>
            <div className="text-muted-foreground">
              <span className="text-primary">const</span>{" "}
              <span className="text-foreground">potential</span> ={" "}
              <span className="text-foreground">Infinity</span>;
            </div>
            <div className="text-muted-foreground mt-2">
              build something amazing
            </div>
          </div>
        </motion.div>

        {/* NAVIGATION BUTTONS */}
        <motion.div
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 md:gap-4"
          variants={itemVariants}
        >
          <motion.button
            onClick={onSkip}
            className="px-6 py-3 bg-transparent text-muted-foreground rounded-sm hover:text-foreground hover:bg-secondary transition-all duration-200 border border-border/30"
            style={{ fontFamily: "IBM Plex Mono, monospace" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Skip Tour
          </motion.button>
          <motion.button
            onClick={onNext}
            className="group flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-sm hover:bg-destructive transition-all duration-200 border border-primary"
            style={{ fontFamily: "IBM Plex Mono, monospace" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Continue</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>

        {/* PROGRESS INDICATOR */}
        <motion.div
          className="flex items-center justify-center space-x-2 md:space-x-3 mt-6 md:mt-8"
          variants={itemVariants}
        >
          <div className="w-8 md:w-12 h-1 bg-border/30" />
          <motion.div
            className="w-8 md:w-12 h-1 bg-primary"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, ease: easeOut, delay: 0.3 }}
          />
          <div className="w-8 md:w-12 h-1 bg-border/30" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OnboardingFeatures;
