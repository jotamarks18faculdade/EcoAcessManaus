import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ColorBlindFilterDefs, getFilterStyle } from './components/ColorBlindFilter';
import { PatternDefs } from './utils/patterns';
import { LoginScreen } from './components/LoginScreen';
import { RegisterScreen } from './components/RegisterScreen';
import { HomeScreen } from './components/HomeScreen';
import { CameraIdentifyScreen } from './components/CameraIdentifyScreen';
import { MapViewScreen } from './components/MapViewScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { AccessibilityScreen } from './components/AccessibilityScreen';
import { RewardsScreen } from './components/RewardsScreen';
import { AdminPanel } from './components/AdminPanel';
import { BottomNav } from './components/BottomNav';
import { GuidedTour } from './components/GuidedTour';
import { DesktopWorkspaceLayout } from './components/desktop/DesktopWorkspaceLayout';
import { useDeviceDetection } from './hooks/useDeviceDetection';
import { 
  Eye, 
  Smartphone, 
  Monitor, 
  Check, 
  Volume2
} from 'lucide-react';
import { ColorBlindnessType } from './types';

const MainAppContent: React.FC = () => {
  const { currentScreen, accessibility, updateAccessibility, playActionSound } = useApp();
  const { isDesktop, preference, setPreference, detectedType } = useDeviceDetection();
  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(true);

  // Determine contrast styling class
  let contrastClass = 'bg-stone-950 text-stone-100';
  if (accessibility.contrastMode === 'high-contrast-dark') {
    contrastClass = 'bg-black text-white selection:bg-yellow-400 selection:text-black';
  } else if (accessibility.contrastMode === 'yellow-black') {
    contrastClass = 'bg-black text-yellow-300 selection:bg-yellow-500 selection:text-black';
  } else if (accessibility.contrastMode === 'high-contrast-light') {
    contrastClass = 'bg-white text-black selection:bg-black selection:text-white';
  }

  // Determine font size scale
  let fontScaleClass = 'text-base';
  if (accessibility.fontSize === 'large') {
    fontScaleClass = 'text-lg';
  } else if (accessibility.fontSize === 'extra-large') {
    fontScaleClass = 'text-xl';
  }

  // Apply real SVG daltonism filter simulation if enabled
  const filterStyle = getFilterStyle(
    accessibility.colorBlindnessType, 
    accessibility.simulateFilter
  );

  const daltonismTypes: { id: ColorBlindnessType; label: string; desc: string }[] = [
    { id: 'none', label: 'Típica', desc: 'Sem filtro' },
    { id: 'deuteranopia', label: 'Deuteranopia', desc: 'Verde' },
    { id: 'protanopia', label: 'Protanopia', desc: 'Vermelho' },
    { id: 'tritanopia', label: 'Tritanopia', desc: 'Azul/Amarelo' },
    { id: 'achromatopsia', label: 'Acromatopsia', desc: 'Monocromático' },
  ];

  return (
    <div 
      style={filterStyle}
      className={`min-h-screen w-full flex flex-col justify-start ${contrastClass} ${fontScaleClass} font-sans`}
    >
      {/* SVG Global Definitions: Filters & Tactile Patterns */}
      <ColorBlindFilterDefs />
      <PatternDefs />

      {/* INTELLIGENT DEVICE ADAPTATION:
          - On computers / desktop: renders DesktopWorkspaceLayout (reorganized multi-column ergonomic workspace)
          - On mobile devices: preserves exact mobile layout and bottom navigation bar
      */}
      {isDesktop ? (
        <DesktopWorkspaceLayout 
          preference={preference}
          setPreference={setPreference}
          detectedType={detectedType}
        />
      ) : (
        /* MOBILE VIEWPORT (Current mobile appearance 100% preserved) */
        <div className="min-h-screen w-full flex flex-col items-center justify-start">
          
          {/* Top Daltonism Evaluation Toolbar */}
          <aside 
            aria-label="Barra de avaliação de daltonismo para celular"
            className="w-full bg-stone-900 border-b border-stone-800 px-3 py-2 z-50 text-xs flex flex-wrap items-center justify-between gap-2 shadow-md"
          >
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-extrabold text-white uppercase tracking-wider text-[11px]">
                Daltonismo:
              </span>
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {daltonismTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => {
                      playActionSound();
                      updateAccessibility({ colorBlindnessType: type.id });
                    }}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition flex items-center gap-1 shrink-0 ${
                      accessibility.colorBlindnessType === type.id
                        ? 'bg-emerald-500 text-stone-950 shadow-sm'
                        : 'bg-stone-800 text-stone-300 hover:text-white'
                    }`}
                    title={type.desc}
                  >
                    <span>{type.label}</span>
                    {accessibility.colorBlindnessType === type.id && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Switch to full desktop workspace */}
              <button
                onClick={() => {
                  playActionSound();
                  setPreference('desktop');
                }}
                className="px-2 py-1 rounded bg-stone-800 text-stone-300 hover:text-white flex items-center gap-1 text-[11px] font-semibold border border-stone-700"
                title="Mudar para a interface completa de computador"
              >
                <Monitor className="w-3.5 h-3.5 text-emerald-400" />
                <span>Modo Computador</span>
              </button>

              {/* Mobile Frame toggle (if previewing on larger screen) */}
              <button
                onClick={() => setDeviceFrameMode(!deviceFrameMode)}
                className="p-1 rounded bg-stone-800 text-stone-400 hover:text-white flex items-center text-[11px]"
                title="Alternar moldura de celular"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          </aside>

          {/* Main Mobile Screen Viewport */}
          <div 
            className={`w-full transition-all duration-300 flex-1 flex flex-col items-center justify-center ${
              deviceFrameMode ? 'py-2 sm:py-6' : ''
            }`}
          >
            <div 
              className={`w-full transition-all duration-300 relative flex flex-col ${
                deviceFrameMode
                  ? 'max-w-[440px] min-h-[840px] max-h-[92vh] rounded-[36px] border-4 border-stone-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-y-auto bg-stone-950 overflow-x-hidden'
                  : 'max-w-2xl min-h-screen'
              }`}
            >
              {/* Render Active Mobile Screen */}
              {currentScreen === 'login' && <LoginScreen />}
              {currentScreen === 'register' && <RegisterScreen />}
              {currentScreen === 'home' && <HomeScreen />}
              {currentScreen === 'camera' && <CameraIdentifyScreen />}
              {currentScreen === 'map' && <MapViewScreen />}
              {currentScreen === 'history' && <HistoryScreen />}
              {currentScreen === 'accessibility' && <AccessibilityScreen />}
              {currentScreen === 'rewards' && <RewardsScreen />}
              {currentScreen === 'admin' && <AdminPanel />}

              {/* Persistent Accessible Bottom Navigation (when logged in) */}
              {currentScreen !== 'login' && currentScreen !== 'register' && <BottomNav />}

              {/* Guided Tour / Coach Mark for New & Returning Users */}
              <GuidedTour />
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
