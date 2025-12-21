"use client";

import { ArrowRight, Key, Terminal, User } from "lucide-react";
import { useState } from "react";
import ParticleField from "../effects/ParticleField";

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };
  return (
    <div className="relative w-full min-h-screen bg-black flex justify-center items-center py-6">
      {/* Particle effect */}
      <ParticleField density={200} />

      {/* Grid pattern background */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Scanline effect */}
      <div className="absolute inset-0 scan-effect" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl w-full px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Branding */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Terminal
                className="w-12 h-12 text-[#DC2626]"
                strokeWidth={1.5}
              />
              <div>
                <h1
                  className="text-4xl tracking-tight text-[#FFFFFF]"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  NEXUS<span className="text-[#DC2626]">HUB</span>
                </h1>
                <p
                  className="text-[#A3A3A3] text-sm"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  v2.1.0
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl text-[#FFFFFF]">
                Access <span className="text-[#DC2626]">Terminal</span>
              </h2>
              <p className="text-[#A3A3A3] leading-relaxed">
                Authenticate to access your development environment. Your
                workspace awaits.
              </p>
            </div>

            {/* Terminal-style info box */}
            <div className="terminal-glass-strong rounded-sm overflow-hidden border border-[#525252]/30">
              <div className="px-4 py-2 bg-[#0A0A0A] border-b border-[#525252]/30">
                <span
                  className="text-[#A3A3A3] text-xs"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  system_info.log
                </span>
              </div>
              <div
                className="p-4 space-y-2 text-xs"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
              >
                <div className="text-[#E5E5E5]">
                  <span className="text-[#DC2626]">▸</span> Encrypted connection
                  established
                </div>
                <div className="text-[#E5E5E5]">
                  <span className="text-[#DC2626]">▸</span> SSH tunnel active on
                  port 22
                </div>
                <div className="text-[#E5E5E5]">
                  <span className="text-[#DC2626]">▸</span> Authentication
                  required
                </div>
                <div className="text-[#525252] mt-4">
                  Security first, always.
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Login form */}
          <div className="terminal-glass p-8 rounded-sm border border-[#525252]/30">
            <div className="mb-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#0A0A0A] border border-[#525252]/30 rounded-sm mb-4">
                <div className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse" />
                <span
                  className="text-[#A3A3A3] text-xs"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  SECURE LOGIN
                </span>
              </div>
              <h3 className="text-2xl text-[#FFFFFF] mb-2">Sign In</h3>
              <p className="text-[#A3A3A3] text-sm">
                Enter your credentials to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username field */}
              <div className="space-y-2">
                <label
                  className="flex items-center space-x-2 text-sm text-[#A3A3A3]"
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
                  className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#525252]/30 rounded-sm text-[#E5E5E5] placeholder-[#525252] focus:outline-none focus:border-[#DC2626] transition-colors"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                />
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <label
                  className="flex items-center space-x-2 text-sm text-[#A3A3A3]"
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
                    className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#525252]/30 rounded-sm text-[#E5E5E5] placeholder-[#525252] focus:outline-none focus:border-[#DC2626] transition-colors"
                    style={{ fontFamily: "IBM Plex Mono, monospace" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#A3A3A3] text-xs"
                    style={{ fontFamily: "IBM Plex Mono, monospace" }}
                  >
                    {showPassword ? "HIDE" : "SHOW"}
                  </button>
                </div>
              </div>

              {/* Remember me & forgot password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 text-[#A3A3A3] cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 bg-[#0A0A0A] border border-[#525252]/30 rounded-sm checked:bg-[#DC2626] checked:border-[#DC2626]"
                  />
                  <span style={{ fontFamily: "IBM Plex Mono, monospace" }}>
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  className="text-[#DC2626] hover:text-[#EF4444] transition-colors"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="group w-full flex items-center justify-center space-x-2 px-6 py-3 bg-[#DC2626] text-[#FFFFFF] rounded-sm hover:bg-[#EF4444] transition-all duration-200 border border-[#DC2626]"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
              >
                <span>Access System</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#525252]/30" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span
                    className="px-2 bg-[#0A0A0A] text-[#525252]"
                    style={{ fontFamily: "IBM Plex Mono, monospace" }}
                  >
                    OR
                  </span>
                </div>
              </div>

              {/* Alternative login */}
              <button
                type="button"
                className="w-full px-6 py-3 bg-transparent text-[#A3A3A3] rounded-sm hover:text-[#FFFFFF] hover:bg-[#1A1A1A] transition-all duration-200 border border-[#525252]/30"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
              >
                Sign in with SSH Key
              </button>
            </form>

            {/* Footer note */}
            <div className="mt-6 pt-6 border-t border-[#525252]/30">
              <p
                className="text-xs text-[#525252] text-center"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
              >
                Protected by military-grade encryption
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
