import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const todos = await prisma.todo.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  return NextResponse.json(todos);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const count = await prisma.todo.count();
  const todo = await prisma.todo.create({
    data: { title: body.title, order: count },
  });
  return NextResponse.json(todo, { status: 201 });
}
