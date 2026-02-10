export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('nl-BE', {
        style: 'currency',
        currency: 'EUR',
    }).format(amount);
};

export const calculateSubtotal = (items: { quantity: number; unitPrice: number }[]): number => {
    return items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
};

export const calculateVat = (items: { quantity: number; unitPrice: number; vatRate: number }[]): { [rate: number]: number } => {
    return items.reduce((acc, item) => {
        const vat = (item.quantity * item.unitPrice * item.vatRate) / 100;
        acc[item.vatRate] = (acc[item.vatRate] || 0) + vat;
        return acc;
    }, {} as { [rate: number]: number });
};

export const calculateTotal = (items: { quantity: number; unitPrice: number; vatRate: number }[]): number => {
    const subtotal = calculateSubtotal(items);
    const vatTotals = calculateVat(items);
    const vatSum = Object.values(vatTotals).reduce((a, b) => a + b, 0);
    return subtotal + vatSum;
};

export const generateId = () => Math.random().toString(36).substr(2, 9);
