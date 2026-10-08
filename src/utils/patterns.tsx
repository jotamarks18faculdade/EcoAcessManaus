import React from 'react';
import { WasteCategory } from '../types';

/**
 * Universal ColorADD inspired symbol rendering
 * Always renders high contrast SVG vectors so color blind users can instantly recognise categories.
 */
export const ColorAddSymbol: React.FC<{
  category: WasteCategory;
  size?: number;
  className?: string;
  showLabel?: boolean;
}> = ({ category, size = 28, className = '', showLabel = false }) => {
  let symbolContent = null;
  let codeName = '';

  switch (category) {
    case 'plastic':
      // Red: Diagonal slash from bottom-left to top-right
      codeName = 'ColorADD: Vermelho (Slash /)';
      symbolContent = (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className="inline-block" aria-hidden="true">
          <rect x="2" y="2" width="28" height="28" rx="4" stroke="currentColor" strokeWidth="2.5" fill="none" />
          <line x1="8" y1="24" x2="24" y2="8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
      break;

    case 'paper':
      // Blue: Triangle pointing downwards
      codeName = 'ColorADD: Azul (Triângulo ▼)';
      symbolContent = (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className="inline-block" aria-hidden="true">
          <rect x="2" y="2" width="28" height="28" rx="4" stroke="currentColor" strokeWidth="2.5" fill="none" />
          <polygon points="16,24 8,10 24,10" fill="currentColor" />
        </svg>
      );
      break;

    case 'glass':
      // Green: Combined Yellow + Blue (Hourglass / Opposing triangles)
      codeName = 'ColorADD: Verde (Ampulheta ▲▼)';
      symbolContent = (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className="inline-block" aria-hidden="true">
          <rect x="2" y="2" width="28" height="28" rx="4" stroke="currentColor" strokeWidth="2.5" fill="none" />
          <polygon points="16,15 10,8 22,8" fill="currentColor" />
          <polygon points="16,17 10,24 22,24" fill="currentColor" />
        </svg>
      );
      break;

    case 'metal':
      // Yellow: Triangle pointing upwards
      codeName = 'ColorADD: Amarelo (Triângulo ▲)';
      symbolContent = (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className="inline-block" aria-hidden="true">
          <rect x="2" y="2" width="28" height="28" rx="4" stroke="currentColor" strokeWidth="2.5" fill="none" />
          <polygon points="16,8 8,22 24,22" fill="currentColor" />
        </svg>
      );
      break;

    case 'organic':
      // Brown: Slash + Triangle UP + Triangle DOWN
      codeName = 'ColorADD: Marrom (/ ▲ ▼)';
      symbolContent = (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className="inline-block" aria-hidden="true">
          <rect x="2" y="2" width="28" height="28" rx="4" stroke="currentColor" strokeWidth="2.5" fill="none" />
          <line x1="8" y1="24" x2="24" y2="8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <polygon points="16,6 11,14 21,14" fill="currentColor" />
          <polygon points="16,26 11,18 21,18" fill="currentColor" />
        </svg>
      );
      break;

    case 'electronic':
      // Special Tech: Box with microchip circuits & node
      codeName = 'Símbolo E-Waste (Circuito ⬡)';
      symbolContent = (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className="inline-block" aria-hidden="true">
          <rect x="2" y="2" width="28" height="28" rx="4" stroke="currentColor" strokeWidth="2.5" fill="none" />
          <rect x="10" y="10" width="12" height="12" rx="2" fill="currentColor" />
          <line x1="16" y1="4" x2="16" y2="10" stroke="currentColor" strokeWidth="2.5" />
          <line x1="16" y1="22" x2="16" y2="28" stroke="currentColor" strokeWidth="2.5" />
          <line x1="4" y1="16" x2="10" y2="16" stroke="currentColor" strokeWidth="2.5" />
          <line x1="22" y1="16" x2="28" stroke="currentColor" strokeWidth="2.5" />
        </svg>
      );
      break;

    case 'hazardous':
    default:
      // Orange / Caution: Slash + Triangle UP with exclamation
      codeName = 'Símbolo Perigo / Pilhas (Alerta ⚠)';
      symbolContent = (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className="inline-block" aria-hidden="true">
          <rect x="2" y="2" width="28" height="28" rx="4" stroke="currentColor" strokeWidth="2.5" fill="none" />
          <polygon points="16,6 6,24 26,24" stroke="currentColor" strokeWidth="2.5" fill="none" />
          <line x1="16" y1="12" x2="16" y2="17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="16" cy="21" r="1.5" fill="currentColor" />
        </svg>
      );
      break;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`} title={codeName}>
      {symbolContent}
      {showLabel && (
        <span className="text-[11px] font-mono uppercase tracking-wider font-semibold opacity-90">
          {codeName.split(':')[1] || codeName}
        </span>
      )}
    </span>
  );
};

/**
 * Global SVG Definitions for tactile/geometric patterns.
 * Placed in the DOM once so all components can fill backgrounds using url(#pattern-id)
 */
export const PatternDefs: React.FC = () => {
  return (
    <svg width="0" height="0" className="absolute w-0 h-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <defs>
        {/* Plastic: 45° Diagonal Stripes */}
        <pattern id="pattern-plastic" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="12" stroke="currentColor" strokeWidth="3" />
        </pattern>

        {/* Paper: Horizontal Stripes */}
        <pattern id="pattern-paper" width="10" height="10" patternUnits="userSpaceOnUse">
          <line x1="0" y1="5" x2="10" y2="5" stroke="currentColor" strokeWidth="2.5" />
        </pattern>

        {/* Glass: Diamond Grid / Losangos */}
        <pattern id="pattern-glass" width="14" height="14" patternUnits="userSpaceOnUse">
          <path d="M 0 7 L 7 0 L 14 7 L 7 14 Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
        </pattern>

        {/* Metal: Polka Dots (Pontilhado denso) */}
        <pattern id="pattern-metal" width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="5" cy="5" r="2.5" fill="currentColor" />
        </pattern>

        {/* Organic: Wavy Lines (Ondas) */}
        <pattern id="pattern-organic" width="20" height="12" patternUnits="userSpaceOnUse">
          <path d="M 0 6 Q 5 0, 10 6 T 20 6" fill="none" stroke="currentColor" strokeWidth="2.5" />
        </pattern>

        {/* Electronic: Circuit / Grid */}
        <pattern id="pattern-electronic" width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M 0 0 H 16 V 16 H 0 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="8" cy="8" r="2" fill="currentColor" />
        </pattern>

        {/* Hazardous: Crosshatch (Hachura cruzada) */}
        <pattern id="pattern-hazardous" width="12" height="12" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="12" y2="12" stroke="currentColor" strokeWidth="2" />
          <line x1="12" y1="0" x2="0" y2="12" stroke="currentColor" strokeWidth="2" />
        </pattern>
      </defs>
    </svg>
  );
};

/**
 * Visual Pattern Badge with tactile/geometric pattern swatch
 */
export const PatternBadge: React.FC<{
  category: WasteCategory;
  label?: string;
  className?: string;
}> = ({ category, label, className = '' }) => {
  const patternMap: Record<WasteCategory, { id: string; desc: string; textPattern: string; color: string; border: string }> = {
    plastic: {
      id: 'pattern-plastic',
      desc: 'Listras Diagonais',
      textPattern: '///',
      color: 'bg-red-950/40 text-red-200 border-red-500/80',
      border: 'border-red-400',
    },
    paper: {
      id: 'pattern-paper',
      desc: 'Listras Horizontais',
      textPattern: '===',
      color: 'bg-blue-950/40 text-blue-200 border-blue-500/80',
      border: 'border-blue-400',
    },
    glass: {
      id: 'pattern-glass',
      desc: 'Losangos / Grade',
      textPattern: '❖❖❖',
      color: 'bg-emerald-950/40 text-emerald-200 border-emerald-500/80',
      border: 'border-emerald-400',
    },
    metal: {
      id: 'pattern-metal',
      desc: 'Pontilhado Denso',
      textPattern: '••••',
      color: 'bg-amber-950/40 text-amber-200 border-amber-500/80',
      border: 'border-amber-400',
    },
    organic: {
      id: 'pattern-organic',
      desc: 'Ondas Amazônicas',
      textPattern: '≈≈≈',
      color: 'bg-orange-950/40 text-orange-200 border-orange-600/80',
      border: 'border-orange-500',
    },
    electronic: {
      id: 'pattern-electronic',
      desc: 'Circuito Integrado',
      textPattern: '⧉⧉⧉',
      color: 'bg-teal-950/40 text-teal-200 border-teal-500/80',
      border: 'border-teal-400',
    },
    hazardous: {
      id: 'pattern-hazardous',
      desc: 'Hachura Cruzada',
      textPattern: '✖✖✖',
      color: 'bg-purple-950/40 text-purple-200 border-purple-500/80',
      border: 'border-purple-400',
    },
  };

  const info = patternMap[category] || patternMap.plastic;

  return (
    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md border text-xs font-medium ${info.color} ${className}`}>
      {/* Visual swatch with SVG pattern */}
      <div className={`w-5 h-5 rounded border ${info.border} overflow-hidden shrink-0 relative bg-black/40`}>
        <svg width="20" height="20" className="w-full h-full text-current">
          <rect width="20" height="20" fill={`url(#${info.id})`} />
        </svg>
      </div>

      <ColorAddSymbol category={category} size={18} />

      <div className="flex flex-col">
        <span className="font-bold uppercase tracking-wide">
          {label || info.desc}
        </span>
        <span className="text-[10px] opacity-75 font-mono">
          {info.textPattern} · {info.desc}
        </span>
      </div>
    </div>
  );
};
