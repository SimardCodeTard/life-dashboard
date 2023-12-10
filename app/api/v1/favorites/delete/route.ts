import { FavoritesDataServerService } from "@/app/services/server/favorites-data.server.service";
import { getUrlParam, handleAPIError } from "@/app/utils/api.utils";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

export const DELETE = (req: NextRequest): Promise<Response> => FavoritesDataServerService.deleteFavoriteItemById(new ObjectId(getUrlParam(req, 'id'))).then(() => Response.json({success: true})).catch(handleAPIError);