import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const chunks = [];
    for await (const chunk of req.body as any) {
      chunks.push(chunk);
    }

    const data = Buffer.concat(chunks).toString();
    const newItem = JSON.parse(data); 

    console.log(newItem);
    return NextResponse.json({sucess: true});
}