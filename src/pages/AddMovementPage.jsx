import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMovementStore } from '../store/useMovementStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { useWalletStore } from '../store/useWalletStore';
import { useEffect } from 'react';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';
import { ArrowLeft } from 'lucide-react';

export default function AddMovementPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('edit');

    const { addMovement, updateMovement, movements } = useMovementStore();
    const { exchangeRate } = useCurrencyStore();
    const { wallets, activeWalletId } = useWalletStore();

    const [type, setType] = useState('expense'); // expense | income
    const [selectedWalletId, setSelectedWalletId] = useState(activeWalletId);

    const [formData, setFormData] = useState({
        amount: '',
        description: '',
        category: 'Varios',
        date: new Date().toISOString().split('T')[0],
        currency: 'ARS',
        paymentMethod: 'Efectivo'
    });

    useEffect(() => {
        if (editId) {
            const movementToEdit = movements.find(m => m.id === editId);
            if (movementToEdit) {
                setType(movementToEdit.type);
                setSelectedWalletId(movementToEdit.walletId || activeWalletId);
                setFormData({
                    amount: movementToEdit.amount,
                    description: movementToEdit.description,
                    category: movementToEdit.category,
                    date: movementToEdit.date,
                    currency: movementToEdit.currency,
                    paymentMethod: movementToEdit.paymentMethod || 'Efectivo'
                });
            }
        }
    }, [editId, movements, activeWalletId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const amount = parseFloat(formData.amount);
        if (!amount || isNaN(amount) || amount <= 0) {
            alert("Por favor ingresa un monto válido (mayor a 0)");
            return;
        }

        const movementData = {
            ...formData,
            amount: parseFloat(formData.amount),
            type,
            walletId: selectedWalletId,
            originalRate: formData.currency === 'USD' ? exchangeRate : 1
        };

        if (editId) {
            updateMovement(editId, movementData);
        } else {
            addMovement(movementData);
        }
        navigate('/');
    };

    return (
        <div className="container" style={{ paddingTop: '10px' }}>
            <div className="flex items-center gap-md" style={{ marginBottom: '24px' }}>
                <button onClick={() => navigate(-1)} className="btn-reset" style={{ color: 'var(--color-text-primary)' }}>
                    <ArrowLeft size={24} />
                </button>
                <h2 style={{ fontSize: '1.2rem' }}>{editId ? 'Editar Movimiento' : 'Nuevo Movimiento'}</h2>
            </div>

            <div className="flex" style={{ background: 'var(--color-surface)', padding: '4px', borderRadius: 'var(--radius-md)', marginBottom: '24px', border: '1px solid var(--color-border)' }}>
                <button
                    onClick={() => setType('expense')}
                    style={{ flex: 1, padding: '10px', borderRadius: 'calc(var(--radius-md) - 4px)', border: 'none', background: type === 'expense' ? 'var(--color-bg)' : 'transparent', fontWeight: 600, color: type === 'expense' ? 'var(--color-expense)' : 'var(--color-text-secondary)', boxShadow: type === 'expense' ? 'var(--shadow-sm)' : 'none', transition: 'all 0.2s' }}>
                    Gasto
                </button>
                <button
                    onClick={() => setType('income')}
                    style={{ flex: 1, padding: '10px', borderRadius: 'calc(var(--radius-md) - 4px)', border: 'none', background: type === 'income' ? 'var(--color-bg)' : 'transparent', fontWeight: 600, color: type === 'income' ? 'var(--color-success)' : 'var(--color-text-secondary)', boxShadow: type === 'income' ? 'var(--shadow-sm)' : 'none', transition: 'all 0.2s' }}>
                    Ingreso
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '16px' }}>
                    <Select
                        label="Billetera"
                        options={wallets.map(w => ({ value: w.id, label: w.name }))}
                        value={selectedWalletId}
                        onChange={e => setSelectedWalletId(e.target.value)}
                    />
                </div>

                <div className="flex gap-sm">
                    <div style={{ flex: 1 }}>
                        <Input
                            label="Monto"
                            type="number" // Ensures numeric keyboard on mobile
                            step="0.01"
                            placeholder="0.00"
                            required
                            inputMode="decimal" // Better mobile keyboard
                            value={formData.amount}
                            onChange={e => setFormData({ ...formData, amount: e.target.value })}
                        />
                    </div>
                    <div style={{ width: '100px' }}>
                        <Select
                            label="Moneda"
                            options={[{ value: 'ARS', label: 'ARS' }, { value: 'USD', label: 'USD' }]}
                            value={formData.currency}
                            onChange={e => setFormData({ ...formData, currency: e.target.value })}
                        />
                    </div>
                </div>

                <Input
                    label="Descripción"
                    placeholder="¿En qué gastaste?"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                />

                <Select
                    label="Categoría"
                    options={[
                        { value: 'Comida', label: 'Comida / Supermercado' },
                        { value: 'Transporte', label: 'Transporte / Combustible' },
                        { value: 'Servicios', label: 'Servicios (Luz, Gas, Internet)' },
                        { value: 'Ocio', label: 'Ocio / Salidas' },
                        { value: 'Salud', label: 'Salud / Farmacia' },
                        { value: 'Educación', label: 'Educación' },
                        { value: 'Ropa', label: 'Ropa / Indumentaria' },
                        { value: 'Hogar', label: 'Hogar / Mantenimiento' },
                        { value: 'Ingresos', label: 'Sueldo / Ingresos' },
                        { value: 'Varios', label: 'Varios' },
                    ]}
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                />

                <div className="flex gap-sm">
                    <div style={{ flex: 1 }}>
                        <Input
                            label="Fecha"
                            type="date"
                            value={formData.date}
                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <Select
                            label="Pago"
                            options={[
                                { value: 'Efectivo', label: 'Efectivo' },
                                { value: 'Debito', label: 'Débito' },
                                { value: 'Credito', label: 'Crédito' },
                                { value: 'MercadoPago', label: 'MercadoPago' },
                                { value: 'Transferencia', label: 'Transferencia' },
                            ]}
                            value={formData.paymentMethod}
                            onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                        />
                    </div>
                </div>

                <Button type="submit" style={{ marginTop: '24px' }}>
                    {editId ? 'Actualizar' : 'Guardar'} Movimiento
                </Button>
            </form>
        </div>
    );
}
