import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, PieChart, PlusCircle, Settings } from 'lucide-react';

import { useWalletStore } from '../store/useWalletStore';

export default function Layout() {
    const { wallets, activeWalletId, setActiveWallet } = useWalletStore();

    return (
        <>
            <header style={{
                height: 'var(--header-height)',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 var(--spacing-md)',
                position: 'sticky',
                top: 0,
                background: 'var(--color-surface)',
                zIndex: 10,
                transition: 'background-color 0.3s, border-color 0.3s'
            }}>
                <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <h1 style={{ position: 'absolute', left: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>Finance ARG</h1>

                    <div style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        background: 'var(--color-bg)',
                        borderRadius: '20px',
                        padding: '4px 12px',
                        border: '1px solid var(--color-border)',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        <div style={{ marginRight: '8px', display: 'flex', alignItems: 'center', color: 'var(--color-primary)' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></svg>
                        </div>
                        <select
                            value={activeWalletId}
                            onChange={(e) => setActiveWallet(e.target.value)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--color-text-primary)',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                outline: 'none',
                                cursor: 'pointer',
                                appearance: 'none', // Remove default arrow in some browsers
                                paddingRight: '4px',
                                textAlign: 'center'
                            }}
                        >
                            {wallets.map(w => (
                                <option key={w.id} value={w.id}>{w.name}</option>
                            ))}
                        </select>
                        <div style={{ display: 'flex', alignItems: 'center', color: 'var(--color-text-secondary)', pointerEvents: 'none' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                        </div>
                    </div>
                </div>
            </header>

            <main style={{
                paddingBottom: 'calc(var(--bottom-nav-height) + 20px)',
                minHeight: '100vh',
                background: 'var(--color-bg)'
            }}>
                <Outlet />
            </main>

            <nav style={{
                height: 'var(--bottom-nav-height)',
                borderTop: '1px solid var(--color-border)',
                position: 'fixed',
                bottom: 0,
                width: '100%',
                maxWidth: 'var(--max-width)',
                background: 'var(--color-surface)',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                zIndex: 100,
                transition: 'background-color 0.3s, border-color 0.3s'
            }}>
                <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <Home size={24} />
                </NavLink>
                <NavLink to="/stats" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <PieChart size={24} />
                </NavLink>
                <NavLink to="/add" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <PlusCircle size={32} color="var(--color-primary)" />
                </NavLink>
                <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <Settings size={24} />
                </NavLink>
            </nav>

            <style>{`
        .nav-item {
          color: var(--color-text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          transition: color 0.2s;
        }
        .nav-item.active {
          color: var(--color-primary);
        }
      `}</style>
        </>
    );
}
