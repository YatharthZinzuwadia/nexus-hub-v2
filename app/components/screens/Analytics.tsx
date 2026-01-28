import { motion } from "motion/react";
import {
  ArrowLeft,
  TrendingUp,
  Users,
  Eye,
  Clock,
  BarChart3,
  Activity,
  Download,
} from "lucide-react";
import { useState } from "react";

interface AnalyticsProps {
  onNavigate: (screen: string) => void;
}

const Analytics = ({ onNavigate }: AnalyticsProps) => {
  const [timeRange, setTimeRange] = useState("7d");

  const metrics = [
    {
      label: "TOTAL_USERS",
      value: "12,543",
      change: "+12.5%",
      trend: "up",
      icon: Users,
    },
    {
      label: "PAGE_VIEWS",
      value: "45,231",
      change: "+8.2%",
      trend: "up",
      icon: Eye,
    },
    {
      label: "AVG_DURATION",
      value: "4m 32s",
      change: "-2.1%",
      trend: "down",
      icon: Clock,
    },
    {
      label: "BOUNCE_RATE",
      value: "32.4%",
      change: "-5.3%",
      trend: "up",
      icon: Activity,
    },
  ];

  const topPages = [
    { page: "/dashboard", views: 15234, percentage: 33.7 },
    { page: "/projects", views: 12456, percentage: 27.5 },
    { page: "/copilot", views: 8932, percentage: 19.7 },
    { page: "/files", views: 5621, percentage: 12.4 },
    { page: "/tasks", views: 2988, percentage: 6.6 },
  ];

  return (
    <div className="relative w-full min-h-screen bg-background overflow-hidden">
      {/* Grid pattern background */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Header */}
      <motion.div
        className="relative z-10 border-b border-border/30 bg-background/80 backdrop-blur-xl"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", duration: 0.8 }}
      >
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
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
                  ANALYTICS
                </h1>
                <p
                  className="text-xs text-muted-foreground"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  DATA_INSIGHTS_v2.0
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 bg-secondary border border-border/30 rounded-sm p-1">
                {["7d", "30d", "90d", "1y"].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1.5 rounded-sm transition-colors text-xs ${
                      timeRange === range
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    style={{ fontFamily: "IBM Plex Mono, monospace" }}
                  >
                    {range.toUpperCase()}
                  </button>
                ))}
              </div>

              <motion.button
                className="flex items-center space-x-2 px-4 py-2 bg-secondary border border-border/30 rounded-sm hover:border-primary/50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-4 h-4 text-muted-foreground" />
                <span
                  className="text-sm text-muted-foreground hidden md:inline"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  EXPORT
                </span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-8 py-8">
        {/* Key metrics */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.label}
                className="terminal-glass-strong p-6 rounded-sm border border-border/20 hover:border-primary/50 transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <Icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                  <span
                    className={`text-xs px-2 py-1 rounded-sm ${
                      metric.trend === "up"
                        ? "text-green-400 bg-green-400/10 border border-green-400/30"
                        : "text-red-400 bg-red-400/10 border border-red-400/30"
                    }`}
                    style={{ fontFamily: "IBM Plex Mono, monospace" }}
                  >
                    {metric.change}
                  </span>
                </div>
                <div
                  className="text-xs text-muted-foreground mb-2"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  {metric.label}
                </div>
                <div
                  className="text-3xl text-foreground"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  {metric.value}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Charts section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Traffic chart placeholder */}
          <motion.div
            className="terminal-glass-strong p-6 rounded-sm border border-border/20"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3
                className="text-sm text-foreground"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
              >
                TRAFFIC_OVERVIEW
              </h3>
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div className="h-64 flex items-end justify-between space-x-2">
              {[65, 45, 78, 52, 88, 72, 95].map((height, i) => (
                <motion.div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-primary to-destructive rounded-sm"
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-4">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <span
                  key={day}
                  className="text-xs text-muted-foreground"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  {day}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Top pages */}
          <motion.div
            className="terminal-glass-strong p-6 rounded-sm border border-border/20"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3
                className="text-sm text-foreground"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
              >
                TOP_PAGES
              </h3>
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-4">
              {topPages.map((page, index) => (
                <motion.div
                  key={page.page}
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-sm text-foreground"
                      style={{ fontFamily: "IBM Plex Mono, monospace" }}
                    >
                      {page.page}
                    </span>
                    <span
                      className="text-xs text-muted-foreground"
                      style={{ fontFamily: "IBM Plex Mono, monospace" }}
                    >
                      {page.views.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-sm overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-destructive"
                      initial={{ width: 0 }}
                      animate={{ width: `${page.percentage}%` }}
                      transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Real-time activity */}
        <motion.div
          className="terminal-glass-strong p-6 rounded-sm border border-border/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3
              className="text-sm text-foreground"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              REAL_TIME_ACTIVITY
            </h3>
            <div className="flex items-center space-x-2">
              <motion.div
                className="w-2 h-2 rounded-full bg-green-500"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span
                className="text-xs text-muted-foreground"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
              >
                LIVE
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div
                className="text-4xl text-foreground mb-2"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
              >
                247
              </div>
              <div
                className="text-xs text-muted-foreground"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
              >
                ACTIVE_USERS
              </div>
            </div>
            <div className="text-center">
              <div
                className="text-4xl text-foreground mb-2"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
              >
                1,432
              </div>
              <div
                className="text-xs text-muted-foreground"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
              >
                SESSIONS_TODAY
              </div>
            </div>
            <div className="text-center">
              <div
                className="text-4xl text-foreground mb-2"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
              >
                98.7%
              </div>
              <div
                className="text-xs text-muted-foreground"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
              >
                UPTIME
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
