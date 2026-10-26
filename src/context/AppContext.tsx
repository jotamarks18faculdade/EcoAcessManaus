import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  AccessibilitySettings, 
  UserProfile, 
  WasteIdentificationResult, 
  PEVLocation, 
  DailyWallpaper, 
  MotivationalQuote,
  PartnerReward,
  DayThemeData,
  AccountProfileType
} from '../types';
import { 
  DAILY_WALLPAPERS, 
  MOTIVATIONAL_QUOTES, 
  MANAUS_PEVS, 
  LOCAL_PARTNER_REWARDS 
} from '../data/mockData';
import { 
  AMAZONAS_MANAUS_WALLPAPERS, 
  DAILY_MOTIVATIONAL_QUOTES, 
  getDailyThemeData 
} from '../utils/dailyTheme';
import { dailyThemeService } from '../services/dailyThemeService';
import { sound, triggerVibration } from '../utils/audio';

export type ScreenType = 
  | 'login'
  | 'register'
  | 'home'
  | 'camera'
  | 'map'
  | 'history'
  | 'accessibility'
  | 'rewards'
  | 'admin';

interface AppContextType {
  currentUser: UserProfile | null;
  currentScreen: ScreenType;
  setScreen: (screen: ScreenType) => void;
  accessibility: AccessibilitySettings;
  updateAccessibility: (partial: Partial<AccessibilitySettings>) => void;
  
  // Data
  dailyWallpaper: DailyWallpaper;
  dailyQuote: MotivationalQuote;
  currentDayTheme: DayThemeData;
  simulateThemeDate: (date: Date | null) => void;
  resetThemeDate: () => void;
  allWallpapers: DailyWallpaper[];
  allQuotes: MotivationalQuote[];
  pevs: PEVLocation[];
  history: WasteIdentificationResult[];
  rewards: PartnerReward[];
  userList: UserProfile[];
  
  // Route Navigation Focus
  activeRoutePevId: string | null;
  setActiveRoutePevId: (id: string | null) => void;

  // Guided Tour (Coach Mark)
  isTourOpen: boolean;
  startTour: () => void;
  closeTour: () => void;
  hasSeenTour: boolean;

  // Actions
  login: (username: string, role?: 'user' | 'admin') => boolean;
  logout: () => void;
  registerUser: (
    name: string, 
    email: string, 
    username: string, 
    colorType: AccessibilitySettings['colorBlindnessType'],
    options?: {
      accountType?: AccountProfileType;
      guardianName?: string;
      guardianEmail?: string;
    }
  ) => void;
  addHistoryItem: (item: WasteIdentificationResult) => void;
  redeemReward: (rewardId: string) => boolean;

  // Admin Actions
  addPev: (pev: Omit<PEVLocation, 'id'>) => void;
  updatePev: (id: string, pev: Partial<PEVLocation>) => void;
  deletePev: (id: string) => void;
  addQuote: (quote: Omit<MotivationalQuote, 'id'>) => void;
  toggleQuoteActive: (id: string) => void;
  deleteQuote: (id: string) => void;
  addWallpaper: (wp: Omit<DailyWallpaper, 'id'>) => void;
  toggleWallpaperActive: (id: string) => void;
  deleteWallpaper: (id: string) => void;
  toggleUserBlocked: (id: string) => void;
  deleteUser: (id: string) => void;
  
  // Sound & Vibrate triggers
  playActionSound: () => void;
}

const defaultAccessibility: AccessibilitySettings = {
  colorBlindnessType: 'deuteranopia', // Default to common red-green to showcase features immediately
  simulateFilter: true, // Show simulation filter so user can see accessibility in action
  contrastMode: 'normal',
  fontSize: 'normal',
  soundEnabled: true,
  vibrationEnabled: true,
  speechEnabled: true,
  showColorAddSymbols: true,
  showTexturePatterns: true,
  showDescriptiveText: true,
};

