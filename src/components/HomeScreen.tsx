import React, { useState } from 'react';
import { 
  Camera, 
  MapPin, 
  History, 
  Sliders, 
  Sparkles, 
  Award, 
  Leaf, 
  TreePine, 
  Droplet, 
  ArrowRight, 
  ShieldAlert, 
  ChevronRight, 
  Volume2, 
  Compass, 
  Calendar, 
  Image as ImageIcon, 
  RotateCcw,
  Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { speakText, stopSpeech } from '../utils/audio';

export const HomeScreen: React.FC = () => {
  const { 
    currentUser, 
    setScreen, 
    accessibility, 
    currentDayTheme, 
    simulateThemeDate, 
    resetThemeDate, 
    playActionSound,
    startTour 
  } = useApp();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedOffset, setSelectedOffset] = useState<number>(0);

  const handleSpeechGreeting = () => {
    const text = `Olá, ${currentUser?.name || 'cidadão'}. Bem-vindo ao EcoAcess Manaus. ` +
      `Hoje é ${currentDayTheme.dayOfWeekName}, ${currentDayTheme.dateFormatted}. ` +
      `Tema do dia: ${currentDayTheme.themeTag}. ` +
      `Mensagem ambiental: ${currentDayTheme.quote.text}. ` +
      `Escolha uma das opções: Identificar resíduo, Onde descartar em Manaus, Histórico ou Acessibilidade.`;
    speakText(text);
  };

  const handleSpeechQuote = () => {
    const text = `Mensagem do dia: ${currentDayTheme.quote.text}. Autor: ${currentDayTheme.quote.authorOrContext}. ` +
      `Tema ambiental: ${currentDayTheme.themeTag}. Imagem do dia em Manaus: ${currentDayTheme.wallpaper.title}.`;
    speakText(text);
  };

  const handleSimulateOffset = (days: number) => {
    playActionSound();
    setSelectedOffset(days);
    if (days === 0) {
      resetThemeDate();
    } else {
      const d = new Date();
      d.setDate(d.getDate() + days);
      simulateThemeDate(d);
    }
  };

  return (
    <div className="relative w-full pb-24 pt-4 px-4 sm:px-6 max-w-2xl mx-auto text-white overflow-hidden min-h-[90vh]">
      
      {/* Dynamic App Background Layer based on Current Date Theme */}
      <div 
        className="absolute inset-0 pointer-events-none bg-cover bg-center transition-all duration-1000 -z-10 scale-105"
        style={{ 
          backgroundImage: `url(${currentDayTheme.wallpaper.imageUrl})`,
          opacity: accessibility.contrastMode === 'normal' ? 0.22 : 0.08
        }}
        aria-hidden="true"
      />

      {/* Dynamic Ambient Gradient based on Theme Tag */}
      <div 
        className={`absolute inset-0 pointer-events-none bg-gradient-to-b ${currentDayTheme.ambientGradient} -z-10`}
        aria-hidden="true"
      />

      {/* Header Greeting & Date Badge */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
              EcoAcess Manaus · {currentUser?.level || 'Guardião dos Igarapés'}
            </span>
            <span className="text-[10px] bg-stone-900/90 text-stone-300 px-2 py-0.5 rounded-full border border-stone-700 flex items-center gap-1 font-mono">
              <Calendar className="w-3 h-3 text-emerald-400" />
              {currentDayTheme.dayOfWeekName}, {currentDayTheme.date.getDate()} de {currentDayTheme.date.toLocaleDateString('pt-BR', { month: 'short' })}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1 leading-snug">
            Olá, {currentUser?.name?.split(' ')[0] || 'Cidadão'}!
          </h1>
          <p className="text-sm text-stone-300 font-medium mt-0.5">
            Vamos tornar o descarte mais acessível?
          </p>
        </div>

        {/* Audio helper for greeting */}
        <button
          onClick={handleSpeechGreeting}
          className="p-2.5 rounded-full bg-stone-800 hover:bg-stone-700 text-emerald-400 border border-stone-700 shadow transition active:scale-90 shrink-0"
          title="Ouvir saudação e mensagem do dia em voz alta"
          aria-label="Ouvir orientações da tela inicial em voz alta"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {/* Gamification Points & Status Banner */}
      <div 
        onClick={() => {
          playActionSound();
          setScreen('rewards');
        }}
        className="w-full mb-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-stone-900 to-teal-950/80 border-2 border-emerald-500/50 shadow-lg cursor-pointer hover:border-emerald-400 transition"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-bold text-emerald-300">
                  Meus EcoPontos
                </span>
                <span className="text-[10px] bg-emerald-900/80 text-emerald-200 px-2 py-0.5 rounded-full font-mono border border-emerald-600/40">
                  + RECOMPENSAS
                </span>
              </div>
              <div className="text-2xl font-black text-white flex items-baseline gap-1">
                {currentUser?.ecoPoints || 0} <span className="text-xs text-stone-300 font-semibold">pts acumulados</span>
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-emerald-400" />
        </div>

        <div className="mt-3 pt-2.5 border-t border-emerald-800/40 flex items-center justify-between text-[11px] text-stone-300">
          <span className="flex items-center gap-1">
            <TreePine className="w-3.5 h-3.5 text-emerald-400" /> 3 árvores poupadas
          </span>
          <span className="flex items-center gap-1">
            <Droplet className="w-3.5 h-3.5 text-cyan-400" /> Igarapés de Manaus preservados
          </span>
        </div>
      </div>

      {/* Dynamic 'Message of the Day' & Dynamic Wallpaper Card */}
      <div className="mb-4 p-4 rounded-2xl bg-stone-900/90 border-2 border-stone-800 shadow-xl backdrop-blur-md relative overflow-hidden">
        
        {/* Card Header with Theme Tag and Date */}
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Mensagem do Dia · {currentDayTheme.themeTag}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleSpeechQuote}
              className="p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 transition"
              title="Ouvir mensagem do dia"
              aria-label="Ouvir mensagem do dia em voz alta"
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            </button>

            <button
              onClick={() => {
                playActionSound();
                setShowDatePicker(!showDatePicker);
              }}
              className="px-2 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-[10px] font-bold text-stone-300 flex items-center gap-1 transition"
              title="Alternar dia para testar serviço dinâmico"
            >
              <Clock className="w-3 h-3 text-emerald-400" />
              <span>{showDatePicker ? 'Ocultar Datas' : 'Testar Datas'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Quote Text */}
        <p className="text-sm text-stone-100 font-semibold leading-relaxed italic">
          "{currentDayTheme.quote.text}"
        </p>

        {/* Dynamic Author and Theme Context */}
        <div className="mt-2 flex items-center justify-between text-[11px] text-stone-400">
          <span>— {currentDayTheme.quote.authorOrContext}</span>
          <span className="flex items-center gap-1 text-emerald-400 font-mono font-medium">
            <ImageIcon className="w-3 h-3" />
            {currentDayTheme.wallpaper.title.split('&')[0]}
          </span>
        </div>

        {/* Date Simulation Controls (Allows user / evaluator to test date changes in real time) */}
        {showDatePicker && (
          <div className="mt-3 pt-3 border-t border-stone-800 space-y-2 animate-fade-in">
            <div className="flex items-center justify-between text-[10px] font-mono text-stone-300">
              <span className="uppercase font-bold text-emerald-400">
                Serviço de Atualização Dinâmica por Data:
              </span>
              <span>Data ativa: {currentDayTheme.dateFormatted}</span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { offset: 0, label: 'Hoje (Real)' },
                { offset: 1, label: 'Amanhã (+1d)' },
                { offset: 2, label: '+2 dias' },
                { offset: 3, label: '+3 dias' },
                { offset: 4, label: '+4 dias' },
                { offset: 5, label: '+5 dias' },
                { offset: 6, label: '+6 dias' },
              ].map((item) => (
                <button
                  key={item.offset}
                  onClick={() => handleSimulateOffset(item.offset)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 ${
                    selectedOffset === item.offset
                      ? 'bg-emerald-500 text-stone-950 shadow-sm'
                      : 'bg-stone-800 text-stone-300 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              {selectedOffset !== 0 && (
                <button
                  onClick={() => handleSimulateOffset(0)}
                  className="px-2 py-1 rounded-lg bg-red-950/70 border border-red-800/60 text-red-200 text-[10px] font-bold flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Restaurar</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Guided Tour (Coach Mark) Initiation Banner */}
      <div 
        onClick={() => {
          playActionSound();
          startTour();
        }}
        className="w-full mb-5 p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/80 via-stone-900 to-emerald-950/80 border-2 border-purple-400/60 shadow-lg cursor-pointer hover:border-purple-300 transition flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400 flex items-center justify-center text-purple-300 shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-300 bg-purple-900/60 px-2 py-0.2 rounded">
                TOUR GUIADO INICIAL
              </span>
            </div>
            <h3 className="text-xs sm:text-sm font-extrabold text-white mt-0.5">
              Aprenda a Navegar no App Sem Cores
            </h3>
            <p className="text-[11px] text-stone-300">
              Conheça os símbolos ColorADD, texturas e feedback sonoro.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            playActionSound();
            startTour();
          }}
          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shrink-0 shadow transition active:scale-95"
        >
          Iniciar Tour
        </button>
      </div>

      {/* The 4 Main Accessible Function Cards */}
      <h2 className="text-xs font-extrabold uppercase tracking-wider text-stone-400 mb-3 flex items-center gap-2">
        <span>Funções Principais</span>
        <span className="text-stone-600">· Toque para acessar</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        
        {/* Card 1: Identificar Resíduo */}
        <div
          onClick={() => {
            playActionSound();
            setScreen('camera');
          }}
          className="group relative p-5 rounded-2xl bg-stone-900/90 border-2 border-stone-700 hover:border-emerald-400 transition cursor-pointer shadow-xl active:scale-[0.98]"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 group-hover:bg-emerald-500 group-hover:text-stone-950 transition">
              <Camera className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-1 rounded bg-stone-800 text-stone-300 border border-stone-700">
              IA + CÂMERA
            </span>
          </div>

          <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition">
            Identificar Resíduo
          </h3>
          <p className="text-xs text-stone-300 mt-1 leading-snug">
            Fotografe um resíduo e descubra como descartá-lo sem depender de cores.
          </p>

          <div className="mt-3 pt-2 border-t border-stone-800/80 flex items-center justify-between text-xs text-emerald-400 font-bold">
            <span>Iniciar câmera</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Card 2: Onde Descartar? */}
        <div
          onClick={() => {
            playActionSound();
            setScreen('map');
          }}
          className="group relative p-5 rounded-2xl bg-stone-900/90 border-2 border-stone-700 hover:border-blue-400 transition cursor-pointer shadow-xl active:scale-[0.98]"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border-2 border-blue-400 flex items-center justify-center text-blue-300 group-hover:bg-blue-500 group-hover:text-stone-950 transition">
              <MapPin className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-1 rounded bg-stone-800 text-stone-300 border border-stone-700">
              PEVs MANAUS
            </span>
          </div>

          <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition">
            Onde Descartar?
          </h3>
          <p className="text-xs text-stone-300 mt-1 leading-snug">
            Encontre pontos de descarte próximos em Manaus com rotas por Dijkstra/A*.
          </p>

          <div className="mt-3 pt-2 border-t border-stone-800/80 flex items-center justify-between text-xs text-blue-400 font-bold">
            <span>Ver mapa e rotas</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Card 3: Histórico */}
        <div
          onClick={() => {
            playActionSound();
            setScreen('history');
          }}
          className="group relative p-5 rounded-2xl bg-stone-900/90 border-2 border-stone-700 hover:border-amber-400 transition cursor-pointer shadow-xl active:scale-[0.98]"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-amber-600/20 border-2 border-amber-400 flex items-center justify-center text-amber-300 group-hover:bg-amber-500 group-hover:text-stone-950 transition">
              <History className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-1 rounded bg-stone-800 text-stone-300 border border-stone-700">
              REGISTROS
            </span>
          </div>

          <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition">
            Histórico
          </h3>
          <p className="text-xs text-stone-300 mt-1 leading-snug">
            Consulte suas identificações anteriores e pontos acumulados.
          </p>

          <div className="mt-3 pt-2 border-t border-stone-800/80 flex items-center justify-between text-xs text-amber-400 font-bold">
            <span>Acessar histórico</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Card 4: Acessibilidade */}
        <div
          onClick={() => {
            playActionSound();
            setScreen('accessibility');
          }}
          className="group relative p-5 rounded-2xl bg-stone-900/90 border-2 border-stone-700 hover:border-purple-400 transition cursor-pointer shadow-xl active:scale-[0.98]"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-purple-600/20 border-2 border-purple-400 flex items-center justify-center text-purple-300 group-hover:bg-purple-500 group-hover:text-stone-950 transition">
              <Sliders className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-1 rounded bg-stone-800 text-stone-300 border border-stone-700">
              UNIVERSAL
            </span>
          </div>

          <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition">
            Acessibilidade
          </h3>
          <p className="text-xs text-stone-300 mt-1 leading-snug">
            Personalize sua experiência no EcoAcess: daltonismo, fontes, som e hachuras.
          </p>

          <div className="mt-3 pt-2 border-t border-stone-800/80 flex items-center justify-between text-xs text-purple-400 font-bold">
            <span>Configurar recursos</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </div>
        </div>

      </div>

      {/* Quick Daltonism Active Badge */}
      <div className="mt-6 p-3.5 rounded-xl bg-stone-900/80 border border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-stone-300">
            Perfil ativo: <strong className="text-white uppercase font-bold">{accessibility.colorBlindnessType}</strong>
            {accessibility.simulateFilter && ' · (Simulação visual ligada)'}
          </span>
        </div>
        <button
          onClick={() => {
            playActionSound();
            setScreen('accessibility');
          }}
          className="text-xs text-emerald-400 underline font-semibold"
        >
          Ajustar
        </button>
      </div>

    </div>
  );
};
