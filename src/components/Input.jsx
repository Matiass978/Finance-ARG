import React from 'react';

export default function Input({ label, type = 'text', ...props }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
            {label && <label className="text-secondary text-sm" style={{ fontWeight: 500 }}>{label}</label>}
            <input
                type={type}
                className="input-field"
                style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-surface)',
                    color: 'var(--color-text-primary)',
                    fontSize: 'var(--font-size-md)',
                    outline: 'none',
                    width: '100%',
                    transition: 'border-color 0.2s, background-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                {...props}
            />
        </div>
    );
}
