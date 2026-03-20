import { PrismaClient, DayOfWeek } from "@prisma/client";

const prisma = new PrismaClient();

const markets = [
  // Gagny - samedi
  {
    id: "gagny-samedi",
    name: "Marché de Gagny",
    city: "Gagny",
    address: "Gagny, Seine-Saint-Denis",
    dayOfWeek: DayOfWeek.SATURDAY,
    startTime: "07:30",
    endTime: "13:00",
  },
  // Chelles - mardi
  {
    id: "chelles-mardi",
    name: "Marché de Chelles",
    city: "Chelles",
    address: "Chelles, Seine-et-Marne",
    dayOfWeek: DayOfWeek.TUESDAY,
    startTime: "07:30",
    endTime: "13:00",
  },
  // Chelles - jeudi
  {
    id: "chelles-jeudi",
    name: "Marché de Chelles",
    city: "Chelles",
    address: "Chelles, Seine-et-Marne",
    dayOfWeek: DayOfWeek.THURSDAY,
    startTime: "07:30",
    endTime: "13:00",
  },
  // Chelles - dimanche
  {
    id: "chelles-dimanche",
    name: "Marché de Chelles",
    city: "Chelles",
    address: "Chelles, Seine-et-Marne",
    dayOfWeek: DayOfWeek.SUNDAY,
    startTime: "07:30",
    endTime: "13:00",
  },
  // Meaux - samedi
  {
    id: "meaux-samedi",
    name: "Marché de Meaux",
    city: "Meaux",
    address: "Meaux, Seine-et-Marne",
    dayOfWeek: DayOfWeek.SATURDAY,
    startTime: "07:30",
    endTime: "13:00",
  },
  // Villeparisis - vendredi
  {
    id: "villeparisis-vendredi",
    name: "Marché de Villeparisis",
    city: "Villeparisis",
    address: "Villeparisis, Seine-et-Marne",
    dayOfWeek: DayOfWeek.FRIDAY,
    startTime: "07:30",
    endTime: "13:00",
  },
  // Villeparisis - dimanche
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

async function main() {
  console.log("Seeding database...");

  for (const market of markets) {
    await prisma.market.upsert({
      where: { id: market.id },
      update: market,
      create: market,
    });
    console.log(`  ✓ ${market.name} (${market.dayOfWeek})`);
  }

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
