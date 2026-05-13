import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";

export async function GET() {
  const loggedIn = await getSessionFromCookies();
  return NextResponse.json({ loggedIn });
}
