import { FavoritesDataServerService } from "@/app/services/server/favorites-data.server.service";
import { FavoriteItemType } from "@/app/types/favorites.type";
import { parseBody } from "@/app/utils/api.utils";
import { NextRequest, NextResponse } from "next/server";

export const POST = (req: NextRequest): Promise<Response> => parseBody<FavoriteItemType>(req).then(FavoritesDataServerService.insertNewFavoriteItem).then(() => Response.json({success: true})).catch(NextResponse.json);