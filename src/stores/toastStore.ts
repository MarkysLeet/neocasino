import { create } from 'zustand';

export interface ToastItem {
  id: string;
  message: string;
  tone: 'success' | 'warning' | 'info';
}

interface ToastState {
  items: ToastItem[];
  addToast: (item: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  items: [],
  addToast: (item) =>
    set((state) => ({
      items: [...state.items, { id: crypto.randomUUID(), ...item }]
    })),
  removeToast: (id) =>
    set((state) => ({
      items: state.items.filter((toast) => toast.id !== id)
    }))
}));
