/**
 * PROJECTS API - Database operations for user projects
 *
 * This file contains all functions for managing projects in the database.
 * Projects represent portfolio items, repositories, or work samples.
 *
 * Functions:
 * - getProjects(userId, filter) - Fetch all projects with optional filtering
 * - getProject(projectId) - Fetch single project by ID
 * - createProject(data) - Create new project
 * - updateProject(projectId, data) - Update existing project
 * - deleteProject(projectId) - Delete project
 * - uploadProjectAsset(projectId, file) - Upload project image/asset
 */

import { createClient } from "../supabase/client";
import type { Project, ProjectInsert, ProjectUpdate } from "../types/database";

/**
 * Project filter options
 */
export type ProjectFilter = "all" | "active" | "archived" | "wip";

/**
 * GET PROJECTS
 * Fetches all projects for a user with optional status filtering
 *
 * @param userId - The UUID of the user
 * @param filter - Optional filter: 'all', 'active', 'archived', or 'wip'
 * @returns Array of projects sorted by updated_at (newest first)
 * @throws Error if query fails
 */
export async function getProjects(
  userId: string,
  filter: ProjectFilter = "all",
): Promise<Project[]> {
  const supabase = createClient();

  // Start building query
  // .select('*') = get all columns
  // .eq('user_id', userId) = WHERE user_id = userId
  // .order('updated_at', { ascending: false }) = ORDER BY updated_at DESC
  let query = supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  // Apply status filter if not 'all'
  // This adds: AND status = 'active' (or whatever filter is)
  if (filter !== "all") {
    query = query.eq("status", filter);
  }

  // Execute the query
  const { data, error } = await query;

  if (error) {
    console.error("Error fetching projects:", error);
    throw new Error(`Failed to fetch projects: ${error.message}`);
  }

  // Return projects array (empty array if no projects)
  return data || [];
}

/**
 * GET PROJECT
 * Fetches a single project by ID
 *
 * @param projectId - The UUID of the project
 * @returns Project object
 * @throws Error if project not found or query fails
 */
export async function getProject(projectId: string): Promise<Project> {
  const supabase = createClient();

  // Query single project
  // .single() expects exactly one result
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (error) {
    console.error("Error fetching project:", error);
    throw new Error(`Failed to fetch project: ${error.message}`);
  }

  if (!data) {
    throw new Error("Project not found");
  }

  return data;
}

/**
 * CREATE PROJECT
 * Creates a new project in the database
 *
 * Process:
 * 1. Validates required fields
 * 2. Inserts project into database
 * 3. Returns created project with generated ID
 *
 * @param projectData - Project data to insert (without ID, dates)
 * @returns Newly created project with ID
 * @throws Error if creation fails or validation fails
 */
export async function createProject(
  projectData: ProjectInsert,
): Promise<Project> {
  const supabase = createClient();

  // Validate required fields
  if (!projectData.user_id) {
    throw new Error("User ID is required");
  }
  if (!projectData.title || projectData.title.trim() === "") {
    throw new Error("Project title is required");
  }

  // Insert project into database
  // .insert() = INSERT INTO projects
  // .select() = RETURNING * (get the inserted row)
  // .single() = expect one result
  const { data, error } = await supabase
    .from("projects")
    .insert(projectData)
    .select()
    .single();

  if (error) {
    console.error("Error creating project:", error);
    throw new Error(`Failed to create project: ${error.message}`);
  }

  if (!data) {
    throw new Error("Failed to create project");
  }

  return data;
}

/**
 * UPDATE PROJECT
 * Updates an existing project
 *
 * @param projectId - The UUID of the project to update
 * @param updates - Partial project data to update
 * @returns Updated project object
 * @throws Error if update fails or project doesn't exist
 */
export async function updateProject(
  projectId: string,
  updates: ProjectUpdate,
): Promise<Project> {
  const supabase = createClient();

  // Update project
  // .update(updates) = UPDATE projects SET ...
  // .eq('id', projectId) = WHERE id = projectId
  // .select() = RETURNING *
  // .single() = expect one result
  const { data, error } = await supabase
    .from("projects")
    .update(updates)
    .eq("id", projectId)
    .select()
    .single();

  if (error) {
    console.error("Error updating project:", error);
    throw new Error(`Failed to update project: ${error.message}`);
  }

  if (!data) {
    throw new Error("Project not found or update failed");
  }

  return data;
}

