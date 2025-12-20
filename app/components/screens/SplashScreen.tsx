"use client";
import React, { useEffect, useState } from "react";
import ParticleField from "../effects/ParticleField";
import { Cpu, Database, Terminal, Zap } from "lucide-react";
import { motion, easeOut } from "motion/react";

interface SplashScreenProps {
  onComplete: () => void;
}

const headerContainer = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.9,
      ease: easeOut,
      delay: 0.1,
    },
  },
};

const headerBlob = {
  hidden: { y: -40, scaleY: 1.15, scaleX: 0.85, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    scaleY: [1.15, 0.9, 1],
    scaleX: [0.85, 1.05, 1],
    transition: {
      duration: 0.8,
      ease: easeOut,
    },
  },
};

const headerIcon = {
  hidden: { scale: 0, rotate: -18, opacity: 0 },
  visible: {
    scale: [0, 1.1, 1],
    rotate: [-18, 4, 0],
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: easeOut,
    },
  },
};

const headerText = {
  hidden: { y: 18, opacity: 0, letterSpacing: "0.25em" },
  visible: {
    y: 0,
    opacity: 1,
    letterSpacing: "0.08em",
    transition: {
      duration: 0.7,
      ease: easeOut,
    },
  },
};

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [glitchActive, setGlitchActive] = useState(false);
  const [bootMessages, setBootMessages] = useState<string[]>([]);

  const bootSequence = [
    "> Initializing NexusHub v2.1.0...",
    "> Loading core modules...",
    "> Mounting file systems... [OK]",
    "> Starting network services... [OK]",
    "> Calibrating neural interfaces...",
    "> Establishing quantum entanglement...",
    "> \"I've seen things you people wouldn't believe...\"",
    "> System ready. Welcome back, developer.",
  ];

  useEffect(() => {
    // Glitch
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 80);
    }, 3000);

    //message
    const messageInterval = setInterval(() => {
      setBootMessages((prev) => {
        if (prev.length < bootSequence.length) {
          return [...prev, bootSequence[prev.length]];
        }
        return prev;
      });
    }, 350);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(messageInterval);
          clearInterval(glitchInterval);
          setTimeout(onComplete, 800);
          return 100;
        }
        return prev + 1.5;
      });
    }, 40);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
      clearInterval(glitchInterval);
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onComplete]);

  return (
    <div className="relative w-full h-screen bg-black flex items-center justify-center">
      {/* Particle field */}
      <ParticleField density={400} interactive={true} />

      {/* Grid background */}
      <div className="absolute inste-0 grid-pattern opacity-20">HELLO</div>

      {/* Animated scanlines */}
      <div className="absolute inset-0 scan-effect" />

      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.8) 100%)",
        }}
      />

      <div className="relative z-10 max-w-2xl w-full px-8">
        {/* Logo/Header with refined animation */}
        <motion.div
          className="flex items-center justify-center mb-12 space-x-4"
          variants={headerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Icon + liquid glow */}
          <div className="relative">
            <motion.div
              className="absolute inset-0 blur-2xl bg-[#DC2626]"
              variants={headerBlob}
            />
            <motion.div variants={headerIcon} className="relative z-10">
              <Terminal
                className="w-16 h-16 text-[#DC2626]"
                strokeWidth={1.5}
              />
            </motion.div>
          </div>

          {/* Text block */}
          <div>
            <motion.h1
              variants={headerText}
              className={`text-5xl tracking-[0.25em] text-[#FFFFFF] font-semibold ${
                glitchActive ? "glitch-text" : ""
              }`}
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              NEXUS<span className="text-[#DC2626]">HUB</span>
            </motion.h1>
            <motion.p
              variants={headerText}
              className="text-[#A3A3A3] text-sm mt-1"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              v2.1.0 • Build 20251213 • AI-Enhanced
            </motion.p>
          </div>
        </motion.div>

        {/* System icons animation */}
        <motion.div
          className="flex justify-center space-x-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {[
            { Icon: Cpu, delay: 0 },
            { Icon: Database, delay: 0.1 },
            { Icon: Zap, delay: 0.2 },
            { Icon: Terminal, delay: 0.3 },
          ].map(({ Icon, delay }, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.8 + delay,
                type: "spring",
                stiffness: 200,
              }}
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
                className="p-3 bg-[#0A0A0A] border border-[#525252]/30 rounded-sm"
              >
                <Icon className="w-6 h-6 text-[#DC2626]" strokeWidth={1.5} />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Boot messages terminal */}
        <motion.div
          className="terminal-glass rounded-sm p-6 mb-8 min-h-60 border border-[#525252]/30 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {/* Terminal header */}
          <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-[#525252]/20">
            <div className="w-3 h-3 rounded-full bg-[#DC2626]" />
            <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
            <div className="w-3 h-3 rounded-full bg-[#22C55E]" />
            <span
              className="text-[#525252] text-xs ml-2"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              system.log
            </span>
          </div>

          <div
            className="space-y-2"
            style={{ fontFamily: "IBM Plex Mono, monospace" }}
          >
            {bootMessages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="text-[#E5E5E5] text-sm flex items-start"
              >
                <motion.span
                  className="text-[#DC2626] mr-2"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  ▸
                </motion.span>
                {message}
              </motion.div>
            ))}
            {bootMessages.length < bootSequence.length && (
              <div className="flex items-center text-[#E5E5E5] text-sm">
                <span className="text-[#DC2626] mr-2">▸</span>
                <span className="cursor-blink">_</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <div
            className="flex justify-between items-center text-sm"
            style={{ fontFamily: "IBM Plex Mono, monospace" }}
          >
            <span className="text-[#A3A3A3]">System initialization</span>
            <motion.span
              className="text-[#DC2626]"
              key={Math.floor(progress / 10)}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
            >
              {Math.floor(progress)}%
            </motion.span>
          </div>
          <div className="w-full h-2 bg-[#1A1A1A] rounded-none overflow-hidden border border-[#525252]/20 relative">
            <motion.div
              className="h-full bg-linear-to-r from-[#DC2626] via-[#EF4444] to-[#DC2626] relative"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              style={{
                backgroundSize: "200% 100%",
              }}
            >
              <motion.div
                className="absolute inset-0 bg-white/20"
                animate={{
                  backgroundPosition: ["0% 0%", "100% 0%"],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                  backgroundSize: "50% 100%",
                }}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Footer easter egg */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <p
            className="text-[#525252] text-xs"
            style={{ fontFamily: "IBM Plex Mono, monospace" }}
          >
            &quot;In the beginning was the command line&ldquot; — Neal
            Stephenson
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SplashScreen;
