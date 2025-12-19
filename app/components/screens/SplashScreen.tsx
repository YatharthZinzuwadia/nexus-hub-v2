"use client";
import React, { useState } from "react";
import ParticleField from "../effects/ParticleField";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [progress, setProgress] = useState(0);
  return (
    <div className="relative w-full h-screen bg-black flex items-center justify-center">
      {/* Particle field */}
      <ParticleField density={400} interactive={true} />
      {/* Grid background */}
      {/* Animated scanlines */}
      {/* Radial gradient overlay */}
    </div>
  );
};

export default SplashScreen;
