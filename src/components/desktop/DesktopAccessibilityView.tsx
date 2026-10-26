import React from 'react';
import { 
  Sliders, 
  Eye, 
  Volume2, 
  Sparkles, 
  Sun, 
  Type, 
  Check, 
  RotateCcw,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ColorBlindnessType, ContrastMode, FontSizeOption } from '../../types';
import { WASTE_CATEGORIES_INFO } from '../../data/mockData';
import { PatternBadge, ColorAddSymbol } from '../../utils/patterns';
import { speakText } from '../../utils/audio';

export const DesktopAccessibilityView: React.FC = () => {
  const { accessibility, updateAccessibility, playActionSound } = useApp();

  const daltonismOptions: { id: ColorBlindnessType; name: string; desc: string }[] = [
    { id: 'none', name: 'Visão Típica', desc: 'Sem alteração de percepção de cor' },
    { id: 'deuteranopia', name: 'Deuteranopia', desc: 'Dificuldade com tons de verde' },
    { id: 'protanopia', name: 'Protanopia', desc: 'Dificuldade com tons de vermelho' },
    { id: 'tritanopia', name: 'Tritanopia', desc: 'Dificuldade com tons de azul e amarelo' },
    { id: 'achromatopsia', name: 'Acromatopsia', desc: 'Visão monocromática (tons de cinza)' },
  ];

  const contrastOptions: { id: ContrastMode; label: string; desc: string }[] = [
    { id: 'normal', label: 'Padrão (Escuro)', desc: 'Tema escuro suave' },
    { id: 'high-contrast-dark', label: 'Alto Contraste Preto/Branco', desc: 'Máxima legibilidade WCAG AAA' },
    { id: 'yellow-black', label: 'Amarelo sobre Preto', desc: 'Ideal para baixa visão' },
    { id: 'high-contrast-light', label: 'Fundo Claro / Alto Contraste', desc: 'Fundo branco puro' },
  ];

  const handleTestSpeech = () => {
    speakText('O leitor de voz do EcoAcess Manaus está funcionando perfeitamente. Ele lê rótulos, instruções de reciclagem e localização de ecopontos.');
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 text-white">
      
      {/* Header */}
      <div>
        <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <Sliders className="w-6 h-6 text-emerald-400" />
          <span>Central de Inclusão, Sensorial & Acessibilidade</span>
        </h1>
        <p className="text-xs lg:text-sm text-stone-400 mt-1">
          Ajuste as preferências de visualização, cores, áudio e assistência cognitiva para o conforto de cada pessoa.
        </p>
      </div>

      {/* Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Settings Controls (7 of 12) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Daltonism and Vision Filter */}
          <section className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-extrabold text-white uppercase tracking-wider font-mono">
                  1. Perfil de Daltonismo & Filtro
                </h2>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-300">
                <input
                  type="checkbox"
                  checked={accessibility.simulateFilter}
                  onChange={(e) => updateAccessibility({ simulateFilter: e.target.checked })}
                  className="accent-emerald-500 rounded"
                />
                <span>Simular na Tela</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {daltonismOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    playActionSound();
                    updateAccessibility({ colorBlindnessType: opt.id });
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition flex items-center justify-between ${
                    accessibility.colorBlindnessType === opt.id
                      ? 'bg-stone-800 border-emerald-500 ring-1 ring-emerald-500 shadow-sm'
                      : 'bg-stone-950/70 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-white">{opt.name}</div>
                    <div className="text-[11px] text-stone-400 mt-0.5">{opt.desc}</div>
                  </div>
                  {accessibility.colorBlindnessType === opt.id && (
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Contrast Mode */}
          <section className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-extrabold text-white uppercase tracking-wider font-mono">
                2. Modos de Contraste Visual
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {contrastOptions.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    playActionSound();
                    updateAccessibility({ contrastMode: c.id });
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition flex items-center justify-between ${
                    accessibility.contrastMode === c.id
                      ? 'bg-stone-800 border-amber-500 ring-1 ring-amber-500'
                      : 'bg-stone-950/70 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-white">{c.label}</div>
                    <div className="text-[11px] text-stone-400 mt-0.5">{c.desc}</div>
                  </div>
                  {accessibility.contrastMode === c.id && (
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Audio, Speech & Tactile Helpers */}
          <section className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-extrabold text-white uppercase tracking-wider font-mono">
                3. Áudio, Voz & Apoio Cognitivo
              </h2>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Leitor de Texto em Voz Alta (TTS)</div>
                  <div className="text-[11px] text-stone-400">Lê missões, resíduos e instruções automaticamente</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTestSpeech}
                    className="px-2.5 py-1 rounded-lg bg-stone-800 text-[11px] text-cyan-400 font-bold hover:bg-stone-700"
                  >
                    Testar Voz
                  </button>
                  <input
                    type="checkbox"
                    checked={accessibility.speechEnabled}
                    onChange={(e) => updateAccessibility({ speechEnabled: e.target.checked })}
                    className="accent-cyan-500 w-4 h-4"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Símbolos ColorAdd Ativos</div>
                  <div className="text-[11px] text-stone-400">Exibe código gráfico tátil universal para identificação de cores</div>
                </div>
                <input
                  type="checkbox"
                  checked={accessibility.showColorAddSymbols}
                  onChange={(e) => updateAccessibility({ showColorAddSymbols: e.target.checked })}
                  className="accent-emerald-500 w-4 h-4"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Texturas e Padrões SVG</div>
                  <div className="text-[11px] text-stone-400">Aplica hachuras e padrões geométricos que não dependem de cores</div>
                </div>
                <input
                  type="checkbox"
                  checked={accessibility.showTexturePatterns}
                  onChange={(e) => updateAccessibility({ showTexturePatterns: e.target.checked })}
                  className="accent-emerald-500 w-4 h-4"
                />
              </div>
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: Live Interactive Preview (5 of 12) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4 shadow-xl sticky top-24">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-extrabold text-white font-mono uppercase tracking-wider">
                  Prévia em Tempo Real
                </h3>
              </div>
              <span className="text-[10px] text-stone-400 font-mono">
                {accessibility.colorBlindnessType.toUpperCase()}
              </span>
            </div>

            <p className="text-xs text-stone-300">
              Veja como os resíduos e botões aparecem para o usuário com as configurações atuais:
            </p>

            {/* Sample Card */}
            <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500" />
                  <span className="text-xs font-bold text-white">Garrafa PET de Refrigerante</span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400">+50 pts</span>
              </div>

              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-red-400">Lixeira Vermelha (Plástico)</span>
                  <div className="text-[10px] text-stone-400 font-mono">Símbolo ColorAdd: Triângulo diagonal</div>
                </div>
                <span className="text-lg">▲</span>
              </div>

              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-blue-400">Lixeira Azul (Papel)</span>
                  <div className="text-[10px] text-stone-400 font-mono">Símbolo ColorAdd: Barra reta vertical</div>
                </div>
                <span className="text-lg">|</span>
              </div>

              <div className="pt-2 flex gap-2">
                <button className="flex-1 py-2 rounded-xl bg-emerald-500 text-stone-950 font-black text-xs">
                  Confirmar Ação
                </button>
                <button className="px-3 py-2 rounded-xl bg-stone-800 text-stone-300 font-bold text-xs">
                  Ouvir
                </button>
              </div>
            </div>

            <div className="text-[11px] text-stone-400 bg-stone-950/60 p-3 rounded-xl border border-stone-800/80">
              💡 As preferências são salvas automaticamente e persistem mesmo se você recarregar o navegador ou alternar de dispositivo.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
