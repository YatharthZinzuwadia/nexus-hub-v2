"use client";

import React, { useEffect, useState } from "react";
import ParticleField from "../effects/ParticleField";
import { Cpu, Database, Terminal, Zap } from "lucide-react";
import { motion, easeOut } from "framer-motion";

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
    <div className="relative w-full h-screen bg-background flex items-center justify-center">
      {/* Particle field */}
      <ParticleField density={300} interactive={true} />

      {/* Grid background */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Scanlines */}
      <div className="absolute inset-0 scan-effect pointer-events-none" />

      {/* Radial overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, transparent 0%, var(--background) 100%)",
        }}
      />

      <div className="relative z-10 w-full max-w-4xl px-6 sm:px-10 md:px-12">
        {/* Logo/Header */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center mb-10 sm:mb-16 gap-4"
          variants={headerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Icon + liquid glow */}
          <div className="relative">
            <motion.div
              className="absolute inset-0 blur-2xl bg-primary opacity-70"
              variants={headerBlob}
            />
            <motion.div variants={headerIcon} className="relative z-10">
              <Terminal
                className="w-14 h-14 sm:w-16 sm:h-16 text-primary"
                strokeWidth={1.5}
              />
            </motion.div>
          </div>

          {/* Text block */}
          <div className="text-center sm:text-left">
            <motion.h1
              variants={headerText}
              className={`text-4xl sm:text-5xl tracking-[0.25em] text-foreground font-semibold ${
                glitchActive ? "glitch-text" : ""
              }`}
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              NEXUS<span className="text-primary">HUB</span>
            </motion.h1>
            <motion.p
              variants={headerText}
              className="text-muted-foreground text-xs sm:text-sm mt-1"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              v2.1.0 • Build 20251213 • AI-Enhanced
            </motion.p>
          </div>
        </motion.div>

        {/* System icons */}
        <motion.div
          className="flex justify-center space-x-6 sm:space-x-8 mb-10 sm:mb-12"
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
                className="p-3 bg-secondary border border-border/30 rounded-sm"
              >
                <Icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Boot messages terminal */}
        <motion.div
          className="terminal-glass rounded-sm p-5 sm:p-6 mb-8 min-h-45 sm:min-h-55 border border-border/30 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {/* Terminal header */}
          <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-border/20">
            <div className="w-3 h-3 rounded-full bg-destructive" />
            <div className="w-3 h-3 rounded-full bg-warning" />
            <div className="w-3 h-3 rounded-full bg-success" />
            <span
              className="text-muted-foreground text-xs ml-2"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              system.log
            </span>
          </div>

          <div
            className="space-y-2 text-sm"
            style={{ fontFamily: "IBM Plex Mono, monospace" }}
          >
            {bootMessages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="text-foreground flex items-start"
              >
                <motion.span
                  className="text-primary mr-2"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  ▸
                </motion.span>
                {message}
              </motion.div>
            ))}
            {bootMessages.length < bootSequence.length && (
              <div className="flex items-center text-foreground text-sm">
                <span className="text-primary mr-2">▸</span>
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
            className="flex justify-between items-center text-xs sm:text-sm"
            style={{ fontFamily: "IBM Plex Mono, monospace" }}
          >
            <span className="text-muted-foreground">System initialization</span>
            <motion.span
              className="text-primary"
              key={Math.floor(progress / 10)}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
            >
              {Math.floor(progress)}%
            </motion.span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-none overflow-hidden border border-border/20 relative">
            <motion.div
              className="h-full bg-linear-to-r from-destructive via-primary to-destructive relative"
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

        {/* Footer quote */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <p
            className="text-muted-foreground text-xs"
            style={{ fontFamily: "IBM Plex Mono, monospace" }}
          >
            &quot;In the beginning was the command line&quot; — Neal Stephenson
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SplashScreen;
