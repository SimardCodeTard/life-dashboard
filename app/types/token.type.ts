import { ObjectId } from "mongodb";

export type TokenType = {
    _id?: ObjectId;
    userId: string,
    token: string,
    expiresAt: Date,
    createdAt: Date,
    userIp: string,
}