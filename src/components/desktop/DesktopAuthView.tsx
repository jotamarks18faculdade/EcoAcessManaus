import React, { useState, useEffect } from 'react';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Leaf, 
  ShieldCheck, 
  Quote, 
  Calendar, 
  Sparkles, 
  Check, 
  Volume2, 
  Monitor, 
  Smartphone,
  TreePine,
  ArrowRight,
  Mail,
  UserPlus,
  LogIn,
  Baby,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { speakText } from '../../utils/audio';
import { DeviceModePreference } from '../../hooks/useDeviceDetection';
import { ColorBlindnessType } from '../../types';

interface DesktopAuthViewProps {
  preference: DeviceModePreference;
  setPreference: (pref: DeviceModePreference) => void;
  detectedType: string;
}

export const DesktopAuthView: React.FC<DesktopAuthViewProps> = ({
  preference,
  setPreference,
  detectedType
}) => {
  const { 
    login, 
    registerUser,
    currentScreen,
    setScreen, 
    currentDayTheme, 
    dailyWallpaper, 
    playActionSound,
    accessibility,
    updateAccessibility
  } = useApp();

  // Mode: either 'login' or 'register'
  const isRegisterMode = currentScreen === 'register';

  // Login Form States
  const [username, setUsername] = useState('larissa.eco');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Register Form States (Individual vs Family)
  const [accountType, setAccountType] = useState<'individual' | 'family'>('individual');
  
  // Individual fields (Adults, Citizens, Students)
  const [individualName, setIndividualName] = useState('');
  const [individualEmail, setIndividualEmail] = useState('');
  const [individualUsername, setIndividualUsername] = useState('');

  // Family / Child fields (Only when supervisor mode selected)
  const [guardianName, setGuardianName] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');
  const [childName, setChildName] = useState('');
  const [childUsername, setChildUsername] = useState('');

  // Shared register fields
  const [registerPassword, setRegisterPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [selectedColorType, setSelectedColorType] = useState<ColorBlindnessType>(accessibility.colorBlindnessType);
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const daltonismTypes: { id: ColorBlindnessType; label: string; desc: string; icon: string }[] = [
    { id: 'deuteranopia', label: 'Deuteranopia', desc: 'Dificuldade com verde', icon: '🌿' },
    { id: 'protanopia', label: 'Protanopia', desc: 'Dificuldade com vermelho', icon: '🔴' },
    { id: 'tritanopia', label: 'Tritanopia', desc: 'Dificuldade com azul/amarelo', icon: '🔷' },
    { id: 'achromatopsia', label: 'Acromatopsia', desc: 'Visão monocromática (preto/branco)', icon: '⬛' },
    { id: 'unknown', label: 'Não Sei Informar', desc: 'Símbolos universais e hachuras ativados', icon: '❓' },
    { id: 'none', label: 'Visão Típica', desc: 'Sem daltonismo diagnosticado', icon: '👁️' },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!username.trim()) {
      setLoginError('Por favor, informe seu usuário ou e-mail.');
      return;
    }
    playActionSound();
    const success = login(username.trim());
    if (success) {
      setLoginSuccess(true);
    } else {
      setLoginError('Usuário bloqueado ou credenciais inválidas.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');

    if (accountType === 'individual') {
      if (!individualName.trim()) {
        setRegisterError('Por favor, informe seu nome completo.');
        return;
      }
      if (!individualEmail.trim()) {
        setRegisterError('Por favor, informe seu e-mail.');
        return;
      }
      if (!individualUsername.trim()) {
        setRegisterError('Por favor, informe um nome de usuário para acesso.');
        return;
      }

      playActionSound();
      registerUser(
        individualName.trim(),
        individualEmail.trim(),
        individualUsername.trim().toLowerCase().replace(/\s+/g, '.'),
        selectedColorType,
        { accountType: 'individual' }
      );
      setRegisterSuccess(true);
    } else {
      if (!guardianName.trim() || !guardianEmail.trim()) {
        setRegisterError('Preencha o nome e e-mail do responsável.');
        return;
      }
      if (!childName.trim() || !childUsername.trim()) {
        setRegisterError('Preencha o nome e nome de usuário da criança.');
        return;
      }

      playActionSound();
      registerUser(
        childName.trim(),
        guardianEmail.trim(),
        childUsername.trim().toLowerCase().replace(/\s+/g, '.'),
        selectedColorType,
        {
          accountType: 'family',
          guardianName: guardianName.trim(),
          guardianEmail: guardianEmail.trim(),
        }
      );
      setRegisterSuccess(true);
    }
  };

  const handleAdminQuick = () => {
    playActionSound();
    login('admin', 'admin');
  };

  const handleAdultQuick = () => {
    playActionSound();
    login('larissa.eco', 'user');
  };

  const handleChildQuick = () => {
    playActionSound();
    login('thiago.am', 'user');
  };

  const handleGuestQuick = () => {
    playActionSound();
    login('convidado.manaus', 'user');
  };

  const handleSpeakTheme = () => {
    const text = `Bem-vindo ao EcoAcess Manaus. Hoje é ${currentDayTheme.dayOfWeekName}, ${currentDayTheme.dateFormatted}. ` +
      `Mensagem do dia: ${currentDayTheme.quote.text}. Autor: ${currentDayTheme.quote.authorOrContext}.`;
    speakText(text);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-stone-950 text-white select-none">
      
      {/* LEFT HALF: Amazonian Showcase & Daily Theme (50% on desktop) */}
      <div className="relative flex-1 hidden lg:flex flex-col justify-between p-12 overflow-hidden border-r border-stone-800">
        
        {/* Background photo */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105 opacity-35 pointer-events-none"
          style={{ backgroundImage: `url(${currentDayTheme?.wallpaper?.imageUrl || dailyWallpaper.imageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-stone-950/40" />

        {/* Top brand */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-md">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white">EcoAcess</span>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-mono">Manaus</span>
              </div>
              <p className="text-xs text-stone-400">Educação Ambiental & Inclusão Sensorial</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playActionSound();
                setPreference('mobile');
              }}
              className="px-3 py-1.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 border border-stone-700 text-stone-300 text-xs font-semibold flex items-center gap-1.5 transition"
              title="Testar como aplicativo de celular"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ver como Celular</span>
            </button>
          </div>
        </div>

        {/* Center content: Daily quote and highlights */}
        <div className="relative z-10 max-w-xl space-y-6 my-auto">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
              <TreePine className="w-3.5 h-3.5" />
              <span>{currentDayTheme.themeTag}</span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              Sustentabilidade e inclusão sensorial para todos os cidadãos de Manaus.
            </h1>

            <p className="text-base text-stone-300 leading-relaxed italic">
              "{currentDayTheme.quote.text}"
            </p>
            <div className="text-xs text-emerald-400 font-bold font-mono">
              — {currentDayTheme.quote.authorOrContext}
            </div>
          </div>

          {/* Highlights checklist */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-800/80 text-xs">
            <div className="flex items-center gap-2.5 text-stone-200">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span>Símbolos ColorAdd para daltonismo</span>
            </div>

            <div className="flex items-center gap-2.5 text-stone-200">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span>Mapeamento de PEVs em toda Manaus</span>
            </div>

            <div className="flex items-center gap-2.5 text-stone-200">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span>Leitor de áudio em voz alta</span>
            </div>

            <div className="flex items-center gap-2.5 text-stone-200">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span>Para adultos, escolas e famílias</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-stone-500 font-mono">
          <span>{currentDayTheme.wallpaper.title} · Manaus, AM</span>
          <button
            onClick={handleSpeakTheme}
            className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition"
          >
            <Volume2 className="w-4 h-4" />
            <span>Ouvir Mensagem</span>
          </button>
        </div>
      </div>

      {/* RIGHT HALF: Interactive Authentication / Registration Card (50%) */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 max-w-xl mx-auto w-full overflow-y-auto">
        <div className="w-full space-y-5">
          
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-stone-900 border border-stone-800 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                playActionSound();
                setScreen('login');
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
                !isRegisterMode
                  ? 'bg-emerald-500 text-stone-950 shadow-md font-extrabold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Entrar no Sistema</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playActionSound();
                setScreen('register');
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
                isRegisterMode
                  ? 'bg-emerald-500 text-stone-950 shadow-md font-extrabold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Criar Nova Conta</span>
            </button>
          </div>

          {/* Heading */}
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              {isRegisterMode ? 'Cadastro Universal & Inclusivo' : 'Acesso ao Sistema'}
            </span>
            <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight mt-0.5">
              {isRegisterMode ? 'Criar Conta no EcoAcess' : 'Entrar no EcoAcess'}
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              {isRegisterMode
                ? 'Aberto a todos os cidadãos de Manaus: adultos, estudantes, coletores, famílias e crianças.'
                : 'Identifique-se para acessar missões ecológicas, descarte correto e rede de PEVs em Manaus.'}
            </p>
          </div>

          {/* LOGIN FORM VIEW */}
          {!isRegisterMode ? (
            <div className="space-y-4">
              {loginError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                    Usuário ou E-mail
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Ex: larissa.eco, thiago.am ou admin"
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-sm text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500 transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
                      Senha
                    </label>
                    <span className="text-[11px] text-stone-500">Qualquer senha no modo demonstração</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-sm text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-stone-500 hover:text-stone-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-sm shadow-md shadow-emerald-500/20 transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Entrar no Sistema</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Quick Access Profiles for Demo & Evaluation */}
              <div className="pt-4 border-t border-stone-800 space-y-2.5">
                <span className="text-[11px] font-mono text-stone-400 uppercase font-bold block text-center">
                  Acesso Rápido para Avaliação (1 Clique):
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={handleAdultQuick}
                    className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 hover:border-emerald-500/50 hover:bg-stone-850 transition text-left cursor-pointer group"
                  >
                    <div className="text-xs font-bold text-white flex items-center gap-1.5 group-hover:text-emerald-400">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Larissa (Adulta)</span>
                    </div>
                    <div className="text-[10px] text-stone-400 mt-0.5">
                      Conta Individual
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={handleChildQuick}
                    className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 hover:border-emerald-500/50 hover:bg-stone-850 transition text-left cursor-pointer group"
                  >
                    <div className="text-xs font-bold text-white flex items-center gap-1.5 group-hover:text-emerald-400">
                      <span>🌿</span>
                      <span>Thiago (Criança)</span>
                    </div>
                    <div className="text-[10px] text-stone-400 mt-0.5">
                      Com Responsável
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={handleAdminQuick}
                    className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 hover:border-amber-500/50 hover:bg-stone-850 transition text-left cursor-pointer group"
                  >
                    <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>SEMULSP</span>
                    </div>
                    <div className="text-[10px] text-stone-400 mt-0.5">
                      Gestão & Admin
                    </div>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleGuestQuick}
                  className="w-full py-2 rounded-xl bg-stone-900/60 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-stone-200 text-xs font-medium transition text-center"
                >
                  Entrar como Visitante Convidado (Sem cadastro prévio)
                </button>
              </div>

              <div className="text-center text-xs text-stone-400 pt-2">
                Ainda não tem cadastro?{' '}
                <button
                  type="button"
                  onClick={() => {
                    playActionSound();
                    setScreen('register');
                  }}
                  className="text-emerald-400 hover:underline font-bold"
                >
                  Criar Nova Conta Gratuita
                </button>
              </div>
            </div>
          ) : (
            /* UNIVERSAL REGISTRATION FORM VIEW */
            <div className="space-y-4">
              {registerError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{registerError}</span>
                </div>
              )}

              {/* Account Type Selector: Individual vs Family */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-stone-300 uppercase tracking-wider">
                  Selecione o Tipo de Perfil:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      playActionSound();
                      setAccountType('individual');
                      setRegisterError('');
                    }}
                    className={`p-3 rounded-xl border text-left transition flex items-start gap-2.5 cursor-pointer ${
                      accountType === 'individual'
                        ? 'bg-emerald-500/15 border-emerald-400 text-white shadow-sm ring-1 ring-emerald-400/30'
                        : 'bg-stone-900/80 border-stone-800 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold flex items-center justify-between">
                        <span>Conta Individual</span>
                        {accountType === 'individual' && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                      </div>
                      <p className="text-[10px] text-stone-400 mt-0.5 leading-tight">
                        Adulto, universitário, coletor ou cidadão autônomo.
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playActionSound();
                      setAccountType('family');
                      setRegisterError('');
                    }}
                    className={`p-3 rounded-xl border text-left transition flex items-start gap-2.5 cursor-pointer ${
                      accountType === 'family'
                        ? 'bg-emerald-500/15 border-emerald-400 text-white shadow-sm ring-1 ring-emerald-400/30'
                        : 'bg-stone-900/80 border-stone-800 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                      <Baby className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold flex items-center justify-between">
                        <span>Conta Familiar / Infantil</span>
                        {accountType === 'family' && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                      </div>
                      <p className="text-[10px] text-stone-400 mt-0.5 leading-tight">
                        Criança vinculada a pai, mãe ou tutor legal.
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Informative context banner based on chosen profile */}
              {accountType === 'individual' ? (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-200 text-xs flex items-center gap-2">
                  <UserCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>
                    <strong>Conta Pessoal Direta:</strong> Você está criando uma conta para si mesmo(a). Não é necessário preencher nenhum dado de responsável.
                  </span>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-200 text-xs flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>
                    <strong>Conta Supervisionada:</strong> O responsável acompanha o progresso, limites e missões da criança no painel de controle.
                  </span>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                
                {/* FIELDS FOR INDIVIDUAL ACCOUNT (Adults, Citizens, Collectors) */}
                {accountType === 'individual' && (
                  <div className="p-3.5 bg-stone-900/80 rounded-2xl border border-stone-800 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 font-mono uppercase">
                      <User className="w-4 h-4" />
                      <span>Seus Dados Pessoais</span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-300 uppercase mb-1">
                          Nome Completo
                        </label>
                        <input
                          type="text"
                          value={individualName}
                          onChange={(e) => setIndividualName(e.target.value)}
                          placeholder="Ex: Mariana Costa ou Carlos Oliveira"
                          className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-stone-300 uppercase mb-1">
                            Seu E-mail
                          </label>
                          <input
                            type="email"
                            value={individualEmail}
                            onChange={(e) => setIndividualEmail(e.target.value)}
                            placeholder="mariana@exemplo.com"
                            className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-stone-300 uppercase mb-1">
                            Nome de Usuário (Login)
                          </label>
                          <input
                            type="text"
                            value={individualUsername}
                            onChange={(e) => setIndividualUsername(e.target.value)}
                            placeholder="mariana.am"
                            className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500 font-mono"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-stone-300 uppercase mb-1">
                          Senha
                        </label>
                        <div className="relative">
                          <input
                            type={showRegisterPassword ? 'text' : 'password'}
                            value={registerPassword}
                            onChange={(e) => setRegisterPassword(e.target.value)}
                            placeholder="Defina sua senha"
                            className="w-full pl-3 pr-9 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                            className="absolute right-2.5 top-2.5 text-stone-500 hover:text-stone-300"
                          >
                            {showRegisterPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* FIELDS FOR FAMILY ACCOUNT (Parent + Child) */}
                {accountType === 'family' && (
                  <>
                    {/* Section 1: Dados do Responsável */}
                    <div className="p-3.5 bg-stone-900/80 rounded-2xl border border-stone-800 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-400 font-mono uppercase">
                        <ShieldCheck className="w-4 h-4" />
                        <span>1. Dados do Responsável (Pai / Mãe / Tutor)</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-stone-300 uppercase mb-1">
                            Nome do Responsável
                          </label>
                          <input
                            type="text"
                            value={guardianName}
                            onChange={(e) => setGuardianName(e.target.value)}
                            placeholder="Ex: Carlos Barreto"
                            className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-stone-300 uppercase mb-1">
                            E-mail do Responsável
                          </label>
                          <input
                            type="email"
                            value={guardianEmail}
                            onChange={(e) => setGuardianEmail(e.target.value)}
                            placeholder="carlos@exemplo.com"
                            className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Dados da Criança */}
                    <div className="p-3.5 bg-stone-900/80 rounded-2xl border border-stone-800 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 font-mono uppercase">
                        <Baby className="w-4 h-4" />
                        <span>2. Dados da Criança</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-stone-300 uppercase mb-1">
                            Nome da Criança
                          </label>
                          <input
                            type="text"
                            value={childName}
                            onChange={(e) => setChildName(e.target.value)}
                            placeholder="Ex: Thiago Barreto"
                            className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-stone-300 uppercase mb-1">
                            Nome de Usuário (Login da Criança)
                          </label>
                          <input
                            type="text"
                            value={childUsername}
                            onChange={(e) => setChildUsername(e.target.value)}
                            placeholder="Ex: thiago.am"
                            className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500 font-mono"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-stone-300 uppercase mb-1">
                          Senha de Acesso
                        </label>
                        <div className="relative">
                          <input
                            type={showRegisterPassword ? 'text' : 'password'}
                            value={registerPassword}
                            onChange={(e) => setRegisterPassword(e.target.value)}
                            placeholder="••••••"
                            className="w-full pl-3 pr-9 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                            className="absolute right-2.5 top-2.5 text-stone-500 hover:text-stone-300"
                          >
                            {showRegisterPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Section: Perfil de Daltonismo / Visão (Comum a ambos os tipos) */}
                <div className="p-3.5 bg-stone-900/80 rounded-2xl border border-stone-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 font-mono uppercase">
                      {accountType === 'individual' ? 'Seu Perfil de Visão / Daltonismo' : 'Perfil de Visão da Criança'}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      Personaliza o EcoAcess
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {daltonismTypes.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => {
                          playActionSound();
                          setSelectedColorType(type.id);
                          updateAccessibility({ colorBlindnessType: type.id });
                        }}
                        className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                          selectedColorType === type.id
                            ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-sm ring-1 ring-emerald-400/40'
                            : 'bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-700'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold mb-0.5">
                          <span className="truncate">{type.label}</span>
                          {selectedColorType === type.id && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                        </div>
                        <span className="text-[10px] text-stone-400 block line-clamp-1">{type.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-sm shadow-md shadow-emerald-500/20 transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>
                    {accountType === 'individual'
                      ? 'Criar Minha Conta Individual (+150 pts)'
                      : 'Concluir Cadastro Familiar & Iniciar (+150 pts)'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="text-center text-xs text-stone-400 pt-1">
                Já possui uma conta criada?{' '}
                <button
                  type="button"
                  onClick={() => {
                    playActionSound();
                    setScreen('login');
                  }}
                  className="text-emerald-400 hover:underline font-bold"
                >
                  Fazer Login
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};

