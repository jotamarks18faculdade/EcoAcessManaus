export type ColorBlindnessType = 
  | 'none'
  | 'protanopia'    // Red-blind / Red-weak (L-cone)
  | 'deuteranopia'  // Green-blind / Green-weak (M-cone)
  | 'tritanopia'    // Blue-blind / Blue-weak (S-cone)
  | 'achromatopsia' // Total color blindness / Monochromacy
  | 'unknown';

export type ContrastMode = 'normal' | 'high-contrast-dark' | 'high-contrast-light' | 'yellow-black';

export type FontSizeOption = 'normal' | 'large' | 'extra-large';

export interface AccessibilitySettings {
  colorBlindnessType: ColorBlindnessType;
  simulateFilter: boolean; // Live SVG Daltonism simulation filter for evaluation/testing
  contrastMode: ContrastMode;
  fontSize: FontSizeOption;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  speechEnabled: boolean;
  showColorAddSymbols: boolean;
  showTexturePatterns: boolean;
  showDescriptiveText: boolean;
}

export type WasteCategory = 
  | 'plastic'
  | 'paper'
  | 'glass'
  | 'metal'
  | 'organic'
  | 'electronic'
  | 'hazardous';

export interface WasteCategoryInfo {
  id: WasteCategory;
  name: string;
  colorName: string; // e.g. "Vermelho (Plástico)"
  baseColor: string; // Hex
  colorAddSymbol: string; // Description or symbol key
  patternId: string; // SVG pattern ID
  patternDescription: string;
  iconName: string;
  standardDisposalNotice: string;
  decompositionTime: string;
}

export interface WasteIdentificationResult {
  id: string;
  name: string;
  category: WasteCategory;
  confidence: number;
  imageUrl: string;
  timestamp: string;
  instructions: string[];
  cleanlinessNotice: string;
  decompositionTime: string;
  environmentalImpact: string;
  ecoPoints: number;
  recommendedPevId: string;
}

export interface PEVLocation {
  id: string;
  name: string;
  neighborhood: string;
  address: string;
  reference: string;
  coordinates: {
    lat: number;
    lng: number;
    x: number; // Normalized coordinate for SVG map (0-1000)
    y: number; // Normalized coordinate for SVG map (0-1000)
  };
  acceptedCategories: WasteCategory[];
  openingHours: string;
  managedBy: string; // e.g. "SEMULSP Manaus", "Associação Catadores"
  contactPhone?: string;
}

export interface MotivationalQuote {
  id: string;
  text: string;
  authorOrContext: string;
  theme: 'inclusao' | 'sustentabilidade' | 'autonomia' | 'manaus';
  active: boolean;
}

export interface DailyWallpaper {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  themeTag: string;
  photographerOrSource: string;
  active: boolean;
}

export interface DayThemeData {
  wallpaper: DailyWallpaper;
  quote: MotivationalQuote;
  date: Date;
  dateFormatted: string;
  dayOfWeekName: string;
  themeTag: string;
  ambientGradient: string;
  themeAccent: string;
}

export type AccountProfileType = 'individual' | 'family';

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  colorBlindnessType: ColorBlindnessType;
  ecoPoints: number;
  level: string;
  role: 'user' | 'admin';
  createdAt: string;
  isBlocked?: boolean;
  accountType?: AccountProfileType;
  guardianName?: string;
  guardianEmail?: string;
}

export interface GraphNode {
  id: string;
  name: string;
  x: number;
  y: number;
  neighborhood: string;
}

export interface GraphEdge {
  from: string;
  to: string;
  distanceKm: number;
  streetName: string;
}

export interface RoutePath {
  nodes: GraphNode[];
  totalDistanceKm: number;
  estimatedMinutes: number;
  instructions: {
    step: number;
    instruction: string;
    street: string;
    distanceKm: number;
    icon: string;
  }[];
}

export interface PartnerReward {
  id: string;
  partnerName: string;
  title: string;
  description: string;
  pointsCost: number;
  category: string;
  discountCode: string;
  icon: string;
}
