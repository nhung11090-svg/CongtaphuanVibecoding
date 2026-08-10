import React from 'react';

interface FptLogoProps {
  className?: string;
}

export const FptLogo: React.FC<FptLogoProps> = ({ 
  className = "h-12"
}) => {
  return (
    <div className={`inline-flex items-center justify-center bg-white px-3.5 py-1.5 rounded-xl shadow-md border border-gray-200/80 shrink-0 select-none transition-all hover:shadow-lg ${className}`}>
      <svg 
        className="h-full w-auto max-h-12 sm:max-h-14" 
        viewBox="0 0 240 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Blue Slanted Bar + F */}
        <path d="M 12 12 L 48 12 L 32 60 L 0 60 Z" fill="#0056B3"/>
        <text x="12" y="49" fill="#FFFFFF" fontStyle="italic" fontWeight="900" fontSize="38" fontFamily="Arial, sans-serif">F</text>
        
        {/* Orange Slanted Bar + P */}
        <path d="M 52 12 L 88 12 L 72 60 L 36 60 Z" fill="#F36F21"/>
        <text x="52" y="49" fill="#FFFFFF" fontStyle="italic" fontWeight="900" fontSize="38" fontFamily="Arial, sans-serif">P</text>
        
        {/* Green Slanted Bar + T */}
        <path d="M 92 12 L 128 12 L 112 60 L 76 60 Z" fill="#00A651"/>
        <text x="92" y="49" fill="#FFFFFF" fontStyle="italic" fontWeight="900" fontSize="38" fontFamily="Arial, sans-serif">T</text>
        
        {/* ® Registered Symbol */}
        <circle cx="132" cy="53" r="3.5" stroke="#0056B3" strokeWidth="1" fill="none"/>
        <text x="130" y="55.5" fill="#0056B3" fontSize="5" fontWeight="bold" fontFamily="sans-serif">r</text>

        {/* "Education" text */}
        <text x="142" y="44" fill="#0056B3" fontWeight="700" fontSize="22" fontFamily="Arial, sans-serif">Education</text>

        {/* "FPT SCHOOLS" text in bold orange slab font */}
        <text x="2" y="93" fill="#F36F21" fontWeight="900" fontSize="27" fontFamily="'Arial Black', Impact, sans-serif" letterSpacing="0.8">
          FPT SCHOOLS
        </text>
      </svg>
    </div>
  );
};


