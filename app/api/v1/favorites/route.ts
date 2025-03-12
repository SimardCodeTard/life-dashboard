import { serverFavoritesDataService } from "@/app/services/server/favorites-data.server.service";
import { handleAPIError } from "@/app/utils/api.utils";

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
export const GET = async (): Promise<Response> => {
    try {
        const favorites = await serverFavoritesDataService.findAllFavorites();
        return new Response(JSON.stringify(favorites), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return handleAPIError(error as Error);
    }
};