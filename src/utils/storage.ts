const TOKEN_KEY = 'ai_training_token';
const USER_KEY = 'ai_training_user';
const THEME_KEY = 'ai_training_theme';

export const storage = {
  getToken: (): string => {
    return localStorage.getItem(TOKEN_KEY) || '';
  },

  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },

  getUser: <T = unknown>(): T | null => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  setUser: <T = unknown>(user: T): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  removeUser: (): void => {
    localStorage.removeItem(USER_KEY);
  },

  getTheme: (): string => {
    return localStorage.getItem(THEME_KEY) || 'light';
  },

  setTheme: (theme: string): void => {
    localStorage.setItem(THEME_KEY, theme);
  },

  clear: (): void => {
    localStorage.clear();
  },
};