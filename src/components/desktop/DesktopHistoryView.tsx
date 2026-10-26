import React, { useState } from 'react';
import { 
  History, 
  MapPin, 
  Sparkles, 
  Calendar, 
  Volume2, 
  Filter, 
  Trash2,
  TrendingUp,
  Download,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WASTE_CATEGORIES_INFO } from '../../data/mockData';
import { PatternBadge, ColorAddSymbol } from '../../utils/patterns';
import { WasteCategory } from '../../types';
import { speakText } from '../../utils/audio';

export const DesktopHistoryView: React.FC = () => {
  const { 
    history, 
    setScreen, 
    pevs, 
    setActiveRoutePevId, 
    playActionSound,
    accessibility 
  } = useApp();

  const [filterCat, setFilterCat] = useState<WasteCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = history.filter(item => {
    const matchesCategory = filterCat === 'all' || item.category === filterCat;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPoints = history.reduce((acc, curr) => acc + curr.ecoPoints, 0);

  const handleSpeakItem = (item: typeof history[0]) => {
    const pev = pevs.find(p => p.id === item.recommendedPevId) || pevs[0];
    const cat = WASTE_CATEGORIES_INFO[item.category];
    const text = `Registro de ${item.name}. Categoria: ${cat.name}. Pontos ganhos: ${item.ecoPoints}. Descarte recomendado no ${pev.name}.`;
    speakText(text);
  };

  const handleNavigatePev = (pevId: string) => {
    setActiveRoutePevId(pevId);
    setScreen('map');
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-white">
      
      {/* Header & Stats Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-emerald-400" />
            <span>Histórico de Identificações & Descartes</span>
          </h1>
          <p className="text-xs lg:text-sm text-stone-400 mt-1">
            Registro cronológico das ações ecológicas realizadas com cálculo do impacto nos igarapés de Manaus.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-stone-900 border border-stone-800 text-right">
            <div className="text-[11px] text-stone-400 font-mono uppercase">Pontos Conquistados</div>
            <div className="text-xl font-black text-emerald-400 font-mono tabular-nums">
              +{totalPoints} pts
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
          <button
            onClick={() => setFilterCat('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
              filterCat === 'all' ? 'bg-emerald-500 text-stone-950 shadow-sm' : 'bg-stone-950 text-stone-400 hover:text-white'
            }`}
          >
            Todos ({history.length})
          </button>
          {(['plastic', 'paper', 'metal', 'glass', 'organic', 'electronic'] as WasteCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${
                filterCat === cat ? 'bg-emerald-500 text-stone-950 shadow-sm' : 'bg-stone-950 text-stone-400 hover:text-white'
              }`}
            >
              <span 
                className="w-2.5 h-2.5 rounded-full" 
                style={{ backgroundColor: WASTE_CATEGORIES_INFO[cat].baseColor }} 
              />
              <span>{WASTE_CATEGORIES_INFO[cat].name.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filtrar por nome do resíduo..."
            className="w-full px-3 py-1.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-stone-800 text-stone-400 font-mono uppercase text-[11px] bg-stone-950/60">
              <th className="py-3 px-4">Item Identificado</th>
              <th className="py-3 px-4">Categoria & Símbolo ColorAdd</th>
              <th className="py-3 px-4">Ecoponto Indicado</th>
              <th className="py-3 px-4">Pontuação</th>
              <th className="py-3 px-4">Data / Hora</th>
              <th className="py-3 px-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800/60 font-medium">
            {filteredHistory.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-stone-400">
                  Nenhum registro encontrado para este filtro.
                </td>
              </tr>
            ) : (
              filteredHistory.map((item) => {
                const info = WASTE_CATEGORIES_INFO[item.category];
                const pev = pevs.find(p => p.id === item.recommendedPevId) || pevs[0];

                return (
                  <tr key={item.id} className="hover:bg-stone-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.imageUrl} 
                          alt={item.name} 
                          className="w-10 h-10 object-cover rounded-xl border border-stone-700 shrink-0" 
                        />
                        <div>
                          <div className="font-bold text-white text-sm">{item.name}</div>
                          <div className="text-[10px] text-stone-400 font-mono">{item.environmentalImpact}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3.5 h-3.5 rounded-full shrink-0"
                          style={{ backgroundColor: info.baseColor }}
                        />
                        <span className="text-stone-200 font-semibold">{info.name}</span>
                        <span className="text-[10px] text-stone-400 font-mono">({info.colorAddSymbol})</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-white font-semibold">{pev.name}</div>
                      <div className="text-[10px] text-emerald-400 font-mono">{pev.neighborhood}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400 tabular-nums">
                      +{item.ecoPoints} pts
                    </td>

                    <td className="py-3.5 px-4 text-stone-400 font-mono text-[11px]">
                      {new Date(item.timestamp).toLocaleDateString('pt-BR')} às {new Date(item.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleSpeakItem(item)}
                          className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition"
                          title="Ouvir detalhes em voz alta"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleNavigatePev(item.recommendedPevId)}
                          className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-emerald-400 hover:text-emerald-300 transition"
                          title="Ver localização no mapa"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
