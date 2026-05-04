import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Send,
  Sparkles,
  Terminal,
  Copy,
  Download,
  Zap,
  Brain,
  Code2,
  Cpu,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { motion } from "motion/react";
import { CarbonFiber } from "../effects/CarbonFiber";
import ParticleField from "../effects/ParticleField";
import { useChatbot } from "../../../hooks/useChatbot";

interface CoPilotProps {
  onNavigate: (screen: string) => void;
}

const CoPilot = ({ onNavigate }: CoPilotProps) => {
  const [input, setInput] = useState("");
  const [cpuUsage, setCpuUsage] = useState(42);
  const [memoryUsage, setMemoryUsage] = useState(68);
  const [neuralNodes] = useState<
    Array<{
      initialX: number;
      initialY: number;
      animateX: number[];
      animateY: number[];
      duration: number;
    }>
  >(() =>
    Array.from({ length: 20 }, () => ({
      initialX: Math.random() * 100,
      initialY: Math.random() * 100,
      animateX: [Math.random() * 100, Math.random() * 100],
      animateY: [Math.random() * 100, Math.random() * 100],
      duration: 20 + Math.random() * 10,
    })),
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    conversationId,
    isLoading,
    error,
    sendMessage,
    clearConversation,
  } = useChatbot({
    onError: (err) => {
      console.error("Chatbot error:", err);
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate system metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage((prev) =>
        Math.min(100, Math.max(20, prev + (Math.random() - 0.5) * 10)),
      );
      setMemoryUsage((prev) =>
        Math.min(100, Math.max(30, prev + (Math.random() - 0.5) * 8)),
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    await sendMessage(input);
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const aiCapabilities = [
    { icon: Brain, label: "Neural Processing", value: "47 Layers" },
    { icon: Zap, label: "Response Time", value: "<200ms" },
    { icon: Code2, label: "Languages", value: "120+" },
    { icon: Cpu, label: "Model Size", value: "175B" },
  ];

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden flex flex-col">
      {/* Particle effects */}
      <ParticleField density={50} />

      {/* Carbon fiber texture on sides */}
      <div className="hidden md:block absolute left-0 top-0 bottom-0 w-32">
        <CarbonFiber opacity={0.3} />
      </div>
      <div className="hidden md:block absolute right-0 top-0 bottom-0 w-32">
        <CarbonFiber opacity={0.3} />
      </div>

      {/* Grid pattern background */}
      <div className="absolute inset-0 grid-pattern opacity-15" />

      {/* Animated neural network visualization */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="neuralGlow">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </radialGradient>
          </defs>
          {neuralNodes.map((node, i) => (
            <motion.circle
              key={i}
              r="3"
              fill="url(#neuralGlow)"
              initial={{
                cx: `${node.initialX}%`,
                cy: `${node.initialY}%`,
              }}
              animate={{
                cx: node.animateX.map((x) => `${x}%`),
                cy: node.animateY.map((y) => `${y}%`),
              }}
              transition={{
                duration: node.duration,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </svg>
      </div>

      {/* Header */}
      <motion.div
        className="relative z-10 border-b border-border/30 bg-background/90 backdrop-blur-xl shrink-0"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", duration: 0.8 }}
      >
        <div className="max-w-400 mx-auto px-4 md:px-8 py-4">
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
                  CO_PILOT
                </h1>
                <p
                  className="text-xs text-muted-foreground"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  AI_ASSISTANT_v0.2.0
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* AI Status */}
              <motion.div
                className="flex items-center space-x-2 px-4 py-2 bg-secondary border border-border/30 rounded-sm"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className={`w-2 h-2 rounded-full ${
                    error
                      ? "bg-red-500"
                      : isLoading
                        ? "bg-yellow-500"
                        : "bg-green-500"
                  }`}
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span
                  className="text-muted-foreground text-xs"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  {error
                    ? "AI_ERROR"
                    : isLoading
                      ? "AI_PROCESSING"
                      : "AI_ONLINE"}
                </span>
              </motion.div>

              {/* System metrics */}
              <div className="hidden md:flex items-center space-x-3">
                {[
                  { label: "CPU", value: cpuUsage },
                  { label: "MEM", value: memoryUsage },
                ].map((metric) => (
                  <div
                    key={metric.label}
                    className="flex items-center space-x-2"
                  >
                    <span
                      className="text-xs text-muted-foreground"
                      style={{ fontFamily: "IBM Plex Mono, monospace" }}
                    >
                      {metric.label}
                    </span>
                    <div className="w-16 h-2 bg-secondary rounded-sm overflow-hidden">
                      <motion.div
                        className="h-full bg-linear-to-r from-primary to-destructive"
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.value}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <span
                      className="text-xs text-muted-foreground w-8"
                      style={{ fontFamily: "IBM Plex Mono, monospace" }}
                    >
                      {Math.floor(metric.value)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* AI Capabilities Bar */}
      <motion.div
        className="relative z-10 border-b border-border/30 bg-background/80 backdrop-blur-xl shrink-0"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="max-w-400 mx-auto px-4 md:px-8 py-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {aiCapabilities.map((cap, i) => {
              const Icon = cap.icon;
              return (
                <motion.div
                  key={cap.label}
                  className="flex items-center space-x-3 p-2 terminal-glass rounded-sm border border-border/20"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  whileHover={{
                    scale: 1.05,
                    borderColor: "rgba(220, 38, 38, 0.5)",
                  }}
                >
                  <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  <div>
                    <div
                      className="text-xs text-muted-foreground"
                      style={{ fontFamily: "IBM Plex Mono, monospace" }}
                    >
                      {cap.label}
                    </div>
                    <div
                      className="text-sm text-foreground"
                      style={{ fontFamily: "IBM Plex Mono, monospace" }}
                    >
                      {cap.value}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Chat messages */}
      <div className="relative z-10 flex-1 overflow-y-auto text-foreground">
        <div className="max-w-250 mx-auto px-4 md:px-8 py-8 space-y-6">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                className={`max-w-[85%] ${
                  message.role === "system" ? "w-full" : ""
                }`}
              >
                {/* Header */}
                <div className="flex items-center space-x-2 mb-2">
                  {message.role === "assistant" && (
                    <>
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Sparkles
                          className="w-4 h-4 text-primary"
                          strokeWidth={1.5}
                        />
                      </motion.div>
                      <span
                        className="text-xs text-muted-foreground"
                        style={{ fontFamily: "IBM Plex Mono, monospace" }}
                      >
                        NexusAI
                      </span>
                    </>
                  )}
                  {message.role === "user" && (
                    <>
                      <Terminal
                        className="w-4 h-4 text-muted-foreground"
                        strokeWidth={1.5}
                      />
                      <span
                        className="text-xs text-muted-foreground"
                        style={{ fontFamily: "IBM Plex Mono, monospace" }}
                      >
                        Developer
                      </span>
                    </>
                  )}
                  {message.role === "system" && (
                    <span
                      className="text-xs text-muted-foreground"
                      style={{ fontFamily: "IBM Plex Mono, monospace" }}
                    >
                      SYSTEM
                    </span>
                  )}
                  <span
                    className="text-xs text-muted-foreground"
                    style={{ fontFamily: "IBM Plex Mono, monospace" }}
                  >
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                {/* Message content */}
                <motion.div
                  className={`group relative p-4 rounded-sm ${
                    message.role === "system"
                      ? "bg-secondary border border-border/30 text-center"
                      : message.role === "user"
                        ? "bg-linear-to-br from-primary to-destructive text-primary-foreground"
                        : "terminal-glass-strong border border-border/30"
                  }`}
                  whileHover={{ scale: message.role !== "system" ? 1.02 : 1 }}
                >
                  {/* Glow effect for assistant messages */}
                  {message.role === "assistant" && (
                    <motion.div
                      className="absolute -inset-1 bg-primary rounded-sm blur-lg -z-10"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 0.2 }}
                    />
                  )}

                  <p
                    className="text-sm leading-relaxed whitespace-pre-wrap"
                    style={{
                      fontFamily:
                        message.role === "system"
                          ? "IBM Plex Mono, monospace"
                          : "inherit",
                    }}
                  >
                    {message.isLoading ? (
                      <div className="flex items-center space-x-2">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-primary rounded-full"
                            animate={{
                              scale: [1, 1.5, 1],
                              opacity: [1, 0.5, 1],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              delay: i * 0.2,
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      message.content
                    )}
                  </p>

                  {/* Actions for assistant messages */}
                  {message.role === "assistant" && (
                    <motion.div
                      className="flex items-center space-x-2 mt-3 pt-3 border-t border-border/30"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.button
                        onClick={() =>
                          navigator.clipboard.writeText(message.content)
                        }
                        className="flex items-center space-x-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Copy className="w-3 h-3" />
                        <span
                          style={{ fontFamily: "IBM Plex Mono, monospace" }}
                        >
                          Copy
                        </span>
                      </motion.button>
                      <motion.button
                        onClick={() => {
                          const blob = new Blob([message.content], {
                            type: "text/plain",
                          });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `nexusai-message-${message.id}.txt`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="flex items-center space-x-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Download className="w-3 h-3" />
                        <span
                          style={{ fontFamily: "IBM Plex Mono, monospace" }}
                        >
                          Export
                        </span>
                      </motion.button>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          ))}

          {/* Error display */}
          {error && (
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="max-w-[80%] terminal-glass border border-red-500/30 p-4 rounded-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span
                    className="text-xs text-red-500"
                    style={{ fontFamily: "IBM Plex Mono, monospace" }}
                  >
                    CONNECTION_ERROR
                  </span>
                </div>
                <p className="text-sm text-red-400">
                  Failed to connect to AI service. Please check your connection
                  and try again.
                </p>
                <motion.button
                  onClick={() => window.location.reload()}
                  className="flex items-center space-x-2 mt-3 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-sm text-red-400 hover:bg-red-500/20 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RefreshCw className="w-4 h-4" />
                  <span style={{ fontFamily: "IBM Plex Mono, monospace" }}>
                    Retry Connection
                  </span>
                </motion.button>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <motion.div
        className="relative z-10 border-t border-border/30 bg-background/90 backdrop-blur-xl shrink-0"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", duration: 0.8 }}
      >
        <div className="max-w-250 mx-auto px-4 md:px-8 py-4">
          <div className="flex items-end space-x-4">
            <motion.div
              className="flex-1 terminal-glass-strong rounded-sm border border-border/30 focus-within:border-primary transition-colors overflow-hidden"
              whileFocus={{ scale: 1.01 }}
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="w-full px-4 py-3 bg-transparent text-foreground placeholder-muted-foreground focus:outline-none resize-none"
                style={{
                  fontFamily: "IBM Plex Mono, monospace",
                  fontSize: "14px",
                }}
                rows={3}
              />
            </motion.div>
            <motion.button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="relative p-4 bg-primary text-primary-foreground rounded-sm hover:bg-destructive transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
              whileHover={{ scale: !input.trim() || isLoading ? 1 : 1.05 }}
              whileTap={{ scale: !input.trim() || isLoading ? 1 : 0.95 }}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw
                    className="w-5 h-5 relative z-10"
                    strokeWidth={1.5}
                  />
                </motion.div>
              ) : (
                <Send className="w-5 h-5 relative z-10" strokeWidth={1.5} />
              )}
            </motion.button>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-4">
              <p
                className="text-xs text-muted-foreground"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
              >
                {/* "Any sufficiently advanced AI is indistinguishable from
                magic." — Clarke's Third Law (adapted) */}
              </p>
              {conversationId && (
                <motion.button
                  onClick={clearConversation}
                  className="flex items-center space-x-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RefreshCw className="w-3 h-3" />
                  <span style={{ fontFamily: "IBM Plex Mono, monospace" }}>
                    Clear Chat
                  </span>
                </motion.button>
              )}
            </div>
            <div
              className="text-xs text-muted-foreground"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              {input.length} / 4000
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CoPilot;
