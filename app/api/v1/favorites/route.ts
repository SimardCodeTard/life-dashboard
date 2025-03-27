import { APIBadRequestError } from "@/app/errors/api.error";
import { serverFavoritesDataService } from "@/app/services/server/favorites-data.server.service";
import { FavoritesResponseType } from "@/app/types/api.type";
import { handleAPIError } from "@/app/utils/api.utils";
import { NextRequest } from "next/server";

/**
 * This file defines the API route for fetching all favorite items.
 * The route is dynamic and forces revalidation on each request.
 */

export const dynamic = 'force-dynamic';

/**
 * GET handler for fetching all favorite items.
 * 
 * @returns {Promise<Response>} A promise that resolves to a Response object containing the favorite items in JSON format.
 */

const getHandler = (req: NextRequest): Promise<FavoritesResponseType> => {
    const userId = req.nextUrl.searchParams.get('userId');

    if(userId === null) {
        throw new APIBadRequestError('Missing required query parameters.');
    }

    return serverFavoritesDataService.findAllFavorites(userId);
}

export const GET = async (req: NextRequest): Promise<Response> => Response.json(await getHandler(req).catch(handleAPIError));
