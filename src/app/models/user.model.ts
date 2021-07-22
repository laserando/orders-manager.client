import { Role } from "./role.model";

export class User {
    public name: string;
    public surname: string;
    public id: number;
    public password: string;
    public username: string;
    public email: string;
    public role: Role;

    constructor(name?: string, surname?: string, id?: number, password?: string, username?: string, email?: string, role?: Role) {
        this.name = name;
        this.surname = surname;
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
    }
}