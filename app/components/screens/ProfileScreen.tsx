"use client";

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
} from "lucide-react";
import { useState, FormEvent } from "react";

interface ProfileScreenProps {
  onNavigate: (screen: string) => void;
}

interface Stat {
  label: string;
  value: string;
}

interface ActivityItem {
  action: string;
  repo: string;
  time: string;
}

interface ProfileData {
  name: string;
  handle: string;
  bio: string;
  email: string;
  location: string;
  role: string;
}

const ProfileScreen = ({ onNavigate }: ProfileScreenProps) => {
  // --- EDIT MODE FLAG ---
  const [isEditing, setIsEditing] = useState(false);

  // --- PROFILE STATE ---
  const [profile, setProfile] = useState<ProfileData>({
    name: "Alex Developer",
    handle: "@alexdev",
    bio: "Full-stack developer. Open source enthusiast. Coffee-driven code machine.",
    email: "alex@nexushub.dev",
    location: "San Francisco, CA",
    role: "Full Stack Engineer",
  });

  // --- STATS STATE ---
  const [stats, setStats] = useState<Stat[]>([
    { label: "Projects", value: "47" },
    { label: "Commits", value: "2.3K" },
    { label: "Stars", value: "892" },
    { label: "Followers", value: "1.2K" },
  ]);

  // --- SKILLS STATE ---
  const [skills, setSkills] = useState<string[]>([
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "Rust",
    "Go",
    "Docker",
    "Kubernetes",
    "AWS",
    "PostgreSQL",
    "Redis",
    "GraphQL",
  ]);
  const [newSkill, setNewSkill] = useState("");

  // --- ACTIVITIES STATE ---
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      action: "Pushed to main branch",
      repo: "nexus-core",
      time: "2 hours ago",
    },
    { action: "Opened pull request", repo: "ai-module", time: "5 hours ago" },
    {
      action: "Created new repository",
      repo: "terminal-ui",
      time: "1 day ago",
    },
    {
      action: "Starred repository",
      repo: "awesome-dev-tools",
      time: "2 days ago",
    },
  ]);
  const [newActivity, setNewActivity] = useState<ActivityItem>({
    action: "",
    repo: "",
    time: "",
  });

  // --- HANDLERS ---

  const toggleEdit = () => {
    // later you can call your backend save here when going from edit -> view
    setIsEditing((prev) => !prev);
  };

  const handleProfileChange = (field: keyof ProfileData, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleStatChange = (
    index: number,
    field: keyof Stat,
    value: string
  ) => {
    setStats((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemoveStat = (index: number) => {
    setStats((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddStat = () => {
    setStats((prev) => [...prev, { label: "New Stat", value: "0" }]);
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

  const handleActivityChange = (
    index: number,
    field: keyof ActivityItem,
    value: string
  ) => {
    setActivities((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemoveActivity = (index: number) => {
    setActivities((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddActivity = (e: FormEvent) => {
    e.preventDefault();
    if (!newActivity.action.trim() || !newActivity.repo.trim()) return;
    setActivities((prev) => [...prev, newActivity]);
    setNewActivity({ action: "", repo: "", time: "" });
  };

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden">
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
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-sm hover:bg-destructive transition-all"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              <Edit className="w-4 h-4" />
              <span>{isEditing ? "Save Changes" : "Edit Profile"}</span>
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
              <div className="w-24 h-24 mx-auto mb-4 bg-secondary border-2 border-primary rounded-sm flex items-center justify-center">
                <User className="w-12 h-12 text-primary" strokeWidth={1.5} />
              </div>

              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) =>
                      handleProfileChange("name", e.target.value)
                    }
                    className="w-full mb-2 bg-input border border-border/40 rounded-sm px-3 py-2 text-foreground text-center text-lg"
                    style={{ fontFamily: "IBM Plex Mono, monospace" }}
                  />
                  <input
                    type="text"
                    value={profile.handle}
                    onChange={(e) =>
                      handleProfileChange("handle", e.target.value)
                    }
                    className="w-full mb-4 bg-input border border-border/40 rounded-sm px-3 py-1 text-muted-foreground text-center text-sm"
                    style={{ fontFamily: "IBM Plex Mono, monospace" }}
                  />
                </>
              ) : (
                <>
                  <h2 className="text-2xl text-foreground mb-1">
                    {profile.name}
                  </h2>
                  <p
                    className="text-sm text-muted-foreground mb-4"
                    style={{ fontFamily: "IBM Plex Mono, monospace" }}
                  >
                    {profile.handle}
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
                  className="w-full bg-input border border-border/40 rounded-sm px-3 py-2 text-sm text-muted-foreground leading-relaxed"
                  rows={3}
                />
              ) : (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {profile.bio}
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
                      className="flex-1 bg-input border border-border/40 rounded-sm px-2 py-1 text-muted-foreground"
                    />
                  ) : (
                    <span className="text-muted-foreground">
                      {profile.email}
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
                      className="flex-1 bg-input border border-border/40 rounded-sm px-2 py-1 text-muted-foreground"
                    />
                  ) : (
                    <span className="text-muted-foreground">
                      {profile.location}
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
                      className="flex-1 bg-input border border-border/40 rounded-sm px-2 py-1 text-muted-foreground"
                    />
                  ) : (
                    <span className="text-muted-foreground">
                      {profile.role}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Social links (keep static for now) */}
            <div className="terminal-glass-strong p-6 rounded-sm border border-border/30">
              <h3
                className="text-sm text-foreground mb-4"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
              >
                SOCIAL_LINKS
              </h3>
              <div className="space-y-2">
                <a
                  href="#"
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
                <a
                  href="#"
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
                <a
                  href="#"
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
              </div>
            </div>
          </div>

          {/* Right content - Stats and activity */}
          <div className="md:col-span-2 space-y-6">
            {/* Stats grid */}
            <div className="terminal-glass-strong p-4 rounded-sm border border-border/30">
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="text-sm text-foreground"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  METRICS
                </h3>
                {isEditing && (
                  <button
                    onClick={handleAddStat}
                    className="flex items-center space-x-1 text-xs px-2 py-1 bg-secondary border border-border/40 rounded-sm text-muted-foreground hover:border-primary/60 hover:text-foreground transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Stat</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div
                    key={stat.label + index}
                    className="terminal-glass p-4 rounded-sm border border-border/20 text-center relative"
                  >
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveStat(index)}
                        className="absolute top-2 right-2 p-1 rounded-sm hover:bg-secondary"
                      >
                        <X className="w-3 h-3 text-muted-foreground" />
                      </button>
                    )}

                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          value={stat.value}
                          onChange={(e) =>
                            handleStatChange(index, "value", e.target.value)
                          }
                          className="w-full text-center mb-2 bg-input border border-border/40 rounded-sm px-2 py-1 text-foreground text-lg"
                          style={{ fontFamily: "IBM Plex Mono, monospace" }}
                        />
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) =>
                            handleStatChange(index, "label", e.target.value)
                          }
                          className="w-full text-center bg-input border border-border/40 rounded-sm px-2 py-1 text-xs text-muted-foreground"
                        />
                      </>
                    ) : (
                      <>
                        <div
                          className="text-3xl text-foreground mb-2"
                          style={{ fontFamily: "IBM Plex Mono, monospace" }}
                        >
                          {stat.value}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {stat.label}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="terminal-glass-strong p-6 rounded-sm border border-border/30">
              <h3
                className="text-lg text-foreground mb-4"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
              >
                TECH_STACK
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {skills.map((skill) => (
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
                ))}
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

            {/* Recent activity */}
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
                {activities.map((activity, i) => (
                  <div
                    key={i}
                    className="flex items-start space-x-4 pb-4 border-b border-border/20 last:border-0 last:pb-0"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    <div className="flex-1">
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            value={activity.action}
                            onChange={(e) =>
                              handleActivityChange(i, "action", e.target.value)
                            }
                            className="w-full mb-2 bg-input border border-border/40 rounded-sm px-2 py-1 text-sm text-foreground"
                          />
                          <div className="flex items-center space-x-2 text-xs mb-1">
                            <input
                              type="text"
                              value={activity.repo}
                              onChange={(e) =>
                                handleActivityChange(i, "repo", e.target.value)
                              }
                              className="px-2 py-1 bg-input border border-border/40 rounded-sm text-muted-foreground flex-1"
                              style={{
                                fontFamily: "IBM Plex Mono, monospace",
                              }}
                            />
                            <input
                              type="text"
                              value={activity.time}
                              onChange={(e) =>
                                handleActivityChange(i, "time", e.target.value)
                              }
                              className="px-2 py-1 bg-input border border-border/40 rounded-sm text-muted-foreground flex-1"
                              style={{
                                fontFamily: "IBM Plex Mono, monospace",
                              }}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="text-sm text-foreground mb-1">
                            {activity.action}
                          </p>
                          <div className="flex items-center space-x-2 text-xs">
                            <span
                              className="px-2 py-0.5 bg-secondary border border-border/30 rounded-sm text-muted-foreground"
                              style={{
                                fontFamily: "IBM Plex Mono, monospace",
                              }}
                            >
                              {activity.repo}
                            </span>
                            <span
                              className="text-muted-foreground"
                              style={{
                                fontFamily: "IBM Plex Mono, monospace",
                              }}
                            >
                              {activity.time}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    {isEditing && (
                      <button
                        onClick={() => handleRemoveActivity(i)}
                        className="mt-1 p-1 rounded-sm hover:bg-secondary"
                      >
                        <X className="w-3 h-3 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {isEditing && (
                <form
                  onSubmit={handleAddActivity}
                  className="mt-4 space-y-2 border-t border-border/30 pt-4"
                >
                  <p
                    className="text-xs text-muted-foreground"
                    style={{ fontFamily: "IBM Plex Mono, monospace" }}
                  >
                    ADD_ACTIVITY
                  </p>
                  <input
                    type="text"
                    placeholder="Action"
                    value={newActivity.action}
                    onChange={(e) =>
                      setNewActivity((prev) => ({
                        ...prev,
                        action: e.target.value,
                      }))
                    }
                    className="w-full bg-input border border-border/40 rounded-sm px-3 py-2 text-sm text-muted-foreground"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Repository"
                      value={newActivity.repo}
                      onChange={(e) =>
                        setNewActivity((prev) => ({
                          ...prev,
                          repo: e.target.value,
                        }))
                      }
                      className="flex-1 bg-input border border-border/40 rounded-sm px-3 py-2 text-sm text-muted-foreground"
                    />
                    <input
                      type="text"
                      placeholder="Time"
                      value={newActivity.time}
                      onChange={(e) =>
                        setNewActivity((prev) => ({
                          ...prev,
                          time: e.target.value,
                        }))
                      }
                      className="flex-1 bg-input border border-border/40 rounded-sm px-3 py-2 text-sm text-muted-foreground"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1 px-3 py-2 bg-primary text-xs text-primary-foreground rounded-sm hover:bg-destructive transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Activity</span>
                  </button>
                </form>
              )}
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
