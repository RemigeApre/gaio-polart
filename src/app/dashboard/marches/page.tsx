import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { DashboardMarkets } from "@/components/DashboardMarkets";

export const metadata = {
  title: "Gestion des marchés",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function DashboardMarchesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");
  if (user.role !== "ADMIN" && user.role !== "DIRECTION") redirect("/dashboard");

  return <DashboardMarkets />;
}
