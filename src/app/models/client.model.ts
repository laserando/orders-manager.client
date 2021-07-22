export class ClientModel {

    public id: number;
    public name: string;
    public surname: string;
    public businessName: string;
    public piva: string;
    public cf:string;
    public billingAddress: string;
    public shippingAddress:string;
    public sdi: string;
    public email: string;
    public cellphoneNumber: number;
    public isBusiness: boolean = false;
    public graphicLink: string;

    constructor(id?: number, name?: string, surname?: string, businessName?: string, piva?: string, billingAddress?: string,
        sdi?: string, email?: string, cellphoneNumber?: number, graphicLink?:string) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.businessName = businessName;
        this.piva = piva;
        this.billingAddress = billingAddress;
        this.sdi = sdi;
        this.email = email;
        this.cellphoneNumber = cellphoneNumber;
        this.graphicLink = graphicLink;
    }
}