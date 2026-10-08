import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  RotateCcw, 
  Check, 
  Sparkles, 
  Upload, 
  Zap, 
  Layers, 
  AlertCircle,
  HelpCircle,
  Volume2,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SAMPLE_WASTE_ITEMS } from '../data/mockData';
import { identifyWasteImage } from '../services/aiClassifier';
import { WasteIdentificationResult } from '../types';
import { ResultModal } from './ResultModal';
import { sound, triggerVibration, speakText } from '../utils/audio';

export const CameraIdentifyScreen: React.FC = () => {
  const { 
    setScreen, 
    addHistoryItem, 
    accessibility, 
    setActiveRoutePevId,
    playActionSound 
  } = useApp();

  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<WasteIdentificationResult | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [selectedSampleId, setSelectedSampleId] = useState<string>('sample-bare-pet');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera stream if available
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setCameraActive(true);
      } else {
        setCameraError('Câmera não suportada neste navegador. Use os exemplos de Manaus ou upload.');
      }
    } catch (err) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError('Permissão da câmera negada ou câmera não conectada. Você pode selecionar amostras de resíduos de Manaus ou enviar foto.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    // Attempt auto camera start
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const handleCapturePhoto = () => {
    sound.playShutter(accessibility.soundEnabled);
    triggerVibration([50, 40, 50], accessibility.vibrationEnabled);

    if (cameraActive && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedImage(dataUrl);
        stopCamera();
        return;
      }
    }

    // Fallback: capture currently selected sample
    const sample = SAMPLE_WASTE_ITEMS.find(s => s.id === selectedSampleId) || SAMPLE_WASTE_ITEMS[0];
    setCapturedImage(sample.imageUrl);
  };

  const handleRetake = () => {
    playActionSound();
    setCapturedImage(null);
    setAnalysisResult(null);
    startCamera();
  };

  const handleConfirmAndAnalyze = async () => {
    if (!capturedImage) return;

    sound.playClick(accessibility.soundEnabled);
    triggerVibration(40, accessibility.vibrationEnabled);
    setIsAnalyzing(true);

    try {
      const result = await identifyWasteImage(capturedImage);
      setAnalysisResult(result);
      addHistoryItem(result);
      sound.playSuccess(accessibility.soundEnabled);
      triggerVibration([60, 40, 80], accessibility.vibrationEnabled);

      if (accessibility.speechEnabled) {
        speakText(`Resíduo identificado: ${result.name}. Veja como descartar corretamente.`);
      }
    } catch (err) {
      console.error('Classification error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setCapturedImage(url);
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNavigateToPev = (pevId: string) => {
    setActiveRoutePevId(pevId);
    setAnalysisResult(null);
    setScreen('map');
  };

  return (
    <div className="w-full pb-24 pt-3 px-4 max-w-xl mx-auto text-white flex flex-col min-h-[90vh]">
      
      {/* Hidden canvas for snapshotting */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Screen Title & Navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => {
            playActionSound();
            stopCamera();
            setScreen('home');
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-stone-300 hover:text-white uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>

        <h1 className="text-sm font-extrabold uppercase tracking-wider text-emerald-400">
          Identificar Resíduo
        </h1>

        <button
          onClick={() => speakText("Aponte a câmera para o resíduo e posicione dentro da moldura de enquadramento. Depois clique em Tirar Foto.")}
          className="p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-white"
          title="Ouvir orientações"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Camera Guidance Notice */}
      <div className="mb-3 px-3 py-2 bg-stone-900 border border-stone-800 rounded-xl text-center">
        <p className="text-xs text-stone-200 font-medium flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Aponte a câmera para o resíduo dentro da moldura</span>
        </p>
      </div>

      {/* Viewfinder / Camera View */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] bg-black rounded-2xl overflow-hidden border-2 border-stone-700 shadow-2xl flex items-center justify-center">
        
        {/* Real Video Stream */}
        {cameraActive && !capturedImage && (
          <video
            ref={videoRef}
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        )}

        {/* Captured Photo Preview */}
        {capturedImage && (
          <img
            src={capturedImage}
            alt="Resíduo fotografado"
            className="w-full h-full object-cover"
          />
        )}

        {/* Fallback Simulation Mode if camera disabled */}
        {!cameraActive && !capturedImage && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-stone-900 text-center">
            {SAMPLE_WASTE_ITEMS.find(s => s.id === selectedSampleId) && (
              <img
                src={SAMPLE_WASTE_ITEMS.find(s => s.id === selectedSampleId)?.imageUrl}
                alt="Amostra de Resíduo"
                className="w-full h-full object-cover opacity-80"
              />
            )}
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-4">
              <span className="text-xs font-mono font-bold uppercase text-emerald-400 bg-black/80 px-3 py-1 rounded-full border border-emerald-500/40 mb-2">
                Modo Simulação & Amostras de Manaus
              </span>
              <p className="text-xs text-stone-300 max-w-xs">
                {cameraError || 'Posicione o resíduo no enquadramento.'}
              </p>
            </div>
          </div>
        )}

        {/* Framing Reticle / Moldura de Enquadramento com Alto Contraste */}
        <div className="absolute inset-6 pointer-events-none flex flex-col justify-between">
          <div className="flex justify-between">
            <div className="w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg shadow-sm" />
            <div className="w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg shadow-sm" />
          </div>
          
          {/* Center Target Reticle */}
          <div className="self-center flex flex-col items-center">
            <div className="w-12 h-12 border-2 border-white/60 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
            </div>
            <span className="mt-2 text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-black/75 text-stone-200 rounded border border-white/20">
              Enquadramento Acessível
            </span>
          </div>

          <div className="flex justify-between">
            <div className="w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg shadow-sm" />
            <div className="w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-lg shadow-sm" />
          </div>
        </div>

        {/* Loading Spinner during AI Analysis */}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-20">
            <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            <div className="text-center">
              <p className="text-sm font-extrabold text-white">Classificando Resíduo com IA...</p>
              <p className="text-xs text-emerald-300 font-mono mt-0.5">Identificando padrão visual & PEV em Manaus</p>
            </div>
          </div>
        )}
      </div>

      {/* Sample Quick Selector (Ideal for testing on desktop / laptop) */}
      {!capturedImage && (
        <div className="mt-4 p-3 bg-stone-900/90 border border-stone-800 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              Amostras Rápidas de Manaus para Teste:
            </span>
            <label className="text-[11px] text-emerald-400 hover:underline font-bold cursor-pointer flex items-center gap-1">
              <Upload className="w-3 h-3" />
              <span>Enviar Foto</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {SAMPLE_WASTE_ITEMS.slice(0, 6).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  playActionSound();
                  setSelectedSampleId(item.id);
                  setCapturedImage(item.imageUrl);
                  stopCamera();
                }}
                className={`p-1.5 rounded-lg border text-left flex items-center gap-2 transition ${
                  selectedSampleId === item.id
                    ? 'bg-emerald-950/80 border-emerald-400 text-white font-bold'
                    : 'bg-stone-800/80 border-stone-700 text-stone-300 hover:border-stone-500'
                }`}
              >
                <img src={item.imageUrl} alt={item.name} className="w-8 h-8 rounded object-cover shrink-0" />
                <span className="text-[10px] leading-tight line-clamp-2">
                  {item.name.split('(')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons: Take Photo OR (Usar foto + Tirar novamente) */}
      <div className="mt-4 flex-1 flex flex-col justify-end">
        {!capturedImage ? (
          <div className="flex flex-col gap-2">
            <button
              onClick={handleCapturePhoto}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 border-2 border-emerald-300 transition active:scale-95 cursor-pointer"
            >
              <Camera className="w-5 h-5" />
              <span>TIRAR FOTO DO RESÍDUO</span>
            </button>

            {!cameraActive && (
              <button
                onClick={startCamera}
                className="w-full py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold uppercase rounded-xl transition"
              >
                Tentar Ativar Câmera Novamente
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleRetake}
              className="py-3.5 bg-stone-800 hover:bg-stone-700 text-stone-200 font-extrabold text-xs uppercase tracking-wider rounded-xl border border-stone-600 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Tirar Novamente</span>
            </button>

            <button
              onClick={handleConfirmAndAnalyze}
              className="py-3.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs uppercase tracking-wider rounded-xl border-2 border-emerald-300 shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Usar Foto & Analisar</span>
            </button>
          </div>
        )}
      </div>

      {/* Result Modal if analysis is ready */}
      {analysisResult && (
        <ResultModal
          result={analysisResult}
          onClose={() => setAnalysisResult(null)}
          onNavigateToPev={handleNavigateToPev}
        />
      )}

    </div>
  );
};
