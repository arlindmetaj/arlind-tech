import { NextRequest } from "next/server";
import { apiFetch, proxy } from "@/lib/api";

export async function GET() {
  return proxy(await apiFetch("/goals"));
}

export async function POST(req: NextRequest) {
  return proxy(await apiFetch("/goals", { method: "POST", body: await req.text() }));
}
