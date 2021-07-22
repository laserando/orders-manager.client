import { Order } from "./order.model";
import { Role } from "./role.model";

export class NoteModel {

    public textNote: string;
    public noteByRole: Role;
    public noteToRole: Role;
    public order: Order;

    constructor(textNote: string, noteByRole?: Role, noteToRole?: Role, order?: Order) {
        this.textNote = textNote;
        this.noteByRole = noteByRole;
        this.noteToRole = noteToRole;
        this.order = order;
    }
}