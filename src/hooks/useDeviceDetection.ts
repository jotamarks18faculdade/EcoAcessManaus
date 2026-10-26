import { useState, useEffect } from 'react';

export type DeviceModePreference = 'auto' | 'mobile' | 'desktop';
export type DetectedHardwareType = 'mobile' | 'tablet' | 'desktop';

export interface DeviceDetectionState {
  isDesktop: boolean;
  isMobile: boolean;
  detectedType: DetectedHardwareType;
  preference: DeviceModePreference;
  setPreference: (pref: DeviceModePreference) => void;
  windowWidth: number;
  windowHeight: number;
}

const STORAGE_KEY = 'ecoacess_device_preference';

export function useDeviceDetection(): DeviceDetectionState {
  // Read saved preference or default to 'auto'
  const [preference, setPreferenceState] = useState<DeviceModePreference>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'mobile' || saved === 'desktop' || saved === 'auto') {
        return saved;
      }
    } catch {
      // ignore storage errors
    }
    return 'auto';
  });

  const [windowDimensions, setWindowDimensions] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  }));

  const [detectedType, setDetectedType] = useState<DetectedHardwareType>('desktop');

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setWindowDimensions({ width, height });

      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      let type: DetectedHardwareType = 'desktop';
      if (width < 768) {
        type = 'mobile';
      } else if (width < 1024) {
        type = hasTouch ? 'tablet' : 'desktop';
      } else {
        type = 'desktop';
      }
      setDetectedType(type);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice, { passive: true });
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const setPreference = (newPref: DeviceModePreference) => {
    setPreferenceState(newPref);
    try {
      localStorage.setItem(STORAGE_KEY, newPref);
    } catch {
      // ignore storage errors
    }
  };

  // Determine active view mode based on preference and auto-detection
  const isDesktop = preference === 'desktop' || (preference === 'auto' && windowDimensions.width >= 1024);
  const isMobile = !isDesktop;

  return {
    isDesktop,
    isMobile,
    detectedType,
    preference,
    setPreference,
    windowWidth: windowDimensions.width,
    windowHeight: windowDimensions.height,
  };
}
