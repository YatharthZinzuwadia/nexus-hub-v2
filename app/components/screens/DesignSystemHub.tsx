import { motion } from "motion/react";
import {
  Palette,
  Blocks,
  Sparkles,
  Box,
  GitBranch,
  Zap,
  Layout,
  Bell,
  User,
  Settings,
  ArrowLeft,
  Terminal,
} from "lucide-react";

interface DesignSystemHubProps {
  onNavigate: (screen: string) => void;
}

const cards = [
  {
    id: "design-foundations",
    icon: Palette,
    title: "Design Foundations",
    description: "Colors, Typography, Spacing",
    tag: "CORE",
  },
  {
    id: "component-library",
    icon: Blocks,
    title: "Component Library",
    description: "50+ Reusable Components",
    tag: "MODULES",
  },
  {
    id: "animation-showcase",
    icon: Sparkles,
    title: "Animation States",
    description: "Transitions & Interactions",
    tag: "MOTION",
  },
  {
    id: "3d-views",
    icon: Box,
    title: "3D Isometric Views",
    description: "Multi-Perspective Gallery",
    tag: "3D",
  },
  {
    id: "user-flows",
    icon: GitBranch,
    title: "User Flow Diagrams",
    description: "Navigation Architecture",
    tag: "FLOWS",
  },
  {
    id: "micro-interactions",
    icon: Zap,
    title: "Micro-Interactions",
    description: "Subtle Feedback Details",
    tag: "UX",
  },
  {
    id: "responsive-design",
    icon: Layout,
    title: "Responsive Design",
    description: "Breakpoint System",
    tag: "LAYOUT",
  },
  {
    id: "notification-system",
    icon: Bell,
    title: "Notification System",
    description: "Alerts & Toasts",
    tag: "FEEDBACK",
  },
];

const DesignSystemHub = ({ onNavigate }: DesignSystemHubProps) => {
  return (
    <div className="relative w-full h-screen bg-background overflow-hidden">
      {/* Grid pattern background */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Header */}
      <div className="relative z-10 border-b border-border/30 bg-background/80 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate("dashboard")}
                className="p-2 hover:bg-secondary rounded-sm transition-colors"
              >
                <ArrowLeft
                  className="w-5 h-5 text-muted-foreground"
                  strokeWidth={1.5}
                />
              </button>
              <div>
                <h1
                  className="text-xl text-foreground"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  DESIGN_SYSTEM
                </h1>
                <p
                  className="text-xs text-muted-foreground"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  DOCUMENTATION_HUB
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 px-3 py-1 bg-secondary border border-border/30 rounded-sm">
              <Terminal className="w-4 h-4 text-primary" />
              <span
                className="text-muted-foreground text-xs"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
              >
                v0.2.0
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-8 py-8 h-[calc(100vh-80px)] overflow-y-auto">
        {/* Header section */}
        <div className="mb-12 text-center">
          <h2 className="text-5xl text-foreground mb-4">
            Design <span className="text-primary">System</span> Hub
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A comprehensive library of components, patterns, and guidelines.
            Built for developers who care about craft.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-12">
          <div className="terminal-glass p-6 rounded-sm border border-border/20 text-center">
            <div
              className="text-3xl text-foreground mb-2"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              50+
            </div>
            <div className="text-sm text-muted-foreground">Components</div>
          </div>
          <div className="terminal-glass p-6 rounded-sm border border-border/20 text-center">
            <div
              className="text-3xl text-foreground mb-2"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              20+
            </div>
            <div className="text-sm text-muted-foreground">Animations</div>
          </div>
          <div className="terminal-glass p-6 rounded-sm border border-border/20 text-center">
            <div
              className="text-3xl text-foreground mb-2"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              100%
            </div>
            <div className="text-sm text-muted-foreground">Accessible</div>
          </div>
          <div className="terminal-glass p-6 rounded-sm border border-border/20 text-center">
            <div
              className="text-3xl text-foreground mb-2"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              MIT
            </div>
            <div className="text-sm text-muted-foreground">Licensed</div>
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.button
                key={card.id}
                onClick={() => onNavigate(card.id)}
                whileHover={{ y: -4 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group terminal-glass p-6 rounded-sm border border-border/20 hover:border-primary/50 transition-all duration-300 text-left"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-secondary border border-border/30 rounded-sm">
                    <Icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                  </div>
                  <span
                    className="text-xs px-2 py-1 bg-secondary border border-border/30 rounded-sm text-muted-foreground"
                    style={{ fontFamily: "IBM Plex Mono, monospace" }}
                  >
                    {card.tag}
                  </span>
                </div>

                <h3 className="text-lg text-foreground mb-2">{card.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {card.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border/20">
                  <span
                    className="text-xs text-muted-foreground"
                    style={{ fontFamily: "IBM Plex Mono, monospace" }}
                  >
                    Documentation
                  </span>
                  <span
                    className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ fontFamily: "IBM Plex Mono, monospace" }}
                  >
                    OPEN →
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 terminal-glass-strong p-6 rounded-sm border border-border/30">
          <div className="flex items-center justify-between">
            <div>
              <h3
                className="text-sm text-foreground mb-1"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
              >
                DESIGN_PHILOSOPHY
              </h3>
              <p className="text-xs text-muted-foreground">
                Minimalist. Functional. Professional. Every component serves a
                purpose.
              </p>
            </div>
            <div className="text-right">
              <p
                className="text-xs text-muted-foreground"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
              >
                // "Simplicity is the ultimate sophistication." — Leonardo da
                Vinci
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignSystemHub;
