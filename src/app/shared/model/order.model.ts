import { IOrderLine } from "./order-line.model";

export interface IOrder {
    code: number;
    codeCustomer: number;
    numOrder: number;
    date: Date;
    value: number;
    status: number;
    orderLines: Array<IOrderLine>;
}

export class Order implements IOrder {
    code: number;
    codeCustomer: number;
    numOrder: number;
    date: Date;
    value: number;
    status: number;
    orderLines: Array<IOrderLine>;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

    static getInternalId(item: IOrder): string {
        return item.code.toString();
    }

    static statusLabelList(literals: {}): Array<any> {
        return [
            { value: 1, color: 'success', label: literals['release'] },
            { value: 2, color: 'danger', label: literals['digit'] },
            { value: 3, color: 'color-08', label: literals['block'] }
        ];
    }

    get $code() { return this.code; }
    get $codeCustomer() { return this.codeCustomer; }
    get $numOrder() { return this.numOrder; }
    get $date() { return this.date; }
    get $value() { return this.value; }
    get $status() { return this.status; }
    get $orderLines() { return this.orderLines; }

    set $code(value: number) { this.code = value; }
    set $codeCustomer(value: number) { this.codeCustomer = value; }
    set $numOrder(value: number) { this.numOrder = value; }
    set $date(value: Date) { this.date = value; }
    set $value(value: number) { this.value = value; }
    set $status(value: number) { this.status = value; }
    set $orderLines(value: Array<IOrderLine>) { this.orderLines = value; }
}
