import { NextRequest } from "next/server";
import { apiFetch, proxy } from "@/lib/api";

export async function GET(req: NextRequest) {
  const date = new URL(req.url).searchParams.get("date");
  return proxy(await apiFetch(`/notes${date ? `?date=${date}` : ""}`));
}

export async function POST(req: NextRequest) {
  return proxy(await apiFetch("/notes", { method: "POST", body: await req.text() }));
}
