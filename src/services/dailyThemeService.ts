import { DailyWallpaper, MotivationalQuote, DayThemeData } from '../types';
import { DAILY_WALLPAPERS, MOTIVATIONAL_QUOTES } from '../data/mockData';
import { getDailyThemeData } from '../utils/dailyTheme';

type ThemeChangeListener = (theme: DayThemeData) => void;

class DailyThemeService {
  private simulatedDate: Date | null = null;
  private listeners: Set<ThemeChangeListener> = new Set();
  private timerId: number | null = null;
  private lastEvaluatedDayKey: string = '';

  constructor() {
    this.startMidnightWatcher();
  }

  /**
   * Returns current active date (simulated or real local date)
   */
  public getCurrentDate(): Date {
    return this.simulatedDate ? new Date(this.simulatedDate) : new Date();
  }

  /**
   * Sets a simulated date to test wallpaper and message updates
   */
  public simulateDate(date: Date | null, wallpapers?: DailyWallpaper[], quotes?: MotivationalQuote[]) {
    this.simulatedDate = date;
    const currentWallpapers = wallpapers || DAILY_WALLPAPERS;
    const currentQuotes = quotes || MOTIVATIONAL_QUOTES;
    const updatedTheme = this.getThemeForDate(this.getCurrentDate(), currentWallpapers, currentQuotes);
    this.notifyListeners(updatedTheme);
  }

  /**
   * Resets simulation back to actual system date
   */
  public resetToCurrentDate(wallpapers?: DailyWallpaper[], quotes?: MotivationalQuote[]) {
    this.simulateDate(null, wallpapers, quotes);
  }

  /**
   * Calculates dynamic DayThemeData deterministically based on any calendar date
   * using Date.getDate() from src/utils/dailyTheme.ts
   */
  public getThemeForDate(
    targetDate: Date, 
    allWallpapers: DailyWallpaper[] = DAILY_WALLPAPERS, 
    allQuotes: MotivationalQuote[] = MOTIVATIONAL_QUOTES
  ): DayThemeData {
    return getDailyThemeData(targetDate, allWallpapers, allQuotes);
  }

  /**
   * Generates schedule forecast for the upcoming 7 days
   */
  public getUpcomingWeekThemes(
    wallpapers: DailyWallpaper[] = DAILY_WALLPAPERS, 
    quotes: MotivationalQuote[] = MOTIVATIONAL_QUOTES
  ): DayThemeData[] {
    const list: DayThemeData[] = [];
    const base = this.getCurrentDate();

    for (let i = 0; i < 7; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      list.push(this.getThemeForDate(d, wallpapers, quotes));
    }

    return list;
  }

  /**
   * Subscribe to dynamic theme updates (triggers on day change or simulation change)
   */
  public subscribe(listener: ThemeChangeListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(theme: DayThemeData) {
    this.listeners.forEach(fn => fn(theme));
  }

  /**
   * Background watcher that checks every 30 seconds if the calendar day rolled over
   */
  private startMidnightWatcher() {
    if (typeof window === 'undefined') return;

    this.timerId = window.setInterval(() => {
      if (this.simulatedDate) return; // In simulation mode, manual change only

      const now = new Date();
      const currentDayKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;

      if (this.lastEvaluatedDayKey && this.lastEvaluatedDayKey !== currentDayKey) {
        this.lastEvaluatedDayKey = currentDayKey;
        const newTheme = this.getThemeForDate(now);
        this.notifyListeners(newTheme);
      } else {
        this.lastEvaluatedDayKey = currentDayKey;
      }
    }, 30000);
  }

  public destroy() {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.listeners.clear();
  }
}

export const dailyThemeService = new DailyThemeService();
