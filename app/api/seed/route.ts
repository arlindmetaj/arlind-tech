import { apiFetch, proxy } from "@/lib/api";

export async function POST() {
  return proxy(await apiFetch("/seed", { method: "POST" }));
}
