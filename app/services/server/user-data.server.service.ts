import { Collection, InsertOneResult, ObjectId } from "mongodb";
import { serverMongoDataService } from "./mongod-data.server.service";
import { UserTypeClient, UserTypeServer } from "@/app/types/user.type";
import { APIBadRequestError, APIConflictError, APIInternalServerError } from "@/app/errors/api.error";
import { Logger } from "../logger.service";
import bcrypt from 'bcryptjs';

export namespace serverUserDataService {

    const collectionName = 'users';

    if(!process.env.BCRYPT_SALT_ROUNDS || isNaN(Number(process.env.BCRYPT_SALT_ROUNDS))) {
        throw new APIInternalServerError('Server configuration error: Required environment variables are undefined (BCRYPT_SALT_ROUNDS)');
    }

    const SALT_ROUND_COUNT = Number(process.env.BCRYPT_SALT_ROUNDS);

    const encrypt = async (value: string): Promise<string> => bcrypt.hash(value, await bcrypt.genSalt(SALT_ROUND_COUNT));

    const getCollection = async (): Promise<Collection> => {
        const db = await serverMongoDataService.getDb();
        return db.collection(collectionName);
    }

    /**
     * Find a user by their id
     * @param _id - The id of the user
     * @return The user
     */

    export const findUserById = async (userId: ObjectId): Promise<UserTypeServer | null> => {
        const collection = await getCollection();
        return serverMongoDataService.findById(collection, userId);
    }

    /**
     * Find a user by their email address
     * @param mail - The email address of the wanted user
     * @returns The user
     */
    export const findUserByMail = async (mail: string): Promise<UserTypeServer | null> => {
        const collection = await getCollection();
        return serverMongoDataService.findOne<UserTypeServer>(collection, {mail: mail})
    }

    /**
     * Save a new user in the database
     * @param user - The new user to save
     * @returns - The result of the insert one operation
     */
    export const saveUser = async (user: UserTypeServer): Promise<InsertOneResult> => {
        let collection = await getCollection();

        if(!user?.firstName || !user?.lastName || !user?.mail || !user?.password) {
            throw new APIBadRequestError('Missing or invalid data');
        }

        user.role = 'user';

        // Check that mail is unique, TODO: configure db to perform this check automatically
        const foundUser = await findUserByMail(user.mail.toLowerCase()) !== null;

        if(foundUser) {
            Logger.debug(`A user already uses the email address: ${user.mail}`)
            throw new APIConflictError('Email address already exists')
        }

        // Encrypt password
        user.password = await encrypt(user.password);

        collection = await getCollection();
        return serverMongoDataService.insertOne(collection, {...user, mail: user.mail.toLowerCase()});
    }

    export const mapServerUserToClientUser = (user: UserTypeServer): UserTypeClient => ({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        mail: user.mail,
        role: user.role
    });
}