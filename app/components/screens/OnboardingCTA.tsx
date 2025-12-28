"use client";

import { ArrowRight, Coffee, Github, Rocket } from "lucide-react";
import { motion, easeOut } from "motion/react";

interface OnboardingCTAProps {
  onSignIn: () => void;
}

// Page-level animation variants
const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: easeOut,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOut },
  },
};

const headingVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOut },
  },
};

const paragraphVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut, delay: 0.1 },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut, delay: 0.2 },
  },
};

const statsGridVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easeOut,
      delay: 0.3,
      staggerChildren: 0.1,
    },
  },
};

const statCardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: easeOut },
  },
};

const quoteVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut, delay: 0.5 },
  },
};

const progressVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOut, delay: 0.6 },
  },
};

const OnboardingCTA = ({ onSignIn }: OnboardingCTAProps) => {
  return (
    <div className="relative w-full min-h-screen bg-[#000000] flex items-center justify-center py-6">
      {/* Grid pattern background */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Animated corner accents */}
      <motion.div
        className="absolute top-0 left-0 w-64 h-64 bg-[#DC2626] opacity-5 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.08, 0.05] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-64 h-64 bg-[#DC2626] opacity-5 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.08, 0.05] }}
        transition={{ duration: 4, repeat: Infinity, delay: 2 }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-4xl w-full px-8 text-center"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Status indicator */}
        <motion.div
          className="inline-flex items-center space-x-2 px-4 py-2 bg-[#0A0A0A] border border-[#525252]/30 rounded-sm mb-8"
          variants={badgeVariants}
        >
          <Rocket className="w-4 h-4 text-[#DC2626]" />
          <span
            className="text-[#A3A3A3] text-sm"
            style={{ fontFamily: "IBM Plex Mono, monospace" }}
          >
            READY FOR DEPLOYMENT
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          className="text-6xl md:text-7xl tracking-tight text-[#FFFFFF] mb-6 leading-[1.1]"
          variants={headingVariants}
        >
          Your Journey
          <br />
          <span className="text-[#DC2626]">Begins Here</span>
        </motion.h1>

        <motion.p
          className="text-[#A3A3A3] text-xl leading-relaxed max-w-2xl mx-auto mb-12"
          variants={paragraphVariants}
        >
          Join the developers who&apos;ve traded bloated dashboards for
          something truly exceptional. No marketing speak, just honest
          engineering.
        </motion.p>

        {/* CTA Button */}
        <motion.button
          onClick={onSignIn}
          className="group inline-flex items-center space-x-3 px-8 py-4 bg-[#DC2626] text-[#FFFFFF] rounded-sm hover:bg-[#EF4444] transition-all duration-200 border border-[#DC2626] mb-12"
          style={{ fontFamily: "IBM Plex Mono, monospace" }}
          variants={buttonVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-lg">Initialize Session</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>

        {/* Social proof / Stats */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto"
          variants={statsGridVariants}
        >
          <motion.div
            className="terminal-glass p-6 rounded-sm border border-[#525252]/20 hover:border-[#DC2626]/50 transition-all"
            variants={statCardVariants}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <Github
              className="w-8 h-8 text-[#DC2626] mb-3 mx-auto"
              strokeWidth={1.5}
            />
            <div
              className="text-3xl text-[#FFFFFF] mb-2"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              10K+
            </div>
            <div className="text-sm text-[#A3A3A3]">Stars on GitHub</div>
            <div
              className="text-xs text-[#525252] mt-2"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              Open source ftw
            </div>
          </motion.div>

          <motion.div
            className="terminal-glass p-6 rounded-sm border border-[#525252]/20 hover:border-[#DC2626]/50 transition-all"
            variants={statCardVariants}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <Coffee
              className="w-8 h-8 text-[#DC2626] mb-3 mx-auto"
              strokeWidth={1.5}
            />
            <div
              className="text-3xl text-[#FFFFFF] mb-2"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              ∞
            </div>
            <div className="text-sm text-[#A3A3A3]">Cups of Coffee</div>
            <div
              className="text-xs text-[#525252] mt-2"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              Fuel for innovation
            </div>
          </motion.div>

          <motion.div
            className="terminal-glass p-6 rounded-sm border border-[#525252]/20 hover:border-[#DC2626]/50 transition-all"
            variants={statCardVariants}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <Rocket
              className="w-8 h-8 text-[#DC2626] mb-3 mx-auto"
              strokeWidth={1.5}
            />
            <div
              className="text-3xl text-[#FFFFFF] mb-2"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              24/7
            </div>
            <div className="text-sm text-[#A3A3A3]">Always Shipping</div>
            <div
              className="text-xs text-[#525252] mt-2"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              Move fast, build things
            </div>
          </motion.div>
        </motion.div>

        {/* Terminal-style footer quote */}
        <motion.div
          className="mt-12 terminal-glass-strong rounded-sm overflow-hidden border border-[#525252]/30 max-w-2xl mx-auto"
          variants={quoteVariants}
        >
          <div
            className="p-6 text-left"
            style={{ fontFamily: "IBM Plex Mono, monospace" }}
          >
            <div className="text-[#737373] text-sm mb-2">
              <span className="text-[#DC2626]">$</span> fortune
            </div>
            <div className="text-[#E5E5E5] text-sm pl-4 border-l-2 border-[#DC2626] ml-2">
              &quot;Talk is cheap. Show me the code.&quot;
              <div className="text-[#A3A3A3] text-xs mt-2">
                — Linus Torvalds
              </div>
            </div>
          </div>
        </motion.div>

        {/* Progress indicator */}
        <motion.div
          className="flex items-center justify-center space-x-2 mt-12"
          variants={progressVariants}
        >
          <div className="w-8 h-1 bg-[#525252]/30" />
          <div className="w-8 h-1 bg-[#525252]/30" />
          <motion.div
            className="w-8 h-1 bg-[#DC2626]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, ease: easeOut, delay: 0.8 }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OnboardingCTA;
