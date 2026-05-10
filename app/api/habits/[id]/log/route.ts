import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const log = await prisma.habitLog.upsert({
    where: { habitId_date: { habitId: id, date: new Date(body.date) } },
    update: { done: body.done },
    create: { habitId: id, date: new Date(body.date), done: body.done },
  });
  return NextResponse.json(log);
}
