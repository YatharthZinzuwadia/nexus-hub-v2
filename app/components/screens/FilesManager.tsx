import { motion } from "motion/react";
import {
  ArrowLeft,
  Download,
  Grid,
  List,
  Search,
  Upload,
  File,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileCode,
  Folder,
  MoreVertical,
  Trash2,
  Edit,
  Share2,
  Eye,
  HardDrive,
} from "lucide-react";
import { useState } from "react";

interface FilesManagerProps {
  onNavigate: (screen: string) => void;
}

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  fileType?: "document" | "image" | "video" | "audio" | "code";
  size: string;
  modified: string;
  preview?: string;
}

const FilesManager = ({ onNavigate }: FilesManagerProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const files: FileItem[] = [
    {
      id: "1",
      name: "Project Documentation",
      type: "folder",
      size: "24 items",
      modified: "2 hours ago",
    },
    {
      id: "2",
      name: "design-system.pdf",
      type: "file",
      fileType: "document",
      size: "2.4 MB",
      modified: "1 day ago",
    },
    {
      id: "3",
      name: "hero-banner.png",
      type: "file",
      fileType: "image",
      size: "1.8 MB",
      modified: "3 days ago",
      preview: "/api/placeholder/400/300",
    },
    {
      id: "4",
      name: "demo-video.mp4",
      type: "file",
      fileType: "video",
      size: "45.2 MB",
      modified: "1 week ago",
    },
    {
      id: "5",
      name: "app.tsx",
      type: "file",
      fileType: "code",
      size: "12 KB",
      modified: "2 hours ago",
    },
    {
      id: "6",
      name: "background-music.mp3",
      type: "file",
      fileType: "audio",
      size: "5.6 MB",
      modified: "5 days ago",
    },
    {
      id: "7",
      name: "Assets",
      type: "folder",
      size: "156 items",
      modified: "1 week ago",
    },
    {
      id: "8",
      name: "README.md",
      type: "file",
      fileType: "document",
      size: "4 KB",
      modified: "3 hours ago",
    },
  ];

  const getFileIcon = (item: FileItem) => {
    if (item.type === "folder") return Folder;
    switch (item.fileType) {
      case "document":
        return FileText;
      case "image":
        return FileImage;
      case "video":
        return FileVideo;
      case "audio":
        return FileAudio;
      case "code":
        return FileCode;
      default:
        return File;
    }
  };

  const storageUsed = 156.8;
  const storageTotal = 500;
  const storagePercent = (storageUsed / storageTotal) * 100;

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
                  FILE_STORAGE
                </h1>
                <p
                  className="text-xs text-muted-foreground"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  STORAGE_VAULT_v0.2.0
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search files..."
                  className="w-full md:w-64 pl-10 pr-4 py-2 bg-secondary border border-border/30 rounded-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary text-sm"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                />
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 bg-secondary border border-border/30 rounded-sm p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-sm transition-colors ${
                      viewMode === "grid"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Grid className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-sm transition-colors ${
                      viewMode === "list"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <List className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                </div>

                <motion.button
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-sm hover:bg-destructive transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Upload className="w-4 h-4" />
                  <span
                    className="text-sm hidden md:inline"
                    style={{ fontFamily: "IBM Plex Mono, monospace" }}
                  >
                    UPLOAD
                  </span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-8 py-8">
        {/* Storage stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="terminal-glass p-4 rounded-sm border border-border/20">
            <div
              className="text-xs text-muted-foreground mb-1"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              TOTAL_FILES
            </div>
            <div
              className="text-2xl text-foreground"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              {files.length}
            </div>
          </div>
          <div className="terminal-glass p-4 rounded-sm border border-border/20">
            <div
              className="text-xs text-muted-foreground mb-1"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              STORAGE_USED
            </div>
            <div
              className="text-2xl text-foreground"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              {storageUsed} GB
            </div>
          </div>
          <div className="terminal-glass p-4 rounded-sm border border-border/20">
            <div
              className="text-xs text-muted-foreground mb-1"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              STORAGE_TOTAL
            </div>
            <div
              className="text-2xl text-foreground"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              {storageTotal} GB
            </div>
          </div>
          <div className="terminal-glass p-4 rounded-sm border border-border/20">
            <div
              className="text-xs text-muted-foreground mb-2"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              CAPACITY
            </div>
            <div className="w-full h-2 bg-secondary rounded-sm overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-destructive"
                initial={{ width: 0 }}
                animate={{ width: `${storagePercent}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <div
              className="text-xs text-muted-foreground mt-1"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              {storagePercent.toFixed(1)}%
            </div>
          </div>
        </motion.div>

        {/* Files section */}
        <div className="mb-4">
          <h2
            className="text-lg text-foreground mb-4"
            style={{ fontFamily: "IBM Plex Mono, monospace" }}
          >
            FILES_AND_FOLDERS
          </h2>
        </div>

        {viewMode === "grid" ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {files.map((file, index) => {
              const Icon = getFileIcon(file);
              return (
                <motion.div
                  key={file.id}
                  className="group terminal-glass p-6 rounded-sm border border-border/20 hover:border-primary/50 transition-all duration-300 cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  onClick={() => setSelectedFile(file.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Icon
                          className={`w-8 h-8 ${
                            file.type === "folder"
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`}
                          strokeWidth={1.5}
                        />
                      </div>
                      <h3
                        className="text-foreground mb-1 text-sm truncate"
                        style={{ fontFamily: "IBM Plex Mono, monospace" }}
                      >
                        {file.name}
                      </h3>
                      <p
                        className="text-xs text-muted-foreground"
                        style={{ fontFamily: "IBM Plex Mono, monospace" }}
                      >
                        {file.size}
                      </p>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-secondary rounded-sm">
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs text-muted-foreground"
                      style={{ fontFamily: "IBM Plex Mono, monospace" }}
                    >
                      {file.modified}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="flex-1 flex items-center justify-center space-x-1 py-1.5 bg-secondary border border-border/30 rounded-sm hover:border-primary/50 transition-colors">
                      <Eye className="w-3 h-3 text-muted-foreground" />
                      <span
                        className="text-xs text-muted-foreground"
                        style={{ fontFamily: "IBM Plex Mono, monospace" }}
                      >
                        VIEW
                      </span>
                    </button>
                    <button className="p-1.5 bg-secondary border border-border/30 rounded-sm hover:border-primary/50 transition-colors">
                      <Download className="w-3 h-3 text-muted-foreground" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            className="terminal-glass-strong rounded-sm border border-border/30 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="overflow-x-auto">
              <table
                className="w-full"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
              >
                <thead>
                  <tr className="border-b border-border/30 bg-secondary">
                    <th className="text-left px-6 py-3 text-xs text-muted-foreground">
                      NAME
                    </th>
                    <th className="text-left px-6 py-3 text-xs text-muted-foreground">
                      TYPE
                    </th>
                    <th className="text-left px-6 py-3 text-xs text-muted-foreground">
                      SIZE
                    </th>
                    <th className="text-left px-6 py-3 text-xs text-muted-foreground">
                      MODIFIED
                    </th>
                    <th className="text-right px-6 py-3 text-xs text-muted-foreground">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file, i) => {
                    const Icon = getFileIcon(file);
                    return (
                      <motion.tr
                        key={file.id}
                        className={`border-b border-border/20 hover:bg-secondary/50 transition-colors cursor-pointer ${
                          i % 2 === 0 ? "" : "bg-secondary/20"
                        }`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.05 }}
                        onClick={() => setSelectedFile(file.id)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <Icon
                              className={`w-5 h-5 ${
                                file.type === "folder"
                                  ? "text-primary"
                                  : "text-muted-foreground"
                              }`}
                              strokeWidth={1.5}
                            />
                            <span className="text-sm text-foreground">
                              {file.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground capitalize">
                          {file.type === "folder" ? "Folder" : file.fileType}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {file.size}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {file.modified}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end space-x-2">
                            <button className="p-2 bg-secondary border border-border/30 rounded-sm hover:border-primary/50 transition-colors">
                              <Eye className="w-4 h-4 text-muted-foreground" />
                            </button>
                            <button className="p-2 bg-secondary border border-border/30 rounded-sm hover:border-primary/50 transition-colors">
                              <Download className="w-4 h-4 text-muted-foreground" />
                            </button>
                            <button className="p-2 bg-secondary border border-border/30 rounded-sm hover:border-primary/50 transition-colors">
                              <Share2 className="w-4 h-4 text-muted-foreground" />
                            </button>
                            <button className="p-2 bg-secondary border border-border/30 rounded-sm hover:border-red-500/50 transition-colors">
                              <Trash2 className="w-4 h-4 text-muted-foreground hover:text-red-400" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FilesManager;
