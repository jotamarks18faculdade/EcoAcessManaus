import React from 'react';
import { useApp } from '../../context/AppContext';
import { DesktopSidebar } from './DesktopSidebar';
import { DesktopHeader } from './DesktopHeader';
import { DesktopHomeScreen } from './DesktopHomeScreen';
import { DesktopCameraView } from './DesktopCameraView';
import { DesktopMapView } from './DesktopMapView';
import { DesktopHistoryView } from './DesktopHistoryView';
import { DesktopRewardsView } from './DesktopRewardsView';
import { DesktopAccessibilityView } from './DesktopAccessibilityView';
import { DesktopAdminView } from './DesktopAdminView';
import { DesktopAuthView } from './DesktopAuthView';
import { GuidedTour } from '../GuidedTour';
import { DeviceModePreference } from '../../hooks/useDeviceDetection';

interface DesktopWorkspaceLayoutProps {
  preference: DeviceModePreference;
  setPreference: (pref: DeviceModePreference) => void;
  detectedType: string;
}

export const DesktopWorkspaceLayout: React.FC<DesktopWorkspaceLayoutProps> = ({
  preference,
  setPreference,
  detectedType
}) => {
  const { currentScreen, currentUser } = useApp();

  // If user is on login/register screens on desktop, show the dedicated split-screen auth view
  if (currentScreen === 'login' || currentScreen === 'register') {
    return (
      <DesktopAuthView 
        preference={preference}
        setPreference={setPreference}
        detectedType={detectedType}
      />
    );
  }

  return (
    <div className="min-h-screen w-full flex bg-stone-950 text-stone-100 font-sans selection:bg-emerald-500 selection:text-stone-950">
      
      {/* 1. Left Sidebar Navigation */}
      <DesktopSidebar 
        preference={preference}
        setPreference={setPreference}
        detectedType={detectedType}
      />

      {/* 2. Main Workspace Canvas */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-stone-950/60 overflow-x-hidden">
        
        {/* Top Header */}
        <DesktopHeader 
          preference={preference}
          setPreference={setPreference}
          detectedType={detectedType}
        />

        {/* Dynamic Desktop Screen View */}
        <main className="flex-1 overflow-y-auto">
          {currentScreen === 'home' && <DesktopHomeScreen />}
          {currentScreen === 'camera' && <DesktopCameraView />}
          {currentScreen === 'map' && <DesktopMapView />}
          {currentScreen === 'history' && <DesktopHistoryView />}
          {currentScreen === 'rewards' && <DesktopRewardsView />}
          {currentScreen === 'accessibility' && <DesktopAccessibilityView />}
          {currentScreen === 'admin' && <DesktopAdminView />}
        </main>

        {/* Guided Tour Modal if open */}
        <GuidedTour />
      </div>

    </div>
  );
};
