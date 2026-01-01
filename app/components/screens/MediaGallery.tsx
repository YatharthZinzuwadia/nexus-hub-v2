import {
  ArrowLeft,
  Download,
  Grid,
  List,
  Search,
  Volume2,
  Play,
} from "lucide-react";
import { useState } from "react";

interface MediaGalleryProps {
  onNavigate: (screen: string) => void;
}

const MediaGallery = ({ onNavigate }: MediaGalleryProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [playing, setPlaying] = useState<string | null>(null);

  const soundEffects = [
    {
      id: "1",
      name: "System Boot",
      file: "boot.wav",
      duration: "2.3s",
      category: "System",
    },
    {
      id: "2",
      name: "Error Alert",
      file: "error.wav",
      duration: "1.1s",
      category: "Alert",
    },
    {
      id: "3",
      name: "Success Chime",
      file: "success.wav",
      duration: "0.8s",
      category: "Feedback",
    },
    {
      id: "4",
      name: "Notification",
      file: "notify.wav",
      duration: "1.5s",
      category: "Alert",
    },
    {
      id: "5",
      name: "Click",
      file: "click.wav",
      duration: "0.3s",
      category: "Interaction",
    },
    {
      id: "6",
      name: "Whoosh",
      file: "whoosh.wav",
      duration: "1.2s",
      category: "Transition",
    },
    {
      id: "7",
      name: "Data Transfer",
      file: "transfer.wav",
      duration: "3.4s",
      category: "Process",
    },
    {
      id: "8",
      name: "Scanning",
      file: "scan.wav",
      duration: "2.7s",
      category: "Process",
    },
  ];

  const handlePlay = (id: string) => {
    setPlaying(playing === id ? null : id);
  };

  return (
    <div className="relative w-full h-screen bg-[#000000] overflow-hidden">
      {/* Grid pattern background */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Header */}
      <div className="relative z-10 border-b border-[#525252]/30 bg-[#0A0A0A]/80 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate("dashboard")}
                className="p-2 hover:bg-[#1A1A1A] rounded-sm transition-colors"
              >
                <ArrowLeft
                  className="w-5 h-5 text-[#A3A3A3]"
                  strokeWidth={1.5}
                />
              </button>
              <div>
                <h1
                  className="text-xl text-[#FFFFFF]"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  MEDIA_GALLERY
                </h1>
                <p
                  className="text-xs text-[#525252]"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  SOUNDBOARD_MODULE
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
                <input
                  type="text"
                  placeholder="Search sounds..."
                  className="w-64 pl-10 pr-4 py-2 bg-[#0A0A0A] border border-[#525252]/30 rounded-sm text-[#E5E5E5] placeholder-[#525252] focus:outline-none focus:border-[#DC2626] text-sm"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                />
              </div>

              <div className="flex items-center space-x-1 bg-[#0A0A0A] border border-[#525252]/30 rounded-sm p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-sm transition-colors ${
                    viewMode === "grid"
                      ? "bg-[#DC2626] text-[#FFFFFF]"
                      : "text-[#A3A3A3] hover:text-[#FFFFFF]"
                  }`}
                >
                  <Grid className="w-4 h-4" strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-sm transition-colors ${
                    viewMode === "list"
                      ? "bg-[#DC2626] text-[#FFFFFF]"
                      : "text-[#A3A3A3] hover:text-[#FFFFFF]"
                  }`}
                >
                  <List className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-8 py-8 h-[calc(100vh-80px)] overflow-y-auto">
        {/* Stats bar */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="terminal-glass p-4 rounded-sm border border-[#525252]/20">
            <div
              className="text-xs text-[#A3A3A3] mb-1"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              TOTAL_SOUNDS
            </div>
            <div
              className="text-2xl text-[#FFFFFF]"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              {soundEffects.length}
            </div>
          </div>
          <div className="terminal-glass p-4 rounded-sm border border-[#525252]/20">
            <div
              className="text-xs text-[#A3A3A3] mb-1"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              CATEGORIES
            </div>
            <div
              className="text-2xl text-[#FFFFFF]"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              6
            </div>
          </div>
          <div className="terminal-glass p-4 rounded-sm border border-[#525252]/20">
            <div
              className="text-xs text-[#A3A3A3] mb-1"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              STORAGE
            </div>
            <div
              className="text-2xl text-[#FFFFFF]"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              12.4MB
            </div>
          </div>
          <div className="terminal-glass p-4 rounded-sm border border-[#525252]/20">
            <div
              className="text-xs text-[#A3A3A3] mb-1"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              FORMAT
            </div>
            <div
              className="text-2xl text-[#FFFFFF]"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              WAV
            </div>
          </div>
        </div>

        {/* Sound effects list */}
        <div className="mb-4">
          <h2
            className="text-lg text-[#FFFFFF] mb-4"
            style={{ fontFamily: "IBM Plex Mono, monospace" }}
          >
            SOUND_EFFECTS
          </h2>
        </div>

        {viewMode === "grid" ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {soundEffects.map((sound) => (
              <div
                key={sound.id}
                className="group terminal-glass p-6 rounded-sm border border-[#525252]/20 hover:border-[#DC2626]/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-[#FFFFFF] mb-1">{sound.name}</h3>
                    <p
                      className="text-xs text-[#A3A3A3]"
                      style={{ fontFamily: "IBM Plex Mono, monospace" }}
                    >
                      {sound.file}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-1 h-4 bg-[#DC2626]" />
                    <div className="w-1 h-6 bg-[#DC2626]" />
                    <div className="w-1 h-3 bg-[#525252]" />
                    <div className="w-1 h-5 bg-[#525252]" />
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span
                    className="text-xs px-2 py-1 bg-[#0A0A0A] border border-[#525252]/30 rounded-sm text-[#A3A3A3]"
                    style={{ fontFamily: "IBM Plex Mono, monospace" }}
                  >
                    {sound.category}
                  </span>
                  <span
                    className="text-xs text-[#A3A3A3]"
                    style={{ fontFamily: "IBM Plex Mono, monospace" }}
                  >
                    {sound.duration}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePlay(sound.id)}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-sm transition-all ${
                      playing === sound.id
                        ? "bg-[#DC2626] text-[#FFFFFF]"
                        : "bg-[#0A0A0A] text-[#A3A3A3] hover:text-[#FFFFFF] border border-[#525252]/30"
                    }`}
                  >
                    {playing === sound.id ? (
                      <Volume2 className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    <span
                      className="text-xs"
                      style={{ fontFamily: "IBM Plex Mono, monospace" }}
                    >
                      {playing === sound.id ? "STOP" : "PLAY"}
                    </span>
                  </button>
                  <button className="p-2 bg-[#0A0A0A] border border-[#525252]/30 rounded-sm hover:border-[#DC2626]/50 transition-colors">
                    <Download className="w-4 h-4 text-[#A3A3A3]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="terminal-glass-strong rounded-sm border border-[#525252]/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table
                className="w-full"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
              >
                <thead>
                  <tr className="border-b border-[#525252]/30 bg-[#0A0A0A]">
                    <th className="text-left px-6 py-3 text-xs text-[#A3A3A3]">
                      NAME
                    </th>
                    <th className="text-left px-6 py-3 text-xs text-[#A3A3A3]">
                      FILE
                    </th>
                    <th className="text-left px-6 py-3 text-xs text-[#A3A3A3]">
                      CATEGORY
                    </th>
                    <th className="text-left px-6 py-3 text-xs text-[#A3A3A3]">
                      DURATION
                    </th>
                    <th className="text-right px-6 py-3 text-xs text-[#A3A3A3]">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {soundEffects.map((sound, i) => (
                    <tr
                      key={sound.id}
                      className={`border-b border-[#525252]/20 hover:bg-[#0A0A0A]/50 transition-colors ${
                        i % 2 === 0 ? "" : "bg-[#0A0A0A]/20"
                      }`}
                    >
                      <td className="px-6 py-4 text-sm text-[#FFFFFF]">
                        {sound.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#A3A3A3]">
                        {sound.file}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs px-2 py-1 bg-[#0A0A0A] border border-[#525252]/30 rounded-sm text-[#A3A3A3]">
                          {sound.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#A3A3A3]">
                        {sound.duration}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handlePlay(sound.id)}
                            className={`p-2 rounded-sm transition-all ${
                              playing === sound.id
                                ? "bg-[#DC2626] text-[#FFFFFF]"
                                : "bg-[#0A0A0A] text-[#A3A3A3] hover:text-[#FFFFFF] border border-[#525252]/30"
                            }`}
                          >
                            {playing === sound.id ? (
                              <Volume2 className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </button>
                          <button className="p-2 bg-[#0A0A0A] border border-[#525252]/30 rounded-sm hover:border-[#DC2626]/50 transition-colors">
                            <Download className="w-4 h-4 text-[#A3A3A3]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaGallery;
