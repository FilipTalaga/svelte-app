import { DateTime } from 'luxon';
import { derived } from 'svelte/store';
import type { Invoice, InvoiceDocument, LegalEntity, TemplateDocument } from '../types/invoice';
import { getDoc, getCollection, addToCollection } from '../utils/store';

export const templates = derived(
    getDoc<TemplateDocument>('templates/:user'),
    $val => $val?.templates || []
);

export const company = getDoc<LegalEntity>('companies/:user');

export const invoices = derived(
    getCollection<InvoiceDocument>('invoices/:user/documents', query =>
        query.where('year', '==', DateTime.now().year).where('month', '==', DateTime.now().month)
    ),
    $val => $val || []
);

export const createInvoice = (data: Invoice) =>
    addToCollection<Invoice>('invoices/:user/documents')(
        `${data.year}-${data.month.toDigits()}-${data.invoiceNumber.toDigits()}`,
        data
    );
