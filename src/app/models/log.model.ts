import { Order } from "./order.model";
import { Role } from "./role.model";

export class LogModel {

    public created_at: string;
    public oldRole: Role;
    public newRole: Role;
    public order: Order;

    constructor(created_at?: string, oldRole?: Role, newRole?: Role, order?: Order) {
        this.created_at = created_at;
        this.oldRole = oldRole;
        this.newRole = newRole;
        this.order = order;
    }
}