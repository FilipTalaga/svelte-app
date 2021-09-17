<script lang="ts">
    import { logout } from '../stores/auth';
    import AsyncButton from '../components/ui/AsyncButton.svelte';
    import { templates, company, invoices, createInvoice } from '../stores/data';
    import type { EntryInvoiceData, InvoiceDocument, LegalEntity } from '../types/invoice';
    import { from, Observable, of } from 'rxjs';
    import { map } from 'rxjs/operators';
    import { getCurrencyRate } from '../stores/external';
    import { calculateInvoiceData } from '../utils/invoice-calculator';
    import { createPdf } from 'pdfmake/build/pdfmake';
    import { makeDesignDoc, tableLayouts } from '../utils/document-maker';
    import Button from '../components/ui/Button.svelte';

    const prepareEntryInvoiceData =
        (template: EntryInvoiceData, seller: LegalEntity, documents: InvoiceDocument[]) =>
        (): Observable<EntryInvoiceData> => {
            const dateOfIssue = new Date();
            const lastInvoiceNumber = documents.length
                ? Math.max(...documents.map(item => item.invoiceNumber))
                : 0;

            const invoiceData = {
                ...template,
                seller,
                invoiceNumber: lastInvoiceNumber + 1,
                dateOfIssue,
            };

            if (template.currency === 'PLN') {
                return of(invoiceData);
            }

            return from(getCurrencyRate(template.currency, dateOfIssue)).pipe(
                map(exchangeRate => ({
                    ...invoiceData,
                    exchangeRate,
                }))
            );
        };

    const generatePdf = ({ detail: entryInvoiceData }: CustomEvent<EntryInvoiceData>) => {
        const invoice = calculateInvoiceData(entryInvoiceData);

        createInvoice(invoice).subscribe();
    };

    const downloadPdf = (invoice: InvoiceDocument) => () => {
        const designDoc = makeDesignDoc(invoice);
        const fileName = `faktura-vat-${invoice.invoiceNumber.toDigits()}-${invoice.month.toDigits()}-${
            invoice.year
        }.pdf`;

        createPdf(designDoc, tableLayouts).download(fileName);
    };
</script>

<div>Dashboard</div>
{#each $templates as template}
    <AsyncButton
        job={prepareEntryInvoiceData(template, $company, $invoices)}
        on:success={generatePdf}
    >
        Generate {template.name}
    </AsyncButton>
{/each}
{#each $invoices as invoice}
    <Button on:click={downloadPdf(invoice)}>
        {invoice.year}-{invoice.month.toDigits()}-{invoice.invoiceNumber.toDigits()}
    </Button>
{/each}

<AsyncButton job={logout}>Logout</AsyncButton>
