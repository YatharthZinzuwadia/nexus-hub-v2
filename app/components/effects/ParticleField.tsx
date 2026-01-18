"use client";
import { useEffect, useRef, useState, useMemo } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

interface ParticleFieldDrops {
  density?: number;
  color?: string;
  interactive?: boolean;
  connectionDistance?: number;
}
const ParticleField = ({
  density = 50,
  color = "#DC2626",
  interactive = true,
  connectionDistance = 150,
}: ParticleFieldDrops) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [dynamicColor, setDynamicColor] = useState(color);

  useEffect(() => {
    // Function to get CSS variable value
    const getThemeColor = () => {
      if (typeof window === "undefined") return color;
      const docStyle = getComputedStyle(document.documentElement);
      const primaryVar = docStyle.getPropertyValue("--primary").trim();
      return primaryVar || color;
    };

    setDynamicColor(getThemeColor());

    // Optional: Observe theme changes if you have a class change on html/body
    const observer = new MutationObserver(() => {
      setDynamicColor(getThemeColor());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class", "style"],
    });

    return () => observer.disconnect();
  }, [color]);

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Memoize particle initialization to avoid recreating on every render
  const initialParticles = useMemo(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return [];

    return Array.from({ length: density }, () => ({
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.3,
      color: dynamicColor,
    }));
  }, [dimensions.width, dimensions.height, density, dynamicColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Initialize particles from memoized value
    particlesRef.current = initialParticles;

    // mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    if (interactive) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    // animation loop with optimizations
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const particleCount = particles.length;

      // Update and draw particles
      for (let i = 0; i < particleCount; i++) {
        const particle = particles[i];

        // update pos
        particle.x += particle.vx;
        particle.y += particle.vy;

        // bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Interactive: Attract to mouse
        if (interactive) {
          const dx = mouseRef.current.x - particle.x;
          const dy = mouseRef.current.y - particle.y;
          const distanceSquared = dx * dx + dy * dy;
          const interactionDistance = 200;
          const interactionDistanceSquared =
            interactionDistance * interactionDistance;

          if (distanceSquared < interactionDistanceSquared) {
            const distance = Math.sqrt(distanceSquared);
            const force =
              (interactionDistance - distance) / interactionDistance;
            particle.vx += (dx / distance) * force * 0.02;
            particle.vy += (dy / distance) * force * 0.02;
          }
        }

        // friction
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();

        // Draw connections - optimized with early exit
        const connectionDistanceSquared =
          connectionDistance * connectionDistance;
        for (let j = i + 1; j < particleCount; j++) {
          const other = particles[j];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distanceSquared = dx * dx + dy * dy;

          // Early exit if too far
          if (distanceSquared > connectionDistanceSquared) continue;

          const distance = Math.sqrt(distanceSquared);
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = particle.color;
          ctx.globalAlpha = (1 - distance / connectionDistance) * 0.15;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (interactive) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [dimensions, initialParticles, interactive, connectionDistance]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-60"
      style={{ willChange: "transform" }}
    />
  );
};

export default ParticleField;
