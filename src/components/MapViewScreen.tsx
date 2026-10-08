import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Compass, 
  Layers, 
  ArrowLeft, 
  Check, 
  Volume2, 
  ChevronRight, 
  Filter,
  Car,
  Footprints,
  Sparkles,
  TreePine,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PEVLocation, WasteCategory, RoutePath } from '../types';
import { 
  MANAUS_GRAPH_NODES, 
  MANAUS_GRAPH_EDGES, 
  calculateShortestPath 
} from '../utils/dijkstra';
import { PatternBadge, ColorAddSymbol } from '../utils/patterns';
import { WASTE_CATEGORIES_INFO } from '../data/mockData';
import { speakText, sound, triggerVibration } from '../utils/audio';

export const MapViewScreen: React.FC = () => {
  const { 
    pevs, 
    activeRoutePevId, 
    setActiveRoutePevId, 
    setScreen, 
    accessibility, 
    playActionSound 
  } = useApp();

  const [selectedPev, setSelectedPev] = useState<PEVLocation>(() => {
    if (activeRoutePevId) {
      const found = pevs.find(p => p.id === activeRoutePevId);
      if (found) return found;
    }
    return pevs[0];
  });

  const [userStartNode, setUserStartNode] = useState<string>('adrianopolis');
  const [filterCategory, setFilterCategory] = useState<WasteCategory | 'all'>('all');
  const [routeAlgorithm, setRouteAlgorithm] = useState<'astar' | 'dijkstra'>('astar');
  const [computedRoute, setComputedRoute] = useState<RoutePath | null>(null);
  const [transitMode, setTransitMode] = useState<'car' | 'walk'>('car');
  const [showDirectionsSheet, setShowDirectionsSheet] = useState(false);

  // Map PEV to closest graph node
  const getPevGraphNodeId = (pev: PEVLocation): string => {
    switch (pev.id) {
      case 'pev-sumauma': return 'cidadenova';
      case 'pev-bilhares': return 'bilhares';
      case 'ecoponto-redencao': return 'redencao';
      case 'ecoponto-coroado': return 'coroado';
      case 'pev-pontanegra': return 'pontanegra';
      case 'pev-adrianopolis': return 'adrianopolis';
      case 'central-taruma': return 'taruma';
      case 'pev-centro-mercado': return 'centro';
      default: return 'bilhares';
    }
  };

  // Compute route when destination or start point changes
  useEffect(() => {
    const targetNodeId = getPevGraphNodeId(selectedPev);
    const route = calculateShortestPath(userStartNode, targetNodeId, routeAlgorithm);
    setComputedRoute(route);
  }, [selectedPev, userStartNode, routeAlgorithm]);

  const handleSelectPev = (pev: PEVLocation) => {
    sound.playClick(accessibility.soundEnabled);
    triggerVibration(40, accessibility.vibrationEnabled);
    setSelectedPev(pev);
    setActiveRoutePevId(pev.id);
  };

  const handleSpeakRoute = () => {
    if (!computedRoute) return;
    const targetNodeId = getPevGraphNodeId(selectedPev);
    const targetNode = MANAUS_GRAPH_NODES[targetNodeId];
    const text = `Melhor opção encontrada com algoritmo ${routeAlgorithm.toUpperCase()}: ${selectedPev.name}, no bairro ${selectedPev.neighborhood}. ` +
      `Distância total: ${computedRoute.totalDistanceKm} quilômetros. Tempo estimado: ${computedRoute.estimatedMinutes} minutos. ` +
      `Primeira instrução: ${computedRoute.instructions[0]?.instruction || ''}. ` +
      `Tipos aceitos: ${selectedPev.acceptedCategories.map(c => WASTE_CATEGORIES_INFO[c]?.name).join(', ')}.`;
    speakText(text);
  };

  // Filter PEVs by category if selected
  const filteredPevs = filterCategory === 'all' 
    ? pevs 
    : pevs.filter(p => p.acceptedCategories.includes(filterCategory));

  return (
    <div className="w-full pb-24 pt-3 px-4 max-w-2xl mx-auto text-white">
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => {
            playActionSound();
            setScreen('home');
          }}
          className="flex items-center gap-1 text-xs font-bold text-stone-300 hover:text-white uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Início</span>
        </button>

        <h1 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-emerald-400" />
          <span>Onde Descartar? · Manaus</span>
        </h1>

        <button
          onClick={handleSpeakRoute}
          className="p-1.5 rounded-lg bg-stone-800 text-emerald-400 hover:bg-stone-700"
          title="Ouvir orientações da rota"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Starting Location & Graph Algorithm Bar */}
      <div className="mb-3 p-3 bg-stone-900 border border-stone-800 rounded-xl space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          
          {/* User Starting Point Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 shrink-0">
              Minha Posição:
            </span>
            <select
              value={userStartNode}
              onChange={(e) => {
                playActionSound();
                setUserStartNode(e.target.value);
              }}
              className="bg-stone-950 border border-stone-700 text-stone-100 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:border-emerald-400"
            >
              {Object.entries(MANAUS_GRAPH_NODES).map(([id, node]) => (
                <option key={id} value={id}>
                  {node.neighborhood} ({node.name.split('(')[0]})
                </option>
              ))}
            </select>
          </div>

          {/* Graph Pathfinding Algorithm Switcher */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <span className="text-[10px] font-mono text-stone-400 uppercase">Algoritmo:</span>
            <button
              type="button"
              onClick={() => setRouteAlgorithm('astar')}
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition ${
                routeAlgorithm === 'astar'
                  ? 'bg-emerald-500 text-stone-950'
                  : 'bg-stone-800 text-stone-300'
              }`}
            >
              A* (Heurística)
            </button>
            <button
              type="button"
              onClick={() => setRouteAlgorithm('dijkstra')}
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition ${
                routeAlgorithm === 'dijkstra'
                  ? 'bg-emerald-500 text-stone-950'
                  : 'bg-stone-800 text-stone-300'
              }`}
            >
              Dijkstra
            </button>
          </div>
        </div>

        {/* Filter by Material Category without relying on color */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <span className="text-[10px] uppercase font-bold text-stone-400 shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filtrar:
          </span>
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-2 py-1 rounded text-[11px] font-bold uppercase shrink-0 transition ${
              filterCategory === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-800 text-stone-300'
            }`}
          >
            Todos os PEVs
          </button>
          {(['plastic', 'paper', 'glass', 'metal', 'electronic'] as WasteCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2 py-1 rounded text-[11px] font-bold uppercase shrink-0 flex items-center gap-1.5 transition ${
                filterCategory === cat
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-800 text-stone-300'
              }`}
            >
              <ColorAddSymbol category={cat} size={14} />
              <span>{WASTE_CATEGORIES_INFO[cat].name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Map of Manaus (SVG Vector Map with Real Nodes & River Geometries) */}
      <div className="relative w-full aspect-[16/11] bg-stone-950 rounded-2xl overflow-hidden border-2 border-stone-700 shadow-2xl mb-4">
        
        <svg 
          viewBox="100 250 750 600" 
          className="w-full h-full select-none"
        >
          {/* Background Grid */}
          <defs>
            <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="1000" height="1000" fill="#0c0a09" />
          <rect x="0" y="0" width="1000" height="1000" fill="url(#map-grid)" />

          {/* Rio Negro (Água escura característica) */}
          <path
            d="M 100 560 Q 200 620 300 680 T 480 820 L 480 850 L 100 850 Z"
            fill="#172554"
            opacity="0.75"
          />
          <text x="180" y="760" fill="#60a5fa" fontSize="14" fontWeight="bold" opacity="0.6" fontStyle="italic">
            RIO NEGRO (MANAUS)
          </text>

          {/* Encontro das Águas */}
          <path
            d="M 480 820 Q 600 830 850 840 L 850 850 L 480 850 Z"
            fill="#854d0e"
            opacity="0.6"
          />
          <text x="560" y="835" fill="#facc15" fontSize="12" fontWeight="bold" opacity="0.7">
            ≈ Encontro das Águas
          </text>

          {/* Igarapé do Mindu / Reserva Adolpho Ducke corridor */}
          <path
            d="M 420 620 Q 510 520 600 450 T 750 350"
            fill="none"
            stroke="#059669"
            strokeWidth="3"
            strokeDasharray="4 4"
            opacity="0.4"
          />
          <text x="560" y="470" fill="#34d399" fontSize="10" opacity="0.7">
            Corredor Ecológico Mindu
          </text>

          {/* Urban Road Network Graph Edges (Avenidas de Manaus) */}
          {MANAUS_GRAPH_EDGES.map((edge, idx) => {
            const nodeA = MANAUS_GRAPH_NODES[edge.from];
            const nodeB = MANAUS_GRAPH_NODES[edge.to];
            if (!nodeA || !nodeB) return null;

            // Check if this edge is part of the computed path
            const isInRoute = computedRoute && computedRoute.nodes.some((n, i) => {
              if (i === 0) return false;
              const prev = computedRoute.nodes[i - 1];
              return (prev.id === edge.from && n.id === edge.to) || (prev.id === edge.to && n.id === edge.from);
            });

            return (
              <line
                key={idx}
                x1={nodeA.x}
                y1={nodeA.y}
                x2={nodeB.x}
                y2={nodeB.y}
                stroke={isInRoute ? '#10b981' : '#44403c'}
                strokeWidth={isInRoute ? 6 : 2}
                strokeLinecap="round"
                className={isInRoute ? 'transition-all duration-500' : ''}
              />
            );
          })}

          {/* Animated Route Flow Pulse */}
          {computedRoute && computedRoute.nodes.length > 1 && (
            <path
              d={computedRoute.nodes.map((n, i) => `${i === 0 ? 'M' : 'L'} ${n.x} ${n.y}`).join(' ')}
              fill="none"
              stroke="#34d399"
              strokeWidth="3"
              strokeDasharray="8 6"
              className="animate-pulse"
            />
          )}

          {/* Urban Graph Nodes */}
          {Object.values(MANAUS_GRAPH_NODES).map((node) => {
            const isUserStart = node.id === userStartNode;
            return (
              <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                <circle
                  r={isUserStart ? 9 : 4}
                  fill={isUserStart ? '#3b82f6' : '#78716c'}
                  stroke="#ffffff"
                  strokeWidth={isUserStart ? 3 : 1}
                />
                {isUserStart && (
                  <circle
                    r="16"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    className="animate-ping"
                    opacity="0.7"
                  />
                )}
                <text
                  x="0"
                  y="-12"
                  textAnchor="middle"
                  fill="#d6d3d1"
                  fontSize="9"
                  fontWeight="bold"
                  className="pointer-events-none drop-shadow"
                >
                  {node.neighborhood}
                </text>
              </g>
            );
          })}

          {/* PEV Location Pins with Distinct Geometric Symbols (Not color alone) */}
          {filteredPevs.map((pev) => {
            const isSelected = selectedPev.id === pev.id;
            const targetNodeId = getPevGraphNodeId(pev);
            const node = MANAUS_GRAPH_NODES[targetNodeId] || { x: pev.coordinates.x, y: pev.coordinates.y };

            return (
              <g
                key={pev.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => handleSelectPev(pev)}
                className="cursor-pointer transition-transform duration-200 hover:scale-125"
              >
                {/* Outer halo if selected */}
                {isSelected && (
                  <circle
                    r="24"
                    fill="#10b981"
                    opacity="0.3"
                    className="animate-pulse"
                  />
                )}

                {/* Pin Container: Geometric Diamond / Octagon */}
                <polygon
                  points="0,-18 14,-4 0,10 -14,-4"
                  fill={isSelected ? '#10b981' : '#1c1917'}
                  stroke="#ffffff"
                  strokeWidth={isSelected ? 3 : 2}
                />

                {/* Distinct geometric icon inside */}
                <circle
                  cx="0"
                  cy="-4"
                  r="4"
                  fill={isSelected ? '#022c22' : '#22c55e'}
                />

                {/* PEV Label */}
                <rect
                  x="-45"
                  y="12"
                  width="90"
                  height="16"
                  rx="3"
                  fill="#000000"
                  opacity="0.8"
                  stroke={isSelected ? '#10b981' : '#57534e'}
                  strokeWidth="1"
                />
                <text
                  x="0"
                  y="23"
                  textAnchor="middle"
                  fill={isSelected ? '#34d399' : '#ffffff'}
                  fontSize="8"
                  fontWeight="bold"
                >
                  {pev.name.replace('PEV ', '').replace('Ecoponto ', '').slice(0, 14)}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Map Legend with Non-Color Indicators */}
        <div className="absolute bottom-2 left-2 bg-black/85 backdrop-blur-md p-2 rounded-lg border border-stone-700 text-[10px] space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-stone-200">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 border border-white" />
            <span>Sua Posição</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold text-emerald-400">
            <span className="w-2.5 h-2.5 rotate-45 bg-emerald-500 border border-white" />
            <span>PEV / Ecoponto</span>
          </div>
        </div>

        {/* Algorithm badge */}
        <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded border border-white/20 text-[10px] font-mono text-emerald-300">
          Grafo: {MANAUS_GRAPH_EDGES.length} Avenidas · Algoritmo: {routeAlgorithm.toUpperCase()}
        </div>
      </div>

      {/* Selected PEV & Recommended Route Card (Requirement 11) */}
      <div className="bg-stone-900 border-2 border-emerald-500/70 rounded-2xl p-4 shadow-xl mb-4">
        
        {/* Header: Melhor Opção Encontrada */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase font-bold text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Melhor Opção Encontrada ({routeAlgorithm.toUpperCase()})
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white mt-0.5">
              {selectedPev.name}
            </h2>
            <p className="text-xs text-stone-300">
              {selectedPev.address} · <span className="text-emerald-300 font-semibold">{selectedPev.neighborhood}</span>
            </p>
          </div>

          <div className="text-right">
            <span className="text-xl font-black text-white block">
              {computedRoute?.totalDistanceKm || 2.4} km
            </span>
            <span className="text-[11px] text-emerald-400 font-mono font-bold flex items-center justify-end gap-1">
              <Clock className="w-3 h-3" /> ~{computedRoute?.estimatedMinutes || 12} min
            </span>
          </div>
        </div>

        {/* Materials accepted with ColorADD and Pattern Badges */}
        <div className="py-3 border-b border-stone-800">
          <span className="text-[11px] uppercase font-bold text-stone-400 block mb-2">
            Tipos de Resíduos Aceitos (Identificação por Símbolos):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {selectedPev.acceptedCategories.map((cat) => (
              <PatternBadge key={cat} category={cat} />
            ))}
          </div>
        </div>

        {/* Schedule & Management info */}
        <div className="py-2.5 flex items-center justify-between text-xs text-stone-300">
          <div>
            <span className="text-stone-400 font-semibold">Horário: </span>
            <span>{selectedPev.openingHours}</span>
          </div>
          <span className="text-[11px] text-stone-400 bg-stone-800 px-2 py-0.5 rounded">
            {selectedPev.managedBy}
          </span>
        </div>

        {/* Action: Ver instruções passo a passo da rota */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            onClick={() => setShowDirectionsSheet(!showDirectionsSheet)}
            className="py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-100 font-bold text-xs uppercase tracking-wider rounded-xl border border-stone-700 flex items-center justify-center gap-1.5 transition active:scale-95"
          >
            <Navigation className="w-4 h-4 text-emerald-400" />
            <span>{showDirectionsSheet ? 'Ocultar Rota' : 'Passo a Passo'}</span>
          </button>

          <button
            onClick={handleSpeakRoute}
            className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg border border-emerald-400 flex items-center justify-center gap-1.5 transition active:scale-95"
          >
            <Volume2 className="w-4 h-4" />
            <span>Ouvir Rota</span>
          </button>
        </div>

        {/* Step by Step Route Instructions Drawer */}
        {showDirectionsSheet && computedRoute && (
          <div className="mt-3 pt-3 border-t border-stone-800 space-y-2 animate-fade-in">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-2">
              Instruções de Navegação Urbana Manaus ({computedRoute.instructions.length} passos):
            </h3>
            {computedRoute.instructions.map((inst, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-stone-950/80 border border-stone-800 flex items-start gap-2.5 text-xs text-stone-200">
                <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600/50 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  {inst.step}
                </span>
                <div className="flex-1">
                  <p className="leading-snug">{inst.instruction}</p>
                  <span className="text-[10px] text-stone-400 font-mono mt-0.5 block">
                    {inst.street} · {inst.distanceKm} km
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* List of All PEVs in Manaus */}
      <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-400 mb-3 flex items-center gap-2">
        <span>Todos os Pontos Cadastrados em Manaus ({filteredPevs.length})</span>
      </h3>

      <div className="space-y-2.5">
        {filteredPevs.map((pev) => (
          <div
            key={pev.id}
            onClick={() => handleSelectPev(pev)}
            className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex items-center justify-between ${
              selectedPev.id === pev.id
                ? 'bg-emerald-950/40 border-emerald-400 text-white'
                : 'bg-stone-900 border-stone-800 hover:border-stone-700 text-stone-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center text-emerald-400 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-white">
                  {pev.name}
                </h4>
                <p className="text-[11px] text-stone-400">
                  {pev.neighborhood} · {pev.reference}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  {pev.acceptedCategories.map((c) => (
                    <ColorAddSymbol key={c} category={c} size={14} />
                  ))}
                </div>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-stone-400" />
          </div>
        ))}
      </div>

    </div>
  );
};
