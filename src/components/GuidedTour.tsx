import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Eye, 
  Volume2, 
  VolumeX, 
  Compass, 
  Camera, 
  MapPin, 
  Sliders, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  X, 
  Layers, 
  Vibrate, 
  HelpCircle,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ColorAddSymbol, PatternBadge } from '../utils/patterns';
import { speakText, stopSpeech, sound, triggerVibration } from '../utils/audio';
import { WasteCategory } from '../types';

interface TourStep {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeText: string;
  speechText: string;
  description: string;
  bulletPoints: {
    icon: string;
    text: string;
  }[];
  customContent?: 'coloradd_demo' | 'camera_demo' | 'map_demo' | 'sensory_demo' | 'welcome_demo';
}

export const GuidedTour: React.FC = () => {
  const { isTourOpen, closeTour, accessibility, playActionSound } = useApp();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);

  const steps: TourStep[] = [
    {
      title: 'Bem-vindo ao EcoAcess Manaus!',
      subtitle: 'Tecnologia, acessibilidade e sustentabilidade ao seu alcance',
      icon: Sparkles,
      badgeText: 'PASSO 1 DE 5 · INTRODUÇÃO',
      speechText: 'Bem-vindo ao EcoAcess Manaus! Este aplicativo foi desenvolvido com foco no design universal para pessoas com daltonismo. Aqui, nenhuma informação importante depende apenas das cores. Cada item é acompanhado de texto em caixa alta, ícones, símbolos gráficos e texturas.',
      description: 'O EcoAcess foi projetado para que você tenha autonomia total ao descartar resíduos sólidos em Manaus, sem jamais depender de distinção cromática.',
      bulletPoints: [
        { icon: '👁️', text: 'Sem dependência de cores: vermelho contra verde, azul contra roxo ou verde contra amarelo nunca são a única referência.' },
        { icon: '📝', text: 'Textos em caixa alta sempre indicam explicitamente a categoria e os cuidados necessários.' },
        { icon: '🌳', text: 'Foco nos bairros, ecopontos e na preservação dos rios e igarapés de Manaus.' },
      ],
      customContent: 'welcome_demo',
    },
    {
      title: 'O Código ColorADD & Padrões Táteis',
      subtitle: 'Identificação geométrica universal para cada resíduo',
      icon: Layers,
      badgeText: 'PASSO 2 DE 5 · SÍMBOLOS & HACHURAS',
      speechText: 'No EcoAcess Manaus, cada tipo de lixo possui um símbolo gráfico e um padrão visual exclusivo. Por exemplo: o plástico usa o traço diagonal do ColorADD e listras inclinadas. O papel usa um triângulo para baixo e listras horizontais. O vidro usa triângulos opostos e losangos.',
      description: 'Mesmo sem enxergar as cores padrão da coleta seletiva, você identifica os coletores por símbolos e tramas visuais:',
      bulletPoints: [
        { icon: '/', text: 'PLÁSTICO: Símbolo de Traço Diagonal (/) com Listras a 45 Graus.' },
        { icon: '▼', text: 'PAPEL: Símbolo de Triângulo para Baixo (▼) com Listras Horizontais.' },
        { icon: '▲▼', text: 'VIDRO: Triângulos Opostos em Ampulheta (▲▼) com Losangos Diamantados.' },
        { icon: '▲', text: 'METAL: Triângulo para Cima (▲) com Pontilhado Denso.' },
        { icon: '≈', text: 'ORGÂNICO: Símbolo Composto com Ondas Sinusoidais Amazônicas.' },
      ],
      customContent: 'coloradd_demo',
    },
    {
      title: 'Identificação por Câmera & Inteligência Artificial',
      subtitle: 'Aponte, fotografe e descubra como preparar o resíduo',
      icon: Camera,
      badgeText: 'PASSO 3 DE 5 · CÂMERA ACESSÍVEL',
      speechText: 'Na tela de identificar resíduo, utilize a moldura de alto contraste para posicionar o objeto. A Inteligência Artificial analisa o material e indica instruções claras de limpeza, tempo de degradação e pontuação ecológica.',
      description: 'A câmera conta com mira central de alta visibilidade e retorno por áudio e vibração ao capturar:',
      bulletPoints: [
        { icon: '🎯', text: 'Moldura de enquadramento com alto contraste e guias táteis nos quatro cantos.' },
        { icon: '🤖', text: 'Classificação automática por IA treinada com materiais comuns em Manaus.' },
        { icon: '✨', text: 'Orientações práticas de descarte: como enxaguar, compactar e proteger os catadores.' },
      ],
      customContent: 'camera_demo',
    },
    {
      title: 'Onde Descartar? PEVs de Manaus & Rotas por Grafo',
      subtitle: 'Cálculo de rota inteligente por Dijkstra e A*',
      icon: MapPin,
      badgeText: 'PASSO 4 DE 5 · ROTAS EM MANAUS',
      speechText: 'O mapa apresenta os Pontos de Entrega Voluntária e Ecopontos oficiais da Prefeitura de Manaus. O sistema utiliza algoritmos de caminhos mínimos, como Dijkstra e A-estrela, para traçar a rota mais rápida e indicar instruções passo a passo.',
      description: 'Chegue ao local correto sem dúvidas sobre materiais aceitos ou localização:',
      bulletPoints: [
        { icon: '🗺️', text: 'Pontos reais nos bairros: Parque Sumaúma, Bilhares, Redenção, Coroado, Ponta Negra e Tarumã.' },
        { icon: '🧭', text: 'Algoritmos Dijkstra e A* calculam a menor distância em km e o tempo estimado.' },
        { icon: '🔊', text: 'Instruções de navegação rua a rua com leitura em voz alta.' },
      ],
      customContent: 'map_demo',
    },
    {
      title: 'Recursos Sensoriais & Barra de Daltonismo',
      subtitle: 'Áudio, vibração tátil, alto contraste e simulação',
      icon: Sliders,
      badgeText: 'PASSO 5 DE 5 · MULTISSENSORIAL',
      speechText: 'Você pode ouvir qualquer tela clicando no botão Ouvir Informação. O aplicativo também emite beeps acústicos e vibração de confirmação. Na barra superior, você ou seu avaliador de TCC podem alternar entre protanopia, deuteranopia, tritanopia e visão monocromática.',
      description: 'Adapte o EcoAcess para o seu conforto visual e sensorial:',
      bulletPoints: [
        { icon: '🔊', text: 'Botão "Ouvir Informação": sintetiza o texto em voz alta e pausada em português.' },
        { icon: '📳', text: 'Vibração háptica de confirmação a cada ação e captura de foto.' },
        { icon: '🎨', text: 'Simulador de Daltonismo no topo: permite visualizar o app sob a ótica de protanopia, deuteranopia ou tritanopia.' },
      ],
      customContent: 'sensory_demo',
    },
  ];

  const currentStep = steps[currentStepIndex];

  // Auto speech effect when step changes if autoSpeak is on
  useEffect(() => {
    if (!isTourOpen) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }

    if (autoSpeak) {
      setIsSpeaking(true);
      speakText(currentStep.speechText, () => setIsSpeaking(false));
    }

    return () => {
      stopSpeech();
    };
  }, [currentStepIndex, isTourOpen, autoSpeak]);

  if (!isTourOpen) return null;

  const handleNext = () => {
    sound.playClick(accessibility.soundEnabled);
    triggerVibration([30, 20, 30], accessibility.vibrationEnabled);

    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    sound.playClick(accessibility.soundEnabled);
    triggerVibration(30, accessibility.vibrationEnabled);

    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleFinish = () => {
    stopSpeech();
    sound.playSuccess(accessibility.soundEnabled);
    triggerVibration([50, 40, 60], accessibility.vibrationEnabled);
    closeTour();
  };

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakText(currentStep.speechText, () => setIsSpeaking(false));
    }
  };

  const IconComponent = currentStep.icon;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-title"
    >
      <div className="w-full max-w-lg bg-stone-900 border-2 border-emerald-400 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Top Progress & Controls Bar */}
        <div className="bg-stone-950 px-5 py-3 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-black text-emerald-400 tracking-wider">
              {currentStep.badgeText}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Auto speak toggle */}
            <button
              onClick={() => setAutoSpeak(!autoSpeak)}
              className={`p-1.5 rounded-lg border text-[11px] font-semibold flex items-center gap-1 transition ${
                autoSpeak ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300' : 'bg-stone-800 border-stone-700 text-stone-400'
              }`}
              title={autoSpeak ? 'Leitura automática ativada' : 'Leitura automática pausada'}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{autoSpeak ? 'Áudio On' : 'Áudio Off'}</span>
            </button>

            {/* Close button */}
            <button
              onClick={handleFinish}
              className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition"
              aria-label="Pular e fechar tour guiado"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Visual Progress Bar with Non-Color Pattern Texture */}
        <div className="w-full h-2 bg-stone-950 overflow-hidden relative border-b border-stone-800">
          <div 
            className="h-full bg-emerald-500 transition-all duration-300 relative overflow-hidden"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          >
            {/* Overlay pattern so progress doesn't depend only on color */}
            <svg className="absolute inset-0 w-full h-full text-white/40">
              <rect width="100%" height="100%" fill="url(#pattern-paper)" />
            </svg>
          </div>
        </div>

        {/* Tour Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* Step Header */}
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 shrink-0 shadow-lg">
              <IconComponent className="w-6 h-6" />
            </div>

            <div className="flex-1">
              <h2 id="tour-title" className="text-lg sm:text-xl font-black text-white leading-tight">
                {currentStep.title}
              </h2>
              <p className="text-xs text-emerald-300 font-semibold mt-0.5">
                {currentStep.subtitle}
              </p>
            </div>
          </div>

          {/* Description text */}
          <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-medium">
            {currentStep.description}
          </p>

          {/* Custom Interactive Demonstration for each step */}
          {currentStep.customContent === 'welcome_demo' && (
            <div className="p-3.5 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400 block">
                Os 4 Pilares da Acessibilidade no EcoAcess:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-xl bg-stone-900 border border-stone-700 font-bold text-white flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span>1. Texto Claro</span>
                </div>
                <div className="p-2 rounded-xl bg-stone-900 border border-stone-700 font-bold text-white flex items-center gap-2">
                  <span className="text-emerald-400 font-mono">/ ▲</span>
                  <span>2. Símbolo ColorADD</span>
                </div>
                <div className="p-2 rounded-xl bg-stone-900 border border-stone-700 font-bold text-white flex items-center gap-2">
                  <span className="text-emerald-400 font-mono">///</span>
                  <span>3. Hachuras Táteis</span>
                </div>
                <div className="p-2 rounded-xl bg-stone-900 border border-stone-700 font-bold text-white flex items-center gap-2">
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>4. Áudio & Fala</span>
                </div>
              </div>
            </div>
          )}

          {currentStep.customContent === 'coloradd_demo' && (
            <div className="p-3.5 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-2.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400 block">
                Toque para testar cada identificador sem cores:
              </span>
              <div className="flex flex-wrap gap-2">
                {(['plastic', 'paper', 'glass', 'metal', 'organic'] as WasteCategory[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      sound.playClick(true);
                      triggerVibration(40, true);
                      const names: Record<WasteCategory, string> = {
                        plastic: 'Plástico: traço diagonal e listras inclinadas',
                        paper: 'Papel: triângulo para baixo e listras horizontais',
                        glass: 'Vidro: triângulos opostos e losangos',
                        metal: 'Metal: triângulo para cima e pontilhado',
                        organic: 'Orgânico: ondas amazônicas',
                        electronic: 'Eletroeletrônico: circuito integrado',
                        hazardous: 'Perigoso: hachura cruzada',
                      };
                      speakText(names[cat]);
                    }}
                    className="cursor-pointer transition active:scale-95"
                  >
                    <PatternBadge category={cat} />
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-stone-400 block italic">
                * Dica: o símbolo ColorADD é reconhecido internacionalmente em escolas e hospitais.
              </span>
            </div>
          )}

          {currentStep.customContent === 'camera_demo' && (
            <div className="p-3.5 rounded-2xl bg-stone-950/80 border border-stone-800 flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl border-2 border-emerald-400 flex items-center justify-center bg-black/60 relative shrink-0">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
                <span className="absolute text-[8px] font-mono text-white bottom-1">MIRA</span>
              </div>
              <div className="text-xs text-stone-200">
                <strong className="text-white block font-bold">Enquadramento com Guias Táteis</strong>
                Basta centralizar qualquer embalagem. O app reconhece garrafas PET, latas de alumínio, caixas da Zona Franca e cascas de frutas regionais.
              </div>
            </div>
          )}

          {currentStep.customContent === 'map_demo' && (
            <div className="p-3.5 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span className="flex items-center gap-1.5 text-blue-400">
                  <MapPin className="w-3.5 h-3.5" /> PEVs de Manaus Cadastrados
                </span>
                <span className="text-[10px] font-mono text-emerald-400">Dijkstra / A*</span>
              </div>
              <p className="text-[11px] text-stone-300">
                Algoritmos de grafos encontram o caminho mais curto pelos corredores de Manaus (Av. Constantino Nery, Torquato Tapajós, Djalma Batista e Rodrigo Otávio).
              </p>
            </div>
          )}

          {currentStep.customContent === 'sensory_demo' && (
            <div className="p-3.5 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <Vibrate className="w-4 h-4" />
                <span>Simulador de Daltonismo na Barra Superior</span>
              </div>
              <p className="text-[11px] text-stone-300 leading-snug">
                Você pode testar Protanopia, Deuteranopia e Tritanopia em tempo real para verificar que toda a interface continua 100% legível.
              </p>
            </div>
          )}

          {/* Bullet points */}
          <div className="space-y-2 pt-1">
            {currentStep.bulletPoints.map((bp, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-200">
                <span className="w-5 h-5 rounded-md bg-stone-800 border border-stone-700 flex items-center justify-center text-[10px] font-bold text-emerald-400 shrink-0 mt-0.5">
                  {bp.icon}
                </span>
                <span className="leading-snug">{bp.text}</span>
              </div>
            ))}
          </div>

          {/* Audio narration button for this step */}
          <button
            onClick={handleToggleSpeech}
            className={`w-full py-2.5 px-3 rounded-xl border-2 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition active:scale-95 ${
              isSpeaking
                ? 'bg-amber-500 text-stone-950 border-amber-300 animate-pulse'
                : 'bg-stone-800 hover:bg-stone-700 text-emerald-300 border-stone-700'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isSpeaking ? 'Pausar Áudio da Explicação' : '🔊 Ouvir Esta Explicação em Voz Alta'}</span>
          </button>

        </div>

        {/* Modal Navigation Footer */}
        <div className="bg-stone-950 px-5 py-3.5 border-t border-stone-800 flex items-center justify-between gap-3">
          
          {/* Back button or Skip */}
          {currentStepIndex > 0 ? (
            <button
              onClick={handlePrev}
              className="px-3.5 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="text-xs text-stone-400 hover:text-stone-200 font-semibold px-2 py-1"
            >
              Pular Tour
            </button>
          )}

          {/* Step dots indicator */}
          <div className="flex items-center gap-1.5">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  playActionSound();
                  setCurrentStepIndex(i);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === currentStepIndex
                    ? 'w-6 bg-emerald-400 shadow-sm shadow-emerald-400'
                    : 'bg-stone-700 hover:bg-stone-600'
                }`}
                aria-label={`Ir para passo ${i + 1}`}
              />
            ))}
          </div>

          {/* Next or Finish Button */}
          <button
            onClick={handleNext}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/30 flex items-center gap-1.5 transition active:scale-95 border-2 border-emerald-300"
          >
            <span>{currentStepIndex < steps.length - 1 ? 'Próximo' : 'Entendi! Iniciar'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
