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
  Move,
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
  updateFile,
} from "@/lib/api/files";
import type { File as DBFile } from "@/lib/types/database";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface FilesManagerProps {
  onNavigate: (screen: string) => void;
}

type ModalType = "upload" | "new_folder" | "details" | "delete" | "move" | null;

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

  // --- QUERIES ---
  const { data: files = [], isLoading: isFilesLoading } = useQuery({
    queryKey: ["files", user?.id, currentFolderId],
    queryFn: () =>
      user ? getFiles(user.id, currentFolderId) : Promise.resolve([]),
    enabled: !!user,
  });

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

  // Fetch all potential destination folders for moving
  const { data: allFolders = [] } = useQuery({
    queryKey: ["all-folders", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await (await import("@/lib/supabase/client"))
        .createClient()
        .from("files")
        .select("*")
        .eq("user_id", user.id)
        .eq("type", "folder");
      return (data || []) as DBFile[];
    },
    enabled: activeModal === "move",
  });

  const breadcrumbs = useMemo(() => {
    const list: { id: string | null; name: string }[] = [
      { id: null, name: "Home" },
    ];
    if (currentFolder) {
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
      toast.success("Folder created");
      setActiveModal(null);
      setNewFolderName("");
    },
    onError: (error: any) => toast.error(error.message),
  });

  const uploadFileMutation = useMutation({
    mutationFn: (file: File) =>
      user
        ? uploadFile(user.id, file, currentFolderId)
        : Promise.reject("No user"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      toast.success("File uploaded");
      setActiveModal(null);
    },
    onError: (error: any) => toast.error(error.message),
  });

  const deleteFileMutation = useMutation({
    mutationFn: (file: DBFile) => deleteFile(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      toast.success("Deleted successfully");
      setActiveModal(null);
      setSelectedFileId(null);
    },
    onError: (error: any) => toast.error(error.message),
  });

  const moveFileMutation = useMutation({
    mutationFn: ({
      fileId,
      targetFolderId,
    }: {
      fileId: string;
      targetFolderId: string | null;
    }) => updateFile(fileId, { parent_folder_id: targetFolderId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      toast.success("Item moved");
      setActiveModal(null);
    },
    onError: (error: any) => toast.error(error.message),
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
      setCurrentFolderId(currentFolder?.parent_folder_id || null);
    } else {
      onNavigate("dashboard");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFileMutation.mutate(file);
  };

  const handleShare = async (file: DBFile) => {
    try {
      const url = await getDownloadUrl(file);
      await navigator.clipboard.writeText(url);
      toast.success("Sharing link copied to clipboard!");
    } catch (err: any) {
      toast.error("Failed to generate sharing link");
    }
  };

  const handleDownload = async (file: DBFile) => {
    try {
      const url = await getDownloadUrl(file);
      window.open(url, "_blank");
      toast.success("Download started");
    } catch (err: any) {
      toast.error(err.message);
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

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden flex flex-col">
      <ParticleField density={25} />
      <CarbonFiber className="w-48" opacity={0.1} />
      <div className="absolute inset-0 grid-pattern opacity-5 pointer-events-none" />

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
            <div className="flex items-center space-x-4">
              <button
                onClick={handleGoBack}
                className="p-2 hover:bg-white/5 rounded-md transition-colors border border-border/20"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="flex flex-col">
                <h1 className="text-lg font-semibold">Files</h1>
                <nav className="flex items-center space-x-1 mt-0.5 text-xs text-muted-foreground whitespace-nowrap overflow-hidden">
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
                        className={`hover:text-foreground transition-colors ${crumb.id === currentFolderId ? "text-primary font-medium" : ""}`}
                      >
                        {crumb.name}
                      </button>
                    </div>
                  ))}
                </nav>
              </div>
            </div>

            <div className="flex items-center space-x-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-secondary/30 border border-border/20 rounded-md focus:border-primary/50 text-sm transition-all outline-none"
                />
              </div>

              <div className="flex items-center space-x-1 bg-secondary/30 border border-border/20 rounded-md p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-md ${viewMode === "grid" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-md ${viewMode === "list" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
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
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm font-medium transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 overflow-hidden flex">
        {/* Sidebar */}
        <aside className="w-72 border-r border-border/10 bg-background/20 backdrop-blur-sm p-6 overflow-y-auto shrink-0 hidden lg:flex flex-col space-y-8">
          <section>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Storage Usage
            </h3>
            <div className="p-4 rounded-lg bg-white/5 border border-border/10 space-y-3">
              <div className="flex justify-between text-xs font-mono">
                <span>Used Capacity</span>
                <span>0.4 GB / 5.0 GB</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `8%` }}
                />
              </div>
            </div>
          </section>

          <section className="flex-1">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Quick Filters
            </h3>
            <div className="space-y-1 text-sm">
              {[
                {
                  name: "Documents",
                  icon: FileText,
                  count: files.filter((f) => f.mime_type?.includes("pdf"))
                    .length,
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
              ].map((cat) => (
                <button
                  key={cat.name}
                  className="w-full flex items-center justify-between p-2 rounded-md hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <cat.icon className="w-4 h-4 group-hover:text-primary transition-colors" />
                    <span>{cat.name}</span>
                  </div>
                  <span className="text-xs opacity-50">{cat.count}</span>
                </button>
              ))}
            </div>
          </section>
        </aside>

        {/* Content Viewport */}
        <section className="flex-1 overflow-y-auto p-8 bg-black/5 no-scrollbar">
          <AnimatePresence mode="wait">
            {isFilesLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : !visibleFiles.length ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center opacity-30"
              >
                <Folder className="w-16 h-16 mb-4" strokeWidth={1} />
                <p className="text-sm">Empty Directory</p>
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
                      onMove={() => {
                        setSelectedFileId(file.id);
                        setActiveModal("move");
                      }}
                      onView={() => handleDownload(file)}
                      onShare={() => handleShare(file)}
                      icon={getFileIcon(file.type, file.mime_type)}
                    />
                  ))
                ) : (
                  <table className="w-full text-left text-sm border-collapse">
                    <thead className="border-b border-border/10 text-muted-foreground text-xs uppercase bg-white/5">
                      <tr>
                        <th className="px-6 py-4 font-medium">Name</th>
                        <th className="px-6 py-4 font-medium">Size</th>
                        <th className="px-6 py-4 font-medium">Modified</th>
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
                          onMove={() => {
                            setSelectedFileId(file.id);
                            setActiveModal("move");
                          }}
                          onView={() => handleDownload(file)}
                          onShare={() => handleShare(file)}
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
            onShare={() => handleShare(selectedFile)}
            icon={getFileIcon(selectedFile.type, selectedFile.mime_type)}
          />
        )}

        {activeModal === "move" && selectedFile && (
          <ModalWrapper onClose={() => setActiveModal(null)} title="Move Item">
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground mb-4">
                Select target destination for{" "}
                <span className="text-white font-bold">
                  "{selectedFile.name}"
                </span>
                :
              </p>
              <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                <button
                  onClick={() =>
                    moveFileMutation.mutate({
                      fileId: selectedFile.id,
                      targetFolderId: null,
                    })
                  }
                  className="w-full flex items-center space-x-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:border-primary/40 transition-all text-sm"
                >
                  <Folder className="w-4 h-4 text-primary" />
                  <span>Main Directory (Root)</span>
                </button>
                {allFolders
                  .filter((f) => f.id !== selectedFile.id)
                  .map((folder) => (
                    <button
                      key={folder.id}
                      onClick={() =>
                        moveFileMutation.mutate({
                          fileId: selectedFile.id,
                          targetFolderId: folder.id,
                        })
                      }
                      className="w-full flex items-center space-x-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:border-primary/40 transition-all text-sm"
                    >
                      <Folder className="w-4 h-4 text-primary" />
                      <span>{folder.name}</span>
                    </button>
                  ))}
              </div>
              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-sm text-muted-foreground hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </ModalWrapper>
        )}

        {activeModal === "new_folder" && (
          <ModalWrapper onClose={() => setActiveModal(null)} title="New Folder">
            <div className="space-y-4">
              <input
                autoFocus
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  createFolderMutation.mutate(newFolderName)
                }
                placeholder="Folder name"
                className="w-full bg-white/5 border border-border/20 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary/50"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-sm text-muted-foreground"
                >
                  Cancel
                </button>
                <button
                  onClick={() => createFolderMutation.mutate(newFolderName)}
                  disabled={!newFolderName.trim()}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  Create
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
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
              ) : (
                <>
                  <Upload className="w-10 h-10 text-primary opacity-50" />
                  <p className="text-sm text-muted-foreground">
                    Select a file to sync to your workspace.
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-3 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:bg-primary/90"
                  >
                    Choose File
                  </button>
                </>
              )}
            </div>
          </ModalWrapper>
        )}

        {activeModal === "delete" && selectedFile && (
          <ModalWrapper onClose={() => setActiveModal(null)} title="Delete?">
            <div className="space-y-6 text-center">
              <p className="text-sm text-muted-foreground">
                Confirm removal of{" "}
                <span className="font-bold text-white">
                  "{selectedFile.name}"
                </span>
                ?
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-6 py-2 border border-border/20 rounded-lg text-sm"
                >
                  No
                </button>
                <button
                  onClick={() => deleteFileMutation.mutate(selectedFile)}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-bold"
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

const ModalWrapper = ({ children, onClose, title }: any) => (
  <motion.div
    className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <motion.div
      className="bg-zinc-900 border border-border/20 w-full max-w-sm rounded-2xl p-8 relative shadow-2xl"
      initial={{ scale: 0.9, y: 10 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 10 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">{title}</h2>
        <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-full">
          <X className="w-4 h-4" />
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
  onMove,
  onView,
  onShare,
  icon: Icon,
}: any) => {
  return (
    <motion.div
      layout
      className={`group relative p-4 rounded-xl border transition-all cursor-pointer h-48 flex flex-col ${isSelected ? "border-primary bg-primary/5 shadow-xl" : "border-border/10 hover:border-primary/30 hover:bg-white/5"}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onDoubleClick={onOpen}
    >
      <div className="flex-1 flex flex-col items-center justify-center space-y-4">
        <Icon
          className={`w-12 h-12 ${file.type === "folder" ? "text-primary/70" : "text-muted-foreground/30 group-hover:text-foreground/70"}`}
          strokeWidth={1}
        />
        <div className="text-center w-full px-2">
          <h3
            className="text-xs font-semibold truncate leading-tight"
            title={file.name}
          >
            {file.name}
          </h3>
          <p className="text-[10px] text-muted-foreground mt-1">
            {file.type === "folder" ? "Folder" : formatSize(file.size_bytes)}
          </p>
        </div>
      </div>

      <div className="absolute top-2 right-2 flex space-x-0.5 opacity-0 group-hover:opacity-100 transition-all scale-90 origin-top-right">
        {file.type === "file" && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView();
              }}
              className="p-2 hover:bg-white/10 rounded-md"
              title="View"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShare();
              }}
              className="p-2 hover:bg-white/10 rounded-md"
              title="Share"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMove();
          }}
          className="p-2 hover:bg-white/10 rounded-md"
          title="Move"
        >
          <Move className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-2 hover:bg-red-500/10 rounded-md text-red-400"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
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
  onMove,
  onView,
  onShare,
  icon: Icon,
}: any) => {
  return (
    <motion.tr
      layout
      className={`group transition-colors cursor-pointer ${isSelected ? "bg-primary/5" : "hover:bg-white/5"}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onDoubleClick={onOpen}
    >
      <td className="px-6 py-4 max-w-[200px]">
        <div className="flex items-center space-x-3">
          <Icon
            className={`w-4 h-4 shrink-0 ${file.type === "folder" ? "text-primary" : "text-muted-foreground/50"}`}
          />
          <span className="font-semibold truncate" title={file.name}>
            {file.name}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-muted-foreground text-xs font-mono">
        {file.type === "folder" ? "--" : formatSize(file.size_bytes)}
      </td>
      <td className="px-6 py-4 text-muted-foreground text-xs">
        {formatDate(file.uploaded_at)}
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-all">
          {file.type === "file" && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onView();
                }}
                className="p-2 hover:bg-white/10 rounded-md"
                title="View"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShare();
                }}
                className="p-2 hover:bg-white/10 rounded-md"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMove();
            }}
            className="p-2 hover:bg-white/10 rounded-md"
            title="Move"
          >
            <Move className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2 hover:bg-white/10 rounded-md text-red-400"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </motion.tr>
  );
};

