import { DailyWallpaper, MotivationalQuote, DayThemeData } from '../types';

/**
 * Acervo fotográfico exclusivo de Manaus, Rio Negro, Floresta Amazônica e Meio Ambiente.
 * Imagens de alta definição otimizadas para contraste e acessibilidade.
 */
export const AMAZONAS_MANAUS_WALLPAPERS: DailyWallpaper[] = [
  {
    id: 'amz-teatro-manaus',
    title: 'Teatro Amazonas & Praça São Sebastião',
    description: 'Símbolo histórico e cultural de Manaus, rodeado de áreas verdes e patrimônio manauara.',
    imageUrl: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=1200&q=80',
    themeTag: 'Manaus Histórica & Patrimônio',
    photographerOrSource: 'Patrimônio Cultural do Amazonas',
    active: true,
  },
  {
    id: 'amz-rio-negro-aguas',
    title: 'Águas Negras do Rio Negro em Manaus',
    description: 'O maior rio de águas pretas do mundo, bacia vital que acolhe a cidade de Manaus.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    themeTag: 'Rios de Manaus & Preservação',
    photographerOrSource: 'Guia Ambiental Rio Negro',
    active: true,
  },
  {
    id: 'amz-floresta-canopy',
    title: 'Floresta Amazônica Densa & Biodiversidade',
    description: 'A riqueza da fauna e flora amazônica preservada pelo descarte consciente de resíduos.',
    imageUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=80',
    themeTag: 'Biodiversidade Amazônica',
    photographerOrSource: 'Instituto Chico Mendes de Conservação',
    active: true,
  },
  {
    id: 'amz-coleta-seletiva-manaus',
    title: 'Coleta Seletiva & Economia Circular em Manaus',
    description: 'Materiais recicláveis limpos e organizados nos PEVs municipais de Manaus.',
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80',
    themeTag: 'Reciclagem & Sustentabilidade',
    photographerOrSource: 'Cooperativas de Catadores de Manaus',
    active: true,
  },
  {
    id: 'amz-inclusao-tecnologia',
    title: 'Tecnologia Acessível & Design Universal',
    description: 'Inclusão digital permitindo que pessoas com daltonismo participem ativamente da reciclagem.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
    themeTag: 'Inclusão & Acessibilidade',
    photographerOrSource: 'Inclusão Digital Amazonas',
    active: true,
  },
  {
    id: 'amz-ponta-negra-orla',
    title: 'Orla da Ponta Negra ao Pôr do Sol',
    description: 'Um dos cartões postais mais amados da capital amazonense com PEV comunitário ativo.',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    themeTag: 'Manaus Urbana & Orla',
    photographerOrSource: 'Secretaria de Meio Ambiente',
    active: true,
  },
  {
    id: 'amz-parque-sumauma',
    title: 'Parque Estadual Sumaúma & Cidade Nova',
    description: 'Fragmento florestal urbano essencial para a qualidade do ar e microclima de Manaus.',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    themeTag: 'Parques Urbanos & Conservação',
    photographerOrSource: 'Unidades de Conservação do Amazonas',
    active: true,
  },
  {
    id: 'amz-polo-industrial-verde',
    title: 'Polo Industrial Sustentável de Manaus',
    description: 'Indústria verde com logística reversa e reciclagem de resíduos eletroeletrônicos.',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    themeTag: 'Logística Reversa & E-Waste',
    photographerOrSource: 'Polo Tecnológico de Manaus',
    active: true,
  },
  {
    id: 'amz-encontro-das-aguas',
    title: 'Encontro das Águas: Rio Negro e Solimões',
    description: 'Fenômeno natural único no mundo onde as águas correm lado a lado sem se misturar.',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
    themeTag: 'Encontro das Águas',
    photographerOrSource: 'Acervo Geográfico do Amazonas',
    active: true,
  },
  {
    id: 'amz-igarapes-mindu',
    title: 'Corredor Ecológico do Igarapé do Mindu',
    description: 'Mananciais urbanos preservados pela não deposição de plásticos e resíduos sólidos.',
    imageUrl: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1200&q=80',
    themeTag: 'Igarapés de Manaus',
    photographerOrSource: 'Preservação dos Igarapés de Manaus',
    active: true,
  },
];

/**
 * Frases motivacionais sobre inclusão, acessibilidade, daltonismo e meio ambiente em Manaus
 */
export const DAILY_MOTIVATIONAL_QUOTES: MotivationalQuote[] = [
  {
    id: 'quote-1',
    text: 'A acessibilidade transforma informação em autonomia.',
    authorOrContext: 'Princípio do Design Universal',
    theme: 'autonomia',
    active: true,
  },
  {
    id: 'quote-2',
    text: 'Cada escolha correta ajuda a construir uma Manaus mais sustentável.',
    authorOrContext: 'EcoAcess Manaus',
    theme: 'manaus',
    active: true,
  },
  {
    id: 'quote-3',
    text: 'Sua diferença não limita sua capacidade de transformar o mundo.',
    authorOrContext: 'Inclusão & Cidadania',
    theme: 'inclusao',
    active: true,
  },
  {
    id: 'quote-4',
    text: 'Cuidar do meio ambiente também é promover inclusão.',
    authorOrContext: 'Sustentabilidade Social',
    theme: 'sustentabilidade',
    active: true,
  },
  {
    id: 'quote-5',
    text: 'Tecnologia acessível é tecnologia para todos.',
    authorOrContext: 'Acessibilidade Digital',
    theme: 'autonomia',
    active: true,
  },
  {
    id: 'quote-6',
    text: 'Pequenas atitudes em nossos igarapés geram grandes transformações na Amazônia.',
    authorOrContext: 'Consciência Ecológica em Manaus',
    theme: 'manaus',
    active: true,
  },
  {
    id: 'quote-7',
    text: 'Enxergar o mundo de forma única é a sua maior força.',
    authorOrContext: 'Diversidade Visual & Daltonismo',
    theme: 'inclusao',
    active: true,
  },
  {
    id: 'quote-8',
    text: 'Proteger o Rio Negro começa no descarte correto de cada garrafa e embalagem.',
    authorOrContext: 'Sustentabilidade dos Rios de Manaus',
    theme: 'sustentabilidade',
    active: true,
  },
  {
    id: 'quote-9',
    text: 'Reciclar com símbolos e texturas é garantir que ninguém fique para trás.',
    authorOrContext: 'Design para Todos',
    theme: 'inclusao',
    active: true,
  },
  {
    id: 'quote-10',
    text: 'Manaus é nossa casa: preservar a floresta ao nosso redor é um dever coletivo.',
    authorOrContext: 'Cidadania Manauara',
    theme: 'manaus',
    active: true,
  },
];

