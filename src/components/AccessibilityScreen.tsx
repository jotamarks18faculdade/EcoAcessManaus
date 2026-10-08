import React from 'react';
import { 
  Sliders, 
  ArrowLeft, 
  Volume2, 
  Vibrate, 
  Type, 
  Eye, 
  Check, 
  Sparkles, 
  Layers, 
  LogOut, 
  User, 
  ShieldCheck, 
  Award,
  BookOpen,
  HelpCircle,
  Compass
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ColorBlindnessType, ContrastMode, FontSizeOption } from '../types';
import { ColorAddSymbol, PatternDefs } from '../utils/patterns';
import { sound, triggerVibration, speakText } from '../utils/audio';

export const AccessibilityScreen: React.FC = () => {
  const { 
    accessibility, 
    updateAccessibility, 
    setScreen, 
    currentUser, 
    logout, 
    playActionSound,
    startTour 
  } = useApp();

  const handleTestSpeech = () => {
    speakText("O sistema de acessibilidade por voz do EcoAcess Manaus está funcionando perfeitamente.");
  };

  const handleTestChime = () => {
    sound.playSuccess(true);
    triggerVibration([50, 40, 50], true);
  };

  return (
    <div className="w-full pb-24 pt-3 px-4 max-w-xl mx-auto text-white">
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => {
            playActionSound();
            setScreen('home');
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-stone-300 hover:text-white uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>

        <h1 className="text-sm font-extrabold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
          <Sliders className="w-4 h-4" />
          <span>Minha Acessibilidade & Perfil</span>
        </h1>

        <button
          onClick={logout}
          className="p-1.5 rounded-lg bg-red-950/60 text-red-300 border border-red-800/60 hover:bg-red-900 flex items-center gap-1 text-xs font-semibold"
          title="Sair da conta"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sair</span>
        </button>
      </div>

      {/* User Profile Card */}
      <div className="mb-5 p-4 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-900/40 border border-purple-500/50 flex items-center justify-center text-purple-300 font-bold text-lg">
            {currentUser?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-sm text-white">{currentUser?.name}</h2>
              {currentUser?.role === 'admin' && (
                <span className="text-[10px] bg-amber-900 text-amber-200 px-2 py-0.2 rounded font-mono font-bold">
                  ADMIN
                </span>
              )}
            </div>
            <p className="text-xs text-stone-400">@{currentUser?.username} · {currentUser?.email}</p>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
              <Award className="w-3 h-3" /> {currentUser?.level} ({currentUser?.ecoPoints} pts)
            </span>
          </div>
        </div>

        {currentUser?.role === 'admin' && (
          <button
            onClick={() => setScreen('admin')}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase rounded-xl transition"
          >
            Painel Admin
          </button>
        )}
      </div>

      {/* Guided Tour Launcher Card */}
      <div className="mb-5 p-3.5 bg-gradient-to-r from-purple-950/70 to-stone-900 border-2 border-purple-500/50 rounded-2xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400 flex items-center justify-center text-purple-300 shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-white">
              Tour Guiado de Acessibilidade
            </h3>
            <p className="text-[11px] text-stone-300">
              Revise o passo a passo com áudio e símbolos sem cores.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            playActionSound();
            startTour();
          }}
          className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shrink-0 shadow transition active:scale-95"
        >
          Iniciar Tour
        </button>
      </div>

      {/* Section 1: Tipo de Daltonismo */}
      <div className="mb-5 p-4 rounded-2xl bg-stone-900/90 border-2 border-stone-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-purple-300 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>Tipo de Daltonismo</span>
          </h3>
          <span className="text-[10px] font-mono text-stone-400">Classificação Médica</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { id: 'protanopia', label: 'Protanopia', desc: 'Dificuldade com vermelho (cone L)', symbol: '🔴✖' },
            { id: 'deuteranopia', label: 'Deuteranopia', desc: 'Dificuldade com verde (cone M)', symbol: '🌿✖' },
            { id: 'tritanopia', label: 'Tritanopia', desc: 'Dificuldade com azul (cone S)', symbol: '🔷✖' },
            { id: 'achromatopsia', label: 'Acromatopsia', desc: 'Escala de cinza completa', symbol: '⬛⬜' },
            { id: 'unknown', label: 'Não Sei', desc: 'Ativa todos os símbolos universais', symbol: '❓' },
            { id: 'none', label: 'Visão Típica', desc: 'Sem alteração na percepção de cores', symbol: '👁️' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => updateAccessibility({ colorBlindnessType: type.id as ColorBlindnessType })}
              className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition ${
                accessibility.colorBlindnessType === type.id
                  ? 'bg-purple-950/80 border-purple-400 text-white font-bold shadow-md'
                  : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:border-stone-700'
              }`}
            >
              <span className="text-base">{type.symbol}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{type.label}</span>
                  {accessibility.colorBlindnessType === type.id && (
                    <Check className="w-3.5 h-3.5 text-purple-400" />
                  )}
                </div>
                <span className="text-[10px] opacity-75 mt-0.5 block">{type.desc}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Live Daltonism Simulation Filter toggle for evaluation */}
        <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/40 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-white block">Simular Visão na Tela (Banca de TCC)</span>
            <span className="text-[11px] text-stone-300">
              Aplica matriz de transformação SVG Machado/Brettel em toda a aplicação.
            </span>
          </div>
          <input
            type="checkbox"
            checked={accessibility.simulateFilter}
            onChange={(e) => updateAccessibility({ simulateFilter: e.target.checked })}
            className="w-5 h-5 accent-purple-500 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Section 2: Aparência e Alto Contraste */}
      <div className="mb-5 p-4 rounded-2xl bg-stone-900/90 border-2 border-stone-800 space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-300 flex items-center gap-2">
          <Type className="w-4 h-4" />
          <span>Aparência, Contraste e Tipografia</span>
        </h3>

        {/* Contraste */}
        <div>
          <label className="text-xs font-bold text-stone-300 block mb-1.5">
            Modos de Contraste WCAG AAA:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'normal', label: 'Contraste Padrão Suave' },
              { id: 'high-contrast-dark', label: 'Alto Contraste Escuro' },
              { id: 'yellow-black', label: 'Amarelo sobre Preto' },
              { id: 'high-contrast-light', label: 'Alto Contraste Claro' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => updateAccessibility({ contrastMode: m.id as ContrastMode })}
                className={`p-2.5 rounded-xl border text-xs text-left transition ${
                  accessibility.contrastMode === m.id
                    ? 'bg-emerald-950/80 border-emerald-400 text-white font-bold'
                    : 'bg-stone-950/60 border-stone-800 text-stone-300'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tamanho da Fonte */}
        <div className="pt-2">
          <label className="text-xs font-bold text-stone-300 block mb-1.5">
            Tamanho da Tipografia:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'normal', label: 'Padrão (100%)' },
              { id: 'large', label: 'Texto Ampliado (115%)' },
              { id: 'extra-large', label: 'Extra Ampliado (130%)' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => updateAccessibility({ fontSize: s.id as FontSizeOption })}
                className={`p-2.5 rounded-xl border text-xs text-center transition ${
                  accessibility.fontSize === s.id
                    ? 'bg-emerald-950/80 border-emerald-400 text-white font-bold'
                    : 'bg-stone-950/60 border-stone-800 text-stone-300'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Section 3: Comunicação (Som, Vibração, Leitura em Voz Alta) */}
      <div className="mb-5 p-4 rounded-2xl bg-stone-900/90 border-2 border-stone-800 space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-blue-300 flex items-center gap-2">
          <Volume2 className="w-4 h-4" />
          <span>Comunicação e Feedback Sensorial</span>
        </h3>

        <div className="space-y-2.5">
          
          {/* Som */}
          <div className="p-3 bg-stone-950/70 border border-stone-800 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Volume2 className="w-4 h-4 text-blue-400" />
              <div>
                <span className="text-xs font-bold text-white block">Feedback Sonoro (Beeps e Acordes)</span>
                <span className="text-[10px] text-stone-400">Confirmação auditiva de cliques e ações</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleTestChime}
                className="px-2 py-0.5 rounded bg-stone-800 text-[10px] text-stone-300 hover:text-white"
              >
                Testar
              </button>
              <input
                type="checkbox"
                checked={accessibility.soundEnabled}
                onChange={(e) => updateAccessibility({ soundEnabled: e.target.checked })}
                className="w-5 h-5 accent-blue-500 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Vibração */}
          <div className="p-3 bg-stone-950/70 border border-stone-800 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Vibrate className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-xs font-bold text-white block">Vibração Tátil no Smartphone</span>
                <span className="text-[10px] text-stone-400">Feedback tátil háptico para confirmação</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={accessibility.vibrationEnabled}
              onChange={(e) => updateAccessibility({ vibrationEnabled: e.target.checked })}
              className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
            />
          </div>

          {/* Leitura em Voz Alta */}
          <div className="p-3 bg-stone-950/70 border border-stone-800 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-xs font-bold text-white block">Leitura em Voz Alta Automática</span>
                <span className="text-[10px] text-stone-400">Sintetizador Web Speech em Português</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleTestSpeech}
                className="px-2 py-0.5 rounded bg-stone-800 text-[10px] text-stone-300 hover:text-white"
              >
                Ouvir Teste
              </button>
              <input
                type="checkbox"
                checked={accessibility.speechEnabled}
                onChange={(e) => updateAccessibility({ speechEnabled: e.target.checked })}
                className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Section 4: Identificação Visual (Símbolos, Padrões, Textos Descritivos) */}
      <div className="mb-5 p-4 rounded-2xl bg-stone-900/90 border-2 border-stone-800 space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-300 flex items-center gap-2">
          <Layers className="w-4 h-4" />
          <span>Identificação Visual Independente de Cores</span>
        </h3>

        <div className="space-y-2.5">
          <label className="p-3 bg-stone-950/70 border border-stone-800 rounded-xl flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-xs font-bold text-white block">Mostrar Símbolos ColorADD</span>
              <span className="text-[10px] text-stone-400">Código gráfico universal de identificação de cor</span>
            </div>
            <input
              type="checkbox"
              checked={accessibility.showColorAddSymbols}
              onChange={(e) => updateAccessibility({ showColorAddSymbols: e.target.checked })}
              className="w-5 h-5 accent-amber-500 rounded"
            />
          </label>

          <label className="p-3 bg-stone-950/70 border border-stone-800 rounded-xl flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-xs font-bold text-white block">Mostrar Padrões Táteis e Texturas (Hachuras)</span>
              <span className="text-[10px] text-stone-400">Listras, pontilhados, losangos e ondas por resíduo</span>
            </div>
            <input
              type="checkbox"
              checked={accessibility.showTexturePatterns}
              onChange={(e) => updateAccessibility({ showTexturePatterns: e.target.checked })}
              className="w-5 h-5 accent-amber-500 rounded"
            />
          </label>

          <label className="p-3 bg-stone-950/70 border border-stone-800 rounded-xl flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-xs font-bold text-white block">Mostrar Textos Descritivos em Caixa Alta</span>
              <span className="text-[10px] text-stone-400">Rotulagem direta com categoria explícita</span>
            </div>
            <input
              type="checkbox"
              checked={accessibility.showDescriptiveText}
              onChange={(e) => updateAccessibility({ showDescriptiveText: e.target.checked })}
              className="w-5 h-5 accent-amber-500 rounded"
            />
          </label>
        </div>
      </div>

    </div>
  );
};
