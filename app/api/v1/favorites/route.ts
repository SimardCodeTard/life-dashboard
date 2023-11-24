import { FavoritesDataServerService } from "@/app/services/server/favorites-data.service";

export function GET() {
    return FavoritesDataServerService.findAllFavorites();
}p