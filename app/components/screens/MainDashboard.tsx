/**
 * TODO : Main circuit board change to actual graphic 3d motherboard model.
 * might need 3d libraries and graphics software to create the model.
 * improve animations of the elements.
 *
 */

import { motion } from "motion/react";
import {
  Search,
  Bell,
  FolderOpen,
  Cpu,
  Bot,
  User,
  Terminal,
  Activity,
  Settings,
  FolderGit2,
  Code2,
  Zap,
  LogOut,
  Sun,
  Moon,
  CheckSquare,
  BarChart3,
  Calendar,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { type LucideIcon } from "lucide-react";
import ParticleField from "../effects/ParticleField";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/lib/store/theme-store";
import { useAuthStore } from "@/lib/store/auth-store";
import { toast } from "sonner";

interface MainDashboardProps {
  onNavigate: (screen: string) => void;
}

interface Module {
  id: string;
  icon: LucideIcon;
  label: string;
  screen: string;
  status: "online" | "idle" | "processing";
  description: string;
  position: { x: number; y: number };
}

const MainDashboard = ({ onNavigate }: MainDashboardProps) => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Update time
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Logout handler
  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  // Theme toggle handler
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Modules positioned like components on a motherboard
  const modules: Module[] = [
    {
      id: "files",
      icon: FolderOpen,
      label: "File Storage",
      screen: "files",
      status: "online",
      description: "STORAGE_VAULT",
      position: { x: 15, y: 15 },
    },
    {
      id: "copilot",
      icon: Bot,
      label: "AI Co-Pilot",
      screen: "copilot",
      status: "processing",
      description: "NEURAL_CORE",
      position: { x: 50, y: 12 },
    },
    {
      id: "projects",
      icon: FolderGit2,
      label: "Projects Hub",
      screen: "projects",
      status: "online",
      description: "DEV_ARRAY",
      position: { x: 85, y: 18 },
    },
    {
      id: "tasks",
      icon: CheckSquare,
      label: "Task Manager",
      screen: "tasks",
      status: "online",
      description: "WORKFLOW_ENGINE",
      position: { x: 20, y: 45 },
    },
    {
      id: "analytics",
      icon: BarChart3,
      label: "Analytics",
      screen: "analytics",
      status: "online",
      description: "DATA_INSIGHTS",
      position: { x: 50, y: 50 },
    },
    {
      id: "automation",
      icon: Zap,
      label: "Automation",
      screen: "automation",
      status: "processing",
      description: "AUTO_PILOT",
      position: { x: 80, y: 48 },
    },
    {
      id: "calendar",
      icon: Calendar,
      label: "Calendar",
      screen: "calendar",
      status: "online",
      description: "TIME_SYNC",
      position: { x: 25, y: 75 },
    },
    {
      id: "config",
      icon: Settings,
      label: "System Config",
      screen: "config",
      status: "idle",
      description: "CORE_SETTINGS",
      position: { x: 75, y: 78 },
    },
  ];

  const quickStats = [
    { label: "UPTIME", value: "99.9%", icon: Activity },
    { label: "LATENCY", value: "<12ms", icon: Zap },
    { label: "MODULES", value: "8/8", icon: Cpu },
    { label: "STATUS", value: "NOMINAL", icon: Terminal },
  ];

  return (
    <div ref={containerRef} className="relative w-full h-full bg-transparent">
      {/* Circuit board background */}
      {/* <CircuitBoard nodeCount={30} animated={true} /> */}

      {/* Interactive particle field */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <ParticleField
          density={70}
          interactive={true}
          connectionDistance={200}
        />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />

      {/* Mouse follower effect */}
      <motion.div
        className="absolute w-64 h-64 bg-primary rounded-full blur-3xl pointer-events-none z-0"
        animate={{
          x: mousePosition.x - 128,
          y: mousePosition.y - 128,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
        style={{ opacity: 0.05 }}
      />

      {/* Main content */}
      <div className="relative z-10 w-full mx-auto pb-8">
        {/* Welcome section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <motion.h2
                className="text-3xl text-foreground mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                Welcome Back,{" "}
                <motion.span
                  className="text-primary"
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
                </motion.span>
              </motion.h2>
              <p className="text-muted-foreground">
                All systems operational. NexusHub initialized.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <motion.div className="relative" whileHover={{ scale: 1.05 }}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-48 pl-10 pr-4 py-2 bg-secondary/50 border border-border/30 rounded-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary text-sm transition-all"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                />
              </motion.div>
              <div className="text-right hidden md:block">
                <motion.div
                  className="text-2xl text-foreground"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                  key={time}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                >
                  {time}
                </motion.div>
                <div
                  className="text-sm text-muted-foreground"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickStats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  className="terminal-glass p-4 rounded-sm border border-border/20 relative overflow-hidden group hover:border-primary/50 transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity"
                    initial={false}
                  />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className="text-xs text-muted-foreground"
                        style={{ fontFamily: "IBM Plex Mono, monospace" }}
                      >
                        {stat.label}
                      </div>
                      <Icon
                        className="w-4 h-4 text-primary"
                        strokeWidth={1.5}
                      />
                    </div>
                    <div
                      className="text-2xl text-foreground"
                      style={{ fontFamily: "IBM Plex Mono, monospace" }}
                    >
                      {stat.value}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Motherboard-style module layout - Visual Map */}
        <motion.div
          className="mb-8 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className="text-xl text-foreground"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              SYSTEM_MAP
            </h3>
            <div
              className="flex items-center space-x-2 text-xs text-muted-foreground"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              <Activity className="w-4 h-4 text-[#22C55E]" />
              <span>Interactive Navigation Activated</span>
            </div>
          </div>

          {/* Circuit Graphics - Desktop */}
          <div className="relative h-96 lg:h-125 terminal-glass-strong rounded-sm border border-border/30 overflow-hidden hidden md:block">
            {/* Circuit traces background pattern */}
            <svg
              className="absolute inset-0 w-full h-full opacity-20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="circuit"
                  x="0"
                  y="0"
                  width="100"
                  height="100"
                  patternUnits="userSpaceOnUse"
                >
                  <line
                    x1="0"
                    y1="50"
                    x2="100"
                    y2="50"
                    stroke="currentColor"
                    className="text-border"
                    strokeWidth="1"
                  />
                  <line
                    x1="50"
                    y1="0"
                    x2="50"
                    y2="100"
                    stroke="currentColor"
                    className="text-border"
                    strokeWidth="1"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="3"
                    fill="currentColor"
                    className="text-border"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#circuit)" />
            </svg>

            {/* Connection Lines */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {modules.map((module, i) => {
                const nextModule = modules[(i + 1) % modules.length];
                const x1 = `${module.position.x}%`;
                const y1 = `${module.position.y}%`;
                const x2 = `${nextModule.position.x}%`;
                const y2 = `${nextModule.position.y}%`;

                return (
                  <g key={`connection-${i}`}>
                    <motion.line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="var(--primary)"
                      strokeWidth="2"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.3 }}
                      transition={{ duration: 2, delay: i * 0.2 }}
                    />
                    <motion.circle
                      r="4"
                      fill="var(--primary)"
                      initial={{ offsetDistance: "0%" }}
                      animate={{ offsetDistance: "100%" }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.5,
                        ease: "linear",
                      }}
                      style={{
                        offsetPath: `path("M ${x1} ${y1} L ${x2} ${y2}")`,
                        offsetDistance: "0%",
                      }}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Modules (Clickable) */}
            {modules.map((module, index) => {
              const Icon = module.icon;
              return (
                <motion.button
                  key={module.id}
                  onClick={() => onNavigate(module.screen)}
                  onMouseEnter={() => setHoveredModule(module.id)}
                  onMouseLeave={() => setHoveredModule(null)}
                  className="absolute group"
                  style={{
                    left: `${module.position.x}%`,
                    top: `${module.position.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.7 + index * 0.1,
                    type: "spring",
                    stiffness: 200,
                  }}
                  whileHover={{ scale: 1.15, z: 50 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute -inset-8 bg-primary rounded-full blur-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredModule === module.id ? 0.4 : 0 }}
                  />

                  <div className="relative terminal-glass-strong p-6 rounded-sm border-2 border-border/30 group-hover:border-primary transition-all duration-300">
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex space-x-1">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-1 h-2 bg-muted-foreground rounded-sm"
                        />
                      ))}
                    </div>

                    <Icon
                      className="w-8 h-8 text-primary mb-2"
                      strokeWidth={1.5}
                    />

                    <div
                      className="text-xs text-foreground mb-1 whitespace-nowrap"
                      style={{ fontFamily: "IBM Plex Mono, monospace" }}
                    >
                      {module.label}
                    </div>
                    <div
                      className="text-[10px] text-muted-foreground mb-2"
                      style={{ fontFamily: "IBM Plex Mono, monospace" }}
                    >
                      {module.description}
                    </div>

                    <div className="flex items-center justify-center space-x-1">
                      <motion.div
                        className={`w-2 h-2 rounded-full ${
                          module.status === "online"
                            ? "bg-[#22C55E]"
                            : module.status === "processing"
                              ? "bg-[#F59E0B]"
                              : "bg-muted-foreground"
                        }`}
                        animate={{
                          scale: module.status !== "idle" ? [1, 1.3, 1] : 1,
                          opacity: module.status !== "idle" ? [1, 0.5, 1] : 1,
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>

                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-1 h-2 bg-muted-foreground rounded-sm"
                        />
                      ))}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Quick Links Grid - Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            {modules.map((module, index) => {
              const Icon = module.icon;
              return (
                <motion.button
                  key={module.id}
                  onClick={() => onNavigate(module.screen)}
                  className="relative p-4 terminal-glass rounded-sm border border-border/30 hover:border-primary transition-all text-left group overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div className="absolute -right-4 -top-4 w-12 h-12 bg-primary rounded-full blur-xl opacity-0 group-hover:opacity-20 transition-opacity" />

                  <div className="flex justify-between items-start mb-3">
                    <Icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                    <div
                      className={`w-2 h-2 rounded-full ${
                        module.status === "online"
                          ? "bg-[#22C55E]"
                          : module.status === "processing"
                            ? "bg-[#F59E0B]"
                            : "bg-[#737373]"
                      }`}
                    />
                  </div>

                  <div
                    className="text-sm text-foreground font-medium mb-1"
                    style={{ fontFamily: "IBM Plex Mono, monospace" }}
                  >
                    {module.label}
                  </div>
                  <div
                    className="text-[10px] text-muted-foreground"
                    style={{ fontFamily: "IBM Plex Mono, monospace" }}
                  >
                    {module.description}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* System log */}
        <motion.div
          className="terminal-glass-strong rounded-sm border border-border/30 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="px-6 py-4 bg-popover border-b border-border/30 flex items-center justify-between">
            <h3
              className="text-sm text-foreground"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              SYSTEM_LOG
            </h3>
            <Code2 className="w-4 h-4 text-border" />
          </div>
          <div
            className="p-6 space-y-3"
            style={{ fontFamily: "IBM Plex Mono, monospace" }}
          >
            {[
              {
                time: "14:32:18",
                action: "Neural processor initialized",
                status: "success",
              },
              {
                time: "14:31:55",
                action: "Circuit board mapped successfully",
                status: "success",
              },
              {
                time: "14:31:42",
                action: "All modules responding",
                status: "success",
              },
              {
                time: "14:31:28",
                action: "Particle field activated",
                status: "processing",
              },
            ].map((log, i) => (
              <motion.div
                key={i}
                className="flex items-start space-x-3 text-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + i * 0.1 }}
              >
                <span className="text-muted-foreground w-20 shrink-0">
                  {log.time}
                </span>
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    log.status === "success"
                      ? "bg-[#22C55E]"
                      : "bg-[#F59E0B] animate-pulse"
                  }`}
                />
                <span className="text-foreground">{log.action}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer quote */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <p
            className="text-muted-foreground text-xs"
            style={{ fontFamily: "IBM Plex Mono, monospace" }}
          >
            &quot;The motherboard is the soul of the machine&quot; — Anonymous
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default MainDashboard;
