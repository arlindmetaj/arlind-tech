import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const habits = await prisma.habit.findMany({
    include: { logs: true },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(habits);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const habit = await prisma.habit.create({
    data: { name: body.name },
    include: { logs: true },
  });
  return NextResponse.json(habit, { status: 201 });
}
