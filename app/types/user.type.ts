import { ObjectId } from "mongodb"

export type UserTypeClient = {
    _id?: ObjectId;
    firstName: string;
    lastName: string;
    mail: string;
    role: 'admin' | 'user';
    isMom?: boolean;
    isDad?: boolean;
    isSister?: boolean;
    isMe?: boolean;
    isSasha?: boolean;
    isClement?: boolean;
    isAlizee?: boolean;
    isHippolyte?: boolean,
}

export type UserTypeServer = {
    _id?: ObjectId;
    firstName: string;
    lastName: string;
    mail: string;
    password: string;
    role: 'admin' | 'user';
    isMom?: boolean,
    isDad?: boolean;
    isSister?: boolean;
    isMe?: boolean;
    isSasha?: boolean;
    isClement?: boolean;
    isAlizee?: boolean;
    isHippolyte?: boolean,
}
