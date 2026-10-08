import React, { useState } from 'react';
import { 
  Volume2, 
  VolumeX, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  Leaf, 
  AlertCircle,
  Share2,
  X
} from 'lucide-react';
import { WasteIdentificationResult, WasteCategory } from '../types';
import { WASTE_CATEGORIES_INFO } from '../data/mockData';
import { ColorAddSymbol, PatternBadge } from '../utils/patterns';
import { speakText, stopSpeech, sound, triggerVibration } from '../utils/audio';
import { useApp } from '../context/AppContext';

export const ResultModal: React.FC<{
  result: WasteIdentificationResult;
  onClose: () => void;
  onNavigateToPev: (pevId: string) => void;
}> = ({ result, onClose, onNavigateToPev }) => {
  const { accessibility, pevs } = useApp();
  const [isSpeakingNow, setIsSpeakingNow] = useState(false);

  const categoryInfo = WASTE_CATEGORIES_INFO[result.category] || WASTE_CATEGORIES_INFO.plastic;
  const recommendedPev = pevs.find(p => p.id === result.recommendedPevId) || pevs[0];

  const handleSpeak = () => {
    if (isSpeakingNow) {
      stopSpeech();
      setIsSpeakingNow(false);
      return;
    }

    const textToSpeak = `Resíduo identificado: ${result.name}. Categoria: ${categoryInfo.name}. ` +
      `Símbolo visual: ${categoryInfo.colorAddSymbol}. Padrão tátil: ${categoryInfo.patternDescription}. ` +
      `Como descartar: ${result.instructions.join('. ')}. ` +
      `Recomendação para Manaus: descarte no ${recommendedPev.name}, localizado no bairro ${recommendedPev.neighborhood}. ` +
      `Você recebeu ${result.ecoPoints} EcoPontos pela atitude sustentável!`;

    setIsSpeakingNow(true);
    speakText(textToSpeak, () => setIsSpeakingNow(false));
  };

  const handleRouteClick = () => {
    sound.playRouteNav(accessibility.soundEnabled);
    triggerVibration([50, 40, 50], accessibility.vibrationEnabled);
    onNavigateToPev(result.recommendedPevId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-lg bg-stone-900 border-2 border-emerald-500/80 rounded-2xl shadow-2xl overflow-hidden my-auto">
        
        {/* Top Header */}
        <div className="bg-stone-950 px-4 py-3 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
              Resultado da Inteligência Artificial
            </h2>
          </div>
          <button
            onClick={() => {
              stopSpeech();
              onClose();
            }}
            className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
            aria-label="Fechar resultado"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 max-h-[80vh] overflow-y-auto space-y-4">
          
          {/* Main Identification Header: Never depends only on color! */}
          <div className="p-4 rounded-xl bg-stone-950/80 border-2 border-stone-700 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block font-bold">
                  Resíduo Identificado com {(result.confidence * 100).toFixed(0)}% de precisão
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5 tracking-tight">
                  {result.name}
                </h3>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider mt-1 block">
                  CATEGORIA: {categoryInfo.name}
                </span>
              </div>

              {/* Photo Thumbnail */}
              <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-stone-700 shrink-0 bg-stone-800">
                <img src={result.imageUrl} alt={result.name} className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Pattern Badge + ColorADD Symbol Display */}
            <div className="pt-2 border-t border-stone-800 flex flex-wrap items-center gap-2">
              <PatternBadge category={result.category} label={categoryInfo.name} />
              
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-stone-800 rounded-md border border-stone-700 text-xs font-mono text-stone-300">
                <span className="opacity-70 font-sans">Símbolo ColorADD:</span>
                <ColorAddSymbol category={result.category} size={20} showLabel={false} />
                <span className="font-bold">{categoryInfo.colorAddSymbol.split(':')[1] || categoryInfo.colorAddSymbol}</span>
              </div>
            </div>
          </div>

          {/* Audio Speech Button (Requirement 9) */}
          <button
            onClick={handleSpeak}
            className={`w-full py-3 px-4 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg transition active:scale-95 cursor-pointer border-2 ${
              isSpeakingNow
                ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 border-amber-300 animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400'
            }`}
            aria-label="Ouvir instruções em voz alta"
          >
            {isSpeakingNow ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            <span>{isSpeakingNow ? 'PARAR LEITURA EM VOZ ALTA' : '🔊 OUVIR INFORMAÇÃO EM VOZ ALTA'}</span>
          </button>

          {/* Instructions: Como Descartar? */}
          <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2 mb-2.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Como Descartar Corretamente?</span>
            </h4>

            <ul className="space-y-2 text-xs sm:text-sm text-stone-200">
              {result.instructions.map((inst, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-[11px] font-bold text-emerald-400 shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-snug">{inst}</span>
                </li>
              ))}
            </ul>

            <div className="mt-3 pt-2.5 border-t border-stone-800 text-[11px] text-stone-400 flex items-center gap-1.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{result.cleanlinessNotice}</span>
            </div>
          </div>

          {/* Environmental Fact & EcoPoints */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800">
              <span className="text-[10px] uppercase font-bold text-stone-400 block flex items-center gap-1">
                <Clock className="w-3 h-3 text-stone-300" /> Degradação
              </span>
              <span className="font-bold text-stone-100 mt-1 block">
                {result.decompositionTime}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40">
              <span className="text-[10px] uppercase font-bold text-emerald-400 block flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" /> EcoPontos Ganhos
              </span>
              <span className="font-extrabold text-emerald-300 mt-1 block text-sm">
                +{result.ecoPoints} PONTOS
              </span>
            </div>
          </div>

          {/* Nearest Manaus PEV Recommendation */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/60 to-stone-950 border-2 border-blue-500/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-400" />
                Melhor Ponto de Coleta em Manaus
              </span>
              <span className="text-[10px] bg-blue-900/60 text-blue-200 px-2 py-0.5 rounded font-mono">
                {recommendedPev.neighborhood}
              </span>
            </div>

            <h5 className="font-bold text-sm text-white">
              {recommendedPev.name}
            </h5>
            <p className="text-xs text-stone-300 mt-0.5">
              {recommendedPev.address}
            </p>
            <p className="text-[11px] text-stone-400 mt-1">
              Horário: {recommendedPev.openingHours}
            </p>

            <button
              onClick={handleRouteClick}
              className="mt-3 w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
            >
              <MapPin className="w-4 h-4" />
              <span>Ver Rota no Mapa (Dijkstra / A*)</span>
            </button>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-stone-950 px-5 py-3 border-t border-stone-800 flex items-center justify-end">
          <button
            onClick={() => {
              stopSpeech();
              onClose();
            }}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs uppercase tracking-wider rounded-xl transition"
          >
            Concluir
          </button>
        </div>

      </div>
    </div>
  );
};
