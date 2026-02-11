import React, { useState } from 'react';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useWalletStore } from '../store/useWalletStore';
import Input from '../components/Input';
import Button from '../components/Button';
import { Moon, Sun, Wallet, Trash2, PlusCircle } from 'lucide-react';

export default function SettingsPage() {
    const { currency, toggleCurrency, exchangeRate, setExchangeRate } = useCurrencyStore();
    const { theme, toggleTheme } = useSettingsStore();
    const { wallets, addWallet, removeWallet } = useWalletStore();
    const [newWalletName, setNewWalletName] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="container">
            <h2 style={{ marginBottom: '20px' }}>Configuración</h2>

            {/* Theme & Currency Toggles */}
            <section style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <button
                    onClick={toggleTheme}
                    style={{
                        flex: 1,
                        padding: '16px',
                        borderRadius: 'var(--radius-lg)',
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        color: 'var(--color-text-primary)'
                    }}
                >
                    {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                        {theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'}
                    </span>
                </button>

                <button
                    onClick={toggleCurrency}
                    style={{
                        flex: 1,
                        padding: '16px',
                        borderRadius: 'var(--radius-lg)',
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        color: 'var(--color-text-primary)'
                    }}
                >
                    <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>{currency}</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Moneda Global</span>
                </button>
            </section>

            <section style={{ marginTop: '24px', background: 'var(--color-surface)', padding: '16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>Cotización</h3>
                <Input
                    label="Tasa de Cambio (1 USD = X ARS)"
                    type="number"
                    value={exchangeRate}
                    onChange={(e) => setExchangeRate(parseFloat(e.target.value))}
                />
            </section>

            <section style={{ marginTop: '24px', background: 'var(--color-surface)', padding: '16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>Billeteras</h3>
                <div className="flex flex-col gap-sm">
                    {wallets.map(wallet => (
                        <div key={wallet.id} className="flex justify-between items-center" style={{ padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}>
                            <div className="flex items-center gap-sm">
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Wallet size={16} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 500 }}>{wallet.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{wallet.currency}</div>
                                </div>
                            </div>
                            {wallets.length > 1 && (
                                <button
                                    onClick={() => {
                                        if (window.confirm(`¿Eliminar billetera ${wallet.name}?`)) {
                                            removeWallet(wallet.id);
                                        }
                                    }}
                                    style={{ color: 'var(--color-error, #ef4444)', background: 'none', border: 'none', cursor: 'pointer' }}
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '20px' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: 'var(--color-bg)',
                        border: isFocused ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                        borderRadius: '999px',
                        padding: '4px 4px 4px 16px',
                        transition: 'box-shadow 0.2s, border-color 0.2s',
                        boxShadow: isFocused ? '0 0 0 3px rgba(var(--color-primary-rgb), 0.1)' : 'none'
                    }}>
                        <input
                            placeholder="Nombre de nueva billetera"
                            value={newWalletName}
                            onChange={(e) => setNewWalletName(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            style={{
                                flex: 1,
                                border: 'none',
                                background: 'transparent',
                                outline: 'none',
                                fontSize: '0.95rem',
                                color: 'var(--color-text-primary)',
                                padding: '8px 0'
                            }}
                        />
                        <button
                            onClick={() => {
                                if (newWalletName.trim()) {
                                    addWallet({ name: newWalletName, currency: 'ARS', icon: 'Wallet' });
                                    setNewWalletName('');
                                }
                            }}
                            disabled={!newWalletName.trim()}
                            style={{
                                background: newWalletName.trim() ? 'var(--color-primary)' : 'var(--color-border)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '999px',
                                width: '36px',
                                height: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: newWalletName.trim() ? 'pointer' : 'default',
                                transition: 'background-color 0.2s',
                                marginLeft: '8px'
                            }}
                        >
                            <PlusCircle size={20} />
                        </button>
                    </div>
                </div>
            </section>


        </div >
    );
}
