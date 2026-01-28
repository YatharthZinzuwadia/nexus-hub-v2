"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  FolderGit2,
  FolderOpen,
  Bot,
  CheckSquare,
  BarChart3,
  Calendar,
  User,
  Cpu,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Terminal as TerminalIcon,
  Activity,
  Zap,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/auth-store";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DashboardShellProps {
  children: React.ReactNode;
}

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid, code: "01" },
  { label: "Files", href: "/files", icon: FolderOpen, code: "02" },
  { label: "Co-Pilot", href: "/copilot", icon: Bot, code: "03" },
  { label: "Projects", href: "/projects", icon: FolderGit2, code: "04" },
  { label: "Tasks", href: "/tasks", icon: CheckSquare, code: "05" },
  { label: "Analytics", href: "/analytics", icon: BarChart3, code: "06" },
  { label: "Automation", href: "/automation", icon: Zap, code: "07" },
  { label: "Calendar", href: "/calendar", icon: Calendar, code: "08" },
  { label: "Profile", href: "/profile", icon: User, code: "09" },
  { label: "Design System", href: "/design", icon: Cpu, code: "10" },
  { label: "System", href: "/config", icon: Settings, code: "11" },
];

export default function DashboardShell({ children }: DashboardShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();

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

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground flex relative selection:bg-primary/30 selection:text-primary-foreground overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#3B82F6]/5 blur-[120px]" />
      </div>

      {/* Desktop Floating Sidebar (The "Neural Link") */}
      <motion.aside
        className="hidden md:flex flex-col fixed left-4 top-4 bottom-4 z-40 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl bg-black/40 overflow-hidden"
        initial={{ width: 80 }}
        animate={{ width: isSidebarHovered ? 280 : 80 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
      >
        {/* Decorative Grid Texture */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Animated Scanline */}
        <motion.div
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
          animate={{ top: ["0%", "100%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />

        {/* Header / Logo Area */}
        <div className="h-20 flex items-center justify-center shrink-0 relative z-10 border-b border-white/5">
          <AnimatePresence mode="wait">
            {isSidebarHovered ? (
              <motion.div
                key="full-logo"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-2"
              >
                <TerminalIcon className="w-6 h-6 text-primary" />
                <div className="flex flex-col">
                  <span
                    className="font-bold tracking-[0.2em] text-sm leading-none"
                    style={{ fontFamily: "IBM Plex Mono, monospace" }}
                  >
                    NEXUS<span className="text-primary">HUB</span>
                  </span>
                  <span className="text-[9px] text-muted-foreground tracking-widest leading-none mt-1">
                    SYSTEM.V2
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="mini-logo"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                  <TerminalIcon className="w-5 h-5 text-primary" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-2 relative z-10 custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  className={`relative flex items-center h-12 rounded-xl transition-all duration-300 group cursor-none-interactive ${
                    isActive
                      ? "bg-primary/20 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)] border border-primary/30"
                      : "hover:bg-white/5 text-muted-foreground hover:text-white border border-transparent"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Active Indicator Line (Left) */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-3 bottom-3 w-1 bg-primary rounded-r-full shadow-[0_0_10px_#DC2626]"
                    />
                  )}

                  {/* Icon Container */}
                  <div className="w-14 shrink-0 flex items-center justify-center">
                    <Icon
                      className={`w-5 h-5 transition-colors duration-300 ${
                        isActive
                          ? "text-primary drop-shadow-[0_0_5px_rgba(220,38,38,0.8)]"
                          : "group-hover:text-primary"
                      }`}
                    />
                  </div>

                  {/* Label Container (Hidden when collapsed) */}
                  <div className="flex-1 flex items-center justify-between overflow-hidden pr-3">
                    <motion.span
                      className="text-sm font-medium whitespace-nowrap"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{
                        opacity: isSidebarHovered ? 1 : 0,
                        x: isSidebarHovered ? 0 : -10,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.label}
                    </motion.span>

                    {/* Decimal Code Decoration */}
                    <motion.span
                      className="text-[9px] text-white/20 font-mono"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isSidebarHovered ? 1 : 0 }}
                    >
                      {item.code}
                    </motion.span>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* System Status / Footer */}
        <div className="mt-auto p-4 relative z-10 border-t border-white/5 bg-black/20">
          {isSidebarHovered ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">OP</span>
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-medium text-white truncate">
                    {user?.email}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                    <span className="text-[9px] text-muted-foreground uppercase tracking-wider">
                      Online
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full h-9 flex items-center justify-center gap-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs border border-red-500/20 transition-all font-medium group"
              >
                <LogOut className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                DISCONNECT
              </button>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-[#22C55E] shadow-[0_0_10px_#22C55E]" />
              <button
                onClick={handleLogout}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-muted-foreground hover:text-red-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </motion.aside>

      {/* Main Content Area */}
      {/* Added ml-24 (collapsed width + padding) to prevent content being hidden under fixed sidebar */}
      <main className="flex-1 md:ml-28 flex flex-col min-h-screen relative">
        {/* Mobile Header */}
        <div className="md:hidden h-16 border-b border-border/30 flex items-center justify-between px-4 bg-background/80 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <TerminalIcon className="w-5 h-5 text-primary" />
            <span
              className="font-bold tracking-wider text-xs"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              NEXUS
            </span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 -mr-2 text-muted-foreground hover:text-foreground"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Content Scroll Area */}
        <div className="flex-1 p-4 md:p-8">{children}</div>

        {/* Mobile Menu Overlay - Keeping consistent but improved styling */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              className="absolute inset-0 top-16 bg-black/90 backdrop-blur-3xl z-50 md:hidden flex flex-col p-4 fixed"
            >
              <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />

              <nav className="flex-1 space-y-2 relative z-10">
                {navItems.map((item, idx) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} href={item.href}>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`flex items-center p-4 rounded-xl border ${
                          isActive
                            ? "bg-primary/20 border-primary/50 text-white"
                            : "border-white/10 text-muted-foreground bg-white/5"
                        }`}
                      >
                        <Icon className="w-5 h-5 mr-4" />
                        <span className="font-medium tracking-wide">
                          {item.label}
                        </span>
                        {isActive && (
                          <div className="w-2 h-2 rounded-full bg-primary ml-auto shadow-[0_0_10px_#DC2626]" />
                        )}
                      </motion.div>
                    </Link>
                  );
                })}
              </nav>
              <button
                onClick={handleLogout}
                className="mt-6 w-full flex items-center justify-center gap-2 p-4 rounded-xl text-sm font-medium text-red-300 bg-red-500/10 border border-red-500/20 relative z-10"
              >
                <LogOut className="w-4 h-4" />
                DISCONNECT_SESSION
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
