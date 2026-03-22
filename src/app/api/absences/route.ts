import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET : lister les absences à venir
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "DIRECTION")) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const absences = await prisma.absence.findMany({
      where: { date: { gte: today } },
      include: { market: { select: { id: true, name: true, city: true, dayOfWeek: true } } },
      orderBy: { date: "asc" },
    });

    return NextResponse.json({ absences });
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

// POST : créer des absences
// Body : { marketIds: string[], dates: string[], reason?: string }
// Si marketIds est vide → tous les marchés des jours concernés
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "DIRECTION")) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
    }

    const body = await request.json();
    const { marketIds, dates, reason } = body as { marketIds?: string[]; dates: string[]; reason?: string };

    if (!dates || dates.length === 0) {
      return NextResponse.json({ error: "Au moins une date est requise." }, { status: 400 });
    }

    // Récupérer les marchés concernés
    let marketsToAbsent;

    if (marketIds && marketIds.length > 0) {
      // Absences spécifiques
      marketsToAbsent = await prisma.market.findMany({
        where: { id: { in: marketIds }, active: true },
      });
    } else {
      // Absences globales : tous les marchés actifs
      marketsToAbsent = await prisma.market.findMany({
        where: { active: true },
      });
    }

    // Mapper les jours JS aux enums
    const JS_DAY_TO_ENUM = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

    let created = 0;

    for (const dateStr of dates) {
      const date = new Date(dateStr + "T00:00:00Z");
      const dayEnum = JS_DAY_TO_ENUM[date.getUTCDay()];

      // Filtrer les marchés qui sont sur ce jour
      const matchingMarkets = marketsToAbsent.filter((m) => m.dayOfWeek === dayEnum);

      for (const market of matchingMarkets) {
        try {
          await prisma.absence.create({
            data: { date, reason: reason || null, marketId: market.id },
          });
          created++;
        } catch {
          // Ignore les doublons (contrainte unique)
        }
      }
    }

    return NextResponse.json({ created }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

// DELETE : supprimer une ou plusieurs absences
// Body : { id: string } ou { ids: string[] }
export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "DIRECTION")) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
    }

    const body = await request.json();

    if (body.ids && Array.isArray(body.ids)) {
      await prisma.absence.deleteMany({ where: { id: { in: body.ids } } });
    } else if (body.id) {
      await prisma.absence.delete({ where: { id: body.id } });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
