import { FavoritesDataServerService } from "@/app/services/server/favorites-data.server.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const chunks = [];
    for await (const chunk of req.body as any) {
      chunks.push(chunk);
    }

    const data = Buffer.concat(chunks).toString();
    const item = JSON.parse(data); 

    const res = item ? await FavoritesDataServerService.updateFavorite(item) : null;

    return res !== null && res.acknowledged ? Response.json({success: true}) : Response.json({success: false});
}