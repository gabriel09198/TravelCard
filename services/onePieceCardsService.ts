import type { OnePieceCard, OnePieceCardApiCard } from "@/types/onePieceCard";

const API_BASE_URL = "https://optcgapi.com";

const CARD_ENDPOINTS = [
  "/api/allSetCards/",
  "/api/allSTCards/",
  "/api/allDonCards/"
] as const;

const OPTIONAL_CARD_ENDPOINTS = ["/api/allPromoCards/"] as const;

function parseNullableNumber(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === "NULL") {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeText(value: string | null | undefined, fallback = ""): string {
  if (!value || value === "NULL") {
    return fallback;
  }

  return value;
}

function normalizeCard(card: OnePieceCardApiCard): OnePieceCard {
  const fallbackCode = `${normalizeText(card.set_id, "unknown")}-${normalizeText(card.card_name, "card")}`;
  const code = normalizeText(card.card_set_id, normalizeText(card.card_image_id, fallbackCode));

  return {
    id: `${normalizeText(card.set_id, "unknown")}-${code}`,
    name: normalizeText(card.card_name, "Carta sem nome"),
    code,
    type: normalizeText(card.card_type, "Tipo desconhecido"),
    color: normalizeText(card.card_color, "Sem cor"),
    cost: parseNullableNumber(card.card_cost),
    power: parseNullableNumber(card.card_power),
    rarity: normalizeText(card.rarity, "N/A"),
    effect: normalizeText(card.card_text, "Sem texto cadastrado para esta carta."),
    imageUrl: normalizeText(card.card_image) || null,
    setName: normalizeText(card.set_name, "Set desconhecido"),
    setId: normalizeText(card.set_id, "N/A"),
    subTypes: normalizeText(card.sub_types)
      .split(" ")
      .map((subType) => subType.trim())
      .filter(Boolean),
    counter: card.counter_amount ?? null,
    attribute: normalizeText(card.attribute) || null,
    marketPrice: card.market_price ?? null
  };
}

async function fetchCardEndpoint(
  endpoint: (typeof CARD_ENDPOINTS)[number] | (typeof OPTIONAL_CARD_ENDPOINTS)[number]
): Promise<OnePieceCard[]> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    signal: AbortSignal.timeout(12000),
    next: { revalidate: 60 * 60 * 12 }
  });

  if (!response.ok) {
    throw new Error(`Erro ao buscar cartas do One Piece TCG em ${endpoint}`);
  }

  const data = (await response.json()) as OnePieceCardApiCard[];
  return data.map(normalizeCard);
}

export async function getOnePieceCards(): Promise<OnePieceCard[]> {
  try {
    const requiredResults = await Promise.all(CARD_ENDPOINTS.map(fetchCardEndpoint));
    const optionalResults = await Promise.allSettled(OPTIONAL_CARD_ENDPOINTS.map(fetchCardEndpoint));
    const optionalCards = optionalResults.flatMap((result) =>
      result.status === "fulfilled" ? result.value : []
    );
    const cards = [...requiredResults.flat(), ...optionalCards];
    const uniqueCards = new Map<string, OnePieceCard>();

    for (const card of cards) {
      uniqueCards.set(card.code, card);
    }

    return Array.from(uniqueCards.values()).sort((a, b) => a.code.localeCompare(b.code));
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao buscar cartas do One Piece TCG");
  }
}

export async function searchOnePieceCards(query: string): Promise<OnePieceCard[]> {
  const normalizedQuery = query.trim().toLowerCase();
  const cards = await getOnePieceCards();

  if (!normalizedQuery) {
    return cards;
  }

  return cards.filter((card) => {
    return (
      card.name.toLowerCase().includes(normalizedQuery) ||
      card.code.toLowerCase().includes(normalizedQuery)
    );
  });
}
