import TopNav from "./TopNav";
import { getSessionFromCookies } from "@/lib/auth";

export default async function PublicShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const loggedIn = await getSessionFromCookies();

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <TopNav loggedIn={loggedIn} />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16 overflow-x-clip">
        {children}
      </main>
    </div>
  );
}
