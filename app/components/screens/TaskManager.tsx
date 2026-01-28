import { motion } from "motion/react";
import {
  ArrowLeft,
  Plus,
  Search,
  CheckSquare,
  Square,
  Trash2,
  Edit,
  Calendar as CalendarIcon,
  Tag,
  Clock,
  MoreVertical,
  FileText,
} from "lucide-react";
import { useState } from "react";

interface TaskManagerProps {
  onNavigate: (screen: string) => void;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "inprogress" | "done";
  priority: "low" | "medium" | "high";
  dueDate?: string;
  tags: string[];
}

interface Note {
  id: string;
  title: string;
  content: string;
  created: string;
  tags: string[];
}

const TaskManager = ({ onNavigate }: TaskManagerProps) => {
  const [activeTab, setActiveTab] = useState<"tasks" | "notes">("tasks");
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Refactor authentication module",
      description: "Update to use latest security standards",
      status: "inprogress",
      priority: "high",
      dueDate: "2026-02-01",
      tags: ["security", "backend"],
    },
    {
      id: "2",
      title: "Design new dashboard layout",
      description: "Create mockups for v3.0",
      status: "todo",
      priority: "medium",
      dueDate: "2026-02-05",
      tags: ["design", "ui"],
    },
    {
      id: "3",
      title: "Write API documentation",
      status: "todo",
      priority: "low",
      tags: ["docs"],
    },
    {
      id: "4",
      title: "Fix login bug on mobile",
      status: "done",
      priority: "high",
      dueDate: "2026-01-28",
      tags: ["bug", "mobile"],
    },
  ]);

  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "Project Architecture Notes",
      content:
        "Key decisions:\n- Using microservices architecture\n- PostgreSQL for main database\n- Redis for caching\n- Docker for containerization",
      created: "2026-01-25",
      tags: ["architecture", "planning"],
    },
    {
      id: "2",
      title: "Meeting Notes - Jan 28",
      content:
        "Discussed:\n- Q1 roadmap priorities\n- Team expansion plans\n- New feature requests from clients",
      created: "2026-01-28",
      tags: ["meetings"],
    },
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-400 border-red-400/30 bg-red-400/10";
      case "medium":
        return "text-orange-400 border-orange-400/30 bg-orange-400/10";
      case "low":
        return "text-green-400 border-green-400/30 bg-green-400/10";
      default:
        return "text-muted-foreground border-border/30 bg-secondary";
    }
  };

  const tasksByStatus = {
    todo: tasks.filter((t) => t.status === "todo"),
    inprogress: tasks.filter((t) => t.status === "inprogress"),
    done: tasks.filter((t) => t.status === "done"),
  };

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
                  TASK_MANAGER
                </h1>
                <p
                  className="text-xs text-muted-foreground"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  WORKFLOW_ENGINE_v2.0
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 w-full md:w-auto">
              <div className="flex items-center space-x-1 bg-secondary border border-border/30 rounded-sm p-1">
                <button
                  onClick={() => setActiveTab("tasks")}
                  className={`px-4 py-2 rounded-sm transition-colors text-sm ${
                    activeTab === "tasks"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  TASKS
                </button>
                <button
                  onClick={() => setActiveTab("notes")}
                  className={`px-4 py-2 rounded-sm transition-colors text-sm ${
                    activeTab === "notes"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  NOTES
                </button>
              </div>

              <motion.button
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-sm hover:bg-destructive transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-4 h-4" />
                <span
                  className="text-sm hidden md:inline"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  NEW {activeTab === "tasks" ? "TASK" : "NOTE"}
                </span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-8 py-8">
        {activeTab === "tasks" ? (
          <>
            {/* Task stats */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="terminal-glass p-4 rounded-sm border border-border/20">
                <div
                  className="text-xs text-muted-foreground mb-1"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  TOTAL_TASKS
                </div>
                <div
                  className="text-2xl text-foreground"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  {tasks.length}
                </div>
              </div>
              <div className="terminal-glass p-4 rounded-sm border border-border/20">
                <div
                  className="text-xs text-muted-foreground mb-1"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  IN_PROGRESS
                </div>
                <div
                  className="text-2xl text-foreground"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  {tasksByStatus.inprogress.length}
                </div>
              </div>
              <div className="terminal-glass p-4 rounded-sm border border-border/20">
                <div
                  className="text-xs text-muted-foreground mb-1"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  COMPLETED
                </div>
                <div
                  className="text-2xl text-foreground"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  {tasksByStatus.done.length}
                </div>
              </div>
              <div className="terminal-glass p-4 rounded-sm border border-border/20">
                <div
                  className="text-xs text-muted-foreground mb-1"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  HIGH_PRIORITY
                </div>
                <div
                  className="text-2xl text-foreground"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  {tasks.filter((t) => t.priority === "high").length}
                </div>
              </div>
            </motion.div>

            {/* Kanban board */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(["todo", "inprogress", "done"] as const).map(
                (status, colIndex) => (
                  <motion.div
                    key={status}
                    className="terminal-glass-strong rounded-sm border border-border/30 p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + colIndex * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3
                        className="text-sm text-foreground uppercase"
                        style={{ fontFamily: "IBM Plex Mono, monospace" }}
                      >
                        {status === "todo"
                          ? "To Do"
                          : status === "inprogress"
                            ? "In Progress"
                            : "Done"}
                      </h3>
                      <span
                        className="text-xs text-muted-foreground px-2 py-1 bg-secondary rounded-sm"
                        style={{ fontFamily: "IBM Plex Mono, monospace" }}
                      >
                        {tasksByStatus[status].length}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {tasksByStatus[status].map((task, taskIndex) => (
                        <motion.div
                          key={task.id}
                          className="group terminal-glass p-4 rounded-sm border border-border/20 hover:border-primary/50 transition-all cursor-pointer"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: 0.4 + colIndex * 0.1 + taskIndex * 0.05,
                          }}
                          whileHover={{ y: -2 }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="text-sm text-foreground flex-1">
                              {task.title}
                            </h4>
                            <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-secondary rounded-sm">
                              <MoreVertical className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </div>

                          {task.description && (
                            <p className="text-xs text-muted-foreground mb-3">
                              {task.description}
                            </p>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span
                                className={`text-xs px-2 py-0.5 rounded-sm border ${getPriorityColor(
                                  task.priority,
                                )}`}
                                style={{
                                  fontFamily: "IBM Plex Mono, monospace",
                                }}
                              >
                                {task.priority.toUpperCase()}
                              </span>
                              {task.dueDate && (
                                <span
                                  className="text-xs text-muted-foreground flex items-center space-x-1"
                                  style={{
                                    fontFamily: "IBM Plex Mono, monospace",
                                  }}
                                >
                                  <Clock className="w-3 h-3" />
                                  <span>{task.dueDate}</span>
                                </span>
                              )}
                            </div>
                          </div>

                          {task.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {task.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs px-2 py-0.5 bg-secondary border border-border/30 rounded-sm text-muted-foreground"
                                  style={{
                                    fontFamily: "IBM Plex Mono, monospace",
                                  }}
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ),
              )}
            </div>
          </>
        ) : (
          <>
            {/* Notes grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {notes.map((note, index) => (
                <motion.div
                  key={note.id}
                  className="group terminal-glass-strong p-6 rounded-sm border border-border/20 hover:border-primary/50 transition-all cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-primary" />
                      <h3
                        className="text-sm text-foreground"
                        style={{ fontFamily: "IBM Plex Mono, monospace" }}
                      >
                        {note.title}
                      </h3>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-secondary rounded-sm">
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 whitespace-pre-line line-clamp-4">
                    {note.content}
                  </p>

                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs text-muted-foreground"
                      style={{ fontFamily: "IBM Plex Mono, monospace" }}
                    >
                      {note.created}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {note.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 bg-secondary border border-border/30 rounded-sm text-muted-foreground"
                          style={{ fontFamily: "IBM Plex Mono, monospace" }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskManager;