const DetailsModal = ({
  file,
  onClose,
  onDownload,
  onShare,
  icon: Icon,
}: any) => {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-zinc-900 border border-border/20 w-full max-w-sm rounded-2xl p-10 h-auto flex flex-col items-center text-center space-y-8"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center relative">
          <Icon className="w-10 h-10 text-primary" />
          <div className="absolute inset-0 blur-xl bg-primary/10 -z-10" />
        </div>
        <div className="w-full">
          <h2 className="text-xl font-bold truncate px-4" title={file.name}>
            {file.name}
          </h2>
          <p className="text-[10px] text-muted-foreground uppercase mt-1 tracking-widest">
            Metadata Profile
          </p>
        </div>
        <div className="w-full space-y-2">
          {[
            {
              label: "Size",
              value:
                file.type === "folder" ? "N/A" : formatSize(file.size_bytes),
            },
            { label: "Date", value: formatDate(file.uploaded_at) },
          ].map((s) => (
            <div
              key={s.label}
              className="flex justify-between p-3 rounded-xl bg-white/5 text-xs"
            >
              <span className="text-muted-foreground uppercase">{s.label}</span>
              <span className="font-bold">{s.value}</span>
            </div>
          ))}
        </div>
        <div className="w-full flex flex-col gap-2">
          <button
            onClick={onDownload}
            className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20"
          >
            Download File
          </button>
          <button
            onClick={() => {
              onClose();
              onShare();
            }}
            className="w-full py-3 bg-white/5 hover:bg-white/10 text-xs font-bold rounded-xl transition-all border border-white/5 flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" /> Share Link
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FilesManager;
