import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Camera, 
  RotateCcw, 
  Check, 
  Sparkles, 
  Upload, 
  AlertCircle, 
  Volume2, 
  MapPin,
  RefreshCw,
  Video,
  Info,
  Layers,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SAMPLE_WASTE_ITEMS, WASTE_CATEGORIES_INFO } from '../../data/mockData';
import { identifyWasteImage } from '../../services/aiClassifier';
import { WasteIdentificationResult } from '../../types';
import { sound, triggerVibration, speakText } from '../../utils/audio';
import { PatternBadge, ColorAddSymbol } from '../../utils/patterns';
import { optimizeImageForAi } from '../../utils/imageUtils';

export const DesktopCameraView: React.FC = () => {
  const { 
    setScreen, 
    addHistoryItem, 
    accessibility, 
    setActiveRoutePevId,
    pevs,
    playActionSound 
  } = useApp();

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [availableVideoDevices, setAvailableVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<WasteIdentificationResult | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileGalleryInputRef = useRef<HTMLInputElement | null>(null);

  // Check hardware on mount
  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then(devices => {
        const videoInputs = devices.filter(d => d.kind === 'videoinput');
        setAvailableVideoDevices(videoInputs);
      }).catch(err => {
        console.warn('Error enumerating devices:', err);
      });
    }

    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setCameraLoading(false);
  };

  const startCamera = async () => {
    setCameraLoading(true);
    setCameraError(null);
    playActionSound();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(console.warn);
      }
      setCameraActive(true);
      setCameraLoading(false);
    } catch (err: any) {
      console.warn('Camera error:', err);
      setCameraLoading(false);
      setCameraActive(false);
      setCameraError('Câmera não disponível no momento ou permissão bloqueada pelo navegador. Você pode usar uma das amostras ou enviar uma foto.');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    playActionSound();

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      stopCamera();
      setCapturedImage(dataUrl);
      analyzeImage(dataUrl);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setCapturedImage(dataUrl);
        analyzeImage(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = (sample: typeof SAMPLE_WASTE_ITEMS[0]) => {
    playActionSound();
    stopCamera();
    setCapturedImage(sample.imageUrl);
    analyzeImage(sample.imageUrl, sample.name);
  };

  const analyzeImage = async (dataUrl: string, sampleHint?: string) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const optimized = await optimizeImageForAi(dataUrl);
      const result = await identifyWasteImage(optimized, sampleHint);
      setAnalysisResult(result);
      addHistoryItem(result);

      if (accessibility.speechEnabled) {
        const catInfo = WASTE_CATEGORIES_INFO[result.category];
        const speechText = `Item identificado: ${result.name}. Categoria: ${catInfo.name}. Lixeira recomendada: ${catInfo.colorName}. Ganhou ${result.ecoPoints} pontos ecológicos.`;
        speakText(speechText);
      }
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    stopCamera();
  };

  const handleSpeakResult = () => {
    if (!analysisResult) return;
    const cat = WASTE_CATEGORIES_INFO[analysisResult.category];
    const pev = pevs.find(p => p.id === analysisResult.recommendedPevId) || pevs[0];
    speakText(`Resultado detalhado: ${analysisResult.name}. Classificado como ${cat.name}. Instruções: ${analysisResult.instructions.join('. ')}. Ponto de descarte sugerido em Manaus: ${pev.name}.`);
  };

  const handleNavigateToPev = () => {
    if (analysisResult?.recommendedPevId) {
      setActiveRoutePevId(analysisResult.recommendedPevId);
      setScreen('map');
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-white">
      {/* Hidden canvas and file input */}
      <canvas ref={canvasRef} className="hidden" />
      <input 
        ref={fileGalleryInputRef} 
        type="file" 
        accept="image/*" 
        onChange={handleFileUpload} 
        className="hidden" 
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Camera className="w-6 h-6 text-emerald-400" />
            <span>Estação de Identificação por Inteligência Artificial</span>
          </h1>
          <p className="text-xs lg:text-sm text-stone-400 mt-1">
            Reconhecimento de embalagens e resíduos com classificação acessível ColorAdd e indicação de PEVs em Manaus.
          </p>
        </div>

        {capturedImage && (
          <button
            onClick={handleReset}
            className="px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Nova Foto</span>
          </button>
        )}
      </div>

      {/* Main Two-Column Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Camera Viewfinder or Image (7 of 12) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-xl aspect-video relative flex flex-col items-center justify-center bg-stone-950">
            {cameraActive ? (
              <div className="relative w-full h-full">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover" 
                />
                {/* Viewfinder crosshairs */}
                <div className="absolute inset-8 border-2 border-emerald-400/40 rounded-2xl pointer-events-none flex items-center justify-center">
                  <div className="text-center bg-stone-950/70 px-4 py-2 rounded-xl backdrop-blur-sm">
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                      Posicione a embalagem no centro
                    </span>
                  </div>
                </div>

                {/* Floating capture trigger */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <button
                    onClick={capturePhoto}
                    className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-sm shadow-xl flex items-center gap-2 transition active:scale-95"
                  >
                    <Camera className="w-5 h-5" />
                    <span>Capturar Imagem</span>
                  </button>
                </div>
              </div>
            ) : capturedImage ? (
              <div className="relative w-full h-full">
                <img 
                  src={capturedImage} 
                  alt="Resíduo capturado" 
                  className="w-full h-full object-contain bg-black/60" 
                />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 space-y-3">
                    <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
                    <div className="font-bold text-white text-sm">
                      Analisando resíduo com Inteligência Artificial...
                    </div>
                    <div className="text-xs text-stone-400">
                      Consultando base ecológica e normas de coleta seletiva de Manaus
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center max-w-md space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-stone-900 border border-stone-800 flex items-center justify-center text-emerald-400 mx-auto shadow-inner">
                  <Camera className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Pronto para Capturar</h3>
                  <p className="text-xs text-stone-400 mt-1">
                    Você pode abrir sua webcam/câmera, enviar uma foto do seu computador ou testar com uma amostra de Manaus abaixo.
                  </p>
                </div>

                {cameraError && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs text-left flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{cameraError}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={startCamera}
                    disabled={cameraLoading}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-extrabold text-xs flex items-center gap-2 transition shadow"
                  >
                    <Video className="w-4 h-4" />
                    <span>{cameraLoading ? 'Iniciando...' : 'Ligar Câmera'}</span>
                  </button>

                  <button
                    onClick={() => fileGalleryInputRef.current?.click()}
                    className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs flex items-center gap-2 transition border border-stone-700"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Enviar Arquivo</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Samples Section */}
          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-300">
                Amostras Típicas de Manaus para Testar:
              </span>
              <span className="text-[11px] text-stone-400">Clique para simular</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {SAMPLE_WASTE_ITEMS.slice(0, 4).map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 hover:border-emerald-500 transition text-left group"
                >
                  <img 
                    src={sample.imageUrl} 
                    alt={sample.name} 
                    className="w-full h-16 object-cover rounded-lg mb-2" 
                  />
                  <div className="text-xs font-bold text-white truncate group-hover:text-emerald-400">
                    {sample.name}
                  </div>
                  <div className="text-[10px] text-stone-400 font-mono">
                    {sample.category}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AI Diagnostic & Action Panel (5 of 12) */}
        <div className="lg:col-span-5 space-y-6">
          {analysisResult ? (
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-6 shadow-xl">
              
              {/* Header with Name & Points */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
                      Identificado com Sucesso
                    </span>
                    <span className="text-xs text-stone-400 font-mono tabular-nums">
                      {Math.round(analysisResult.confidence * 100)}% de confiança
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-white mt-2 leading-tight">
                    {analysisResult.name}
                  </h2>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[11px] text-stone-400 font-mono">Recompensa</div>
                  <div className="text-lg font-black text-emerald-400 font-mono tabular-nums">
                    +{analysisResult.ecoPoints} pts
                  </div>
                </div>
              </div>

              {/* Material & Tactile ColorAdd Banner */}
              {(() => {
                const catInfo = WASTE_CATEGORIES_INFO[analysisResult.category];
                return (
                  <div 
                    className="p-4 rounded-2xl border flex items-center justify-between"
                    style={{ 
                      backgroundColor: `${catInfo.baseColor}15`,
                      borderColor: catInfo.baseColor 
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white shadow"
                        style={{ backgroundColor: catInfo.baseColor }}
                      >
                        <Layers className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">
                          Lixeira: {catInfo.colorName}
                        </div>
                        <div className="text-[11px] text-stone-300 font-mono">
                          Símbolo tátil: {catInfo.colorAddSymbol}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleSpeakResult}
                      className="p-2.5 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-emerald-300 transition"
                      title="Ouvir orientações completas em voz alta"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })()}

              {/* Hygiene & Preparation Instructions */}
              <div className="space-y-2">
                <div className="text-xs font-mono font-bold uppercase text-stone-400">
                  Instruções de Preparação:
                </div>
                <div className="space-y-1.5">
                  {analysisResult.instructions.map((inst, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{inst}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Degradation Time in Manaus */}
              <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 text-xs space-y-1">
                <div className="font-bold text-emerald-400">
                  Tempo de Degradação no Clima Amazônico:
                </div>
                <div className="text-stone-300 font-mono">
                  {analysisResult.decompositionTime}
                </div>
                <div className="text-[11px] text-stone-400 pt-1">
                  {analysisResult.environmentalImpact}
                </div>
              </div>

              {/* Recommended PEV in Manaus & Route Action */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-[11px] text-stone-400 font-mono uppercase">
                    Ecoponto Recomendado em Manaus:
                  </div>
                  <div className="text-sm font-bold text-white truncate mt-0.5">
                    {pevs.find(p => p.id === analysisResult.recommendedPevId)?.name || 'Ecoponto Sumaúma'}
                  </div>
                </div>

                <button
                  onClick={handleNavigateToPev}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition shrink-0"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Ver Rota</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white">Como Funciona a Identificação</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Ao capturar uma foto, a IA analisa a textura, a composição e as cores da embalagem, mapeando-a diretamente para as diretrizes municipais da SEMULSP em Manaus.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-950 border border-stone-800 text-xs">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold font-mono">1</div>
                  <div>
                    <strong className="text-white">Captura:</strong> Enquadre bem a embalagem sem sombras pesadas.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-950 border border-stone-800 text-xs">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold font-mono">2</div>
                  <div>
                    <strong className="text-white">Classificação ColorAdd:</strong> Identifica a cor oficial da lixeira com símbolos geométricos para daltônicos.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-950 border border-stone-800 text-xs">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold font-mono">3</div>
                  <div>
                    <strong className="text-white">Destino em Manaus:</strong> Sugere o Ecoponto mais próximo da sua residência.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
