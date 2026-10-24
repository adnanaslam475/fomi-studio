import { buildHistory } from "@/data/history";

// GET /api/history — the user's recent generations (most recent first).
export async function GET() {
  const history = buildHistory();
  return Response.json({ items: history });
}
