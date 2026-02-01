/**
 * PROFILE STATS API - Calculate user statistics from database
 *
 * This aggregates data from multiple tables to show user metrics
 */

import { createClient } from "../supabase/client";

/**
 * Profile statistics interface
 */

export interface ProfileStats {
  totalProjects: number;
  activeProjects: number;
  totalTasks: number;
  completedTasks: number;
  totalFiles: number;
  totalStars: number; // Sum of stars across all projects
}

/**
 * GET PROFILE STATS
 * Calculates statistics from projects, tasks, and files tables
 *
 * @param userId - The UUID of the user
 * @returns Aggregated statistics
 */

export const getProfileStats = async (
  userId: string,
): Promise<ProfileStats> => {
  const supabase = createClient();
  // Query 1: Get project stats
  const { data: projects, error: projectsError } = await supabase
    .from("projects")
    .select("status, stars")
    .eq("user_id", userId);
  if (projectsError) {
    console.error("Error fetching projects:", projectsError);
  }
  // Query 2: Get task stats
  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select("status")
    .eq("user_id", userId);
  if (tasksError) {
    console.error("Error fetching tasks:", tasksError);
  }
  // Query 3: Get file count
  const { count: fileCount, error: filesError } = await supabase
    .from("files")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("type", "file"); // Only count files, not folders
  if (filesError) {
    console.error("Error fetching files:", filesError);
  }
  // Calculate stats
  const totalProjects = projects?.length || 0;
  const activeProjects =
    projects?.filter((p) => p.status === "active").length || 0;
  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter((t) => t.status === "done").length || 0;
  const totalFiles = fileCount || 0;
  const totalStars = projects?.reduce((sum, p) => sum + (p.stars || 0), 0) || 0;
  return {
    totalProjects,
    activeProjects,
    totalTasks,
    completedTasks,
    totalFiles,
    totalStars,
  };
};

/**
 * GET RECENT ACTIVITY
 * Fetches recent user actions from analytics_events table
 *
 * @param userId - The UUID of the user
 * @param limit - Number of activities to fetch (default: 10)
 * @returns Array of recent activities
 */

export interface RecentActivity {
  action: string;
  repo: string;
  time: string;
}

export const getRecentActivity = async (
  userId: string,
  limit: number = 10,
): Promise<RecentActivity[]> => {
  const supabase = createClient();
  // Fetch recent analytics events
  const { data, error } = await supabase
    .from("analytics_events")
    .select("event_type, metadata, created_at, resource_type, resource_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("Error fetching activity:", error);
    return [];
  }
  if (!data) {
    return [];
  }
  // Format events into activity items
  return data.map((event) => {
    let action = "";
    let repo = "";
    // Format based on event type
    switch (event.event_type) {
      case "project_created":
        action = "Created new project";
        repo = event.metadata?.title || "Unnamed project";
        break;
      case "project_updated":
        action = "Updated project";
        repo = event.metadata?.title || "Project";
        break;
      case "task_completed":
        action = "Completed task";
        repo = event.metadata?.title || "Task";
        break;
      case "file_uploaded":
        action = "Uploaded file";
        repo = event.metadata?.name || "File";
        break;
      case "login":
        action = "Logged in";
        repo = "NexusHub";
        break;
      default:
        action = event.event_type.replace(/_/g, " ");
        repo = event.resource_type || "System";
    }

    // Format time (relative time)
    const time = formatRelativeTime(new Date(event.created_at));
    return { action, repo, time };
  });
};

/**
 * Format relative time (e.g., "2 hours ago")
 */
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString();
}
