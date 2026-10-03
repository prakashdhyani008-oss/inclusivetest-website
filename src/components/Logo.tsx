import React from 'react';

interface LogoProps {
  variant?: 'horizontal' | 'stacked' | 'mark' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTagline?: boolean;
}

export const LogoIcon: React.FC<{ size?: number; className?: string }> = ({ size = 40, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`flex-shrink-0 ${className}`}
      aria-hidden="true"
      role="img"
    >
      <defs>
        {/* Blue Circular Gradient */}
        <linearGradient id="logoBlueGrad" x1="20" y1="20" x2="100" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>

        {/* Green Circular Gradient */}
        <linearGradient id="logoGreenGrad" x1="120" y1="20" x2="180" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>

        {/* Orange Upward Arrow Gradient */}
        <linearGradient id="logoOrangeGrad" x1="100" y1="170" x2="160" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>

        {/* Center Human Figure Blue */}
        <linearGradient id="logoCenterBlue" x1="70" y1="50" x2="110" y2="140" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
      </defs>

      {/* Decorative Outer Accents */}
      {/* Top Green Triangle Accent */}
      <polygon points="52,38 65,30 65,46" fill="#86efac" />
      {/* Top Green Dot */}
      <circle cx="102" cy="18" r="7" fill="#4ade80" />
      {/* Top-Right Green Pill */}
      <rect x="136" y="28" width="22" height="15" rx="7.5" fill="#86efac" />
      <circle cx="147" cy="35.5" r="4" fill="#ffffff" />
      {/* Right Orange Dot */}
      <circle cx="166" cy="74" r="8" fill="#fb923c" />
      {/* Left Orange Dot */}
      <circle cx="34" cy="74" r="8" fill="#fb923c" />
      {/* Bottom-Left Cyan Exclamation Mark Accent */}
      <rect x="47" y="103" width="7" height="13" rx="3.5" fill="#38bdf8" />
      <circle cx="50.5" cy="123" r="3.5" fill="#38bdf8" />
      {/* Bottom-Right Cyan Dot */}
      <circle cx="152" cy="115" r="7" fill="#38bdf8" />

      {/* Outer Segmented Circular Ring */}
      {/* Left & Bottom-Left Blue Segment */}
      <path
        d="M 100 24 A 76 76 0 0 0 100 176"
        stroke="url(#logoBlueGrad)"
        strokeWidth="20"
        strokeLinecap="round"
      />

      {/* Top-Right Green Segment */}
      <path
        d="M 104 24 A 76 76 0 0 1 176 100"
        stroke="url(#logoGreenGrad)"
        strokeWidth="20"
        strokeLinecap="round"
      />

      {/* Top Ring Blue Node Connector */}
      <circle cx="78" cy="33" r="17" fill="#0284c7" />
      <circle cx="78" cy="33" r="10" fill="#38bdf8" />

      {/* Bottom-Right Curved Orange Arrow Segment */}
      <path
        d="M 102 166 A 70 70 0 0 0 156 102"
        stroke="url(#logoOrangeGrad)"
        strokeWidth="17"
        strokeLinecap="round"
      />
      {/* Arrowhead pointing upward */}
      <polygon
        points="156,80 141,107 169,105"
        fill="#ea580c"
      />

      {/* Braille / Digital Accessibility Matrix Dots (Top-Right Inner) */}
      <g fill="#4ade80" opacity="0.9">
        <rect x="118" y="52" width="5" height="5" rx="1.5" />
        <rect x="127" y="52" width="5" height="5" rx="1.5" />
        <rect x="136" y="52" width="5" height="5" rx="1.5" />
        <rect x="118" y="61" width="5" height="5" rx="1.5" />
        <rect x="127" y="61" width="5" height="5" rx="1.5" />
        <rect x="136" y="61" width="5" height="5" rx="1.5" />
      </g>

      {/* Central Modern Wheelchair Accessibility Human Figure */}
      {/* Head */}
      <circle cx="98" cy="52" r="7" fill="url(#logoCenterBlue)" />

      {/* Torso & Arms - Angled dynamically forward */}
      <path
        d="M 98 62 L 95 82 L 110 82"
        stroke="url(#logoCenterBlue)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Legs & Footrest */}
      <path
        d="M 95 82 L 108 97 L 122 93"
        stroke="url(#logoCenterBlue)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Large Wheel Arc */}
      <path
        d="M 106 72 A 26 26 0 1 0 114 108"
        stroke="url(#logoCenterBlue)"
        strokeWidth="8"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className = '',
  showTagline = true,
}) => {
  // Dimensions map
  const sizeConfig = {
    sm: { icon: 32, title: 'text-lg', tag: 'text-[9px]' },
    md: { icon: 42, title: 'text-xl', tag: 'text-[10px]' },
    lg: { icon: 56, title: 'text-2xl', tag: 'text-xs' },
    xl: { icon: 96, title: 'text-4xl', tag: 'text-base' },
  }[size];

  // Mark-only variant
  if (variant === 'mark') {
    return <LogoIcon size={sizeConfig.icon} className={className} />;
  }

  // Stacked variant (Icon on top, typography below)
  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <LogoIcon size={sizeConfig.icon} className="mb-2" />
        <div className="leading-tight">
          <span className={`font-extrabold tracking-tight ${sizeConfig.title}`}>
            <span className="text-[#0052cc]">Inclusive</span>
            <span className="text-[#22c55e]">Test</span>
          </span>
          {showTagline && (
            <span className={`block font-bold tracking-wider text-[#0f3b72] uppercase mt-0.5 ${sizeConfig.tag}`}>
              Digital Access. For All.
            </span>
          )}
        </div>
      </div>
    );
  }

  // White variant for dark backgrounds
  if (variant === 'white') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="bg-white/10 p-1.5 rounded-xl backdrop-blur-sm border border-white/20">
          <LogoIcon size={sizeConfig.icon} />
        </div>
        <div className="leading-tight">
          <span className={`font-extrabold tracking-tight text-white ${sizeConfig.title}`}>
            Inclusive<span className="text-[#4ade80]">Test</span>
          </span>
          {showTagline && (
            <span className={`block font-semibold tracking-wider text-teal-200 ${sizeConfig.tag}`}>
              Digital Access. For All.
            </span>
          )}
        </div>
      </div>
    );
  }

  // Default: Horizontal variant (Icon on left, typography on right)
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoIcon size={sizeConfig.icon} />
      <div className="leading-tight">
        <span className={`font-extrabold tracking-tight block ${sizeConfig.title}`}>
          <span className="text-[#0052cc]">Inclusive</span>
          <span className="text-[#22c55e]">Test</span>
        </span>
        {showTagline && (
          <span className={`block font-bold tracking-wider text-[#0f3b72] uppercase ${sizeConfig.tag}`}>
            Digital Access. For All.
          </span>
        )}
      </div>
    </div>
  );
};
