// src/store/useSessionStore.ts
// Estado global en memoria — nunca se persiste en disco.
// Alineado con ADR-001 Capa 1: tokens solo en memoria.

import { create } from 'zustand';

interface SessionState {
  // Usuario autenticado — lo llena P1 cuando integren auth
  userId: string | null;
  userName: string | null;
  balance: number | null;

  // Acciones
  setUser: (userId: string, userName: string) => void;
  setBalance: (balance: number) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  // MOCK semana 1: userId hardcodeado para pruebas
  // Cuando P1 integre auth, setUser() lo llena desde su login screen
  userId: 'mock-user-123',
  userName: 'Santiago Taborda',
  balance: null,

  setUser: (userId, userName) => set({ userId, userName }),
  setBalance: (balance) => set({ balance }),
  clearSession: () => set({ userId: null, userName: null, balance: null }),
}));
