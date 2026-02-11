import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useWalletStore } from './useWalletStore';

export const useMovementStore = create(
    persist(
        (set, get) => ({
            movements: [],

            addMovement: (movement) => {
                const { activeWalletId } = useWalletStore.getState(); // Get active wallet
                if (!activeWalletId) {
                    console.error("No active wallet selected");
                    return;
                }
                set((state) => ({
                    movements: [{ ...movement, id: crypto.randomUUID(), createdAt: new Date().toISOString(), walletId: activeWalletId }, ...state.movements]
                }))
            },

            removeMovement: (id) => set((state) => ({
                movements: state.movements.filter(m => m.id !== id)
            })),

            updateMovement: (id, updates) => set((state) => ({
                movements: state.movements.map(m => m.id === id ? { ...m, ...updates } : m)
            })),

            getMovementsByWallet: (walletId) => {
                return get().movements.filter(m => m.walletId === walletId);
            }
        }),
        {
            name: 'finance-arg-movements',
        }
    )
);
