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
 * Page-level animation variants and building blocks
 * These are reused across the layout to create a cohesive, orchestrated feel.
 * Motion's variant system lets parent components control the timing of their children.
 * [web:61][web:65]
 */

// Page‑level orchestration: fade + slight rise for the whole content container
const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: easeOut, // smooth ease-out, reads well for hero sections [web:61]
      when: "before-children", // run this before animating children
      delay: 0.1,
    },
  },
};

// Left column: stagger text + stats + CTAs + code line
const leftColumnVariants = {
  hidden: { opacity: 0, x: -40 }, // start slightly left and transparent
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: easeOut,
      delayChildren: 0.1, // wait a bit, then animate children
      staggerChildren: 0.15, // each child starts 0.15s after the previous one
    },
  },
};

// Small "SYSTEM_ONLINE" status badge
const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOut },
  },
};

// Main headline: slide up + fade in
const headlineVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOut },
  },
};

// Subcopy paragraph: slightly delayed, softer slide
const subcopyVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOut, delay: 0.1 },
  },
};

// Stats cards: staggered entry based on index
const statCardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  // `index` will come from the `custom` prop on motion.div
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: easeOut,
      delay: 0.3 + index * 0.08, // each card slightly later than previous
    },
  }),
};

// CTA row: appear after text + stats
const ctaRowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOut, delay: 0.6 },
  },
};

// Code ticker (small line under CTAs)
const codeLineVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut, delay: 0.9 },
  },
};

// Right column: terminal shell reveal, with staggered child lines
const rightColumnVariants = {
  hidden: { opacity: 0, x: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: easeOut,
      delayChildren: 0.3, // wait before starting terminal internals
      staggerChildren: 0.12, // sequential boot lines
    },
  },
};

// Terminal header bar animation
const terminalHeaderVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOut },
  },
};

// Terminal lines: stagger lines using custom index (similar to stat cards)
const terminalLineVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.45,
      ease: easeOut,
      delay: 0.5 + index * 0.15,
    },
  }),
};

// Final prompt line with blinking cursor
const terminalPromptVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOut, delay: 1.4 },
  },
};

// Bottom progress indicator
const progressBarVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut, delay: 1 },
  },
};

interface OnboardingWelcomeProps {
  onNext: () => void;
  onSkip: () => void;
}

