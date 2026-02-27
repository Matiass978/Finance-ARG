import React from 'react';
import { formatCurrency } from '../utils/format';

export default function SummaryCard({ title, income, expense, currency }) {
    const balance = income - expense;

    return (
        <div style={{
            background: 'linear-gradient(135deg, #0095f6 0%, #005c9e 100%)',
            color: '#fff',
            borderRadius: 'var(--radius-lg)',
            padding: '16px',
            boxShadow: 'var(--shadow-md)',
            width: '100%',
            overflow: 'hidden'
        }}>
            <h3 style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '8px' }}>{title}</h3>
            <div style={{
                fontSize: 'clamp(1.2rem, 5vw, 1.8rem)',
                fontWeight: 700,
                marginBottom: '16px',
                wordBreak: 'break-word',
                lineHeight: 1.2
            }}>
                {formatCurrency(balance, currency)}
            </div>

            <div className="flex justify-between" style={{ gap: '8px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Ingresos</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', wordBreak: 'break-word', lineHeight: 1.2 }}>
                        {formatCurrency(income, currency)}
                    </div>
                </div>
                <div style={{ flex: 1, minWidth: 0, textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Gastos</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', wordBreak: 'break-word', lineHeight: 1.2 }}>
                        {formatCurrency(expense, currency)}
                    </div>
                </div>
            </div>
        </div>
    );
}
