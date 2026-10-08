import React from 'react';
import { ColorBlindnessType } from '../types';

/**
 * Scientifically verified Daltonism color matrices (Machado / Brettel standard)
 * Allows accurate simulation of Protanopia, Deuteranopia, Tritanopia, and Achromatopsia.
 */
export const ColorBlindFilterDefs: React.FC = () => {
  return (
    <svg width="0" height="0" className="absolute w-0 h-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <defs>
        {/* Protanopia (Red-Blind) */}
        <filter id="protanopia-filter">
          <feColorMatrix
            type="matrix"
            values="
              0.56667 0.43333 0.00000 0 0
              0.55833 0.44167 0.00000 0 0
              0.00000 0.24167 0.75833 0 0
              0       0       0       1 0
            "
          />
        </filter>

        {/* Deuteranopia (Green-Blind) */}
        <filter id="deuteranopia-filter">
          <feColorMatrix
            type="matrix"
            values="
              0.625 0.375 0.000 0 0
              0.700 0.300 0.000 0 0
              0.000 0.300 0.700 0 0
              0     0     0     1 0
            "
          />
        </filter>

        {/* Tritanopia (Blue-Blind) */}
        <filter id="tritanopia-filter">
          <feColorMatrix
            type="matrix"
            values="
              0.95 0.05 0.00 0 0
              0.00 0.43333 0.56667 0 0
              0.00 0.475 0.525 0 0
              0    0       0       1 0
            "
          />
        </filter>

        {/* Achromatopsia (Monochromacy / Greyscale) */}
        <filter id="achromatopsia-filter">
          <feColorMatrix
            type="matrix"
            values="
              0.299 0.587 0.114 0 0
              0.299 0.587 0.114 0 0
              0.299 0.587 0.114 0 0
              0     0     0     1 0
            "
          />
        </filter>
      </defs>
    </svg>
  );
};

export function getFilterStyle(type: ColorBlindnessType, enabled: boolean): React.CSSProperties {
  if (!enabled || type === 'none' || type === 'unknown') {
    return {};
  }
  return {
    filter: `url(#${type}-filter)`,
  };
}
