import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const books = await prisma.book.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json(books);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const book = await prisma.book.create({
    data: {
      title: body.title,
      author: body.author ?? "",
      status: body.status ?? "WANT",
      progress: body.progress ?? 0,
      finishedAt: body.finishedAt ? new Date(body.finishedAt) : null,
    },
  });
  return NextResponse.json(book, { status: 201 });
}
