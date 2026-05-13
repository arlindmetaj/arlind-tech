import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "session";
const secret = () => new TextEncoder().encode(process.env.AUTH_SECRET || "fallback-secret-32-chars-minimum!");

export async function createSession(): Promise<string> {
  const token = await new SignJWT({ loggedIn: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret());
  return token;
}

export async function verifySession(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, secret());
    return true;
  } catch {
    return false;
  }
}

export async function getSessionFromCookies(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return false;
    return verifySession(token);
  } catch {
    return false;
  }
}

export { COOKIE_NAME };
