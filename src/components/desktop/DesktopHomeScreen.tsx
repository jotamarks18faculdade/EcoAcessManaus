import React, { useState } from 'react';
import { 
  Camera, 
  MapPin, 
  History, 
  Award, 
  Sliders, 
  Leaf, 
  TreePine, 
  Volume2, 
  Sparkles, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  Clock, 
  Info,
  Layers,
  ChevronRight,
  ShieldCheck,
  Target
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { speakText } from '../../utils/audio';
import { WASTE_CATEGORIES_INFO } from '../../data/mockData';
import { PatternBadge, ColorAddSymbol } from '../../utils/patterns';
import { WasteCategory } from '../../types';

export const DesktopHomeScreen: React.FC = () => {
  const { 
    currentUser, 
    setScreen, 
    currentDayTheme, 
    accessibility, 
    history, 
    playActionSound,
    setActiveRoutePevId 
  } = useApp();

  const [activeTabMaterial, setActiveTabMaterial] = useState<WasteCategory>('plastic');

  const handleSpeakGreeting = () => {
    const text = `Olá, ${currentUser?.name || 'Guardião ecológico'}. Bem-vindo ao EcoAcess Manaus em seu computador. ` +
      `Hoje é ${currentDayTheme.dayOfWeekName}, ${currentDayTheme.dateFormatted}. ` +
      `Tema ambiental: ${currentDayTheme.themeTag}. ` +
      `Reflexão do dia: ${currentDayTheme.quote.text}. ` +
      `Seu nível atual é ${currentUser?.level || 'Guardião dos Igarapés'} com ${currentUser?.ecoPoints || 340} pontos acumulados.`;
    speakText(text);
  };

  const handleSpeakMission = (title: string, desc: string) => {
    speakText(`Missão: ${title}. Detalhes: ${desc}.`);
  };

  const dailyMissions = [
    {
      id: 'm1',
      title: 'Separar Embalagens Plásticas PET',
      desc: 'Lavar e separar 2 garrafas plásticas para descarte no PEV Sumaúma ou Bilhares.',
      points: 50,
      progress: 66,
      category: 'plastic' as WasteCategory,
      targetAction: 'camera' as const,
      completed: false,
    },
    {
      id: 'm2',
      title: 'Identificar Resíduo Amazônico com IA',
      desc: 'Use a câmera ou envie foto de uma casca de fruta (ex: cupuaçu ou açaí) para entender compostagem.',
      points: 40,
      progress: 100,
      category: 'organic' as WasteCategory,
      targetAction: 'camera' as const,
      completed: true,
    },
    {
      id: 'm3',
      title: 'Localizar Ecoponto no Mapa de Manaus',
      desc: 'Consulte os horários de funcionamento do Ecoponto Redenção ou Coroado.',
      points: 30,
      progress: 40,
      category: 'metal' as WasteCategory,
      targetAction: 'map' as const,
      completed: false,
    },
  ];

  const manausCollectionSchedule = [
    { zone: 'Zona Centro-Sul', bairros: 'Adrianópolis, Vieiralves, Flores', days: 'Terça, Quinta e Sábado', time: '08:00 - 12:00' },
    { zone: 'Zona Oeste', bairros: 'Ponta Negra, Tarumã, Santo Agostinho', days: 'Segunda, Quarta e Sexta', time: '08:00 - 12:00' },
    { zone: 'Zona Norte', bairros: 'Cidade Nova, Manoa, Colônia Terra Nova', days: 'Segunda e Quinta', time: '13:00 - 17:00' },
    { zone: 'Zona Leste', bairros: 'Coroado, São José, Tancredo Neves', days: 'Quarta e Sábado', time: '13:00 - 17:00' },
  ];

  const quickNavCards = [
    {
      id: 'camera',
      title: 'Identificar Resíduo com IA',
      desc: 'Fotografe a embalagem e receba a lixeira e o símbolo tátil correto',
      icon: Camera,
      badgeText: 'Câmera & IA',
      color: 'from-emerald-600/30 to-teal-800/20 border-emerald-500/40 text-emerald-400',
    },
    {
      id: 'map',
      title: 'Ecopontos & Rotas de Manaus',
      desc: 'Descubra os pontos de coleta seletiva e trace a rota mais rápida',
      icon: MapPin,
      badgeText: 'Rotas & PEVs',
      color: 'from-sky-600/30 to-blue-800/20 border-sky-500/40 text-sky-400',
    },
    {
      id: 'rewards',
      title: 'Recompensas da Fauna',
      desc: 'Troque seus ecopontos por medalhas e descontos em parceiros locais',
      icon: Award,
      badgeText: 'Catálogo',
      color: 'from-amber-600/30 to-yellow-800/20 border-amber-500/40 text-amber-400',
    },
    {
      id: 'accessibility',
      title: 'Configurações de Inclusão',
      desc: 'Personalize filtros de daltonismo, áudio, contraste e suporte sensorial',
      icon: Sliders,
      badgeText: 'Acessibilidade',
      color: 'from-purple-600/30 to-indigo-800/20 border-purple-500/40 text-purple-400',
    },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 text-white">
      
      {/* 1. Hero Panoramic Banner - Manaus & Amazonas Theme */}
      <section 
        className="relative rounded-3xl overflow-hidden border border-stone-800 bg-stone-900 shadow-xl group"
        aria-label="Painel de boas-vindas e tema do dia"
      >
        {/* Background photo */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 opacity-25 group-hover:scale-105 pointer-events-none"
          style={{ backgroundImage: `url(${currentDayTheme.wallpaper.imageUrl})` }}
        />
        {/* Ambient Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/85 to-transparent" />

        <div className="relative z-10 p-6 lg:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <TreePine className="w-3.5 h-3.5" />
                Tema: {currentDayTheme.themeTag}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-stone-800/80 text-stone-300 font-mono text-xs flex items-center gap-1.5 border border-stone-700">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                {currentDayTheme.dayOfWeekName}, {currentDayTheme.dateFormatted}
              </span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight">
              Olá, {currentUser?.name || 'Cidadão'}! Vamos cuidar de Manaus hoje?
            </h1>

            <p className="text-sm lg:text-base text-stone-300 leading-relaxed font-normal">
              "{currentDayTheme.quote.text}" — <span className="text-emerald-400 font-semibold">{currentDayTheme.quote.authorOrContext}</span>
            </p>
          </div>

          {/* Quick Audio & Level Box */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-end gap-3 shrink-0">
            <div className="flex items-center gap-3 bg-stone-950/90 border border-stone-800 p-3 rounded-2xl">
              <div className="text-right">
                <div className="text-[11px] text-stone-400 font-mono uppercase">Pontos Acumulados</div>
                <div className="text-xl font-black text-emerald-400 font-mono tabular-nums">
                  {currentUser?.ecoPoints ?? 340} pts
                </div>
              </div>
              <button
                onClick={handleSpeakGreeting}
                className="p-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-emerald-400 transition shadow active:scale-95"
                title="Ouvir orientações em voz alta"
                aria-label="Ouvir saudação e orientações da tela inicial em voz alta"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Two-Column Desktop Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: 8 of 12 (66%) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Daily Ecological Missions */}
          <section aria-labelledby="missions-heading" className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-400" />
                <h2 id="missions-heading" className="text-base font-extrabold text-white uppercase tracking-wider font-mono">
                  Missões Ecológicas do Dia
                </h2>
              </div>
              <span className="text-xs text-stone-400 font-mono">
                2 de 3 concluídas
              </span>
            </div>

            <div className="space-y-3">
              {dailyMissions.map((mission) => {
                const catInfo = WASTE_CATEGORIES_INFO[mission.category];

                return (
                  <div 
                    key={mission.id}
                    className="p-4 rounded-xl bg-stone-950/70 border border-stone-800/80 hover:border-stone-700 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="mt-0.5">
                        {mission.completed ? (
                          <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-400 font-mono text-xs">
                            {mission.id.replace('m', '')}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-white truncate">
                            {mission.title}
                          </h3>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            +{mission.points} pts
                          </span>
                        </div>
                        <p className="text-xs text-stone-300 mt-1 line-clamp-2">
                          {mission.desc}
                        </p>
                        
                        {/* Progress Bar */}
                        <div className="mt-2.5 flex items-center gap-3">
                          <div className="flex-1 bg-stone-800 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className="bg-emerald-500 h-full rounded-full transition-all"
                              style={{ width: `${mission.progress}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-stone-400 font-mono tabular-nums">
                            {mission.progress}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => handleSpeakMission(mission.title, mission.desc)}
                        className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
                        title="Ouvir missão em voz alta"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          playActionSound();
                          setScreen(mission.targetAction);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                          mission.completed
                            ? 'bg-stone-800 text-stone-400 hover:text-white'
                            : 'bg-emerald-500 hover:bg-emerald-400 text-stone-950 shadow-sm'
                        }`}
                      >
                        <span>{mission.completed ? 'Revisar' : 'Cumprir'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Quick Action Navigation Grid */}
          <section aria-labelledby="actions-heading">
            <h2 id="actions-heading" className="text-base font-extrabold text-white uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>Ações Rápidas no Computador</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickNavCards.map((card) => {
                const Icon = card.icon;

                return (
                  <button
                    key={card.id}
                    onClick={() => {
                      playActionSound();
                      setScreen(card.id as any);
                    }}
                    className={`p-5 rounded-2xl bg-gradient-to-br ${card.color} bg-stone-900 border text-left transition hover:scale-[1.01] active:scale-[0.99] flex flex-col justify-between group shadow-md`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800 group-hover:border-emerald-500/50 transition">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider opacity-80">
                        {card.badgeText}
                      </span>
                    </div>

                    <div className="mt-4">
                      <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition">
                        {card.title}
                      </h3>
                      <p className="text-xs text-stone-300 mt-1 line-clamp-2">
                        {card.desc}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center gap-1 text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
                      <span>Acessar</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Manaus Selective Waste Collection Schedule */}
          <section aria-labelledby="schedule-heading" className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-400" />
                <h2 id="schedule-heading" className="text-base font-extrabold text-white uppercase tracking-wider font-mono">
                  Coleta Seletiva em Manaus (SEMULSP)
                </h2>
              </div>
              <span className="text-xs text-stone-400 font-mono">Horários Oficiais</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-stone-800 text-stone-400 font-mono uppercase text-[11px]">
                    <th className="py-2.5 px-3">Zona</th>
                    <th className="py-2.5 px-3">Principais Bairros</th>
                    <th className="py-2.5 px-3">Dias da Semana</th>
                    <th className="py-2.5 px-3">Horário</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60 font-medium">
                  {manausCollectionSchedule.map((item, idx) => (
                    <tr key={idx} className="hover:bg-stone-800/40 transition">
                      <td className="py-2.5 px-3 font-bold text-emerald-400 font-mono">{item.zone}</td>
                      <td className="py-2.5 px-3 text-stone-200">{item.bairros}</td>
                      <td className="py-2.5 px-3 text-stone-300">{item.days}</td>
                      <td className="py-2.5 px-3 text-stone-400 font-mono tabular-nums">{item.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: 4 of 12 (34%) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Family / Student Sustainability Progress */}
          <section aria-labelledby="metrics-heading" className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <h2 id="metrics-heading" className="text-base font-extrabold text-white uppercase tracking-wider font-mono">
                  Metas da Semana
                </h2>
              </div>
              <span className="text-xs text-emerald-400 font-bold font-mono">
                94% de Acerto
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-stone-950/80 border border-stone-800">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-stone-300 font-semibold">Descartes Realizados</span>
                  <span className="text-white font-mono font-bold tabular-nums">12 / 15 itens</span>
                </div>
                <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full w-4/5" />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-950/80 border border-stone-800">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-stone-300 font-semibold">Resíduos Evitados nos Igarapés</span>
                  <span className="text-emerald-400 font-mono font-bold tabular-nums">~8.4 kg</span>
                </div>
                <p className="text-[11px] text-stone-400">
                  Economia estimada de 14.2 litros de água e 3.8 kWh de energia em Manaus.
                </p>
              </div>
            </div>
          </section>

          {/* Accessible Materials Guide with ColorAdd Symbols */}
          <section aria-labelledby="guide-heading" className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" />
                <h2 id="guide-heading" className="text-base font-extrabold text-white uppercase tracking-wider font-mono">
                  Símbolos & Cores
                </h2>
              </div>
              <span className="text-[11px] text-stone-400 font-mono">ColorAdd</span>
            </div>

            <p className="text-xs text-stone-300 mb-3">
              Guia acessível para pessoas com daltonismo e crianças em fase de alfabetização:
            </p>

            <div className="grid grid-cols-2 gap-2">
              {(['plastic', 'paper', 'metal', 'glass', 'organic', 'electronic'] as WasteCategory[]).map((cat) => {
                const info = WASTE_CATEGORIES_INFO[cat];
                const isSelected = activeTabMaterial === cat;

                return (
                  <button
                    key={cat}
                    onClick={() => {
                      playActionSound();
                      setActiveTabMaterial(cat);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-stone-800 border-emerald-500 shadow-sm'
                        : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <div 
                      className="w-4 h-4 rounded-full shrink-0 border border-white/20 shadow-sm"
                      style={{ backgroundColor: info.baseColor }}
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">
                        {info.name}
                      </div>
                      <div className="text-[10px] text-stone-400 font-mono">
                        {info.colorAddSymbol}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Material Deep Dive */}
            <div className="mt-4 p-3.5 rounded-xl bg-stone-950 border border-stone-800 text-xs">
              <div className="font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                {WASTE_CATEGORIES_INFO[activeTabMaterial].name}
              </div>
              <p className="text-stone-300 text-[11px] leading-relaxed">
                {WASTE_CATEGORIES_INFO[activeTabMaterial].standardDisposalNotice}
              </p>
              <div className="mt-2 text-[10px] text-stone-400 font-mono">
                Decomposição em Manaus: {WASTE_CATEGORIES_INFO[activeTabMaterial].decompositionTime}
              </div>
            </div>
          </section>

          {/* Recent Waste Disposals List */}
          <section aria-labelledby="recent-heading" className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-emerald-400" />
                <h2 id="recent-heading" className="text-base font-extrabold text-white uppercase tracking-wider font-mono">
                  Últimos Descartes
                </h2>
              </div>
              <button
                onClick={() => setScreen('history')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-bold"
              >
                Ver Todos
              </button>
            </div>

            <div className="space-y-2.5">
              {history.slice(0, 3).map((item) => {
                const info = WASTE_CATEGORIES_INFO[item.category];

                return (
                  <div 
                    key={item.id}
                    className="p-2.5 rounded-xl bg-stone-950/70 border border-stone-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div 
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: info.baseColor }}
                      />
                      <div className="truncate">
                        <div className="font-bold text-white truncate">{item.name}</div>
                        <div className="text-[10px] text-stone-400 font-mono">{info.name}</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-emerald-400 shrink-0">
                      +{item.ecoPoints} pts
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};