const OnboardingWelcome = ({ onNext, onSkip }: OnboardingWelcomeProps) => {
  const [snippetIndex, setSnippetIndex] = useState(0);

  // Small list of playful command-like snippets for the footer ticker
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
    <div className="relative w-full h-screen bg-[#000000] flex items-center justify-center overflow-hidden">
      {/* Background particle field for subtle depth */}
      <ParticleField density={200} />

      {/* Static grid pattern overlay (CSS background) */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* CRT-like scanline overlay */}
      <div className="absolute inset-0 scan-effect" />

      {/* Main content container, animated as a unit via pageVariants */}
      <motion.div
        className="relative z-10 max-w-6xl w-full px-8"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* LEFT COLUMN: text, stats, CTAs, code snippet */}
          <motion.div className="space-y-8" variants={leftColumnVariants}>
            {/* Small status badge: "SYSTEM_ONLINE" with pulsing dot */}
            <motion.div className="inline-block" variants={badgeVariants}>
              <div className="flex items-center space-x-2 px-4 py-2 bg-[#0A0A0A] border border-[#525252]/30 rounded-sm">
                {/* Pulsing red dot to imply live system */}
                <motion.div
                  className="w-2 h-2 rounded-full bg-[#DC2626]"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span
                  className="text-[#A3A3A3] text-xs"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  SYSTEM_ONLINE • VERSION_2.1.0
                </span>
              </div>
            </motion.div>

            {/* Main hero heading + supporting text */}
            <div>
              {/* Hero title: "Welcome to the Developer Portal" */}
              <motion.h1
                className="text-6xl tracking-tight text-[#FFFFFF] mb-4 leading-[1.1]"
                variants={headlineVariants}
              >
                Welcome to the
                <br />
                {/* Red "Developer" word with glowing textShadow loop */}
                <motion.span
                  className="text-[#DC2626]"
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

              {/* Supporting paragraph */}
              <motion.p
                className="text-[#A3A3A3] text-lg leading-relaxed max-w-lg"
                variants={subcopyVariants}
              >
                A portfolio dashboard engineered for those who speak in code,
                dream in algorithms, and build the future one commit at a time.
              </motion.p>
            </div>

            {/* Tech stats row: components, uptime, response */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { Icon: Code2, value: "50+", label: "Components" },
                { Icon: Database, value: "99.9%", label: "Uptime" },
                { Icon: Zap, value: "<12ms", label: "Response" },
              ].map(({ Icon, value, label }, index) => (
                <motion.div
                  key={label}
                  className="terminal-glass p-4 rounded-sm border border-[#525252]/20 group hover:border-[#DC2626]/50 transition-all duration-300"
                  variants={statCardVariants}
                  custom={index} // index used by statCardVariants for delay
                  whileHover={{ scale: 1.05, y: -5 }} // subtle lift on hover
                >
                  {/* Advanced system-activity micro-animation for the stat icon */}
                  <motion.div
                    className="relative mb-2"
                    animate={{
                      // slow continuous rotation
                      rotate: [0, 3, -3, 0],
                      // subtle breathing scale
                      scale: [1, 1.06, 1],
                      // tiny Z-axis tilt for a 3D-ish feel
                      rotateZ: [0, 2, -2, 0],
                    }}
                    transition={{
                      duration: 6, // full cycle length
                      repeat: Infinity, // loop forever
                      ease: "easeInOut",
                    }}
                  >
                    {/* Soft pulsing halo behind the icon */}
                    <motion.div
                      className="absolute inset-0 rounded-full bg-[#DC2626]/40 blur-md"
                      animate={{
                        opacity: [0.1, 0.4, 0.1],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />

                    {/* Core icon */}
                    <Icon
                      className="relative w-6 h-6 text-[#DC2626]"
                      strokeWidth={1.5}
                    />
                  </motion.div>

                  <div
                    className="text-2xl text-[#FFFFFF]"
                    style={{ fontFamily: "IBM Plex Mono, monospace" }}
                  >
                    {value}
                  </div>
                  <div className="text-xs text-[#A3A3A3] mt-1">{label}</div>
                  {/* Underline grows on hover */}
                  <motion.div className="h-px w-0 bg-[#DC2626] mt-2 group-hover:w-full transition-all duration-300" />
                </motion.div>
              ))}
            </div>

            {/* CTA buttons row */}
            <motion.div
              className="flex items-center space-x-4 pt-4"
              variants={ctaRowVariants}
            >
              {/* Primary CTA: Begin tour */}
              <motion.button
                onClick={onNext}
                className="group flex items-center space-x-2 px-8 py-4 bg-[#DC2626] text-[#FFFFFF] rounded-sm hover:bg-[#EF4444] transition-all duration-200 border border-[#DC2626] relative overflow-hidden"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
                whileHover={{ scale: 1.05 }} // subtle zoom on hover
                whileTap={{ scale: 0.95 }} // pressed state feedback
              >
                {/* Shimmer sweep effect over the button on hover */}
                <motion.div
                  className="absolute inset-0 bg-white"
                  initial={{ x: "-100%", opacity: 0.2 }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10">Begin_Tour()</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform relative z-10" />
              </motion.button>

              {/* Secondary CTA: Skip intro */}
              <motion.button
                onClick={onSkip}
                className="px-8 py-4 bg-transparent text-[#A3A3A3] rounded-sm hover:text-[#FFFFFF] hover:bg-[#1A1A1A] transition-all duration-200 border border-[#525252]/30 hover:border-[#DC2626]/50"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Skip_Intro()
              </motion.button>
            </motion.div>

            {/* Code snippet ticker under the CTAs */}
            <motion.div
              className="pt-4 text-[#525252] text-sm"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
              variants={codeLineVariants}
            >
              <motion.span
                // NOTE: this key forces a re-mount every ~3s; for a true ticker,
                // you'd likely manage the index via state + useEffect instead.
                key={snippetIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: easeOut }}
              >
                `//` {codeSnippets[0]}
              </motion.span>
            </motion.div>
          </motion.div>

          {/* RIGHT COLUMN: terminal preview with boot sequence */}
          <motion.div className="relative" variants={rightColumnVariants}>
            <div className="terminal-glass-strong rounded-sm overflow-hidden border border-[#525252]/30 relative">
              {/* Ambient glow behind the terminal that pulses very slowly */}
              <motion.div
                className="absolute -inset-1 bg-[#DC2626] opacity-0 blur-xl"
                animate={{ opacity: [0, 0.2, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              {/* Terminal header bar (with traffic-light dots) */}
              <motion.div
                className="flex items-center justify-between px-4 py-3 bg-[#0A0A0A] border-b border-[#525252]/30 relative z-10"
                variants={terminalHeaderVariants}
              >
                <div className="flex items-center space-x-2">
                  {/* Leftmost red dot breathing to indicate activity */}
                  <motion.div
                    className="w-3 h-3 rounded-full bg-[#DC2626]"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <div className="w-3 h-3 rounded-full bg-[#737373]" />
                  <div className="w-3 h-3 rounded-full bg-[#737373]" />
                </div>
                {/* File name text with subtle opacity pulsing */}
                <motion.span
                  className="text-[#A3A3A3] text-xs"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  nexus_terminal.sh
                </motion.span>
              </motion.div>

              {/* Terminal body content: boot sequence of lines */}
              <div
                className="p-6 space-y-2 text-sm relative z-10"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
              >
                {/* First command line: running initialize script */}
                <motion.div
                  className="text-[#A3A3A3]"
                  variants={terminalLineVariants}
                  custom={0} // first line delay
                >
                  <span className="text-[#DC2626]">developer@nexus</span>
                  <span className="text-[#FFFFFF]">:</span>
                  <span className="text-[#E5E5E5]">~/portfolio$</span>
                  <motion.span
                    className="ml-2"
                    initial={{ width: 0 }}
                    animate={{ width: "auto" }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                  >
                    ./initialize.sh
                  </motion.span>
                </motion.div>

                {/* Boot steps: compiled, loading creativity, etc. */}
                {[
                  { text: "Compiling future...", status: "OK" },
                  { text: "Loading creativity.dll...", status: "OK" },
                  { text: "Deploying innovation...", status: "OK" },
                  { text: "Initializing AI modules...", status: "OK" },
                  { text: "Bootstrapping excellence...", status: "OK" },
                ].map(({ text, status }, index) => (
                  <motion.div
                    key={text}
                    className="text-[#E5E5E5] pl-4"
                    variants={terminalLineVariants}
                    custom={index + 1} // each subsequent line has higher index
                  >
                    {text} [<span className="text-[#22C55E]">{status}</span>]
                  </motion.div>
                ))}

                {/* Final prompt with blinking cursor */}
                <motion.div
                  className="text-[#A3A3A3] pt-4"
                  variants={terminalPromptVariants}
                >
                  <span className="text-[#DC2626]">developer@nexus</span>
                  <span className="text-[#FFFFFF]">:</span>
                  <span className="text-[#E5E5E5]">~/portfolio$</span>
                  <span className="ml-2 cursor-blink">_</span>
                </motion.div>

                {/* Floating decorative icons (Terminal, Sparkles, CPU) */}
                {[Terminal, Sparkles, Cpu].map((Icon, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-[#DC2626] opacity-20"
                    style={{
                      top: `${30 + i * 20}%`,
                      right: `${10 + i * 5}%`,
                    }}
                    animate={{
                      y: [0, -20, 0],
                      rotate: [0, 10, 0],
                      opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{
                      duration: 3 + i,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  >
                    <Icon className="w-8 h-8" strokeWidth={1} />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Decorative glowing elements behind the terminal */}
            <motion.div
              className="absolute -top-8 -right-8 w-40 h-40 bg-[#DC2626] opacity-20 blur-3xl rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
            />
            <motion.div
              className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#DC2626] opacity-15 blur-3xl rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.15, 0.3, 0.15],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                delay: 0.5,
              }}
            />
          </motion.div>
        </div>

        {/* Bottom progress indicator representing onboarding steps */}
        <motion.div
          className="flex items-center justify-center space-x-3 mt-16"
          variants={progressBarVariants}
        >
          {/* First bar animates in width as if "step 1" completed */}
          <motion.div
            className="w-12 h-1 bg-[#DC2626]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.3, duration: 0.5, ease: easeOut }}
          />
          {/* Remaining bars react on hover to hint they are interactive steps */}
          <motion.div
            className="w-12 h-1 bg-[#525252]/30"
            whileHover={{ scaleY: 2, backgroundColor: "#DC2626" }}
          />
          <motion.div
            className="w-12 h-1 bg-[#525252]/30"
            whileHover={{ scaleY: 2, backgroundColor: "#DC2626" }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OnboardingWelcome;
