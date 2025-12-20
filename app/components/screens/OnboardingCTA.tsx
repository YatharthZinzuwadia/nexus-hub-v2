import { ArrowRight, Coffee, Github, Rocket } from "lucide-react";

interface OnboardingCTAProps {
  onSignIn: () => void;
}

const OnboardingCTA = ({ onSignIn }: OnboardingCTAProps) => {
  return (
    <div className="relative w-full min-h-screen bg-[#000000] flex items-center justify-center py-6">
      {/* Grid pattern background */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Animated corner accents */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#DC2626] opacity-5 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#DC2626] opacity-5 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl w-full px-8 text-center">
        {/* Status indicator */}
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-[#0A0A0A] border border-[#525252]/30 rounded-sm mb-8">
          <Rocket className="w-4 h-4 text-[#DC2626]" />
          <span
            className="text-[#A3A3A3] text-sm"
            style={{ fontFamily: "IBM Plex Mono, monospace" }}
          >
            READY FOR DEPLOYMENT
          </span>
        </div>

        {/* Main heading */}
        <h1 className="text-6xl md:text-7xl tracking-tight text-[#FFFFFF] mb-6 leading-[1.1]">
          Your Journey
          <br />
          <span className="text-[#DC2626]">Begins Here</span>
        </h1>

        <p className="text-[#A3A3A3] text-xl leading-relaxed max-w-2xl mx-auto mb-12">
          Join the developers who&apos;ve traded bloated dashboards for
          something truly exceptional. No marketing speak, just honest
          engineering.
        </p>

        {/* CTA Button */}
        <button
          onClick={onSignIn}
          className="group inline-flex items-center space-x-3 px-8 py-4 bg-[#DC2626] text-[#FFFFFF] rounded-sm hover:bg-[#EF4444] transition-all duration-200 border border-[#DC2626] mb-12"
          style={{ fontFamily: "IBM Plex Mono, monospace" }}
        >
          <span className="text-lg">Initialize Session</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Social proof / Stats */}
        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="terminal-glass p-6 rounded-sm border border-[#525252]/20">
            <Github
              className="w-8 h-8 text-[#DC2626] mb-3 mx-auto"
              strokeWidth={1.5}
            />
            <div
              className="text-3xl text-[#FFFFFF] mb-2"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              10K+
            </div>
            <div className="text-sm text-[#A3A3A3]">Stars on GitHub</div>
            <div
              className="text-xs text-[#525252] mt-2"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              Open source ftw
            </div>
          </div>

          <div className="terminal-glass p-6 rounded-sm border border-[#525252]/20">
            <Coffee
              className="w-8 h-8 text-[#DC2626] mb-3 mx-auto"
              strokeWidth={1.5}
            />
            <div
              className="text-3xl text-[#FFFFFF] mb-2"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              ∞
            </div>
            <div className="text-sm text-[#A3A3A3]">Cups of Coffee</div>
            <div
              className="text-xs text-[#525252] mt-2"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              Fuel for innovation
            </div>
          </div>

          <div className="terminal-glass p-6 rounded-sm border border-[#525252]/20">
            <Rocket
              className="w-8 h-8 text-[#DC2626] mb-3 mx-auto"
              strokeWidth={1.5}
            />
            <div
              className="text-3xl text-[#FFFFFF] mb-2"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              24/7
            </div>
            <div className="text-sm text-[#A3A3A3]">Always Shipping</div>
            <div
              className="text-xs text-[#525252] mt-2"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              Move fast, build things
            </div>
          </div>
        </div>

        {/* Terminal-style footer quote */}
        <div className="mt-12 terminal-glass-strong rounded-sm overflow-hidden border border-[#525252]/30 max-w-2xl mx-auto">
          <div
            className="p-6 text-left"
            style={{ fontFamily: "IBM Plex Mono, monospace" }}
          >
            <div className="text-[#737373] text-sm mb-2">
              <span className="text-[#DC2626]">$</span> fortune
            </div>
            <div className="text-[#E5E5E5] text-sm pl-4 border-l-2 border-[#DC2626] ml-2">
              &quot;Talk is cheap. Show me the code.&quot;
              <div className="text-[#A3A3A3] text-xs mt-2">
                — Linus Torvalds
              </div>
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center space-x-2 mt-12">
          <div className="w-8 h-1 bg-[#525252]/30" />
          <div className="w-8 h-1 bg-[#525252]/30" />
          <div className="w-8 h-1 bg-[#DC2626]" />
        </div>
      </div>
    </div>
  );
};

export default OnboardingCTA;
