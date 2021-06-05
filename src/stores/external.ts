import type { DateTime } from 'luxon';
import type { ExchangeRate, ExchangeRateTable } from '../types/invoice';
import type { Observable } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { map } from 'rxjs/operators';

const get = <T>(url: string): Observable<T> =>
    fromFetch<T>(url, {
        selector: response => response.json(),
    });

export const getCurrencyRate = (code: string, paymentDate: DateTime): Observable<ExchangeRate> => {
    const date = paymentDate.minus({ days: 1 });
    const table = 'a';
    const endDate = date.toFormat('yyyy-LL-dd');
    const startDate = date.minus({ days: 7 }).toFormat('yyyy-LL-dd');
    const url = `https://api.nbp.pl/api/exchangerates/rates/${table}/${code}/${startDate}/${endDate}`;

    return get<ExchangeRateTable>(url).pipe(
        map(res => ({ ...res.rates.reverse()[0], currency: 'PLN' }))
    );
};
