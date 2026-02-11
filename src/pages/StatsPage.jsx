import React, { useMemo, useState } from 'react';
import { useWalletStore } from '../store/useWalletStore';
import { useMovementStore } from '../store/useMovementStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { formatCurrency } from '../utils/format';
import { ArrowLeft, ArrowRight, Calendar, Filter, BarChart2, PieChart as PieChartIcon } from 'lucide-react';
import {
    startOfMonth, endOfMonth, format, isWithinInterval, parseISO, subMonths, addMonths,
    startOfWeek, endOfWeek, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval,
    isSameDay, isSameWeek, isSameMonth, subDays, addDays, subWeeks, addWeeks
} from 'date-fns';
import { es } from 'date-fns/locale';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ff6b6b', '#6b6bff'];

export default function StatsPage() {
    const movements = useMovementStore(s => s.movements);
    const { currency, exchangeRate } = useCurrencyStore();
    const { activeWalletId, getActiveWallet } = useWalletStore();
    const activeWallet = getActiveWallet();

    // UI State
    const [chartType, setChartType] = useState('pie'); // 'pie' | 'bar'

    // Filters for Pie Chart
    const [filterType, setFilterType] = useState('month'); // 'month' | 'custom'
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [customRange, setCustomRange] = useState({
        start: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
        end: format(endOfMonth(new Date()), 'yyyy-MM-dd')
    });

    // Bar Chart specific state
    const [barMetric, setBarMetric] = useState('expense'); // 'expense' | 'income' | 'balance'
    const [barGranularity, setBarGranularity] = useState('day'); // 'day' | 'week' | 'month'
    const [barEndDate, setBarEndDate] = useState(new Date()); // Rolling window end date

    const filteredData = useMemo(() => {
        if (!activeWalletId) return { chartData: [], total: 0 };

        let start, end;

        // PIE CHART DATA (Expenses by Category)
        if (chartType === 'pie') {
            if (filterType === 'month') {
                start = startOfMonth(selectedMonth);
                end = endOfMonth(selectedMonth);
            } else {
                start = parseISO(customRange.start);
                end = parseISO(customRange.end);
                end.setHours(23, 59, 59, 999);
            }

            const rangeMovements = movements.filter(m => {
                if (m.walletId !== activeWalletId) return false;
                const date = parseISO(m.date);
                return isWithinInterval(date, { start, end });
            });

            const expenseMovements = rangeMovements.filter(m => m.type === 'expense');
            const catMap = {};
            let total = 0;

            expenseMovements.forEach(m => {
                let val = m.amount;
                if (m.currency !== currency) {
                    val = m.currency === 'USD' ? val * exchangeRate : val / exchangeRate;
                }
                catMap[m.category] = (catMap[m.category] || 0) + val;
                total += val;
            });

            const chartData = Object.keys(catMap)
                .map(cat => ({
                    name: cat,
                    value: catMap[cat],
                    percentage: (catMap[cat] / total) * 100
                }))
                .sort((a, b) => b.value - a.value);

            return { chartData, total };
        }

        // BAR CHART DATA (Trend with Rolling Window)
        else {
            end = new Date(barEndDate);
            end.setHours(23, 59, 59, 999);

            // Calculate start date based on granularity (showing 10 units)
            let intervals = [];
            let formatStr = '';

            if (barGranularity === 'day') {
                start = subDays(end, 9); // 10 days total including end
                start.setHours(0, 0, 0, 0);
                intervals = eachDayOfInterval({ start, end });
                formatStr = 'dd/MM';
            } else if (barGranularity === 'week') {
                // Adjust to start/end of weeks just for interval generation, but use valid date range for filtering
                let current = end;
                // Generate last 10 weeks dates
                const weeks = [];
                for (let i = 0; i < 10; i++) {
                    weeks.unshift(current);
                    current = subWeeks(current, 1);
                }
                intervals = weeks;
                start = subWeeks(end, 9);
                start.setHours(0, 0, 0, 0);
                formatStr = "'Sem' w";
            } else {
                // Last 10 months
                start = subMonths(end, 9);
                start = startOfMonth(start);
                intervals = eachMonthOfInterval({ start, end });
                formatStr = 'MMM';
            }

            const rangeMovements = movements.filter(m => {
                if (m.walletId !== activeWalletId) return false;
                const date = parseISO(m.date);
                return isWithinInterval(date, { start, end });
            });

            const chartData = intervals.map(date => {
                let label = format(date, formatStr, { locale: es });
                let value = 0;

                rangeMovements.forEach(m => {
                    const mDate = parseISO(m.date);
                    let isMatch = false;

                    if (barGranularity === 'day') isMatch = isSameDay(date, mDate);
                    else if (barGranularity === 'week') isMatch = isSameWeek(date, mDate, { weekStartsOn: 1 });
                    else isMatch = isSameMonth(date, mDate);

                    if (isMatch) {
                        let amount = m.amount;
                        if (m.currency !== currency) {
                            amount = m.currency === 'USD' ? amount * exchangeRate : amount / exchangeRate;
                        }

                        if (barMetric === 'expense' && m.type === 'expense') value += amount;
                        if (barMetric === 'income' && m.type === 'income') value += amount;
                        if (barMetric === 'balance') {
                            if (m.type === 'income') value += amount;
                            else value -= amount;
                        }
                    }
                });

                return { name: label, value };
            });

            // Calculate total for the metric
            let total = chartData.reduce((acc, curr) => acc + curr.value, 0);

            return { chartData, total, start, end }; // Return dates for display
        }

    }, [movements, currency, exchangeRate, filterType, selectedMonth, customRange, activeWalletId, chartType, barMetric, barGranularity, barEndDate]);

    // Pie Chart Navigation
    const handlePrevMonth = () => setSelectedMonth(prev => subMonths(prev, 1));
    const handleNextMonth = () => setSelectedMonth(prev => addMonths(prev, 1));

    // Bar Chart Navigation
    const handlePrevPeriod = () => {
        if (barGranularity === 'day') setBarEndDate(prev => subDays(prev, 1));
        else if (barGranularity === 'week') setBarEndDate(prev => subWeeks(prev, 1));
        else setBarEndDate(prev => subMonths(prev, 1));
    };

    const handleNextPeriod = () => {
        if (barGranularity === 'day') setBarEndDate(prev => addDays(prev, 1));
        else if (barGranularity === 'week') setBarEndDate(prev => addWeeks(prev, 1));
        else setBarEndDate(prev => addMonths(prev, 1));
    };

    return (
        <div className="container" style={{ paddingBottom: '80px' }}>
            <h2 style={{ marginBottom: '16px' }}>Estadísticas ({activeWallet?.name})</h2>

            {/* Chart Type Toggle */}
            <div className="flex gap-sm" style={{ marginBottom: '20px', background: 'var(--color-surface)', padding: '4px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                <button
                    onClick={() => setChartType('pie')}
                    style={{
                        flex: 1, padding: '8px', borderRadius: 'var(--radius-md)', border: 'none',
                        background: chartType === 'pie' ? 'var(--color-bg)' : 'transparent',
                        color: chartType === 'pie' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                        boxShadow: chartType === 'pie' ? 'var(--shadow-sm)' : 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 600
                    }}
                >
                    <PieChartIcon size={18} /> Categorías
                </button>
                <button
                    onClick={() => setChartType('bar')}
                    style={{
                        flex: 1, padding: '8px', borderRadius: 'var(--radius-md)', border: 'none',
                        background: chartType === 'bar' ? 'var(--color-bg)' : 'transparent',
                        color: chartType === 'bar' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                        boxShadow: chartType === 'bar' ? 'var(--shadow-sm)' : 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 600
                    }}
                >
                    <BarChart2 size={18} /> Tendencia
                </button>
            </div>

            {/* Controls Section */}
            <div style={{ background: 'var(--color-surface)', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '20px', border: '1px solid var(--color-border)' }}>

                {/* PIE CHART CONTROLS */}
                {chartType === 'pie' && (
                    <>
                        <div className="flex gap-sm" style={{ marginBottom: '12px' }}>
                            <button onClick={() => setFilterType('month')} className="btn-reset" style={{ flex: 1, padding: '8px', borderRadius: '4px', background: filterType === 'month' ? 'var(--color-primary)' : 'transparent', color: filterType === 'month' ? '#fff' : 'var(--color-text-secondary)', fontWeight: 600, border: filterType === 'month' ? 'none' : '1px solid var(--color-border)' }}>Mensual</button>
                            <button onClick={() => setFilterType('custom')} className="btn-reset" style={{ flex: 1, padding: '8px', borderRadius: '4px', background: filterType === 'custom' ? 'var(--color-primary)' : 'transparent', color: filterType === 'custom' ? '#fff' : 'var(--color-text-secondary)', fontWeight: 600, border: filterType === 'custom' ? 'none' : '1px solid var(--color-border)' }}>Personalizado</button>
                        </div>

                        {filterType === 'month' ? (
                            <div className="flex items-center justify-between" style={{ background: 'var(--color-bg)', padding: '8px', borderRadius: '8px' }}>
                                <button onClick={handlePrevMonth} className="btn-reset p-2"><ArrowLeft size={20} /></button>
                                <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>{format(selectedMonth, 'MMMM yyyy', { locale: es })}</div>
                                <button onClick={handleNextMonth} className="btn-reset p-2"><ArrowRight size={20} /></button>
                            </div>
                        ) : (
                            <div className="flex gap-sm">
                                <input type="date" value={customRange.start} onChange={(e) => setCustomRange(prev => ({ ...prev, start: e.target.value }))} style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text-primary)' }} />
                                <input type="date" value={customRange.end} onChange={(e) => setCustomRange(prev => ({ ...prev, end: e.target.value }))} style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text-primary)' }} />
                            </div>
                        )}
                    </>
                )}

                {/* BAR CHART CONTROLS */}
                {chartType === 'bar' && (
                    <>
                        <div className="flex gap-sm mb-2">
                            <select value={barMetric} onChange={(e) => setBarMetric(e.target.value)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text-primary)', flex: 1 }}>
                                <option value="expense">Gastos</option>
                                <option value="income">Ingresos</option>
                                <option value="balance">Balance</option>
                            </select>
                            <select value={barGranularity} onChange={(e) => setBarGranularity(e.target.value)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text-primary)', flex: 1 }}>
                                <option value="day">Día</option>
                                <option value="week">Semana</option>
                                <option value="month">Mes</option>
                            </select>
                        </div>

                        {/* Rolling Window Navigation */}
                        <div className="flex items-center justify-between" style={{ background: 'var(--color-bg)', padding: '8px', borderRadius: '8px', marginTop: '12px' }}>
                            <button onClick={handlePrevPeriod} className="btn-reset p-2"><ArrowLeft size={20} /></button>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                                {barGranularity === 'day' && 'Últimos 10 Días'}
                                {barGranularity === 'week' && 'Últimas 10 Semanas'}
                                {barGranularity === 'month' && 'Últimos 10 Meses'}
                                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', display: 'block', fontWeight: 400 }}>
                                    {filteredData.start && format(filteredData.start, 'dd/MM')} - {filteredData.end && format(filteredData.end, 'dd/MM')}
                                </span>
                            </div>
                            <button onClick={handleNextPeriod} className="btn-reset p-2"><ArrowRight size={20} /></button>
                        </div>
                    </>
                )}
            </div>

            {/* Total Summary */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                    {chartType === 'pie' ? 'Total Gastos' : (barMetric === 'expense' ? 'Total Gastos' : (barMetric === 'income' ? 'Total Ingresos' : 'Balance Total'))}
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    {formatCurrency(filteredData.total, currency)}
                </div>
            </div>

            {/* Chart Section */}
            <div style={{
                width: '100%', height: 300, background: 'var(--color-surface)',
                borderRadius: '16px', padding: '10px', marginBottom: '24px',
                boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)'
            }}>
                {filteredData.chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        {chartType === 'pie' ? (
                            <PieChart>
                                <Pie
                                    data={filteredData.chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {filteredData.chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(val) => formatCurrency(val, currency)} />
                                <Legend />
                            </PieChart>
                        ) : (
                            <BarChart data={filteredData.chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                                <XAxis dataKey="name" stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                                <Tooltip
                                    formatter={(val) => formatCurrency(val, currency)}
                                    contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px' }}
                                />
                                <Bar
                                    dataKey="value"
                                    fill={barMetric === 'expense' ? '#ef4444' : (barMetric === 'income' ? '#22c55e' : '#3b82f6')}
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full" style={{ color: 'var(--color-text-secondary)' }}>
                        Sin datos para este periodo
                    </div>
                )}
            </div>

            {/* Detailed List */}
            {chartType === 'pie' && (
                <>
                    <h3 style={{ marginBottom: '12px', fontSize: '1.1rem' }}>Detalle por Categoría</h3>
                    <div className="flex flex-col gap-sm">
                        {filteredData.chartData.map((item, index) => (
                            <div key={item.name} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '12px', background: 'var(--color-surface)',
                                borderRadius: '8px', borderLeft: `4px solid ${COLORS[index % COLORS.length]}`,
                                boxShadow: 'var(--shadow-sm)'
                            }}>
                                <div>
                                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                                        {item.percentage.toFixed(1)}%
                                    </div>
                                </div>
                                <div style={{ fontWeight: 700 }}>
                                    {formatCurrency(item.value, currency)}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
