import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PoDisclaimer } from '@portinari/portinari-ui';
import { Observable } from 'rxjs';
import { TotvsResponse } from '../interfaces/totvs-response.interface';
import { ICustomer, Customer } from '../model/customer.model';


@Injectable()
export class CustomerService {

    private headers = { headers: { 'X-Portinari-Screen-Lock': 'true' } };

    // private apiBaseUrl = '/dts/datasul-rest/resources/prg/fin/v1/customer';
    private apiBaseUrl = '/customer';

    private expandables = [''];

    constructor(private http: HttpClient) { }

    query(filters: PoDisclaimer[], expandables: string[], page = 1, pageSize = 20): Observable<TotvsResponse<ICustomer>> {
        const url = this.getUrl(this.apiBaseUrl, filters, expandables, page, pageSize);

        return this.http.get<TotvsResponse<ICustomer>>(url, this.headers);
    }

    getById(id: string, expandables: string[]): Observable<ICustomer> {
        let lstExpandables = this.getExpandables(expandables);
        if (lstExpandables !== '') { lstExpandables = `?${lstExpandables}`; }
        return this.http.get<ICustomer>(`${this.apiBaseUrl}/${id}${lstExpandables}`, this.headers);
    }

    getByIdCustomer(codeCustomer: string, expandables: string[]): Observable<TotvsResponse<ICustomer>> {
        // this.getUrl(this.apiBaseUrl, String(codeCustomer), expandables, 1, 20);
         let lstExpandables = this.getExpandables(expandables);
         console.log(lstExpandables)
         if (lstExpandables !== '') { lstExpandables = `?${lstExpandables}`; }
 console.log(this.apiBaseUrl)
         return this.http.get<TotvsResponse<ICustomer>>(`${this.apiBaseUrl}${lstExpandables}?codeCustomer=${codeCustomer}`, this.headers);
      }

    create(model: ICustomer): Observable<ICustomer> {
        return this.http.post<ICustomer>(this.apiBaseUrl, model, this.headers);
    }

    update(model: ICustomer): Observable<ICustomer> {
        return this.http.put<ICustomer>(`${this.apiBaseUrl}/${Customer.getInternalId(model)}`, model, this.headers);
    }

    delete(id: string): Observable<Object> {
        return this.http.delete(`${this.apiBaseUrl}/${id}`, this.headers);
    }

    getUrl(urlBase: string, filters: PoDisclaimer[], expandables: string[], page: number, pageSize: number): string {
        const urlParams = new Array<String>();

        urlParams.push(`pageSize=${pageSize}`);
        urlParams.push(`page=${page}`);

        const lstExpandables = this.getExpandables(expandables);
        if (lstExpandables !== '') { urlParams.push(lstExpandables); }

        if (filters && filters.length > 0) {
            filters.map(filter => {
                urlParams.push(`${filter.property}=${filter.value}`);
            });
        }

        return `${urlBase}?${urlParams.join('&')}`;
    }

    getExpandables(expandables: string[]): string {
        let lstExpandables = '';

        if (expandables && expandables.length > 0) {
            expandables.map(expandable => {
                if (expandable !== '' && this.expandables.includes(expandable)) {
                    if (lstExpandables !== '') { lstExpandables = `${lstExpandables},`; }
                    lstExpandables = `${lstExpandables}${expandable}`;
                }
            });
        }

        if (lstExpandables !== '') { lstExpandables = `expand=${lstExpandables}`; }

        return lstExpandables;
    }
}
