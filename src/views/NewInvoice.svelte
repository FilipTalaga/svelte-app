<script lang="ts">
    import { derived } from 'svelte/store';
    import AsyncButton from '../components/ui/AsyncButton.svelte';
    import { templates, company, invoices, createInvoice } from '../stores/data';
    import { getCurrencyRate } from '../stores/external';
    import type { EntryInvoiceData, Invoice, InvoiceDocument, LegalEntity } from '../types/invoice';
    import { calculateInvoiceData } from '../utils/invoice-calculator';
    import { firstValueFrom, from, Observable, of } from 'rxjs';
    import { map } from 'rxjs/operators';
    import { DateTime } from 'luxon';
    import { navigate } from 'svelte-routing';
    import { onMount } from 'svelte';

    export let id: number;

    const generateInvoice = (invoice: Invoice) => () => createInvoice(invoice);

    const prepareEntryInvoiceData = (
        template: EntryInvoiceData,
        seller: LegalEntity,
        documents: InvoiceDocument[]
    ): Observable<EntryInvoiceData> => {
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

    let invoice: Invoice;

    const getInvoice = derived(
        [templates, company, invoices],
        ([$templates, $company, $invoices]) => {
            if (!$templates || !$company || !$invoices) {
                return;
            }

            return firstValueFrom(
                prepareEntryInvoiceData($templates[id], $company, $invoices).pipe(
                    map(calculateInvoiceData)
                )
            );
        }
    );

    onMount(() => {
        getInvoice.subscribe(request => {
            if (!request) return;

            request.then(res => (invoice = res));
        });
    });
</script>

{#if invoice}
    <div>{invoice.placeOfIssue}</div>
    <div>{DateTime.fromJSDate(invoice.dateOfIssue).toFormat('dd-LL-yyyy')}</div>
    <div>Number: {invoice.invoiceNumber}</div>
    <br />
    <div>{invoice.seller.name}</div>
    <div>NIP: {invoice.seller.taxIdNumber}</div>
    <div>{invoice.seller.address.street}</div>
    <div>{invoice.seller.address.postCode} {invoice.seller.address.city}</div>
    <br />
    <div>{invoice.buyer.name}</div>
    <div>NIP: {invoice.buyer.taxIdNumber}</div>
    <div>{invoice.buyer.address.street}</div>
    <div>{invoice.buyer.address.postCode} {invoice.buyer.address.city}</div>
    <br />
    {#each invoice.products as product}
        <div>{product.name}</div>
        <div>Per unit net - {product.unitNetValue} {invoice.currency}</div>
        <div>Quantity - {product.quantity} {product.unit}</div>
        <div>Total net - {product.totalNetValue} {invoice.currency}</div>
        <div>Total gross - {product.totalGrossValue} {invoice.currency}</div>
    {/each}
    <br />
{:else}
    <div>Loading</div>
{/if}

<AsyncButton job={generateInvoice(invoice)} disabled={!invoice} on:success={() => navigate('/')}>
    Generate invoice
</AsyncButton>
