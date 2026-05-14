/**
 * NOTES API - Database operations for task notes
 *
 * This file contains all functions for managing notes in the database.
 * Notes represent comments/notes attached to tasks.
 *
 * Functions:
 * - getNotes(taskId) - Fetch all notes for a task
 * - getNote(noteId) - Fetch single note by ID
 * - createNote(data) - Create new note
 * - updateNote(noteId, data) - Update existing note
 * - deleteNote(noteId) - Delete note
 */

import { createClient } from "../supabase/client";
import type { Note, NoteInsert, NoteUpdate } from "../types/database";

/**
 * GET NOTES
 * Fetches all notes for a specific task
 *
 * @param taskId - The UUID of the task
 * @returns Array of notes sorted by created_at (newest first)
 * @throws Error if query fails
 */
export async function getNotes(taskId: string): Promise<Note[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("task_id", taskId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching notes:", error);
    throw new Error(`Failed to fetch notes: ${error.message}`);
  }

  return data || [];
}

/**
 * GET NOTE
 * Fetches a single note by ID
 *
 * @param noteId - The UUID of the note
 * @returns Note object
 * @throws Error if note not found or query fails
 */
export async function getNote(noteId: string): Promise<Note> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", noteId)
    .single();

  if (error) {
    console.error("Error fetching note:", error);
    throw new Error(`Failed to fetch note: ${error.message}`);
  }

  if (!data) {
    throw new Error("Note not found");
  }

  return data;
}

/**
 * CREATE NOTE
 * Creates a new note in the database
 *
 * @param noteData - Note data to insert (without ID, dates)
 * @returns Newly created note with ID
 * @throws Error if creation fails or validation fails
 */
export async function createNote(noteData: NoteInsert): Promise<Note> {
  const supabase = createClient();

  // Validate required fields
  if (!noteData.task_id) {
    throw new Error("Task ID is required");
  }
  if (!noteData.user_id) {
    throw new Error("User ID is required");
  }
  if (!noteData.content || noteData.content.trim() === "") {
    throw new Error("Note content is required");
  }

  const { data, error } = await supabase
    .from("notes")
    .insert(noteData)
    .select()
    .single();

  if (error) {
    console.error("Error creating note:", error);
    throw new Error(`Failed to create note: ${error.message}`);
  }

  if (!data) {
    throw new Error("Failed to create note");
  }

  return data;
}

/**
 * UPDATE NOTE
 * Updates an existing note
 *
 * @param noteId - The UUID of the note to update
 * @param updates - Partial note data to update
 * @returns Updated note object
 * @throws Error if update fails or note doesn't exist
 */
export async function updateNote(
  noteId: string,
  updates: NoteUpdate,
): Promise<Note> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("notes")
    .update(updates)
    .eq("id", noteId)
    .select()
    .single();

  if (error) {
    console.error("Error updating note:", error);
    throw new Error(`Failed to update note: ${error.message}`);
  }

  if (!data) {
    throw new Error("Note not found or update failed");
  }

  return data;
}

/**
 * DELETE NOTE
 * Deletes a note from the database
 *
 * @param noteId - The UUID of the note to delete
 * @returns void
 * @throws Error if deletion fails
 */
export async function deleteNote(noteId: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.from("notes").delete().eq("id", noteId);

  if (error) {
    console.error("Error deleting note:", error);
    throw new Error(`Failed to delete note: ${error.message}`);
  }
}
