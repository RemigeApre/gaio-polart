import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { DashboardAbsences } from "@/components/DashboardAbsences";

export const metadata = {
  title: "Gestion des absences",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function DashboardAbsencesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");
  if (user.role !== "ADMIN" && user.role !== "DIRECTION") redirect("/dashboard");

  return <DashboardAbsences />;
}
