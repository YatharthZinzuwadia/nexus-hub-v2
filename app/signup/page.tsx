"use client";

import { useState } from "react";
import { motion, easeOut } from "motion/react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, Key, Terminal, User, Mail } from "lucide-react";
import Link from "next/link";
import ParticleField from "../components/effects/ParticleField";

/**
 * SIGNUP PAGE - Matches NexusHub Design System
 *
 * Design Elements:
 * - Terminal icon logo with NEXUSHUB branding
 * - IBM Plex Mono typography
 * - Two-column layout (branding left, form right)
 * - Terminal-style info boxes
 * - Consistent color palette (#DC2626 red accent)
 *
 * Authentication:
 * - Supabase email/password signup
 * - Email confirmation sent
 * - Redirects to /login on success
 */

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

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Password strength calculation
  const getPasswordStrength = (password: string) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 15;
    if (/[^a-zA-Z\d]/.test(password)) strength += 10;
    return Math.min(strength, 100);
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.email || !formData.password || !formData.name) {
      toast.error("All fields are required");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      // Supabase signup
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
          },
        },
      });

      if (error) throw error;

      // Success
      toast.success("Account created! Check your email to confirm.");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-background flex items-center justify-center py-8 md:py-0 overflow-hidden">
      {/* Particle effect */}
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
            {/* Logo */}
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
                  v2.1.0
                </p>
              </div>
            </motion.div>

            {/* Heading */}
            <motion.div className="space-y-4" variants={itemVariants}>
              <h2 className="text-3xl text-foreground">
                Create Your <span className="text-primary">Workspace</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Join the next generation of developers. Build, deploy, and scale
                with confidence.
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
                  features.log
                </span>
              </div>
              <div
                className="p-4 space-y-2 text-xs"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
              >
                <div className="text-foreground">
                  <span className="text-primary">▸</span> AI-powered code
                  assistance
                </div>
                <div className="text-foreground">
                  <span className="text-primary">▸</span> Real-time
                  collaboration
                </div>
                <div className="text-foreground">
                  <span className="text-primary">▸</span> Unlimited projects &
                  storage
                </div>
                <div className="text-muted-foreground mt-4">
                  Everything you need to build.
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT - Signup form */}
          <motion.div
            className="terminal-glass p-6 sm:p-8 rounded-sm border border-border/30"
            variants={rightColumnVariants}
          >
            {/* Header */}
            <motion.div className="mb-6" variants={itemVariants}>
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-secondary border border-border/30 rounded-sm mb-4">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span
                  className="text-muted-foreground text-xs"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  NEW ACCOUNT
                </span>
              </div>
              <h3 className="text-2xl text-foreground mb-2">Sign Up</h3>
              <p className="text-muted-foreground text-sm">
                Create your developer account
              </p>
            </motion.div>

            <form onSubmit={handleSignup} className="space-y-6">
              {/* Name field */}
              <motion.div className="space-y-2" variants={itemVariants}>
                <label
                  className="flex items-center space-x-2 text-sm text-muted-foreground"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  <User className="w-4 h-4" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="John Doe"
                  disabled={loading}
                  className="w-full px-4 py-3 bg-secondary border border-border/30 rounded-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                />
              </motion.div>

              {/* Email field */}
              <motion.div className="space-y-2" variants={itemVariants}>
                <label
                  className="flex items-center space-x-2 text-sm text-muted-foreground"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="developer@nexus.dev"
                  disabled={loading}
                  className="w-full px-4 py-3 bg-secondary border border-border/30 rounded-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
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
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="••••••••"
                    disabled={loading}
                    className="w-full px-4 py-3 bg-secondary border border-border/30 rounded-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
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

                {/* Password Strength Indicator */}
                {formData.password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-secondary rounded-none overflow-hidden border border-border/20">
                        <motion.div
                          className={`h-full ${
                            passwordStrength < 40
                              ? "bg-primary"
                              : passwordStrength < 70
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${passwordStrength}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <span
                        className="text-xs text-muted-foreground"
                        style={{ fontFamily: "IBM Plex Mono, monospace" }}
                      >
                        {passwordStrength < 40
                          ? "WEAK"
                          : passwordStrength < 70
                          ? "MEDIUM"
                          : "STRONG"}
                      </span>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Submit button */}
              <motion.button
                type="submit"
                disabled={loading}
                className="group w-full flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-sm hover:bg-destructive transition-all border border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
                variants={itemVariants}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (
                  <>
                    <motion.div
                      className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
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

              {/* Login link */}
              <motion.div
                className="text-center text-sm"
                variants={itemVariants}
              >
                <span className="text-muted-foreground">
                  Already have an account?{" "}
                </span>
                <Link
                  href="/login"
                  className="text-primary hover:text-destructive transition-colors"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  Sign in
                </Link>
              </motion.div>
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
                By signing up, you agree to our Terms and Privacy Policy
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
