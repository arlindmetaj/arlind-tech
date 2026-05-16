import { NextRequest } from "next/server";
import { apiFetch, proxy } from "@/lib/api";

export async function GET() {
  return proxy(await apiFetch("/bookmarks"));
}

export async function POST(req: NextRequest) {
  return proxy(await apiFetch("/bookmarks", { method: "POST", body: await req.text() }));
}
