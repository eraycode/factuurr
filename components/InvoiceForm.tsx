"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Download, FileText, Briefcase, Settings, Upload, Moon, Sun } from "lucide-react";
import { Invoice, Quotation, LineItem } from "@/types";
import { generateId } from "@/lib/utils";
import ItemRow from "./ItemRow";
import InvoicePreview from "./InvoicePreview";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const getInitialDates = () => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const dueDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const validUntil = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    return { date, dueDate, validUntil };
};

export default function InvoiceForm() {
    const [isQuotation, setIsQuotation] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const previewRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Check system preference on mount
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.setAttribute('data-theme', savedTheme);
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme('dark');
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const [invoice, setInvoice] = useState<Invoice>(() => {
        const { date, dueDate } = getInitialDates();
        return {
            id: generateId(),
            invoiceNumber: "2024-001",
            date,
            dueDate,
            sender: {
                name: "UW BEDRIJFSNAAM",
                address: "Adresregel 1",
                zip: "1000",
                city: "Brussel",
                country: "België",
                vatNumber: "BE ",
                email: "info@bedrijf.be",
            },
            client: {
                name: "",
                address: "",
                zip: "",
                city: "",
                country: "België",
            },
            items: [
                { id: generateId(), name: "Dienstverlening", description: "Omschrijving van de uitgevoerde werken", quantity: 1, unitPrice: 0, vatRate: 21 },
            ],
            isVatExempt: false,
            notes: "",
            paymentConditions: "Binnen 14 dagen na factuurdatum.",
            bankAccount: "BE XX XXXX XXXX XXXX",
            bic: "",
        };
    });

    const [quotation, setQuotation] = useState<Quotation>(() => {
        const { date, validUntil } = getInitialDates();
        return {
            id: generateId(),
            quotationNumber: "OFF-2024-001",
            date,
            validUntil,
            sender: {
                name: "UW BEDRIJFSNAAM",
                address: "Adresregel 1",
                zip: "1000",
                city: "Brussel",
                country: "België",
                vatNumber: "BE ",
                email: "info@bedrijf.be",
            },
            client: {
                name: "",
                address: "",
                zip: "",
                city: "",
                country: "België",
            },
            items: [
                { id: generateId(), name: "Dienstverlening", description: "Omschrijving van de uitgevoerde werken", quantity: 1, unitPrice: 0, vatRate: 21 },
            ],
            isVatExempt: false,
            notes: "Deze offerte is 30 dagen geldig.",
        };
    });

    const currentData = isQuotation ? quotation : invoice;

    const handleToggleType = (nextIsQuotation: boolean) => {
        if (nextIsQuotation === isQuotation) return;

        if (nextIsQuotation) {
            setQuotation(prev => ({
                ...prev,
                sender: { ...prev.sender, ...invoice.sender },
                client: { ...prev.client, ...invoice.client },
                items: invoice.items.map(item => ({ ...item })),
                isVatExempt: invoice.isVatExempt,
                notes: invoice.notes ?? prev.notes,
                date: invoice.date,
            }));
        } else {
            setInvoice(prev => ({
                ...prev,
                sender: { ...prev.sender, ...quotation.sender },
                client: { ...prev.client, ...quotation.client },
                items: quotation.items.map(item => ({ ...item })),
                isVatExempt: quotation.isVatExempt,
                notes: quotation.notes ?? prev.notes,
                date: quotation.date,
            }));
        }

        setIsQuotation(nextIsQuotation);
    };

    const addItem = () => {
        const newItem = { id: generateId(), name: "", description: "", quantity: 1, unitPrice: 0, vatRate: currentData.isVatExempt ? 0 : 21 };
        if (isQuotation) {
            setQuotation(prev => ({
                ...prev,
                items: [...prev.items, newItem]
            }));
        } else {
            setInvoice(prev => ({
                ...prev,
                items: [...prev.items, newItem]
            }));
        }
    };

    const toggleVatExemption = (enabled: boolean) => {
        if (isQuotation) {
            setQuotation(prev => ({
                ...prev,
                isVatExempt: enabled,
                items: enabled ? prev.items.map(item => ({ ...item, vatRate: 0 })) : prev.items
            }));
        } else {
            setInvoice(prev => ({
                ...prev,
                isVatExempt: enabled,
                items: enabled ? prev.items.map(item => ({ ...item, vatRate: 0 })) : prev.items
            }));
        }
    };

    const updateItem = (id: string, updates: Partial<LineItem>) => {
        if (isQuotation) {
            setQuotation(prev => ({
                ...prev,
                items: prev.items.map(item => item.id === id ? { ...item, ...updates } : item)
            }));
        } else {
            setInvoice(prev => ({
                ...prev,
                items: prev.items.map(item => item.id === id ? { ...item, ...updates } : item)
            }));
        }
    };

    const removeItem = (id: string) => {
        if (currentData.items.length > 1) {
            if (isQuotation) {
                setQuotation(prev => ({
                    ...prev,
                    items: prev.items.filter(item => item.id !== id)
                }));
            } else {
                setInvoice(prev => ({
                    ...prev,
                    items: prev.items.filter(item => item.id !== id)
                }));
            }
        }
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const url = reader.result as string;
                if (isQuotation) setQuotation(prev => ({ ...prev, sender: { ...prev.sender, logoUrl: url } }));
                else setInvoice(prev => ({ ...prev, sender: { ...prev.sender, logoUrl: url } }));
            };
            reader.readAsDataURL(file);
        }
    };

    const sanitizeFilename = (name: string) => name.replace(/[^a-z0-9]/gi, '_').toLowerCase();

    const handleDownloadPDF = async () => {
        if (!previewRef.current) return;

        const canvas = await html2canvas(previewRef.current, {
            scale: 3,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        const baseName = isQuotation ? 'Offerte' : 'Factuur';
        const number = isQuotation ? quotation.quotationNumber : invoice.invoiceNumber;
        const filename = `${sanitizeFilename(baseName)}_${sanitizeFilename(number)}.pdf`;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(filename);
    };

    const exportSettings = () => {
        const settings = currentData.sender;
        const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `factuurr_instellingen_${sanitizeFilename(settings.name || 'bedrijf')}.json`;
        a.click();
    };

    const importSettings = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const settings = JSON.parse(event.target?.result as string);
                    if (isQuotation) setQuotation(prev => ({ ...prev, sender: settings }));
                    else setInvoice(prev => ({ ...prev, sender: settings }));
                } catch (err) {
                    alert("Ongeldig instellingenbestand.");
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="container">
            <div className="main-grid">
                <div className="form-section card glass">
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '1rem', flex: 1 }}>
                            <button
                                className={`premium-btn ${!isQuotation ? '' : 'inactive'}`}
                                onClick={() => handleToggleType(false)}
                                style={{ flex: 1 }}
                            >
                                <FileText size={18} /> Factuur
                            </button>
                            <button
                                className={`premium-btn ${isQuotation ? '' : 'inactive'}`}
                                onClick={() => handleToggleType(true)}
                                style={{ flex: 1 }}
                            >
                                <Briefcase size={18} /> Offerte
                            </button>
                        </div>
                        <button
                            className="premium-btn"
                            onClick={toggleTheme}
                            style={{
                                padding: '0.75rem',
                                background: 'var(--card-bg)',
                                border: '1px solid var(--border)',
                                color: 'var(--foreground) !important'
                            }}
                        >
                            {theme === 'light' ? <Moon size={20} color="var(--foreground)" /> : <Sun size={20} color="var(--foreground)" />}
                        </button>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0 }}>Mijn Bedrijfsgegevens</h3>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <button className="premium-btn" onClick={exportSettings} style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', background: 'var(--secondary)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }} title="Instellingen exporteren">
                                    <Download size={14} /> <span>Export</span>
                                </button>
                                <label className="premium-btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', background: 'var(--secondary)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }} title="Instellingen importeren">
                                    <Upload size={14} /> <span>Import</span>
                                    <input type="file" accept=".json" onChange={importSettings} style={{ display: 'none' }} />
                                </label>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', border: '2px dashed var(--border)', borderRadius: 'var(--radius)' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}>Logo Uploaden</label>
                                    <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ width: '100%', fontSize: '0.8rem', padding: '0.5rem' }} />
                                </div>
                                {currentData.sender.logoUrl && (
                                    <img src={currentData.sender.logoUrl} alt="Logo" style={{ height: '50px', maxWidth: '100px', objectFit: 'contain' }} />
                                )}
                            </div>
                            <div>
                                <label>Bedrijfsnaam</label>
                                <input
                                    placeholder="Mijn Bedrijf NV"
                                    value={currentData.sender.name}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (isQuotation) setQuotation(p => ({ ...p, sender: { ...p.sender, name: val } }));
                                        else setInvoice(p => ({ ...p, sender: { ...p.sender, name: val } }));
                                    }}
                                />
                            </div>
                            <div>
                                <label>Adresregel 1</label>
                                <input
                                    placeholder="Straatnaam 1"
                                    value={currentData.sender.address}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (isQuotation) setQuotation(p => ({ ...p, sender: { ...p.sender, address: val } }));
                                        else setInvoice(p => ({ ...p, sender: { ...p.sender, address: val } }));
                                    }}
                                />
                            </div>
                            <div className="mobile-grid-1-tablet-2" style={{ display: 'grid', gap: '1.5rem' }}>
                                <div>
                                    <label>Postcode</label>
                                    <input
                                        placeholder="1000"
                                        value={currentData.sender.zip}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (isQuotation) setQuotation(p => ({ ...p, sender: { ...p.sender, zip: val } }));
                                            else setInvoice(p => ({ ...p, sender: { ...p.sender, zip: val } }));
                                        }}
                                    />
                                </div>
                                <div>
                                    <label>Stad</label>
                                    <input
                                        placeholder="Brussel"
                                        value={currentData.sender.city}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (isQuotation) setQuotation(p => ({ ...p, sender: { ...p.sender, city: val } }));
                                            else setInvoice(p => ({ ...p, sender: { ...p.sender, city: val } }));
                                        }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label>E-mail Adres</label>
                                <input
                                    placeholder="info@mijnbedrijf.be"
                                    value={currentData.sender.email}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (isQuotation) setQuotation(p => ({ ...p, sender: { ...p.sender, email: val } }));
                                        else setInvoice(p => ({ ...p, sender: { ...p.sender, email: val } }));
                                    }}
                                />
                            </div>
                            <div>
                                <label>BTW-nummer</label>
                                <input
                                    placeholder="BE 0123.456.789"
                                    value={currentData.sender.vatNumber}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (isQuotation) setQuotation(p => ({ ...p, sender: { ...p.sender, vatNumber: val } }));
                                        else setInvoice(p => ({ ...p, sender: { ...p.sender, vatNumber: val } }));
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Algemene Informatie</h3>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div>
                                <label>Nummer</label>
                                <input
                                    className="invoice-number-input"
                                    value={isQuotation ? quotation.quotationNumber : invoice.invoiceNumber}
                                    onChange={(e) => isQuotation ? setQuotation({ ...quotation, quotationNumber: e.target.value }) : setInvoice({ ...invoice, invoiceNumber: e.target.value })}
                                    style={{ width: '100%' }}
                                />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'rgba(37, 99, 235, 0.05)', borderRadius: 'var(--radius)', border: '1px solid rgba(37, 99, 235, 0.1)' }}>
                                <input
                                    type="checkbox"
                                    id="vatExempt"
                                    checked={currentData.isVatExempt}
                                    onChange={(e) => toggleVatExemption(e.target.checked)}
                                    style={{ width: 'auto', cursor: 'pointer' }}
                                />
                                <label htmlFor="vatExempt" style={{ margin: 0, cursor: 'pointer', color: 'var(--primary)' }}>
                                    Kleine onderneming (vrijgesteld van BTW)
                                </label>
                            </div>
                            <div className="date-grid" style={{ display: 'grid', gap: '1rem' }}>
                                <div className="label-group">
                                    <label>Datum</label>
                                    <input
                                        type="date"
                                        value={currentData.date}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (isQuotation) setQuotation(p => ({ ...p, date: val }));
                                            else setInvoice(p => ({ ...p, date: val }));
                                        }}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                <div className="label-group">
                                    <label className="label-wrap">{isQuotation ? 'Geldig tot' : <>Verval<wbr />datum</>}</label>
                                    <input
                                        type="date"
                                        value={isQuotation ? quotation.validUntil : invoice.dueDate}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (isQuotation) setQuotation(p => ({ ...p, validUntil: val }));
                                            else setInvoice(p => ({ ...p, dueDate: val }));
                                        }}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Klantgegevens</h3>
                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            <div>
                                <label>Klantnaam / Bedrijfsnaam</label>
                                <input
                                    placeholder="Naam van de klant"
                                    value={currentData.client.name}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (isQuotation) setQuotation(p => ({ ...p, client: { ...p.client, name: val } }));
                                        else setInvoice(p => ({ ...p, client: { ...p.client, name: val } }));
                                    }}
                                />
                            </div>
                            <div>
                                <label>Adres</label>
                                <input
                                    placeholder="Straatnaam 123"
                                    value={currentData.client.address}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (isQuotation) setQuotation(p => ({ ...p, client: { ...p.client, address: val } }));
                                        else setInvoice(p => ({ ...p, client: { ...p.client, address: val } }));
                                    }}
                                />
                            </div>
                            <div className="mobile-grid-1-tablet-2" style={{ display: 'grid', gap: '1.5rem' }}>
                                <div>
                                    <label>Postcode</label>
                                    <input
                                        placeholder="1000"
                                        value={currentData.client.zip}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (isQuotation) setQuotation(p => ({ ...p, client: { ...p.client, zip: val } }));
                                            else setInvoice(p => ({ ...p, client: { ...p.client, zip: val } }));
                                        }}
                                    />
                                </div>
                                <div>
                                    <label>Stad</label>
                                    <input
                                        placeholder="Brussel"
                                        value={currentData.client.city}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (isQuotation) setQuotation(p => ({ ...p, client: { ...p.client, city: val } }));
                                            else setInvoice(p => ({ ...p, client: { ...p.client, city: val } }));
                                        }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label>BTW-nummer Klant (optioneel)</label>
                                <input
                                    placeholder="BE 0XXX.XXX.XXX"
                                    value={currentData.client.vatNumber || ''}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (isQuotation) setQuotation(p => ({ ...p, client: { ...p.client, vatNumber: val } }));
                                        else setInvoice(p => ({ ...p, client: { ...p.client, vatNumber: val } }));
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3>Items</h3>
                            <button className="premium-btn" onClick={addItem} style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
                                <Plus size={16} /> Item Toevoegen
                            </button>
                        </div>
                        {currentData.items.map((item) => (
                            <ItemRow key={item.id} item={item} onUpdate={updateItem} onRemove={removeItem} isVatExempt={currentData.isVatExempt} />
                        ))}
                    </div>

                    {!isQuotation && (
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '1rem' }}>Betaalgegevens</h3>
                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                                <div>
                                    <label>IBAN Nummer</label>
                                    <input
                                        placeholder="BE XX XXXX XXXX XXXX"
                                        value={invoice.bankAccount}
                                        onChange={(e) => setInvoice({ ...invoice, bankAccount: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label>BIC Code (optioneel)</label>
                                    <input
                                        placeholder="XXXXXXXX"
                                        value={invoice.bic || ''}
                                        onChange={(e) => setInvoice({ ...invoice, bic: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '3rem' }}>
                        <button className="premium-btn" onClick={handleDownloadPDF} style={{ flex: 1, padding: '1rem' }}>
                            <Download size={20} /> Download PDF
                        </button>
                    </div>
                </div>

                <div className="preview-section card glass" style={{ position: 'sticky', top: '2rem', height: 'fit-content', padding: '1rem', overflow: 'auto' }}>
                    <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ color: 'var(--muted)', fontSize: 'clamp(1rem, 4vw, 1.25rem)' }}>Live Voorbeeld</h3>
                    </div>
                    <div className="preview-wrapper">
                        <div style={{ borderRadius: '4px', overflow: 'hidden', boxShadow: '0 0 20px rgba(0,0,0,0.1)' }}>
                            <InvoicePreview ref={previewRef} data={currentData} isQuotation={isQuotation} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
