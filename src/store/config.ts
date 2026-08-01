import { create } from 'zustand';
import { type ThemeType } from '@/types/index';
import { storage } from '@/utils/storage';

interface ConfigState {
  theme: ThemeType;
  watermarkEnabled: boolean;
  watermarkText: string;
  fullscreenEnabled: boolean;
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
  setWatermarkEnabled: (enabled: boolean) => void;
  setWatermarkText: (text: string) => void;
  setFullscreenEnabled: (enabled: boolean) => void;
  toggleFullscreen: () => void;
}

export const useConfigStore = create<ConfigState>((set, get) => ({
  theme: (storage.getTheme() as ThemeType) || 'light',
  watermarkEnabled: true,
  watermarkText: storage.getUser<{ nickname: string }>()?.nickname || 'AI训练平台',
  fullscreenEnabled: false,

  setTheme: (theme: ThemeType) => {
    storage.setTheme(theme);
    set({ theme });
    document.documentElement.setAttribute('data-theme', theme);
  },

  toggleTheme: () => {
    const { theme, setTheme } = get();
    setTheme(theme === 'light' ? 'dark' : 'light');
  },

  setWatermarkEnabled: (enabled: boolean) => {
    set({ watermarkEnabled: enabled });
  },

  setWatermarkText: (text: string) => {
    set({ watermarkText: text });
  },

  setFullscreenEnabled: (enabled: boolean) => {
    set({ fullscreenEnabled: enabled });
  },

  toggleFullscreen: () => {
    const { fullscreenEnabled, setFullscreenEnabled } = get();
    if (fullscreenEnabled) {
      document.exitFullscreen?.();
    } else {
      document.documentElement.requestFullscreen?.();
    }
    setFullscreenEnabled(!fullscreenEnabled);
  },
}));