import { TokenType } from "@/app/types/token.type";
import { serverMongoDataService } from "./mongod-data.server.service";

export namespace tokenDataService {

    const collectionName = 'tokens';

    export const saveRefreshToken = async (userId: string, token: string, userIp: string) => {
        return await serverMongoDataService.insertOne<TokenType>(collectionName, {
            userId,
            token,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90), // 90 jours
            createdAt: new Date(),
            userIp
        })
    };
    
    export const findRefreshToken = async (token: string) => {
        return await serverMongoDataService.findOne<TokenType>(collectionName, {token});
    };
    
    export const deleteRefreshToken = async (token: string) => {
        return await serverMongoDataService.deleteByQuery(collectionName, {token});
    };
    
}