export interface DailyThemeResult {
  image: DailyWallpaper;
  quote: MotivationalQuote;
  date: Date;
  dayOfMonth: number;
  dateFormatted: string;
  dayOfWeekName: string;
  themeTag: string;
  ambientGradient: string;
  themeAccent: string;
}

/**
 * Utilitário principal que retorna a imagem e a frase motivacional baseadas na data do sistema (via Date.getDate()).
 * @param customDate Data opcional (caso não fornecida, usa a data atual do sistema via new Date())
 * @param customWallpapers Lista opcional de imagens
 * @param customQuotes Lista opcional de frases
 */
export function getDailyTheme(
  customDate?: Date,
  customWallpapers?: DailyWallpaper[],
  customQuotes?: MotivationalQuote[]
): DailyThemeResult {
  const targetDate = customDate || new Date();
  
  // Utiliza explicitamente Date.getDate() conforme solicitado
  const dayOfMonth = targetDate.getDate();

  const wallpapers = (customWallpapers && customWallpapers.length > 0)
    ? customWallpapers.filter(w => w.active)
    : AMAZONAS_MANAUS_WALLPAPERS.filter(w => w.active);

  const quotes = (customQuotes && customQuotes.length > 0)
    ? customQuotes.filter(q => q.active)
    : DAILY_MOTIVATIONAL_QUOTES.filter(q => q.active);

  const availableWallpapers = wallpapers.length > 0 ? wallpapers : AMAZONAS_MANAUS_WALLPAPERS;
  const availableQuotes = quotes.length > 0 ? quotes : DAILY_MOTIVATIONAL_QUOTES;

  // Seleção determinística baseada no dia do mês obtido por Date.getDate()
  // Utiliza (dayOfMonth - 1) para indexação exata de 0 até length - 1
  const imageIndex = Math.abs(dayOfMonth - 1) % availableWallpapers.length;
  const quoteIndex = Math.abs(dayOfMonth - 1 + (targetDate.getMonth() * 2)) % availableQuotes.length;

  const image = availableWallpapers[imageIndex];
  const quote = availableQuotes[quoteIndex];

  const dayOfWeekName = targetDate.toLocaleDateString('pt-BR', { weekday: 'long' });
  const capitalizedDayOfWeek = dayOfWeekName.charAt(0).toUpperCase() + dayOfWeekName.slice(1);

  const dateFormatted = targetDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  // Estilização ambiental dinâmica baseada no tema da imagem
  let ambientGradient = 'from-black/90 via-stone-950/85 to-stone-900/90';
  let themeAccent = '#10B981'; // Emerald

  const tag = (image.themeTag || '').toLowerCase();
  if (tag.includes('rio') || tag.includes('água') || tag.includes('orla')) {
    ambientGradient = 'from-black/90 via-blue-950/75 to-stone-950/90';
    themeAccent = '#38BDF8'; // Sky blue
  } else if (tag.includes('tecnologia') || tag.includes('inclusão') || tag.includes('acessibilidade')) {
    ambientGradient = 'from-black/90 via-purple-950/75 to-stone-950/90';
    themeAccent = '#C084FC'; // Purple
  } else if (tag.includes('patrimônio') || tag.includes('histórica') || tag.includes('manaus')) {
    ambientGradient = 'from-black/90 via-amber-950/75 to-stone-950/90';
    themeAccent = '#FBBF24'; // Amber
  } else if (tag.includes('reciclagem') || tag.includes('sustentabilidade') || tag.includes('parques')) {
    ambientGradient = 'from-black/90 via-teal-950/75 to-stone-950/90';
    themeAccent = '#2DD4BF'; // Teal
  }

  return {
    image,
    quote,
    date: targetDate,
    dayOfMonth,
    dateFormatted,
    dayOfWeekName: capitalizedDayOfWeek,
    themeTag: image.themeTag,
    ambientGradient,
    themeAccent,
  };
}

/**
 * Converte o resultado para a interface compatível DayThemeData
 */
export function getDailyThemeData(
  date?: Date,
  wallpapers?: DailyWallpaper[],
  quotes?: MotivationalQuote[]
): DayThemeData {
  const res = getDailyTheme(date, wallpapers, quotes);
  return {
    wallpaper: res.image,
    quote: res.quote,
    date: res.date,
    dateFormatted: res.dateFormatted,
    dayOfWeekName: res.dayOfWeekName,
    themeTag: res.themeTag,
    ambientGradient: res.ambientGradient,
    themeAccent: res.themeAccent,
  };
}
