/**
 * TASKS API - Database operations for task management
 *
 * This file contains all functions for managing tasks in the database.
 * Tasks represent Kanban board items with drag-drop ordering.
 *
 * Functions:
 * - getTasks(userId, filter) - Fetch all tasks with optional filtering
 * - getTask(taskId) - Fetch single task by ID
 * - createTask(data) - Create new task
 * - updateTask(taskId, data) - Update existing task
 * - deleteTask(taskId) - Delete task
 * - updateTaskStatus(taskId, status) - Update task status with position reordering
 * - reorderTasks(userId, status, taskIds) - Reorder tasks within a status column
 */

import { createClient } from "../supabase/client";
import type {
  Task,
  TaskInsert,
  TaskUpdate,
  TaskStatus,
} from "../types/database";

/**
 * Task filter options
 */
export type TaskFilter = {
  status?: TaskStatus;
  priority?: "low" | "medium" | "high" | "urgent";
  project_id?: string;
  overdue?: boolean;
  search?: string;
};

/**
 * GET TASKS
 * Fetches all tasks for a user with optional filtering
 *
 * @param userId - The UUID of the user
 * @param filter - Optional filter object
 * @returns Array of tasks sorted by position (within status) then created_at
 * @throws Error if query fails
 */
export async function getTasks(
  userId: string,
  filter: TaskFilter = {},
): Promise<Task[]> {
  const supabase = createClient();

  // Start building query
  let query = supabase.from("tasks").select("*").eq("user_id", userId);

  // Apply status filter
  if (filter.status) {
    query = query.eq("status", filter.status);
  }

  // Apply priority filter
  if (filter.priority) {
    query = query.eq("priority", filter.priority);
  }

  // Apply project filter
  if (filter.project_id) {
    query = query.eq("project_id", filter.project_id);
  }

  // Apply overdue filter (tasks with due_date in the past and not done)
  if (filter.overdue) {
    query = query
      .lt("due_date", new Date().toISOString())
      .neq("status", "done");
  }

  // Apply search filter (full-text search)
  if (filter.search) {
    query = query.textSearch("search_vector", filter.search);
  }

  // Execute query with ordering
  // Order by position within status, then by created_at for new tasks
  const { data, error } = await query
    .order("position", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tasks:", error);
    throw new Error(`Failed to fetch tasks: ${error.message}`);
  }

  return data || [];
}

/**
 * GET TASK
 * Fetches a single task by ID
 *
 * @param taskId - The UUID of the task
 * @returns Task object
 * @throws Error if task not found or query fails
 */
export async function getTask(taskId: string): Promise<Task> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", taskId)
    .single();

  if (error) {
    console.error("Error fetching task:", error);
    throw new Error(`Failed to fetch task: ${error.message}`);
  }

  if (!data) {
    throw new Error("Task not found");
  }

  return data;
}

/**
 * CREATE TASK
 * Creates a new task in the database
 *
 * Process:
 * 1. Validates required fields
 * 2. Calculates position (append to end of status column)
 * 3. Inserts task into database
 * 4. Returns created task with generated ID
 *
 * @param taskData - Task data to insert (without ID, dates)
 * @returns Newly created task with ID
 * @throws Error if creation fails or validation fails
 */
export async function createTask(taskData: TaskInsert): Promise<Task> {
  const supabase = createClient();

  // Validate required fields
  if (!taskData.user_id) {
    throw new Error("User ID is required");
  }
  if (!taskData.title || taskData.title.trim() === "") {
    throw new Error("Task title is required");
  }

  // Calculate position (append to end of status column)
  // Get current max position for this user and status
  const { data: positionData } = await supabase
    .from("tasks")
    .select("position")
    .eq("user_id", taskData.user_id)
    .eq("status", taskData.status || "todo")
    .order("position", { ascending: false })
    .limit(1)
    .single();

  const newPosition = positionData ? (positionData.position || 0) + 1 : 0;

  // Insert task with calculated position
  const taskWithPosition: TaskInsert = {
    ...taskData,
    position: newPosition,
  };

  const { data, error } = await supabase
    .from("tasks")
    .insert(taskWithPosition)
    .select()
    .single();

  if (error) {
    console.error("Error creating task:", error);
    throw new Error(`Failed to create task: ${error.message}`);
  }

  if (!data) {
    throw new Error("Failed to create task");
  }

  return data;
}

