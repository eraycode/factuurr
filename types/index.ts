export interface Client {
  name: string;
  address: string;
  zip: string;
  city: string;
  country: string;
  vatNumber?: string;
  email?: string;
}

export interface LineItem {
  id: string;
  name?: string; // Optionele naam/titel
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number; // e.g. 21, 12, 6, 0
}

export interface Sender {
  name: string;
  address: string;
  zip: string;
  city: string;
  country: string;
  vatNumber: string;
  email: string;
  logoUrl?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  sender: Sender;
  client: Client;
  items: LineItem[];
  isVatExempt: boolean;
  notes?: string;
  paymentConditions?: string;
  bankAccount?: string;
  bic?: string;
}

export interface Quotation extends Omit<Invoice, 'invoiceNumber' | 'dueDate'> {
  quotationNumber: string;
  validUntil: string;
}
