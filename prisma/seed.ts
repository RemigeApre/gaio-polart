import { PrismaClient, DayOfWeek, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const markets = [
  {
    id: "gagny-samedi",
    name: "Marché de Gagny",
    city: "Gagny",
    address: "Gagny, Seine-Saint-Denis",
    dayOfWeek: DayOfWeek.SATURDAY,
    startTime: "07:30",
    endTime: "13:00",
  },
  {
    id: "chelles-mardi",
    name: "Marché de Chelles",
    city: "Chelles",
    address: "Chelles, Seine-et-Marne",
    dayOfWeek: DayOfWeek.TUESDAY,
    startTime: "07:30",
    endTime: "13:00",
  },
  {
    id: "chelles-jeudi",
    name: "Marché de Chelles",
    city: "Chelles",
    address: "Chelles, Seine-et-Marne",
    dayOfWeek: DayOfWeek.THURSDAY,
    startTime: "07:30",
    endTime: "13:00",
  },
  {
    id: "chelles-dimanche",
    name: "Marché de Chelles",
    city: "Chelles",
    address: "Chelles, Seine-et-Marne",
    dayOfWeek: DayOfWeek.SUNDAY,
    startTime: "07:30",
    endTime: "13:00",
  },
  {
    id: "meaux-samedi",
    name: "Marché de Meaux",
    city: "Meaux",
    address: "Meaux, Seine-et-Marne",
    dayOfWeek: DayOfWeek.SATURDAY,
    startTime: "07:30",
    endTime: "13:00",
  },
  {
    id: "villeparisis-vendredi",
    name: "Marché de Villeparisis",
    city: "Villeparisis",
    address: "Villeparisis, Seine-et-Marne",
    dayOfWeek: DayOfWeek.FRIDAY,
    startTime: "07:30",
    endTime: "13:00",
  },
  {
    id: "villeparisis-dimanche",
    name: "Marché de Villeparisis",
    city: "Villeparisis",
    address: "Villeparisis, Seine-et-Marne",
    dayOfWeek: DayOfWeek.SUNDAY,
    startTime: "07:30",
    endTime: "13:00",
  },
];

// Mot de passe temporaire pour tous les utilisateurs
// À CHANGER après le premier déploiement
const TEMP_PASSWORD = "GaioPolart2026!";

const users = [
  {
    id: "user-lucas",
    username: "lucas",
    name: "Lucas",
    role: Role.ADMIN,
  },
  {
    id: "user-paulo",
    username: "paulo",
    name: "Paulo",
    role: Role.DIRECTION,
  },
  {
    id: "user-nathalie",
    username: "nathalie",
    name: "Nathalie",
    role: Role.DIRECTION,
  },
];

async function main() {
  console.log("Seeding database...");

  // Marchés
  for (const market of markets) {
    await prisma.market.upsert({
      where: { id: market.id },
      update: market,
      create: market,
    });
    console.log(`  ✓ ${market.name} (${market.dayOfWeek})`);
  }

  // Utilisateurs
  const hashedPassword = await bcrypt.hash(TEMP_PASSWORD, 12);

  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        username: user.username,
        name: user.name,
        role: user.role,
      },
      create: {
        ...user,
        password: hashedPassword,
      },
    });
    console.log(`  ✓ Utilisateur ${user.name} (${user.role})`);
  }

  console.log("");
  console.log(`  Mot de passe temporaire : ${TEMP_PASSWORD}`);
  console.log("  ⚠ Changez les mots de passe après le premier déploiement !");
  console.log("");
  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
