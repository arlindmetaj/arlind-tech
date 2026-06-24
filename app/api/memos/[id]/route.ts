import { NextRequest } from "next/server";
import { apiFetch, proxy } from "@/lib/api";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxy(await apiFetch(`/memos/${id}`, { method: "PATCH", body: await req.text() }));
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxy(await apiFetch(`/memos/${id}`, { method: "DELETE" }));
}
