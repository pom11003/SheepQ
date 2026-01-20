import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // いったん「受け取れた」ことを返す（環境は触らない）
        return NextResponse.json({ ok: true, received: body }, { status: 200 });
    } catch {
        return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
    }
}
