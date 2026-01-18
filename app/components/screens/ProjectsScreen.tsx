import { motion } from "motion/react";
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Star,
  GitFork,
  Code2,
  Zap,
  Database,
  Globe,
} from "lucide-react";
import { useState } from "react";
import { CarbonFiber } from "../effects/CarbonFiber";
import ParticleField from "../effects/ParticleField";

interface ProjectsScreenProps {
  onNavigate: (screen: string) => void;
}

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  stars: number;
  forks: number;
  language: string;
  icon: any;
  status: "active" | "archived" | "wip";
  gradient: string;
}

const ProjectsScreen = ({ onNavigate }: ProjectsScreenProps) => {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "archived">("all");

  const projects: Project[] = [
    {
      id: "nexushub",
      title: "NexusHub Core",
      description:
        "An AI-powered portfolio dashboard with retro-programmer aesthetics and advanced component architecture.",
      tags: ["React", "TypeScript", "Motion", "AI"],
      stars: 2847,
      forks: 421,
      language: "TypeScript",
      icon: Code2,
      status: "active",
      gradient: "from-[#DC2626] to-[#EF4444]",
    },
    {
      id: "quantum-algorithms",
      title: "Quantum Algorithms",
      description:
        "Implementation of quantum computing algorithms in classical systems. Exploring the boundaries of computation.",
      tags: ["Python", "Quantum", "Research"],
      stars: 1523,
      forks: 234,
      language: "Python",
      icon: Zap,
      status: "wip",
      gradient: "from-[#DC2626] to-[#991B1B]",
    },
    {
      id: "neural-forge",
      title: "NeuralForge",
      description:
        "A lightweight neural network framework built from scratch for educational purposes and experimentation.",
      tags: ["Machine Learning", "Neural Networks", "Education"],
      stars: 3241,
      forks: 567,
      language: "Python",
      icon: Database,
      status: "active",
      gradient: "from-[#EF4444] to-[#DC2626]",
    },
    {
      id: "terminal-ui",
      title: "Terminal UI Kit",
      description:
        "A comprehensive UI component library inspired by classic terminal interfaces and retro computing.",
      tags: ["React", "Components", "Design System"],
      stars: 5124,
      forks: 892,
      language: "TypeScript",
      icon: Globe,
      status: "active",
      gradient: "from-[#991B1B] to-[#7F1D1D]",
    },
    {
      id: "distributed-cache",
      title: "DistCache",
      description:
        "High-performance distributed caching system with Redis-like functionality and advanced sharding.",
      tags: ["Go", "Distributed Systems", "Performance"],
      stars: 1876,
      forks: 321,
      language: "Go",
      icon: Database,
      status: "archived",
      gradient: "from-[#525252] to-[#404040]",
    },
    {
      id: "code-poetry",
      title: "Code Poetry Engine",
      description:
        "An experimental project that generates artistic code visualizations and ASCII art from source code.",
      tags: ["Art", "Visualization", "Creative Coding"],
      stars: 892,
      forks: 143,
      language: "JavaScript",
      icon: Code2,
      status: "wip",
      gradient: "from-[#DC2626] to-[#EF4444]",
    },
  ];

  const filteredProjects = projects.filter((p) =>
    filter === "all" ? true : p.status === filter
  );

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden flex flex-col">
      {/* Particle field */}
      <ParticleField density={40} />

      {/* Carbon fiber texture on sides */}
      <CarbonFiber className="w-32" opacity={0.3} />

      {/* Grid pattern background */}
      <div className="absolute inset-0 grid-pattern opacity-15" />

      {/* Header */}
      <div className="relative z-10 border-b border-border/30 bg-background/90 backdrop-blur-xl shrink-0">
        <div className="max-w-[1800px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => onNavigate("dashboard")}
                className="p-2 hover:bg-secondary rounded-sm transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ArrowLeft
                  className="w-5 h-5 text-muted-foreground"
                  strokeWidth={1.5}
                />
              </motion.button>
              <div>
                <h1
                  className="text-xl text-foreground"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  PROJECT_REPOSITORY
                </h1>
                <p
                  className="text-xs text-muted-foreground"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  ~/developer/projects
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-2">
              {(["all", "active", "archived"] as const).map((f) => (
                <motion.button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-sm text-sm transition-all ${
                    filter === f
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground border border-border/30"
                  }`}
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {f.toUpperCase()}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="relative z-10 flex-1 overflow-y-auto">
        <div className="max-w-[1800px] mx-auto px-8 py-8">
          {/* Stats bar */}
          <motion.div
            className="grid grid-cols-4 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {[
              { label: "TOTAL_PROJECTS", value: projects.length },
              {
                label: "ACTIVE",
                value: projects.filter((p) => p.status === "active").length,
              },
              {
                label: "IN_PROGRESS",
                value: projects.filter((p) => p.status === "wip").length,
              },
              {
                label: "TOTAL_STARS",
                value: projects
                  .reduce((sum, p) => sum + p.stars, 0)
                  .toLocaleString(),
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="terminal-glass p-4 rounded-sm border border-border/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div
                  className="text-xs text-muted-foreground mb-1"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  {stat.label}
                </div>
                <div
                  className="text-2xl text-foreground"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  {stat.value}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Projects grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => {
              const Icon = project.icon;
              return (
                <motion.div
                  key={project.id}
                  className="relative group"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                  whileHover={{ y: -8 }}
                >
                  <div className="terminal-glass-strong rounded-sm border border-border/30 overflow-hidden h-full flex flex-col group-hover:border-primary/50 transition-all duration-300">
                    {/* Card header with gradient */}
                    <div
                      className={`relative p-6 bg-gradient-to-br ${project.gradient} overflow-hidden`}
                    >
                      <motion.div
                        className="absolute inset-0 bg-background"
                        initial={{ opacity: 0.5 }}
                        whileHover={{ opacity: 0.3 }}
                      />

                      {/* Animated background pattern */}
                      <motion.div
                        className="absolute inset-0 opacity-10"
                        style={{
                          backgroundImage:
                            "repeating-linear-gradient(45deg, transparent, transparent 10px, currentColor 10px, currentColor 11px)",
                        }}
                        animate={{
                          x: hoveredProject === project.id ? [0, 20, 0] : 0,
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />

                      <div className="relative z-10 flex items-start justify-between">
                        <motion.div
                          animate={
                            hoveredProject === project.id
                              ? { rotate: 360, scale: 1.1 }
                              : {}
                          }
                          transition={{ duration: 0.6 }}
                        >
                          <Icon
                            className="w-8 h-8 text-primary-foreground"
                            strokeWidth={1.5}
                          />
                        </motion.div>
                        <div
                          className={`px-2 py-1 bg-black/50 rounded-sm text-xs ${
                            project.status === "active"
                              ? "text-green-500"
                              : project.status === "wip"
                              ? "text-yellow-500"
                              : "text-muted-foreground"
                          }`}
                          style={{ fontFamily: "IBM Plex Mono, monospace" }}
                        >
                          {project.status.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3
                        className="text-xl text-foreground mb-2"
                        style={{ fontFamily: "IBM Plex Mono, monospace" }}
                      >
                        {project.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed flex-1">
                        {project.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.map((tag) => (
                          <motion.span
                            key={tag}
                            className="px-2 py-1 bg-secondary border border-border/30 rounded-sm text-xs text-muted-foreground"
                            style={{ fontFamily: "IBM Plex Mono, monospace" }}
                            whileHover={{
                              scale: 1.05,
                              borderColor: "rgba(220, 38, 38, 0.5)",
                            }}
                          >
                            #{tag}
                          </motion.span>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between pt-4 border-t border-border/20">
                        <div
                          className="flex items-center space-x-4 text-xs text-muted-foreground"
                          style={{ fontFamily: "IBM Plex Mono, monospace" }}
                        >
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4" />
                            <span>{project.stars.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <GitFork className="w-4 h-4" />
                            <span>{project.forks}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <motion.button
                            className="p-2 bg-secondary border border-border/30 rounded-sm hover:border-primary/50 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Github className="w-4 h-4 text-muted-foreground" />
                          </motion.button>
                          <motion.button
                            className="p-2 bg-secondary border border-border/30 rounded-sm hover:border-primary/50 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <ExternalLink className="w-4 h-4 text-muted-foreground" />
                          </motion.button>
                        </div>
                      </div>
                    </div>

                    {/* Hover effect line */}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>

                  {/* Glow effect on hover */}
                  <motion.div
                    className="absolute -inset-1 bg-primary rounded-sm blur-xl -z-10"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: hoveredProject === project.id ? 0.2 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              );
            })}
          </div>

          {/* Footer */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p
              className="text-muted-foreground text-sm"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              // "Talk is cheap. Show me the code." — Linus Torvalds
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsScreen;
