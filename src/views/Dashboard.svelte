<script lang="ts">
    import { Link } from 'svelte-routing';
    import { logout } from '../stores/auth';
    import AsyncButton from '../components/ui/AsyncButton.svelte';
    import { templates, invoices } from '../stores/data';
    import type { InvoiceDocument } from '../types/invoice';
    import { createPdf } from 'pdfmake/build/pdfmake';
    import { makeDesignDoc, tableLayouts } from '../utils/document-maker';
    import Button from '../components/ui/Button.svelte';

    const downloadPdf = (invoice: InvoiceDocument) => () => {
        const designDoc = makeDesignDoc(invoice);
        const fileName = `faktura-vat-${invoice.invoiceNumber.toDigits()}-${invoice.month.toDigits()}-${
            invoice.year
        }.pdf`;

        createPdf(designDoc, tableLayouts).download(fileName);
    };
</script>

<div>Dashboard</div>
<nav>
    {#each $templates as template, i}
        <br />
        <br />
        <Link to={`/templates/${i}`}>{template.name}</Link>
        <br />
        <br />
    {/each}
</nav>
{#each $invoices as invoice}
    <Button on:click={downloadPdf(invoice)}>
        {invoice.year}-{invoice.month.toDigits()}-{invoice.invoiceNumber.toDigits()}
    </Button>
{/each}
<br />
<br />
<AsyncButton job={logout}>Logout</AsyncButton>
