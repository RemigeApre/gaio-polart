import { NextResponse } from "next/server";
import { getCurrentUser, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET : lister les utilisateurs
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: { id: true, username: true, name: true, role: true, active: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ users });
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

// POST : créer un utilisateur
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
    }

    const { username, name, password, role } = await request.json();

    if (!username || !name || !password) {
      return NextResponse.json({ error: "Identifiant, nom et mot de passe requis." }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { username: username.toLowerCase().trim() } });
    if (existing) {
      return NextResponse.json({ error: "Cet identifiant existe déjà." }, { status: 400 });
    }

    const hashed = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        username: username.toLowerCase().trim(),
        name,
        password: hashed,
        role: role || "VIEWER",
      },
      select: { id: true, username: true, name: true, role: true, active: true },
    });

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
