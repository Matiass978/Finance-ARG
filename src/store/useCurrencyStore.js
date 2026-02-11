import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCurrencyStore = create(
    persist(
        (set) => ({
            currency: 'ARS', // Default view currency
            exchangeRate: 1100, // Default manual exchange rate (USD to ARS)

            toggleCurrency: () => set((state) => ({
                currency: state.currency === 'ARS' ? 'USD' : 'ARS'
            })),

            setCurrency: (currency) => set({ currency }),

            setExchangeRate: (rate) => set({ exchangeRate: rate }),
        }),
        {
            name: 'finance-arg-currency',
        }
    )
);
