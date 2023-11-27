import { FavoritesDataServerService } from "@/app/services/server/favorites-data.server.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const chunks = [];
    for await (const chunk of req.body as any) {
      chunks.push(chunk);
    }

    const data = Buffer.concat(chunks).toString();
    const newItem = JSON.parse(data); 

    const res = newItem ? await FavoritesDataServerService.insertNewFavoriteItem(newItem) : null;

    return res !== null && res.acknowledged ? Response.json({success: true}) : Response.json({success: false});
}