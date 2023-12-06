import { FavoritesDataServerService } from "@/app/services/server/favorites-data.server.service";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

export async function DELETE(req: NextRequest) {
    const favoriteItemId = req.url.split('?')[1].split('=')[1];
    const res = favoriteItemId ? await FavoritesDataServerService.deleteFavoriteItemById(new ObjectId(favoriteItemId)) : null;
    return res !== null && res.acknowledged ? Response.json({success: true}) : Response.json({success: false});
}