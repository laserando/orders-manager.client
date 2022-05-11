import { Order } from "./order.model";
import { Role } from "./role.model";

export class StorageOrderUpdate {

    public byRole: Role;
    public textNote: string;
    public order: Order;
    public created_at: Date;

    constructor(byRole?: Role, textNote?: string, order?: Order, created_at?: Date) {
        this.byRole = byRole;
        this.textNote = textNote;
        this.order = order;
        this.created_at = created_at;
    }

}