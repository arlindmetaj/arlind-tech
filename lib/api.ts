import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL = process.env.API_URL || "http://localhost:4000";

/**
 * Authenticated fetch to the backend API.
 * Reads the session JWT from the httpOnly cookie and attaches it as a Bearer token.
 */
export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  const headers: Record<string, string> = {
    ...(init?.headers as Record<string, string> | undefined),
  };

  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (init?.body) headers["Content-Type"] = "application/json";

  return fetch(`${API_URL}${path}`, { ...init, headers });
}

/**
 * Forward a backend Response back through the Next.js route handler.
 */
export async function proxy(res: Response): Promise<NextResponse> {
  const text = await res.text();
  if (!text) return new NextResponse(null, { status: res.status });
  try {
    return NextResponse.json(JSON.parse(text), { status: res.status });
  } catch {
    return new NextResponse(text, { status: res.status });
  }
}
