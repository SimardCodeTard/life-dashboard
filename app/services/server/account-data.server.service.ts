import { Account } from "@/app/types/account.type";
import { serverMongoDataService } from "./mongod-data.server.service";
import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from "mongodb";
import { AccountTree } from "@mui/icons-material";

export namespace serverAccountDataService {
    const collectionName = "account";

    const getCollection = async () => (await serverMongoDataService.getDb()).collection(collectionName);

    export const findAllAccounts = async (): Promise<Account[]> => serverMongoDataService.findAll<Account>(await getCollection());

    export const insertNewAccount = async (account: Account): Promise<InsertOneResult> => serverMongoDataService.insertOne<Account>(await getCollection(), account);

    export const deleteAccountById = async (id: ObjectId): Promise<DeleteResult> => serverMongoDataService.deleteById(await getCollection(), id);

    export const updtateAccount = async (account: Account): Promise<UpdateResult> => serverMongoDataService.updateOne<Account>(await getCollection(), account);   
}