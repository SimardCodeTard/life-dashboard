import { TokenType } from "@/app/types/token.type";
import { serverMongoDataService } from "./mongod-data.server.service";
import { AUTH_REFRESH_TOKEN_LIFETIME } from "@/app/utils/cookies.utils";
import { APIInternalServerError } from "@/app/errors/api.error";

export namespace tokenDataService {

    const collectionName = 'tokens';

    export const saveRefreshToken = async (userId: string, token: string, userIp: string) => {
        const tokenInDb = await findRefreshToken(token);

        if(tokenInDb) throw new APIInternalServerError('Token already exists');

        return await serverMongoDataService.insertOne<TokenType>(collectionName, {
            userId,
            token,
            expiresAt: new Date(Date.now() + 1000 * AUTH_REFRESH_TOKEN_LIFETIME),
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