/**
 * DELETE PROJECT
 * Deletes a project from the database
 *
 * Note: This will also delete associated assets due to CASCADE in database
 *
 * @param projectId - The UUID of the project to delete
 * @returns void
 * @throws Error if deletion fails
 */
export async function deleteProject(projectId: string): Promise<void> {
  const supabase = createClient();

  // Delete project
  // .delete() = DELETE FROM projects
  // .eq('id', projectId) = WHERE id = projectId
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId);

  if (error) {
    console.error("Error deleting project:", error);
    throw new Error(`Failed to delete project: ${error.message}`);
  }
}

/**
 * UPLOAD PROJECT ASSET
 * Uploads an image/file for a project to Supabase Storage
 *
 * Process:
 * 1. Validate file size and type
 * 2. Upload to 'project-assets' bucket
 * 3. Get public URL
 * 4. Update project with asset URL
 *
 * @param projectId - The UUID of the project
 * @param file - The file to upload (image or video)
 * @returns Updated project with new featured_image URL
 * @throws Error if upload fails or file is invalid
 */
export async function uploadProjectAsset(
  projectId: string,
  file: File,
): Promise<Project> {
  const supabase = createClient();

  // First, get the project to ensure it exists and get user_id
  const project = await getProject(projectId);

  // Validate file size (50MB max - matches bucket config)
  const MAX_SIZE = 50 * 1024 * 1024; // 50MB in bytes
  if (file.size > MAX_SIZE) {
    throw new Error("File size must be less than 50MB");
  }

  // Validate file type (images and videos)
  const validTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    "video/mp4",
    "video/webm",
  ];
  if (!validTypes.includes(file.type)) {
    throw new Error(
      "File must be an image (JPEG, PNG, GIF, WebP, SVG) or video (MP4, WebM)",
    );
  }

  // Create unique filename
  // Format: {user_id}/{project_id}/asset-{timestamp}.{ext}
  // Example: "user123/project456/asset-1738454321000.jpg"
  const fileExt = file.name.split(".").pop();
  const fileName = `${project.user_id}/${projectId}/asset-${Date.now()}.${fileExt}`;

  // Upload file to Supabase Storage
  // Bucket: 'project-assets' (private bucket)
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("project-assets")
    .upload(fileName, file, {
      upsert: true, // Overwrite if exists
      contentType: file.type,
    });

  if (uploadError) {
    console.error("Error uploading project asset:", uploadError);
    throw new Error(`Failed to upload asset: ${uploadError.message}`);
  }

  // Get public URL for the uploaded file
  // Note: Even though bucket is private, we can get a signed URL
  // For now, we'll use getPublicUrl (requires bucket to be public or use signed URLs)
  const { data: urlData } = supabase.storage
    .from("project-assets")
    .getPublicUrl(fileName);

  const assetUrl = urlData.publicUrl;

  // Update project with new asset URL (as featured_image)
  const updatedProject = await updateProject(projectId, {
    featured_image: assetUrl,
  });

  return updatedProject;
}

/**
 * TOGGLE PROJECT STATUS
 * Helper function to quickly change project status
 *
 * @param projectId - The UUID of the project
 * @param newStatus - New status: 'active', 'archived', or 'wip'
 * @returns Updated project
 */
export async function toggleProjectStatus(
  projectId: string,
  newStatus: "active" | "archived" | "wip",
): Promise<Project> {
  return updateProject(projectId, { status: newStatus });
}

/**
 * INCREMENT PROJECT STARS
 * Helper to increment the star count for a project
 *
 * @param projectId - The UUID of the project
 * @returns Updated project
 */
export async function incrementProjectStars(
  projectId: string,
): Promise<Project> {
  const supabase = createClient();

  // Get current project
  const project = await getProject(projectId);

  // Increment stars
  const newStars = (project.stars || 0) + 1;

  return updateProject(projectId, { stars: newStars });
}
