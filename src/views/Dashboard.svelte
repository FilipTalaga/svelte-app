<script lang="ts">
    import { Link } from 'svelte-routing';
    import { logout } from '../stores/auth';
    import AsyncButton from '../components/ui/AsyncButton.svelte';
    import { templates, invoices } from '../stores/data';
    import type { InvoiceDocument } from '../types/invoice';
    import { createPdf } from 'pdfmake/build/pdfmake';
    import { makeDesignDoc, tableLayouts } from '../utils/document-maker';
    import Button from '../components/ui/Button.svelte';
    import Box from '../components/ui/Box.svelte';

    const downloadPdf = (invoice: InvoiceDocument) => () => {
        const designDoc = makeDesignDoc(invoice);
        const fileName = `faktura-vat-${invoice.invoiceNumber.toDigits()}-${invoice.month.toDigits()}-${
            invoice.year
        }.pdf`;

        createPdf(designDoc, tableLayouts).download(fileName);
    };
</script>

<Box class="root" display="flex" flexDirection="column" p={3}>
    <Box mb={2}>
        <h2>Templates</h2>
    </Box>
    {#each $templates as template, i}
        <Box mb={2}>
            <Link to={`/templates/${i}`}>
                <Box py={1}>
                    {template.name}
                </Box>
            </Link>
        </Box>
    {/each}
    <Box flex={1} mb={2}>
        {#each $invoices as invoice}
            <Button on:click={downloadPdf(invoice)}>
                {invoice.year}-{invoice.month.toDigits()}-{invoice.invoiceNumber.toDigits()}
            </Button>
        {/each}
    </Box>
    <Box>
        <AsyncButton job={logout}>Logout</AsyncButton>
    </Box>
</Box>

<style lang="scss">
    .root {
        height: 100%;
    }
</style>
