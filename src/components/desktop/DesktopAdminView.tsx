import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  MapPin, 
  Quote, 
  Image as ImageIcon, 
  BarChart3, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Layers, 
  FileText, 
  Lock, 
  Unlock, 
  TrendingUp, 
  Calendar,
  Search,
  Filter,
  Volume2,
  Clock,
  Sparkles,
  Download,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PEVLocation, MotivationalQuote, DailyWallpaper, WasteCategory } from '../../types';
import { WASTE_CATEGORIES_INFO } from '../../data/mockData';
import { PatternBadge, ColorAddSymbol } from '../../utils/patterns';
import { speakText } from '../../utils/audio';

type DesktopAdminTab = 'metrics' | 'children' | 'pevs' | 'themes' | 'reports';

export const DesktopAdminView: React.FC = () => {
  const { 
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

  const [activeTab, setActiveTab] = useState<DesktopAdminTab>('metrics');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals for adding PEVs and Themes
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

  // Waste metrics calculation
  const categoryCounts: Record<WasteCategory, number> = {
    plastic: history.filter(h => h.category === 'plastic').length + 28,
    paper: history.filter(h => h.category === 'paper').length + 19,
    metal: history.filter(h => h.category === 'metal').length + 14,
    glass: history.filter(h => h.category === 'glass').length + 11,
    organic: history.filter(h => h.category === 'organic').length + 22,
    electronic: history.filter(h => h.category === 'electronic').length + 6,
    hazardous: history.filter(h => h.category === 'hazardous').length + 2,
  };

  const totalDisposals = Object.values(categoryCounts).reduce((a, b) => a + b, 0);
  const totalWeightKg = (totalDisposals * 0.45).toFixed(1);

  const handleSavePev = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPevName.trim() || !newPevNeighborhood.trim()) return;

    addPev({
      name: newPevName,
      neighborhood: newPevNeighborhood,
      address: newPevAddress || 'Manaus, AM',
      reference: 'Ponto Adicionado pelo Painel',
      coordinates: { lat: -3.1190, lng: -60.0217, x: 500, y: 500 },
      acceptedCategories: newPevCategories,
      openingHours: newPevHours,
      managedBy: 'SEMULSP Manaus',
    });

    setNewPevName('');
    setNewPevNeighborhood('');
    setNewPevAddress('');
    setShowAddPevModal(false);
  };

  const handleSaveQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuoteText.trim()) return;

    addQuote({
      text: newQuoteText,
      authorOrContext: newQuoteAuthor,
      theme: newQuoteTheme,
      active: true,
    });

    setNewQuoteText('');
    setShowAddQuoteModal(false);
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 text-white">
      
      {/* 1. Management Header & Top KPI Cards */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight">
                Painel de Gestão do Responsável & Educador
              </h1>
            </div>
            <p className="text-xs lg:text-sm text-stone-400 mt-1">
              Supervisão centralizada de desempenho, inclusão sensorial e pontos de coleta em Manaus.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                playActionSound();
                speakText(`Resumo de gestão: ${totalDisposals} descartes registrados, ${totalWeightKg} quilos de resíduos reciclados, ${userList.length} usuários cadastrados.`);
              }}
              className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-emerald-400 border border-stone-700 transition"
              title="Ouvir resumo executivo em voz alta"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 shadow-sm">
            <div className="text-[11px] font-mono uppercase text-stone-400 font-bold">Total de Descartes</div>
            <div className="text-2xl lg:text-3xl font-black text-white font-mono tabular-nums mt-1">
              {totalDisposals}
            </div>
            <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
              <TrendingUp className="w-3 h-3" />
              +18% nesta semana
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 shadow-sm">
            <div className="text-[11px] font-mono uppercase text-stone-400 font-bold">Crianças & Usuários</div>
            <div className="text-2xl lg:text-3xl font-black text-emerald-400 font-mono tabular-nums mt-1">
              {userList.length}
            </div>
            <div className="text-[11px] text-stone-400 mt-1">
              100% com perfis acessíveis
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 shadow-sm">
            <div className="text-[11px] font-mono uppercase text-stone-400 font-bold">Ecopontos Manaus</div>
            <div className="text-2xl lg:text-3xl font-black text-sky-400 font-mono tabular-nums mt-1">
              {pevs.length}
            </div>
            <div className="text-[11px] text-stone-400 mt-1">
              Zonas Centro, Oeste, Norte, Leste
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 shadow-sm">
            <div className="text-[11px] font-mono uppercase text-stone-400 font-bold">Resíduo Evitado</div>
            <div className="text-2xl lg:text-3xl font-black text-amber-400 font-mono tabular-nums mt-1">
              {totalWeightKg} kg
            </div>
            <div className="text-[11px] text-stone-400 mt-1">
              Preservação dos igarapés
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sub-Navigation Tabs */}
      <div className="border-b border-stone-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'metrics', label: 'Métricas & Materiais', icon: BarChart3 },
          { id: 'children', label: 'Cidadãos, Alunos & Famílias', icon: Users },
          { id: 'pevs', label: 'Ecopontos & PEVs Manaus', icon: MapPin },
          { id: 'themes', label: 'Frases & Murais de Manaus', icon: Quote },
          { id: 'reports', label: 'Relatórios & IA Adaptativa', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                playActionSound();
                setActiveTab(tab.id as DesktopAdminTab);
              }}
              className={`pb-3 px-4 text-xs font-bold transition flex items-center gap-2 border-b-2 whitespace-nowrap ${
                isActive
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Tab Contents */}

      {/* TAB 1: Metrics & Materials Breakdown */}
      {activeTab === 'metrics' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-stone-900 border border-stone-800 rounded-2xl p-6">
            <h2 className="text-base font-extrabold text-white uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              <span>Volume de Descartes por Categoria de Resíduo</span>
            </h2>

            <div className="space-y-4">
              {(Object.keys(categoryCounts) as WasteCategory[]).map((cat) => {
                const info = WASTE_CATEGORIES_INFO[cat];
                const count = categoryCounts[cat];
                const percentage = Math.round((count / totalDisposals) * 100);

                return (
                  <div key={cat} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 font-semibold">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: info.baseColor }} 
                        />
                        <span className="text-white">{info.name}</span>
                        <span className="text-[10px] text-stone-400 font-mono">({info.colorAddSymbol})</span>
                      </div>
                      <div className="font-mono text-stone-300 tabular-nums">
                        <span className="font-bold text-white">{count} itens</span>
                        <span className="text-stone-500 ml-2">({percentage}%)</span>
                      </div>
                    </div>

                    <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: info.baseColor
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
              <h2 className="text-base font-extrabold text-white uppercase tracking-wider font-mono mb-3">
                Eficiência da Separação em Manaus
              </h2>
              <p className="text-xs text-stone-300 leading-relaxed mb-4">
                O índice de contaminação cruzada caiu 34% entre os alunos que usam os símbolos ColorAdd combinados com áudio no aplicativo.
              </p>

              <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-stone-300">Tempo Médio de Resposta:</span>
                  <span className="font-mono text-emerald-400 font-bold tabular-nums">4.2 segundos</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-stone-300">Taxa de Conclusão de Missões:</span>
                  <span className="font-mono text-emerald-400 font-bold tabular-nums">89.4%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-stone-300">Uso do Leitor em Voz Alta:</span>
                  <span className="font-mono text-amber-400 font-bold tabular-nums">68% dos usuários</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Children & Users Management */}
      {activeTab === 'children' && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-extrabold text-white uppercase tracking-wider font-mono">
                Cadastro de Cidadãos, Famílias e Alunos
              </h2>
              <p className="text-xs text-stone-400">
                Gerencie perfis individuais (adultos, coletores, estudantes) e contas familiares com acompanhamento.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome ou usuário..."
                className="w-full pl-9 pr-3 py-1.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-stone-800 text-stone-400 font-mono uppercase text-[11px]">
                  <th className="py-3 px-4">Usuário / Cidadão</th>
                  <th className="py-3 px-4">Tipo de Conta</th>
                  <th className="py-3 px-4">Daltonismo / Acessibilidade</th>
                  <th className="py-3 px-4">Pontuação</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 font-medium">
                {userList
                  .filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.username.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((user) => (
                    <tr key={user.id} className="hover:bg-stone-800/40 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">
                            {user.accountType === 'family' ? '👶' : user.role === 'admin' ? '🛡️' : '👤'}
                          </span>
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{user.name}</span>
                            </div>
                            <div className="text-[10px] text-stone-400 font-mono">
                              @{user.username} {user.guardianName ? `· Resp: ${user.guardianName}` : ''}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                          user.role === 'admin' 
                            ? 'bg-amber-500/20 text-amber-300' 
                            : user.accountType === 'family'
                            ? 'bg-sky-500/20 text-sky-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          {user.role === 'admin' 
                            ? 'SEMULSP / Gestão' 
                            : user.accountType === 'family'
                            ? 'Familiar (Criança)'
                            : 'Conta Individual'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="capitalize text-stone-300">
                          {user.colorBlindnessType || 'Visão Típica'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400 tabular-nums">
                        {user.ecoPoints} pts
                      </td>
                      <td className="py-3 px-4">
                        {user.isBlocked ? (
                          <span className="text-red-400 font-bold flex items-center gap-1">
                            <Lock className="w-3.5 h-3.5" /> Bloqueado
                          </span>
                        ) : (
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Ativo
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              playActionSound();
                              toggleUserBlocked(user.id);
                            }}
                            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition"
                            title={user.isBlocked ? 'Desbloquear usuário' : 'Bloquear usuário'}
                          >
                            {user.isBlocked ? <Unlock className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-amber-400" />}
                          </button>

                          {user.username !== 'admin' && (
                            <button
                              onClick={() => {
                                playActionSound();
                                deleteUser(user.id);
                              }}
                              className="p-1.5 rounded-lg bg-stone-800 hover:bg-red-950 text-stone-400 hover:text-red-400 transition"
                              title="Excluir cadastro"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Manaus PEVs & Ecopoints */}
      {activeTab === 'pevs' && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-white uppercase tracking-wider font-mono">
                Pontos de Coleta Seletiva em Manaus ({pevs.length})
              </h2>
              <p className="text-xs text-stone-400">
                Gerencie os Ecopontos e PEVs disponíveis no mapa inteligente de Manaus.
              </p>
            </div>

            <button
              onClick={() => setShowAddPevModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Ecoponto</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pevs.map((pev) => (
              <div 
                key={pev.id}
                className="p-4 rounded-xl bg-stone-950 border border-stone-800 hover:border-stone-700 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-white leading-tight">
                      {pev.name}
                    </h3>
                    <button
                      onClick={() => {
                        playActionSound();
                        deletePev(pev.id);
                      }}
                      className="text-stone-500 hover:text-red-400 p-1"
                      title="Excluir PEV"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-xs text-emerald-400 font-mono mt-1">
                    Bairro: {pev.neighborhood}
                  </div>
                  <div className="text-[11px] text-stone-400 mt-0.5">
                    {pev.address}
                  </div>
                  <div className="text-[10px] text-stone-500 font-mono mt-2">
                    Horário: {pev.openingHours}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-stone-800/80 flex items-center gap-1 flex-wrap">
                  {pev.acceptedCategories.map((cat) => (
                    <span 
                      key={cat}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-300"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Daily Wallpapers and Quotes */}
      {activeTab === 'themes' && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-white uppercase tracking-wider font-mono">
                Frases Motivacionais & Murais de Manaus
              </h2>
              <p className="text-xs text-stone-400">
                Personalize as mensagens diárias e imagens da Amazônia exibidas na tela inicial.
              </p>
            </div>

            <button
              onClick={() => setShowAddQuoteModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Frase</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allQuotes.map((q) => (
              <div 
                key={q.id}
                className="p-4 rounded-xl bg-stone-950 border border-stone-800 flex flex-col justify-between text-xs"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-emerald-400 font-mono uppercase mb-1">
                    <span>Tema: {q.theme}</span>
                    <button
                      onClick={() => toggleQuoteActive(q.id)}
                      className={`px-1.5 py-0.5 rounded ${q.active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-stone-800 text-stone-400'}`}
                    >
                      {q.active ? 'Ativa' : 'Pausada'}
                    </button>
                  </div>
                  <p className="text-stone-200 italic leading-relaxed">
                    "{q.text}"
                  </p>
                  <div className="text-[11px] text-stone-400 mt-1 font-semibold">
                    — {q.authorOrContext}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-stone-800 flex justify-end">
                  <button
                    onClick={() => deleteQuote(q.id)}
                    className="text-stone-500 hover:text-red-400 text-[11px] flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Reports & Adaptive AI Recommendations */}
      {activeTab === 'reports' && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-6">
          <div>
            <h2 className="text-base font-extrabold text-white uppercase tracking-wider font-mono">
              Relatório Pedagógico & Síntese da IA Adaptativa
            </h2>
            <p className="text-xs text-stone-400">
              Análise comportamental do ritmo de aprendizagem e inclusão sensorial das crianças.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Diagnóstico Automático da Semana:</span>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              "Os alunos apresentaram <strong>96% de assertividade</strong> na separação de plásticos e metais, identificando garrafas PET e latinhas com facilidade. Foi detectada uma ligeira hesitação em embalagens tetra pak e resíduos orgânicos úmidos. Recomendamos ativar o reforço visual dos símbolos ColorAdd com narração de áudio nos próximos desafios."
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 text-xs">
                <div className="text-stone-400 font-mono text-[10px] uppercase">Tempo de Tela Médio</div>
                <div className="text-lg font-bold text-white font-mono mt-0.5">14 minutos/dia</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">Dentro do limite saudável</div>
              </div>

              <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 text-xs">
                <div className="text-stone-400 font-mono text-[10px] uppercase">Desafios Concluídos</div>
                <div className="text-lg font-bold text-white font-mono mt-0.5">24 missões</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">Média de 3 por criança</div>
              </div>

              <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 text-xs">
                <div className="text-stone-400 font-mono text-[10px] uppercase">Economia nos Igarapés</div>
                <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">~120 garrafas</div>
                <div className="text-[10px] text-stone-400 mt-0.5">Evitadas no Tarumã e Mindu</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add PEV */}
      {showAddPevModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-stone-900 border border-stone-800 rounded-2xl p-6 text-white space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Cadastrar Novo Ecoponto em Manaus</h3>
              <button onClick={() => setShowAddPevModal(false)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePev} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-300 font-semibold mb-1">Nome do Ponto</label>
                <input
                  type="text"
                  value={newPevName}
                  onChange={(e) => setNewPevName(e.target.value)}
                  placeholder="Ex: Ecoponto Tarumã - Ponta Negra"
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Bairro em Manaus</label>
                <input
                  type="text"
                  value={newPevNeighborhood}
                  onChange={(e) => setNewPevNeighborhood(e.target.value)}
                  placeholder="Ex: Tarumã, Adrianópolis, Flores"
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Endereço / Referência</label>
                <input
                  type="text"
                  value={newPevAddress}
                  onChange={(e) => setNewPevAddress(e.target.value)}
                  placeholder="Ex: Av. Coronel Teixeira, próx. à praia"
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPevModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold"
                >
                  Salvar Ecoponto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Quote */}
      {showAddQuoteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-stone-900 border border-stone-800 rounded-2xl p-6 text-white space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Adicionar Frase Motivacional</h3>
              <button onClick={() => setShowAddQuoteModal(false)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuote} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-300 font-semibold mb-1">Texto da Frase</label>
                <textarea
                  value={newQuoteText}
                  onChange={(e) => setNewQuoteText(e.target.value)}
                  placeholder="Ex: Cuidar dos rios de Manaus é proteger a vida de todas as gerações."
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 h-24"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Autor / Contexto</label>
                <input
                  type="text"
                  value={newQuoteAuthor}
                  onChange={(e) => setNewQuoteAuthor(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddQuoteModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold"
                >
                  Salvar Frase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
