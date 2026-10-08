import React, { useState } from 'react';
import { 
  History, 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Sparkles, 
  CheckCircle, 
  Volume2, 
  Filter,
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WASTE_CATEGORIES_INFO } from '../data/mockData';
import { PatternBadge, ColorAddSymbol } from '../utils/patterns';
import { WasteCategory } from '../types';
import { speakText, sound } from '../utils/audio';

export const HistoryScreen: React.FC = () => {
  const { 
    history, 
    setScreen, 
    pevs, 
    setActiveRoutePevId, 
    playActionSound,
    accessibility 
  } = useApp();

  const [filterCat, setFilterCat] = useState<WasteCategory | 'all'>('all');

  const filteredHistory = filterCat === 'all'
    ? history
    : history.filter(item => item.category === filterCat);

  const handleSpeakItem = (item: typeof history[0]) => {
    const pev = pevs.find(p => p.id === item.recommendedPevId) || pevs[0];
    const cat = WASTE_CATEGORIES_INFO[item.category];
    const text = `Registro de ${item.name}. Categoria: ${cat.name}. Descarte recomendado no ${pev.name}.`;
    speakText(text);
  };

  const handleNavigatePev = (pevId: string) => {
    setActiveRoutePevId(pevId);
    setScreen('map');
  };

  return (
    <div className="w-full pb-24 pt-3 px-4 max-w-xl mx-auto text-white">
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3">
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

        <h1 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center gap-1.5">
          <History className="w-4 h-4 text-amber-400" />
          <span>Meu Histórico de Descartes</span>
        </h1>

        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-600/40">
          {history.length} itens
        </span>
      </div>

      {/* Filter by Category */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 no-scrollbar">
        <span className="text-[10px] uppercase font-bold text-stone-400 shrink-0">Filtrar:</span>
        <button
          onClick={() => setFilterCat('all')}
          className={`px-2 py-1 rounded text-[11px] font-bold uppercase shrink-0 transition ${
            filterCat === 'all' ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-stone-300'
          }`}
        >
          Todos
        </button>
        {(['plastic', 'paper', 'glass', 'metal', 'electronic'] as WasteCategory[]).map((c) => (
          <button
            key={c}
            onClick={() => setFilterCat(c)}
            className={`px-2 py-1 rounded text-[11px] font-bold uppercase shrink-0 flex items-center gap-1 transition ${
              filterCat === c ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-stone-300'
            }`}
          >
            <ColorAddSymbol category={c} size={14} />
            <span>{WASTE_CATEGORIES_INFO[c].name.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* History Items List */}
      {filteredHistory.length === 0 ? (
        <div className="p-8 bg-stone-900 border border-stone-800 rounded-2xl text-center space-y-3">
          <History className="w-12 h-12 text-stone-600 mx-auto" />
          <h2 className="text-base font-bold text-white">Nenhum resíduo nesta categoria</h2>
          <p className="text-xs text-stone-400 max-w-xs mx-auto">
            Use a câmera do EcoAcess para fotografar e identificar materiais recicláveis em Manaus.
          </p>
          <button
            onClick={() => {
              playActionSound();
              setScreen('camera');
            }}
            className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase rounded-xl transition"
          >
            Fotografar Resíduo
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item) => {
            const catInfo = WASTE_CATEGORIES_INFO[item.category] || WASTE_CATEGORIES_INFO.plastic;
            const targetPev = pevs.find(p => p.id === item.recommendedPevId) || pevs[0];
            const dateStr = new Date(item.timestamp).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div 
                key={item.id}
                className="p-4 bg-stone-900/95 border-2 border-stone-800 hover:border-amber-500/60 rounded-2xl shadow-lg transition space-y-3"
              >
                {/* Header: Photo, Name, and Date */}
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-stone-700 shrink-0 bg-stone-950">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-stone-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-stone-500" />
                        {dateStr}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400 font-mono">
                        +{item.ecoPoints} pts
                      </span>
                    </div>

                    <h2 className="text-sm sm:text-base font-extrabold text-white mt-0.5 leading-snug">
                      {item.name}
                    </h2>

                    <div className="mt-1 flex items-center gap-2">
                      <PatternBadge category={item.category} label={catInfo.name} />
                    </div>
                  </div>
                </div>

                {/* Forma Recomendada de Descarte */}
                <div className="p-2.5 rounded-xl bg-stone-950/70 border border-stone-800 text-xs text-stone-300">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">
                    Forma Recomendada de Descarte:
                  </span>
                  <p className="leading-snug">
                    {item.instructions[0] || 'Lavar, compactar e encaminhar ao PEV de coleta seletiva.'}
                  </p>
                </div>

                {/* Local Recomendado em Manaus */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-800 text-xs">
                  <div className="flex items-center gap-1.5 text-stone-300">
                    <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="truncate max-w-[200px] font-medium">
                      {targetPev.name} ({targetPev.neighborhood})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSpeakItem(item)}
                      className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white"
                      title="Ouvir registro"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleNavigatePev(targetPev.id)}
                      className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] uppercase transition"
                    >
                      Ver Rota
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
