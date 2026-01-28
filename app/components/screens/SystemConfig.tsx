import { useState } from "react";
import {
  ArrowLeft,
  Bell,
  Lock,
  Palette,
  Globe,
  Code,
  Database,
  Shield,
  Terminal,
} from "lucide-react";

interface SystemConfigProps {
  onNavigate: (screen: string) => void;
}

const SystemConfig = ({ onNavigate }: SystemConfigProps) => {
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  const settingsSections = [
    {
      title: "PREFERENCES",
      icon: Palette,
      settings: [
        {
          id: "theme",
          label: "Color Theme",
          value: "Terminal Black",
          type: "select" as const,
          options: ["Terminal Black", "Matrix Green", "Cyber Blue"],
        },
        {
          id: "font",
          label: "Monospace Font",
          value: "IBM Plex Mono",
          type: "select" as const,
          options: ["IBM Plex Mono", "JetBrains Mono", "Fira Code"],
        },
        {
          id: "fontSize",
          label: "Font Size",
          value: "14px",
          type: "select" as const,
          options: ["12px", "14px", "16px", "18px"],
        },
      ],
    },
    {
      title: "NOTIFICATIONS",
      icon: Bell,
      settings: [
        {
          id: "emailNotif",
          label: "Email Notifications",
          value: notifications,
          type: "toggle" as const,
        },
        {
          id: "pushNotif",
          label: "Push Notifications",
          value: true,
          type: "toggle" as const,
        },
        {
          id: "soundEffects",
          label: "Sound Effects",
          value: true,
          type: "toggle" as const,
        },
      ],
    },
    {
      title: "SECURITY",
      icon: Shield,
      settings: [
        {
          id: "2fa",
          label: "Two-Factor Auth",
          value: twoFactor,
          type: "toggle" as const,
        },
        {
          id: "sessionTimeout",
          label: "Session Timeout",
          value: "30 minutes",
          type: "select" as const,
          options: ["15 minutes", "30 minutes", "1 hour", "Never"],
        },
        {
          id: "loginHistory",
          label: "Login History",
          value: "View",
          type: "button" as const,
        },
      ],
    },
    {
      title: "DEVELOPER",
      icon: Code,
      settings: [
        {
          id: "autoSave",
          label: "Auto Save",
          value: autoSave,
          type: "toggle" as const,
        },
        {
          id: "debugMode",
          label: "Debug Mode",
          value: false,
          type: "toggle" as const,
        },
        {
          id: "apiKey",
          label: "API Key",
          value: "Manage",
          type: "button" as const,
        },
      ],
    },
  ];

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
                  SYSTEM_CONFIG
                </h1>
                <p
                  className="text-xs text-muted-foreground"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  CORE_SETTINGS_v0.2.0
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 px-3 py-1 bg-secondary border border-border/30 rounded-sm">
              <Terminal className="w-4 h-4 text-primary" />
              <span
                className="text-muted-foreground text-xs"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
              >
                CONFIG MODE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-8 py-8 h-[calc(100vh-80px)] overflow-y-auto">
        <div className="space-y-6">
          {settingsSections.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.title}
                className="terminal-glass-strong rounded-sm border border-border/30 overflow-hidden"
              >
                {/* Section header */}
                <div className="px-6 py-4 bg-secondary border-b border-border/30 flex items-center space-x-3">
                  <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  <h2
                    className="text-sm text-foreground"
                    style={{ fontFamily: "IBM Plex Mono, monospace" }}
                  >
                    {section.title}
                  </h2>
                </div>

                {/* Settings list */}
                <div className="p-6 space-y-4">
                  {section.settings.map((setting) => (
                    <div
                      key={setting.id}
                      className="flex items-center justify-between py-3 border-b border-border/20 last:border-0"
                    >
                      <div className="flex-1">
                        <label className="text-sm text-foreground block mb-1">
                          {setting.label}
                        </label>
                        {setting.type !== "toggle" &&
                          setting.type !== "button" && (
                            <p
                              className="text-xs text-muted-foreground"
                              style={{ fontFamily: "IBM Plex Mono, monospace" }}
                            >
                              Current: {String(setting.value)}
                            </p>
                          )}
                      </div>

                      <div className="ml-4">
                        {setting.type === "toggle" && (
                          <button
                            onClick={() => {
                              if (setting.id === "emailNotif")
                                setNotifications(!notifications);
                              if (setting.id === "2fa")
                                setTwoFactor(!twoFactor);
                              if (setting.id === "autoSave")
                                setAutoSave(!autoSave);
                            }}
                            className={`relative w-12 h-6 rounded-sm transition-colors ${
                              setting.value
                                ? "bg-primary"
                                : "bg-muted-foreground"
                            }`}
                          >
                            <div
                              className={`absolute top-1 w-4 h-4 bg-primary-foreground rounded-sm transition-transform ${
                                setting.value ? "left-7" : "left-1"
                              }`}
                            />
                          </button>
                        )}

                        {setting.type === "select" && (
                          <select
                            className="px-4 py-2 bg-secondary border border-border/30 rounded-sm text-foreground text-sm focus:outline-none focus:border-primary"
                            style={{ fontFamily: "IBM Plex Mono, monospace" }}
                            defaultValue={String(setting.value)}
                          >
                            {setting.options?.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        )}

                        {setting.type === "button" && (
                          <button
                            className="px-4 py-2 bg-secondary border border-border/30 rounded-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all text-sm"
                            style={{ fontFamily: "IBM Plex Mono, monospace" }}
                          >
                            {String(setting.value)}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Danger zone */}
          <div className="terminal-glass-strong rounded-sm border border-destructive/30 overflow-hidden">
            <div className="px-6 py-4 bg-secondary border-b border-destructive/30 flex items-center space-x-3">
              <Lock className="w-5 h-5 text-destructive" strokeWidth={1.5} />
              <h2
                className="text-sm text-destructive"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
              >
                DANGER_ZONE
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between py-3">
                <div>
                  <label className="text-sm text-foreground block mb-1">
                    Reset All Settings
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Restore all settings to factory defaults
                  </p>
                </div>
                <button
                  className="px-4 py-2 bg-transparent border border-destructive text-destructive rounded-sm hover:bg-destructive hover:text-destructive-foreground transition-all text-sm"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  Reset
                </button>
              </div>

              <div className="flex items-center justify-between py-3 border-t border-border/20">
                <div>
                  <label className="text-sm text-foreground block mb-1">
                    Delete Account
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Permanently delete your account and all data
                  </p>
                </div>
                <button
                  className="px-4 py-2 bg-transparent border border-destructive text-destructive rounded-sm hover:bg-destructive hover:text-destructive-foreground transition-all text-sm"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          {/* System info footer */}
          <div className="terminal-glass-strong p-6 rounded-sm border border-border/30">
            <div
              className="grid md:grid-cols-3 gap-4 text-sm"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              <div>
                <div className="text-muted-foreground mb-1">Version</div>
                <div className="text-foreground">v0.2.0</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Build</div>
                <div className="text-foreground">20251119.1337</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Environment</div>
                <div className="text-foreground">Production</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border/30">
              <p className="text-xs text-muted-foreground">
                // "Programs must be written for people to read, and only
                incidentally for machines to execute." — Harold Abelson
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemConfig;
