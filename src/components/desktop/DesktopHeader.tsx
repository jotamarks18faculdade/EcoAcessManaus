import React from 'react';
import { 
  Eye, 
  Volume2, 
  Sparkles, 
  Monitor, 
  Smartphone, 
  Sliders, 
  Check, 
  HelpCircle,
  Camera,
  Sun,
  Type
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ColorBlindnessType, ContrastMode, FontSizeOption } from '../../types';
import { DeviceModePreference } from '../../hooks/useDeviceDetection';

interface DesktopHeaderProps {
  preference: DeviceModePreference;
  setPreference: (pref: DeviceModePreference) => void;
  detectedType: string;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  preference,
  setPreference,
  detectedType
}) => {
  const { 
    currentScreen, 
    setScreen, 
    accessibility, 
    updateAccessibility, 
    currentUser, 
    playActionSound,
    startTour 
  } = useApp();

  const daltonismTypes: { id: ColorBlindnessType; label: string; desc: string }[] = [
    { id: 'none', label: 'Típica', desc: 'Sem filtro' },
    { id: 'deuteranopia', label: 'Deuteranopia', desc: 'Verde' },
    { id: 'protanopia', label: 'Protanopia', desc: 'Vermelho' },
    { id: 'tritanopia', label: 'Tritanopia', desc: 'Azul/Amarelo' },
    { id: 'achromatopsia', label: 'Acromatopsia', desc: 'Monocromático' },
  ];

  const screenTitles: Record<string, { title: string; subtitle: string }> = {
    home: { title: 'Início & Desafios Ecológicos', subtitle: 'Missões e separação consciente em Manaus' },
    camera: { title: 'Identificação por Inteligência Artificial', subtitle: 'Classificação de resíduos e instruções táteis' },
    map: { title: 'Ecopontos & Pontos de Entrega Voluntária', subtitle: 'Localize e trace rotas inteligentes em Manaus' },
    history: { title: 'Histórico & Estatísticas de Descarte', subtitle: 'Registro do seu impacto ecológico' },
    rewards: { title: 'Recompensas & Fauna Amazônica', subtitle: 'Troque pontos por benefícios em parceiros locais' },
    accessibility: { title: 'Configurações de Acessibilidade & Sensorial', subtitle: 'Adapte contrastes, daltonismo e áudio' },
    admin: { title: 'Painel de Gestão & Supervisão', subtitle: 'Métricas para pais, educadores e administração' },
  };

  const currentInfo = screenTitles[currentScreen] || {
    title: 'EcoAcess Manaus',
    subtitle: 'Plataforma Inclusiva de Sustentabilidade'
  };

  const cycleContrast = () => {
    playActionSound();
    const modes: ContrastMode[] = ['normal', 'high-contrast-dark', 'yellow-black', 'high-contrast-light'];
    const nextIdx = (modes.indexOf(accessibility.contrastMode) + 1) % modes.length;
    updateAccessibility({ contrastMode: modes[nextIdx] });
  };

  const cycleFontSize = () => {
    playActionSound();
    const sizes: FontSizeOption[] = ['normal', 'large', 'extra-large'];
    const nextIdx = (sizes.indexOf(accessibility.fontSize) + 1) % sizes.length;
    updateAccessibility({ fontSize: sizes[nextIdx] });
  };

  return (
    <header 
      className="h-16 px-6 bg-stone-900/90 border-b border-stone-800 flex items-center justify-between gap-6 sticky top-0 z-20 backdrop-blur-md select-none"
      aria-label="Barra de ferramentas superior do computador"
    >
      {/* Zone 1: Breadcrumb and Title */}
      <div className="flex items-center gap-3 min-w-0">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-stone-400 font-mono">
            <span>EcoAcess Manaus</span>
            <span aria-hidden="true">/</span>
            <span className="text-emerald-400 font-bold capitalize">{currentScreen}</span>
          </div>
          <h1 className="text-sm lg:text-base font-extrabold text-white truncate leading-tight">
            {currentInfo.title}
          </h1>
        </div>
      </div>

      {/* Zone 2: Daltonism & Accessibility Quick Bar */}
      <div className="hidden xl:flex items-center gap-4 bg-stone-950/80 px-3 py-1.5 rounded-xl border border-stone-800">
        <div className="flex items-center gap-2">
          <Eye className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="text-[11px] font-bold text-stone-300 uppercase tracking-wider">
            Simulador de Visão:
          </span>
          <div className="flex items-center gap-1">
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
                    : 'bg-stone-800/80 text-stone-300 hover:text-white hover:bg-stone-700'
                }`}
                title={type.desc}
              >
                <span>{type.label}</span>
                {accessibility.colorBlindnessType === type.id && (
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="h-4 w-px bg-stone-800" />

        {/* Quick Contrast & Font toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={cycleContrast}
            className="px-2 py-0.5 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-200 text-[11px] font-semibold flex items-center gap-1 transition"
            title="Alternar modo de contraste"
          >
            <Sun className="w-3 h-3 text-amber-400" />
            <span className="capitalize">{accessibility.contrastMode === 'normal' ? 'Contraste' : accessibility.contrastMode}</span>
          </button>

          <button
            onClick={cycleFontSize}
            className="px-2 py-0.5 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-200 text-[11px] font-semibold flex items-center gap-1 transition"
            title="Aumentar tamanho de fonte"
          >
            <Type className="w-3 h-3 text-cyan-400" />
            <span className="capitalize">{accessibility.fontSize}</span>
          </button>
        </div>
      </div>

      {/* Zone 3: Device Mode Badge & Primary Action */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Switch to mobile preview */}
        <button
          onClick={() => {
            playActionSound();
            setPreference(preference === 'desktop' ? 'mobile' : 'desktop');
          }}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-semibold border border-stone-700 transition"
          title="Alternar entre modo computador e modo celular"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
          <span>Ver como Celular</span>
        </button>

        {/* Tour mark */}
        <button
          onClick={() => {
            playActionSound();
            startTour();
          }}
          className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition"
          title="Iniciar tutorial guiado"
          aria-label="Abrir tutorial guiado"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Action Button: Identify with camera */}
        {currentScreen !== 'camera' && (
          <button
            onClick={() => {
              playActionSound();
              setScreen('camera');
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-extrabold text-xs shadow-md shadow-emerald-500/20 transition active:scale-95"
          >
            <Camera className="w-4 h-4" />
            <span>Identificar Resíduo</span>
          </button>
        )}
      </div>
    </header>
  );
};
