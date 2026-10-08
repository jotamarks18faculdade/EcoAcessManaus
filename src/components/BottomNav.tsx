import React from 'react';
import { 
  Home, 
  Camera, 
  MapPin, 
  History, 
  User, 
  ShieldCheck 
} from 'lucide-react';
import { useApp, ScreenType } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { currentScreen, setScreen, currentUser, playActionSound } = useApp();

  // Navigation items with explicit text + icon
  const navItems: { id: ScreenType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'camera', label: 'Identificar', icon: Camera },
    { id: 'map', label: 'Descartar', icon: MapPin },
    { id: 'history', label: 'Histórico', icon: History },
    { id: 'accessibility', label: 'Perfil', icon: User },
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-40 bg-stone-950/95 border-t-2 border-stone-800 backdrop-blur-lg px-2 py-1 max-w-2xl mx-auto shadow-2xl"
      aria-label="Navegação principal inferior"
    >
      <div className="flex items-center justify-around">
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
              className={`flex-1 py-1.5 px-1 flex flex-col items-center justify-center gap-1 rounded-xl transition duration-150 relative ${
                isActive
                  ? 'text-emerald-400 font-black'
                  : 'text-stone-400 hover:text-stone-200 font-semibold'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active top pill indicator */}
              {isActive && (
                <span className="w-6 h-1 bg-emerald-400 rounded-full mb-0.5 shadow-sm shadow-emerald-400" />
              )}
              
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-emerald-400' : ''}`} />
              
              {/* Text label is MANDATORY per universal accessibility rules */}
              <span className={`text-[10px] tracking-tight uppercase leading-none ${isActive ? 'text-white font-extrabold' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}

        {/* If Admin user is logged in, show Admin shortcut */}
        {currentUser?.role === 'admin' && (
          <button
            onClick={() => {
              playActionSound();
              setScreen('admin');
            }}
            className={`flex-1 py-1.5 px-1 flex flex-col items-center justify-center gap-1 rounded-xl transition duration-150 ${
              currentScreen === 'admin'
                ? 'text-amber-400 font-black'
                : 'text-stone-400 hover:text-amber-300 font-semibold'
            }`}
          >
            {currentScreen === 'admin' && (
              <span className="w-6 h-1 bg-amber-400 rounded-full mb-0.5" />
            )}
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span className="text-[10px] tracking-tight uppercase leading-none">
              Admin
            </span>
          </button>
        )}
      </div>
    </nav>
  );
};
