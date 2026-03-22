import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET : lister tous les marchés
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "DIRECTION")) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
    }

    const markets = await prisma.market.findMany({
      orderBy: [{ city: "asc" }, { dayOfWeek: "asc" }],
    });

    return NextResponse.json({ markets });
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

// POST : créer un marché
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "DIRECTION")) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
    }

    const body = await request.json();
    const { name, city, address, dayOfWeek, startTime, endTime } = body;

    if (!name || !city || !address || !dayOfWeek || !startTime || !endTime) {
      return NextResponse.json({ error: "Tous les champs sont requis." }, { status: 400 });
    }

    const market = await prisma.market.create({
      data: { name, city, address, dayOfWeek, startTime, endTime },
    });

    return NextResponse.json({ market }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
