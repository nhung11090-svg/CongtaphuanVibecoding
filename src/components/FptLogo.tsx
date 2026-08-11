import React from 'react';

interface FptLogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export const FptLogo: React.FC<FptLogoProps> = ({ 
  className = "h-9 sm:h-11",
  variant = "light"
}) => {
  const textColor = variant === 'light' ? '#FFFFFF' : '#0F172A';

  return (
    <div className={`inline-flex items-center shrink-0 select-none bg-transparent transition-transform hover:scale-[1.02] ${className}`}>
      <svg 
        className="h-full w-auto drop-shadow-sm overflow-visible" 
        viewBox="0 0 220 54" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Blue Leaf Block + F */}
        <g>
          <path 
            d="M 12 6 C 12 3 15 2 18 2 L 38 2 C 41 2 42.5 3.5 41.5 6.5 L 32.5 42 C 31.5 45 30 46 27 46 L 7 46 C 4 46 2 44.5 3 41.5 L 12 6 Z" 
            fill="#0052CC"
          />
          <text 
            x="22" 
            y="35" 
            fill="#FFFFFF" 
            fontStyle="italic" 
            fontWeight="900" 
            fontSize="30" 
            textAnchor="middle"
            fontFamily="Arial, 'Helvetica Neue', Helvetica, sans-serif"
          >
            F
          </text>
        </g>

        {/* Orange Leaf Block + P (Slightly taller as in official FPT logo) */}
        <g>
          <path 
            d="M 44 2 C 44 -0.5 47 -1 50 -1 L 70 -1 C 73 -1 74.5 0.5 73.5 3.5 L 63.5 45 C 62.5 48 60 49 57 49 L 37 49 C 34 49 32.5 47.5 33.5 44.5 L 44 2 Z" 
            fill="#F36F21"
          />
          <text 
            x="53" 
            y="37" 
            fill="#FFFFFF" 
            fontStyle="italic" 
            fontWeight="900" 
            fontSize="31" 
            textAnchor="middle"
            fontFamily="Arial, 'Helvetica Neue', Helvetica, sans-serif"
          >
            P
          </text>
        </g>

        {/* Green Leaf Block + T */}
        <g>
          <path 
            d="M 76 6 C 76 3 79 2 82 2 L 102 2 C 105 2 106.5 3.5 105.5 6.5 L 96.5 42 C 95.5 45 94 46 91 46 L 71 46 C 68 46 66.5 44.5 67.5 41.5 L 76 6 Z" 
            fill="#00A651"
          />
          <text 
            x="85" 
            y="35" 
            fill="#FFFFFF" 
            fontStyle="italic" 
            fontWeight="900" 
            fontSize="30" 
            textAnchor="middle"
            fontFamily="Arial, 'Helvetica Neue', Helvetica, sans-serif"
          >
            T
          </text>
        </g>

        {/* Small ® Registered trademark */}
        <g opacity="0.9">
          <circle cx="107" cy="41" r="2.8" stroke="#00A651" strokeWidth="0.8" fill="none"/>
          <text x="105.6" y="42.8" fill="#00A651" fontSize="4.2" fontWeight="bold" fontFamily="sans-serif">r</text>
        </g>

        {/* "Schools" Wordmark */}
        <text 
          x="118" 
          y="35" 
          fill={textColor} 
          fontWeight="700" 
          fontSize="27" 
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif"
          letterSpacing="-0.3"
        >
          Schools
        </text>
      </svg>
    </div>
  );
};





