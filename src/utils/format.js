import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatCurrency = (amount, currency = 'ARS') => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2
    }).format(amount);
};

export const formatDate = (dateString, fmt = 'dd MMM yyyy') => {
    if (!dateString) return '';
    return format(parseISO(dateString), fmt, { locale: es });
};

export const groupMovementsByDate = (movements) => {
    const groups = {};
    movements.forEach(m => {
        const date = m.date; // YYYY-MM-DD
        if (!groups[date]) groups[date] = [];
        groups[date].push(m);
    });
    // Sort dates desc
    return Object.keys(groups).sort((a, b) => b.localeCompare(a)).map(date => ({
        date,
        items: groups[date]
    }));
};
