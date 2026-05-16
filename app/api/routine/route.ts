import { NextRequest } from "next/server";
import { apiFetch, proxy } from "@/lib/api";

export async function GET(req: NextRequest) {
  const day = new URL(req.url).searchParams.get("day");
  return proxy(await apiFetch(`/routine${day ? `?day=${day}` : ""}`));
}

export async function POST(req: NextRequest) {
  return proxy(await apiFetch("/routine", { method: "POST", body: await req.text() }));
}