/**
 * UPDATE TASK
 * Updates an existing task
 *
 * @param taskId - The UUID of the task to update
 * @param updates - Partial task data to update
 * @returns Updated task object
 * @throws Error if update fails or task doesn't exist
 */
export async function updateTask(
  taskId: string,
  updates: TaskUpdate,
): Promise<Task> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", taskId)
    .select()
    .single();

  if (error) {
    console.error("Error updating task:", error);
    throw new Error(`Failed to update task: ${error.message}`);
  }

  if (!data) {
    throw new Error("Task not found or update failed");
  }

  return data;
}

/**
 * DELETE TASK
 * Deletes a task from the database
 *
 * Note: This will also delete associated notes due to CASCADE in database
 *
 * @param taskId - The UUID of the task to delete
 * @returns void
 * @throws Error if deletion fails
 */
export async function deleteTask(taskId: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.from("tasks").delete().eq("id", taskId);

  if (error) {
    console.error("Error deleting task:", error);
    throw new Error(`Failed to delete task: ${error.message}`);
  }
}

/**
 * UPDATE TASK STATUS
 * Updates task status and reorders positions
 *
 * Process:
 * 1. Updates the task status
 * 2. Moves task to end of new status column
 * 3. Sets completed_at if status is 'done'
 *
 * @param taskId - The UUID of the task
 * @param newStatus - New status value
 * @returns Updated task
 * @throws Error if update fails
 */
export async function updateTaskStatus(
  taskId: string,
  newStatus: TaskStatus,
): Promise<Task> {
  const supabase = createClient();

  // Get current task to check old status
  const currentTask = await getTask(taskId);

  // Calculate new position (end of new status column)
  const { data: positionData } = await supabase
    .from("tasks")
    .select("position")
    .eq("user_id", currentTask.user_id)
    .eq("status", newStatus)
    .order("position", { ascending: false })
    .limit(1)
    .single();

  const newPosition = positionData ? (positionData.position || 0) + 1 : 0;

  // Prepare updates
  const updates: TaskUpdate = {
    status: newStatus,
    position: newPosition,
  };

  // Set completed_at if moving to done
  if (newStatus === "done" && currentTask.status !== "done") {
    updates.completed_at = new Date().toISOString();
  }

  // Clear completed_at if moving away from done
  if (newStatus !== "done" && currentTask.status === "done") {
    updates.completed_at = null;
  }

  return updateTask(taskId, updates);
}

/**
 * REORDER TASKS
 * Reorders tasks within a status column
 *
 * Process:
 * 1. Updates position for all tasks in the column
 * 2. Maintains the order specified in taskIds array
 *
 * @param userId - The UUID of the user
 * @param status - The status column being reordered
 * @param taskIds - Array of task IDs in the new order
 * @returns void
 * @throws Error if reordering fails
 */
export async function reorderTasks(
  userId: string,
  status: TaskStatus,
  taskIds: string[],
): Promise<void> {
  const supabase = createClient();

  // Update each task's position based on its index in the array
  const updates = taskIds.map((taskId, index) => ({
    id: taskId,
    position: index,
  }));

  // Batch update all positions
  for (const update of updates) {
    const { error } = await supabase
      .from("tasks")
      .update({ position: update.position })
      .eq("id", update.id)
      .eq("user_id", userId)
      .eq("status", status);

    if (error) {
      console.error(`Error reordering task ${update.id}:`, error);
      throw new Error(`Failed to reorder task: ${error.message}`);
    }
  }
}

/**
 * GET TASK STATS
 * Fetches task statistics for a user
 *
 * @param userId - The UUID of the user
 * @returns Object with task counts by status and priority
 * @throws Error if query fails
 */
export async function getTaskStats(userId: string) {
  // Get all tasks for the user
  const tasks = await getTasks(userId);

  // Calculate stats
  const stats = {
    total: tasks.length,
    byStatus: {
      todo: tasks.filter((t) => t.status === "todo").length,
      "in-progress": tasks.filter((t) => t.status === "in-progress").length,
      review: tasks.filter((t) => t.status === "review").length,
      done: tasks.filter((t) => t.status === "done").length,
    },
    byPriority: {
      low: tasks.filter((t) => t.priority === "low").length,
      medium: tasks.filter((t) => t.priority === "medium").length,
      high: tasks.filter((t) => t.priority === "high").length,
      urgent: tasks.filter((t) => t.priority === "urgent").length,
    },
    overdue: tasks.filter(
      (t) =>
        t.due_date && new Date(t.due_date) < new Date() && t.status !== "done",
    ).length,
  };

  return stats;
}
