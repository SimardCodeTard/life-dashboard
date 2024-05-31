import { Count } from "@/app/types/count.type";
import { serverMongoDataService } from "./mongod-data.server.service";
import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from "mongodb";

export namespace serverCountDataService {
    const collectionName = "account";

    const getCollection = async () => (await serverMongoDataService.getDb()).collection(collectionName);

    export const findCounts = async (): Promise<Count[]> => serverMongoDataService.findAll<Count>(await getCollection());

    export const insertNewCount = async (account: Count): Promise<InsertOneResult> => serverMongoDataService.insertOne<Count>(await getCollection(), account);

    export const deleteCountById = async (id: ObjectId): Promise<DeleteResult> => serverMongoDataService.deleteById(await getCollection(), id);

    export const updateCount = async (count: Count): Promise<UpdateResult> => serverMongoDataService.updateOne<Count>(await getCollection(), count);   
}