import React from 'react';

interface RHPSLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

const RHPSLogo: React.FC<RHPSLogoProps> = ({ 
  size = 'md', 
  className = '',
  onClick 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        relative cursor-pointer
        transition-all duration-300
        hover:scale-105
        ${className}
      `}
      onClick={onClick}
      aria-label="RHPS Logo"
    >
      <svg 
        viewBox="0 0 192 192" 
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          
          <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#93c5fd" />
          </linearGradient>
        </defs>
        
        {/* Background circle */}
        <circle cx="96" cy="96" r="88" fill="white" stroke="url(#blueGradient)" strokeWidth="2"/>
        
        {/* Interconnected letters with connection lines */}
        <g fill="url(#blueGradient)" fontFamily="Arial, sans-serif" fontWeight="bold" textAnchor="middle">
          {/* Letter R */}
          <text x="50" y="90" fontSize="48">R</text>
          
          {/* Letter H */}
          <text x="85" y="90" fontSize="48">H</text>
          
          {/* Letter P */}
          <text x="120" y="90" fontSize="48">P</text>
          
          {/* Letter S */}
          <text x="155" y="90" fontSize="48">S</text>
          
          {/* Connection lines between letters */}
          <line x1="65" y1="80" x2="75" y2="80" stroke="url(#neonGradient)" strokeWidth="2" strokeDasharray="2,2"/>
          <line x1="100" y1="80" x2="110" y2="80" stroke="url(#neonGradient)" strokeWidth="2" strokeDasharray="2,2"/>
          <line x1="135" y1="80" x2="145" y2="80" stroke="url(#neonGradient)" strokeWidth="2" strokeDasharray="2,2"/>
        </g>
        
        {/* Open book symbolizing knowledge */}
        <g transform="translate(96, 130)" opacity="0.7">
          <path d="M-20,0 Q-20,-15 0,-15 Q20,-15 20,0 Q20,15 0,15 Q-20,15 -20,0" fill="none" stroke="url(#neonGradient)" strokeWidth="2"/>
          <path d="M0,-15 L0,15" stroke="url(#neonGradient)" strokeWidth="2"/>
        </g>
      </svg>
    </div>
  );
};

export default RHPSLogo;