import React from 'react';
import { formatCurrency } from '../utils/format';

export default function SummaryCard({ title, income, expense, currency }) {
    const balance = income - expense;

    return (
        <div style={{
            background: 'linear-gradient(135deg, #0095f6 0%, #005c9e 100%)',
            color: '#fff',
            borderRadius: 'var(--radius-lg)',
            padding: '12px',
            boxShadow: 'var(--shadow-md)',
            width: '100%',
            minWidth: 0,
            overflow: 'hidden'
        }}>
            <h3 style={{ fontSize: 'clamp(0.75rem, 3vw, 0.9rem)', opacity: 0.9, marginBottom: '6px' }}>{title}</h3>
            <div style={{
                fontSize: 'clamp(0.95rem, 4vw, 1.4rem)',
                fontWeight: 700,
                marginBottom: '12px',
                wordBreak: 'break-all',
                lineHeight: 1.1
            }}>
                {formatCurrency(balance, currency)}
            </div>

            <div className="flex justify-between" style={{ gap: '4px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 'clamp(0.65rem, 2.5vw, 0.8rem)', opacity: 0.8 }}>Ingresos</div>
                    <div style={{ fontWeight: 600, fontSize: 'clamp(0.75rem, 3.5vw, 0.9rem)', wordBreak: 'break-all', lineHeight: 1.1 }}>
                        {formatCurrency(income, currency)}
                    </div>
                </div>
                <div style={{ flex: 1, minWidth: 0, textAlign: 'right' }}>
                    <div style={{ fontSize: 'clamp(0.65rem, 2.5vw, 0.8rem)', opacity: 0.8 }}>Gastos</div>
                    <div style={{ fontWeight: 600, fontSize: 'clamp(0.75rem, 3.5vw, 0.9rem)', wordBreak: 'break-all', lineHeight: 1.1 }}>
                        {formatCurrency(expense, currency)}
                    </div>
                </div>
            </div>
        </div>
    );
}
