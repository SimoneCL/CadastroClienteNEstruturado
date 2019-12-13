import { Component, OnInit, OnDestroy } from '@angular/core';
import { PoBreadcrumb, PoI18nService, PoSelectOption, PoTableColumn, PoTableAction, PoInfoOrientation, PoRadioGroupOption } from '@portinari/portinari-ui';
import { BreadcrumbControlService } from './../shared/services/breadcrumb-control.service';
import { forkJoin, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ICustomer, Customer } from '../shared/model/customer.model';
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
  selectCustomer = 0;
  customer: ICustomer = new Customer();

  
  orientation: PoInfoOrientation;




  expandables = ['']; //para saber se devo expandir os filhos 
  servCustomerSubscription$: Subscription; //essa varical seria semelhante a um handle 
  servOrderSubscription$: Subscription; //essa varical seria semelhante a um handle 

  constructor(
    private PoI18nServices: PoI18nService,
    private activatedRoute: ActivatedRoute,
    private serviceCustomer: CustomerService,
    private serviceOrder: OrderService,
    private router: Router,
    private breadcrumbControlService: BreadcrumbControlService
  ) { }

  
  ngOnInit(): void {

    forkJoin(
      this.PoI18nServices.getLiterals(),
      this.PoI18nServices.getLiterals({ context: 'customerDash' })
    ).subscribe(literals => {
      literals.map(item => Object.assign(this.literals, item));

      console.log('LOG', 'Início do Programa de DASH');

      this.breadcrumbControlService.addBreadcrumb(this.literals['orderCustomer'], this.activatedRoute);
      this.setupComponents();
      
    });
  }
  ngOnDestroy(): void {
  }

  setupComponents(): void {
    this.customerOptions = [];
    this.orientation = PoInfoOrientation.Horizontal;

    this.breadcrumb = this.breadcrumbControlService.getBreadcrumb();
    this.getCustomer();

    this.statusLabelList = Order.statusLabelList(this.literals);

    this.columns = [
      { property: 'numOrder', label: this.literals['numOrder'], type: 'number' },
      { property: 'date', label: this.literals['date'], type: 'date' },
      { property: 'value', label: this.literals['value'], type: 'currency' },
      { property: 'status', label: this.literals['status'], type: 'label', labels: this.statusLabelList },
      {
        property: 'orderLines', label: 'Details', type: 'detail'
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
      
  }
  onChangedCustomer() {

    this.customer = this.itemsCustomer.find(element => element.code === this.selectCustomer);

    this.searchOrder(String(this.customer.code));
  }

  getDetailCustomer() {
     this.router.navigate(['/customerMaint', 'detail', Customer.getInternalId(this.customer)]);
  }
  searchOrder(code: string): void {
    this.items = [];
    this.servOrderSubscription$ = this.serviceOrder
      .getByIdOrderCustomer(code, this.expandables)
      .subscribe((response: TotvsResponse<IOrder>) => {
        if (response) {
          this.items = response.items;
        }
      });
  }


  getCustomer() {

    this.servCustomerSubscription$ = this.serviceCustomer
      .query([], this.expandables)
      .subscribe((response: TotvsResponse<ICustomer>) => {
        this.selectCustomer = response.items[0].code;
        this.customer = response.items[0];
        if (response && response.items) {

          this.itemsCustomer = response.items;

          for (let item of response.items.values()) {
            //O push vai carregar os valores no array customerOptions
            this.customerOptions.push({ label: item.code + ' - ' + item.shortName, value: item.code });

          }
        }
        this.searchOrder(String(this.customer.code));

      });
  }
  search(loadMore = false): void {
    if (loadMore === true) {
      this.currentPage = this.currentPage + 1;
    } else {
      this.items = [];
    }

    this.hasNext = false;
    this.servOrderSubscription$ = this.serviceOrder
      .query([], this.expandables, this.currentPage, this.pageSize)
      .subscribe((response: TotvsResponse<IOrder>) => {
        if (response && response.items) {
          this.items = [...this.items, ...response.items];
          this.hasNext = response.hasNext;
        }

        if (this.items.length === 0) { this.currentPage = 1; }
      });
  }

}
