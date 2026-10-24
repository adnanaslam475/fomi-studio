import { CATALOG } from "@/data/catalog";

// GET /api/catalog — models, styles, aspect ratios and defaults for the workspace.
export async function GET() {
  return Response.json(CATALOG);
}
