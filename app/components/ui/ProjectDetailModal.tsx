"use client";

import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Github,
  ExternalLink,
  Code2,
  Terminal,
  Cpu,
  FileText,
  Copy,
  Check,
  Play,
  Monitor,
  Share2,
  GitBranch,
  Star,
  Download,
  Edit3,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import type { Project } from "@/lib/types/database";

interface ProjectDetailModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
}

// Helper to copy text
const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-sm bg-secondary hover:bg-white/10 transition-colors"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="w-3 h-3 text-green-500" />
      ) : (
        <Copy className="w-3 h-3 text-muted-foreground" />
      )}
    </button>
  );
};

export const ProjectDetailModal = ({
  project,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: ProjectDetailModalProps) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "code" | "ai" | "ingest"
  >("overview");

  if (!isOpen) return null;

  // Generate tool URLs
  // Standard GitHub: https://github.com/user/repo
  // GitHub.dev: https://github.dev/user/repo
  // GitIngest: https://gitingest.com/user/repo
  // GitMCP: https://gitmcp.io/user/repo (Use as API/Agent context)

  const githubUrl = project.github_url || "";
  // Extract user/repo from github url if it exists
  const repoPath = githubUrl.replace("https://github.com/", "");
  const hasGithub = !!githubUrl && githubUrl.includes("github.com");

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            className="relative w-full max-w-5xl h-[85vh] bg-[#0A0A0A] border border-border/30 rounded-lg shadow-2xl overflow-hidden flex flex-col"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            layoutId={`project-${project.id}`}
          >
            {/* Header / Hero Section */}
            <div
              className={`relative h-64 shrink-0 bg-gradient-to-br ${project.gradient} overflow-hidden`}
            >
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 grid-pattern opacity-30 mix-blend-overlay" />

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-white/20 transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#0A0A0A] to-transparent z-10">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      {/* Status Banner */}
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-mono uppercase tracking-wider ${
                          project.status === "active"
                            ? "bg-green-500/20 text-green-400"
                            : project.status === "wip"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {project.status}
                      </span>
                      {hasGithub && (
                        <span className="flex items-center space-x-1 text-xs text-white/60 font-mono">
                          <Github className="w-3 h-3" />
                          <span>{repoPath}</span>
                        </span>
                      )}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
                      {project.title}
                    </h1>
                    <p className="text-lg text-white/70 max-w-2xl line-clamp-2">
                      {project.description}
                    </p>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center gap-3">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(project)}
                        className="p-3 bg-white/10 text-white rounded hover:bg-white/20 transition-colors"
                        title="Edit Project"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(project.id)}
                        className="p-3 bg-white/10 text-red-500 hover:bg-red-500/20 transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-6 py-3 bg-white text-black rounded font-medium hover:scale-105 transition-transform"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>Live Demo</span>
                      </a>
                    )}
                    <button className="p-3 bg-white/10 text-white rounded hover:bg-white/20 transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="flex border-b border-border/20 bg-black/20">
              {[
                { id: "overview", label: "Overview", icon: Monitor },
                { id: "code", label: "Code Studio", icon: Code2 },
                { id: "ai", label: "AI Context", icon: Cpu },
                { id: "ingest", label: "Structure", icon: FileText },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors relative ${
                    activeTab === tab.id
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Panels */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-background/50">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Details */}
                    <div className="md:col-span-2 space-y-6">
                      <div className="prose prose-invert max-w-none">
                        <h3 className="text-xl font-mono text-foreground mb-4">
                          About Project
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {project.description}
                        </p>
                        <p className="text-muted-foreground mt-4">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Sed do eiusmod tempor incididunt ut labore et
                          dolore magna aliqua. (This is where you would put the
                          README content if we fetched it!)
                        </p>
                      </div>

                      <div className="bg-secondary/20 p-6 rounded-lg border border-border/30">
                        <h4 className="text-sm font-mono text-foreground mb-4 flex items-center gap-2">
                          <Terminal className="w-4 h-4 text-primary" />
                          Tech Stack
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {project.tags?.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 bg-black/40 border border-border/40 rounded text-sm text-primary-foreground/80 font-mono"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Stats & Links */}
                    <div className="space-y-6">
                      <div className="bg-secondary/10 p-6 rounded-lg border border-border/30 backdrop-blur-sm">
                        <h3 className="text-sm font-mono text-muted-foreground mb-4">
                          Repository Stats
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-black/20 rounded">
                            <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
                              <Star className="w-4 h-4 fill-current" />
                              <span className="font-bold">{project.stars}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Stars
                            </div>
                          </div>
                          <div className="text-center p-3 bg-black/20 rounded">
                            <div className="flex items-center justify-center gap-1 text-blue-500 mb-1">
                              <GitBranch className="w-4 h-4" />
                              <span className="font-bold">
                                {project.forks || 12}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Forks
                            </div>
                          </div>
                        </div>
                      </div>

                      {hasGithub && (
                        <div className="space-y-3">
                          <a
                            href={githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between w-full p-4 bg-[#24292e] hover:bg-[#2f363d] text-white rounded transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <Github className="w-5 h-5" />
                              <span>Open in GitHub</span>
                            </div>
                            <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Code Studio Tab (github.dev) */}
              {activeTab === "code" && (
                <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {!hasGithub ? (
                    <div className="flex-1 flex items-center justify-center flex-col text-muted-foreground">
                      <Github className="w-12 h-12 mb-4 opacity-20" />
                      <p>No GitHub URL configured for this project.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-mono text-foreground">
                            In-Browser Editor
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Launch a VS Code instance directly in your browser.
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <a
                            href={`https://github.dev/${repoPath}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center gap-2 text-sm transition-colors"
                          >
                            <Code2 className="w-4 h-4" />
                            Open VS Code (github.dev)
                          </a>
                          <a
                            href={`https://githubbox.com/${repoPath}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded flex items-center gap-2 text-sm transition-colors"
                          >
                            <Terminal className="w-4 h-4" />
                            Open CodeSandbox
                          </a>
                        </div>
                      </div>

                      {/* Preview Frame (Mockup since iframe might be blocked) */}
                      <div className="flex-1 min-h-[400px] border border-border/30 rounded-lg bg-[#1e1e1e] flex flex-col overflow-hidden relative group">
                        {/* VS Code Mock UI Header */}
                        <div className="h-10 bg-[#252526] border-b border-[#3e3e3e] flex items-center px-4 gap-4">
                          <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                          </div>
                          <div className="flex-1 text-center text-xs text-white/50 font-mono">
                            {repoPath || "project"} - Visual Studio Code
                          </div>
                        </div>
                        <div className="flex-1 flex items-center justify-center bg-[#1e1e1e] relative">
                          <div className="text-center space-y-4 relative z-10">
                            <Code2 className="w-16 h-16 text-blue-500 mx-auto opacity-50" />
                            <p className="text-white/60">
                              Tap the button above to launch the editor
                            </p>
                          </div>
                          {/* Gradient Glow */}
                          <div className="absolute inset-0 bg-blue-500/5 blur-[100px]" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* AI Context Tab (gitmcp.io) */}
              {activeTab === "ai" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 p-8 rounded-lg border border-purple-500/20 relative overflow-hidden">
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <Cpu className="w-6 h-6 text-purple-400" />
                        AI Agent Integration
                      </h3>
                      <p className="text-white/70 max-w-2xl">
                        Connect this repository to your AI agents using GitMCP.
                        This provides real-time, hallucination-free context to
                        LLMs.
                      </p>
                    </div>
                    <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-purple-500/10 blur-[50px]" />
                  </div>

                  {!hasGithub ? (
                    <p className="text-muted-foreground">
                      Add a GitHub URL to enable AI features.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-black/30 p-6 rounded-lg border border-border/30">
                        <h4 className="text-sm font-mono text-purple-400 mb-4 uppercase tracking-wider">
                          MCP Server Config
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <label className="text-xs text-muted-foreground block mb-2">
                              Repository URL
                            </label>
                            <div className="flex items-center gap-2 bg-black/50 p-3 rounded border border-border/20">
                              <code className="text-sm font-mono flex-1 text-purple-200 truncate">
                                https://gitmcp.io/{repoPath}
                              </code>
                              <CopyButton
                                text={`https://gitmcp.io/${repoPath}`}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground block mb-2">
                              Docs Mode (Generalized)
                            </label>
                            <div className="flex items-center gap-2 bg-black/50 p-3 rounded border border-border/20">
                              <code className="text-sm font-mono flex-1 text-purple-200 truncate">
                                https://gitmcp.io/docs
                              </code>
                              <CopyButton text="https://gitmcp.io/docs" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-black/30 p-6 rounded-lg border border-border/30">
                        <h4 className="text-sm font-mono text-purple-400 mb-4 uppercase tracking-wider">
                          How to Use
                        </h4>
                        <ol className="space-y-3 text-sm text-muted-foreground list-decimal list-inside">
                          <li>Copy the Repository URL</li>
                          <li>Open your AI Tool (Cursor, Claude Desktop)</li>
                          <li>Add as new MCP Server</li>
                          <li>Ask your AI questions about the codebase!</li>
                        </ol>
                        <div className="mt-6 pt-6 border-t border-border/10">
                          <a
                            href={`https://gitmcp.io/${repoPath}`}
                            target="_blank"
                            className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                          >
                            View GitMCP Interface{" "}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Ingest Tab (gitingest.com) */}
              {activeTab === "ingest" && (
                <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-mono text-foreground">
                        Repository Digest
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Turn this codebase into a text-digest optimized for
                        LLMs.
                      </p>
                    </div>
                    {hasGithub && (
                      <div className="flex gap-2">
                        <a
                          href={`https://gitingest.com/${repoPath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded flex items-center gap-2 text-sm transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          Open GitIngest
                        </a>
                        <a
                          href={`https://gitingest.com/${repoPath}?download=true`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded flex items-center gap-2 text-sm transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 bg-black/30 border border-border/30 rounded-lg p-8 flex items-center justify-center text-center">
                    <div className="max-w-md space-y-6">
                      <div className="w-20 h-20 bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                        <FileText className="w-10 h-10 text-green-500" />
                      </div>
                      <h4 className="text-xl font-bold text-white">
                        Full Codebase Context
                      </h4>
                      <p className="text-muted-foreground">
                        GitIngest analyzes your directory structure and
                        concatenates files into a single context prompt perfect
                        for Claude or ChatGPT.
                      </p>
                      {!hasGithub ? (
                        <p className="text-red-400 text-sm">
                          Requires GitHub URL
                        </p>
                      ) : (
                        <div className="p-4 bg-black/50 rounded border border-white/10 font-mono text-xs text-left">
                          <div className="text-green-400 mb-2">
                            # Directory Structure
                          </div>
                          <div className="text-muted-foreground pl-2 border-l border-white/10">
                            src/
                            <br />
                            ├── components/
                            <br />
                            ├── lib/
                            <br />
                            └── app/
                            <br />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
