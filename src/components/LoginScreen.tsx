import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Sliders, 
  Leaf, 
  ShieldCheck, 
  Quote, 
  Calendar, 
  Sparkles,
  Info,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ColorBlindnessType, ContrastMode, FontSizeOption } from '../types';

export const LoginScreen: React.FC = () => {
  const { 
    login, 
    setScreen, 
    dailyWallpaper, 
    dailyQuote, 
    currentDayTheme,
    accessibility, 
    updateAccessibility,
    playActionSound 
  } = useApp();

  const [username, setUsername] = useState('thiago.am');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [showPreAccessibility, setShowPreAccessibility] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!username.trim()) {
      setLoginError('Por favor, informe seu usuário ou e-mail.');
      return;
    }
    const success = login(username);
    if (!success) {
      setLoginError('Usuário bloqueado ou credenciais inválidas.');
    }
  };

  const handleAdminQuickLogin = () => {
    login('admin', 'admin');
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-stone-950 text-white">
      {/* Dynamic Background Image with High Contrast Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105"
        style={{ backgroundImage: `url(${currentDayTheme?.wallpaper?.imageUrl || dailyWallpaper.imageUrl})` }}
        aria-hidden="true"
      />
      
      {/* High-contrast gradient overlay ensuring WCAG AAA legibility */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/75 to-stone-950/95 backdrop-blur-[2px]"
        aria-hidden="true"
      />

      {/* Top Header Bar */}
      <header className="relative z-10 w-full px-5 pt-6 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-md">
          <Calendar className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-medium text-stone-200">
            {currentDayTheme ? `${currentDayTheme.dayOfWeekName.slice(0, 3)}, ${currentDayTheme.date.getDate()} ${currentDayTheme.date.toLocaleDateString('pt-BR', { month: 'short' })}` : new Date().toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })}
          </span>
          <span className="text-white/40">·</span>
          <span className="text-xs text-emerald-300 font-semibold">{currentDayTheme?.themeTag || dailyWallpaper.themeTag}</span>
        </div>

        {/* Pre-login Accessibility Button */}
        <button
          onClick={() => {
            playActionSound();
            setShowPreAccessibility(true);
          }}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs tracking-wide shadow-lg border border-emerald-400/40 transition active:scale-95 focus:ring-2 focus:ring-white focus:outline-none"
          aria-label="Abrir configurações de acessibilidade antes do login"
        >
          <Sliders className="w-4 h-4" />
          <span>Acessibilidade</span>
        </button>
      </header>

      {/* Main Login Content */}
      <main className="relative z-10 w-full max-w-md mx-auto px-6 py-4 flex flex-col items-center justify-center flex-1">
        
        {/* Brand & Identity */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-600/90 border-2 border-emerald-400 shadow-2xl mb-3 shadow-emerald-900/50">
            <Leaf className="w-9 h-9 text-emerald-100" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center justify-center gap-1.5">
            EcoAcess <span className="text-emerald-400">Manaus</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-xs mx-auto font-medium leading-relaxed">
            "Tecnologia, acessibilidade e sustentabilidade ao seu alcance."
          </p>
        </div>

        {/* Daily Motivational Quote Card */}
        <div className="w-full mb-6 p-3.5 rounded-xl bg-black/60 border border-white/20 backdrop-blur-md shadow-lg">
          <div className="flex items-start gap-2.5">
            <Quote className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 rotate-180" />
            <div>
              <p className="text-xs sm:text-sm font-medium text-stone-100 italic leading-snug">
                "{currentDayTheme?.quote?.text || dailyQuote.text}"
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[11px] text-emerald-300 font-semibold uppercase tracking-wider">
                  — {currentDayTheme?.quote?.authorOrContext || dailyQuote.authorOrContext}
                </span>
                <span className="text-[10px] text-stone-400">· Frase do Dia</span>
              </div>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="w-full bg-stone-900/90 border border-stone-700/80 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleLogin} className="space-y-4">
            
            {loginError && (
              <div className="p-3 rounded-lg bg-red-950/80 border border-red-500/80 text-red-200 text-xs font-medium flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Username Input */}
            <div>
              <label 
                htmlFor="username" 
                className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5"
              >
                Usuário ou E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Digite seu usuário"
                  className="w-full pl-10 pr-4 py-3 bg-stone-950/80 border-2 border-stone-700 rounded-xl text-stone-100 placeholder-stone-500 text-sm font-medium focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40 focus:outline-none transition"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label 
                  htmlFor="password" 
                  className="block text-xs font-bold uppercase tracking-wider text-stone-300"
                >
                  Senha
                </label>
                <button
                  type="button"
                  onClick={() => {
                    playActionSound();
                    alert('Dica de demonstração: Você pode entrar como usuário comum ou clicar no botão Administrador abaixo.');
                  }}
                  className="text-xs text-emerald-400 hover:text-emerald-300 underline font-medium focus:outline-none"
                >
                  Esqueci minha senha
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full pl-10 pr-11 py-3 bg-stone-950/80 border-2 border-stone-700 rounded-xl text-stone-100 placeholder-stone-500 text-sm font-medium focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40 focus:outline-none transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => {
                    playActionSound();
                    setShowPassword(!showPassword);
                  }}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-200 focus:outline-none"
                  aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/30 transition transform active:scale-[0.98] border-2 border-emerald-300 focus:ring-4 focus:ring-emerald-400/50 focus:outline-none cursor-pointer"
            >
              ENTRAR NO ECOACESS
            </button>
          </form>

          {/* Quick prototype admin login badge */}
          <div className="mt-4 pt-4 border-t border-stone-800 flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>Acesso Rápido para Avaliador / TCC:</span>
            </div>
            <button
              type="button"
              onClick={handleAdminQuickLogin}
              className="w-full py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/40 font-bold text-xs flex items-center justify-center gap-2 transition active:scale-95"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Entrar como Administrador (admin / admin)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playActionSound();
                setScreen('register');
              }}
              className="w-full py-2 text-center text-xs text-stone-300 hover:text-white font-semibold transition"
            >
              Não tem conta? <span className="text-emerald-400 underline font-bold">Criar conta acessível</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer info */}
      <footer className="relative z-10 w-full px-6 py-4 text-center text-[11px] text-stone-400 bg-black/50 border-t border-white/10">
        <p>Projeto EcoAcess Manaus · Protanopia · Deuteranopia · Tritanopia · Inclusão na Amazônia</p>
      </footer>

      {/* Pre-login Accessibility Sheet / Modal */}
      {showPreAccessibility && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="acc-title"
        >
          <div className="w-full max-w-lg bg-stone-900 border border-stone-700 rounded-t-2xl sm:rounded-2xl p-6 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-400" />
                <h2 id="acc-title" className="text-base font-bold text-white">
                  Acessibilidade Prévia
                </h2>
              </div>
              <button
                onClick={() => setShowPreAccessibility(false)}
                className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs font-semibold"
              >
                Concluir
              </button>
            </div>

            <p className="text-xs text-stone-300 mb-4">
              Configure como você deseja visualizar e interagir com o EcoAcess Manaus antes mesmo de fazer login.
            </p>

            <div className="space-y-4 text-sm">
              {/* Tipo de Daltonismo */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-300 mb-2">
                  Tipo de Visão / Daltonismo
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'deuteranopia', label: 'Deuteranopia', desc: 'Dificuldade com verde' },
                    { id: 'protanopia', label: 'Protanopia', desc: 'Dificuldade com vermelho' },
                    { id: 'tritanopia', label: 'Tritanopia', desc: 'Dificuldade com azul/amarelo' },
                    { id: 'achromatopsia', label: 'Acromatopsia', desc: 'Visão monocromática' },
                    { id: 'unknown', label: 'Não Sei', desc: 'Garantir símbolos universais' },
                    { id: 'none', label: 'Visão Típica', desc: 'Sem daltonismo' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => updateAccessibility({ colorBlindnessType: item.id as ColorBlindnessType })}
                      className={`p-2.5 rounded-xl border text-left flex flex-col transition ${
                        accessibility.colorBlindnessType === item.id
                          ? 'bg-emerald-950/80 border-emerald-400 text-emerald-100 font-bold'
                          : 'bg-stone-800/80 border-stone-700 text-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">{item.label}</span>
                        {accessibility.colorBlindnessType === item.id && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                      <span className="text-[10px] opacity-75 mt-0.5">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulação em tempo real para avaliadores */}
              <div className="p-3 bg-stone-800/60 rounded-xl border border-stone-700 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Simular Daltonismo na Tela</span>
                  <span className="text-[11px] text-stone-400">Ativa o filtro de cores real nos olhos do avaliador</span>
                </div>
                <input
                  type="checkbox"
                  checked={accessibility.simulateFilter}
                  onChange={(e) => updateAccessibility({ simulateFilter: e.target.checked })}
                  className="w-5 h-5 accent-emerald-500 rounded"
                />
              </div>

              {/* Contraste */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-300 mb-2">
                  Modo de Contraste
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'normal', label: 'Padrão Suave' },
                    { id: 'high-contrast-dark', label: 'Alto Contraste Escuro' },
                    { id: 'yellow-black', label: 'Amarelo sobre Preto' },
                    { id: 'high-contrast-light', label: 'Alto Contraste Claro' },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => updateAccessibility({ contrastMode: mode.id as ContrastMode })}
                      className={`p-2 rounded-xl border text-xs text-left transition ${
                        accessibility.contrastMode === mode.id
                          ? 'bg-emerald-950/80 border-emerald-400 text-white font-bold'
                          : 'bg-stone-800/80 border-stone-700 text-stone-300'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tamanho da Fonte */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-300 mb-2">
                  Tamanho do Texto
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'normal', label: 'Padrão (100%)' },
                    { id: 'large', label: 'Grande (115%)' },
                    { id: 'extra-large', label: 'Extra (130%)' },
                  ].map((size) => (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => updateAccessibility({ fontSize: size.id as FontSizeOption })}
                      className={`p-2 rounded-xl border text-xs text-center transition ${
                        accessibility.fontSize === size.id
                          ? 'bg-emerald-950/80 border-emerald-400 text-white font-bold'
                          : 'bg-stone-800/80 border-stone-700 text-stone-300'
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles de Som, Vibração e Padrões */}
              <div className="space-y-2 pt-2 border-t border-stone-800">
                <label className="flex items-center justify-between py-1 text-xs text-stone-200">
                  <span>Ativar Sons & Beeps de Feedback</span>
                  <input
                    type="checkbox"
                    checked={accessibility.soundEnabled}
                    onChange={(e) => updateAccessibility({ soundEnabled: e.target.checked })}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                </label>
                <label className="flex items-center justify-between py-1 text-xs text-stone-200">
                  <span>Vibração Tátil de Confirmação</span>
                  <input
                    type="checkbox"
                    checked={accessibility.vibrationEnabled}
                    onChange={(e) => updateAccessibility({ vibrationEnabled: e.target.checked })}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                </label>
                <label className="flex items-center justify-between py-1 text-xs text-stone-200">
                  <span>Exibir Símbolos ColorADD nos coletores</span>
                  <input
                    type="checkbox"
                    checked={accessibility.showColorAddSymbols}
                    onChange={(e) => updateAccessibility({ showColorAddSymbols: e.target.checked })}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                </label>
                <label className="flex items-center justify-between py-1 text-xs text-stone-200">
                  <span>Exibir Texturas & Hachuras geométricas</span>
                  <input
                    type="checkbox"
                    checked={accessibility.showTexturePatterns}
                    onChange={(e) => updateAccessibility({ showTexturePatterns: e.target.checked })}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={() => setShowPreAccessibility(false)}
                className="w-full mt-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-extrabold rounded-xl text-xs uppercase tracking-wider"
              >
                Salvar Preferências e Voltar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
