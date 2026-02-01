"use client";

import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Star,
  Code2,
  Zap,
  Database,
  Globe,
  Plus,
  Trash2,
  Edit3,
  Maximize2,
  MoreVertical,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { CarbonFiber } from "../effects/CarbonFiber";
import ParticleField from "../effects/ParticleField";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  toggleProjectStatus,
  type ProjectFilter,
} from "@/lib/api/projects";
import { useAuthStore } from "@/lib/store/auth-store";
import type { Project, ProjectInsert } from "@/lib/types/database";
import { ProjectDetailModal } from "../ui/ProjectDetailModal";

interface ProjectsScreenProps {
  onNavigate: (screen: string) => void;
}

// Icon mapping
const iconMap: Record<string, any> = {
  Code2,
  Zap,
  Database,
  Globe,
};

const ProjectsScreen = ({ onNavigate }: ProjectsScreenProps) => {
  // --- AUTH ---
  const { user } = useAuthStore();

  // --- STATE ---
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [filter, setFilter] = useState<ProjectFilter>("all");
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [viewingProject, setViewingProject] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<ProjectInsert>>({
    title: "",
    description: "",
    status: "active",
    tags: [],
    icon: "Code2",
    gradient: "from-red-500/20 to-purple-500/20",
  });

  // --- FETCH PROJECTS ---
  useEffect(() => {
    const fetchProjectsData = async () => {
      if (!user?.id) {
        setError("No user logged in");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await getProjects(user.id, filter);
        setProjects(data);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load projects",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectsData();
  }, [user?.id, filter]);

  // --- HANDLERS ---

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const newProject = await createProject({
        user_id: user.id,
        title: formData.title || "",
        description: formData.description || "",
        status: formData.status || "active",
        tags: formData.tags || [],
        icon: formData.icon || "Code2",
        gradient: formData.gradient || "from-red-500/20 to-purple-500/20",
        github_url: formData.github_url || null,
        demo_url: formData.demo_url || null,
        readme: null,
        npm_url: null,
        featured_image: null,
        visibility: "public",
        featured: false,
        tech_stack: [],
        language: null,
        last_commit_at: null,
      });

      setProjects([newProject, ...projects]);
      setIsCreateModalOpen(false);
      resetForm();
    } catch (err) {
      console.error("Error creating project:", err);
      setError(err instanceof Error ? err.message : "Failed to create project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const updated = await updateProject(editingProject.id, {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        tags: formData.tags,
        icon: formData.icon,
        gradient: formData.gradient,
        github_url: formData.github_url || null,
        demo_url: formData.demo_url || null,
      });

      setProjects(projects.map((p) => (p.id === updated.id ? updated : p)));
      setEditingProject(null);
      resetForm();
    } catch (err) {
      console.error("Error updating project:", err);
      setError(err instanceof Error ? err.message : "Failed to update project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (
    projectId: string,
    e?: React.MouseEvent,
  ) => {
    e?.stopPropagation(); // Prevent opening detailed view
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      await deleteProject(projectId);
      setProjects(projects.filter((p) => p.id !== projectId));
      // If we deleted the currently viewed project, close the modal
      if (viewingProject?.id === projectId) {
        setViewingProject(null);
      }
    } catch (err) {
      console.error("Error deleting project:", err);
      setError(err instanceof Error ? err.message : "Failed to delete project");
    }
  };

  const openCreateModal = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const openEditModal = (project: Project, e?: React.MouseEvent) => {
    e?.stopPropagation(); // Prevent opening detailed view
    setFormData({
      title: project.title,
      description: project.description,
      status: project.status,
      tags: project.tags || [],
      icon: project.icon,
      gradient: project.gradient,
      github_url: project.github_url || "",
      demo_url: project.demo_url || "",
    });
    setEditingProject(project);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      status: "active",
      tags: [],
      icon: "Code2",
      gradient: "from-red-500/20 to-purple-500/20",
    });
  };

  // --- STATS ---
  const stats = {
    total: projects.length,
    active: projects.filter((p) => p.status === "active").length,
    wip: projects.filter((p) => p.status === "wip").length,
    stars: projects.reduce((sum, p) => sum + (p.stars || 0), 0),
  };

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden flex flex-col">
      {/* Particle field */}
      <ParticleField density={40} />

      {/* Carbon fiber texture on sides */}
      <CarbonFiber className="w-32" opacity={0.3} />

      {/* Grid pattern background */}
      <div className="absolute inset-0 grid-pattern opacity-15" />

      {/* LOADING STATE */}
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="terminal-glass-strong p-8 rounded-sm border border-border/30">
            <p className="text-sm text-muted-foreground font-mono">
              LOADING_PROJECTS...
            </p>
          </div>
        </div>
      )}

      {/* ERROR STATE */}
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="terminal-glass-strong p-4 rounded-sm border border-destructive/50 bg-destructive/10">
            <p className="text-sm text-destructive font-mono">ERROR: {error}</p>
          </div>
        </div>
      )}

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

            <div className="flex items-center space-x-2">
              {/* Filters */}
              {(["all", "active", "archived", "wip"] as const).map((f) => (
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

              {/* Create Button */}
              <motion.button
                onClick={openCreateModal}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-4 h-4" />
                <span style={{ fontFamily: "IBM Plex Mono, monospace" }}>
                  NEW
                </span>
              </motion.button>
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
              { label: "TOTAL_PROJECTS", value: stats.total },
              { label: "ACTIVE", value: stats.active },
              { label: "IN_PROGRESS", value: stats.wip },
              { label: "TOTAL_STARS", value: stats.stars.toLocaleString() },
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
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-sm font-mono">
                No projects found.{" "}
                {filter !== "all"
                  ? `Try changing the filter.`
                  : "Create your first project!"}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => {
                const Icon = iconMap[project.icon || "Code2"] || Code2;
                return (
                  <motion.div
                    key={project.id}
                    className="relative group cursor-pointer"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onMouseEnter={() => setHoveredProject(project.id)}
                    onMouseLeave={() => setHoveredProject(null)}
                    onClick={() => setViewingProject(project)}
                    whileHover={{
                      scale: 1.02,
                      y: -4,
                      transition: { duration: 0.2 },
                    }}
                    layoutId={`project-${project.id}`}
                  >
                    <div className="terminal-glass-strong rounded-sm border border-border/30 overflow-hidden h-full flex flex-col group-hover:border-primary/50 transition-all duration-300">
                      {/* Card header with gradient */}
                      <div
                        className={`relative p-6 bg-gradient-to-br ${
                          project.gradient
                        } overflow-hidden`}
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

                          {/* Admin Controls */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => openEditModal(project, e)}
                              className="p-1.5 bg-black/50 rounded-sm hover:bg-black/70 text-white transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) =>
                                handleDeleteProject(project.id, e)
                              }
                              className="p-1.5 bg-black/50 rounded-sm hover:bg-destructive/70 text-white transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
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
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed flex-1 line-clamp-3">
                          {project.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {(project.tags || []).slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-secondary border border-border/30 rounded-sm text-xs text-muted-foreground font-mono"
                            >
                              #{tag}
                            </span>
                          ))}
                          {(project.tags || []).length > 3 && (
                            <span className="px-2 py-1 bg-secondary/50 rounded-sm text-xs text-muted-foreground font-mono">
                              +{(project.tags?.length || 0) - 3}
                            </span>
                          )}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between pt-4 border-t border-border/20">
                          <div
                            className="flex items-center space-x-4 text-xs text-muted-foreground"
                            style={{ fontFamily: "IBM Plex Mono, monospace" }}
                          >
                            <div className="flex items-center space-x-1">
                              <Star className="w-3.5 h-3.5" />
                              <span>
                                {(project.stars || 0).toLocaleString()}
                              </span>
                            </div>
                            <div
                              className={`px-2 py-0.5 rounded-sm uppercase text-[10px] tracking-wider ${
                                project.status === "active"
                                  ? "bg-green-500/10 text-green-500"
                                  : project.status === "wip"
                                    ? "bg-yellow-500/10 text-yellow-500"
                                    : "bg-gray-500/10 text-gray-500"
                              }`}
                            >
                              {project.status}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                            <span>Click for details</span>
                            <Maximize2 className="w-3 h-3" />
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
                  </motion.div>
                );
              })}
            </div>
          )}

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

      {/* CREATE/EDIT MODAL */}
      {(isCreateModalOpen || editingProject) && (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <motion.div
            className="terminal-glass-strong p-8 rounded-sm border border-border/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h2 className="text-2xl font-mono text-foreground mb-6">
              {editingProject ? "EDIT_PROJECT" : "CREATE_PROJECT"}
            </h2>

            <form
              onSubmit={
                editingProject ? handleUpdateProject : handleCreateProject
              }
            >
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-mono text-muted-foreground">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full bg-input border border-border/40 rounded-sm px-3 py-2 text-foreground"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-mono text-muted-foreground">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full bg-input border border-border/40 rounded-sm px-3 py-2 text-foreground"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-mono text-muted-foreground">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as any,
                        })
                      }
                      className="w-full bg-input border border-border/40 rounded-sm px-3 py-2 text-foreground"
                    >
                      <option value="active">Active</option>
                      <option value="wip">In Progress</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-mono text-muted-foreground">
                      Icon
                    </label>
                    <select
                      value={formData.icon}
                      onChange={(e) =>
                        setFormData({ ...formData, icon: e.target.value })
                      }
                      className="w-full bg-input border border-border/40 rounded-sm px-3 py-2 text-foreground"
                    >
                      <option value="Code2">Code</option>
                      <option value="Zap">Zap</option>
                      <option value="Database">Database</option>
                      <option value="Globe">Globe</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-mono text-muted-foreground">
                    GitHub URL (Required for AI/Tools)
                  </label>
                  <input
                    type="url"
                    value={formData.github_url || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, github_url: e.target.value })
                    }
                    className="w-full bg-input border border-border/40 rounded-sm px-3 py-2 text-foreground"
                    placeholder="https://github.com/..."
                  />
                </div>

                <div>
                  <label className="text-sm font-mono text-muted-foreground">
                    Demo URL
                  </label>
                  <input
                    type="url"
                    value={formData.demo_url || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, demo_url: e.target.value })
                    }
                    className="w-full bg-input border border-border/40 rounded-sm px-3 py-2 text-foreground"
                    placeholder="https://demo.com"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setEditingProject(null);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-secondary text-muted-foreground rounded-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-sm disabled:opacity-50"
                >
                  {isSubmitting
                    ? "Saving..."
                    : editingProject
                      ? "Update"
                      : "Create"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* DETAIL MODAL (NEW!) */}
      {viewingProject && (
        <ProjectDetailModal
          project={viewingProject}
          isOpen={!!viewingProject}
          onClose={() => setViewingProject(null)}
          onEdit={(p) => openEditModal(p)}
          onDelete={(id) => handleDeleteProject(id)}
        />
      )}
    </div>
  );
};

export default ProjectsScreen;
