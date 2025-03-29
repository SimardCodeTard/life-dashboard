import { Collection, InsertOneResult, ObjectId, UpdateResult } from "mongodb";
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
    const MOMS_NAME = process.env.MOMS_NAME;

    const encrypt = async (value: string): Promise<string> => bcrypt.hash(value, await bcrypt.genSalt(SALT_ROUND_COUNT));

    /**
     * Find a user by their id
     * @param _id - The id of the user
     * @return The user
     */

    export const findUserById = async (userId: ObjectId): Promise<UserTypeServer | null> => {
        return serverMongoDataService.findById(collectionName, userId);
    }

    /**
     * Find a user by their email address
     * @param mail - The email address of the wanted user
     * @returns The user
     */
    export const findUserByMail = async (mail: string): Promise<UserTypeServer | null> => {
        return serverMongoDataService.findOne<UserTypeServer>(collectionName, {mail: mail})
    }

    /**
     * Save a new user in the database
     * @param user - The new user to save
     * @returns - The result of the insert one operation
     */
    export const saveUser = async (user: UserTypeServer): Promise<InsertOneResult> => {
        if(!user?.firstName || !user?.lastName || !user?.mail || !user?.password) {
            throw new APIBadRequestError('Missing or invalid data');
        }

        if(user.mail.toLowerCase() === process.env.MOMS_MAIL) {
            user.isMom = true;
        } else if (user.mail.toLowerCase() === process.env.DADS_MAIL) {
            user.isDad = true
        } else if (user.mail.toLowerCase() === process.env.SISTERS_MAIL) {
            user.isSister = true;
        } else if (user.mail.toLowerCase() === process.env.MY_MAIL) {
            user.isMe = true;
        } else if (user.mail.toLocaleLowerCase() === process.env.SASHAS_MAIL) {
            user.isSasha = true;
        } else if (user.mail.toLocaleLowerCase() === process.env.CLEMENTS_MAIL) {
            user.isClement = true;
        } else if (user.mail.toLocaleLowerCase() === process.env.ALIZEES_MAIL) {
            user.isAlizee = true;
        } else if (user.mail.toLocaleLowerCase() === process.env.HIPPOLYTES_MAIL) {
            user.isHippolyte = true;
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

        return serverMongoDataService.insertOne(collectionName, {...user, mail: user.mail.toLowerCase()});
    }

    export const updateUser = async (user: UserTypeServer): Promise<UpdateResult<UserTypeServer> | null> => {
        return await serverMongoDataService.updateOne('user', user);
    }

    export const mapServerUserToClientUser = (user: UserTypeServer): UserTypeClient => ({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        mail: user.mail,
        role: user.role,
        isMom: user.isMom,
        isDad: user.isDad,
        isSister: user.isSister,
        isMe: user.isMe,
        isSasha: user.isSasha,
        isClement: user.isClement,
        isAlizee: user.isAlizee,
        isHippolyte: user.isHippolyte
    });
}