import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Camera, 
  RotateCcw, 
  Check, 
  Sparkles, 
  Upload, 
  AlertCircle, 
  Volume2, 
  ArrowLeft,
  Smartphone,
  CheckCircle2,
  RefreshCw,
  Video,
  Info,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SAMPLE_WASTE_ITEMS } from '../data/mockData';
import { identifyWasteImage } from '../services/aiClassifier';
import { WasteIdentificationResult } from '../types';
import { ResultModal } from './ResultModal';
import { sound, triggerVibration, speakText } from '../utils/audio';
import { optimizeImageForAi } from '../utils/imageUtils';

export const CameraIdentifyScreen: React.FC = () => {
  const { 
    setScreen, 
    addHistoryItem, 
    accessibility, 
    setActiveRoutePevId,
    playActionSound 
  } = useApp();

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [availableVideoDevices, setAvailableVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [deviceChecked, setDeviceChecked] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<WasteIdentificationResult | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement | null>(null);
  const fileGalleryInputRef = useRef<HTMLInputElement | null>(null);

  // Safely attach stream to video element
  const attachStream = useCallback((stream: MediaStream) => {
    if (videoRef.current) {
      const video = videoRef.current;
      video.srcObject = stream;
      video.muted = true;
      video.defaultMuted = true;
      video.setAttribute('playsinline', 'true');
      video.setAttribute('autoplay', 'true');

      video.onloadedmetadata = () => {
        video.play().catch(e => console.warn('Autoplay prevented:', e));
      };

      video.play().catch(e => console.warn('Video play catch:', e));
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  // Check device availability via enumerateDevices and request permissions explicitly before rendering stream
  const initializeCamera = useCallback(async (isMounted = true) => {
    setIsInitializing(true);
    setCameraLoading(true);
    setCameraError(null);
    setGeneralError(null);

    try {
      // 1. Verify mediaDevices support in browser
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        if (isMounted) {
          setCameraError(
            'A API navigator.mediaDevices não está disponível no navegador ou contexto atual.'
          );
          setCameraActive(false);
          setIsInitializing(false);
          setCameraLoading(false);
        }
        return;
      }

      // 2. Explicitly verify device availability using navigator.mediaDevices.enumerateDevices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');

      if (isMounted) {
        setAvailableVideoDevices(videoDevices);
        setDeviceChecked(true);
      }

      if (videoDevices.length === 0) {
        if (isMounted) {
          setCameraError(
            'Nenhuma câmera foi identificada no dispositivo através de navigator.mediaDevices.enumerateDevices.'
          );
          setCameraActive(false);
          setIsInitializing(false);
          setCameraLoading(false);
        }
        return;
      }

      // 3. Verify permissions explicitly if Permissions API is supported
      if (navigator.permissions && navigator.permissions.query) {
        try {
          const permStatus = await navigator.permissions.query({ name: 'camera' as any });
          if (permStatus.state === 'denied') {
            if (isMounted) {
              setCameraError(
                'A permissão da câmera está bloqueada nas configurações do seu navegador.'
              );
              setCameraActive(false);
              setIsInitializing(false);
              setCameraLoading(false);
            }
            return;
          }
        } catch {
          // If query throws (unsupported query name in some engines), proceed to direct getUserMedia
        }
      }

      // 4. Request camera stream explicitly
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }

      let stream: MediaStream | null = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false,
        });
      } catch {
        // Fallback constraint if environment camera was rejected
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      if (stream && isMounted) {
        streamRef.current = stream;
        attachStream(stream);
        setCameraActive(true);
        setCameraError(null);
        sound.playClick(accessibility.soundEnabled);
      }
    } catch (err: any) {
      console.warn('Erro ao inicializar câmera após verificar enumerateDevices:', err);
      let msg = 'Não foi possível iniciar a transmissão da câmera.';
      if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
        msg = 'Permissão de acesso à câmera não concedida pelo usuário ou bloqueada pelo navegador.';
      } else if (err?.name === 'NotFoundError' || err?.name === 'DevicesNotFoundError') {
        msg = 'Nenhuma câmera de vídeo foi detectada via enumerateDevices.';
      } else if (err?.name === 'NotReadableError' || err?.name === 'TrackStartError') {
        msg = 'A câmera já se encontra ocupada por outro aplicativo ou processo.';
      }

      if (isMounted) {
        setCameraError(msg);
        setCameraActive(false);
        setShowTroubleshoot(true);
      }
    } finally {
      if (isMounted) {
        setIsInitializing(false);
        setCameraLoading(false);
      }
    }
  }, [attachStream, accessibility.soundEnabled]);

  // Request camera initialization on component mount
  useEffect(() => {
    let isMounted = true;
    initializeCamera(isMounted);

    return () => {
      isMounted = false;
      stopCamera();
    };
  }, [initializeCamera, stopCamera]);

  // Ensure stream stays attached whenever video element is mounted and active
  useEffect(() => {
    if (cameraActive && streamRef.current && videoRef.current && !videoRef.current.srcObject) {
      attachStream(streamRef.current);
    }
  }, [cameraActive, attachStream]);

  // Execute AI analysis on an image
  const executeAnalysis = async (rawImageUrlOrBase64: string) => {
    sound.playClick(accessibility.soundEnabled);
    triggerVibration(40, accessibility.vibrationEnabled);
    setIsAnalyzing(true);
    setGeneralError(null);

    try {
      // Downscale image if it's large to guarantee ultra-fast processing
      const optimizedImage = await optimizeImageForAi(rawImageUrlOrBase64);
      setCapturedImage(optimizedImage);

      const result = await identifyWasteImage(optimizedImage);
      setAnalysisResult(result);
      addHistoryItem(result);
      sound.playSuccess(accessibility.soundEnabled);
      triggerVibration([60, 40, 80], accessibility.vibrationEnabled);

      if (accessibility.speechEnabled) {
        speakText(`Resíduo identificado: ${result.name}. Categoria: ${result.category}. Toque para ouvir as orientações de descarte em Manaus.`);
      }
    } catch (err) {
      console.error('Classification error:', err);
      setGeneralError('Não foi possível identificar o resíduo agora. Tente tirar outra foto ou escolha uma amostra.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Capture photo from live video stream
  const handleCaptureFromLiveStream = () => {
    sound.playShutter(accessibility.soundEnabled);
    triggerVibration([50, 40, 50], accessibility.vibrationEnabled);

    if (cameraActive && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      const width = video.videoWidth || 640;
      const height = video.videoHeight || 480;

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
        setCapturedImage(dataUrl);
        stopCamera();
        executeAnalysis(dataUrl);
        return;
      }
    }

    // Fallback: If live feed not active, trigger native phone camera directly
    handleOpenNativeCamera();
  };

  // Open smartphone native camera app directly
  const handleOpenNativeCamera = () => {
    playActionSound();
    triggerVibration(30, accessibility.vibrationEnabled);
    setCameraError(null);
    nativeCameraInputRef.current?.click();
  };

  // Open photo gallery picker
  const handleOpenGallery = () => {
    playActionSound();
    triggerVibration(30, accessibility.vibrationEnabled);
    setCameraError(null);
    fileGalleryInputRef.current?.click();
  };

  // Handle file captured via native smartphone camera or gallery
  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      sound.playShutter(accessibility.soundEnabled);
      triggerVibration(40, accessibility.vibrationEnabled);

      const reader = new FileReader();
      reader.onload = async (event) => {
        const rawUrl = event.target?.result as string;
        if (rawUrl) {
          stopCamera();
          await executeAnalysis(rawUrl);
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset input so user can retake with same file if needed
    e.target.value = '';
  };

  const handleRetake = () => {
    playActionSound();
    setCapturedImage(null);
    setAnalysisResult(null);
    setGeneralError(null);
  };

  const handleSelectSample = (sample: typeof SAMPLE_WASTE_ITEMS[0]) => {
    playActionSound();
    setCapturedImage(sample.imageUrl);
    stopCamera();
    executeAnalysis(sample.imageUrl);
  };

  const handleNavigateToPev = (pevId: string) => {
    setActiveRoutePevId(pevId);
    setAnalysisResult(null);
    setScreen('map');
  };

  const handleRetryCameraInitialization = () => {
    playActionSound();
    initializeCamera(true);
  };

  // Explicit verification and permission request stage before rendering main camera view
  if (isInitializing) {
    return (
      <div className="w-full pb-28 pt-4 px-4 max-w-xl mx-auto text-white flex flex-col min-h-[85vh] items-center justify-center text-center">
        {/* Screen Header during initialization */}
        <div className="w-full flex items-center justify-between mb-8">
          <button
            onClick={() => {
              playActionSound();
              stopCamera();
              setScreen('home');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-xs font-bold text-stone-200 hover:text-white uppercase tracking-wider transition active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </button>
          <span className="text-xs text-stone-400 font-mono">Verificação Inicial</span>
        </div>

        <div className="w-20 h-20 rounded-2xl bg-emerald-500/15 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 mb-5 shadow-xl animate-pulse">
          <Camera className="w-10 h-10 animate-bounce" />
        </div>

        <h2 className="text-lg font-black text-white mb-2">
          Verificando Câmera e Permissões
        </h2>

        <p className="text-xs text-stone-300 max-w-sm leading-relaxed mb-6">
          Verificando disponibilidade de hardware via <span className="font-mono text-emerald-400 bg-stone-900 px-1.5 py-0.5 rounded border border-emerald-500/30">navigator.mediaDevices.enumerateDevices</span> e solicitando permissão antes de renderizar a transmissão da câmera...
        </p>

        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 text-xs font-mono mb-6 shadow-md">
          <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
          <span>Solicitando autorização explícita...</span>
        </div>

        <div className="w-full max-w-xs space-y-2">
          <button
            type="button"
            onClick={handleOpenNativeCamera}
            className="w-full py-3 px-4 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs uppercase tracking-wider rounded-xl border border-stone-700 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
          >
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>Abrir Câmera do Celular</span>
          </button>
        </div>

        {/* Hidden inputs ready in DOM during init */}
        <input
          ref={nativeCameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileInputChange}
          className="hidden"
          aria-hidden="true"
        />
        <input
          ref={fileGalleryInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <div className="w-full pb-28 pt-2 px-4 max-w-xl mx-auto text-white flex flex-col min-h-[90vh]">
      
      {/* Hidden snapshot canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Native smartphone camera trigger (capture="environment" opens device camera app) */}
      <input
        ref={nativeCameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileInputChange}
        className="hidden"
        aria-hidden="true"
      />

      {/* Gallery file picker */}
      <input
        ref={fileGalleryInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
        aria-hidden="true"
      />

      {/* Screen Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => {
            playActionSound();
            stopCamera();
            setScreen('home');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-xs font-bold text-stone-200 hover:text-white uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>

        <h1 className="text-sm font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
          <Camera className="w-4 h-4" />
          <span>Identificar Resíduo</span>
        </h1>

        <button
          onClick={() => speakText("Identificação de resíduo. Toque em Tirar Foto com a Câmera do Celular, ou ative a câmera ao vivo, ou escolha uma das amostras reais de Manaus para testar a Inteligência Artificial.")}
          className="p-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-200 hover:text-white"
          title="Ouvir orientações"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Status Banner */}
      <div className="mb-3 px-3 py-2 bg-stone-900 border border-stone-800 rounded-xl flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {cameraActive ? (
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              CÂMERA ATIVA ({availableVideoDevices.length || 1} DISPOSITIVO{availableVideoDevices.length > 1 ? 'S' : ''})
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-stone-300 font-bold font-mono text-[11px]">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              {deviceChecked
                ? `${availableVideoDevices.length} CÂMERA(S) DETECTADA(S)`
                : 'PRONTO PARA FOTOGRAFAR'}
            </span>
          )}
        </div>

        <span className="text-[11px] text-stone-400 font-mono">
          IA Gemini 3.8 Flash
        </span>
      </div>

      {/* General Error notice if any */}
      {generalError && (
        <div className="mb-3 p-3 bg-red-950/80 border border-red-800/80 rounded-xl flex items-start gap-2 text-red-200 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
          <p className="flex-1">{generalError}</p>
        </div>
      )}

      {/* Camera / Viewfinder Container */}
      <div className="relative w-full aspect-[4/3] bg-stone-950 rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-2xl flex items-center justify-center select-none">
        
        {/* Live Video Element */}
        <video
          ref={videoRef}
          playsInline
          autoPlay
          muted
          className={`w-full h-full object-cover ${cameraActive && !capturedImage ? 'block' : 'hidden'}`}
        />

        {/* Captured Photo Preview */}
        {capturedImage && (
          <img
            src={capturedImage}
            alt="Foto do resíduo capturado"
            className="w-full h-full object-cover"
          />
        )}

        {/* Ready / Standby UI when not streaming */}
        {!cameraActive && !capturedImage && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-5 bg-gradient-to-b from-stone-900/95 to-stone-950 text-center">
            {cameraLoading ? (
              <div className="flex flex-col items-center gap-3">
                <RefreshCw className="w-9 h-9 text-emerald-400 animate-spin" />
                <p className="text-sm font-bold text-stone-200">Conectando à câmera...</p>
                <p className="text-xs text-stone-400">Solicitando acesso ao navegador</p>
              </div>
            ) : (
              <div className="space-y-3 max-w-sm">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 mx-auto shadow-lg">
                  <Camera className="w-8 h-8" />
                </div>
                
                <div>
                  <h2 className="text-base font-extrabold text-white">
                    Fotografe o Resíduo
                  </h2>
                  <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                    Aponte para o material reciclável para receber identificação imediata, padrão acessível e instruções de PEVs em Manaus.
                  </p>
                </div>

                {/* Primary Direct Button: Native Smartphone Camera (100% reliable) */}
                <div className="pt-1 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleOpenNativeCamera}
                    className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>ABRIR CÂMERA DO CELULAR (RECOMENDADO)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRetryCameraInitialization}
                    className="w-full py-2.5 px-3 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs uppercase tracking-wider rounded-xl border border-stone-700 flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Video className="w-4 h-4 text-emerald-400" />
                    <span>Verificar Dispositivos e Iniciar Câmera</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Framing Crosshair Overlay (visible when camera is active or ready) */}
        <div className="absolute inset-5 pointer-events-none flex flex-col justify-between">
          <div className="flex justify-between">
            <div className="w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl shadow" />
            <div className="w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl shadow" />
          </div>
          
          {/* Target Reticle */}
          <div className="self-center flex flex-col items-center">
            <div className="w-14 h-14 border-2 border-white/70 rounded-full flex items-center justify-center backdrop-blur-[1px]">
              <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            </div>
            <span className="mt-1.5 text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-black/80 text-white rounded border border-white/20">
              MIRA DE ENQUADRAMENTO
            </span>
          </div>

          <div className="flex justify-between">
            <div className="w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl shadow" />
            <div className="w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-xl shadow" />
          </div>
        </div>

        {/* AI Analysis Loading Spinner */}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-stone-950/92 backdrop-blur-md flex flex-col items-center justify-center gap-3 z-30">
            <div className="w-14 h-14 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin shadow-lg" />
            <div className="text-center px-4">
              <p className="text-base font-black text-white">Identificando com IA...</p>
              <p className="text-xs text-emerald-300 font-mono mt-1">
                Classificando material, padrão ColorADD e PEVs em Manaus
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Helpful Explanation if live camera error occurs */}
      {cameraError && (
        <div className="mt-3 p-3.5 bg-amber-950/70 border border-amber-600/60 rounded-xl text-amber-200 text-xs">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-2">
              <div>
                <strong className="font-extrabold text-amber-300 block">
                  Diagnóstico da câmera e dispositivos:
                </strong>
                <p className="mt-0.5 leading-relaxed text-stone-300">
                  {cameraError}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={handleRetryCameraInitialization}
                  className="flex-1 py-2 px-3 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs uppercase tracking-wider rounded-lg border border-stone-700 flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verificar e Tentar Novamente</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenNativeCamera}
                  className="flex-1 py-2 px-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs uppercase tracking-wider rounded-lg shadow flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Câmera do Celular</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons Toolbar */}
      <div className="mt-3 space-y-2">
        {!capturedImage ? (
          <div className="flex flex-col gap-2">
            
            {cameraActive ? (
              <button
                type="button"
                onClick={handleCaptureFromLiveStream}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 border-2 border-emerald-300 transition active:scale-95 cursor-pointer"
              >
                <Camera className="w-5 h-5" />
                <span>CAPTURAR FOTO DO RESÍDUO</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleOpenNativeCamera}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 border-2 border-emerald-300 transition active:scale-95 cursor-pointer"
              >
                <Camera className="w-5 h-5" />
                <span>TIRAR FOTO COM A CÂMERA DO CELULAR</span>
              </button>
            )}

            {/* Alternative Methods: Gallery and Live Toggle */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleOpenGallery}
                className="py-3 px-3 bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
              >
                <Upload className="w-4 h-4 text-blue-400" />
                <span>Enviar da Galeria</span>
              </button>

              {cameraActive ? (
                <button
                  type="button"
                  onClick={stopCamera}
                  className="py-3 px-3 bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 text-amber-400" />
                  <span>Desativar Câmera</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleRetryCameraInitialization}
                  className="py-3 px-3 bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
                >
                  <Video className="w-4 h-4 text-emerald-400" />
                  <span>Câmera na Tela</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleRetake}
              className="py-3.5 bg-stone-900 hover:bg-stone-800 text-stone-200 font-extrabold text-xs uppercase tracking-wider rounded-xl border border-stone-700 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Tirar Outra Foto</span>
            </button>

            <button
              type="button"
              onClick={() => executeAnalysis(capturedImage)}
              disabled={isAnalyzing}
              className="py-3.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs uppercase tracking-wider rounded-xl border-2 border-emerald-300 shadow-lg flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer disabled:opacity-60"
            >
              <Check className="w-4 h-4" />
              <span>{isAnalyzing ? 'Identificando...' : 'Reanalisar com IA'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Accordion: "Como funciona a câmera e como resolver dúvidas" */}
      <div className="mt-3 bg-stone-900/80 border border-stone-800 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setShowTroubleshoot(!showTroubleshoot)}
          className="w-full px-3.5 py-2.5 flex items-center justify-between text-left text-xs font-bold text-stone-300 hover:text-white transition cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <span>Dúvidas comuns: Como a câmera funciona no app?</span>
          </span>
          {showTroubleshoot ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showTroubleshoot && (
          <div className="px-3.5 pb-3 pt-1 text-xs text-stone-300 space-y-2 border-t border-stone-800/80 bg-stone-950/40">
            <p className="leading-relaxed">
              <strong>1. Por que aparece mensagem de permissão no navegador?</strong><br />
              Navegadores modernos (Google Chrome, Safari) bloqueiam chamadas contínuas de vídeo ao vivo quando o site roda dentro de janelas de teste ou sem interação prévia. Isso é uma regra de segurança do próprio navegador.
            </p>
            <p className="leading-relaxed">
              <strong>2. Como resolver de forma 100% garantida?</strong><br />
              Basta tocar em <strong>"Câmera do Celular"</strong>. Essa função aciona o aplicativo oficial de câmera do seu telefone (Android ou iPhone), tira a foto com a lente do seu celular e a IA do EcoAcess faz o reconhecimento imediatamente.
            </p>
            <p className="leading-relaxed">
              <strong>3. Posso testar sem ter um resíduo por perto?</strong><br />
              Sim! Toque em qualquer uma das <strong>Amostras de Manaus</strong> abaixo para testar instantaneamente a Inteligência Artificial e a classificação acessível.
            </p>
          </div>
        )}
      </div>

      {/* Quick Test Samples from Manaus */}
      <div className="mt-4 p-3 bg-stone-900/90 border border-stone-800 rounded-2xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Ou Identifique Amostras Reais de Manaus (1 Toque):
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {SAMPLE_WASTE_ITEMS.slice(0, 6).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelectSample(item)}
              className="p-1.5 rounded-xl border border-stone-800 bg-stone-950/80 hover:border-emerald-400 text-stone-200 text-left flex items-center gap-2 transition active:scale-95 cursor-pointer group"
            >
              <img 
                src={item.imageUrl} 
                alt={item.name} 
                className="w-9 h-9 rounded-lg object-cover shrink-0 border border-stone-800 group-hover:border-emerald-400" 
              />
              <div className="min-w-0">
                <span className="text-[10px] font-bold block truncate group-hover:text-emerald-300">
                  {item.name.split('(')[0]}
                </span>
                <span className="text-[9px] text-stone-400 font-mono block uppercase">
                  {item.category}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Result Modal displaying the AI Classification */}
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
