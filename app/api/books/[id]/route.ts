import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const data: Record<string, unknown> = { ...body };
  if (body.finishedAt) data.finishedAt = new Date(body.finishedAt);
  const book = await prisma.book.update({ where: { id }, data });
  return NextResponse.json(book);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.book.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
