import { FavoritesDataServerService } from "@/app/services/server/favorites-data.server.service";
import { handleAPIError } from "@/app/utils/api.utils";

export const dynamic = 'force-dynamic'
export const GET = (): Promise<Response> => FavoritesDataServerService.findAllFavorites().then(Response.json).catch(handleAPIError);