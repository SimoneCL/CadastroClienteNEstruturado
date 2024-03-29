import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PoDisclaimer } from '@portinari/portinari-ui';
import { Observable } from 'rxjs';
import { TotvsResponse } from '../interfaces/totvs-response.interface';
import { IOrder, Order } from '../model/order.model';



@Injectable()
export class OrderService {

    private headers = { headers: { 'X-Portinari-Screen-Lock': 'true' } };

    // private apiBaseUrl = '/dts/datasul-rest/resources/prg/fin/v1/order';
    private apiBaseUrl = '/order';

      private expandables = [''];

    constructor(private http: HttpClient) { }

    query(filters: PoDisclaimer[], expandables: string[], page = 1, pageSize = 20): Observable<TotvsResponse<IOrder>> {
        const url = this.getUrl(this.apiBaseUrl, filters, expandables, page, pageSize);

        return this.http.get<TotvsResponse<IOrder>>(url, this.headers);
    }

    getById(id: string, expandables: string[]): Observable<IOrder> {
        let lstExpandables = this.getExpandables(expandables);
        if (lstExpandables !== '') { lstExpandables = `?${lstExpandables}`; }

        return this.http.get<IOrder>(`${this.apiBaseUrl}/${id}${lstExpandables}`, this.headers);
    }
    

    getByIdCustomer(codeCustomer: string, expandables: string[]): Observable<TotvsResponse<IOrder>> {
       // this.getUrl(this.apiBaseUrl, String(codeCustomer), expandables, 1, 20);
        let lstExpandables = this.getExpandables(expandables);
        console.log(lstExpandables)
        if (lstExpandables !== '') { lstExpandables = `?${lstExpandables}`; }
console.log(this.apiBaseUrl)
        return this.http.get<TotvsResponse<IOrder>>(`${this.apiBaseUrl}${lstExpandables}?codeCustomer=${codeCustomer}`, this.headers);
     }

    getFilteredData(filter: string, page: number, pageSize: number): Observable<IOrder> {
        const header = { params: { page: page.toString(), pageSize: pageSize.toString() } };

        if (filter && filter.length > 0) {
            header.params['code'] = filter;
        }

        return this.http.get<IOrder>(`${this.apiBaseUrl}`, header);
    }

    getObjectByValue(id: string): Observable<IOrder> {
        return this.http.get<IOrder>(`${this.apiBaseUrl}/${id}`);
    }
    create(model: IOrder): Observable<IOrder> {
        return this.http.post<IOrder>(this.apiBaseUrl, model, this.headers);
    }

    update(model: IOrder): Observable<IOrder> {
        return this.http.put<IOrder>(`${this.apiBaseUrl}/${Order.getInternalId(model)}`, model, this.headers);
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
