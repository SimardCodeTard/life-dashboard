import { serverFavoritesDataService } from "@/app/services/server/favorites-data.server.service";
import { FavoritesNewRequestBodyType, FavoritesNewResponseType } from "@/app/types/api.type";
import { FavoriteItemType } from "@/app/types/favorites.type";
import { handleAPIError, parseBody } from "@/app/utils/api.utils";

/**
 * Handles the POST request to add a new favorite item.
 * 
 * @param req - The incoming Next.js request object
 * @returns A promise that resolves to a Next.js response object
 */

const postHandler = async (req: Request): Promise<FavoritesNewResponseType> => {
  // Parse the request body to get the favorite item data
  const favoriteItem: FavoriteItemType = await parseBody<FavoritesNewRequestBodyType>(req);
      
  // Insert the new favorite item into the database
  return serverFavoritesDataService.insertNewFavoriteItem(favoriteItem);
}

export const POST = async (req: Request): Promise<Response> => {
  try {
    return Response.json(await postHandler(req));
  } catch (err) {
    return handleAPIError(err);
  }
}
