"use client";

import { ArrowRight, Key, Terminal, User } from "lucide-react";
import { useState } from "react";
import { motion, easeOut } from "motion/react";
import ParticleField from "../effects/ParticleField";

interface LoginScreenProps {
  onLogin: () => void;
}

// Page-level animation variants
const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: easeOut,
      when: "beforeChildren",
      staggerChildren: 0.15,
    },
  },
};

const leftColumnVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: easeOut,
      staggerChildren: 0.1,
    },
  },
};

const rightColumnVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: easeOut,
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOut },
  },
};

const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };
  return (
    <div className="relative w-full min-h-screen bg-background flex items-center justify-center py-8 md:py-0 overflow-hidden">
      {/* Particle effect - optimized */}
      <ParticleField density={100} />
      {/* Grid pattern background */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      {/* Scanline effect */}
      <div className="absolute inset-0 scan-effect" />
      {/* Content */}
      <motion.div
        className="relative z-10 w-full max-w-5xl px-6 sm:px-8"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* LEFT - Branding */}
          <motion.div
            className="space-y-8 text-center md:text-left"
            variants={leftColumnVariants}
          >
            <motion.div
              className="flex items-center justify-center md:justify-start space-x-3"
              variants={itemVariants}
            >
              <Terminal className="w-12 h-12 text-primary" strokeWidth={1.5} />
              <div>
                <h1
                  className="text-4xl tracking-tight text-foreground"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  NEXUS<span className="text-primary">HUB</span>
                </h1>
                <p
                  className="text-muted-foreground text-sm"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  v0.2.0
                </p>
              </div>
            </motion.div>

            <motion.div className="space-y-4" variants={itemVariants}>
              <h2 className="text-3xl text-foreground">
                Access <span className="text-primary">Terminal</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Authenticate to access your development environment. Your
                workspace awaits.
              </p>
            </motion.div>

            {/* Terminal-style info box */}
            <motion.div
              className="terminal-glass-strong rounded-sm overflow-hidden border border-border/30 max-w-md mx-auto md:mx-0"
              variants={itemVariants}
            >
              <div className="px-4 py-2 bg-secondary border-b border-border/30">
                <span
                  className="text-muted-foreground text-xs"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  system_info.log
                </span>
              </div>
              <div
                className="p-4 space-y-2 text-xs"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
              >
                <div className="text-foreground">
                  <span className="text-primary">▸</span> Encrypted connection
                  established
                </div>
                <div className="text-foreground">
                  <span className="text-primary">▸</span> SSH tunnel active on
                  port 22
                </div>
                <div className="text-foreground">
                  <span className="text-primary">▸</span> Authentication
                  required
                </div>
                <div className="text-muted-foreground mt-4">
                  Security first, always.
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right side - Login form */}
          <motion.div
            className="terminal-glass p-6 sm:p-8 rounded-sm border border-border/30"
            variants={rightColumnVariants}
          >
            <motion.div className="mb-6" variants={itemVariants}>
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-secondary border border-border/30 rounded-sm mb-4">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span
                  className="text-muted-foreground text-xs"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  SECURE LOGIN
                </span>
              </div>
              <h3 className="text-2xl text-foreground mb-2">Sign In</h3>
              <p className="text-muted-foreground text-sm">
                Enter your credentials to continue
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username field */}
              <motion.div className="space-y-2" variants={itemVariants}>
                <label
                  className="flex items-center space-x-2 text-sm text-muted-foreground"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  <User className="w-4 h-4" />
                  <span>Username</span>
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="developer@nexus"
                  className="w-full px-4 py-3 bg-secondary border border-border/30 rounded-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                />
              </motion.div>

              {/* Password field */}
              <motion.div className="space-y-2" variants={itemVariants}>
                <label
                  className="flex items-center space-x-2 text-sm text-muted-foreground"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  <Key className="w-4 h-4" />
                  <span>Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-secondary border border-border/30 rounded-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    style={{ fontFamily: "IBM Plex Mono, monospace" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
                    style={{ fontFamily: "IBM Plex Mono, monospace" }}
                  >
                    {showPassword ? "HIDE" : "SHOW"}
                  </button>
                </div>
              </motion.div>

              {/* Remember me & forgot password */}
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-between text-sm gap-4"
                variants={itemVariants}
              >
                <label className="flex items-center space-x-2 text-muted-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 bg-secondary border border-border/30 rounded-sm checked:bg-primary checked:border-primary"
                  />
                  <span style={{ fontFamily: "IBM Plex Mono, monospace" }}>
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  className="text-primary hover:text-destructive transition-colors"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  Forgot password?
                </button>
              </motion.div>

              {/* Submit button */}
              <motion.button
                type="submit"
                className="group w-full flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-sm hover:bg-destructive transition-all border border-primary"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Access System</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              {/* Divider */}
              <motion.div className="relative my-4" variants={itemVariants}>
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/30" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span
                    className="px-2 bg-secondary text-muted-foreground"
                    style={{ fontFamily: "IBM Plex Mono, monospace" }}
                  >
                    OR
                  </span>
                </div>
              </motion.div>

              {/* Alternative login */}
              <motion.button
                type="button"
                className="w-full px-6 py-3 bg-transparent text-muted-foreground rounded-sm hover:text-foreground hover:bg-secondary transition-all border border-border/30"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Sign in with SSH Key
              </motion.button>
            </form>

            {/* Footer note */}
            <motion.div
              className="mt-6 pt-6 border-t border-border/30"
              variants={itemVariants}
            >
              <p
                className="text-xs text-muted-foreground text-center"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
              >
                Protected by military-grade encryption
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginScreen;
