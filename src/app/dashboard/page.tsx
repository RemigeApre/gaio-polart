import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { DashboardHome } from "@/components/DashboardHome";

export const metadata = {
  title: "Dashboard",
  description: "Tableau de bord Gaio Polart.",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");

  return <DashboardHome user={user} />;
}
