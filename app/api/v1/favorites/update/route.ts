import { serverFavoritesDataService } from "@/app/services/server/favorites-data.server.service";
import { FavoriteItemType } from "@/app/types/favorites.type";
import { handleAPIError, parseBody } from "@/app/utils/api.utils";
import { NextRequest, NextResponse } from "next/server";

export const POST = (req: NextRequest): Promise<Response> => 
  parseBody<FavoriteItemType>(req)
    .then(serverFavoritesDataService.insertNewFavoriteItem)
    .then(() => NextResponse.json({success: true}))
  .catch(handleAPIError);