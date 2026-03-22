import { NextResponse } from "next/server";
import { getCurrentUser, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PUT : modifier un utilisateur
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, username, role, active, password } = body;

    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = name;
    if (username !== undefined) data.username = username.toLowerCase().trim();
    if (role !== undefined) data.role = role;
    if (active !== undefined) data.active = active;
    if (password) data.password = await hashPassword(password);

    const updated = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, username: true, name: true, role: true, active: true },
    });

    return NextResponse.json({ user: updated });
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

// DELETE : supprimer un utilisateur
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
    }

    const { id } = await params;

    // Empêcher de se supprimer soi-même
    if (id === user.id) {
      return NextResponse.json({ error: "Vous ne pouvez pas supprimer votre propre compte." }, { status: 400 });
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
