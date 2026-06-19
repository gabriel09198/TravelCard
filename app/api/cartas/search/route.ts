import { NextResponse } from "next/server";

import { searchOnePieceCards } from "@/services/onePieceCardsService";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";

  if (!query.trim()) {
    return NextResponse.json([]);
  }

  try {
    const cards = await searchOnePieceCards(query);
    return NextResponse.json(cards.slice(0, 24));
  } catch {
    return NextResponse.json(
      { message: "Nao foi possivel buscar cartas agora." },
      { status: 500 }
    );
  }
}
