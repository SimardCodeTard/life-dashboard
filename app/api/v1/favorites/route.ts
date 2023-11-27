import { FavoritesDataServerService } from "@/app/services/server/favorites-data.server.service";
import { FavoriteItemType } from "@/app/types/favorites.type";
import { isArray } from "util";

export async function GET() {
    let favorites: FavoriteItemType[];
    try {
        favorites = await FavoritesDataServerService.findAllFavorites();
        return Response.json({success: true, favorites});
    } catch (e: any) {
        console.error(e);
        return Response.json({success: false});
    }
}