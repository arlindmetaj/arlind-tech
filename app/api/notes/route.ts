import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  const notes = await prisma.note.findMany({
    where: date ? { date: new Date(date) } : undefined,
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(notes);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const note = await prisma.note.create({
    data: {
      content: body.content,
      date: new Date(body.date),
    },
  });
  return NextResponse.json(note, { status: 201 });
}
