/**
 * FILES API - Database and Storage operations for user files
 *
 * This file handles file metadata in PostgreSQL and actual binary
 * storage in Supabase Storage.
 */

import { createClient } from "../supabase/client";
import type { File as DBFile, FileInsert, FileUpdate } from "../types/database";

/**
 * GET FILES
 * Fetches files and folders for a specific parent folder
 *
 * @param userId - The UUID of the user
 * @param parentFolderId - The ID of the parent folder (null for root)
 * @returns Array of files and folders
 */
export async function getFiles(
  userId: string,
  parentFolderId: string | null = null,
): Promise<DBFile[]> {
  const supabase = createClient();

  let query = supabase.from("files").select("*").eq("user_id", userId);

  if (parentFolderId) {
    query = query.eq("parent_folder_id", parentFolderId);
  } else {
    query = query.is("parent_folder_id", null);
  }

  const { data, error } = await query
    .order("type", { ascending: false })
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching files:", error);
    throw new Error(`Failed to fetch files: ${error.message}`);
  }

  return data || [];
}

/**
 * CREATE FOLDER
 * Creates a new folder in the database
 */
export async function createFolder(
  userId: string,
  name: string,
  parentFolderId: string | null = null,
): Promise<DBFile> {
  const supabase = createClient();

  const folderData: FileInsert = {
    user_id: userId,
    name,
    type: "folder",
    parent_folder_id: parentFolderId,
    storage_bucket: "files",
    size_bytes: 0,
    is_public: false,
    project_id: null,
    mime_type: null,
    storage_path: null,
    extension: null,
  };

  const { data, error } = await supabase
    .from("files")
    .insert(folderData)
    .select()
    .single();

  if (error) {
    console.error("Error creating folder:", error);
    throw new Error(`Failed to create folder: ${error.message}`);
  }

  return data;
}

/**
 * UPLOAD FILE
 * Uploads a file to Storage and saves metadata to Database
 */
export async function uploadFile(
  userId: string,
  file: File,
  parentFolderId: string | null = null,
): Promise<DBFile> {
  const supabase = createClient();

  // 1. Storage Path: {userId}/{timestamp}-{filename}
  const fileExt = file.name.split(".").pop();
  const storagePath = `${userId}/${Date.now()}-${file.name}`;

  // 2. Upload to 'files' bucket
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("files")
    .upload(storagePath, file);

  if (uploadError) {
    console.error("Error uploading file to storage:", uploadError);
    throw new Error(`Storage upload failed: ${uploadError.message}`);
  }

  // 3. Save metadata to database
  const fileData: FileInsert = {
    user_id: userId,
    name: file.name,
    type: "file",
    mime_type: file.type,
    storage_path: storagePath,
    storage_bucket: "files",
    size_bytes: file.size,
    extension: fileExt || null,
    parent_folder_id: parentFolderId,
    is_public: false,
    project_id: null,
  };

  const { data, error } = await supabase
    .from("files")
    .insert(fileData)
    .select()
    .single();

  if (error) {
    // Cleanup: delete from storage if DB insert fails
    await supabase.storage.from("files").remove([storagePath]);
    console.error("Error saving file metadata:", error);
    throw new Error(`Database entry failed: ${error.message}`);
  }

  return data;
}

/**
 * DELETE FILE/FOLDER
 * Deletes metadata and actual storage object if it's a file
 */
export async function deleteFile(file: DBFile): Promise<void> {
  const supabase = createClient();

  // 1. If it's a file, delete from Storage
  if (file.type === "file" && file.storage_path) {
    const { error: storageError } = await supabase.storage
      .from(file.storage_bucket)
      .remove([file.storage_path]);

    if (storageError) {
      console.warn(
        "Could not delete from storage, proceeding with DB deletion:",
        storageError,
      );
    }
  }

  // 2. Delete metadata from DB (CASCADE will handle children if it's a folder)
  const { error } = await supabase.from("files").delete().eq("id", file.id);

  if (error) {
    console.error("Error deleting file metadata:", error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}

/**
 * GET DOWNLOAD URL
 * Gets a temporary signed URL for a private file
 */
export async function getDownloadUrl(file: DBFile): Promise<string> {
  const supabase = createClient();

  if (file.type === "folder" || !file.storage_path) {
    throw new Error("Cannot download a folder or file without storage path");
  }

  const { data, error } = await supabase.storage
    .from(file.storage_bucket)
    .createSignedUrl(file.storage_path, 3600); // 1 hour valid

  if (error) {
    throw new Error(`Failed to generate download URL: ${error.message}`);
  }

  return data.signedUrl;
}
