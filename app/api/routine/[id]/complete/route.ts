import { NextRequest } from "next/server";
import { apiFetch, proxy } from "@/lib/api";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxy(await apiFetch(`/routine/${id}/complete`, { method: "POST", body: await req.text() }));
}
