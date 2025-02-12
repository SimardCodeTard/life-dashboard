import { serverFavoritesDataService } from "@/app/services/server/favorites-data.server.service";
import { FavoriteItemType } from "@/app/types/favorites.type";
import { handleAPIError, parseBody } from "@/app/utils/api.utils";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles the POST request to add a new favorite item.
 * 
 * @param req - The incoming Next.js request object
 * @returns A promise that resolves to a Next.js response object
 */
export const POST = async (req: NextRequest): Promise<Response> => {
  try {
    // Parse the request body to get the favorite item data
    const favoriteItem: FavoriteItemType = await parseBody<FavoriteItemType>(req);
    
    // Insert the new favorite item into the database
    await serverFavoritesDataService.insertNewFavoriteItem(favoriteItem);
    
    // Return a success response
    return NextResponse.json({ success: true });
  } catch (error) {
    // Handle any errors that occur during the process
    return handleAPIError(error as Error);
  }
};