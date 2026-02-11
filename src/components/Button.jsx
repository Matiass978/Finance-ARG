import React, { useState } from 'react';

export default function Button({ children, variant = 'primary', style, ...props }) {
    const [hover, setHover] = useState(false);

    // Dynamic styles based on variant and hover state
    const isPrimary = variant === 'primary';
    const isOutline = variant === 'outline';

    const baseStyle = {
        padding: '14px 20px',
        borderRadius: 'var(--radius-lg)',
        fontSize: 'var(--font-size-md)',
        fontWeight: 600,
        cursor: 'pointer',
        width: '100%',
        textAlign: 'center',
        transition: 'all 0.2s',
        border: isOutline ? '1px solid var(--color-border)' : 'none',
        background: isPrimary
            ? (hover ? 'var(--color-primary-dark)' : 'var(--color-primary)')
            : (hover ? 'var(--color-surface)' : 'transparent'),
        color: isPrimary ? '#fff' : 'var(--color-primary)',
        ...style
    };

    return (
        <button
            style={baseStyle}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            {...props}
        >
            {children}
        </button>
    );
}