const initialUsers: UserProfile[] = [
  {
    id: 'user-admin',
    name: 'Coordenador SEMULSP',
    username: 'admin',
    email: 'admin@semulsp.manaus.gov.br',
    colorBlindnessType: 'none',
    ecoPoints: 1250,
    level: 'Administrador do Sistema',
    role: 'admin',
    accountType: 'individual',
    createdAt: '2026-01-10',
    isBlocked: false,
  },
  {
    id: 'user-1',
    name: 'Thiago Barreto',
    username: 'thiago.am',
    email: 'thiago.manaus@gmail.com',
    colorBlindnessType: 'deuteranopia',
    ecoPoints: 420,
    level: 'Guardião dos Igarapés',
    role: 'user',
    accountType: 'family',
    guardianName: 'Carlos Barreto',
    guardianEmail: 'carlos.barreto@gmail.com',
    createdAt: '2026-03-01',
    isBlocked: false,
  },
  {
    id: 'user-2',
    name: 'Larissa Marinho (Educadora)',
    username: 'larissa.eco',
    email: 'larissa.recicla@outlook.com',
    colorBlindnessType: 'protanopia',
    ecoPoints: 280,
    level: 'Protetor da Floresta',
    role: 'user',
    accountType: 'individual',
    createdAt: '2026-03-15',
    isBlocked: false,
  },
  {
    id: 'user-3',
    name: 'Lucas Tananta (Universitário)',
    username: 'lucas.am',
    email: 'lucas.tananta@ufam.edu.br',
    colorBlindnessType: 'tritanopia',
    ecoPoints: 150,
    level: 'Iniciante Consciente',
    role: 'user',
    accountType: 'individual',
    createdAt: '2026-04-02',
    isBlocked: false,
  },
];

