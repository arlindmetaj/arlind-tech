import { NextRequest } from "next/server";
import { apiFetch, proxy } from "@/lib/api";

export async function GET() {
  return proxy(await apiFetch("/todos"));
}

export async function POST(req: NextRequest) {
  return proxy(await apiFetch("/todos", { method: "POST", body: await req.text() }));
}
