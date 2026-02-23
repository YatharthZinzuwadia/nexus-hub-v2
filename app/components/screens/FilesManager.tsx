"use client";

import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Download,
  Grid,
  List,
  Search,
  Upload,
  File as FileIcon,
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
import { useState, useMemo, useRef, useEffect } from "react";
import { CarbonFiber } from "../effects/CarbonFiber";
import ParticleField from "../effects/ParticleField";
import { useAuthStore } from "@/lib/store/auth-store";
import {
  getFiles,
  uploadFile,
  createFolder,
  deleteFile,
  getDownloadUrl,
} from "@/lib/api/files";
import type { File as DBFile } from "@/lib/types/database";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface FilesManagerProps {
  onNavigate: (screen: string) => void;
}

type ModalType = "upload" | "new_folder" | "details" | "delete" | null;

// --- HELPERS ---
const formatSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

const FilesManager = ({ onNavigate }: FilesManagerProps) => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  // --- STATE ---
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- QUURIES ---
  const {
    data: files = [],
    isLoading: isFilesLoading,
    refetch: refetchFiles,
  } = useQuery({
    queryKey: ["files", user?.id, currentFolderId],
    queryFn: () =>
      user ? getFiles(user.id, currentFolderId) : Promise.resolve([]),
    enabled: !!user,
  });

  // Breadcrumbs calculation (needs all files ideally, or we fetch parents)
  // For now, we'll keep it simple: if we are deep, we might lose the chain unless we fetch parent info.
  // Advanced: Fetch folder info for currentFolderId to build breadcrumbs.
  const { data: currentFolder } = useQuery({
    queryKey: ["folder", currentFolderId],
    queryFn: async () => {
      if (!currentFolderId) return null;
      const { data } = await (await import("@/lib/supabase/client"))
        .createClient()
        .from("files")
        .select("*")
        .eq("id", currentFolderId)
        .single();
      return data as DBFile;
    },
    enabled: !!currentFolderId,
  });

  const breadcrumbs = useMemo(() => {
    const list: { id: string | null; name: string }[] = [
      { id: null, name: "Home" },
    ];
    if (currentFolder) {
      // Note: This only shows current folder. For full breadcrumbs,
      // recursive fetching or path string in DB is needed.
      list.push({ id: currentFolder.id, name: currentFolder.name });
    }
    return list;
  }, [currentFolder]);

  // --- MUTATIONS ---
  const createFolderMutation = useMutation({
    mutationFn: (name: string) =>
      user
        ? createFolder(user.id, name, currentFolderId)
        : Promise.reject("No user"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      toast.success("Folder created successfully");
      setActiveModal(null);
      setNewFolderName("");
    },
    onError: (error: any) =>
      toast.error(error.message || "Failed to create folder"),
  });

  const uploadFileMutation = useMutation({
    mutationFn: (file: File) =>
      user
        ? uploadFile(user.id, file, currentFolderId)
        : Promise.reject("No user"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      toast.success("File uploaded successfully");
      setActiveModal(null);
    },
    onError: (error: any) => toast.error(error.message || "Upload failed"),
  });

  const deleteFileMutation = useMutation({
    mutationFn: (file: DBFile) => deleteFile(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      toast.success("File deleted");
      setActiveModal(null);
      setSelectedFileId(null);
    },
    onError: (error: any) => toast.error(error.message || "Delete failed"),
  });

  // --- DERIVED STATE ---
  const visibleFiles = useMemo(() => {
    if (!searchQuery.trim()) return files;
    return files.filter((f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [files, searchQuery]);

  const selectedFile = useMemo(
    () => files.find((f) => f.id === selectedFileId),
    [selectedFileId, files],
  );

  // --- HANDLERS ---
  const handleFolderOpen = (id: string) => {
    setCurrentFolderId(id);
    setSelectedFileId(null);
    setSearchQuery("");
  };

  const handleGoBack = () => {
    if (currentFolderId) {
      // In a real app, you'd jump to currentFolder.parent_folder_id
      setCurrentFolderId(currentFolder?.parent_folder_id || null);
    } else {
      onNavigate("dashboard");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFileMutation.mutate(file);
  };

  const handleDownload = async (file: DBFile) => {
    try {
      const url = await getDownloadUrl(file);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Download started");
    } catch (err: any) {
      toast.error(err.message || "Download failed");
    }
  };

  const getFileIcon = (type: string, mime: string | null) => {
    if (type === "folder") return Folder;
    if (!mime) return FileIcon;
    if (mime.startsWith("image/")) return FileImage;
    if (mime.startsWith("video/")) return FileVideo;
    if (mime.startsWith("audio/")) return FileAudio;
    if (mime.includes("pdf") || mime.includes("doc")) return FileText;
    if (
      mime.includes("javascript") ||
      mime.includes("typescript") ||
      mime.includes("code")
    )
      return FileCode;
    return FileIcon;
  };

  // Mock stats (could be fetched via aggregate query)
  const storageUsed = 0.4;
  const storageTotal = 5.0;
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
                {
                  name: "Documents",
                  icon: FileText,
                  count: files.filter(
                    (f) =>
                      f.mime_type?.includes("pdf") ||
                      f.mime_type?.includes("doc"),
                  ).length,
                },
                {
                  name: "Images",
                  icon: FileImage,
                  count: files.filter((f) => f.mime_type?.startsWith("image/"))
                    .length,
                },
                {
                  name: "Videos",
                  icon: FileVideo,
                  count: files.filter((f) => f.mime_type?.startsWith("video/"))
                    .length,
                },
                {
                  name: "Source Code",
                  icon: FileCode,
                  count: files.filter(
                    (f) =>
                      f.extension === "ts" ||
                      f.extension === "tsx" ||
                      f.extension === "js",
                  ).length,
                },
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
              <span>Supabase Managed Storage</span>
            </div>
          </section>
        </aside>

        {/* Content Viewport */}
        <section className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-black/10">
          <AnimatePresence mode="wait">
            {isFilesLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex items-center justify-center"
              >
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </motion.div>
            ) : !visibleFiles.length ? (
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
                      icon={getFileIcon(file.type, file.mime_type)}
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
                          onDownload={() => handleDownload(file)}
                          icon={getFileIcon(file.type, file.mime_type)}
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
            onDownload={() => handleDownload(selectedFile)}
            icon={getFileIcon(selectedFile.type, selectedFile.mime_type)}
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
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    createFolderMutation.mutate(newFolderName)
                  }
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
                  onClick={() => createFolderMutation.mutate(newFolderName)}
                  disabled={
                    !newFolderName.trim() || createFolderMutation.isPending
                  }
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {createFolderMutation.isPending && (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  )}
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
              {uploadFileMutation.isPending ? (
                <>
                  <div className="relative">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    <div className="absolute inset-0 blur-xl bg-primary/20" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Syncing with Cloud...</p>
                    <p className="text-xs text-muted-foreground">
                      Writing metadata and storing binary objects.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-semibold">Ready to Sync</h3>
                    <p className="text-xs text-muted-foreground max-w-[240px]">
                      Your file will be uploaded to Supabase Storage and
                      registered in the database.
                    </p>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-3 bg-primary text-primary-foreground rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
                  >
                    Choose from Device
                  </button>
                  <p className="text-[10px] text-muted-foreground italic">
                    Max individual file: 100MB
                  </p>
                </>
              )}
            </div>
          </ModalWrapper>
        )}

        {activeModal === "delete" && selectedFile && (
          <ModalWrapper
            onClose={() => setActiveModal(null)}
            title="Permanent Deletion"
          >
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-red-500">
                    Irreversible Action
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    You are deleting{" "}
                    <span className="text-foreground font-semibold">
                      "{selectedFile.name}"
                    </span>
                    . This will remove the database record and the storage
                    binary.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteFileMutation.mutate(selectedFile)}
                  disabled={deleteFileMutation.isPending}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all flex items-center gap-2"
                >
                  {deleteFileMutation.isPending && (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  )}
                  Confirm Delete
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
          <Icon
            className={`w-12 h-12 ${file.type === "folder" ? "text-primary/70" : "text-muted-foreground/30 group-hover:text-foreground/70"}`}
            strokeWidth={1}
          />
        </div>

        <div className="text-center overflow-hidden w-full">
          <h3 className="text-xs font-semibold truncate px-2 mb-1">
            {file.name}
          </h3>
          <p className="text-[10px] text-muted-foreground opacity-60">
            {file.type === "folder" ? "Directory" : formatSize(file.size_bytes)}
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
  onDownload,
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
        {file.type === "folder" ? "--" : formatSize(file.size_bytes)}
      </td>
      <td className="px-6 py-4 text-muted-foreground text-xs">
        {formatDate(file.uploaded_at)}
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
          {file.type === "file" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDownload();
              }}
              className="p-2 hover:bg-white/10 rounded-md text-muted-foreground hover:text-foreground"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
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

const DetailsModal = ({ file, onClose, onDownload, icon: Icon }: any) => {
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
              Database Record
            </p>
          </div>

          <div className="w-full space-y-2">
            {[
              {
                label: "File Size",
                value:
                  file.type === "folder" ? "N/A" : formatSize(file.size_bytes),
              },
              { label: "Uploaded", value: formatDate(file.uploaded_at) },
              { label: "MIME Type", value: file.mime_type || "Directory" },
              { label: "Public", value: file.is_public ? "Yes" : "No" },
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
            {file.type === "file" && (
              <button
                onClick={onDownload}
                className="w-full py-3.5 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20"
              >
                <Download className="w-4 h-4" /> Download Original
              </button>
            )}
            <button className="w-full py-3.5 bg-white/5 hover:bg-white/10 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-3 border border-white/5">
              <Share2 className="w-4 h-4" /> Copy Access Link
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FilesManager;
