export const CarbonFiber = ({
  className = "",
  opacity = 0.4,
}: {
  className?: string;
  opacity?: number;
}) => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ opacity }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="carbon-fiber"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            {/* Carbon fiber weave pattern */}
            <rect width="20" height="20" fill="#0A0A0A" />
            <path
              d="M0,10 Q5,8 10,10 T20,10"
              fill="none"
              stroke="#1A1A1A"
              strokeWidth="2"
            />
            <path
              d="M0,10 Q5,12 10,10 T20,10"
              fill="none"
              stroke="#0A0A0A"
              strokeWidth="1"
            />
            <path
              d="M10,0 Q8,5 10,10 T10,20"
              fill="none"
              stroke="#1A1A1A"
              strokeWidth="2"
            />
            <path
              d="M10,0 Q12,5 10,10 T10,20"
              fill="none"
              stroke="#0A0A0A"
              strokeWidth="1"
            />
          </pattern>

          <radialGradient id="carbon-shine">
            <stop offset="0%" stopColor="#262626" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0A0A0A" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="100%" height="100%" fill="url(#carbon-fiber)" />
        <rect width="100%" height="100%" fill="url(#carbon-shine)" />
      </svg>
    </div>
  );
};

export const HexPattern = ({
  className = "",
  opacity = 0.2,
}: {
  className?: string;
  opacity?: number;
}) => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ opacity }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="hex-pattern"
            x="0"
            y="0"
            width="60"
            height="52"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M30,0 L50,15 L50,35 L30,50 L10,35 L10,15 Z"
              fill="none"
              stroke="#525252"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#hex-pattern)" />
      </svg>
    </div>
  );
};

