"use client";

import { Brain, ChevronRight, Layers, Sparkles, Terminal } from "lucide-react";
import { easeInOut, easeOut, motion } from "motion/react";

interface OnboardingFeaturesProps {
  onNext: () => void;
  onSkip: () => void;
}

/**
 * VARIANTS
 * These control how different sections enter and animate together.
 */

// Whole page container: subtle fade/slide in
const pageVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: easeOut,
      when: "before-children",
      delay: 0.1,
    },
  },
};

// Top header block: stagger badge, title, and paragraph
const headerVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: easeOut,
      delayChildren: 0.05,
      staggerChildren: 0.12,
    },
  },
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: easeOut },
  },
};

const titleVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
};

const subtitleVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut, delay: 0.05 },
  },
};

// Features grid: cards stagger in and each card has its own micro-motion
const featuresGridVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easeOut,
      delayChildren: 0.1,
      staggerChildren: 0.12,
    },
  },
};

const featureCardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: easeOut,
      delay: 0.1 + index * 0.04,
    },
  }),
};

// Icon container: subtle breathing + glow to imply "live" features
const featureIconVariants = {
  initial: { scale: 1, rotateZ: 0 },
  animate: {
    scale: [1, 1.06, 1],
    rotateZ: [0, 2, -2, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: easeInOut,
    },
  },
};

// Code snippet block: fade in, then slight glow pulse
const codeBlockVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: easeOut,
      delay: 0.4,
    },
  },
};

// Nav buttons row
const navRowVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easeOut,
      delay: 0.6,
    },
  },
};

