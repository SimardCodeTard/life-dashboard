import { serverFavoritesDataService } from "@/app/services/server/favorites-data.server.service";
import { FavoritesDeleteResponseType } from "@/app/types/api.type";
import { getUrlParam, handleAPIError } from "@/app/utils/api.utils";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

/**
 * DELETE handler to remove a favorite item by its ID.
 * 
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<Response>} - A promise that resolves to a Response object.
 */

const deleteHandler = async (req: NextRequest): Promise<FavoritesDeleteResponseType> => {
    // Extract the 'id' parameter from the request URL
    const id = getUrlParam(req, 'id');
            
    // Convert the 'id' to an ObjectId and delete the favorite item
    return serverFavoritesDataService.deleteFavoriteItemById(new ObjectId(id));
}

export const DELETE = async (req: NextRequest): Promise<Response> => Response.json(await deleteHandler(req).catch(handleAPIError));
