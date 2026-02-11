import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '../store/useWalletStore';
import { useMovementStore } from '../store/useMovementStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import SummaryCard from '../components/SummaryCard';
import { formatCurrency, formatDate, groupMovementsByDate } from '../utils/format';
import { isSameDay, isSameWeek, isSameMonth, isSameYear } from 'date-fns';
import { ShoppingBag, Bus, Zap, Coffee, Heart, GraduationCap, DollarSign, HelpCircle } from 'lucide-react';

const CATEGORY_ICONS = {
    'Comida': ShoppingBag,
    'Transporte': Bus,
    'Servicios': Zap,
    'Ocio': Coffee,
    'Salud': Heart,
    'Educación': GraduationCap,
    'Ingresos': DollarSign,
    'Varios': HelpCircle
};

export default function FeedPage() {
    const { movements, removeMovement } = useMovementStore();
    const { currency, exchangeRate } = useCurrencyStore();
    const { wallets, activeWalletId, setActiveWallet, getActiveWallet } = useWalletStore();
    const navigate = useNavigate();

    const activeWallet = getActiveWallet();

    const filteredMovements = useMemo(() => {
        if (!activeWalletId) return [];
        return movements.filter(m => m.walletId === activeWalletId);
    }, [movements, activeWalletId]);

    const stats = useMemo(() => {
        const getConvertedAmount = (m) => {
            if (m.currency === currency) return m.amount;
            if (m.currency === 'USD' && currency === 'ARS') return m.amount * exchangeRate;
            if (m.currency === 'ARS' && currency === 'USD') return m.amount / exchangeRate;
            return m.amount;
        };

        const now = new Date();
        const acc = {
            daily: { income: 0, expense: 0 },
            weekly: { income: 0, expense: 0 },
            monthly: { income: 0, expense: 0 },
            annual: { income: 0, expense: 0 },
        };

        filteredMovements.forEach(m => {
            const [year, month, day] = m.date.split('-').map(Number);
            const date = new Date(year, month - 1, day);
            const val = getConvertedAmount(m);
            const isIncome = m.type === 'income';

            if (isSameDay(date, now)) {
                if (isIncome) acc.daily.income += val; else acc.daily.expense += val;
            }
            if (isSameWeek(date, now, { weekStartsOn: 1 })) {
                if (isIncome) acc.weekly.income += val; else acc.weekly.expense += val;
            }
            if (isSameMonth(date, now)) {
                if (isIncome) acc.monthly.income += val; else acc.monthly.expense += val;
            }
            if (isSameYear(date, now)) {
                if (isIncome) acc.annual.income += val; else acc.annual.expense += val;
            }
        });

        return acc;
    }, [filteredMovements, currency, exchangeRate]);

    const groupedMovements = useMemo(() => groupMovementsByDate(filteredMovements), [filteredMovements]);

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este movimiento?')) {
            removeMovement(id);
        }
    };

    return (
        <div className="container" style={{ paddingBottom: '80px' }}>


            {/* Summary Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }}>
                <SummaryCard
                    title="Hoy"
                    income={stats.daily.income}
                    expense={stats.daily.expense}
                    currency={currency}
                />
                <SummaryCard
                    title="Semana"
                    income={stats.weekly.income}
                    expense={stats.weekly.expense}
                    currency={currency}
                />
                <SummaryCard
                    title="Mes"
                    income={stats.monthly.income}
                    expense={stats.monthly.expense}
                    currency={currency}
                />
                <SummaryCard
                    title="Año"
                    income={stats.annual.income}
                    expense={stats.annual.expense}
                    currency={currency}
                />
            </div >

            <h3 style={{ marginBottom: '16px', fontSize: '1.2rem' }}>Movimientos Recientes ({activeWallet?.name})</h3>

            {
                groupedMovements.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#999', marginTop: '40px' }}>
                        <p>No hay movimientos en esta billetera.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-md">
                        {groupedMovements.map(group => (
                            <div key={group.date}>
                                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    {formatDate(group.date)}
                                </div>
                                <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                                    {group.items.map((item, idx) => {
                                        const Icon = CATEGORY_ICONS[item.category] || HelpCircle;
                                        const isExpense = item.type === 'expense';
                                        return (
                                            <div key={item.id} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: '12px 16px',
                                                borderBottom: idx < group.items.length - 1 ? '1px solid var(--color-border)' : 'none'
                                            }}>
                                                <div style={{
                                                    width: '40px', height: '40px', borderRadius: '50%',
                                                    background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    marginRight: '12px', color: 'var(--color-text-primary)'
                                                }}>
                                                    <Icon size={20} />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.category}</div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{item.description}</div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontWeight: 600, color: isExpense ? 'var(--color-text-primary)' : 'var(--color-success)' }}>
                                                        {isExpense ? '-' : '+'}
                                                        {formatCurrency(item.amount, item.currency)}
                                                    </div>
                                                    <div style={{ marginTop: '4px', fontSize: '0.8rem', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                        <span
                                                            onClick={() => navigate(`/add?edit=${item.id}`)}
                                                            style={{ cursor: 'pointer', color: 'var(--color-primary)' }}
                                                        >
                                                            Editar
                                                        </span>
                                                        <span
                                                            onClick={() => handleDelete(item.id)}
                                                            style={{ cursor: 'pointer', color: 'var(--color-error, #ef4444)' }}
                                                        >
                                                            Eliminar
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }
        </div >
    );
}