// Progress indicator at bottom
const progressVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easeOut,
      delay: 0.8,
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
    <div className="relative w-full min-h-screen bg-black flex justify-center items-center">
      {/* Grid pattern background */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Main animated container */}
      <motion.div
        className="relative z-10 max-w-6xl w-full h-full py-6 px-8 bg-black"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        {/* HEADER */}
        <motion.div className="text-center mb-12" variants={headerVariants}>
          {/* Top badge: loading bar style */}
          <motion.div className="inline-block mb-4" variants={badgeVariants}>
            <div className="flex items-center space-x-2 px-3 py-1 bg-[#0A0A0A] border border-[#525252]/30 rounded-sm">
              <span
                className="text-[#DC2626] text-xs"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
              >
                █████░░░░░
              </span>
              <span
                className="text-[#A3A3A3] text-xs"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
              >
                LOADING FEATURES
              </span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h2
            className="text-5xl tracking-tight text-[#FFFFFF] mb-4"
            variants={titleVariants}
          >
            Built for <span className="text-[#DC2626]">Developers</span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            className="text-[#A3A3A3] text-lg max-w-2xl mx-auto"
            variants={subtitleVariants}
          >
            Every feature designed with the hacker mindset. Because good code
            deserves a good interface.
          </motion.p>
        </motion.div>

        {/* FEATURES GRID */}
        <motion.div
          className="grid md:grid-cols-2 gap-6 mb-12"
          variants={featuresGridVariants}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                className="group terminal-glass p-6 rounded-sm border border-[#525252]/20 hover:border-[#DC2626]/50 transition-all duration-300"
                variants={featureCardVariants}
                custom={index}
                whileHover={{
                  translateY: -4, // subtle lift
                  scale: 1.02, // slight zoom
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  {/* Icon container with micro-animation */}
                  <motion.div
                    className="relative p-3 bg-[#0A0A0A] border border-[#525252]/30 rounded-sm overflow-hidden"
                    variants={featureIconVariants}
                    initial="initial"
                    animate="animate"
                  >
                    {/* Glow halo */}
                    <motion.div
                      className="absolute inset-0 rounded-sm bg-[#DC2626]/30 blur-md"
                      animate={{
                        opacity: [0.15, 0.4, 0.15],
                        scale: [1, 1.15, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: easeInOut,
                      }}
                    />
                    <Icon
                      className="relative w-6 h-6 text-[#DC2626]"
                      strokeWidth={1.5}
                    />
                  </motion.div>

                  {/* Tag pill */}
                  <span
                    className="text-xs text-[#A3A3A3] px-2 py-1 bg-[#0A0A0A] border border-[#525252]/30 rounded-sm"
                    style={{ fontFamily: "IBM Plex Mono, monospace" }}
                  >
                    {feature.tag}
                  </span>
                </div>

                {/* Title & description */}
                <h3 className="text-xl text-[#FFFFFF] mb-2">{feature.title}</h3>
                <p className="text-[#A3A3A3] text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover footer line */}
                <div className="mt-4 pt-4 border-t border-[#525252]/20">
                  <div className="flex items-center justify-between">
                    {/* Left: Explore text fades in */}
                    <div className="flex items-center space-x-2 text-[#DC2626] text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <span style={{ fontFamily: "IBM Plex Mono, monospace" }}>
                        Explore
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                    {/* Right: thin progress bar that fills on hover */}
                    <div className="flex-1 ml-4 h-px bg-[#525252]/30 overflow-hidden">
                      <div className="h-px w-0 bg-[#DC2626] group-hover:w-full transition-all duration-300" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CODE SNIPPET SHOWCASE */}
        <motion.div
          className="terminal-glass-strong rounded-sm overflow-hidden border border-[#525252]/30 max-w-3xl mx-auto"
          variants={codeBlockVariants}
        >
          {/* Header bar of code block */}
          <div className="flex items-center justify-between px-4 py-2 bg-[#0A0A0A] border-b border-[#525252]/30">
            <span
              className="text-[#A3A3A3] text-xs"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              example.tsx
            </span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-[#737373]" />
              <div className="w-2 h-2 rounded-full bg-[#737373]" />
              <motion.div
                className="w-2 h-2 rounded-full bg-[#DC2626]"
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
            </div>
          </div>

          {/* Code content */}
          <motion.div
            className="p-4 text-sm"
            style={{ fontFamily: "IBM Plex Mono, monospace" }}
            animate={{
              boxShadow: [
                "0 0 0px rgba(220,38,38,0.0)",
                "0 0 24px rgba(220,38,38,0.25)",
                "0 0 0px rgba(220,38,38,0.0)",
              ],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: easeInOut }}
          >
            <div className="text-[#737373]">
              <span className="text-[#DC2626]">const</span>{" "}
              <span className="text-[#E5E5E5]">developer</span> ={" "}
              <span className="text-[#22C55E]">&quot;You&quot;</span>;
            </div>
            <div className="text-[#737373]">
              <span className="text-[#DC2626]">const</span>{" "}
              <span className="text-[#E5E5E5]">potential</span> ={" "}
              <span className="text-[#E5E5E5]">Infinity</span>;
            </div>
            <div className="text-[#A3A3A3] mt-2">build something amazing</div>
          </motion.div>
        </motion.div>

        {/* NAVIGATION BUTTONS */}
        <motion.div
          className="flex items-center justify-center space-x-4 mt-12"
          variants={navRowVariants}
        >
          <motion.button
            onClick={onSkip}
            className="px-6 py-3 bg-transparent text-[#A3A3A3] rounded-sm hover:text-[#FFFFFF] hover:bg-[#1A1A1A] transition-all duration-200 border border-[#525252]/30"
            style={{ fontFamily: "IBM Plex Mono, monospace" }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            Skip Tour
          </motion.button>
          <motion.button
            onClick={onNext}
            className="group flex items-center space-x-2 px-6 py-3 bg-[#DC2626] text-[#FFFFFF] rounded-sm hover:bg-[#EF4444] transition-all duration-200 border border-[#DC2626]"
            style={{ fontFamily: "IBM Plex Mono, monospace" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
          >
            <span>Continue</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>

        {/* PROGRESS INDICATOR */}
        <motion.div
          className="flex items-center justify-center space-x-2 mt-8"
          variants={progressVariants}
        >
          <div className="w-8 h-1 bg-[#525252]/30" />
          <motion.div
            className="w-8 h-1 bg-[#DC2626]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, ease: easeOut }}
          />
          <div className="w-8 h-1 bg-[#525252]/30" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OnboardingFeatures;
