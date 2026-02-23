"use client";

import { motion, AnimatePresence } from "motion/react";
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
  ChevronRight,
  FolderPlus,
  ArrowUpRight,
  X,
  Info,
  Clock,
  Plus,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useState, useMemo, useRef } from "react";
import { CarbonFiber } from "../effects/CarbonFiber";
import ParticleField from "../effects/ParticleField";

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
  parentId: string | null;
  preview?: string;
}

type ModalType = "upload" | "new_folder" | "details" | "delete" | null;

const FilesManager = ({ onNavigate }: FilesManagerProps) => {
  // --- STATE ---
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- MOCK DATA ---
  const [allFiles, setAllFiles] = useState<FileItem[]>([
    {
      id: "1",
      name: "Project Documentation",
      type: "folder",
      size: "24 items",
      modified: "2 hours ago",
      parentId: null,
    },
    {
      id: "2",
      name: "design-system.pdf",
      type: "file",
      fileType: "document",
      size: "2.4 MB",
      modified: "1 day ago",
      parentId: null,
    },
    {
      id: "3",
      name: "hero-banner.png",
      type: "file",
      fileType: "image",
      size: "1.8 MB",
      modified: "3 days ago",
      parentId: "7",
      preview:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80",
    },
    {
      id: "4",
      name: "demo-video.mp4",
      type: "file",
      fileType: "video",
      size: "45.2 MB",
      modified: "1 week ago",
      parentId: null,
    },
    {
      id: "5",
      name: "app.tsx",
      type: "file",
      fileType: "code",
      size: "12 KB",
      modified: "2 hours ago",
      parentId: "1",
    },
    {
      id: "6",
      name: "background-music.mp3",
      type: "file",
      fileType: "audio",
      size: "5.6 MB",
      modified: "5 days ago",
      parentId: "7",
    },
    {
      id: "7",
      name: "Assets",
      type: "folder",
      size: "156 items",
      modified: "1 week ago",
      parentId: null,
    },
    {
      id: "8",
      name: "README.md",
      type: "file",
      fileType: "document",
      size: "4 KB",
      modified: "3 hours ago",
      parentId: null,
    },
  ]);

  // --- DERIVED STATE ---

  const visibleFiles = useMemo(() => {
    let filtered = allFiles.filter((f) => f.parentId === currentFolderId);
    if (searchQuery.trim()) {
      filtered = allFiles.filter((f) =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    return filtered;
  }, [allFiles, currentFolderId, searchQuery]);

  const breadcrumbs = useMemo(() => {
    const list: { id: string | null; name: string }[] = [
      { id: null, name: "Home" },
    ];
    if (!currentFolderId) return list;

    const buildPath = (id: string) => {
      const folder = allFiles.find((f) => f.id === id);
      if (folder) {
        if (folder.parentId) buildPath(folder.parentId);
        list.push({ id: folder.id, name: folder.name });
      }
    };

    buildPath(currentFolderId);
    return list;
  }, [currentFolderId, allFiles]);

  const selectedFile = useMemo(
    () => allFiles.find((f) => f.id === selectedFileId),
    [selectedFileId, allFiles],
  );

  // --- HANDLERS ---
  const handleFolderOpen = (id: string) => {
    setCurrentFolderId(id);
    setSelectedFileId(null);
    setSearchQuery("");
  };

  const handleGoBack = () => {
    if (currentFolderId) {
      const current = allFiles.find((f) => f.id === currentFolderId);
      setCurrentFolderId(current?.parentId || null);
    } else {
      onNavigate("dashboard");
    }
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;

    const newFolder: FileItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: newFolderName,
      type: "folder",
      size: "0 items",
      modified: "Just now",
      parentId: currentFolderId,
    };

    setAllFiles([...allFiles, newFolder]);
    setNewFolderName("");
    setActiveModal(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    // Mimic upload process
    setTimeout(() => {
      const newFile: FileItem = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: "file",
        fileType: "document", // Generic for now
        size: (file.size / 1024 / 1024).toFixed(1) + " MB",
        modified: "Just now",
        parentId: currentFolderId,
      };
      setAllFiles([...allFiles, newFile]);
      setIsUploading(false);
      setActiveModal(null);
    }, 2000);
  };

  const handleDeleteFile = () => {
    if (!selectedFileId) return;
    setAllFiles(allFiles.filter((f) => f.id !== selectedFileId));
    setSelectedFileId(null);
    setActiveModal(null);
  };

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
  const storageTotal = 512;
  const storagePercent = (storageUsed / storageTotal) * 100;

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden flex flex-col">
      <ParticleField density={25} />
      <CarbonFiber className="w-48" opacity={0.1} />
      <div className="absolute inset-0 grid-pattern opacity-5 pointer-events-none" />

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Header */}
      <header className="relative z-30 border-b border-border/30 bg-background/40 backdrop-blur-xl shrink-0">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Title & Path */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleGoBack}
                className="p-2 hover:bg-white/5 rounded-md transition-colors border border-border/20"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="flex flex-col">
                <h1 className="text-lg font-semibold flex items-center gap-2">
                  Files
                </h1>
                <nav className="flex items-center space-x-1 mt-0.5 text-xs text-muted-foreground overflow-hidden">
                  {breadcrumbs.map((crumb, idx) => (
                    <div
                      key={crumb.id || "root"}
                      className="flex items-center shrink-0"
                    >
                      {idx > 0 && (
                        <ChevronRight className="w-3 h-3 mx-1 opacity-50" />
                      )}
                      <button
                        onClick={() => setCurrentFolderId(crumb.id)}
                        className={`hover:text-foreground transition-colors ${
                          crumb.id === currentFolderId
                            ? "text-primary font-medium"
                            : ""
                        }`}
                      >
                        {crumb.name}
                      </button>
                    </div>
                  ))}
                </nav>
              </div>
            </div>

            {/* Global Actions */}
            <div className="flex items-center space-x-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-secondary/30 border border-border/20 rounded-md focus:outline-none focus:border-primary/50 text-sm transition-all"
                />
              </div>

              <div className="flex items-center space-x-1 bg-secondary/30 border border-border/20 rounded-md p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-md transition-all ${
                    viewMode === "grid"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-md transition-all ${
                    viewMode === "list"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveModal("new_folder")}
                  className="p-2 bg-secondary/30 border border-border/20 rounded-md hover:bg-secondary/50 transition-colors"
                  title="New Folder"
                >
                  <FolderPlus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveModal("upload")}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="relative z-10 flex-1 overflow-hidden flex">
        {/* Sidebar */}
        <aside className="w-72 border-r border-border/10 bg-background/20 backdrop-blur-sm p-6 overflow-y-auto shrink-0 hidden lg:flex flex-col space-y-8">
          <section>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Storage
            </h3>
            <div className="p-4 rounded-lg bg-white/5 border border-border/10 space-y-3">
              <div className="flex justify-between text-xs">
                <span>Used Capacity</span>
                <span className="font-medium">
                  {storageUsed} GB / {storageTotal} GB
                </span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${storagePercent}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground">
                {storagePercent.toFixed(1)}% of your storage is occupied
              </p>
            </div>
          </section>

          <section className="flex-1">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Categories
            </h3>
            <div className="space-y-1 text-sm">
              {[
                { name: "Documents", icon: FileText, count: 42 },
                { name: "Images", icon: FileImage, count: 128 },
                { name: "Videos", icon: FileVideo, count: 12 },
                { name: "Archive", icon: HardDrive, count: 5 },
              ].map((cat) => (
                <button
                  key={cat.name}
                  className="w-full flex items-center justify-between p-2 rounded-md hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <cat.icon className="w-4 h-4 group-hover:text-primary transition-colors" />
                    <span>{cat.name}</span>
                  </div>
                  <span className="text-xs opacity-50 px-2">{cat.count}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="pt-6 border-t border-border/10">
            <div className="flex items-center space-x-2 text-muted-foreground/30 text-[10px] font-medium">
              <Info className="w-3 h-3" />
              <span>Version 2.4.1</span>
            </div>
          </section>
        </aside>

        {/* Content Viewport */}
        <section className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-black/10">
          <AnimatePresence mode="wait">
            {!visibleFiles.length ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center opacity-40"
              >
                <Folder className="w-16 h-16 mb-4" strokeWidth={1} />
                <p className="text-sm">This folder is empty</p>
              </motion.div>
            ) : (
              <motion.div
                key={currentFolderId || "root"}
                layout
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4"
                    : "bg-white/5 border border-border/20 rounded-lg overflow-hidden"
                }
              >
                {viewMode === "grid" ? (
                  visibleFiles.map((file) => (
                    <FileCard
                      key={file.id}
                      file={file}
                      isSelected={selectedFileId === file.id}
                      onSelect={() => setSelectedFileId(file.id)}
                      onOpen={() =>
                        file.type === "folder"
                          ? handleFolderOpen(file.id)
                          : (setSelectedFileId(file.id),
                            setActiveModal("details"))
                      }
                      onDelete={() => {
                        setSelectedFileId(file.id);
                        setActiveModal("delete");
                      }}
                      icon={getFileIcon(file)}
                    />
                  ))
                ) : (
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-border/10 text-muted-foreground text-xs uppercase bg-white/5">
                        <th className="px-6 py-4 font-medium tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-4 font-medium tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-4 font-medium tracking-wider">
                          Size
                        </th>
                        <th className="px-6 py-4 font-medium tracking-wider">
                          Date Modified
                        </th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/5">
                      {visibleFiles.map((file) => (
                        <FileRow
                          key={file.id}
                          file={file}
                          isSelected={selectedFileId === file.id}
                          onSelect={() => setSelectedFileId(file.id)}
                          onOpen={() =>
                            file.type === "folder"
                              ? handleFolderOpen(file.id)
                              : (setSelectedFileId(file.id),
                                setActiveModal("details"))
                          }
                          onDelete={() => {
                            setSelectedFileId(file.id);
                            setActiveModal("delete");
                          }}
                          icon={getFileIcon(file)}
                        />
                      ))}
                    </tbody>
                  </table>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {activeModal === "details" && selectedFile && (
          <DetailsModal
            file={selectedFile}
            onClose={() => setActiveModal(null)}
            icon={getFileIcon(selectedFile)}
          />
        )}

        {activeModal === "new_folder" && (
          <ModalWrapper
            onClose={() => setActiveModal(null)}
            title="Create New Folder"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">
                  Folder Name
                </label>
                <input
                  autoFocus
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
                  placeholder="Untitled Folder"
                  className="w-full bg-white/5 border border-border/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateFolder}
                  disabled={!newFolderName.trim()}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  Create Folder
                </button>
              </div>
            </div>
          </ModalWrapper>
        )}

        {activeModal === "upload" && (
          <ModalWrapper
            onClose={() => setActiveModal(null)}
            title="Upload File"
          >
            <div className="flex flex-col items-center justify-center p-8 space-y-6 text-center">
              {isUploading ? (
                <>
                  <div className="relative">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    <div className="absolute inset-0 blur-xl bg-primary/20" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Uploading to cloud...</p>
                    <p className="text-xs text-muted-foreground">
                      This may take a few seconds depending on file size.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-semibold">
                      Select a file to upload
                    </h3>
                    <p className="text-xs text-muted-foreground max-w-[240px]">
                      Your file will be safely stored in the cloud. We support
                      documents, images, and media.
                    </p>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-3 bg-primary text-primary-foreground rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
                  >
                    Select File
                  </button>
                  <p className="text-[10px] text-muted-foreground italic">
                    MAX size per file: 50MB
                  </p>
                </>
              )}
            </div>
          </ModalWrapper>
        )}

        {activeModal === "delete" && selectedFile && (
          <ModalWrapper
            onClose={() => setActiveModal(null)}
            title="Confirm Deletion"
          >
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-red-500">
                    Are you sure?
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    You are about to delete{" "}
                    <span className="text-foreground font-semibold">
                      "{selectedFile.name}"
                    </span>
                    . This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all"
                >
                  Keep File
                </button>
                <button
                  onClick={handleDeleteFile}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </ModalWrapper>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const ModalWrapper = ({
  children,
  onClose,
  title,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
}) => (
  <motion.div
    className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <motion.div
      className="bg-zinc-900 border border-border/20 w-full max-w-md rounded-2xl p-8 relative shadow-2xl overflow-hidden"
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-lg font-bold">{title}</h2>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-white/5 rounded-full text-muted-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      {children}
    </motion.div>
  </motion.div>
);

const FileCard = ({
  file,
  isSelected,
  onSelect,
  onOpen,
  onDelete,
  icon: Icon,
}: any) => {
  return (
    <motion.div
      layout
      className={`group relative p-4 rounded-lg border transition-all cursor-pointer select-none h-48 flex flex-col ${
        isSelected
          ? "border-primary bg-primary/5 shadow-2xl"
          : "border-border/10 hover:border-primary/30 hover:bg-white/5"
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onDoubleClick={onOpen}
    >
      <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-4">
        <div
          className={`relative transition-transform duration-500 group-hover:scale-110 ${isSelected ? "scale-110" : ""}`}
        >
          {file.preview ? (
            <div className="w-20 h-20 rounded-md overflow-hidden border border-border/10">
              <img
                src={file.preview}
                alt={file.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <Icon
              className={`w-12 h-12 ${file.type === "folder" ? "text-primary/70" : "text-muted-foreground/30 group-hover:text-foreground/70"}`}
              strokeWidth={1}
            />
          )}
        </div>

        <div className="text-center overflow-hidden w-full">
          <h3 className="text-xs font-semibold truncate px-2 mb-1">
            {file.name}
          </h3>
          <p className="text-[10px] text-muted-foreground opacity-60">
            {file.type === "folder" ? file.size : `${file.size}`}
          </p>
        </div>
      </div>

      <div
        className={`absolute top-2 right-2 flex items-center space-x-1 opacity-0 transition-all translate-y-1 group-hover:translate-y-0 group-hover:opacity-100`}
      >
        <button
          className="p-2 hover:bg-white/10 rounded-md text-muted-foreground hover:text-foreground transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
          title="Open"
        >
          {file.type === "folder" ? (
            <ArrowUpRight className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
        <button
          className="p-2 hover:bg-red-500/10 rounded-md text-muted-foreground hover:text-red-400 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

const FileRow = ({
  file,
  isSelected,
  onSelect,
  onOpen,
  onDelete,
  icon: Icon,
}: any) => {
  return (
    <motion.tr
      layout
      className={`group transition-colors cursor-pointer ${
        isSelected ? "bg-primary/5" : "hover:bg-white/5"
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onDoubleClick={onOpen}
    >
      <td className="px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="p-2 rounded-md bg-secondary/30 border border-border/10 group-hover:border-primary/20 transition-colors">
            <Icon
              className={`w-5 h-5 ${file.type === "folder" ? "text-primary" : "text-muted-foreground/50"}`}
            />
          </div>
          <span className={`font-semibold ${isSelected ? "text-primary" : ""}`}>
            {file.name}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-muted-foreground text-xs uppercase tracking-wider">
        {file.type}
      </td>
      <td className="px-6 py-4 text-muted-foreground text-xs font-mono">
        {file.size}
      </td>
      <td className="px-6 py-4 text-muted-foreground text-xs">
        {file.modified}
      </td>
      <td className="px-6 py-4 text-right">
        <div
          className={`flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-all`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
            className="p-2 hover:bg-white/10 rounded-md text-muted-foreground hover:text-foreground"
            title="View"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            className="p-2 hover:bg-white/10 rounded-md text-muted-foreground hover:text-foreground"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2 hover:bg-white/10 rounded-md text-muted-foreground hover:text-red-400"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </motion.tr>
  );
};

const DetailsModal = ({ file, onClose, icon: Icon }: any) => {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-zinc-900 border border-border/20 w-full max-w-sm rounded-2xl p-10 relative shadow-2xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-full text-muted-foreground"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center space-y-8">
          <div className="w-24 h-24 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center relative">
            <Icon className="w-12 h-12 text-primary" strokeWidth={1} />
            <div className="absolute inset-0 blur-2xl bg-primary/20 -z-10" />
          </div>

          <div>
            <h2 className="text-xl font-bold mb-1 truncate max-w-[280px]">
              {file.name}
            </h2>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">
              Metadata Profile
            </p>
          </div>

          <div className="w-full space-y-2">
            {[
              { label: "File Size", value: file.size },
              { label: "Created", value: file.modified },
              {
                label: "Category",
                value: file.fileType?.toUpperCase() || "FOLDER",
              },
              { label: "Status", value: "Live" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5"
              >
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                  {stat.label}
                </span>
                <span className="text-xs font-bold">{stat.value}</span>
              </div>
            ))}
          </div>

          <div className="w-full flex flex-col gap-2">
            <button className="w-full py-3.5 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20">
              <Download className="w-4 h-4" /> Download File
            </button>
            <button className="w-full py-3.5 bg-white/5 hover:bg-white/10 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-3 border border-white/5">
              <Share2 className="w-4 h-4" /> Generate Link
            </button>
          </div>

          <button className="text-xs text-red-500/50 hover:text-red-500 transition-colors flex items-center gap-2 pt-2 underline underline-offset-4 decoration-red-500/20">
            <Trash2 className="w-3.5 h-3.5" /> Permanently delete file
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FilesManager;
