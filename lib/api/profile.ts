/**
 * PROFILE API - Database operations for user profiles
 *
 * This file contains all functions for interacting with the profiles table.
 * Each function returns data or throws an error if something goes wrong.
 *
 * Functions:
 * - getProfile(userId) - Fetch a user's profile from database
 * - updateProfile(userId, data) - Update profile information
 * - uploadAvatar(userId, file) - Upload profile picture to Supabase Storage
 */

import { createClient } from "../supabase/client";
import { Profile, ProfileUpdate } from "../types/database";

/**
 * GET PROFILE
 * Fetches a user's profile data from the database
 *
 * @param userId - The UUID of the user (from auth.uid())
 * @returns Profile object with all user data
 * @throws Error if profile doesn't exist or query fails
 */

export const getProfile = async (userId: string): Promise<Profile> => {
  // Create supabase client (auth automatic handled)
  const supabase = createClient();

  // Query the profiles table
  // .select('*') = get all columns
  // .eq('id', userId) = WHERE id = userId
  // .single() = expect exactly one result (not an array)
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  // if query fails, throw error
  if (error) {
    console.error("Error fetching profile:", error);
    throw new Error(`Failed to fetch profile: ${error.message}`);
  }

  // If no data returned (shouldn't happen with .single())
  if (!data) {
    throw new Error("Profile not found");
  }

  // Return the profile data (TypeScript knows it's a Profile type)
  return data;
};

/**
 * UPDATE PROFILE
 * Updates user profile information in the database
 *
 * @param userId - The UUID of the user
 * @param updates - Partial profile data to update (only changed fields)
 * @returns Updated profile object
 * @throws Error if update fails or user doesn't own this profile
 */

export const updateProfile = async (
  userId: string,
  updates: ProfileUpdate,
): Promise<Profile> => {
  const supabase = createClient();

  // Update the profile
  // .update(updates) = SET field1 = value1, field2 = value2, ...
  // .eq('id', userId) = WHERE id = userId
  // .select() = return the updated row
  // .single() = expect one result
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating profile:", error);
    throw new Error(`Failed to update profile: ${error.message}`);
  }

  if (!data) {
    throw new Error("Failed to update profile");
  }

  return data;
};

/**
 * UPLOAD AVATAR
 * Uploads a profile picture to Supabase Storage and updates profile
 *
 * Process:
 * 1. Upload file to 'avatars' bucket
 * 2. Get public URL for the uploaded file
 * 3. Update profile with avatar_url
 *
 * @param userId - The UUID of the user
 * @param file - The image file to upload (File object from <input type="file">)
 * @returns Updated profile with new avatar_url
 * @throws Error if upload fails or file is too large/wrong type
 */

export const uploadAvatar = async (
  userId: string,
  file: File,
): Promise<Profile> => {
  const supabase = createClient();

  // Validate file size (5MB max - matches database bucket config)
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > MAX_SIZE) {
    throw new Error("File size must be less than 5MB");
  }

  // Validate file type (images only)
  const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (!validTypes.includes(file.type))
    throw new Error("File must be an image (JPEG, PNG, GIF, or WebP)");

  // Create unique filename to avoid collisions
  // Format: {userId}/avatar-{timestamp}.{extension}
  // Example: "abc123/avatar-1738454321000.jpg"

  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}/avatar-${Date.now()}.${fileExt}`;

  // Upload file to Supabase Storage
  // Bucket: 'avatars' (public bucket we created in migrations)
  // Path: fileName (unique path for this user)
  // File: the actual file data
  // Options: upsert = overwrite if exists, contentType = correct MIME type
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, file, { upsert: true, contentType: file.type });

  if (uploadError) {
    console.error("Error uploading avatar:", uploadError);
    throw new Error(`Failed to upload avatar: ${uploadError.message}`);
  }

  // Get the public URL for the uploaded file
  // This URL can be used in <img src="..." /> tags
  const { data: urlData } = supabase.storage
    .from("avatars")
    .getPublicUrl(fileName);

  const avatarUrl = urlData.publicUrl;

  // Update the profile with the new avatar URL
  // This saves the URL in the database so we can access it later
  const updatedProfile = await updateProfile(userId, {
    avatar_url: avatarUrl,
  });

  return updatedProfile;
};

/**
 * DELETE AVATAR
 * Removes the user's avatar from storage and database
 *
 * @param userId - The UUID of the user
 * @returns Updated profile with avatar_url = null
 * @throws Error if deletion fails
 */

export const deleteAvatar = async (userId: string): Promise<Profile> => {
  const supabase = createClient();

  // First, get the current avatar_url to extract the file path
  const profile = await getProfile(userId);

  // If no avatar to delete, just return profile
  if (!profile.avatar_url) {
    return profile;
  }

  // Extract filename from URL
  // URL format: https://xxx.supabase.co/storage/v1/object/public/avatars/{userId}/avatar-xxx.jpg
  // We need to get: {userId}/avatar-xxx.jpg
  const urlParts = profile.avatar_url.split("/avatars/");
  if (urlParts.length < 2) {
    throw new Error("Invalid avatar URL");
  }
  const filePath = urlParts[1];

  // Delete the file from storage
  const { error: deleteError } = await supabase.storage
    .from("avatars")
    .remove([filePath]);

  if (deleteError) {
    console.error("Error deleting avatar:", deleteError);
    // Don't throw - we'll still update the profile to remove the URL
  }

  // Update profile to remove avatar_url
  const updatedProfile = await updateProfile(userId, {
    avatar_url: null,
  });

  return updatedProfile;
};
