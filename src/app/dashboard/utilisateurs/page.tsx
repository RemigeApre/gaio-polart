import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { DashboardUsers } from "@/components/DashboardUsers";

export const metadata = {
  title: "Gestion des utilisateurs",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function DashboardUsersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");
  if (user.role !== "ADMIN") redirect("/dashboard");

  return <DashboardUsers currentUserId={user.id} />;
}
