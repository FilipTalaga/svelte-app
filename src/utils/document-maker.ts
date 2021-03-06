/* eslint-disable */
import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { ExchangeRate, Invoice, InvoiceDocument } from '../types/invoice';
import { DateTime } from 'luxon';

const pdfConsts = {
    margin: 20,
    fontSize: {
        upperColumns: 10,
        header: 20,
        table: 9,
        totalPayment: 11,
        exchangeRate: 10,
        text: 9,
    },
    labelBackground: '#dedede',
};

const renderIf = (content: () => Record<string, unknown> | [], condition: boolean) =>
    condition ? [content()] : [];

const makeExchangeLine = (exchangeRate: ExchangeRate, currency: string) => [
    'Przeliczono po kursie ',
    {
        text: `1 ${currency} = ${exchangeRate.mid.toCurrency({
            precision: 4,
            suffix: ` ${exchangeRate.currency}`,
        })}`,
        style: {
            bold: true,
            fontSize: pdfConsts.fontSize.exchangeRate,
        },
    },
    `. Tabela kursów średnich NBP nr ${exchangeRate.no} z dnia ${DateTime.fromFormat(
        exchangeRate.effectiveDate,
        'yyyy-LL-dd'
    ).toFormat('dd-LL-yyyy')}`,
];

const makeColumn = (header: string, content: string[]) => [
    {
        layout: 'labelLayout',
        table: {
            widths: ['*'],
            body: [
                [
                    {
                        text: header,
                        style: {
                            bold: true,
                            alignment: 'center',
                        },
                    },
                ],
            ],
        },
    },
    {
        layout: 'detailsLayout',
        margin: [0, 0, 0, pdfConsts.margin],
        table: {
            widths: ['*'],
            body: content.map(item => [item]),
        },
    },
];

export const tableLayouts = {
    labelLayout: {
        fillColor: (rowIndex: number) => (rowIndex === 0 ? '#ededed' : null),
        hLineWidth: () => 1,
        vLineWidth: () => 1,
    },
    invoiceLayout: {
        fillColor: (rowIndex: number) => (rowIndex === 0 ? '#ededed' : null),
    },
    detailsLayout: {
        hLineWidth: () => 0,
        vLineWidth: () => 0,
    },
};

