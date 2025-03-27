import { serverFavoritesDataService } from "@/app/services/server/favorites-data.server.service";
import { FavoritesUpdateRequestBodyType, FavoritesUpdateResponseType } from "@/app/types/api.type";
import { FavoriteItemType } from "@/app/types/favorites.type";
import { handleAPIError, parseBody } from "@/app/utils/api.utils";

/**
 * Handles the POST request to update favorite items.
 * 
 * @param req - The incoming request object
 * @returns A promise that resolves to a response object
 */

const putHandler = async (req: Request): Promise<FavoritesUpdateResponseType> => {
  // Parse the request body to get the favorite item data
  const favoriteItem: FavoriteItemType = await parseBody<FavoritesUpdateRequestBodyType>(req);
      
  // Insert the new favorite item into the database
  return serverFavoritesDataService.updateFavorite(favoriteItem);
}

export const PUT = async (req: Request): Promise<Response> => {
  try {
    return Response.json(await putHandler(req));
  } catch (err) {
    return handleAPIError(err);
  }
}
