import React from 'react';
import { formatCurrency } from '../utils/format';

export default function SummaryCard({ title, income, expense, currency }) {
    const balance = income - expense;

    return (
        <div style={{
            background: 'linear-gradient(135deg, #0095f6 0%, #005c9e 100%)',
            color: '#fff',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            marginBottom: '20px',
            boxShadow: 'var(--shadow-md)',
            flexShrink: 0,
            width: '100%',
            scrollSnapAlign: 'start'
        }}>
            <h3 style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '8px' }}>{title}</h3>
            <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '16px' }}>
                {formatCurrency(balance, currency)}
            </div>

            <div className="flex justify-between">
                <div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Ingresos</div>
                    <div style={{ fontWeight: 600 }}>{formatCurrency(income, currency)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Gastos</div>
                    <div style={{ fontWeight: 600 }}>{formatCurrency(expense, currency)}</div>
                </div>
            </div>
        </div>
    );
}
