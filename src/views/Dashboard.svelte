<script lang="ts">
    import { logout } from '../stores/auth';
    import AsyncButton from '../components/ui/AsyncButton.svelte';
    import { templates, company } from '../stores/data';
    import type { EntryInvoiceData, LegalEntity } from '../types/invoice';
    import { from, Observable, of } from 'rxjs';
    import { map } from 'rxjs/operators';
    import { DateTime } from 'luxon';
    import { getCurrencyRate } from '../stores/external';
    import calculateInvoiceData from '../utils/invoice-calculator';

    const prepareEntryInvoiceData =
        (template: EntryInvoiceData, seller: LegalEntity) => (): Observable<EntryInvoiceData> => {
            const dateOfIssue = DateTime.now();
            const invoiceData = {
                ...template,
                seller,
                invoiceNumber: 1,
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
        console.log(entryInvoiceData);
        console.log(invoice);
    };

</script>

<div>Dashboard</div>
{#each $templates as template}
    <AsyncButton job={prepareEntryInvoiceData(template, $company)} on:success={generatePdf}>
        Generate {template.name}
    </AsyncButton>
{/each}

<AsyncButton job={logout}>Logout</AsyncButton>