const initialHistory: WasteIdentificationResult[] = [
  {
    id: 'hist-1',
    name: 'Garrafa PET Guaraná Baré 2L',
    category: 'plastic',
    confidence: 0.96,
    imageUrl: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=600&q=80',
    timestamp: '2026-10-07T14:30:00Z',
    instructions: [
      'Retire o excesso de líquido enxaguando rapidamente.',
      'Amasse a garrafa no sentido vertical para compactar.',
      'Mantenha a tampinha plástica rosqueada.',
      'Descarte no PEV com padrão de listras diagonais.'
    ],
    cleanlinessNotice: 'Embalagem lavada e compactada.',
    decompositionTime: '400 a 450 anos no ecossistema.',
    environmentalImpact: 'Evitou 85g de resíduos no Igarapé do Mindu.',
    ecoPoints: 50,
    recommendedPevId: 'pev-bilhares',
  },
  {
    id: 'hist-2',
    name: 'Caixa de Papelão Embalagem Tech',
    category: 'paper',
    confidence: 0.94,
    imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80',
    timestamp: '2026-10-06T10:15:00Z',
    instructions: [
      'Desmonte a caixa e dobre até ficar plana.',
      'Mantenha protegida de umidade.',
      'Descarte no PEV com padrão de listras horizontais.'
    ],
    cleanlinessNotice: 'Papelão seco sem gordura.',
    decompositionTime: '3 a 6 meses.',
    environmentalImpact: 'Economizou 12 litros de água de celulose.',
    ecoPoints: 45,
    recommendedPevId: 'ecoponto-redencao',
  },
  {
    id: 'hist-3',
    name: 'Lata de Bebida em Alumínio 350ml',
    category: 'metal',
    confidence: 0.98,
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
    timestamp: '2026-10-05T18:40:00Z',
    instructions: [
      'Drene o líquido e aperte a lata para achatar.',
      'Mantenha o lacre anel preso.',
      'Descarte no coletor com padrão pontilhado denso.'
    ],
    cleanlinessNotice: 'Sem sobras de refrigerante.',
    decompositionTime: 'Mais de 100 anos na natureza.',
    environmentalImpact: 'Reciclagem com 95% de economia energética.',
    ecoPoints: 60,
    recommendedPevId: 'pev-sumauma',
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(initialUsers[1]); // Logged in as Thiago by default
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(() => {
    try {
      const saved = localStorage.getItem('ecoacess_accessibility');
      return saved ? JSON.parse(saved) : defaultAccessibility;
    } catch {
      return defaultAccessibility;
    }
  });

  const [allWallpapers, setAllWallpapers] = useState<DailyWallpaper[]>(AMAZONAS_MANAUS_WALLPAPERS);
  const [allQuotes, setAllQuotes] = useState<MotivationalQuote[]>(DAILY_MOTIVATIONAL_QUOTES);
  const [pevs, setPevs] = useState<PEVLocation[]>(MANAUS_PEVS);
  const [history, setHistory] = useState<WasteIdentificationResult[]>(initialHistory);
  const [rewards, setRewards] = useState<PartnerReward[]>(LOCAL_PARTNER_REWARDS);
  const [userList, setUserList] = useState<UserProfile[]>(initialUsers);
  const [activeRoutePevId, setActiveRoutePevId] = useState<string | null>(null);
  const [hasSeenTour, setHasSeenTour] = useState<boolean>(() => {
    try {
      return localStorage.getItem('ecoacess_has_seen_tour') === 'true';
    } catch {
      return false;
    }
  });
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);

  const startTour = () => {
    setIsTourOpen(true);
    sound.playSuccess(accessibility.soundEnabled);
    triggerVibration([40, 30, 40], accessibility.vibrationEnabled);
  };

  const closeTour = () => {
    setIsTourOpen(false);
    setHasSeenTour(true);
    try {
      localStorage.setItem('ecoacess_has_seen_tour', 'true');
    } catch {
      // ignore
    }
    sound.playClick(accessibility.soundEnabled);
  };

  // Dynamic Date-Based Theme and Message Service State
  const [currentDayTheme, setCurrentDayTheme] = useState<DayThemeData>(() => {
    return dailyThemeService.getThemeForDate(dailyThemeService.getCurrentDate(), allWallpapers, allQuotes);
  });

  // Keep theme in sync with wallpapers or quotes changes
  useEffect(() => {
    const updated = dailyThemeService.getThemeForDate(dailyThemeService.getCurrentDate(), allWallpapers, allQuotes);
    setCurrentDayTheme(updated);
  }, [allWallpapers, allQuotes]);

  // Subscribe to midnight rollover or simulation changes
  useEffect(() => {
    const unsubscribe = dailyThemeService.subscribe((theme) => {
      setCurrentDayTheme(theme);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const simulateThemeDate = (date: Date | null) => {
    dailyThemeService.simulateDate(date, allWallpapers, allQuotes);
    sound.playClick(accessibility.soundEnabled);
    triggerVibration(40, accessibility.vibrationEnabled);
  };

  const resetThemeDate = () => {
    dailyThemeService.resetToCurrentDate(allWallpapers, allQuotes);
    sound.playClick(accessibility.soundEnabled);
  };

  const dailyWallpaper = currentDayTheme.wallpaper;
  const dailyQuote = currentDayTheme.quote;

  // Save accessibility to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ecoacess_accessibility', JSON.stringify(accessibility));
    } catch {
      // storage quota or incognito
    }
  }, [accessibility]);

  const updateAccessibility = (partial: Partial<AccessibilitySettings>) => {
    setAccessibility(prev => {
      const updated = { ...prev, ...partial };
      return updated;
    });
    if (accessibility.soundEnabled) {
      sound.playClick(true);
    }
    if (accessibility.vibrationEnabled) {
      triggerVibration(40, true);
    }
  };

  const playActionSound = () => {
    sound.playClick(accessibility.soundEnabled);
    triggerVibration(40, accessibility.vibrationEnabled);
  };

  const login = (username: string, role: 'user' | 'admin' = 'user'): boolean => {
    if (username.toLowerCase() === 'admin') {
      const adminUser = userList.find(u => u.username === 'admin') || initialUsers[0];
      setCurrentUser(adminUser);
      setCurrentScreen('admin');
      sound.playSuccess(accessibility.soundEnabled);
      triggerVibration([50, 40, 50], accessibility.vibrationEnabled);
      return true;
    }

    const found = userList.find(u => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === username.toLowerCase());
    if (found) {
      if (found.isBlocked) {
        return false;
      }
      setCurrentUser(found);
      if (found.colorBlindnessType && found.colorBlindnessType !== 'none') {
        setAccessibility(prev => ({ ...prev, colorBlindnessType: found.colorBlindnessType }));
      }
      setCurrentScreen(found.role === 'admin' ? 'admin' : 'home');
      sound.playSuccess(accessibility.soundEnabled);
      triggerVibration([50, 40, 50], accessibility.vibrationEnabled);
      return true;
    }

    // Fallback: create session user
    const newUser: UserProfile = {
      id: 'usr-' + Date.now(),
      name: username,
      username: username.toLowerCase().replace(/\s+/g, '.'),
      email: `${username.toLowerCase()}@ecoacess.am`,
      colorBlindnessType: accessibility.colorBlindnessType,
      ecoPoints: 100,
      level: 'Iniciante Consciente',
      role: 'user',
      createdAt: new Date().toISOString().split('T')[0],
      isBlocked: false,
    };
    setUserList(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setCurrentScreen('home');
    sound.playSuccess(accessibility.soundEnabled);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentScreen('login');
    sound.playClick(accessibility.soundEnabled);
  };

  const registerUser = (
    name: string, 
    email: string, 
    username: string, 
    colorType: AccessibilitySettings['colorBlindnessType'],
    options?: {
      accountType?: AccountProfileType;
      guardianName?: string;
      guardianEmail?: string;
    }
  ) => {
    const accountType = options?.accountType || 'individual';
    const newUser: UserProfile = {
      id: 'usr-' + Date.now(),
      name,
      email,
      username,
      colorBlindnessType: colorType,
      ecoPoints: 150, // Welcome bonus points
      level: accountType === 'family' ? 'Guardião Júnior' : 'Cidadão Consciente',
      role: 'user',
      accountType,
      guardianName: options?.guardianName,
      guardianEmail: options?.guardianEmail,
      createdAt: new Date().toISOString().split('T')[0],
      isBlocked: false,
    };
    setUserList(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setAccessibility(prev => ({ ...prev, colorBlindnessType: colorType }));
    setCurrentScreen('home');
    sound.playSuccess(accessibility.soundEnabled);
    // Start guided tour for new user
    setTimeout(() => {
      setIsTourOpen(true);
    }, 400);
  };

  const addHistoryItem = (item: WasteIdentificationResult) => {
    setHistory(prev => [item, ...prev]);
    // Reward points to active user
    if (currentUser) {
      const newPoints = currentUser.ecoPoints + item.ecoPoints;
      let newLevel = currentUser.level;
      if (newPoints >= 1000) newLevel = 'Embaixador da Amazônia';
      else if (newPoints >= 500) newLevel = 'Guardião dos Igarapés';
      else if (newPoints >= 250) newLevel = 'Protetor da Floresta';

      const updatedUser = { ...currentUser, ecoPoints: newPoints, level: newLevel };
      setCurrentUser(updatedUser);
      setUserList(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    }
  };

  const redeemReward = (rewardId: string): boolean => {
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward || !currentUser) return false;
    if (currentUser.ecoPoints < reward.pointsCost) return false;

    const updatedUser = {
      ...currentUser,
      ecoPoints: currentUser.ecoPoints - reward.pointsCost,
    };
    setCurrentUser(updatedUser);
    setUserList(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    sound.playSuccess(accessibility.soundEnabled);
    triggerVibration([60, 40, 80], accessibility.vibrationEnabled);
    return true;
  };

  // Admin Actions
  const addPev = (pevData: Omit<PEVLocation, 'id'>) => {
    const newPev: PEVLocation = {
      ...pevData,
      id: 'pev-' + Date.now(),
    };
    setPevs(prev => [...prev, newPev]);
    sound.playSuccess(accessibility.soundEnabled);
  };

  const updatePev = (id: string, pevData: Partial<PEVLocation>) => {
    setPevs(prev => prev.map(p => p.id === id ? { ...p, ...pevData } : p));
    sound.playClick(accessibility.soundEnabled);
  };

  const deletePev = (id: string) => {
    setPevs(prev => prev.filter(p => p.id !== id));
    sound.playClick(accessibility.soundEnabled);
  };

  const addQuote = (quoteData: Omit<MotivationalQuote, 'id'>) => {
    const newQuote: MotivationalQuote = {
      ...quoteData,
      id: 'quote-' + Date.now(),
    };
    setAllQuotes(prev => [...prev, newQuote]);
    sound.playSuccess(accessibility.soundEnabled);
  };

  const toggleQuoteActive = (id: string) => {
    setAllQuotes(prev => prev.map(q => q.id === id ? { ...q, active: !q.active } : q));
  };

  const deleteQuote = (id: string) => {
    setAllQuotes(prev => prev.filter(q => q.id !== id));
  };

  const addWallpaper = (wpData: Omit<DailyWallpaper, 'id'>) => {
    const newWp: DailyWallpaper = {
      ...wpData,
      id: 'wall-' + Date.now(),
    };
    setAllWallpapers(prev => [...prev, newWp]);
    sound.playSuccess(accessibility.soundEnabled);
  };

  const toggleWallpaperActive = (id: string) => {
    setAllWallpapers(prev => prev.map(w => w.id === id ? { ...w, active: !w.active } : w));
  };

  const deleteWallpaper = (id: string) => {
    setAllWallpapers(prev => prev.filter(w => w.id !== id));
  };

  const toggleUserBlocked = (id: string) => {
    setUserList(prev => prev.map(u => u.id === id ? { ...u, isBlocked: !u.isBlocked } : u));
  };

  const deleteUser = (id: string) => {
    setUserList(prev => prev.filter(u => u.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentScreen,
        setScreen: (scr) => {
          sound.playClick(accessibility.soundEnabled);
          triggerVibration(40, accessibility.vibrationEnabled);
          setCurrentScreen(scr);
        },
        accessibility,
        updateAccessibility,
        dailyWallpaper,
        dailyQuote,
        currentDayTheme,
        simulateThemeDate,
        resetThemeDate,
        allWallpapers,
        allQuotes,
        pevs,
        history,
        rewards,
        userList,
        activeRoutePevId,
        setActiveRoutePevId,
        isTourOpen,
        startTour,
        closeTour,
        hasSeenTour,
        login,
        logout,
        registerUser,
        addHistoryItem,
        redeemReward,
        addPev,
        updatePev,
        deletePev,
        addQuote,
        toggleQuoteActive,
        deleteQuote,
        addWallpaper,
        toggleWallpaperActive,
        deleteWallpaper,
        toggleUserBlocked,
        deleteUser,
        playActionSound,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return ctx;
};
