import React from 'react';
import { 
  Home, 
  Camera, 
  MapPin, 
  History, 
  Award, 
  Sliders, 
  ShieldCheck, 
  Leaf, 
  Volume2, 
  Smartphone, 
  Monitor, 
  LogOut, 
  Sparkles,
  TreePine,
  Check
} from 'lucide-react';
import { useApp, ScreenType } from '../../context/AppContext';
import { speakText } from '../../utils/audio';
import { DeviceModePreference } from '../../hooks/useDeviceDetection';

interface DesktopSidebarProps {
  preference: DeviceModePreference;
  setPreference: (pref: DeviceModePreference) => void;
  detectedType: string;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  preference,
  setPreference,
  detectedType
}) => {
  const { 
    currentScreen, 
    setScreen, 
    currentUser, 
    logout, 
    currentDayTheme, 
    playActionSound,
    accessibility 
  } = useApp();

  const navItems: { id: ScreenType; label: string; icon: React.ComponentType<{ className?: string }>; desc: string }[] = [
    { id: 'home', label: 'Início & Desafios', icon: Home, desc: 'Missões e painel do dia' },
    { id: 'camera', label: 'Identificador IA', icon: Camera, desc: 'Reconhecer resíduos' },
    { id: 'map', label: 'Ecopontos Manaus', icon: MapPin, desc: 'Pontos de entrega e rotas' },
    { id: 'history', label: 'Histórico de Coleta', icon: History, desc: 'Descartes registrados' },
    { id: 'rewards', label: 'Recompensas & Fauna', icon: Award, desc: 'Medalhas amazônicas' },
    { id: 'accessibility', label: 'Acessibilidade', icon: Sliders, desc: 'Sensorial e contraste' },
  ];

  // Include admin/management tab if user is admin or responsible
  if (currentUser?.role === 'admin') {
    navItems.push({
      id: 'admin',
      label: 'Painel de Gestão',
      icon: ShieldCheck,
      desc: 'Supervisão e métricas'
    });
  }

  const handleSpeakTheme = () => {
    const text = `Mensagem ambiental de Manaus: ${currentDayTheme.quote.text}. Tema: ${currentDayTheme.themeTag}. Imagem: ${currentDayTheme.wallpaper.title}.`;
    speakText(text);
  };

  return (
    <aside 
      className="w-72 shrink-0 bg-stone-900/95 border-r border-stone-800 flex flex-col justify-between h-screen sticky top-0 overflow-y-auto select-none z-30"
      aria-label="Navegação lateral para computadores"
    >
      {/* Brand & Identity */}
      <div>
        <div className="p-5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner">
              <Leaf className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white font-sans">
                  EcoAcess
                </span>
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest font-mono">
                  Manaus
                </span>
              </div>
              <p className="text-[11px] text-stone-400 font-medium">
                Sustentabilidade & Inclusão
              </p>
            </div>
          </div>
        </div>

        {/* User Card Profile */}
        <div className="mx-3 mt-4 p-3.5 rounded-2xl bg-stone-800/80 border border-stone-700/60 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-emerald-500/10 border-2 border-emerald-400 flex items-center justify-center text-lg font-bold text-emerald-300">
              🌿
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold text-white truncate">
                {currentUser?.name || 'Cidadão Ecológico'}
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] font-semibold text-emerald-400 font-mono">
                  {currentUser?.ecoPoints ?? 340} pts
                </span>
                <span className="text-stone-500 text-[10px]">·</span>
                <span className="text-[11px] text-stone-400 truncate">
                  {currentUser?.level || 'Guardião'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="mt-4 px-3 space-y-1.5" aria-label="Menu principal">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  playActionSound();
                  setScreen(item.id);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all group ${
                  isActive
                    ? 'bg-emerald-500 text-stone-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800/80 font-medium'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={`w-5 h-5 shrink-0 transition-transform ${
                  isActive ? 'scale-110 text-stone-950' : 'text-stone-400 group-hover:text-emerald-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold leading-tight truncate">
                    {item.label}
                  </div>
                  <div className={`text-[10px] truncate ${isActive ? 'text-stone-900/80 font-medium' : 'text-stone-400'}`}>
                    {item.desc}
                  </div>
                </div>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-950 shrink-0" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Manaus Daily Theme & Device Switcher */}
      <div className="p-3 border-t border-stone-800 space-y-3">
        {/* Amazonian Daily Theme Card */}
        <div className="p-3 rounded-xl bg-stone-950/70 border border-stone-800/80 relative overflow-hidden group">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-15 pointer-events-none transition group-hover:scale-105"
            style={{ backgroundImage: `url(${currentDayTheme.wallpaper.imageUrl})` }}
          />
          <div className="relative z-10">
            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400 mb-1">
              <span className="flex items-center gap-1 font-mono">
                <TreePine className="w-3.5 h-3.5" />
                {currentDayTheme.themeTag}
              </span>
              <button
                onClick={handleSpeakTheme}
                className="p-1 rounded bg-stone-800/80 hover:bg-stone-700 text-emerald-300 transition"
                title="Ouvir reflexão ecológica"
                aria-label="Ouvir reflexão ecológica do dia"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-stone-300 italic line-clamp-2 leading-relaxed">
              "{currentDayTheme.quote.text}"
            </p>
            <div className="mt-1 text-[10px] text-stone-400 font-mono">
              Manaus · {currentDayTheme.dayOfWeekName}
            </div>
          </div>
        </div>

        {/* Device Mode Switcher (Allows testing desktop and mobile interfaces) */}
        <div className="pt-1">
          <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1.5 px-1 font-medium">
            <span>Adaptação de Tela:</span>
            <span className="text-emerald-400 font-mono text-[10px]">
              {preference === 'auto' ? `Auto (${detectedType})` : preference === 'desktop' ? 'Forçar PC' : 'Forçar Celular'}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-1.5 bg-stone-950 p-1 rounded-xl border border-stone-800">
            <button
              onClick={() => {
                playActionSound();
                setPreference('desktop');
              }}
              className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition ${
                preference === 'desktop' || (preference === 'auto')
                  ? 'bg-emerald-500 text-stone-950 shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Computador</span>
            </button>

            <button
              onClick={() => {
                playActionSound();
                setPreference('mobile');
              }}
              className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition ${
                preference === 'mobile'
                  ? 'bg-emerald-500 text-stone-950 shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Celular</span>
            </button>
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={() => {
            playActionSound();
            logout();
          }}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-stone-400 hover:text-red-400 hover:bg-stone-800/80 text-xs font-semibold transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sair da Conta</span>
        </button>
      </div>
    </aside>
  );
};
