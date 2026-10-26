import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  ArrowLeft, 
  CheckCircle, 
  Eye, 
  EyeOff, 
  HelpCircle, 
  Sun, 
  Sparkles,
  Check,
  Baby,
  UserCheck,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ColorBlindnessType, AccountProfileType } from '../types';

export const RegisterScreen: React.FC = () => {
  const { setScreen, registerUser, playActionSound, accessibility, updateAccessibility } = useApp();

  const [accountType, setAccountType] = useState<AccountProfileType>('individual');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [guardianName, setGuardianName] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');
  const [colorType, setColorType] = useState<ColorBlindnessType>(accessibility.colorBlindnessType);
  const [errorMsg, setErrorMsg] = useState('');

  const daltonismOptions: {
    id: ColorBlindnessType;
    name: string;
    symbol: string;
    icon: string;
    description: string;
    colorImpact: string;
  }[] = [
    {
      id: 'unknown',
      name: 'Não Sei Informar',
      symbol: '❓',
      icon: 'HelpCircle',
      description: 'Tenho incerteza ou nunca fiz o teste de Ishihara.',
      colorImpact: 'O EcoAcess ativará todos os símbolos e hachuras universais.',
    },
    {
      id: 'deuteranopia',
      name: 'Deuteranopia (Verde)',
      symbol: '🌿✖',
      icon: 'Eye',
      description: 'Ausência ou defeito nos cones sensíveis à luz verde.',
      colorImpact: 'Dificuldade entre verde e vermelho/castanho. O app usará traços / e hachuras.',
    },
    {
      id: 'protanopia',
      name: 'Protanopia (Vermelho)',
      symbol: '🔴✖',
      icon: 'Eye',
      description: 'Ausência ou defeito nos cones sensíveis à luz vermelha.',
      colorImpact: 'O vermelho aparece mais escuro e confunde-se com preto/verde.',
    },
    {
      id: 'tritanopia',
      name: 'Tritanopia (Azul/Amarelo)',
      symbol: '🔷✖',
      icon: 'Eye',
      description: 'Deficiência nos cones sensíveis à luz azul.',
      colorImpact: 'Dificuldade para distinguir azul de verde e amarelo de violeta.',
    },
    {
      id: 'achromatopsia',
      name: 'Acromatopsia / Monocromacia',
      symbol: '⬛⬜',
      icon: 'Sun',
      description: 'Visão totalmente sem cores (escala de cinza).',
      colorImpact: 'Diferenciação 100% baseada em padrões táteis, texturas e símbolos.',
    },
    {
      id: 'none',
      name: 'Outro / Sem Daltonismo',
      symbol: '👁️',
      icon: 'Eye',
      description: 'Visão típica ou outro distúrbio visual.',
      colorImpact: 'Interface adaptável com alta legibilidade.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !email.trim() || !username.trim() || !password) {
      setErrorMsg('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (accountType === 'family' && (!guardianName.trim() || !guardianEmail.trim())) {
      setErrorMsg('Por favor, preencha o nome e e-mail do responsável.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('A confirmação da senha não confere.');
      return;
    }

    registerUser(name, email, username, colorType, {
      accountType,
      guardianName: accountType === 'family' ? guardianName.trim() : undefined,
      guardianEmail: accountType === 'family' ? guardianEmail.trim() : undefined,
    });
  };

  return (
    <div className="min-h-screen bg-stone-950 text-white p-4 sm:p-6 flex flex-col justify-center items-center">
      <div className="w-full max-w-lg bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        
        {/* Back button */}
        <button
          onClick={() => {
            playActionSound();
            setScreen('login');
          }}
          className="inline-flex items-center gap-2 text-stone-300 hover:text-white text-xs font-bold uppercase tracking-wider mb-4 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Login</span>
        </button>

        <div className="mb-5">
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            Cadastro no EcoAcess <Sparkles className="w-5 h-5 text-emerald-400" />
          </h1>
          <p className="text-xs text-stone-300 mt-1">
            Inclusivo para todos os cidadãos de Manaus: adultos, jovens, estudantes e famílias.
          </p>
        </div>

        {/* Account Profile Type Selector */}
        <div className="mb-4 space-y-1.5">
          <label className="block text-[11px] font-bold text-stone-300 uppercase tracking-wider">
            Tipo de Perfil de Conta:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                playActionSound();
                setAccountType('individual');
                setErrorMsg('');
              }}
              className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 cursor-pointer ${
                accountType === 'individual'
                  ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-sm ring-1 ring-emerald-400/30'
                  : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
              }`}
            >
              <User className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-bold leading-tight">Individual</div>
                <div className="text-[10px] text-stone-400">Adulto / Cidadão</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                playActionSound();
                setAccountType('family');
                setErrorMsg('');
              }}
              className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 cursor-pointer ${
                accountType === 'family'
                  ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-sm ring-1 ring-emerald-400/30'
                  : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
              }`}
            >
              <Baby className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <div className="text-xs font-bold leading-tight">Familiar</div>
                <div className="text-[10px] text-stone-400">Criança c/ Tutor</div>
              </div>
            </button>
          </div>
        </div>

        {/* Context banner */}
        {accountType === 'individual' ? (
          <div className="mb-4 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2">
            <UserCheck className="w-4 h-4 shrink-0 text-emerald-400" />
            <span><strong>Conta Pessoal:</strong> Preencha seus próprios dados. Nenhum dado de responsável é necessário.</span>
          </div>
        ) : (
          <div className="mb-4 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
            <span><strong>Conta Supervisionada:</strong> O responsável acompanha o progresso e missões da criança.</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-950/80 border border-red-500 rounded-xl text-red-200 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {/* Guardian fields when family */}
          {accountType === 'family' && (
            <div className="p-3 bg-stone-950/80 rounded-xl border border-stone-800 space-y-3">
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Dados do Responsável</span>
              </div>
              
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1">
                  Nome do Responsável
                </label>
                <input
                  type="text"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  placeholder="Ex: Carlos Barreto"
                  className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-stone-100 text-xs focus:border-emerald-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1">
                  E-mail do Responsável
                </label>
                <input
                  type="email"
                  value={guardianEmail}
                  onChange={(e) => setGuardianEmail(e.target.value)}
                  placeholder="carlos@exemplo.com"
                  className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-stone-100 text-xs focus:border-emerald-400 focus:outline-none"
                  required
                />
              </div>
            </div>
          )}

          {/* Nome */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1">
              {accountType === 'individual' ? 'Seu Nome Completo' : 'Nome da Criança'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={accountType === 'individual' ? 'Ex: Mariana Costa' : 'Ex: Thiago Barreto'}
                className="w-full pl-10 pr-4 py-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 text-sm focus:border-emerald-400 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* E-mail */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1">
              {accountType === 'individual' ? 'Seu E-mail' : 'E-mail de Contato da Conta'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mariana@exemplo.com.br"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 text-sm focus:border-emerald-400 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Usuário */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1">
              {accountType === 'individual' ? 'Nome de Usuário (Login)' : 'Nome de Usuário da Criança'}
            </label>
            <div className="relative">
              <span className="text-stone-400 font-bold absolute left-3.5 top-2.5 text-sm">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="mariana.manaus"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 text-sm focus:border-emerald-400 focus:outline-none font-mono"
                required
              />
            </div>
          </div>

          {/* Senha e Confirmação */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1">
                Senha
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 dígitos"
                  className="w-full pl-10 pr-9 py-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 text-sm focus:border-emerald-400 focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-stone-400 hover:text-stone-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1">
                Confirmar Senha
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita sua senha"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 text-sm focus:border-emerald-400 focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Tipo de Daltonismo - Com Nome, Ícone, Símbolo e Descrição */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-emerald-300">
                Tipo de Daltonismo ou Visão
              </label>
              <span className="text-[11px] text-stone-400">Nunca depende só de cor</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5 max-h-56 overflow-y-auto pr-1">
              {daltonismOptions.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => {
                    playActionSound();
                    setColorType(opt.id);
                  }}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition flex items-start gap-3 ${
                    colorType === opt.id
                      ? 'bg-emerald-950/60 border-emerald-400 text-white shadow-md'
                      : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:border-stone-600'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-stone-800 flex items-center justify-center font-bold text-lg shrink-0 border border-stone-700">
                    {opt.symbol}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs uppercase tracking-wide text-white">
                        {opt.name}
                      </span>
                      {colorType === opt.id && (
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-stone-300 mt-0.5 leading-snug">
                      {opt.description}
                    </p>
                    <p className="text-[10px] text-emerald-400/90 font-mono mt-1">
                      {opt.colorImpact}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botão de Cadastro */}
          <button
            type="submit"
            className="w-full mt-4 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-extrabold uppercase text-xs tracking-wider rounded-xl shadow-lg border-2 border-emerald-300 transition active:scale-95 cursor-pointer"
          >
            {accountType === 'individual' ? 'CRIAR CONTA INDIVIDUAL E ENTRAR (+150 PTS)' : 'CONCLUIR CADASTRO FAMILIAR (+150 PTS)'}
          </button>
        </form>
      </div>
    </div>
  );
};
