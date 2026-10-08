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
import { 
  Eye, 
  Smartphone, 
  Monitor, 
  HelpCircle, 
  Info,
  Check,
  Sparkles,
  Volume2
} from 'lucide-react';
import { ColorBlindnessType } from './types';

const MainAppContent: React.FC = () => {
  const { currentScreen, accessibility, updateAccessibility, playActionSound, currentDayTheme } = useApp();
  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(true);
  const [showDaltonismQuickSwitch, setShowDaltonismQuickSwitch] = useState<boolean>(true);

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
    { id: 'deuteranopia', label: 'Deuteranopia', desc: 'Verde' },
    { id: 'protanopia', label: 'Protanopia', desc: 'Vermelho' },
    { id: 'tritanopia', label: 'Tritanopia', desc: 'Azul/Amarelo' },
    { id: 'achromatopsia', label: 'Acromatopsia', desc: 'Monocromático' },
    { id: 'none', label: 'Visão Típica', desc: 'Sem filtro' },
  ];

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-start ${contrastClass} ${fontScaleClass} font-sans`}>
      
      {/* SVG Global Definitions: Filters & Tactile Patterns */}
      <ColorBlindFilterDefs />
      <PatternDefs />

      {/* Top Daltonism Evaluation Toolbar (Allows TCC evaluators to switch perspectives instantly) */}
      <aside 
        aria-label="Barra de avaliação de daltonismo"
        className="w-full bg-stone-900 border-b border-stone-800 px-3 py-2 z-50 text-xs flex flex-wrap items-center justify-between gap-2 shadow-md"
      >
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-extrabold text-white uppercase tracking-wider text-[11px]">
            Simulador de Daltonismo:
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

        <div className="flex items-center gap-3">
          {/* Toggle filter on screen */}
          <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-stone-300">
            <input
              type="checkbox"
              checked={accessibility.simulateFilter}
              onChange={(e) => updateAccessibility({ simulateFilter: e.target.checked })}
              className="accent-emerald-500 rounded"
            />
            <span className="hidden sm:inline">Filtro de Tela Ativo</span>
          </label>

          {/* Device Frame Viewport Toggle */}
          <button
            onClick={() => setDeviceFrameMode(!deviceFrameMode)}
            className="p-1 rounded bg-stone-800 text-stone-300 hover:text-white flex items-center gap-1 text-[11px] font-semibold"
            title="Alternar entre moldura de smartphone e tela inteira"
          >
            {deviceFrameMode ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{deviceFrameMode ? 'Expandir' : 'Modo Celular'}</span>
          </button>
        </div>
      </aside>

      {/* Main Viewport Container */}
      <div 
        className={`w-full transition-all duration-300 flex-1 flex flex-col items-center justify-center ${
          deviceFrameMode ? 'py-2 sm:py-6' : ''
        }`}
      >
        <div 
          style={filterStyle}
          className={`w-full transition-all duration-300 relative flex flex-col ${
            deviceFrameMode
              ? 'max-w-[440px] min-h-[840px] max-h-[92vh] rounded-[36px] border-4 border-stone-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-y-auto bg-stone-950 overflow-x-hidden'
              : 'max-w-2xl min-h-screen'
          }`}
        >
          {/* Render Active Screen */}
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
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
