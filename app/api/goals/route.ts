import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const goals = await prisma.goal.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  return NextResponse.json(goals);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const count = await prisma.goal.count();
  const goal = await prisma.goal.create({
    data: { title: body.title, progress: body.progress ?? 0, note: body.note ?? "", order: count },
  });
  return NextResponse.json(goal, { status: 201 });
}
