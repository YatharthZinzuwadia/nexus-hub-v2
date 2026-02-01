"use client";

import { getProfile, updateProfile, uploadAvatar } from "@/lib/api/profile";
import {
  getProfileStats,
  getRecentActivity,
  type ProfileStats,
  type RecentActivity,
} from "@/lib/api/profile-stats";
import { useAuthStore } from "@/lib/store/auth-store";
import {
  ArrowLeft,
  Code,
  Edit,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Shield,
  Twitter,
  User,
  Activity,
  X,
  Plus,
  Upload,
} from "lucide-react";
import { useState, FormEvent, useEffect, useRef } from "react";

interface ProfileScreenProps {
  onNavigate: (screen: string) => void;
}

interface ProfileData {
  name: string;
  handle: string;
  bio: string;
  email: string;
  location: string;
  role: string;
  github_url: string;
  linkedin_url: string;
  twitter_url: string;
  avatar_url: string | null;
}

const ProfileScreen = ({ onNavigate }: ProfileScreenProps) => {
  // --- GET CURRENT USER ---
  const { user } = useAuthStore();

  // --- LOADING & ERROR STATES ---
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // --- EDIT MODE FLAG ---
  const [isEditing, setIsEditing] = useState(false);

  // --- FILE INPUT REF ---
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- PROFILE STATE ---
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    handle: "",
    bio: "",
    email: "",
    location: "",
    role: "",
    github_url: "",
    linkedin_url: "",
    twitter_url: "",
    avatar_url: null,
  });

  // --- STATS STATE (from database) ---
  const [stats, setStats] = useState<ProfileStats>({
    totalProjects: 0,
    activeProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    totalFiles: 0,
    totalStars: 0,
  });

  // --- SKILLS STATE (from database) ---
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  // --- ACTIVITIES STATE (from database) ---
  const [activities, setActivities] = useState<RecentActivity[]>([]);

  // --- FETCH ALL DATA ON COMPONENT LOAD ---
  useEffect(() => {
    const fetchAllData = async () => {
      if (!user?.id) {
        setError("No user logged in");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch profile, stats, and activities in parallel
        const [profileData, statsData, activitiesData] = await Promise.all([
          getProfile(user.id),
          getProfileStats(user.id),
          getRecentActivity(user.id, 5),
        ]);

        // Update profile state
        setProfile({
          name: profileData.name || "",
          handle: profileData.handle || "",
          bio: profileData.bio || "",
          email: profileData.email || "",
          location: profileData.location || "",
          role: profileData.role || "",
          github_url: profileData.github_url || "",
          linkedin_url: profileData.linkedin_url || "",
          twitter_url: profileData.twitter_url || "",
          avatar_url: profileData.avatar_url,
        });

        // Update skills (from JSONB array in database)
        setSkills(profileData.skills || []);

        // Update stats
        setStats(statsData);

        // Update activities
        setActivities(activitiesData);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [user?.id]);

  // --- HANDLERS ---

  const toggleEdit = async () => {
    // If currently editing, SAVE changes to database
    if (isEditing) {
      if (!user?.id) {
        setError("No user logged in");
        return;
      }

      try {
        setIsSaving(true);
        setError(null);

        // Save profile with ALL fields including social links and skills
        await updateProfile(user.id, {
          name: profile.name,
          handle: profile.handle,
          bio: profile.bio,
          email: profile.email,
          location: profile.location,
          role: profile.role,
          github_url: profile.github_url,
          linkedin_url: profile.linkedin_url,
          twitter_url: profile.twitter_url,
          skills: skills, // Save skills array
        });

        console.log("Profile saved successfully!");
      } catch (err) {
        console.error("Error saving profile:", err);
        setError(err instanceof Error ? err.message : "Failed to save profile");
        return; // Don't exit edit mode on error
      } finally {
        setIsSaving(false);
      }
    }

    // Toggle edit mode
    setIsEditing((prev) => !prev);
  };

  const handleProfileChange = (field: keyof ProfileData, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSkill = (e: FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    setSkills((prev) => [...prev, newSkill.trim()]);
    setNewSkill("");
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    try {
      setIsUploadingAvatar(true);
      setError(null);

      const updatedProfile = await uploadAvatar(user.id, file);
      setProfile((prev) => ({
        ...prev,
        avatar_url: updatedProfile.avatar_url,
      }));

      console.log("Avatar uploaded successfully!");
    } catch (err) {
      console.error("Error uploading avatar:", err);
      setError(err instanceof Error ? err.message : "Failed to upload avatar");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden">
      {/* LOADING STATE */}
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="terminal-glass-strong p-8 rounded-sm border border-border/30">
            <p className="text-sm text-muted-foreground font-mono">
              LOADING_PROFILE...
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

      {/* Grid pattern background */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Header */}
      <div className="relative z-10 border-b border-border/30 bg-background/80 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate("dashboard")}
                className="p-2 hover:bg-secondary rounded-sm transition-colors"
              >
                <ArrowLeft
                  className="w-5 h-5 text-muted-foreground"
                  strokeWidth={1.5}
                />
              </button>
              <div>
                <h1
                  className="text-xl text-foreground"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  USER_PROFILE
                </h1>
                <p
                  className="text-xs text-muted-foreground"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  DEVELOPER_CREDENTIALS
                </p>
              </div>
            </div>

            <button
              onClick={toggleEdit}
              disabled={isSaving}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-sm hover:bg-destructive transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              <Edit className="w-4 h-4" />
              <span>
                {isEditing
                  ? isSaving
                    ? "Saving..."
                    : "Save Changes"
                  : "Edit Profile"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-8 py-8 h-[calc(100vh-80px)] overflow-y-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left sidebar - Profile card */}
          <div className="space-y-6">
            {/* Avatar and basic info */}
            <div className="terminal-glass-strong p-6 rounded-sm border border-border/30 text-center">
              {/* Avatar */}
              <div className="relative w-24 h-24 mx-auto mb-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                <div
                  onClick={handleAvatarClick}
                  className={`w-full h-full bg-secondary border-2 border-primary rounded-sm flex items-center justify-center overflow-hidden ${isEditing ? "cursor-pointer hover:border-destructive transition-colors" : ""}`}
                >
                  {isUploadingAvatar ? (
                    <p className="text-xs text-muted-foreground">
                      Uploading...
                    </p>
                  ) : profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User
                      className="w-12 h-12 text-primary"
                      strokeWidth={1.5}
                    />
                  )}
                </div>
                {isEditing && (
                  <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1">
                    <Upload className="w-3 h-3" />
                  </div>
                )}
              </div>

              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) =>
                      handleProfileChange("name", e.target.value)
                    }
                    placeholder="Your Name"
                    className="w-full mb-2 bg-input border border-border/40 rounded-sm px-3 py-2 text-foreground text-center text-lg"
                    style={{ fontFamily: "IBM Plex Mono, monospace" }}
                  />
                  <input
                    type="text"
                    value={profile.handle}
                    onChange={(e) =>
                      handleProfileChange("handle", e.target.value)
                    }
                    placeholder="@handle"
                    className="w-full mb-4 bg-input border border-border/40 rounded-sm px-3 py-1 text-muted-foreground text-center text-sm"
                    style={{ fontFamily: "IBM Plex Mono, monospace" }}
                  />
                </>
              ) : (
                <>
                  <h2 className="text-2xl text-foreground mb-1">
                    {profile.name || "Anonymous User"}
                  </h2>
                  <p
                    className="text-sm text-muted-foreground mb-4"
                    style={{ fontFamily: "IBM Plex Mono, monospace" }}
                  >
                    {profile.handle || "@user"}
                  </p>
                </>
              )}

              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-secondary border border-border/30 rounded-sm mb-4">
                <Shield className="w-3 h-3 text-success" />
                <span
                  className="text-xs text-muted-foreground"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  VERIFIED
                </span>
              </div>

              {isEditing ? (
                <textarea
                  value={profile.bio}
                  onChange={(e) => handleProfileChange("bio", e.target.value)}
                  placeholder="Short bio..."
                  className="w-full bg-input border border-border/40 rounded-sm px-3 py-2 text-sm text-muted-foreground leading-relaxed"
                  rows={3}
                />
              ) : (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {profile.bio || "No bio yet."}
                </p>
              )}
            </div>

            {/* Contact info */}
            <div className="terminal-glass-strong p-6 rounded-sm border border-border/30">
              <h3
                className="text-sm text-foreground mb-4"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
              >
                CONTACT_INFO
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-primary" strokeWidth={1.5} />
                  {isEditing ? (
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        handleProfileChange("email", e.target.value)
                      }
                      placeholder="email@example.com"
                      className="flex-1 bg-input border border-border/40 rounded-sm px-2 py-1 text-muted-foreground"
                    />
                  ) : (
                    <span className="text-muted-foreground">
                      {profile.email || "No email"}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-primary" strokeWidth={1.5} />
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) =>
                        handleProfileChange("location", e.target.value)
                      }
                      placeholder="City, Country"
                      className="flex-1 bg-input border border-border/40 rounded-sm px-2 py-1 text-muted-foreground"
                    />
                  ) : (
                    <span className="text-muted-foreground">
                      {profile.location || "Location not set"}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <Code className="w-4 h-4 text-primary" strokeWidth={1.5} />
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.role}
                      onChange={(e) =>
                        handleProfileChange("role", e.target.value)
                      }
                      placeholder="Your Role"
                      className="flex-1 bg-input border border-border/40 rounded-sm px-2 py-1 text-muted-foreground"
                    />
                  ) : (
                    <span className="text-muted-foreground">
                      {profile.role || "No role set"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Social links */}
            <div className="terminal-glass-strong p-6 rounded-sm border border-border/30">
              <h3
                className="text-sm text-foreground mb-4"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
              >
                SOCIAL_LINKS
              </h3>
              <div className="space-y-2">
                {/* GitHub */}
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <Github
                      className="w-4 h-4 text-muted-foreground"
                      strokeWidth={1.5}
                    />
                    <input
                      type="url"
                      value={profile.github_url}
                      onChange={(e) =>
                        handleProfileChange("github_url", e.target.value)
                      }
                      placeholder="https://github.com/username"
                      className="flex-1 bg-input border border-border/40 rounded-sm px-2 py-1 text-xs text-muted-foreground"
                    />
                  </div>
                ) : profile.github_url ? (
                  <a
                    href={profile.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-secondary border border-border/30 rounded-sm hover:border-primary/50 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <Github
                        className="w-4 h-4 text-muted-foreground group-hover:text-foreground"
                        strokeWidth={1.5}
                      />
                      <span className="text-sm text-muted-foreground group-hover:text-foreground">
                        GitHub
                      </span>
                    </div>
                    <span
                      className="text-xs text-muted-foreground"
                      style={{ fontFamily: "IBM Plex Mono, monospace" }}
                    >
                      →
                    </span>
                  </a>
                ) : null}

                {/* LinkedIn */}
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <Linkedin
                      className="w-4 h-4 text-muted-foreground"
                      strokeWidth={1.5}
                    />
                    <input
                      type="url"
                      value={profile.linkedin_url}
                      onChange={(e) =>
                        handleProfileChange("linkedin_url", e.target.value)
                      }
                      placeholder="https://linkedin.com/in/username"
                      className="flex-1 bg-input border border-border/40 rounded-sm px-2 py-1 text-xs text-muted-foreground"
                    />
                  </div>
                ) : profile.linkedin_url ? (
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-secondary border border-border/30 rounded-sm hover:border-primary/50 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <Linkedin
                        className="w-4 h-4 text-muted-foreground group-hover:text-foreground"
                        strokeWidth={1.5}
                      />
                      <span className="text-sm text-muted-foreground group-hover:text-foreground">
                        LinkedIn
                      </span>
                    </div>
                    <span
                      className="text-xs text-muted-foreground"
                      style={{ fontFamily: "IBM Plex Mono, monospace" }}
                    >
                      →
                    </span>
                  </a>
                ) : null}

                {/* Twitter */}
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <Twitter
                      className="w-4 h-4 text-muted-foreground"
                      strokeWidth={1.5}
                    />
                    <input
                      type="url"
                      value={profile.twitter_url}
                      onChange={(e) =>
                        handleProfileChange("twitter_url", e.target.value)
                      }
                      placeholder="https://twitter.com/username"
                      className="flex-1 bg-input border border-border/40 rounded-sm px-2 py-1 text-xs text-muted-foreground"
                    />
                  </div>
                ) : profile.twitter_url ? (
                  <a
                    href={profile.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-secondary border border-border/30 rounded-sm hover:border-primary/50 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <Twitter
                        className="w-4 h-4 text-muted-foreground group-hover:text-foreground"
                        strokeWidth={1.5}
                      />
                      <span className="text-sm text-muted-foreground group-hover:text-foreground">
                        Twitter
                      </span>
                    </div>
                    <span
                      className="text-xs text-muted-foreground"
                      style={{ fontFamily: "IBM Plex Mono, monospace" }}
                    >
                      →
                    </span>
                  </a>
                ) : null}

                {isEditing &&
                  !profile.github_url &&
                  !profile.linkedin_url &&
                  !profile.twitter_url && (
                    <p className="text-xs text-muted-foreground italic">
                      Add social links above
                    </p>
                  )}
                {!isEditing &&
                  !profile.github_url &&
                  !profile.linkedin_url &&
                  !profile.twitter_url && (
                    <p className="text-xs text-muted-foreground italic p-3">
                      No social links added yet
                    </p>
                  )}
              </div>
            </div>
          </div>

          {/* Right content - Stats and activity */}
          <div className="md:col-span-2 space-y-6">
            {/* Stats grid - From DATABASE */}
            <div className="terminal-glass-strong p-4 rounded-sm border border-border/30">
              <h3
                className="text-sm text-foreground mb-4"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
              >
                METRICS
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="terminal-glass p-4 rounded-sm border border-border/20 text-center">
                  <div
                    className="text-3xl text-foreground mb-2"
                    style={{ fontFamily: "IBM Plex Mono, monospace" }}
                  >
                    {stats.totalProjects}
                  </div>
                  <div className="text-xs text-muted-foreground">Projects</div>
                </div>
                <div className="terminal-glass p-4 rounded-sm border border-border/20 text-center">
                  <div
                    className="text-3xl text-foreground mb-2"
                    style={{ fontFamily: "IBM Plex Mono, monospace" }}
                  >
                    {stats.totalTasks}
                  </div>
                  <div className="text-xs text-muted-foreground">Tasks</div>
                </div>
                <div className="terminal-glass p-4 rounded-sm border border-border/20 text-center">
                  <div
                    className="text-3xl text-foreground mb-2"
                    style={{ fontFamily: "IBM Plex Mono, monospace" }}
                  >
                    {stats.completedTasks}
                  </div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                </div>
                <div className="terminal-glass p-4 rounded-sm border border-border/20 text-center">
                  <div
                    className="text-3xl text-foreground mb-2"
                    style={{ fontFamily: "IBM Plex Mono, monospace" }}
                  >
                    {stats.totalFiles}
                  </div>
                  <div className="text-xs text-muted-foreground">Files</div>
                </div>
                <div className="terminal-glass p-4 rounded-sm border border-border/20 text-center">
                  <div
                    className="text-3xl text-foreground mb-2"
                    style={{ fontFamily: "IBM Plex Mono, monospace" }}
                  >
                    {stats.totalStars}
                  </div>
                  <div className="text-xs text-muted-foreground">Stars</div>
                </div>
                <div className="terminal-glass p-4 rounded-sm border border-border/20 text-center">
                  <div
                    className="text-3xl text-foreground mb-2"
                    style={{ fontFamily: "IBM Plex Mono, monospace" }}
                  >
                    {stats.activeProjects}
                  </div>
                  <div className="text-xs text-muted-foreground">Active</div>
                </div>
              </div>
            </div>

            {/* Skills - From DATABASE */}
            <div className="terminal-glass-strong p-6 rounded-sm border border-border/30">
              <h3
                className="text-lg text-foreground mb-4"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
              >
                TECH_STACK
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {skills.length > 0 ? (
                  skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-secondary border border-border/30 rounded-sm text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground transition-all"
                      style={{ fontFamily: "IBM Plex Mono, monospace" }}
                    >
                      {skill}
                      {isEditing && (
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-1"
                        >
                          <X className="w-3 h-3 text-muted-foreground" />
                        </button>
                      )}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No skills added yet. {isEditing ? "Add some below!" : ""}
                  </p>
                )}
              </div>

              {isEditing && (
                <form
                  onSubmit={handleAddSkill}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add new skill"
                    className="flex-1 bg-input border border-border/40 rounded-sm px-3 py-2 text-sm text-muted-foreground"
                    style={{ fontFamily: "IBM Plex Mono, monospace" }}
                  />
                  <button
                    type="submit"
                    className="flex items-center gap-1 px-3 py-2 bg-primary text-xs text-primary-foreground rounded-sm hover:bg-destructive transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add</span>
                  </button>
                </form>
              )}
            </div>

            {/* Recent activity - From DATABASE */}
            <div className="terminal-glass-strong p-6 rounded-sm border border-border/30">
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="text-lg text-foreground"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  RECENT_ACTIVITY
                </h3>
                <Activity className="w-5 h-5 text-primary" strokeWidth={1.5} />
              </div>
              <div className="space-y-4">
                {activities.length > 0 ? (
                  activities.map((activity, i) => (
                    <div
                      key={i}
                      className="flex items-start space-x-4 pb-4 border-b border-border/20 last:border-0 last:pb-0"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-foreground mb-1">
                          {activity.action}
                        </p>
                        <div className="flex items-center space-x-2 text-xs">
                          <span
                            className="px-2 py-0.5 bg-secondary border border-border/30 rounded-sm text-muted-foreground"
                            style={{ fontFamily: "IBM Plex Mono, monospace" }}
                          >
                            {activity.repo}
                          </span>
                          <span
                            className="text-muted-foreground"
                            style={{ fontFamily: "IBM Plex Mono, monospace" }}
                          >
                            {activity.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No recent activity. Start creating projects, tasks, or
                    uploading files!
                  </p>
                )}
              </div>
            </div>

            {/* Terminal-style footer */}
            <div className="terminal-glass-strong p-4 rounded-sm border border-border/30">
              <p
                className="text-xs text-muted-foreground"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
              >
                // "The best way to predict the future is to invent it." — Alan
                Kay
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
