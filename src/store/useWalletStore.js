import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWalletStore = create(
    persist(
        (set, get) => ({
            wallets: [
                { id: 'default', name: 'Principal', currency: 'ARS', icon: 'Wallet' }
            ],
            activeWalletId: 'default',

            addWallet: (wallet) => set((state) => ({
                wallets: [...state.wallets, { ...wallet, id: crypto.randomUUID() }]
            })),

            removeWallet: (id) => set((state) => {
                const newWallets = state.wallets.filter(w => w.id !== id);
                // If active wallet is removed, switch to the first available one
                const newActiveId = state.activeWalletId === id ? (newWallets[0]?.id || null) : state.activeWalletId;
                return {
                    wallets: newWallets,
                    activeWalletId: newActiveId
                };
            }),

            updateWallet: (id, updates) => set((state) => ({
                wallets: state.wallets.map(w => w.id === id ? { ...w, ...updates } : w)
            })),

            setActiveWallet: (id) => set({ activeWalletId: id }),

            getActiveWallet: () => {
                const state = get();
                return state.wallets.find(w => w.id === state.activeWalletId);
            }
        }),
        {
            name: 'finance-arg-wallets',
        }
    )
);
