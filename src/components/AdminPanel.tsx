import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  MapPin, 
  Quote, 
  Image as ImageIcon, 
  BarChart3, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Power, 
  Layers, 
  FileText, 
  AlertTriangle,
  Lock,
  Unlock,
  Sparkles,
  TrendingUp,
  Award,
  Calendar
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PEVLocation, MotivationalQuote, DailyWallpaper, WasteCategory } from '../types';
import { WASTE_CATEGORIES_INFO } from '../data/mockData';
import { PatternBadge, ColorAddSymbol } from '../utils/patterns';
import { dailyThemeService } from '../services/dailyThemeService';

type AdminTab = 'dashboard' | 'users' | 'pevs' | 'quotes' | 'wallpapers' | 'reports';

export const AdminPanel: React.FC = () => {
  const { 
    setScreen, 
    userList, 
    toggleUserBlocked, 
    deleteUser,
    pevs, 
    addPev, 
    deletePev,
    allQuotes, 
    addQuote, 
    toggleQuoteActive, 
    deleteQuote,
    allWallpapers, 
    addWallpaper, 
    toggleWallpaperActive, 
    deleteWallpaper,
    history,
    playActionSound 
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // Form states for adding items
  const [showAddPevModal, setShowAddPevModal] = useState(false);
  const [newPevName, setNewPevName] = useState('');
  const [newPevNeighborhood, setNewPevNeighborhood] = useState('');
  const [newPevAddress, setNewPevAddress] = useState('');
  const [newPevHours, setNewPevHours] = useState('Seg a Sex 08:00 às 17:00');
  const [newPevCategories, setNewPevCategories] = useState<WasteCategory[]>(['plastic', 'paper']);

  const [showAddQuoteModal, setShowAddQuoteModal] = useState(false);
  const [newQuoteText, setNewQuoteText] = useState('');
  const [newQuoteAuthor, setNewQuoteAuthor] = useState('EcoAcess Manaus');
  const [newQuoteTheme, setNewQuoteTheme] = useState<'inclusao' | 'sustentabilidade' | 'autonomia' | 'manaus'>('manaus');

  const [showAddWpModal, setShowAddWpModal] = useState(false);
  const [newWpTitle, setNewWpTitle] = useState('');
  const [newWpDesc, setNewWpDesc] = useState('');
  const [newWpUrl, setNewWpUrl] = useState('');
  const [newWpTag, setNewWpTag] = useState('Manaus & Sustentabilidade');

  // Calculate waste category metrics
  const categoryCounts: Record<WasteCategory, number> = {
    plastic: history.filter(h => h.category === 'plastic').length + 14,
    paper: history.filter(h => h.category === 'paper').length + 9,
    metal: history.filter(h => h.category === 'metal').length + 8,
    glass: history.filter(h => h.category === 'glass').length + 5,
    electronic: history.filter(h => h.category === 'electronic').length + 4,
    organic: history.filter(h => h.category === 'organic').length + 3,
    hazardous: history.filter(h => h.category === 'hazardous').length + 2,
  };
  const totalIdentified = Object.values(categoryCounts).reduce((a, b) => a + b, 0);

  const handleAddPevSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPevName || !newPevAddress) return;

    addPev({
      name: newPevName,
      neighborhood: newPevNeighborhood || 'Manaus Centro',
      address: newPevAddress,
      reference: 'Ponto municipal cadastrado via painel administrativo',
      coordinates: { lat: -3.10, lng: -60.02, x: 450, y: 550 },
      acceptedCategories: newPevCategories,
      openingHours: newPevHours,
      managedBy: 'SEMULSP Manaus',
    });

    setShowAddPevModal(false);
    setNewPevName('');
    setNewPevAddress('');
  };

  const handleAddQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuoteText) return;

    addQuote({
      text: newQuoteText,
      authorOrContext: newQuoteAuthor,
      theme: newQuoteTheme,
      active: true,
    });

    setShowAddQuoteModal(false);
    setNewQuoteText('');
  };

  const handleAddWpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWpTitle || !newWpUrl) return;

    addWallpaper({
      title: newWpTitle,
      description: newWpDesc || 'Imagem da natureza e inclusão em Manaus',
      imageUrl: newWpUrl,
      themeTag: newWpTag,
      photographerOrSource: 'SEMULSP / EcoAcess',
      active: true,
    });

    setShowAddWpModal(false);
    setNewWpTitle('');
    setNewWpUrl('');
  };

  return (
    <div className="w-full pb-24 pt-3 px-4 max-w-4xl mx-auto text-white">
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-800">
        <button
          onClick={() => {
            playActionSound();
            setScreen('home');
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-stone-300 hover:text-white uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao App</span>
        </button>

        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-400" />
          <h1 className="text-base font-extrabold uppercase tracking-wider text-amber-300">
            Painel Administrativo EcoAcess
          </h1>
        </div>

        <span className="text-[10px] font-mono font-bold bg-amber-950 text-amber-200 border border-amber-600/40 px-2 py-0.5 rounded">
          ADMIN v1.0
        </span>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-5 no-scrollbar">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'users', label: 'Usuários', icon: Users, badge: userList.length },
          { id: 'pevs', label: 'Pontos de Coleta', icon: MapPin, badge: pevs.length },
          { id: 'quotes', label: 'Frases Diárias', icon: Quote, badge: allQuotes.length },
          { id: 'wallpapers', label: 'Papéis de Parede', icon: ImageIcon, badge: allWallpapers.length },
          { id: 'reports', label: 'Relatórios Acessíveis', icon: TrendingUp },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                playActionSound();
                setActiveTab(t.id as AdminTab);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition ${
                isActive
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
              {t.badge !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-black/20 text-stone-950' : 'bg-stone-800 text-stone-400'}`}>
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-5 animate-fade-in">
          
          {/* Key Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-stone-900 border border-stone-800 rounded-2xl">
              <span className="text-[10px] font-mono uppercase text-stone-400 font-bold block">
                Usuários Cadastrados
              </span>
              <span className="text-2xl font-black text-white mt-1 block">
                {userList.length}
              </span>
              <span className="text-[11px] text-emerald-400 mt-1 block font-medium">
                +100% ativos
              </span>
            </div>

            <div className="p-4 bg-stone-900 border border-stone-800 rounded-2xl">
              <span className="text-[10px] font-mono uppercase text-stone-400 font-bold block">
                Resíduos Identificados
              </span>
              <span className="text-2xl font-black text-white mt-1 block">
                {totalIdentified}
              </span>
              <span className="text-[11px] text-blue-400 mt-1 block font-medium">
                IA & Câmera
              </span>
            </div>

            <div className="p-4 bg-stone-900 border border-stone-800 rounded-2xl">
              <span className="text-[10px] font-mono uppercase text-stone-400 font-bold block">
                PEVs e Ecopontos
              </span>
              <span className="text-2xl font-black text-white mt-1 block">
                {pevs.length}
              </span>
              <span className="text-[11px] text-amber-400 mt-1 block font-medium">
                Em Manaus (SEMULSP)
              </span>
            </div>

            <div className="p-4 bg-stone-900 border border-stone-800 rounded-2xl">
              <span className="text-[10px] font-mono uppercase text-stone-400 font-bold block">
                Utilizações do Sistema
              </span>
              <span className="text-2xl font-black text-white mt-1 block">
                382
              </span>
              <span className="text-[11px] text-purple-400 mt-1 block font-medium">
                Rotas calculadas
              </span>
            </div>
          </div>

          {/* Accessible Waste Distribution Chart (With non-color patterns & ColorADD symbols) */}
          <div className="p-5 bg-stone-900 border-2 border-stone-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
                  Distribuição por Categoria de Resíduo (Gráfico Acessível)
                </h3>
                <p className="text-xs text-stone-400">
                  Totalmente legível para pessoas com daltonismo: utiliza hachuras, símbolos e rótulos diretos.
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                Total: {totalIdentified} itens
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {(Object.keys(categoryCounts) as WasteCategory[]).map((cat) => {
                const count = categoryCounts[cat];
                const percentage = Math.round((count / totalIdentified) * 100);
                const catInfo = WASTE_CATEGORIES_INFO[cat];

                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-stone-200">
                      <div className="flex items-center gap-2">
                        <ColorAddSymbol category={cat} size={16} />
                        <span className="uppercase">{catInfo.name}</span>
                        <span className="text-[10px] text-stone-400 font-mono font-normal">
                          ({catInfo.patternDescription})
                        </span>
                      </div>
                      <span className="font-mono text-stone-300">
                        {count} ({percentage}%)
                      </span>
                    </div>

                    {/* Accessible Progress Bar with SVG Pattern */}
                    <div className="w-full h-4 bg-stone-950 rounded-lg overflow-hidden border border-stone-800 relative">
                      <div
                        className="h-full rounded-lg transition-all duration-700 relative overflow-hidden"
                        style={{ width: `${percentage}%`, backgroundColor: catInfo.baseColor }}
                      >
                        {/* Overlay SVG pattern to ensure non-color distinction */}
                        <svg className="absolute inset-0 w-full h-full text-white/50">
                          <rect width="100%" height="100%" fill={`url(#${catInfo.patternId})`} />
                        </svg>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: GERENCIAR USUÁRIOS */}
      {activeTab === 'users' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
              Gerenciar Usuários ({userList.length})
            </h3>
            <span className="text-xs text-stone-400">Permite bloquear, desbloquear e excluir</span>
          </div>

          <div className="space-y-2.5">
            {userList.map((user) => (
              <div 
                key={user.id}
                className="p-3.5 bg-stone-900 border border-stone-800 rounded-xl flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center font-bold text-stone-300">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{user.name}</span>
                      {user.role === 'admin' && (
                        <span className="text-[9px] bg-amber-900 text-amber-200 px-1.5 py-0.2 rounded font-mono font-bold">
                          ADMIN
                        </span>
                      )}
                      {user.isBlocked && (
                        <span className="text-[9px] bg-red-900 text-red-200 px-1.5 py-0.2 rounded font-mono font-bold">
                          BLOQUEADO
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-400">
                      @{user.username} · {user.email}
                    </p>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      Daltonismo: {user.colorBlindnessType} · {user.ecoPoints} EcoPontos
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {user.role !== 'admin' && (
                    <>
                      <button
                        onClick={() => toggleUserBlocked(user.id)}
                        className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1 transition ${
                          user.isBlocked
                            ? 'bg-emerald-950/80 text-emerald-200 border-emerald-600'
                            : 'bg-stone-800 text-stone-300 border-stone-700 hover:text-white'
                        }`}
                        title={user.isBlocked ? 'Desbloquear usuário' : 'Bloquear usuário'}
                      >
                        {user.isBlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => deleteUser(user.id)}
                        className="p-2 bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800/60 rounded-lg transition"
                        title="Excluir usuário"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: GERENCIAR PEVs / PONTOS DE DESCARTE */}
      {activeTab === 'pevs' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
              Pontos de Coleta e PEVs em Manaus ({pevs.length})
            </h3>
            <button
              onClick={() => setShowAddPevModal(true)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase rounded-xl flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar PEV</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {pevs.map((pev) => (
              <div 
                key={pev.id}
                className="p-3.5 bg-stone-900 border border-stone-800 rounded-xl flex items-start justify-between gap-3"
              >
                <div>
                  <h4 className="font-bold text-sm text-white">{pev.name}</h4>
                  <p className="text-xs text-stone-300">{pev.address}</p>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Horário: {pev.openingHours} · Gestor: {pev.managedBy}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {pev.acceptedCategories.map((c) => (
                      <ColorAddSymbol key={c} category={c} size={14} />
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => deletePev(pev.id)}
                  className="p-2 bg-stone-800 hover:bg-red-900 hover:text-white text-stone-400 rounded-lg border border-stone-700 transition"
                  title="Excluir ponto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: GERENCIAR FRASES MOTIVACIONAIS */}
      {activeTab === 'quotes' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
              Frases Motivacionais Diárias ({allQuotes.length})
            </h3>
            <button
              onClick={() => setShowAddQuoteModal(true)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase rounded-xl flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Frase</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {allQuotes.map((q) => (
              <div
                key={q.id}
                className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 transition ${
                  q.active ? 'bg-stone-900 border-stone-800 text-white' : 'bg-stone-950 border-stone-900 text-stone-500'
                }`}
              >
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-medium italic leading-snug">
                    "{q.text}"
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 text-[11px] text-stone-400 font-mono">
                    <span>— {q.authorOrContext}</span>
                    <span>· Tema: {q.theme}</span>
                    <span className={q.active ? 'text-emerald-400' : 'text-stone-500'}>
                      · {q.active ? 'Ativa' : 'Inativa'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleQuoteActive(q.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                      q.active
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/50'
                        : 'bg-stone-800 text-stone-400'
                    }`}
                  >
                    {q.active ? 'Desativar' : 'Ativar'}
                  </button>

                  <button
                    onClick={() => deleteQuote(q.id)}
                    className="p-1.5 bg-stone-800 hover:bg-red-900 text-stone-400 hover:text-white rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: GERENCIAR IMAGENS DA TELA DE LOGIN & CRONOGRAMA */}
      {activeTab === 'wallpapers' && (
        <div className="space-y-4 animate-fade-in">
          
          {/* Upcoming 7-day Schedule Forecast from dailyThemeService */}
          <div className="p-4 bg-stone-900 border-2 border-emerald-500/50 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Cronograma Automático do Serviço Diário (Próximos 7 Dias)
                </h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700/50">
                Data Ativa
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {dailyThemeService.getUpcomingWeekThemes(allWallpapers, allQuotes).map((theme, i) => (
                <div key={i} className="p-2.5 bg-stone-950 rounded-xl border border-stone-800 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-stone-400">
                    <span className="font-bold text-white">{theme.dayOfWeekName}</span>
                    <span>{theme.date.getDate()}/{theme.date.getMonth() + 1}</span>
                  </div>
                  <div className="aspect-video rounded-lg overflow-hidden relative border border-stone-800">
                    <img src={theme.wallpaper.imageUrl} alt={theme.wallpaper.title} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 text-[8px] bg-black/80 px-1 rounded text-emerald-300 font-mono">
                      {theme.themeTag}
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-300 line-clamp-1 italic">
                    "{theme.quote.text}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
              Papéis de Parede Diários ({allWallpapers.length})
            </h3>
            <button
              onClick={() => setShowAddWpModal(true)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase rounded-xl flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Imagem</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {allWallpapers.map((wp) => (
              <div 
                key={wp.id}
                className="p-3 bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden space-y-2.5"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden border border-stone-700">
                  <img src={wp.imageUrl} alt={wp.title} className="w-full h-full object-cover" />
                  <span className="absolute bottom-2 left-2 text-[10px] font-mono font-bold bg-black/80 px-2 py-0.5 rounded text-white border border-white/20">
                    {wp.themeTag}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-xs text-white">{wp.title}</h4>
                  <p className="text-[11px] text-stone-400 line-clamp-1">{wp.description}</p>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-stone-800">
                  <button
                    onClick={() => toggleWallpaperActive(wp.id)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${
                      wp.active ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/50' : 'bg-stone-800 text-stone-400'
                    }`}
                  >
                    {wp.active ? 'Exibindo Diariamente' : 'Desativado'}
                  </button>

                  <button
                    onClick={() => deleteWallpaper(wp.id)}
                    className="p-1 text-stone-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: RELATÓRIOS ACESSÍVEIS */}
      {activeTab === 'reports' && (
        <div className="p-5 bg-stone-900 border border-stone-800 rounded-2xl space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
              Relatório de Impacto Ambiental e Acessibilidade · Manaus
            </h3>
            <span className="text-xs font-mono text-emerald-400">Ano 2026</span>
          </div>

          <p className="text-xs text-stone-300 leading-relaxed">
            Indicadores gerados para subsidiar as diretrizes de sustentabilidade da Prefeitura de Manaus e validar a inclusão de cidadãos com daltonismo no descarte correto.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-1">
              <span className="text-[10px] font-mono text-stone-400 uppercase font-bold">
                Estatísticas de Acessibilidade
              </span>
              <p className="text-xs text-stone-200">
                • 52% dos usuários cadastrados possuem Deuteranopia (verde).<br/>
                • 28% possuem Protanopia (vermelho).<br/>
                • 12% possuem Tritanopia (azul/amarelo).<br/>
                • 8% utilizam o modo sem cores / Acromatopsia.
              </p>
            </div>

            <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-1">
              <span className="text-[10px] font-mono text-stone-400 uppercase font-bold">
                PEVs Mais Utilizados em Manaus
              </span>
              <p className="text-xs text-stone-200">
                1. PEV Parque dos Bilhares (São Geraldo) — 38%<br/>
                2. PEV Sumaúma (Cidade Nova) — 27%<br/>
                3. Ecoponto Redenção (Alvorada) — 21%<br/>
                4. Central Tarumã (E-Waste) — 14%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Adicionar PEV */}
      {showAddPevModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-stone-900 border border-stone-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-white">Adicionar Novo Ponto de Descarte (PEV)</h3>
            
            <form onSubmit={handleAddPevSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-300 uppercase font-bold mb-1">Nome do PEV</label>
                <input
                  type="text"
                  value={newPevName}
                  onChange={e => setNewPevName(e.target.value)}
                  placeholder="Ex: PEV Parque Cidade da Criança"
                  className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-xl text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-300 uppercase font-bold mb-1">Bairro / Região</label>
                <input
                  type="text"
                  value={newPevNeighborhood}
                  onChange={e => setNewPevNeighborhood(e.target.value)}
                  placeholder="Ex: Aleixo"
                  className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-xl text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-300 uppercase font-bold mb-1">Endereço Completo</label>
                <input
                  type="text"
                  value={newPevAddress}
                  onChange={e => setNewPevAddress(e.target.value)}
                  placeholder="Rua, número, Manaus - AM"
                  className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-xl text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-300 uppercase font-bold mb-1">Horário de Funcionamento</label>
                <input
                  type="text"
                  value={newPevHours}
                  onChange={e => setNewPevHours(e.target.value)}
                  className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-xl text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPevModal(false)}
                  className="flex-1 py-2.5 bg-stone-800 text-stone-300 font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-500 text-stone-950 font-black rounded-xl"
                >
                  Salvar PEV
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Adicionar Frase */}
      {showAddQuoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-stone-900 border border-stone-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-white">Cadastrar Nova Frase Diária</h3>
            
            <form onSubmit={handleAddQuoteSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-300 uppercase font-bold mb-1">Texto da Frase</label>
                <textarea
                  rows={3}
                  value={newQuoteText}
                  onChange={e => setNewQuoteText(e.target.value)}
                  placeholder="Digite a frase inspiradora sobre sustentabilidade ou inclusão..."
                  className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-xl text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-300 uppercase font-bold mb-1">Autor ou Contexto</label>
                <input
                  type="text"
                  value={newQuoteAuthor}
                  onChange={e => setNewQuoteAuthor(e.target.value)}
                  className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-xl text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddQuoteModal(false)}
                  className="flex-1 py-2.5 bg-stone-800 text-stone-300 font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-500 text-stone-950 font-black rounded-xl"
                >
                  Salvar Frase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Adicionar Wallpaper */}
      {showAddWpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-stone-900 border border-stone-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-white">Adicionar Papel de Parede Diário</h3>
            
            <form onSubmit={handleAddWpSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-300 uppercase font-bold mb-1">Título da Imagem</label>
                <input
                  type="text"
                  value={newWpTitle}
                  onChange={e => setNewWpTitle(e.target.value)}
                  placeholder="Ex: Rio Negro Preservado"
                  className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-xl text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-300 uppercase font-bold mb-1">URL da Imagem</label>
                <input
                  type="url"
                  value={newWpUrl}
                  onChange={e => setNewWpUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-xl text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-300 uppercase font-bold mb-1">Tema / Tag</label>
                <input
                  type="text"
                  value={newWpTag}
                  onChange={e => setNewWpTag(e.target.value)}
                  className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-xl text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddWpModal(false)}
                  className="flex-1 py-2.5 bg-stone-800 text-stone-300 font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-500 text-stone-950 font-black rounded-xl"
                >
                  Salvar Imagem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
