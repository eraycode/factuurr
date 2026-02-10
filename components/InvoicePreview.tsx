"use client";

import { forwardRef } from "react";
import { Invoice, Quotation } from "@/types";
import { formatCurrency, calculateSubtotal, calculateVat, calculateTotal } from "@/lib/utils";

interface InvoicePreviewProps {
    data: Invoice | Quotation;
    isQuotation?: boolean;
}

const InvoicePreview = forwardRef<HTMLDivElement, InvoicePreviewProps>(({ data, isQuotation }, ref) => {
    const subtotal = calculateSubtotal(data.items);
    const vatTotals = calculateVat(data.items);
    const total = calculateTotal(data.items);

    return (
        <div
            ref={ref}
            className="invoice-preview"
            style={{
                padding: '3rem',
                minHeight: '1100px',
                width: '800px',
                maxWidth: '800px',
                margin: '0 auto',
                color: '#000',
                fontSize: '0.92rem',
                backgroundColor: '#ffffff',
                boxShadow: 'none',
                border: 'none'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem' }}>
                <div style={{ flex: 1 }}>
                    {data.sender.logoUrl ? (
                        <img
                            src={data.sender.logoUrl}
                            alt="Logo"
                            style={{ height: '120px', width: '240px', marginBottom: '1.5rem', objectFit: 'contain' }}
                        />
                    ) : (
                        <div style={{ height: '120px', width: '240px', marginBottom: '1.5rem' }} />
                    )}
                    <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                        {isQuotation ? 'OFFERTE' : 'FACTUUR'}
                    </h1>
                    <p style={{ fontWeight: 600 }}># {isQuotation ? (data as Quotation).quotationNumber : (data as Invoice).invoiceNumber}</p>
                    <p>Datum: {data.date}</p>
                    {isQuotation ? (
                        <p>Geldig tot: {(data as Quotation).validUntil}</p>
                    ) : (
                        <p>Vervaldatum: {(data as Invoice).dueDate}</p>
                    )}
                </div>
                <div style={{ textAlign: 'right', flex: 1 }}>
                    <h2 style={{ fontSize: '1.25rem', color: 'var(--foreground)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>{data.sender.name}</h2>
                    <p>{data.sender.address}</p>
                    <p>{data.sender.zip} {data.sender.city}</p>
                    <p>{data.sender.country}</p>
                    <p>{data.sender.vatNumber}</p>
                    <p>Email: {data.sender.email}</p>
                </div>
            </div>

            <div style={{ marginBottom: '3rem' }}>
                <h3 style={{ textTransform: 'uppercase', fontSize: '0.9rem', color: 'var(--secondary)', marginBottom: '0.5rem' }}>Factureren aan:</h3>
                <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>{data.client.name}</p>
                <p>{data.client.address}</p>
                <p>{data.client.zip} {data.client.city}</p>
                <p>{data.client.country}</p>
                {data.client.vatNumber && <p>BTW: {data.client.vatNumber}</p>}
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '3rem' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                        <th style={{ padding: '0.75rem 0' }}>Beschrijving</th>
                        <th style={{ padding: '0.75rem 0', textAlign: 'center' }}>Aantal</th>
                        <th style={{ padding: '0.75rem 0', textAlign: 'right' }}>Stukprijs</th>
                        <th style={{ padding: '0.75rem 0', textAlign: 'center' }}>BTW</th>
                        <th style={{ padding: '0.75rem 0', textAlign: 'right' }}>Totaal</th>
                    </tr>
                </thead>
                <tbody>
                    {data.items.map((item) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={{ padding: '1rem 0' }}>
                                <div style={{ fontWeight: 600 }}>{item.name || 'Geen naam'}</div>
                                {item.description && <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>{item.description}</div>}
                            </td>
                            <td style={{ padding: '1rem 0', textAlign: 'center' }}>{item.quantity}</td>
                            <td style={{ padding: '1rem 0', textAlign: 'right' }}>{formatCurrency(item.unitPrice)}</td>
                            <td style={{ padding: '1rem 0', textAlign: 'center' }}>{item.vatRate}%</td>
                            <td style={{ padding: '1rem 0', textAlign: 'right' }}>{formatCurrency(item.quantity * item.unitPrice)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '3rem' }}>
                <div style={{ width: '250px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span>Subtotaal:</span>
                        <span>{formatCurrency(subtotal)}</span>
                    </div>
                    {Object.entries(vatTotals).map(([rate, amount]) => (
                        <div key={rate} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--secondary)' }}>
                            <span>BTW ({rate}%):</span>
                            <span>{formatCurrency(amount)}</span>
                        </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid var(--primary)', fontWeight: 700, fontSize: '1.2rem' }}>
                        <span>Totaal:</span>
                        <span>{formatCurrency(total)}</span>
                    </div>
                </div>
            </div>

            {data.isVatExempt && (
                <div style={{ marginBottom: '2rem', fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--secondary)' }}>
                    Bijzondere vrijstellingsregeling kleine ondernemingen - Vrijgesteld van btw.
                </div>
            )}

            {(data.notes || (!isQuotation && (data.paymentConditions || (data as Invoice).bankAccount))) && (
                <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--border)', fontSize: '0.85rem' }}>
                    {data.notes && <p style={{ marginBottom: '0.5rem' }}><strong>Opmerkingen:</strong> {data.notes}</p>}
                    {!isQuotation && data.paymentConditions && (
                        <p style={{ marginBottom: '0.5rem' }}><strong>Betalingsvoorwaarden:</strong> {data.paymentConditions}</p>
                    )}
                    {!isQuotation && (
                        <div style={{ marginTop: '1rem', color: 'var(--secondary)' }}>
                            <p>Betaalinstructies: Gelieve het totaalbedrag over te maken naar <strong>{(data as Invoice).bankAccount || 'BE XX XXXX XXXX XXXX'}</strong></p>
                            {(data as Invoice).bic && <p>BIC: {(data as Invoice).bic}</p>}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
});

InvoicePreview.displayName = "InvoicePreview";

export default InvoicePreview;
