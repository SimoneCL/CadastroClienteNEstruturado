export interface IOrderLine {
    seq: number;
    item: string;
    quantity: number;
    valueTotItem: number;
}

export class OrderLine implements IOrderLine {
    seq: number;
    item: string;
    quantity: number;
    valueTotItem: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

    static getInternalId(item: IOrderLine): string {
        return item.seq.toString();
    }

    get $seq() { return this.seq; }
    get $item() { return this.item; }
    get $quantity() { return this.quantity; }
    get $valueTotItem() { return this.valueTotItem; }

    set $seq(value: number) { this.seq = value; }
    set $name(value: string) { this.item = value; }
    set $quantity(value: number) { this.quantity = value; }
    set $valueTotItem(value: number) { this.valueTotItem = value; }
    
}
