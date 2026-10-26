import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Volume2, 
  Filter, 
  Search, 
  Car, 
  Footprints, 
  Sparkles,
  TreePine,
  Check,
  ChevronRight,
  ShieldCheck,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PEVLocation, WasteCategory, RoutePath } from '../../types';
import { 
  MANAUS_GRAPH_NODES, 
  MANAUS_GRAPH_EDGES, 
  calculateShortestPath 
} from '../../utils/dijkstra';
import { WASTE_CATEGORIES_INFO } from '../../data/mockData';
import { PatternBadge, ColorAddSymbol } from '../../utils/patterns';
import { speakText } from '../../utils/audio';

export const DesktopMapView: React.FC = () => {
  const { 
    pevs, 
    activeRoutePevId, 
    setActiveRoutePevId, 
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
  const [searchTerm, setSearchTerm] = useState('');

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

  useEffect(() => {
    const targetNodeId = getPevGraphNodeId(selectedPev);
    const route = calculateShortestPath(userStartNode, targetNodeId, routeAlgorithm);
    setComputedRoute(route);
  }, [selectedPev, userStartNode, routeAlgorithm]);

  const handleSelectPev = (pev: PEVLocation) => {
    playActionSound();
    setSelectedPev(pev);
    setActiveRoutePevId(pev.id);
  };

  const handleSpeakRoute = () => {
    if (!computedRoute) return;
    const text = `Rota para ${selectedPev.name}, no bairro ${selectedPev.neighborhood}. ` +
      `Distância: ${computedRoute.totalDistanceKm} quilômetros. Tempo estimado: ${computedRoute.estimatedMinutes} minutos. ` +
      `Instrução: ${computedRoute.instructions[0]?.instruction || ''}. ` +
      `Tipos aceitos: ${selectedPev.acceptedCategories.map(c => WASTE_CATEGORIES_INFO[c]?.name).join(', ')}.`;
    speakText(text);
  };

  const filteredPevs = pevs.filter(p => {
    const matchesCategory = filterCategory === 'all' || p.acceptedCategories.includes(filterCategory);
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.neighborhood.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-white">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <MapPin className="w-6 h-6 text-emerald-400" />
            <span>Rede de Ecopontos & Rotas Inteligentes de Manaus</span>
          </h1>
          <p className="text-xs lg:text-sm text-stone-400 mt-1">
            Algoritmos A* e Dijkstra para cálculo do trajeto de descarte mais rápido na malha urbana da capital.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSpeakRoute}
            className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-emerald-400 border border-stone-700 transition"
            title="Ouvir orientações da rota em voz alta"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Split Desktop Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: 5 of 12 (Filters & List of Ecopoints) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Controls Bar */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-[11px] font-mono font-bold text-stone-400 uppercase">Partida:</span>
                <select
                  value={userStartNode}
                  onChange={(e) => {
                    playActionSound();
                    setUserStartNode(e.target.value);
                  }}
                  className="bg-stone-950 border border-stone-700 text-stone-100 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:border-emerald-400 flex-1"
                >
                  {Object.entries(MANAUS_GRAPH_NODES).map(([id, node]) => (
                    <option key={id} value={id}>
                      {node.neighborhood} ({node.name.split('(')[0]})
                    </option>
                  ))}
                </select>
              </div>

              {/* Algorithm switcher */}
              <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-lg border border-stone-800 text-[10px] font-mono">
                <button
                  onClick={() => setRouteAlgorithm('astar')}
                  className={`px-2 py-0.5 rounded font-bold transition ${
                    routeAlgorithm === 'astar' ? 'bg-emerald-500 text-stone-950' : 'text-stone-400'
                  }`}
                >
                  A*
                </button>
                <button
                  onClick={() => setRouteAlgorithm('dijkstra')}
                  className={`px-2 py-0.5 rounded font-bold transition ${
                    routeAlgorithm === 'dijkstra' ? 'bg-emerald-500 text-stone-950' : 'text-stone-400'
                  }`}
                >
                  Dijkstra
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por bairro (ex: Adrianópolis, Ponta Negra)..."
                className="w-full pl-8 pr-3 py-1.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Waste Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold uppercase shrink-0 transition ${
                  filterCategory === 'all' ? 'bg-emerald-500 text-stone-950' : 'bg-stone-950 text-stone-400 hover:text-white'
                }`}
              >
                Todos
              </button>
              {(['plastic', 'paper', 'glass', 'metal', 'electronic'] as WasteCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold uppercase shrink-0 flex items-center gap-1 transition ${
                    filterCategory === cat ? 'bg-emerald-500 text-stone-950' : 'bg-stone-950 text-stone-400 hover:text-white'
                  }`}
                >
                  <span>{cat}</span>
                </button>
              ))}
            </div>
          </div>

          {/* List of Ecopoints */}
          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {filteredPevs.map((pev) => {
              const isSelected = selectedPev.id === pev.id;

              return (
                <button
                  key={pev.id}
                  onClick={() => handleSelectPev(pev)}
                  className={`w-full p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                    isSelected
                      ? 'bg-stone-900 border-emerald-500 shadow-md ring-1 ring-emerald-500'
                      : 'bg-stone-900/60 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white leading-tight">
                          {pev.name}
                        </h3>
                        {isSelected && (
                          <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                            Destino Selecionado
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-emerald-400 font-mono mt-0.5">
                        {pev.neighborhood}
                      </div>
                      <div className="text-[11px] text-stone-400 mt-1">
                        {pev.address}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-stone-400 font-mono">
                        {pev.openingHours.split(' ')[0]}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-stone-800/80 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1">
                      {pev.acceptedCategories.map((c) => (
                        <span 
                          key={c}
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: WASTE_CATEGORIES_INFO[c]?.baseColor }}
                          title={WASTE_CATEGORIES_INFO[c]?.name}
                        />
                      ))}
                    </div>
                    <span className="text-stone-400 font-mono text-[10px]">
                      {pev.managedBy}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Route Summary Card */}
          {computedRoute && (
            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 text-xs space-y-2">
              <div className="flex items-center justify-between text-emerald-400 font-bold font-mono">
                <span className="flex items-center gap-1.5">
                  <Navigation className="w-4 h-4" />
                  <span>Itinerário Calculado ({routeAlgorithm.toUpperCase()})</span>
                </span>
                <span className="tabular-nums">
                  {computedRoute.totalDistanceKm} km · ~{computedRoute.estimatedMinutes} min
                </span>
              </div>
              <p className="text-stone-300 text-[11px]">
                {computedRoute.instructions[0]?.instruction}
              </p>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: 7 of 12 (Large SVG Vector Map of Manaus) */}
        <div className="lg:col-span-7 bg-stone-900 border border-stone-800 rounded-3xl p-4 shadow-xl">
          <div className="relative w-full aspect-[16/11] bg-stone-950 rounded-2xl overflow-hidden border border-stone-800 shadow-inner">
            <svg 
              viewBox="100 250 750 600" 
              className="w-full h-full select-none"
            >
              {/* Background Grid */}
              <defs>
                <pattern id="desktop-map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect x="0" y="0" width="1000" height="1000" fill="#0c0a09" />
              <rect x="0" y="0" width="1000" height="1000" fill="url(#desktop-map-grid)" />

              {/* Rio Negro */}
              <path
                d="M 100 560 Q 200 620 300 680 T 480 820 L 480 850 L 100 850 Z"
                fill="#172554"
                opacity="0.8"
              />
              <text x="180" y="760" fill="#60a5fa" fontSize="15" fontWeight="bold" opacity="0.7" fontStyle="italic">
                RIO NEGRO (MANAUS)
              </text>

              {/* Encontro das Águas */}
              <path
                d="M 480 820 Q 600 830 850 840 L 850 850 L 480 850 Z"
                fill="#854d0e"
                opacity="0.65"
              />
              <text x="560" y="835" fill="#facc15" fontSize="13" fontWeight="bold" opacity="0.8">
                ≈ Encontro das Águas
              </text>

              {/* Igarapé do Mindu corridor */}
              <path
                d="M 420 620 Q 510 520 600 450 T 750 350"
                fill="none"
                stroke="#059669"
                strokeWidth="3.5"
                strokeDasharray="5 5"
                opacity="0.45"
              />
              <text x="560" y="470" fill="#34d399" fontSize="11" opacity="0.8" fontStyle="italic">
                Corredor Ecológico Mindu
              </text>

              {/* Road network edges */}
              {MANAUS_GRAPH_EDGES.map((edge, idx) => {
                const nodeA = MANAUS_GRAPH_NODES[edge.from];
                const nodeB = MANAUS_GRAPH_NODES[edge.to];
                if (!nodeA || !nodeB) return null;

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
                    strokeWidth={isInRoute ? 7 : 2.5}
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
                  strokeWidth="3.5"
                  strokeDasharray="8 6"
                  className="animate-pulse"
                />
              )}

              {/* Graph Nodes */}
              {Object.entries(MANAUS_GRAPH_NODES).map(([id, node]) => {
                const isStart = id === userStartNode;
                const isDest = id === getPevGraphNodeId(selectedPev);

                return (
                  <g key={id} className="cursor-pointer">
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isStart || isDest ? 14 : 7}
                      fill={isStart ? '#3b82f6' : isDest ? '#10b981' : '#78716c'}
                      stroke="#ffffff"
                      strokeWidth={isStart || isDest ? 3 : 1.5}
                    />
                    <text
                      x={node.x + 16}
                      y={node.y + 4}
                      fill="#ffffff"
                      fontSize={isStart || isDest ? '13' : '10'}
                      fontWeight={isStart || isDest ? 'bold' : 'normal'}
                      filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))"
                    >
                      {node.neighborhood}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Map Legend */}
            <div className="absolute bottom-3 left-3 bg-stone-950/90 border border-stone-800 px-3 py-2 rounded-xl text-[10px] font-mono flex items-center gap-4 text-stone-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span>Sua Partida</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Ecoponto Destino</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-emerald-400" />
                <span>Rota Ideal</span>
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
