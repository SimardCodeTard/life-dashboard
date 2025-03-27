import { ObjectId } from "mongodb"

export type UserTypeClient = {
    _id?: ObjectId;
    firstName: string;
    lastName: string;
    mail: string;
    role: 'admin' | 'user';
}

export type UserTypeServer = {
    _id?: ObjectId;
    firstName: string;
    lastName: string;
    mail: string;
    password: string;
    role: 'admin' | 'user';
}
