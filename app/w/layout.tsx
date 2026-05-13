import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth";
import Shell from "@/components/Shell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const loggedIn = await getSessionFromCookies();
  if (!loggedIn) {
    redirect("/?signin=");
  }
  return <Shell loggedIn={true}>{children}</Shell>;
}