export const makeDesignDoc = (invoice: InvoiceDocument): TDocumentDefinitions =>
    ({
        content: [
            {
                columns: [
                    [],
                    [
                        makeColumn('Miejsce wystawienia', [invoice.placeOfIssue]),
                        makeColumn('Data wystawienia', [
                            DateTime.fromJSDate(invoice.dateOfIssue.toDate()).toFormat(
                                'dd-LL-yyyy'
                            ),
                        ]),
                    ],
                ],
                columnGap: pdfConsts.margin,
                style: {
                    fontSize: pdfConsts.fontSize.upperColumns,
                    alignment: 'center',
                },
            },
            {
                columns: [
                    makeColumn('Sprzedawca', [
                        invoice.seller.name,
                        `NIP: ${invoice.seller.taxIdNumber}`,
                        invoice.seller.address.street,
                        `${invoice.seller.address.postCode} ${invoice.seller.address.city}`,
                    ]),
                    makeColumn('Nabywca', [
                        invoice.buyer.name,
                        `NIP: ${invoice.buyer.taxIdNumber}`,
                        invoice.buyer.address.street,
                        `${invoice.buyer.address.postCode} ${invoice.buyer.address.city}`,
                    ]),
                ],
                columnGap: pdfConsts.margin,
                style: {
                    fontSize: pdfConsts.fontSize.upperColumns,
                },
            },
            {
                text: `Faktura VAT ${invoice.invoiceNumber.toDigits()}/${invoice.month.toDigits()}/${
                    invoice.year
                }`,
                alignment: 'center',
                style: {
                    fontSize: pdfConsts.fontSize.header,
                    bold: true,
                },
                margin: [0, 0, 0, pdfConsts.margin],
            },
            {
                style: {
                    fontSize: pdfConsts.fontSize.table,
                    alignment: 'center',
                },
                margin: [0, 0, 0, pdfConsts.margin],
                layout: 'invoiceLayout',
                table: {
                    headerRows: 1,
                    widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                    body: [
                        [
                            ...[
                                'Lp.',
                                'Nazwa towaru lub usługi',
                                'Jm.',
                                'Ilość',
                                'Cena netto',
                                'Wartość netto',
                                'Stawka VAT',
                                'Wartość brutto',
                            ].map(text => ({
                                text,
                                style: {
                                    bold: true,
                                },
                            })),
                        ],
                        ...invoice.products.map(item =>
                            [
                                item.no,
                                item.name,
                                item.unit,
                                item.quantity,
                                item.unitNetValue.toCurrency(),
                                item.totalNetValue.toCurrency(),
                                item.taxRate.toPercent(),
                                item.totalGrossValue.toCurrency(),
                            ].map((text, index) => ({
                                text,
                                style: {
                                    alignment:
                                        index === 1 ? 'left' : index === 2 ? 'center' : 'right',
                                },
                            }))
                        ),
                    ],
                },
            },
            {
                columns: [
                    [
                        {
                            style: {
                                fontSize: pdfConsts.fontSize.table,
                                alignment: 'center',
                            },
                            layout: 'invoiceLayout',
                            margin: [0, 0, 0, pdfConsts.margin],
                            table: {
                                headerRows: 1,
                                widths: ['auto', 'auto', 'auto', 'auto'],
                                body: [
                                    [
                                        ...[
                                            'Stawka VAT',
                                            'Wartość netto',
                                            'Kwota VAT',
                                            'Wartość brutto',
                                        ].map(text => ({
                                            text,
                                            style: {
                                                bold: true,
                                            },
                                        })),
                                    ],
                                    ...invoice.taxRatesSummary.map(item => [
                                        item.taxRate.toPercent(),
                                        {
                                            text: item.netValue.toCurrency(),
                                            style: { alignment: 'right' },
                                        },
                                        {
                                            text: item.taxValue.toCurrency(),
                                            style: { alignment: 'right' },
                                        },
                                        {
                                            text: item.grossValue.toCurrency(),
                                            style: { alignment: 'right' },
                                        },
                                    ]),
                                    [
                                        ...[
                                            'Razem',
                                            invoice.total.netValue.toCurrency(),
                                            invoice.total.taxValue.toCurrency(),
                                            invoice.total.grossValue.toCurrency(),
                                        ].map((text, index) => ({
                                            text,
                                            style: {
                                                bold: true,
                                                alignment: index === 0 ? 'center' : 'right',
                                            },
                                        })),
                                    ],
                                ],
                            },
                        },
                        {
                            layout: 'detailsLayout',
                            table: {
                                widths: ['auto', 'auto'],
                                body: [
                                    ['Sposób płatności', invoice.paymentMethod],
                                    [
                                        'Termin płatności',
                                        DateTime.fromJSDate(
                                            invoice.paymentDeadline.toDate()
                                        ).toFormat('dd-LL-yyyy'),
                                    ],
                                    ['Numer konta', invoice.accountNumber],
                                ],
                            },
                        },
                    ],
                    [
                        {
                            layout: 'detailsLayout',
                            table: {
                                body: [
                                    [
                                        {
                                            text: [
                                                'Do zapłaty: ',
                                                {
                                                    text: `${invoice.total.grossValue.toCurrency()} ${
                                                        invoice.currency
                                                    }`,
                                                    style: {
                                                        bold: true,
                                                        fontSize: pdfConsts.fontSize.totalPayment,
                                                    },
                                                },
                                            ],
                                        },
                                    ],
                                    [
                                        {
                                            text: `Słownie: ${invoice.total.grossText} ${invoice.currency}`,
                                        },
                                    ],
                                    ...renderIf(
                                        // @ts-ignore
                                        () => [
                                            {
                                                text: [
                                                    ...makeExchangeLine(
                                                        invoice.exchangeRate!,
                                                        invoice.currency
                                                    ),
                                                ],
                                                margin: [
                                                    0,
                                                    pdfConsts.margin * 0.25,
                                                    0,
                                                    pdfConsts.margin * 0.25,
                                                ],
                                            },
                                        ],
                                        !!invoice.exchangeRate
                                    ),
                                ],
                            },
                        },
                        ...renderIf(
                            () => ({
                                layout: 'detailsLayout',
                                table: {
                                    widths: ['*', '*', '*'],
                                    body: [
                                        [
                                            'Wartość netto',
                                            {
                                                text: invoice.total.netValue.toCurrency({
                                                    suffix: ` ${invoice.currency}`,
                                                }),
                                                style: {
                                                    alignment: 'right',
                                                },
                                            },
                                            {
                                                text: invoice.totalExchanged!.netValue.toCurrency({
                                                    suffix: ` ${invoice.exchangeRate!.currency}`,
                                                }),
                                                style: {
                                                    alignment: 'right',
                                                },
                                            },
                                        ],
                                        [
                                            'Kwota VAT',
                                            {
                                                text: invoice.total.taxValue.toCurrency({
                                                    suffix: ` ${invoice.currency}`,
                                                }),
                                                style: {
                                                    alignment: 'right',
                                                },
                                            },
                                            {
                                                text: invoice.totalExchanged!.taxValue.toCurrency({
                                                    suffix: ` ${invoice.exchangeRate!.currency}`,
                                                }),
                                                style: {
                                                    alignment: 'right',
                                                },
                                            },
                                        ],
                                        [
                                            'Wartość brutto',
                                            {
                                                text: invoice.total.grossValue.toCurrency({
                                                    suffix: ` ${invoice.currency}`,
                                                }),
                                                style: {
                                                    alignment: 'right',
                                                },
                                            },
                                            {
                                                text: invoice.totalExchanged!.grossValue.toCurrency(
                                                    {
                                                        suffix: ` ${
                                                            invoice.exchangeRate!.currency
                                                        }`,
                                                    }
                                                ),
                                                style: {
                                                    alignment: 'right',
                                                },
                                            },
                                        ],
                                    ],
                                },
                            }),
                            !!invoice.exchangeRate
                        ),
                    ],
                ],
                columnGap: pdfConsts.margin,
            },
        ],
        defaultStyle: {
            fontSize: pdfConsts.fontSize.text,
        },
    } as TDocumentDefinitions);
