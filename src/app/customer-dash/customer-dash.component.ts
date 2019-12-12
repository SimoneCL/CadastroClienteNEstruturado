import { Component, OnInit, OnDestroy } from '@angular/core';
import { PoBreadcrumb, PoI18nService, PoSelectOption, PoTableColumn, PoTableAction } from '@portinari/portinari-ui';
import { BreadcrumbControlService } from './../shared/services/breadcrumb-control.service';
import { forkJoin, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ICustomer } from '../shared/model/customer.model';
import { CustomerService } from '../shared/services/customer.service';
import { TotvsResponse } from '../shared/interfaces/totvs-response.interface';
import { IOrder, Order } from '../shared/model/order.model';
import { OrderService } from './../shared/services/order.service';
import { IOrderLine } from './../shared/model/order-line.model';



@Component({
  selector: 'app-customer-dash',
  templateUrl: './customer-dash.component.html',
  styleUrls: ['./customer-dash.component.css']
})
export class CustomerDashComponent implements OnInit, OnDestroy {

  literals: any = {};
  breadcrumb: PoBreadcrumb;

  itemsCustomer: Array<ICustomer> = new Array<ICustomer>();
  customerOptions: Array<PoSelectOption>;

  columns: Array<PoTableColumn>;
  tableActions: Array<PoTableAction>;
  items: Array<IOrder> = new Array<IOrder>();
  itemsOrderLine: Array<IOrderLine> = new Array<IOrderLine>();

  statusLabelList: Array<any>;

  hasNext = false;
  currentPage = 1;
  pageSize = 20;




  expandables = ['']; //para saber se devo expandir os filhos 
  servCustomerSubscription$: Subscription; //essa varical seria semelhante a um handle 
  servOrderSubscription$: Subscription; //essa varical seria semelhante a um handle 

  constructor(
    private PoI18nServices: PoI18nService,
    private activatedRoute: ActivatedRoute,
    private serviceCustomer: CustomerService,
    private serviceOrder: OrderService,
    private breadcrumbControlService: BreadcrumbControlService
  ) { }

  ngOnInit(): void {

    console.log('LOG', ' onINiti');
    forkJoin(
      this.PoI18nServices.getLiterals(),
      this.PoI18nServices.getLiterals({ context: 'customerDash' })
    ).subscribe(literals => {
      literals.map(item => Object.assign(this.literals, item));

      console.log('LOG', 'Início do Programa de DASH');

      this.breadcrumbControlService.addBreadcrumb(this.literals['orderCustomer'], this.activatedRoute);
      this.setupComponents();
      this.search();

    });


  }
  ngOnDestroy(): void {
  }

  setupComponents(): void {
    this.customerOptions = [];

    this.breadcrumb = this.breadcrumbControlService.getBreadcrumb();
    console.log('setupComponents -breadcrumb' + this.breadcrumb);


    this.getCustomer();

    this.statusLabelList = Order.statusLabelList(this.literals);


    this.columns = [
      { property: 'numOrder', label: this.literals['numOrder'], type: 'number' },
      { property: 'date', label: this.literals['date'], type: 'date' },
      { property: 'value', label: this.literals['value'], type: 'currency' },
      { property: 'status', label: this.literals['status'], type: 'label', labels: this.statusLabelList },
      {
        property: 'orderlines', label: 'Details', type: 'detail'
        , detail: {
          columns: [
            { property: 'seq', label: 'Seq', type: 'number' },
            { property: 'item', label: 'Item', type: 'string' },
            { property: 'quantity', label: 'Quantidade', type: 'number' },
            { property: 'valueTotItem', label: 'Valor', type: 'currency' }
          ],
          typeHeader: 'top'
        }
      }
    ];
    this.tableActions = [
      /* { action: this.detail.bind(this), label: this.literals['detail'], icon: 'po-icon po-icon-document' },
       { action: this.edit.bind(this), label: this.literals['edit'], icon: 'po-icon po-icon-edit' },
       { action: this.delete.bind(this), label: this.literals['remove'], icon: 'po-icon po-icon-delete' }
       */
    ];


  }
  onChangeState() {

  }

  getCustomer(): void {

    this.servCustomerSubscription$ = this.serviceCustomer
      .query([], this.expandables)
      .subscribe((response: TotvsResponse<ICustomer>) => {
        if (response && response.items) {

          this.itemsCustomer = response.items;

          for (let item of response.items.values()) {
            //O push vai carregar os valores no array customerOptions
            this.customerOptions.push({ label: item.code + ' - ' + item.shortName, value: item.code });

          }
        }

      });
  }
  search(loadMore = false): void {
    console.log('searh');
    if (loadMore === true) {
      this.currentPage = this.currentPage + 1;
    } else {
      this.items = [];
    }

    this.hasNext = false;
    this.servOrderSubscription$ = this.serviceOrder
      .query([], this.expandables, this.currentPage, this.pageSize)
      .subscribe((response: TotvsResponse<IOrder>) => {
        console.log(response);
        if (response && response.items) {
          this.items = [...this.items, ...response.items];
          this.hasNext = response.hasNext;
        }

        if (this.items.length === 0) { this.currentPage = 1; }
      });
  }

}
