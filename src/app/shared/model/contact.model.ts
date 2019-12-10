export interface IContact {
    // attribute: string;
    codeCustomer: number;
    code: number;
    name: string;
    fone: string;
}
export class Contact implements IContact {
    codeCustomer: number;
    code: number;
    name: string;
    fone: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

    static getInternalId(item: IContact): string {
        return item.code.toString();  // neste metodo que podemos transformar para base-64
    }
    get $codecustomer() { return this.codeCustomer; }
    get $code() { return this.code; }
    get $name() { return this.name; }
    get $fone() { return this.fone; }

    set $codecustomer(value: number) { this.codeCustomer = value; }
    set $code(value: number) { this.code = value; }
    set $name(value: string) { this.name = value; }
    set $fone(value: string) { this.fone = value; }
}