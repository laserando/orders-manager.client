import { Role } from "./role.model";
import { TypeOfProcessingModel } from "./type-of-processing.model";
import { TagModel } from "./tag.model";
import { TypeOfMaterialModel } from "./type-of-material.model";
import { LogModel } from "./log.model";
import { NoteModel } from "./note.model";
import { ClientModel } from "./client.model";

export class Order {

    public client: ClientModel;
    public typeOfWork: string;
    public typesOfProcessing: TypeOfProcessingModel;
    public typesOfMaterial: TypeOfMaterialModel;
    public itemSize: string;
    public clientIndications: string;
    public deliveryDate: string;
    public tags: TagModel[];
    public role: Role;
    public id: number;
    public logs: LogModel[] = [];
    public isCompleted: boolean = false;
    public created_at: string;
    public isArchived: boolean = false;
    public notes: NoteModel[] = [];

    constructor(clientIndications?: string, typeOfWork?: string, typesOfProcessing?: TypeOfProcessingModel,
        typesOfMaterial?: TypeOfMaterialModel, itemSize?: string, deliveryDate?: string, role?: Role, id?: number, tags?: TagModel[], logs?: LogModel[],
        isCompleted?: boolean, created_at?: string, isArchived?: boolean, notes?: NoteModel[], client?: ClientModel) {
        this.client = client;
        this.typeOfWork = typeOfWork;
        this.typesOfProcessing = typesOfProcessing;
        this.typesOfMaterial = typesOfMaterial;
        this.itemSize = itemSize;
        this.clientIndications = clientIndications;
        this.deliveryDate = deliveryDate;
        this.tags = tags || [];
        this.role = role;
        this.logs = logs || [];
        this.id = id;
        this.isCompleted = isCompleted;
        this.created_at = created_at;
        this.isArchived = isArchived;
        this.notes = notes || [];
    }
}