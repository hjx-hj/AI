import { create } from 'zustand';
import { type UserInfo } from '@/types/auth';
import { storage } from '@/utils/storage';

interface UserState {
  user: UserInfo | null;
  token: string;
  permissions: string[];
  setUser: (user: UserInfo) => void;
  setToken: (token: string) => void;
  setPermissions: (permissions: string[]) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: storage.getUser<UserInfo>(),
  token: storage.getToken(),
  permissions: storage.getUser<UserInfo>()?.permissions || [],

  setUser: (user: UserInfo) => {
    storage.setUser(user);
    set({ user, permissions: user.permissions });
  },

  setToken: (token: string) => {
    storage.setToken(token);
    set({ token });
  },

  setPermissions: (permissions: string[]) => {
    set({ permissions });
  },

  logout: () => {
    storage.removeToken();
    storage.removeUser();
    storage.removeTheme?.();
    set({ user: null, token: '', permissions: [] });
  },

  hasPermission: (permission: string) => {
    const { permissions } = get();
    return permissions.includes(permission);
  },
}));