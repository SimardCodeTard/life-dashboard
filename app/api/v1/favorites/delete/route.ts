import { serverFavoritesDataService } from "@/app/services/server/favorites-data.server.service";
import { getUrlParam, handleAPIError } from "@/app/utils/api.utils";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

/**
 * DELETE handler to remove a favorite item by its ID.
 * 
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<Response>} - A promise that resolves to a Response object.
 */
export const DELETE = async (req: NextRequest): Promise<Response> => {
    try {
        // Extract the 'id' parameter from the request URL
        const id = getUrlParam(req, 'id');
        
        // Convert the 'id' to an ObjectId and delete the favorite item
        await serverFavoritesDataService.deleteFavoriteItemById(new ObjectId(id));
        
        // Return a success response
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        // Handle any errors that occur during the deletion process
        return handleAPIError(error as Error);
    }
};